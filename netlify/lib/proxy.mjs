import { toPublicAnswer } from "../../lib/public-answer.mjs";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

function env(name) {
  return (
    globalThis.Netlify?.env?.get?.(name) ??
    globalThis.process?.env?.[name] ??
    ""
  ).trim();
}

function config() {
  const apiBase = (
    env("PRAMANA_API_BASE_URL") ||
    "https://mahaperiyava-api-production.up.railway.app"
  ).replace(/\/$/, "");
  const proxyToken =
    env("PRAMANA_PROXY_TOKEN") || env("PRAMANA_BACKEND_TOKEN");
  const timeoutMs = Number(env("PRAMANA_REQUEST_TIMEOUT_MS") || 120000);

  return { apiBase, proxyToken, timeoutMs };
}

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

async function readJson(request) {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 24 * 1024) {
    const error = new Error("Request body too large.");
    error.status = 413;
    throw error;
  }
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("Invalid JSON.");
    error.status = 400;
    throw error;
  }
}

async function callPramana(path, options = {}) {
  const { apiBase, proxyToken, timeoutMs } = config();
  if (!apiBase.startsWith("https://") || !proxyToken) {
    const error = new Error("The evidence service is not configured.");
    error.status = 503;
    throw error;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(new URL(path, apiBase), {
      ...options,
      headers: {
        accept: "application/json",
        ...(options.body ? { "content-type": "application/json" } : {}),
        "x-pramana-proxy-token": proxyToken,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function upstreamMessage(status, packet) {
  if (status === 504) {
    return "The evidence lookup took longer than expected. Please try again.";
  }
  if (status === 503) {
    return "The evidence service is restarting safely. Please try again shortly.";
  }
  return (
    packet?.detail?.message ||
    packet?.error?.message ||
    "The evidence service could not complete this request."
  );
}

export async function answer(request) {
  if (request.method !== "POST") {
    return json(405, { error: "POST required." }, { allow: "POST" });
  }

  try {
    const body = await readJson(request);
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!question || question.length > 2000) {
      return json(422, {
        error: "Please enter a question between 1 and 2,000 characters.",
      });
    }

    const upstream = await callPramana("/v1/mahaperiyava/answer", {
      method: "POST",
      body: JSON.stringify({ query: question, top_k: 8 }),
    });
    const packet = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return json(upstream.status, {
        error: upstreamMessage(upstream.status, packet),
      });
    }

    return json(200, toPublicAnswer(packet));
  } catch (error) {
    const status =
      error?.status || (error?.name === "AbortError" ? 504 : 502);
    return json(status, {
      error:
        status === 504
          ? "The evidence lookup took longer than expected. Please try again."
          : error?.message || "The evidence service is temporarily unavailable.",
    });
  }
}

export async function feedback(request) {
  if (request.method !== "POST") {
    return json(405, { error: "POST required." }, { allow: "POST" });
  }

  try {
    const body = await readJson(request);
    if (
      typeof body.interactionId !== "string" ||
      !["up", "down"].includes(body.rating)
    ) {
      return json(422, { error: "Invalid feedback." });
    }

    const upstream = await callPramana("/v1/mahaperiyava/feedback", {
      method: "POST",
      body: JSON.stringify({
        interaction_id: body.interactionId,
        rating: body.rating,
        tags: [],
        comment: null,
      }),
    });

    if (!upstream.ok) {
      return json(upstream.status, { error: "Feedback could not be saved." });
    }

    return json(200, { status: "recorded" });
  } catch {
    return json(502, { error: "Feedback could not be saved." });
  }
}

export async function health() {
  const { apiBase, proxyToken, timeoutMs } = config();
  if (!apiBase.startsWith("https://") || !proxyToken) {
    return json(200, {
      status: "ok",
      product: "just-periyava",
      evidenceService: "not_configured",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, 10000));
  let evidenceService = "unknown";

  try {
    const upstream = await fetch(new URL("/v1/health", apiBase), {
      headers: { "x-pramana-proxy-token": proxyToken },
      signal: controller.signal,
    });
    evidenceService = upstream.ok ? "reachable" : "degraded";
  } catch {
    evidenceService = "unreachable";
  } finally {
    clearTimeout(timer);
  }

  return json(200, {
    status: "ok",
    product: "just-periyava",
    evidenceService,
  });
}

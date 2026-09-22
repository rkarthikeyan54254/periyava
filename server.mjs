import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toPublicAnswer } from "./lib/public-answer.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.join(here, "public");
const port = Number(process.env.PORT || 3000);
const apiBase = String(
  process.env.PRAMANA_API_BASE_URL ||
    "https://mahaperiyava-api-production.up.railway.app",
).replace(/\/$/, "");
const proxyToken = String(process.env.PRAMANA_PROXY_TOKEN || "").trim();
const timeoutMs = Number(process.env.PRAMANA_REQUEST_TIMEOUT_MS || 120000);
const maxBodyBytes = 24 * 1024;
const allowedFeedbackTags = new Set([
  "wrong evidence",
  "didn't answer",
  "unsupported conclusion",
  "hard to understand",
  "should have abstained",
]);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > maxBodyBytes) {
      const error = new Error("Request body too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON.");
    error.status = 400;
    throw error;
  }
}

async function callPramana(endpoint, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(proxyToken ? { "x-pramana-proxy-token": proxyToken } : {}),
    };

    return await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
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

async function answer(req, res) {
  const body = await readJson(req);
  const question = typeof body.question === "string" ? body.question.trim() : "";

  if (!question || question.length > 2000) {
    return json(res, 422, {
      error: "Please enter a question between 1 and 2,000 characters.",
    });
  }

  const upstream = await callPramana("/v1/mahaperiyava/answer", {
    method: "POST",
    body: JSON.stringify({ query: question, top_k: 8 }),
  });

  const packet = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return json(res, upstream.status, {
      error: upstreamMessage(upstream.status, packet),
    });
  }

  return json(res, 200, toPublicAnswer(packet));
}

async function feedback(req, res) {
  const body = await readJson(req);

  if (
    typeof body.interactionId !== "string" ||
    !["up", "down"].includes(body.rating)
  ) {
    return json(res, 422, { error: "Invalid feedback." });
  }

  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((tag) => typeof tag === "string" && allowedFeedbackTags.has(tag))
        .slice(0, 5)
    : [];
  const comment =
    typeof body.comment === "string" && body.comment.trim()
      ? body.comment.trim().slice(0, 1000)
      : null;

  const upstream = await callPramana("/v1/mahaperiyava/feedback", {
    method: "POST",
    body: JSON.stringify({
      interaction_id: body.interactionId,
      rating: body.rating,
      tags,
      comment,
    }),
  });

  if (!upstream.ok) {
    return json(res, upstream.status, {
      error: "Feedback could not be saved.",
    });
  }

  return json(res, 200, { status: "recorded" });
}

async function health(_req, res) {
  let evidenceService = "unknown";

  try {
    const upstream = await callPramana("/v1/health", { method: "GET" });
    evidenceService = upstream.ok ? "reachable" : "degraded";
  } catch {
    evidenceService = "unreachable";
  }

  return json(res, 200, {
    status: "ok",
    product: "just-periyava",
    evidenceService,
  });
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const target = clean === "/" ? "/index.html" : clean;
  const normalized = path.normalize(target).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.join(staticRoot, normalized);
  return full.startsWith(staticRoot) ? full : null;
}

async function staticFile(req, res) {
  const filePath = safePath(req.url || "/");
  if (!filePath) return json(res, 404, { error: "Not found." });

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);

    res.writeHead(200, {
      "content-type": mime[ext] || "application/octet-stream",
      "cache-control":
        ext === ".html" ? "no-cache" : "public, max-age=3600, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "content-security-policy":
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      "permissions-policy": "camera=(), geolocation=(), microphone=(self)",
    });

    if (req.method === "HEAD") return res.end();
    return res.end(data);
  } catch {
    return json(res, 404, { error: "Not found." });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      return await health(req, res);
    }

    if (req.method === "POST" && req.url === "/api/answer") {
      return await answer(req, res);
    }

    if (req.method === "POST" && req.url === "/api/feedback") {
      return await feedback(req, res);
    }

    if (req.method === "GET" || req.method === "HEAD") {
      return await staticFile(req, res);
    }

    return json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    const status =
      error?.status ||
      (error?.name === "AbortError" ? 504 : 500);

    return json(res, status, {
      error:
        status === 504
          ? "The evidence lookup took longer than expected. Please try again."
          : status < 500
            ? error.message
            : "Unexpected server error.",
    });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(
    JSON.stringify({
      event: "just_periyava_started",
      port,
      upstream: new URL(apiBase).host,
      proxyCredentialConfigured: Boolean(proxyToken),
    }),
  );
});

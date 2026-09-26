import { toPublicAnswer } from "../../lib/public-answer.mjs";

const ALLOWED_FEEDBACK_TAGS = new Set([
  "wrong evidence",
  "didn't answer",
  "unsupported conclusion",
  "hard to understand",
  "should have abstained",
]);

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

const EXPLICIT_ABUSE_PATTERNS = [
  /\b(?:fuck(?:ing|er)?|motherfucker|cunt|asshole|bitch(?:es)?)\b/iu,
  /\b(?:porn(?:ographic)?|blowjob|handjob|gangbang|sex\s+position(?:s)?|send\s+nudes?)\b/iu,
  /\b(?:nigg(?:er|a)|faggot|kike|chink)\b/iu,
  /\b(?:rape\s+fantasy|sexual\s+fantasy\s+about\s+(?:a\s+)?(?:child|minor))\b/iu,
];

const EXACT_CORRECTIONS = new Map([
  ["mariarage", "marriage"],
  ["marraige", "marriage"],
  ["marrage", "marriage"],
  ["marige", "marriage"],
  ["mahaperiayva", "mahaperiyava"],
  ["mahaperiyva", "mahaperiyava"],
  ["mahaperiyavaa", "mahaperiyava"],
  ["periyvaa", "periyava"],
  ["periyva", "periyava"],
  ["dhrama", "dharma"],
  ["dhamra", "dharma"],
  ["bakthi", "bhakti"],
  ["bhakthi", "bhakti"],
  ["nithyakarma", "nithya karma"],
  ["nityakarma", "nithya karma"],
  ["sandhyavandhanam", "sandhyavandanam"],
  ["sandhyavandan", "sandhyavandanam"],
  ["upanayanam", "upanayana"],
]);

const DOMAIN_TERMS = [
  "marriage",
  "mahaperiyava",
  "periyava",
  "dharma",
  "karma",
  "bhakti",
  "prayer",
  "temple",
  "student",
  "anger",
  "jealousy",
  "discipline",
  "sandhyavandanam",
  "upanayana",
  "sanskrit",
  "tamil",
  "nithya",
];

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

function editDistance(a, b) {
  const left = String(a || "").toLowerCase();
  const right = String(b || "").toLowerCase();
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function preserveCase(source, replacement) {
  if (source === source.toUpperCase()) return replacement.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function normalizeQuestion(question) {
  const corrections = [];
  let normalized = String(question || "");

  normalized = normalized.replace(/\b[A-Za-z][A-Za-z'-]{3,}\b/g, (token) => {
    const lower = token.toLowerCase();
    const exact = EXACT_CORRECTIONS.get(lower);
    if (exact) {
      const replacement = preserveCase(token, exact);
      if (replacement.toLowerCase() !== lower) {
        corrections.push({ from: token, to: replacement });
      }
      return replacement;
    }

    if (DOMAIN_TERMS.includes(lower) || token.length < 5) return token;

    let best = null;
    let bestDistance = Infinity;
    let ties = 0;
    for (const term of DOMAIN_TERMS) {
      if (Math.abs(term.length - lower.length) > 2) continue;
      const distance = editDistance(lower, term);
      if (distance < bestDistance) {
        best = term;
        bestDistance = distance;
        ties = 1;
      } else if (distance === bestDistance) {
        ties += 1;
      }
    }

    const threshold = token.length >= 10 ? 2 : token.length >= 6 ? 1 : 0;
    if (!best || ties !== 1 || bestDistance > threshold) return token;

    const replacement = preserveCase(token, best);
    corrections.push({ from: token, to: replacement });
    return replacement;
  });

  return {
    question: normalized.replace(/\s+/g, " ").trim(),
    corrections,
  };
}

export function respectfulQuestionBoundary(question) {
  const text = String(question || "").normalize("NFKC");
  const blocked = EXPLICIT_ABUSE_PATTERNS.some((pattern) => pattern.test(text));
  if (!blocked) return null;

  const tamil = /[\u0B80-\u0BFF]/u.test(text);
  return tamil
    ? "கேள்வியை மரியாதையுடன் மாற்றிக் கேளுங்கள். நுணுக்கமான சமய, சமூக அல்லது குடும்ப விஷயங்களை கேட்கலாம்; ஆனால் இழிவான, வெறுப்பூட்டும் அல்லது வெளிப்படையான பாலியல் மொழியுள்ள கேள்விகள் பக்தி ஆதார சேவைக்கு அனுப்பப்படாது."
    : "Please rephrase the question respectfully. Sensitive religious, social and family topics are welcome, but abusive, degrading, hateful or pornographically explicit prompts are not sent to the devotional evidence service.";
}

export async function answer(request) {
  if (request.method !== "POST") {
    return json(405, { error: "POST required." }, { allow: "POST" });
  }

  try {
    const body = await readJson(request);
    const originalQuestion =
      typeof body.question === "string" ? body.question.trim() : "";
    const responseLanguage = ["en", "ta"].includes(body.responseLanguage)
      ? body.responseLanguage
      : null;
    if (!originalQuestion || originalQuestion.length > 2000) {
      return json(422, {
        error: "Please enter a question between 1 and 2,000 characters.",
      });
    }

    const respectBoundary = respectfulQuestionBoundary(originalQuestion);
    if (respectBoundary) {
      return json(422, {
        code: "respectful_question_required",
        error: respectBoundary,
      });
    }

    const normalized = normalizeQuestion(originalQuestion);
    const upstream = await callPramana("/v1/mahaperiyava/answer", {
      method: "POST",
      body: JSON.stringify({
        query: normalized.question,
        top_k: 8,
        ...(responseLanguage ? { response_language: responseLanguage } : {}),
      }),
    });
    const packet = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return json(upstream.status, {
        error: upstreamMessage(upstream.status, packet),
      });
    }

    const publicAnswer = toPublicAnswer(packet);
    return json(200, {
      ...publicAnswer,
      question: originalQuestion,
      interpretation: normalized.corrections.length
        ? {
            normalizedQuestion: normalized.question,
            corrections: normalized.corrections,
          }
        : null,
    });
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

    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter((tag) => typeof tag === "string" && ALLOWED_FEEDBACK_TAGS.has(tag))
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
      product: "ask-mahaperiyava",
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
    product: "ask-mahaperiyava",
    evidenceService,
  });
}

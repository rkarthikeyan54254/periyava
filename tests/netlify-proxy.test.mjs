import test from "node:test";
import assert from "node:assert/strict";
import { answer, feedback } from "../netlify/lib/proxy.mjs";

test("Netlify adapter reuses legacy backend token and preserves public DTO", async (t) => {
  const previous = {
    api: process.env.PRAMANA_API_BASE_URL,
    legacy: process.env.PRAMANA_BACKEND_TOKEN,
    proxy: process.env.PRAMANA_PROXY_TOKEN,
    fetch: globalThis.fetch,
  };

  process.env.PRAMANA_API_BASE_URL = "https://example.invalid";
  process.env.PRAMANA_BACKEND_TOKEN = "legacy-token";
  delete process.env.PRAMANA_PROXY_TOKEN;

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers["x-pramana-proxy-token"], "legacy-token");
    const forwarded = JSON.parse(options.body);
    assert.equal(forwarded.response_language, "ta");
    return new Response(JSON.stringify({
      interaction_id: "i-1",
      query: "What did Periyava say?",
      answerable: true,
      answer: {
        display_text: "Grounded answer.",
        presentation: {
          kind: "validated_grounded_synthesis",
          text: "Natural grounded answer.",
          claims: [],
        },
      },
      claims: [{
        text: "Documented teaching.",
        source_label: "Deivathin Kural — V1",
        support_ids: ["private-support-id"],
      }],
      evidence: [{ restricted_text: "must not leak", score: 0.99 }],
      policy: { question_evidence_sufficiency: "supported" },
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  t.after(() => {
    globalThis.fetch = previous.fetch;
    if (previous.api === undefined) delete process.env.PRAMANA_API_BASE_URL;
    else process.env.PRAMANA_API_BASE_URL = previous.api;
    if (previous.legacy === undefined) delete process.env.PRAMANA_BACKEND_TOKEN;
    else process.env.PRAMANA_BACKEND_TOKEN = previous.legacy;
    if (previous.proxy === undefined) delete process.env.PRAMANA_PROXY_TOKEN;
    else process.env.PRAMANA_PROXY_TOKEN = previous.proxy;
  });

  const response = await answer(new Request("https://site.example/api/answer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question: "What did Periyava say?",
      responseLanguage: "ta",
    }),
  }));

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.state, "supported");
  assert.equal(body.answerText, "Natural grounded answer.");
  const serialized = JSON.stringify(body);
  assert.equal(serialized.includes("private-support-id"), false);
  assert.equal(serialized.includes("restricted_text"), false);
  assert.equal(serialized.includes("score"), false);
});


test("Netlify feedback proxy preserves curated review tags and optional comment", async (t) => {
  const previous = {
    api: process.env.PRAMANA_API_BASE_URL,
    legacy: process.env.PRAMANA_BACKEND_TOKEN,
    proxy: process.env.PRAMANA_PROXY_TOKEN,
    fetch: globalThis.fetch,
  };

  process.env.PRAMANA_API_BASE_URL = "https://example.invalid";
  process.env.PRAMANA_BACKEND_TOKEN = "legacy-token";
  delete process.env.PRAMANA_PROXY_TOKEN;

  let forwarded = null;
  globalThis.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return new Response(JSON.stringify({ status: "recorded" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  t.after(() => {
    globalThis.fetch = previous.fetch;
    if (previous.api === undefined) delete process.env.PRAMANA_API_BASE_URL;
    else process.env.PRAMANA_API_BASE_URL = previous.api;
    if (previous.legacy === undefined) delete process.env.PRAMANA_BACKEND_TOKEN;
    else process.env.PRAMANA_BACKEND_TOKEN = previous.legacy;
    if (previous.proxy === undefined) delete process.env.PRAMANA_PROXY_TOKEN;
    else process.env.PRAMANA_PROXY_TOKEN = previous.proxy;
  });

  const response = await feedback(new Request("https://site.example/api/feedback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      interactionId: "interaction-1",
      rating: "down",
      tags: ["wrong evidence", "unsupported conclusion", "not-an-allowed-tag"],
      comment: "The answer used related material but did not answer the question.",
    }),
  }));

  assert.equal(response.status, 200);
  assert.deepEqual(forwarded, {
    interaction_id: "interaction-1",
    rating: "down",
    tags: ["wrong evidence", "unsupported conclusion"],
    comment: "The answer used related material but did not answer the question.",
  });
});

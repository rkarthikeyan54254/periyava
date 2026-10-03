import assert from "node:assert/strict";
import test from "node:test";
import { answer } from "../netlify/lib/proxy.mjs";
import { toPublicAnswer } from "../lib/public-answer.mjs";

const question = "தர்மத்தைப் பின்பற்றுவது ஏன் முக்கியம்?";
const tamilText = "தர்மம் மனத்தூய்மைக்கு வழிவகுக்கிறது என்று இந்த உபதேசம் விளக்குகிறது.";

function packet({ state = "supported", text = "English fallback", teachings = [] } = {}) {
  return {
    query: question,
    answerable: state !== "abstain",
    answer: { display_text: text },
    claims: teachings,
    policy: { question_evidence_sufficiency: state },
  };
}

async function install(t, packets) {
  const originalFetch = globalThis.fetch;
  const originalApi = process.env.PRAMANA_API_BASE_URL;
  const originalToken = process.env.PRAMANA_PROXY_TOKEN;
  const originalMarker = globalThis.__ASK_MAHAPERIYAVA_ANSWER_RECOVERY_INSTALLED__;
  const originalDelays = globalThis.__ASK_MAHAPERIYAVA_RETRY_DELAYS__;
  process.env.PRAMANA_API_BASE_URL = "https://evidence.example";
  process.env.PRAMANA_PROXY_TOKEN = "test-token";
  globalThis.__ASK_MAHAPERIYAVA_ANSWER_RECOVERY_INSTALLED__ = false;
  globalThis.__ASK_MAHAPERIYAVA_RETRY_DELAYS__ = [0, 0];
  const forwarded = [];
  globalThis.fetch = async (input, init) => {
    if (input === "/api/answer") {
      return answer(new Request("https://product.example/api/answer", init));
    }
    forwarded.push(JSON.parse(init.body));
    assert.ok(packets.length, "unexpected additional evidence request");
    return Response.json(packets.shift());
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
    globalThis.__ASK_MAHAPERIYAVA_ANSWER_RECOVERY_INSTALLED__ = originalMarker;
    globalThis.__ASK_MAHAPERIYAVA_RETRY_DELAYS__ = originalDelays;
    if (originalApi === undefined) delete process.env.PRAMANA_API_BASE_URL;
    else process.env.PRAMANA_API_BASE_URL = originalApi;
    if (originalToken === undefined) delete process.env.PRAMANA_PROXY_TOKEN;
    else process.env.PRAMANA_PROXY_TOKEN = originalToken;
  });
  await import(`../public/answer-recovery.js?tamil=${Math.random()}`);
  return forwarded;
}

function ask() {
  return fetch("/api/answer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question, responseLanguage: "ta" }),
  });
}

test("one user submission recovers a missing Tamil answer through the real proxy", async (t) => {
  const requests = await install(t, [packet(), packet({ text: tamilText })]);
  const response = await ask();
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.answerText, tamilText);
  assert.equal(result.answerUnavailable, false);
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0], requests[1]);
  assert.equal(requests[1].response_language, "ta");
});

test("persistent Tamil generation failure stops after one recovery and is an error", async (t) => {
  const requests = await install(t, [packet(), packet()]);
  const response = await ask();
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.code, "tamil_answer_unavailable");
  assert.match(result.error, /தமிழில்/);
  assert.equal(result.state, undefined);
  assert.equal(result.answerText, undefined);
  assert.equal(requests.length, 2);
});

test("genuine Tamil evidence abstention is returned without retrying", async (t) => {
  const requests = await install(t, [packet({ state: "abstain" })]);
  const response = await ask();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).state, "abstain");
  assert.equal(requests.length, 1);
});

test("a valid first Tamil answer needs only one evidence request", async (t) => {
  const requests = await install(t, [packet({ text: tamilText })]);
  assert.equal((await (await ask()).json()).answerText, tamilText);
  assert.equal(requests.length, 1);
});

test("qualified Tamil answers also recover when no usable teachings were generated", async (t) => {
  const recovered = packet({ state: "qualified" });
  recovered.answer.presentation = { text: tamilText };
  const requests = await install(t, [packet({ state: "qualified" }), recovered]);
  const response = await ask();
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.state, "qualified");
  assert.equal(result.answerText, tamilText);
  assert.equal(requests.length, 2);
});

test("Tamil language selection is enforced even if the backend omits its language policy", () => {
  const input = packet();
  input.query = "Why is dharma important?";
  const result = toPublicAnswer(input, { responseLanguage: "ta" });
  assert.equal(result.answerUnavailable, true);
  assert.equal(result.answerText, null);
});

test("qualified source-bound Tamil teachings remain available without generated prose", () => {
  const result = toPublicAnswer(packet({
    state: "qualified",
    teachings: [{ text: tamilText, source_label: "தெய்வத்தின் குரல்", support_ids: ["private-id"] }],
  }));
  assert.equal(result.answerUnavailable, false);
  assert.equal(result.teachings[0].text, tamilText);
  assert.equal(JSON.stringify(result).includes("private-id"), false);
});

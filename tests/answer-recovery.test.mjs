import assert from "node:assert/strict";
import test from "node:test";

async function installWith(responses) {
  const calls = [];
  globalThis.__ASK_MAHAPERIYAVA_ANSWER_RECOVERY_INSTALLED__ = false;
  globalThis.__ASK_MAHAPERIYAVA_RETRY_DELAYS__ = [0, 0];
  globalThis.fetch = async (input, init) => {
    calls.push({ input, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  await import(`../public/answer-recovery.js?test=${Math.random()}`);
  return calls;
}

test("retries a timed-out answer request and returns the recovered response", async () => {
  const calls = await installWith([
    new Response(JSON.stringify({ error: "timeout" }), { status: 504 }),
    new Response(JSON.stringify({ state: "supported" }), { status: 200 }),
  ]);

  const response = await fetch("/api/answer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "What did Periyava say about prayer?" }),
  });

  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
});

test("stops after bounded retries when the service stays unavailable", async () => {
  const calls = await installWith([
    new Response("", { status: 504 }),
    new Response("", { status: 504 }),
    new Response("", { status: 504 }),
  ]);

  const response = await fetch("/api/answer", { method: "POST", body: "{}" });
  assert.equal(response.status, 504);
  assert.equal(calls.length, 3);
});

test("does not retry unrelated requests or non-transient answer errors", async () => {
  let calls = await installWith([new Response("", { status: 500 })]);
  let response = await fetch("/api/answer", { method: "POST", body: "{}" });
  assert.equal(response.status, 500);
  assert.equal(calls.length, 1);

  calls = await installWith([new Response("", { status: 200 })]);
  response = await fetch("/api/health");
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
});

test("retries transient network failures for answer requests", async () => {
  const transient = new TypeError("network connection reset");
  const calls = await installWith([
    transient,
    new Response(JSON.stringify({ state: "qualified" }), { status: 200 }),
  ]);

  const response = await fetch("/api/answer", { method: "POST", body: "{}" });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
});

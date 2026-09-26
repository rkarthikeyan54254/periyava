import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeQuestion,
  respectfulQuestionBoundary,
} from "../netlify/lib/proxy.mjs";
import { toPublicAnswer } from "../lib/public-answer.mjs";

test("obvious Mahaperiyava-domain spelling mistakes are normalized conservatively", () => {
  const normalized = normalizeQuestion(
    "what does periyva say about mariarage and dhrama?"
  );
  assert.equal(
    normalized.question,
    "what does periyava say about marriage and dharma?"
  );
  assert.deepEqual(normalized.corrections, [
    { from: "periyva", to: "periyava" },
    { from: "mariarage", to: "marriage" },
    { from: "dhrama", to: "dharma" },
  ]);
});

test("ordinary words are not aggressively rewritten", () => {
  const normalized = normalizeQuestion(
    "What did Periyava say about managing a difficult family relationship?"
  );
  assert.equal(
    normalized.question,
    "What did Periyava say about managing a difficult family relationship?"
  );
  assert.deepEqual(normalized.corrections, []);
});

test("sensitive respectful questions are allowed while explicit abuse is stopped", () => {
  assert.equal(
    respectfulQuestionBoundary(
      "What did Periyava say about sex within marriage and household dharma?"
    ),
    null,
  );
  assert.match(
    respectfulQuestionBoundary(
      "Give me pornographic sex positions and fuck religious people"
    ),
    /Please rephrase the question respectfully/,
  );
});

test("abstention copy names the seven-volume verified corpus explicitly", () => {
  const answer = toPublicAnswer({
    query: "What did Periyava say about an unsupported modern topic?",
    answerable: false,
    status: "insufficient_evidence",
    policy: {
      question_evidence_sufficiency: "abstain",
      response_language: "en",
    },
  });

  assert.equal(answer.state, "abstain");
  assert.match(answer.message, /seven currently verified volumes/i);
  assert.match(answer.message, /Deivathin Kural \(Voice of God\)/);
  assert.match(answer.corpusBoundary, /Volumes 1–7/);
  assert.match(answer.corpusBoundary, /does not mean Sri Mahaperiyava never spoke/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { deriveState, toPublicAnswer } from "../lib/public-answer.mjs";

test("supported packet exposes only curated public fields", () => {
  const packet = {
    interaction_id: "abc123456789",
    query: "What did Periyava say?",
    answerable: true,
    answer: { display_text: "A grounded answer." },
    claims: [{
      text: "A documented teaching.",
      source_label: "Deivathin Kural — Vol. 1, Chapter 2",
      support_ids: ["private.id"],
    }],
    evidence: [{ score: 0.99, restricted_text: "never expose" }],
    generation_request: { secret: true },
    policy: { question_evidence_sufficiency: "supported" },
  };

  const out = toPublicAnswer(packet);
  assert.equal(out.state, "supported");
  assert.equal(out.answerText, "A grounded answer.");
  assert.deepEqual(out.references, ["Deivathin Kural — Vol. 1, Chapter 2"]);
  const serialized = JSON.stringify(out);
  assert.equal(serialized.includes("support_ids"), false);
  assert.equal(serialized.includes("restricted_text"), false);
  assert.equal(serialized.includes("generation_request"), false);
});

test("validated grounded synthesis is preferred over citation-style fallback", () => {
  const out = toPublicAnswer({
    interaction_id: "synthesis123",
    query: "What did Periyava say about Sandhyavandanam?",
    answerable: true,
    answer: {
      display_text: "Citation-like fallback.",
      presentation: {
        kind: "validated_grounded_synthesis",
        text: "Mahaperiyava’s teaching places Sandhyavandanam within a disciplined daily spiritual life.",
      },
    },
    claims: [{
      text: "Daily Sandhya is associated with purification and collective welfare.",
      source_label: "Deivathin Kural — Vol. 2",
      support_ids: ["private.id"],
    }],
    policy: { question_evidence_sufficiency: "supported" },
  });

  assert.equal(out.state, "supported");
  assert.match(out.answerText, /disciplined daily spiritual life/);
  const serialized = JSON.stringify(out);
  assert.equal(serialized.includes("private.id"), false);
  assert.equal(serialized.includes("validated_grounded_synthesis"), false);
});

test("qualified packet may surface validated synthesis with its boundary inside the prose", () => {
  const out = toPublicAnswer({
    interaction_id: "qualified-synthesis",
    query: "Can women perform Sandhyavandanam?",
    answerable: true,
    answer: {
      display_text: "Deterministic boundary.",
      evidence_sufficiency: {
        limitation: "The retrieved evidence does not establish permission.",
      },
      presentation: {
        kind: "validated_grounded_synthesis",
        text: "The documented teaching explains the importance of Sandhyavandanam, but the records available here do not establish whether the group named in the question may perform it.",
        claims: [{
          text: "Sandhyavandanam is treated as an important daily observance.",
          support_ids: ["s1"],
        }],
      },
    },
    claims: [{
      text: "Sandhyavandanam is treated as an important daily observance.",
      source_label: "Deivathin Kural — Vol. 2",
      support_ids: ["s1"],
    }],
    policy: { question_evidence_sufficiency: "qualified" },
  });

  assert.equal(out.state, "qualified");
  assert.match(out.answerText, /do not establish/);
  assert.equal(out.limitation, null);
  assert.equal(out.teachings[0].text, "Sandhyavandanam is treated as an important daily observance.");
  assert.equal(out.teachings[0].sourceLabel, "Deivathin Kural — Vol. 2");
  assert.equal(JSON.stringify(out).includes("s1"), false);
});

test("qualified packet exposes the limitation separately", () => {
  const packet = {
    interaction_id: "qualified123",
    query: "May a named group perform a practice?",
    answerable: true,
    answer: {
      display_text: "Combined rendering",
      evidence_sufficiency: {
        limitation: "The retrieved evidence discusses the practice, but does not directly establish permission.",
      },
    },
    claims: [{
      text: "The related documented teaching.",
      source_label: "Deivathin Kural — Vol. 2, Chapter 8",
    }],
    policy: { question_evidence_sufficiency: "qualified" },
  };

  const out = toPublicAnswer(packet);
  assert.equal(deriveState(packet), "qualified");
  assert.equal(out.answerText, null);
  assert.match(out.limitation, /does not directly establish/);
  assert.equal(out.teachings[0].text, "The related documented teaching.");
});

test("abstention is a corpus limitation, not a historical claim", () => {
  const out = toPublicAnswer({
    interaction_id: "abstain123",
    query: "Unsupported modern question",
    answerable: false,
    status: "insufficient_evidence",
  });

  assert.equal(out.state, "abstain");
  assert.match(out.message, /sources we have verified do not yet support/);
  assert.match(out.corpusBoundary, /not a claim that Sri Mahaperiyava never spoke/);
  assert.deepEqual(out.teachings, []);
});

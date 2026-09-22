const ALLOWED_STATES = new Set(["supported", "qualified", "abstain"]);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function deriveState(packet = {}) {
  const explicit = packet?.policy?.question_evidence_sufficiency;
  if (ALLOWED_STATES.has(explicit)) return explicit;
  if (packet?.answerable === false || packet?.status === "insufficient_evidence") {
    return "abstain";
  }
  return "supported";
}

export function toPublicAnswer(packet = {}) {
  const state = deriveState(packet);
  const answer = packet?.answer && typeof packet.answer === "object" ? packet.answer : {};
  const alignment =
    answer?.evidence_sufficiency && typeof answer.evidence_sufficiency === "object"
      ? answer.evidence_sufficiency
      : {};

  const teachings = Array.isArray(packet?.claims)
    ? packet.claims
        .map((claim) => ({
          text: clean(claim?.text),
          sourceLabel: clean(claim?.source_label),
          contextRequired: Boolean(claim?.context_required),
        }))
        .filter((claim) => claim.text)
    : [];

  const references = unique(teachings.map((item) => item.sourceLabel));
  const limitation = clean(alignment?.limitation) || clean(packet?.message);

  return {
    interactionId: clean(packet?.interaction_id),
    question: clean(packet?.query),
    state,
    answerText: state === "supported" ? clean(answer?.display_text) : null,
    limitation: state === "qualified" ? limitation : null,
    message:
      state === "abstain"
        ? "We do not currently have sufficiently strong evidence in the curated corpus to attribute a direct answer to this question."
        : null,
    corpusBoundary:
      state === "abstain"
        ? "This is a limitation of the verified corpus available to Just Periyava. It is not a claim that Mahaperiyava never spoke on the subject."
        : null,
    teachings: state === "abstain" ? [] : teachings,
    references: state === "abstain" ? [] : references,
    trustNote:
      "This is an evidence-based curated representation of documented teachings, not Mahaperiyava literally speaking through AI.",
  };
}

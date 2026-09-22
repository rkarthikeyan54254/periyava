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
  const presentation =
    answer?.presentation && typeof answer.presentation === "object"
      ? answer.presentation
      : {};

  const sourceBySupportId = new Map();
  if (Array.isArray(packet?.claims)) {
    for (const claim of packet.claims) {
      if (!claim || typeof claim !== "object") continue;
      const sourceLabel = clean(claim.source_label);
      for (const supportId of Array.isArray(claim.support_ids) ? claim.support_ids : []) {
        if (typeof supportId === "string" && sourceLabel && !sourceBySupportId.has(supportId)) {
          sourceBySupportId.set(supportId, sourceLabel);
        }
      }
    }
  }

  const deterministicTeachings = Array.isArray(packet?.claims)
    ? packet.claims
        .map((claim) => ({
          text: clean(claim?.text),
          sourceLabel: clean(claim?.source_label),
          contextRequired: Boolean(claim?.context_required),
        }))
        .filter((claim) => claim.text)
    : [];

  const presentationTeachings = Array.isArray(presentation?.claims)
    ? presentation.claims
        .map((claim) => {
          const sourceLabel = (Array.isArray(claim?.support_ids) ? claim.support_ids : [])
            .map((id) => sourceBySupportId.get(id))
            .find(Boolean) || null;
          return {
            text: clean(claim?.text),
            sourceLabel,
            contextRequired: false,
          };
        })
        .filter((claim) => claim.text)
    : [];

  const teachings = presentationTeachings.length
    ? presentationTeachings
    : deterministicTeachings;
  const references = unique(teachings.map((item) => item.sourceLabel));
  const limitation = clean(alignment?.limitation) || clean(packet?.message);
  const synthesizedText = clean(presentation?.text);
  const fallbackText = clean(answer?.display_text);

  return {
    interactionId: clean(packet?.interaction_id),
    question: clean(packet?.query),
    state,
    generated: Boolean(synthesizedText),
    answerText:
      state === "abstain"
        ? null
        : synthesizedText || (state === "supported" ? fallbackText : null),
    limitation:
      state === "qualified" && !synthesizedText
        ? limitation
        : null,
    message:
      state === "abstain"
        ? "The sources we have verified do not yet support a direct answer to this question."
        : null,
    corpusBoundary:
      state === "abstain"
        ? "This is a limitation of the currently verified corpus. It is not a claim that Sri Mahaperiyava never spoke on the subject."
        : null,
    teachings: state === "abstain" ? [] : teachings,
    references: state === "abstain" ? [] : references,
    trustNote:
      "Grounded in curated, documented teachings. Generated wording is a synthesis and not a verbatim quotation from Sri Mahaperiyava unless explicitly marked.",
  };
}

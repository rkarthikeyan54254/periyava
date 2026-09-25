const ALLOWED_STATES = new Set(["supported", "qualified", "abstain"]);

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function containsTamil(value) {
  return /[\u0B80-\u0BFF]/u.test(value || "");
}

function containsEnglishWords(value) {
  return /\b[A-Za-z]{2,}\b/u.test(value || "");
}

function tamilRequested(packet = {}) {
  return (
    packet?.policy?.response_language === "ta" ||
    containsTamil(packet?.query)
  );
}

function tamilSafe(value) {
  const text = clean(value);
  if (!text) return null;
  return containsTamil(text) && !containsEnglishWords(text) ? text : null;
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
  const wantsTamil = tamilRequested(packet);
  const synthesizedText = wantsTamil
    ? tamilSafe(presentation?.text)
    : clean(presentation?.text);
  const fallbackText = wantsTamil
    ? tamilSafe(answer?.display_text)
    : clean(answer?.display_text);

  const localizedTamilFallback =
    "இந்தக் கேள்விக்கு பொருத்தமான ஆதாரம் கிடைத்துள்ளது. ஆனால் தமிழில் நம்பகமான பதிலை உருவாக்கும் கட்டம் இப்போது நிறைவடையவில்லை. தவறான மொழியில் பதிலை காட்டுவதற்குப் பதிலாக இங்கே நிறுத்துகிறோம்; மீண்டும் முயற்சிக்கவும்.";

  const visibleTeachings = wantsTamil
    ? (presentationTeachings.length
        ? presentationTeachings.filter((item) => tamilSafe(item.text))
        : deterministicTeachings.filter((item) => tamilSafe(item.text)))
    : teachings;

  const application =
    answer?.modern_application &&
    typeof answer.modern_application === "object" &&
    answer.modern_application.label === "app_generated"
      ? answer.modern_application
      : null;
  const applicationText = wantsTamil
    ? tamilSafe(application?.text)
    : clean(application?.text);

  return {
    interactionId: clean(packet?.interaction_id),
    question: clean(packet?.query),
    state,
    generated: Boolean(synthesizedText),
    answerText:
      state === "abstain"
        ? null
        : synthesizedText ||
          (state === "supported"
            ? fallbackText || (wantsTamil ? localizedTamilFallback : null)
            : null),
    limitation:
      state === "qualified" && !synthesizedText
        ? (wantsTamil
            ? "கிடைத்துள்ள ஆதாரம் கேள்வியின் இந்தத் துல்லிய அம்சத்தை நேரடியாக உறுதிப்படுத்தவில்லை."
            : limitation)
        : null,
    message:
      state === "abstain"
        ? (wantsTamil
            ? "நமக்குக் கிடைத்துள்ள உறுதிப்படுத்தப்பட்ட பதிவுகள் இந்தக் கேள்விக்கு நேரடி பதிலைச் சொல்லும் அளவுக்கு இப்போது போதவில்லை."
            : "The sources we have verified do not yet support a direct answer to this question.")
        : null,
    corpusBoundary:
      state === "abstain"
        ? (wantsTamil
            ? "இது தற்போது சரிபார்க்கப்பட்டுள்ள தொகுப்பின் எல்லை மட்டுமே; ஸ்ரீ மஹாபெரியவா இந்த விஷயத்தைப் பற்றி எப்போதும் பேசவில்லை என்ற முடிவு அல்ல."
            : "This is a limitation of the currently verified corpus. It is not a claim that Sri Mahaperiyava never spoke on the subject.")
        : null,
    teachings: state === "abstain" ? [] : visibleTeachings,
    references: state === "abstain" ? [] : references,
    applicationText: state === "abstain" ? null : applicationText,
    applicationGenerated: Boolean(state !== "abstain" && applicationText),
    trustNote:
      wantsTamil
        ? "ஆவணப்படுத்தப்பட்ட, தொகுக்கப்பட்ட உபதேச ஆதாரங்களின் அடிப்படையில் இந்தப் பதில் தரப்படுகிறது. உருவாக்கப்பட்ட உரை, வெளிப்படையாக அப்படிக் குறிக்கப்படாத வரை, ஸ்ரீ மஹாபெரியவாவின் சொற்சொறான மேற்கோள் அல்ல."
        : "Grounded in curated, documented teachings. Generated wording is a synthesis and not a verbatim quotation from Sri Mahaperiyava unless explicitly marked.",
  };
}

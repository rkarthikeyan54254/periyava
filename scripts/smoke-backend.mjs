import { toPublicAnswer } from "../lib/public-answer.mjs";

const apiBase = String(process.env.PRAMANA_API_BASE_URL || "").replace(/\/$/, "");
const token = String(process.env.PRAMANA_PROXY_TOKEN || "").trim();

if (!apiBase) throw new Error("PRAMANA_API_BASE_URL is required.");
if (!token) throw new Error("PRAMANA_PROXY_TOKEN is required.");

const response = await fetch(`${apiBase}/v1/mahaperiyava/answer`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-pramana-proxy-token": token,
  },
  body: JSON.stringify({
    query: "Does Mahaperiyava teach the essential unity of Shiva and Vishnu?",
    top_k: 8,
  }),
});

const packet = await response.json().catch(() => ({}));
if (!response.ok) {
  throw new Error(`Pramāṇa smoke request failed with HTTP ${response.status}`);
}

const publicAnswer = toPublicAnswer(packet);
if (!["supported", "qualified", "abstain"].includes(publicAnswer.state)) {
  throw new Error("Smoke response did not map to a supported public state.");
}
if (!publicAnswer.interactionId) {
  throw new Error("Smoke response did not include an interaction id.");
}

const serialized = JSON.stringify(publicAnswer);
for (const forbidden of ["support_ids","retriever_mode","generation_request","llm_synthesis","policy"]) {
  if (serialized.includes(forbidden)) {
    throw new Error(`Public response leaked internal field: ${forbidden}`);
  }
}

console.log(JSON.stringify({
  event: "just_periyava_pramana_smoke_passed",
  state: publicAnswer.state,
  teachingCount: publicAnswer.teachings.length,
}));

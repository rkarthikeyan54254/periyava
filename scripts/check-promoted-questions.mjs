import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import vm from "node:vm";

const source = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const start = source.indexOf("const copy =");
const end = source.indexOf("const state =");
if (start < 0 || end <= start) throw new Error("Could not read the promoted question lists.");
const copy = vm.runInNewContext(`${source.slice(start, end)}; copy`, {}, { timeout: 1000 });
const base = process.env.PROMOTED_QUESTION_API_BASE || "https://askperiyava.in";
const language = process.env.PROMOTED_QUESTION_LANGUAGE;
const intervalMs = Number(process.env.PROMOTED_QUESTION_INTERVAL_MS || 30000);
const selectedQuestion = process.env.PROMOTED_QUESTION;
let checked = 0;
let failures = 0;

for (const lang of language ? [language] : ["ta", "en"]) {
  if (!copy[lang]) throw new Error("Language must be ta or en.");
  const questions = selectedQuestion ? [selectedQuestion] : [...new Set([
    ...copy[lang].examples,
    ...copy[lang].inspiration,
    ...copy[lang].topics.map(row => row[1]),
  ])];
  for (const question of questions) {
    if (checked) await delay(intervalMs);
    checked += 1;
    let failure = null;
    try {
      const response = await fetch(new URL("/api/answer", base), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, responseLanguage: lang }),
        signal: AbortSignal.timeout(125000),
      });
      if (response.status === 429) throw new Error("Rate limited; stop and rerun later, do not treat untested questions as passing.");
      const answer = await response.json().catch(() => null);
      if (!response.ok || !answer) failure = `HTTP ${response.status}`;
      else if (!["supported", "qualified"].includes(answer.state)) failure = "Promoted question abstained";
      else if (!answer.answerText && !answer.teachings?.length) failure = "No usable answer";
      else if (!answer.references?.length) failure = "No source reference";
      else if (lang === "ta" && answer.answerText &&
        (!/[\u0B80-\u0BFF]/u.test(answer.answerText) || /\b[A-Za-z]{2,}\b/u.test(answer.answerText))) failure = "Answer is not Tamil";
      console.log(JSON.stringify({ language: lang, question, passed: !failure, state: answer?.state, failure }));
      if (response.status === 429) break;
    } catch (error) {
      failure = error.message;
      console.log(JSON.stringify({ language: lang, question, passed: false, failure }));
      if (failure.startsWith("Rate limited")) {
        process.exitCode = 1;
        throw error;
      }
    }
    if (failure) failures += 1;
  }
}
console.log(JSON.stringify({ checked, failures }));
if (failures) process.exitCode = 1;

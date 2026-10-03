import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function check(scenario) {
  const stub = `globalThis.fetch = async (_input, init) => {
    const language = JSON.parse(init.body).responseLanguage;
    if (${JSON.stringify(scenario)} === 'rate-limit') return new Response('', {status:429});
    return Response.json({
      state: ${JSON.stringify(scenario)} === 'abstain' ? 'abstain' : 'supported',
      answerText: language === 'ta' ? 'தர்மம் பற்றிய ஆதாரமுள்ள விளக்கம்.' : 'A sourced explanation of dharma.',
      references: ${JSON.stringify(scenario)} === 'missing-source' ? [] : ['Source reference'],
    });
  };`;
  return spawnSync(process.execPath, [
    "--import", `data:text/javascript,${encodeURIComponent(stub)}`,
    new URL("../scripts/check-promoted-questions.mjs", import.meta.url).pathname,
  ], {
    env: { ...process.env, PROMOTED_QUESTION_INTERVAL_MS: "0" },
    encoding: "utf8",
  });
}

test("the release check covers examples, rotating prompts, and topics in both languages", () => {
  const result = check("supported");
  assert.equal(result.status, 0, result.stderr);
  const rows = result.stdout.trim().split("\n").map(line => JSON.parse(line));
  assert.ok(rows.some(row => row.language === "en"));
  assert.ok(rows.some(row => row.question === "அன்றாட வாழ்க்கையில் தர்மம் என்றால் என்ன?"));
  assert.ok(rows.some(row => row.question === "சந்தியாவந்தனம் பற்றி மஹாபெரியவா என்ன சொல்லியிருக்கிறார்?"));
  assert.ok(rows.at(-1).checked >= 30);
  assert.equal(rows.at(-1).failures, 0);
});

test("the release check fails when promoted questions abstain or lack sources", () => {
  for (const scenario of ["abstain", "missing-source"]) {
    const result = check(scenario);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /"passed":false/);
  }
});

test("rate limiting ends the release check after the first request", () => {
  const result = check("rate-limit");
  assert.equal(result.status, 1);
  assert.equal(result.stdout.trim().split("\n").length, 1);
  assert.match(result.stdout, /Rate limited/);
});

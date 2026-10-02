import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const analytics = await readFile(new URL("../public/analytics.js", import.meta.url), "utf8");
const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const privacy = await readFile(new URL("../public/privacy.html", import.meta.url), "utf8");

test("analytics stays dormant without a configured GA4 measurement id", () => {
  assert.match(index, /name="askperiyava-ga4-id" content=""/);
  assert.match(analytics, /enabled=\/\^G-/);
  assert.match(index, /\/analytics\.js/);
});

test("analytics only allows coarse product properties", () => {
  for (const key of ["route", "language", "result_state", "latency_bucket", "source", "rating", "kind", "availability"]) {
    assert.ok(analytics.includes(`"${key}"`), `missing safe analytics key ${key}`);
  }
  for (const forbidden of ["question_text", "answer_text", "feedback_note", "interaction_id", "citation_text"]) {
    assert.ok(!analytics.includes(forbidden), `forbidden analytics property ${forbidden}`);
  }
});

test("analytics records the beta funnel without advertising signals", () => {
  for (const eventName of [
    "page_view",
    "language_selected",
    "dictation_started",
    "question_submitted",
    "answer_result",
    "answer_saved",
    "answer_shared",
    "feedback_submitted",
    "followup_started",
    "explore_topic_clicked",
  ]) {
    assert.ok(analytics.includes(`"${eventName}"`), `missing event ${eventName}`);
  }
  assert.match(analytics, /allow_google_signals:false/);
  assert.match(analytics, /allow_ad_personalization_signals:false/);
  assert.match(analytics, /ad_storage:"denied"/);
  assert.match(analytics, /ad_user_data:"denied"/);
  assert.match(analytics, /ad_personalization:"denied"/);
});

test("privacy page describes aggregate analytics and excluded content", () => {
  assert.match(privacy, /Aggregate usage analytics/);
  assert.match(privacy, /does not send your question text, answer text, cited teaching text, feedback note or internal interaction identifiers/i);
});

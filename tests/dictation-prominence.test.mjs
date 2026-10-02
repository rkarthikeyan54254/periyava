import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/dictation-prominence.css", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

test("dictation prominence stylesheet is loaded", () => {
  assert.ok(index.includes('/dictation-prominence.css'));
});

test("dictation is visually promoted without auto submission", () => {
  assert.match(css, /Prefer speaking\? Tap Dictate/);
  assert.match(css, /பேசுவது சுலபமா/);
  assert.match(css, /\.dictate::before/);
  assert.match(css, /min-height:\s*45px/);
  assert.match(app, /Dictation remains editable and never submits on its own/);
  assert.doesNotMatch(app, /recognition\.onresult[\s\S]{0,600}submitQuestion/);
});

test("mobile keeps voice and submit actions equally reachable", () => {
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /\.dictate,\s*\n\s*\.composer-actions \.primary/);
  assert.match(css, /flex:\s*1 1 0/);
});

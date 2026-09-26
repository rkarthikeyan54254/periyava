import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const about = await readFile(new URL("../public/about.html", import.meta.url), "utf8");
const privacy = await readFile(new URL("../public/privacy.html", import.meta.url), "utf8");

test("production UI has no observer-driven enhancement runtime", () => {
  assert.equal(app.includes("MutationObserver"), false);
  assert.equal(index.includes("enhancements.js"), false);
  assert.match(index, /<script defer src="\/app\.js"><\/script>/);
});

test("Ask Mahaperiyava bilingual brand and seven-volume positioning are native in app render", () => {
  assert.match(app, /brandTitle: "Ask Mahaperiyava"/);
  assert.match(app, /brandTitle: "மஹாபெரியவாவைக் கேளுங்கள்"/u);
  assert.match(app, /Deivathin Kural · Volumes 1–7 · evidence-grounded/);
  assert.match(app, /தெய்வத்தின் குரல் · தொகுதிகள் 1–7 · ஆதார அடிப்படையில்/u);
});

test("dark mode, inspiration, onboarding and footer are first-class app state", () => {
  assert.match(app, /THEME_KEY/);
  assert.match(app, /id="theme-toggle"/);
  assert.match(app, /function inspirationRail\(\)/);
  assert.match(app, /setInterval\(\(\) =>/);
  assert.match(app, /function welcomeOverlay\(\)/);
  assert.match(app, /function siteFooter\(\)/);
  assert.match(app, /\/about\.html/);
  assert.match(app, /\/privacy\.html/);
  assert.match(app, /\/about\.html#contact/);
});

test("saved history remains account-free and follow-up is intentionally one-step", () => {
  assert.match(app, /No account is required/);
  assert.match(app, /கணக்கு தேவையில்லை/u);
  assert.match(app, /Ask one follow-up/);
  assert.match(app, /open-ended chat/);
  assert.match(app, /answer\._followupDepth/);
  assert.match(app, /payload\._followupDepth = 1/);
});

test("beta latency and explicit corpus boundary remain visible in the main app", () => {
  assert.match(app, /Beta responses may take a few seconds/);
  assert.match(app, /பீட்டா பதிலுக்கு சில விநாடிகள் ஆகலாம்/u);
  assert.match(app, /seven currently verified volumes of Deivathin Kural \(Voice of God\)/);
  assert.match(app, /தெய்வத்தின் குரல் தொகுதிகள் 1–7/u);
});

test("About and Privacy expose Pramāṇa, corpus scope, contact and browser-local saves", () => {
  assert.match(about, /What is Pramāṇa\?/);
  assert.match(about, /seven verified volumes/);
  assert.match(about, /name="pramana-contact"/);
  assert.match(privacy, /browser/i);
  assert.match(privacy, /saved/i);
});

test("main product does not add a vanity questions-answered counter", () => {
  assert.equal(/questions answered/i.test(app), false);
});

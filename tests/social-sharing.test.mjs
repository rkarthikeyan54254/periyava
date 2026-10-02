import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const sharing = await readFile(new URL("../public/social-share.js", import.meta.url), "utf8");

test("homepage exposes complete social preview metadata", () => {
  for (const required of [
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'property="og:image"',
    'property="og:image:width" content="640"',
    'property="og:image:height" content="360"',
    'name="twitter:card" content="summary_large_image"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
    'rel="canonical" href="https://askperiyava.in/"',
  ]) {
    assert.ok(index.includes(required), `missing ${required}`);
  }
  assert.match(index, /https:\/\/askperiyava\.in\/assets\/mahaperiyava-hero\.webp/);
});

test("supported answers get a native share action with copy fallback", () => {
  assert.match(sharing, /\.answer \.answer-top/);
  assert.match(sharing, /navigator\.share/);
  assert.match(sharing, /navigator\.clipboard/);
  assert.match(sharing, /MutationObserver/);
  assert.match(sharing, /https:\/\/askperiyava\.in\/#ask/);
});

test("sharing enhancement is loaded before the app render runtime", () => {
  const shareIndex = index.indexOf('/social-share.js');
  const appIndex = index.indexOf('/app.js');
  assert.ok(shareIndex >= 0);
  assert.ok(appIndex > shareIndex);
  assert.ok(index.includes('/social-share.css'));
});

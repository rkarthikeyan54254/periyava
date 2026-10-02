import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/mobile-layout-fix.css", import.meta.url), "utf8");

test("mobile layout override loads after other product styles", () => {
  const mobile = index.indexOf('/mobile-layout-fix.css');
  assert.ok(mobile > index.indexOf('/dictation-prominence.css'));
  assert.ok(mobile > index.indexOf('/enhancements.css'));
});

test("mobile header prevents brand and controls from colliding", () => {
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) auto/);
  assert.match(css, /\.brand small\s*\{\s*display:\s*none/);
  assert.match(css, /html\[lang="ta"\] \.brand b/);
  assert.match(css, /\.header-tools/);
});

test("mobile page keeps fixed navigation clear of content", () => {
  assert.match(css, /#app\s*\{\s*padding-bottom:\s*126px/);
  assert.match(css, /main\s*\{\s*padding-bottom:\s*96px/);
  assert.match(css, /nav\s*\{/);
});

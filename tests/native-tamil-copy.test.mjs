import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

test("Tamil product copy avoids known translationese", () => {
  const forbidden = [
    "வழிகாட்டலைத் தேடுங்கள்",
    "எவ்வளவு வரை உறுதிப்படுத்துகிறதோ",
    "அவ்வளவு வரையிலேயே",
    "ஆவணப்படுத்தப்பட்ட உபதேசங்களை ஆதாரமாகக் கொண்ட வழிகாட்டல்",
  ];
  for (const phrase of forbidden) {
    assert.equal(app.includes(phrase), false, phrase);
  }
});

test("Tamil Ask copy reads directly and names the source naturally", () => {
  assert.match(app, /askTitle: "உங்கள் கேள்வியை கேளுங்கள்\."/);
  assert.match(app, /தெய்வத்தின் குரலில் உள்ள பொருத்தமான உபதேசத்தை வைத்து பதில் சொல்கிறோம்/);
  assert.match(app, /guidance: "உபதேசத்தின் சாரம்"/);
  assert.match(app, /applicationTitle: "இன்றைக்கு பயன்படுத்திப் பார்க்க"/);
});

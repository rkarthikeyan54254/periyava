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

test("Tamil Ask copy reads directly and names the verified source naturally", () => {
  assert.match(app, /askTitle: "மஹாபெரியவாவைக் கேளுங்கள்"/u);
  assert.match(app, /தெய்வத்தின் குரல் தொகுதிகள் 1–7-ல் சரிபார்க்கப்பட்ட ஆதாரம்/u);
  assert.match(app, /guidance: "உபதேசத்தின் சாரம்"/u);
  assert.match(app, /applicationTitle: "இன்றைக்கு பயன்படுத்திப் பார்க்க"/u);
});

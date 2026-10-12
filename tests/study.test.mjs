import { test } from "node:test";
import assert from "node:assert/strict";
import { characterCount, csvCell, exportCSV, validateResult, languageCodes } from "../js/study-core.mjs";
import { locales } from "../scripts/study-locales.mjs";

test("all seven locales cover all UI states and have a supported default target", () => {
  const keys = Object.keys(locales.en).sort();
  for (const copy of Object.values(locales)) {
    assert.deepEqual(Object.keys(copy).sort(), keys);
    assert.ok(Object.values(copy).every(value => typeof value === "string"));
    assert.ok(languageCodes.includes(copy.target));
  }
});

test("character limit counts Unicode characters instead of UTF-16 units", () => {
  assert.equal(characterCount("你好🙂"), 3);
  assert.equal(characterCount("e\u0301"), 1);
});

test("CSV escapes commas, quotes, newlines and spreadsheet formulas", () => {
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  assert.equal(csvCell("=HYPERLINK(1)"), '"\'=HYPERLINK(1)"');
  assert.equal(csvCell("\t+SUM(1)"), '"\'\t+SUM(1)"');
});

const snapshot = { text: "We learn together.", sourceLanguage: "en", targetLanguage: "zh-Hans" };
const result = { source: snapshot.text, sourceLanguage: "en", targetLanguage: "zh-Hans", fullTranslation: "我们一起学习。", words: [{ index: 0, source: "We", target: "我们" }, { index: 1, source: "learn", target: "学习" }, { index: 2, source: "together", target: null }] };

test("exports only selected, translated words and retains sentence context", () => {
  const csv = exportCSV(result, new Set([1, 2]), "csv");
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"learn","学习","We learn together.","我们一起学习。","en","zh-Hans"'));
  assert.ok(!csv.includes('"We","我们"'));
  assert.ok(!csv.includes('"together"'));
  const anki = exportCSV(result, new Set([0]), "anki");
  assert.ok(anki.startsWith("#separator:Comma\n#html:false\n#columns:"));
});

test("stale language pair results and malformed responses are rejected", () => {
  assert.equal(validateResult(result, snapshot), result);
  assert.throws(() => validateResult(result, { ...snapshot, targetLanguage: "hi" }));
  assert.throws(() => validateResult({ ...result, words: [{ index: 99, source: "We", target: "我们" }] }, snapshot));
  assert.throws(() => validateResult({ ...result, fullTranslation: "" }, snapshot));
});

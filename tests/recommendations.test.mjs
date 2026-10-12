import test from "node:test";
import assert from "node:assert/strict";
import { recommendationURL, topicIDs, playbackPreferences, validateOrigin, supportsTopic } from "../js/recommendations.mjs";
import { exportCSV } from "../js/study-core.mjs";
import { sourceCopy } from "../scripts/source-copy.mjs";
import { interestCopy } from "../scripts/interest-copy.mjs";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

test("each locale covers all topic, length and listening options", () => {
  for (const copy of Object.values(interestCopy)) {
    assert.equal(copy.topics.length, topicIDs.length);
    assert.equal(copy.lengths.length, 3);
    assert.equal(copy.counts.length, 3);
    assert.ok(Object.values(copy).flat().every(value => typeof value === "string" && value.trim()));
  }
});

test("recommendations send topic, length and exclusion without changing the endpoint", () => {
  const url = new URL(recommendationURL("travel", 1, "a & b"));
  assert.equal(url.pathname, "/quotes/random");
  assert.equal(url.searchParams.get("topic"), "travel");
  assert.equal(url.searchParams.get("maxLength"), "80");
  assert.equal(url.searchParams.get("exclude"), "a & b");
  assert.throws(() => recommendationURL("wrong", 1));
  assert.throws(() => recommendationURL("daily", 5));
});

test("playback has bounded rates and finite repeat counts", () => {
  assert.deepEqual(playbackPreferences("0.75", "3"), { rate: 0.75, count: 3 });
  assert.deepEqual(playbackPreferences("bad", "999"), { rate: 1, count: 1 });
  assert.deepEqual(playbackPreferences("100", "5"), { rate: 1.5, count: 5 });
});

test("published CSS URL tracks its content to prevent stale layouts after deployment", async () => {
  const css = await readFile(new URL("../style/study.css", import.meta.url));
  const hash = createHash("sha256").update(css).digest("hex").slice(0, 12);
  const html = await readFile(new URL("../study.html", import.meta.url), "utf8");
  assert.ok(html.includes(`/style/study.css?v=${hash}`));
});

test("dynamic origins reject untrusted links and retain credit in both CSV formats", () => {
  const origin = { id: "wikipedia", name: "Wikipedia", author: "Contributors", title: "Language", url: "https://en.wikipedia.org/wiki/Language", license: "CC BY-SA 4.0", licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/", fetchedAt: new Date().toISOString(), kind: "sentence" };
  assert.equal(validateOrigin(origin), origin);
  assert.throws(() => validateOrigin({ ...origin, url: "javascript:alert(1)" }));
  assert.throws(() => validateOrigin({ ...origin, url: "https://en.wikipedia.org.evil.example/story" }));
  assert.equal(supportsTopic("nasa", "travel"), false);
  const result = { source: "Original sentence.", fullTranslation: "Meaning", sourceLanguage: "en", targetLanguage: "zh-Hans", words: [{ index: 0, source: "sentence", target: "Meaning" }], origin };
  for (const format of ["csv", "anki"]) {
    const csv = exportCSV(result, new Set([0]), format);
    assert.ok(csv.includes("Original URL"));
    assert.ok(csv.includes(origin.url));
    assert.ok(csv.includes(origin.licenseURL));
    assert.ok(csv.includes("not the original publisher"));
  }
});

test("source states and attribution are localized in every interface", () => {
  assert.equal(Object.keys(sourceCopy).length, 7);
  for (const copy of Object.values(sourceCopy)) assert.ok(Object.values(copy).every(value => value.trim()));
});

import test from "node:test";
import assert from "node:assert/strict";
import { recommendationURL, topicIDs, playbackPreferences } from "../js/recommendations.mjs";
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

import test from "node:test";
import assert from "node:assert/strict";
import { analyzeWithGoogle, sentenceWords } from "../js/google-client.mjs";

const snapshot = text => ({ text, sourceLanguage: "en", targetLanguage: "zh-Hans" });
const response = text => new Response(JSON.stringify({ sentences: [{ trans: `translated:${text}` }] }));

test("browser translation preserves word order, deduplicates requests and limits concurrency", async () => {
  const calls = [];
  let running = 0;
  let peak = 0;
  const result = await analyzeWithGoogle(snapshot("Words open new worlds. Words!"), new AbortController().signal, async (url, options) => {
    const params = new URL(url).searchParams;
    assert.equal(new URL(url).hostname, "translate.googleapis.com");
    assert.equal(params.get("tl"), "zh-CN");
    assert.equal(options.credentials, "omit");
    calls.push(params.get("q"));
    peak = Math.max(peak, ++running);
    await new Promise(resolve => setTimeout(resolve, 2));
    running--;
    return response(params.get("q"));
  });
  assert.equal(peak, 3);
  assert.equal(calls.length, 5);
  assert.deepEqual(result.words.map(word => word.source), ["Words", "open", "new", "worlds", "Words"]);
  assert.equal(result.words[0].target, result.words[4].target);
});

test("tokens preserve combining marks and remove surrounding punctuation", () => {
  assert.deepEqual(sentenceWords("क्या भाषा है?", "hi"), ["क्या", "भाषा", "है"]);
  assert.deepEqual(sentenceWords("‘don't’ forget!", "en"), ["don't", "forget"]);
});

test("invalid input never reaches Google", async () => {
  const never = () => assert.fail("must not fetch");
  const signal = new AbortController().signal;
  await assert.rejects(analyzeWithGoogle(snapshot("x".repeat(401)), signal, never), /text_too_long/);
  await assert.rejects(analyzeWithGoogle(snapshot(Array(41).fill("a").join(" ")), signal, never), /text_too_long/);
  await assert.rejects(analyzeWithGoogle({ ...snapshot("Hello"), targetLanguage: "en" }, signal, never), /same_language/);
  await assert.rejects(analyzeWithGoogle({ ...snapshot("Hello"), targetLanguage: "xx" }, signal, never), /unsupported_language/);
});

test("provider refusals are not retried or disguised as network failures", async () => {
  for (const status of [403, 429]) {
    let calls = 0;
    await assert.rejects(analyzeWithGoogle(snapshot("Hello world"), new AbortController().signal, async () => {
      calls++;
      return new Response("", { status });
    }), /rate_limited/);
    assert.equal(calls, 1);
  }
});

test("partial word failure stays explicit and rate limiting stops queued words", async () => {
  let calls = 0;
  const result = await analyzeWithGoogle(snapshot("a b c d e f"), new AbortController().signal, async () => {
    calls++;
    return calls === 1 ? response("sentence") : new Response("", { status: 429 });
  });
  assert.equal(result.warning, "rate_limited");
  assert.ok(calls <= 4);
  assert.ok(result.words.every(word => word.target === null));
});

test("network failure and malformed translation stay distinguishable", async () => {
  const signal = new AbortController().signal;
  await assert.rejects(analyzeWithGoogle(snapshot("Hello"), signal, async () => { throw new TypeError("Failed to fetch"); }), /network_unavailable/);
  await assert.rejects(analyzeWithGoogle(snapshot("Hello"), signal, async () => new Response('{"sentences":[]}')), /translation_failed/);
});

test("cancellation aborts the request without returning a stale result", async () => {
  const controller = new AbortController();
  await assert.rejects(analyzeWithGoogle(snapshot("Hello"), controller.signal, async (_, options) => {
    controller.abort();
    assert.equal(options.signal.aborted, true);
    throw new DOMException("Aborted", "AbortError");
  }), { name: "AbortError" });
});

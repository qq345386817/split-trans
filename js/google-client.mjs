import { languageCodes, characterCount } from "./study-core.mjs";

export function sentenceWords(text, language) {
  if (["zh-Hans", "zh-Hant", "ja", "th"].includes(language)) {
    return [...new Intl.Segmenter(language, { granularity: "word" }).segment(text)].filter(part => part.isWordLike).map(part => part.segment);
  }
  return text.split(/\s+/u).map(word => word.replace(/^[^\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]+$/gu, "")).filter(word => /[\p{L}\p{N}]/u.test(word));
}

export async function analyzeWithGoogle(snapshot, signal, fetchImpl = fetch) {
  const source = snapshot.text.trim().normalize("NFC");
  const { sourceLanguage, targetLanguage } = snapshot;
  const words = sentenceWords(source, sourceLanguage);
  if (!source || characterCount(source) > 400 || !words.length || words.length > 40) throw new Error("text_too_long");
  if (!languageCodes.includes(sourceLanguage) || !languageCodes.includes(targetLanguage)) throw new Error("unsupported_language");
  if (sourceLanguage === targetLanguage) throw new Error("same_language");
  const language = code => ({ "zh-Hans": "zh-CN", "zh-Hant": "zh-TW" })[code] || code;
  const active = new AbortController();
  const abort = () => active.abort(signal.reason);
  if (signal.aborted) abort();
  signal.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => active.abort("timeout"), 45000);
  const translate = async text => {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.search = new URLSearchParams({ client: "gtx", sl: language(sourceLanguage), tl: language(targetLanguage), dt: "t", dj: "1", ie: "UTF-8", q: text }).toString();
    let response;
    try { response = await fetchImpl(url.toString(), { signal: active.signal, credentials: "omit", cache: "no-store", redirect: "error" }); }
    catch (error) {
      if (active.signal.aborted) throw error;
      throw new Error("network_unavailable");
    }
    if ([403, 429].includes(response.status)) throw new Error("rate_limited");
    if (!response.ok) throw new Error("translation_failed");
    const data = await response.json();
    if (!Array.isArray(data?.sentences) || !data.sentences.length || data.sentences.some(part => typeof part?.trans !== "string")) throw new Error("translation_failed");
    const value = data.sentences.map(part => part.trans).join(" ").trim();
    if (!value || value.length > 4000) throw new Error("translation_failed");
    return value;
  };
  try {
    const fullTranslation = await translate(source);
    const unique = [...new Set(words)];
    const meanings = new Map();
    let next = 0;
    let blocked = false;
    await Promise.all(Array.from({ length: Math.min(3, unique.length) }, async () => {
      while (next < unique.length && !blocked && !active.signal.aborted) {
        const word = unique[next++];
        try { meanings.set(word, await translate(word)); }
        catch (error) { meanings.set(word, null); if (error.message === "rate_limited") blocked = true; }
      }
    }));
    if (active.signal.aborted) throw new Error(active.signal.reason === "timeout" ? "timeout" : "cancelled");
    return { source, sourceLanguage, targetLanguage, fullTranslation,
      words: words.map((word, index) => ({ index, source: word, target: meanings.get(word) ?? null })),
      ...(blocked ? { warning: "rate_limited" } : {}) };
  } catch (error) {
    if (active.signal.aborted && active.signal.reason === "timeout") throw new Error("timeout");
    throw error;
  } finally { clearTimeout(timer); signal.removeEventListener("abort", abort); }
}

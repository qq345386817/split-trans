import { languageCodes, characterCount, exportCSV, validateResult } from "./study-core.mjs";
import { analyzeWithGoogle } from "./google-client.mjs";

const copy = JSON.parse(document.getElementById("study-copy").textContent);
const $ = id => document.getElementById(id);
const api = document.querySelector('meta[name="phrasecut-api"]').content;
let controller = null;
let result = null;
const selected = new Set();
let speakingButton = null;
let speechGeneration = 0;
const icon = name => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(svg.namespaceURI, "use");
  use.setAttribute("href", `/images/study-icons.svg#${name}`);
  svg.append(use);
  return svg;
};

const displayNames = new Intl.DisplayNames([copy.lang], { type: "language" });
if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
for (const id of ["source-language", "target-language"]) {
  for (const code of [...languageCodes].sort((a, b) => displayNames.of(a).localeCompare(displayNames.of(b), copy.lang))) {
    $(id).add(new Option(displayNames.of(code), code));
  }
}
$("source-language").value = "en";
$("target-language").value = copy.target;
$("site-language").addEventListener("change", event => { window.location.href = event.target.value; });

function status(message = "", state = "ready") {
  $("status").dataset.state = state;
  $("status").replaceChildren();
  if (state === "busy") $("status").append(icon("loader-circle"));
  $("status").append(document.createTextNode(message));
}

function busy(active, recommending = false) {
  $("study-form").setAttribute("aria-busy", String(active));
  $("analyze").disabled = active;
  $("recommend").disabled = active;
  $("cancel").hidden = !active;
  $("analyze").querySelector("svg").replaceWith(icon(active && !recommending ? "loader-circle" : "scan-text"));
  $("recommend").querySelector("svg").replaceWith(icon(active && recommending ? "loader-circle" : "quote"));
}

function stopSpeech() {
  speechGeneration++;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (speakingButton) {
    speakingButton.dataset.playing = "false";
    speakingButton.setAttribute("aria-label", speakingButton.dataset.listenLabel || copy.listen);
    speakingButton.title = copy.listen;
    speakingButton.replaceChildren(icon("volume-2"));
    speakingButton = null;
  }
}

function reset() {
  controller?.abort();
  controller = null;
  busy(false);
  stopSpeech();
  result = null;
  selected.clear();
  $("results").hidden = true;
  $("word-grid").replaceChildren();
  $("character-count").textContent = `${characterCount($("sentence").value)} / 400`;
  status();
}

for (const id of ["sentence", "source-language", "target-language"]) $(id).addEventListener(id === "sentence" ? "input" : "change", reset);
$("clear").addEventListener("click", () => { $("sentence").value = ""; reset(); $("sentence").focus(); });
$("cancel").addEventListener("click", () => { controller?.abort(); controller = null; busy(false); status(); });
$("paste").addEventListener("click", async () => {
  try { $("sentence").value = await navigator.clipboard.readText(); reset(); $("sentence").focus(); }
  catch { status(copy.pasteFailed, "error"); }
});
$("swap-languages").addEventListener("click", () => {
  const previous = result;
  [$("source-language").value, $("target-language").value] = [$("target-language").value, $("source-language").value];
  if (previous) $("sentence").value = previous.fullTranslation;
  reset();
});

const errorCopy = error => ({ same_language: copy.same, text_too_long: copy.invalid, too_many_words: copy.invalid,
  rate_limited: copy.limited, timeout: copy.timeout })[error] || copy.failed;

async function analyze(active = new AbortController()) {
  const snapshot = { text: $("sentence").value.trim(), sourceLanguage: $("source-language").value, targetLanguage: $("target-language").value };
  if (!snapshot.text || characterCount(snapshot.text) > 400) { busy(false); status(copy.invalid, "error"); return; }
  if (snapshot.sourceLanguage === snapshot.targetLanguage) { busy(false); status(copy.same, "error"); return; }
  controller?.abort();
  controller = active;
  result = null;
  selected.clear();
  stopSpeech();
  $("results").hidden = true;
  busy(true);
  status(copy.analyzing, "busy");
  const timeout = setTimeout(() => active.abort("timeout"), 55000);
  try {
    let data;
    try { data = await analyzeWithGoogle(snapshot, active.signal); }
    catch (error) {
      // Network failures may use the existing proxy; provider refusals are not retried there.
      if (error.message !== "network_unavailable" || active.signal.aborted) throw error;
      const response = await fetch(api, { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(snapshot), signal: active.signal, credentials: "omit", cache: "no-store" });
      data = await response.json();
      if (!response.ok) throw new Error(data.error || "translation_failed");
    }
    if (controller !== active || active.signal.aborted) return;
    result = validateResult(data, snapshot);
    renderResult();
    status(result.warning === "rate_limited" ? copy.limited : result.words.some(word => word.target === null) ? copy.partial : copy.ready);
    $("results").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  } catch (error) {
    if (controller !== active) return;
    if (active.signal.aborted) { if (active.signal.reason === "timeout") status(copy.timeout, "error"); }
    else status(errorCopy(error.message), "error");
  } finally {
    clearTimeout(timeout);
    if (controller === active) { controller = null; busy(false); }
  }
}

$("study-form").addEventListener("submit", event => { event.preventDefault(); analyze(); });
$("recommend").addEventListener("click", async () => {
  controller?.abort();
  const active = new AbortController();
  controller = active;
  busy(true, true);
  status(copy.finding, "busy");
  const timeout = setTimeout(() => active.abort("timeout"), 12000);
  try {
    const response = await fetch("https://quote.luopeike.com/quotes/random?limit=1&minLength=35&maxLength=160", { signal: active.signal, credentials: "omit", cache: "no-store" });
    if (!response.ok) throw new Error("quote_failed");
    const quotes = await response.json();
    if (controller !== active || active.signal.aborted) return;
    if (typeof quotes[0]?.content !== "string" || characterCount(quotes[0].content) > 400) throw new Error("quote_failed");
    $("sentence").value = quotes[0].content;
    $("character-count").textContent = `${characterCount(quotes[0].content)} / 400`;
    $("source-language").value = "en";
    if ($("target-language").value === "en") $("target-language").value = copy.target;
    clearTimeout(timeout);
    controller = null;
    await analyze(active);
  } catch {
    if (controller === active) {
      if (!active.signal.aborted || active.signal.reason === "timeout") status(copy.quoteFailed, "error");
      controller = null;
      busy(false);
    }
  } finally { clearTimeout(timeout); }
});

function renderResult() {
  $("result-source").textContent = result.source;
  $("result-translation").textContent = result.fullTranslation;
  $("result-source").lang = result.sourceLanguage;
  $("result-translation").lang = result.targetLanguage;
  $("word-grid").replaceChildren();
  for (const word of result.words) {
    const item = document.createElement("article");
    item.className = "word";
    const source = document.createElement("div");
    source.className = "word-source";
    source.dir = "auto";
    source.lang = result.sourceLanguage;
    source.textContent = word.source;
    const target = document.createElement("div");
    target.className = "word-target";
    target.dir = "auto";
    target.lang = result.targetLanguage;
    target.textContent = word.target || copy.missing;
    const actions = document.createElement("div");
    actions.className = "word-actions";
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `${copy.select}: ${word.source}`);
    checkbox.disabled = word.target === null;
    checkbox.checked = word.target !== null;
    if (checkbox.checked) selected.add(word.index);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected.add(word.index); else selected.delete(word.index);
      item.dataset.selected = String(checkbox.checked);
      updateSelection();
    });
    item.dataset.selected = String(checkbox.checked);
    label.append(checkbox);
    const play = document.createElement("button");
    play.type = "button";
    play.className = "icon-button speech";
    play.title = copy.listen;
    play.setAttribute("aria-label", `${copy.listen}: ${word.source}`);
    play.append(icon("volume-2"));
    play.addEventListener("click", () => speak(word.source, result.sourceLanguage, play));
    actions.append(label, play);
    item.append(source, target, actions);
    $("word-grid").append(item);
  }
  $("results").hidden = false;
  updateSelection();
}

function updateSelection() {
  $("selection-count").textContent = `${selected.size} ${copy.selected}`;
  $("export").disabled = selected.size === 0;
  const eligible = result.words.filter(word => word.target).length;
  $("select-all").disabled = eligible === 0;
  $("select-all").textContent = eligible > 0 && selected.size === eligible ? copy.deselect : copy.selectAll;
}
$("select-all").addEventListener("click", () => {
  const all = selected.size === result.words.filter(word => word.target).length;
  $("word-grid").querySelectorAll('input:not(:disabled)').forEach(input => { input.checked = !all; input.dispatchEvent(new Event("change")); });
});
$("copy-result").addEventListener("click", async () => {
  if (!result) return;
  const current = result;
  try { await navigator.clipboard.writeText(current.fullTranslation); if (result === current && !controller) status(copy.copied); }
  catch { if (result === current && !controller) status(copy.copyFailed, "error"); }
});
$("export").addEventListener("click", () => {
  if (!result || !selected.size) return;
  const format = $("export-format").value;
  const blob = new Blob([exportCSV(result, selected, format)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `PhraseCut-${result.sourceLanguage}-${result.targetLanguage}${format === "anki" ? "-Anki" : ""}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
});

function speak(text, language, button) {
  const toggleOff = speakingButton === button;
  stopSpeech();
  if (toggleOff) return;
  if (!("speechSynthesis" in window)) { status(copy.noVoice, "error"); return; }
  const voiceLanguage = { "zh-Hans": "zh-CN", "zh-Hant": "zh-TW", pt: "pt-BR" }[language] || language;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(voice => voice.lang.toLowerCase() === voiceLanguage.toLowerCase()) ||
    voices.find(voice => voice.lang.toLowerCase().startsWith(voiceLanguage.toLowerCase() + "-"));
  if (!voice) { status(copy.noVoice, "error"); return; }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceLanguage;
  utterance.voice = voice;
  utterance.rate = .85;
  const generation = speechGeneration;
  speakingButton = button;
  if (!button.dataset.listenLabel) button.dataset.listenLabel = button.getAttribute("aria-label");
  button.classList.add("speech");
  button.dataset.playing = "true";
  button.setAttribute("aria-label", copy.stop);
  button.title = copy.stop;
  button.replaceChildren(icon("square"));
  utterance.onend = () => { if (generation === speechGeneration) stopSpeech(); };
  utterance.onerror = event => { if (generation === speechGeneration) { stopSpeech(); if (!["canceled", "interrupted"].includes(event.error)) status(copy.speechFailed, "error"); } };
  speechSynthesis.speak(utterance);
}
$("listen-sentence").addEventListener("click", () => { if (result) speak(result.source, result.sourceLanguage, $("listen-sentence")); });
window.addEventListener("pagehide", () => { controller?.abort(); stopSpeech(); });

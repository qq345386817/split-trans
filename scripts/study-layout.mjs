import { topicIDs, sources } from "../js/recommendations.mjs";

export const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const icon = name => `<svg class="icon" aria-hidden="true"><use href="/images/study-icons.svg#${name}"></use></svg>`;
const button = (id, name, label, extra = "") => `<button id="${id}" type="button" ${extra}>${icon(name)}<span>${escape(label)}</span></button>`;

// Home and /study mount the same workspace and use the same translation module.
export function renderWorkspace(copy) {
  return `<form id="study-form" class="study-workspace">
<div class="language-pair"><label>${copy.source}<select id="source-language" required></select></label>${button("swap-languages", "arrow-left-right", copy.swap, `class="icon-button" title="${copy.swap}" aria-label="${copy.swap}"`)}<label>${copy.targetLabel}<select id="target-language" required></select></label></div>
<div class="input-heading"><label for="sentence">${copy.sentence}</label><div class="input-tools">${button("paste", "clipboard", copy.paste, `class="icon-button" title="${copy.paste}" aria-label="${copy.paste}"`)}${button("clear", "x", copy.clear, `class="icon-button" title="${copy.clear}" aria-label="${copy.clear}"`)}</div></div>
<div id="recommendation-origin" class="recommendation-origin" hidden></div>
<textarea id="sentence" rows="4" maxlength="800" placeholder="${escape(copy.placeholder)}" required spellcheck="false" dir="auto"></textarea>
<div class="input-footer"><span id="character-count">0 / 400</span><div class="workspace-actions">${button("recommend", "quote", copy.recommend, 'class="secondary"')}<button id="analyze" type="submit" class="primary">${icon("scan-text")}<span>${copy.analyze}</span></button>${button("cancel", "x", copy.cancel, 'hidden')}</div></div>
<div class="recommendation-filters"><label>${copy.topic}<select id="recommendation-topic">${topicIDs.map((id, index) => `<option value="${id}">${escape(copy.topics[index])}</option>`).join("")}</select></label><label>${copy.length}<select id="recommendation-length">${copy.lengths.map((label, index) => `<option value="${index}">${escape(label)}</option>`).join("")}</select></label><label>${copy.sourceLabel}<select id="recommendation-source">${sources.map(source => `<option value="${source.id}">${escape(source.name || copy.allSources)}</option>`).join("")}</select></label></div>
<p class="privacy-note">${copy.notice} <a href="privacy-policy">${copy.privacy}</a></p>
</form>
<div id="status" class="study-status" role="status" aria-live="polite"></div>
<noscript><p>${copy.noJS}</p></noscript>
<section id="results" hidden aria-labelledby="result-heading">
<div class="result-heading"><h2 id="result-heading">${copy.result}</h2><div>${button("listen-sentence", "volume-2", copy.listen, `class="icon-button" title="${copy.listen}" aria-label="${copy.listen}"`)}${button("copy-result", "copy", copy.copy, `class="icon-button" title="${copy.copy}" aria-label="${copy.copy}"`)}</div></div>
<p id="result-source" class="result-source" dir="auto"></p><p id="result-translation" class="result-translation" dir="auto"></p>
<div class="listening-settings"><label>${copy.speed}<select id="speech-rate">${[0.5, 0.75, 1, 1.25, 1.5].map(value => `<option value="${value}"${value === 1 ? " selected" : ""}>${value}x</option>`).join("")}</select></label><label>${copy.repeat}<select id="speech-repeat">${[1, 3, 5].map((value, index) => `<option value="${value}">${escape(copy.counts[index])}</option>`).join("")}</select></label></div>
<div class="word-heading"><h2>${copy.words}</h2><button id="select-all" type="button" class="text-button">${copy.selectAll}</button></div><div id="word-grid" class="word-grid"></div>
<div class="export-toolbar"><span id="selection-count" aria-live="polite"></span><label class="export-format">${copy.format}<select id="export-format"><option value="csv">${copy.csv}</option><option value="anki">${copy.anki}</option></select></label>${button("export", "download", copy.export, 'class="secondary"')}</div>
</section>`;
}

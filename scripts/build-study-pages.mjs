import { readFile, writeFile, readdir, mkdir, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { locales } from "./study-locales.mjs";
import { searchCopy } from "./search-copy.mjs";
import { languageCodes } from "../js/study-core.mjs";
import { interestCopy } from "./interest-copy.mjs";
import { topicIDs } from "../js/recommendations.mjs";
import { workflowCopy } from "./workflow-copy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const studyStyleVersion = createHash("sha256").update(await readFile(`${root}style/study.css`)).digest("hex").slice(0, 12);
const origin = "https://phrase-cut.luopeike.com";
const appStore = "https://apps.apple.com/app/id6740488386";
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const pathFor = copy => `${copy.folder ? `/${copy.folder}` : ""}/study`;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="/images/study-icons.svg#${name}"></use></svg>`;
const button = (id, name, label, extra = "") => `<button id="${id}" type="button" ${extra}>${icon(name)}<span>${escape(label)}</span></button>`;
const protectEmailLinks = html => html.replace(/(?:<!--email_off-->)?(<a\b[^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>)(?:<!--\/email_off-->)?/g,
  (_, link) => `<!--email_off-->${link}<!--/email_off-->`);

const symbols = await Promise.all(["arrow-left-right", "volume-2", "square", "clipboard", "x", "quote", "scan-text", "download", "copy", "check", "book-open", "loader-circle"].map(async name => {
  const svg = await readFile(new URL(`../node_modules/lucide-static/icons/${name}.svg`, import.meta.url), "utf8");
  return `<symbol id="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg.replace(/<svg[\s\S]*?>/, "").replace(/<\/svg>\s*$/, "")}</symbol>`;
}));
await writeFile(`${root}images/study-icons.svg`, `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>\n`);
await cp(new URL("../node_modules/lucide-static/LICENSE", import.meta.url), `${root}images/LICENSE-lucide.txt`);

const privacyDates = {
  en: "Effective date: October 12, 2026", "zh-Hans": "生效日期：2026 年 10 月 12 日", "zh-Hant": "生效日期：2026 年 10 月 12 日",
  hi: "प्रभावी तिथि: 12 अक्टूबर 2026", id: "Tanggal berlaku: 12 Oktober 2026", vi: "Ngày có hiệu lực: 12 tháng 10, 2026", "pt-BR": "Data de vigência: 12 de outubro de 2026"
};

for (const baseCopy of Object.values(locales)) {
  const seo = searchCopy[baseCopy.lang];
  const copy = { ...baseCopy, ...interestCopy[baseCopy.lang], title: seo.toolTitle, description: seo.toolDescription };
  const url = origin + pathFor(copy);
  const alternates = Object.values(locales).map(other => `<link rel="alternate" hreflang="${other.lang}" href="${origin + pathFor(other)}">`).join("\n");
  const options = Object.values(locales).map(other => `<option value="${pathFor(other)}"${other.lang === copy.lang ? " selected" : ""}>${other.name}</option>`).join("");
  const languageNames = new Intl.DisplayNames([copy.lang], { type: "language" });
  const supportedNames = new Intl.ListFormat(copy.lang, { style: "long", type: "conjunction" }).format(languageCodes.map(code => languageNames.of(code)));
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: seo.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  const data = JSON.stringify(copy).replaceAll("<", "\\u003c");
  const html = `<!DOCTYPE html>
<html lang="${copy.lang}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(copy.title)}</title><meta name="description" content="${escape(copy.description)}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#2F6BFF">
<meta name="phrasecut-api" content="https://quote.luopeike.com/study/analyze">
<meta property="og:title" content="${escape(copy.title)}"><meta property="og:description" content="${escape(copy.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/favicon/android-chrome-512x512.png">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(copy.title)}"><meta name="twitter:description" content="${escape(copy.description)}"><meta name="twitter:image" content="${origin}/favicon/android-chrome-512x512.png">
<link rel="canonical" href="${url}">${alternates}<link rel="alternate" hreflang="x-default" href="${origin}/study">
<link rel="describedby" href="/llms.txt" type="text/plain">
<link rel="icon" href="/favicon/favicon.ico"><link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
<link rel="stylesheet" href="/style/base.css"><link rel="stylesheet" href="/style/study.css?v=${studyStyleVersion}">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "@id": url + "#application", name: "PhraseCut Online", applicationCategory: "EducationalApplication", operatingSystem: "Web", url, description: copy.description, inLanguage: copy.lang, isAccessibleForFree: true, featureList: ["Sentence translation", "Individual word translation", "Browser pronunciation", "CSV export", "Anki-compatible CSV export"], publisher: { "@type": "Person", name: "Peter Luo" }, isPartOf: { "@type": "WebSite", name: "PhraseCut", url: origin + "/" } })}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
<script id="study-copy" type="application/json">${data}</script><script type="module" src="/js/study.mjs"></script>
</head>
<body class="study-page"><div class="page"><div class="container">
<header class="topbar"><a class="brand" href="./"><img src="/favicon/apple-touch-icon.png" alt=""><span>PhraseCut</span></a><nav class="nav"><a href="./">${copy.home}</a><a href="help">${copy.help}</a><a href="privacy-policy">${copy.privacy}</a><select class="language-switch" id="site-language" aria-label="Language">${options}</select><a class="download-link" href="${appStore}?ct=website-study&mt=8">${copy.download}</a></nav></header>
<main>
<header class="study-heading"><h1>${copy.heading}</h1></header>
<form id="study-form" class="study-workspace">
<div class="language-pair"><label>${copy.source}<select id="source-language" required></select></label>${button("swap-languages", "arrow-left-right", copy.swap, `class="icon-button" title="${copy.swap}" aria-label="${copy.swap}"`)}<label>${copy.targetLabel}<select id="target-language" required></select></label></div>
<div class="input-heading"><label for="sentence">${copy.sentence}</label><div class="input-tools">${button("paste", "clipboard", copy.paste, `class="icon-button" title="${copy.paste}" aria-label="${copy.paste}"`)}${button("clear", "x", copy.clear, `class="icon-button" title="${copy.clear}" aria-label="${copy.clear}"`)}</div></div>
<textarea id="sentence" rows="4" maxlength="800" placeholder="${escape(copy.placeholder)}" required spellcheck="false" dir="auto"></textarea>
<div class="input-footer"><span id="character-count">0 / 400</span><div class="workspace-actions">${button("recommend", "quote", copy.recommend, 'class="secondary"')}<button id="analyze" type="submit" class="primary">${icon("scan-text")}<span>${copy.analyze}</span></button>${button("cancel", "x", copy.cancel, 'hidden')}</div></div>
<div class="recommendation-filters"><label>${copy.topic}<select id="recommendation-topic">${topicIDs.map((id, index) => `<option value="${id}">${escape(copy.topics[index])}</option>`).join("")}</select></label><label>${copy.length}<select id="recommendation-length">${copy.lengths.map((label, index) => `<option value="${index}">${escape(label)}</option>`).join("")}</select></label></div>
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
</section>
<aside class="app-invitation"><img src="/favicon/apple-touch-icon.png" alt="" width="48" height="48"><div><h2>${copy.appTitle}</h2><p>${copy.appBody}</p></div><a class="button" href="${appStore}?ct=website-study&mt=8">${copy.download}</a></aside>
<section class="study-questions" aria-labelledby="questions-heading"><h2 id="questions-heading">${seo.questionsHeading}</h2>
${seo.faqs.map(([question, answer]) => `<details class="study-question"><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join("\n")}
<h3>${seo.languageHeading}</h3><p>${escape(supportedNames)}</p></section>
</main><footer class="footer"><div class="footer-links"><a href="help">${copy.help}</a><a href="privacy-policy">${copy.privacy}</a><a href="mailto:cameoshell09@gmail.com">cameoshell09@gmail.com</a></div></footer>
</div></div></body></html>\n`;
  await writeFile(`${root}${copy.folder ? `${copy.folder}/` : ""}study.html`, protectEmailLinks(html));

  const folder = `${root}${copy.folder ? `${copy.folder}/` : ""}`;
  for (const filename of await readdir(folder)) {
    if (!filename.endsWith(".html") || filename === "study.html" || filename === "404.html" || filename.startsWith("google")) continue;
    const file = folder + filename;
    let content = await readFile(file, "utf8");
    if (!content.includes('class="online-nav"')) content = content.replace(/(<nav class="nav"[^>]*>)/, `$1<a class="online-nav" href="study">${copy.online}</a>`);
    if (filename === "index.html" && !content.includes('class="button primary online-link"')) {
      content = content.replace('<div class="actions"><a class="button primary"', `<div class="actions"><a class="button primary online-link" href="study">${copy.online}</a><a class="button"`);
    }
    if (filename === "index.html") {
      content = content.replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.homeTitle)}</title>`)
        .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(")/g, `$1${escape(seo.homeDescription)}$2`)
        .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(")/g, `$1${escape(seo.homeTitle)}$2`)
        .replace(/(<section class="hero"><div class="hero-copy"><p class="kicker">)[^<]*(<\/p>)/, `$1${seo.homeKicker}$2`)
        .replace(/(<section class="hero">[\s\S]*?<p class="lead">)[^<]*(<\/p>)/, `$1${seo.homeLead}$2`)
        .replace(/<section data-search-overview>[\s\S]*?<\/section>/, "");
      content = content.replace("</section>", `</section><section data-search-overview><h2><a href="study">${seo.overviewHeading}</a></h2><p>${seo.overview}</p></section>`);
      content = content.replace(/<section data-study-workflow>[\s\S]*?<\/section>/, "");
      const workflow = workflowCopy[copy.lang];
      content = content.replace("</main>", `<section data-study-workflow><h2>${escape(workflow.title)}</h2><p>${escape(workflow.body)}</p><a href="study">${copy.online}</a></section></main>`);
      content = content.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (tag, text) => {
        const schema = JSON.parse(text);
        if (schema["@type"] !== "SoftwareApplication") return tag;
        schema.description = copy.appBody;
        schema["@id"] = origin + "/#native-app";
        // Price and reviews are not invented to qualify for software rich results.
        delete schema.offers;
        return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
      });
    }
    if (!content.includes('rel="describedby"')) content = content.replace("</head>", '<link rel="describedby" href="/llms.txt" type="text/plain">\n</head>');
    if (filename === "privacy-policy.html") {
      content = content.replace(/<p class="lead">[^<]*<\/p>/, `<p class="lead">${privacyDates[copy.lang]}</p>`);
      content = content.replace(/<section data-web-privacy>[\s\S]*?<\/section>/, "");
      content = content.replace("</main>", `<section data-web-privacy><h2>${copy.privacyTitle}</h2><p>${copy.privacyBody}</p></section></main>`);
    }
    await writeFile(file, protectEmailLinks(content));
  }
}
let sitemap = await readFile(`${root}sitemap.xml`, "utf8");
for (const copy of Object.values(locales)) {
  const url = origin + pathFor(copy);
  if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${url}</loc></url>\n</urlset>`);
}
await writeFile(`${root}sitemap.xml`, sitemap);
const facts = `# PhraseCut\n\n> PhraseCut helps people learn vocabulary from sentences they like. It provides a free online sentence translator and native apps for iPhone, iPad, and Mac.\n\n## Online tool\n\nThe website translates a whole sentence and individual words, offers browser pronunciation, and exports selected words to CSV or Anki-compatible CSV. No account is needed. Translation is online Google machine translation from the browser, with a Cloudflare proxy available for network failures. The web endpoint can be rate-limited. Provider refusals are not retried through the proxy. Each analysis accepts up to 400 Unicode characters and 40 words. The website does not save history or maintain a review library. Individual word translations are not contextual AI tutor explanations.\n\nThe CSV columns are Word, Meaning, Sentence, Translation, Source language, and Target language. Anki export is CSV, not an APKG deck. Translation languages: ${new Intl.ListFormat("en").format(languageCodes.map(code => new Intl.DisplayNames(["en"], { type: "language" }).of(code)))}.\n\n## Native apps\n\nThe iPhone, iPad, and Mac apps add a local study library, saved words and sentences, spaced repetition, and library exports. They use Apple Translation, which can work offline after the required language packs are downloaded. They are not limited to learning English. The website and native app use different translation engines.\n\n## Canonical pages\n\n- [Online sentence translator](${origin}/study): The working web tool.\n- [App and website overview](${origin}/): Product overview.\n- [Help](${origin}/help): Native app help.\n- [Privacy](${origin}/privacy-policy): Text processing and local storage boundaries.\n- [App Store](${appStore}): The native app listing.\n`;
await writeFile(`${root}product-facts.md`, facts);
await writeFile(`${root}llms.txt`, `# PhraseCut\n\n> Learn vocabulary from sentences you like, with a free online sentence translator and native apps for iPhone, iPad, and Mac.\n\nThe website has no saved history or review library. Native apps provide local saving and spaced repetition. This file is an optional navigation aid, not a sitemap, robots policy, or Google ranking requirement.\n\n## Product\n\n- [Product facts](${origin}/product-facts.md): Accurate feature boundaries, translation providers, language support, and CSV format.\n- [Online tool](${origin}/study): Sentence and word-by-word translation, pronunciation, CSV and Anki CSV export.\n- [Help](${origin}/help): Native app learning and review workflow.\n\n## Learning guides\n\n- [Learn words from sentences](${origin}/learn-words-from-sentences): A practical workflow with examples.\n- [Sentence-based vocabulary](${origin}/sentence-based-vocabulary): Keep words connected to their context.\n- [CSV and Anki export](${origin}/export-language-study-materials): Web exports and native library exports.\n\n## Localized tools\n\n${Object.values(locales).map(copy => `- [${copy.name}](${origin + pathFor(copy)}): ${searchCopy[copy.lang].toolDescription}`).join("\n")}\n\n## Optional\n\n- [Privacy](${origin}/privacy-policy): How text is processed.\n- [Support](${origin}/support): Contact the developer.\n- [App Store](${appStore}): Download the native app.\n`);
const output = `${root}dist`;
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of await readdir(root)) {
  if (file.endsWith(".html") || ["robots.txt", "sitemap.xml", "llms.txt", "product-facts.md", "_headers", "_redirects", "favicon", "images", "style", "js", ...Object.keys(locales).filter(key => key !== "en")].includes(file)) {
    await cp(`${root}${file}`, `${output}/${file}`, { recursive: true });
  }
}
console.log("Built 7 localized study pages, navigation, privacy notices, icon sprite, and sitemap.");

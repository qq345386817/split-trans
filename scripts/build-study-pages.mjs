import { readFile, writeFile, readdir, mkdir, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { locales } from "./study-locales.mjs";
import { searchCopy } from "./search-copy.mjs";
import { languageCodes } from "../js/study-core.mjs";
import { interestCopy } from "./interest-copy.mjs";
import { topicIDs, sources } from "../js/recommendations.mjs";
import { sourceCopy, sourceFAQ, sourceOverview } from "./source-copy.mjs";
import { workflowCopy } from "./workflow-copy.mjs";
import { renderWorkspace } from "./study-layout.mjs";
import { homeCopy } from "./home-copy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const theme = JSON.parse(await readFile(`${root}design-system/tokens.json`, "utf8"));
const themeCSS = theme.color.themes.map(({ id }, index) => {
  const values = theme.color.tokens.map(token => {
    const value = typeof token.value === "string" ? token.value : token.value[id];
    return `  --${token.name}: ${/^\{[^}]+\}$/.test(value) ? `var(--${value.slice(1, -1)})` : value};`;
  }).join("\n");
  return `${index === 0 ? ":root" : "@media (prefers-color-scheme: dark) { :root"} {\n${values}\n}${index === 0 ? "" : " }"}`;
}).join("\n") + `\n:root { --font-sans: ${theme.type.families.sans}; ${[...theme.spacing.tokens, ...theme.radius.tokens].map(token => `--${token.name}: ${token.value};`).join(" ")} ${theme.type.groups.flatMap(group => group.styles.map(style => `--type-${style.name}-size: ${style.fontSize}; --type-${style.name}-line: ${style.lineHeight}; --type-${style.name}-weight: ${style.fontWeight};`)).join(" ")} }\n`;
await writeFile(`${root}style/theme.css`, `/* Generated from design-system/tokens.json. */\n${themeCSS}`);
const baseStyleVersion = createHash("sha256").update(await readFile(`${root}style/base.css`)).digest("hex").slice(0, 12);
const themeVersion = createHash("sha256").update(themeCSS).digest("hex").slice(0, 12);
const studyStyleVersion = createHash("sha256").update(await readFile(`${root}style/study.css`)).digest("hex").slice(0, 12);
const origin = "https://phrase-cut.luopeike.com";
const appStore = "https://apps.apple.com/app/id6740488386";
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const pathFor = copy => `${copy.folder ? `/${copy.folder}` : ""}/study`;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="/images/study-icons.svg#${name}"></use></svg>`;
const protectEmailLinks = html => html.replace(/(?:<!--email_off-->)?(<a\b[^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>)(?:<!--\/email_off-->)?/g,
  (_, link) => `<!--email_off-->${link}<!--/email_off-->`);
const contentSources = [
  ["Wikipedia", "https://en.wikipedia.org/"],
  ["Global Voices", "https://globalvoices.org/"],
  ["NASA", "https://www.nasa.gov/rss-feeds/"],
  ["Wikivoyage", "https://en.wikivoyage.org/"]
];
const sourceSection = lang => `<section data-content-sources><h2>${escape(sourceOverview[lang].heading)}</h2><p>${escape(sourceOverview[lang].body)}</p><p>${contentSources.map(([name, url]) => `<a href="${url}">${name}</a>`).join(" · ")}</p><p>${escape(sourceOverview[lang].languageAnswer)}</p></section>`;

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
  const copy = { ...baseCopy, ...interestCopy[baseCopy.lang], ...sourceCopy[baseCopy.lang], title: seo.toolTitle, description: seo.toolDescription };
  const url = origin + pathFor(copy);
  const alternates = Object.values(locales).map(other => `<link rel="alternate" hreflang="${other.lang}" href="${origin + pathFor(other)}">`).join("\n");
  const options = Object.values(locales).map(other => `<option value="${pathFor(other)}"${other.lang === copy.lang ? " selected" : ""}>${other.name}</option>`).join("");
  const languageNames = new Intl.DisplayNames([copy.lang], { type: "language" });
  const supportedNames = new Intl.ListFormat(copy.lang, { style: "long", type: "conjunction" }).format(languageCodes.map(code => languageNames.of(code)));
  const faqs = [...seo.faqs, [sourceFAQ[copy.lang].sourceQuestion, sourceFAQ[copy.lang].sourceAnswer], [sourceOverview[copy.lang].languageQuestion, sourceOverview[copy.lang].languageAnswer]];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
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
<link rel="stylesheet" href="/style/theme.css?v=${themeVersion}"><link rel="stylesheet" href="/style/base.css?v=${baseStyleVersion}"><link rel="stylesheet" href="/style/study.css?v=${studyStyleVersion}">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "@id": url + "#application", name: "PhraseCut Online", applicationCategory: "EducationalApplication", operatingSystem: "Web", url, description: copy.description, inLanguage: copy.lang, isAccessibleForFree: true, featureList: ["Sentence translation", "Individual word translation", "Interest-based English excerpts from updating public RSS/API sources", "Original article and license attribution", "Browser pronunciation with adjustable speed and repeats", "CSV export", "Anki-compatible CSV export"], publisher: { "@type": "Person", name: "Peter Luo" }, isPartOf: { "@type": "WebSite", name: "PhraseCut", url: origin + "/" } })}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
<script id="study-copy" type="application/json">${data}</script><script type="module" src="/js/study.mjs"></script>
</head>
<body class="study-page"><div class="page"><div class="container">
<header class="topbar"><a class="brand" href="./"><img src="/favicon/apple-touch-icon.png" alt=""><span>PhraseCut</span></a><nav class="nav"><a href="./">${copy.home}</a><a href="help">${copy.help}</a><a href="privacy-policy">${copy.privacy}</a><select class="language-switch" id="site-language" aria-label="Language">${options}</select><a class="download-link" href="${appStore}?ct=website-study&mt=8">${copy.download}</a></nav></header>
<main>
<header class="study-heading"><h1>${copy.heading}</h1></header>
${renderWorkspace(copy)}
<aside class="app-invitation"><img src="/favicon/apple-touch-icon.png" alt="" width="48" height="48"><div><h2>${copy.appTitle}</h2><p>${copy.appBody}</p></div><a class="button" href="${appStore}?ct=website-study&mt=8">${copy.download}</a></aside>
${sourceSection(copy.lang)}
<section class="study-questions" aria-labelledby="questions-heading"><h2 id="questions-heading">${seo.questionsHeading}</h2>
${faqs.map(([question, answer]) => `<details class="study-question"><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join("\n")}
<h3>${seo.languageHeading}</h3><p>${escape(supportedNames)}</p></section>
</main><footer class="footer"><div class="footer-links"><a href="help">${copy.help}</a><a href="privacy-policy">${copy.privacy}</a><a href="mailto:cameoshell09@gmail.com">cameoshell09@gmail.com</a></div></footer>
</div></div></body></html>\n`;
  await writeFile(`${root}${copy.folder ? `${copy.folder}/` : ""}study.html`, protectEmailLinks(html));

  const folder = `${root}${copy.folder ? `${copy.folder}/` : ""}`;
  for (const filename of await readdir(folder)) {
    if (!filename.endsWith(".html") || filename === "study.html" || filename.startsWith("google")) continue;
    const file = folder + filename;
    let content = await readFile(file, "utf8");
    content = content.replace(/<link rel="stylesheet" href="[^"]*style\/theme\.css[^\"]*">\n?/g, "");
    content = content.replace(/<link rel="stylesheet" href="[^"]*style\/base\.css[^\"]*">/, `<link rel="stylesheet" href="/style/theme.css?v=${themeVersion}"><link rel="stylesheet" href="/style/base.css?v=${baseStyleVersion}">`);
    if (!content.includes('class="online-nav"')) content = content.replace(/(<nav class="nav"[^>]*>)/, `$1<a class="online-nav" href="study">${copy.online}</a>`);
    if (filename === "index.html") {
      const home = homeCopy[copy.lang];
      const nativeFAQ = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(schema => schema["@type"] === "FAQPage");
      const screenshot = copy.folder === "pt-br" ? "pt_BR" : copy.lang === "en" ? "en_US" : copy.lang.replace("-", "_");
      const nativeQuestions = nativeFAQ.mainEntity.map(item => `<details class="faq-item"><summary>${escape(item.name)}</summary><p>${escape(item.acceptedAnswer.text)}</p></details>`).join("\n");
      content = content.replace(/<main>[\s\S]*?<\/main>/, `<main>
<header class="home-heading"><h1>PhraseCut</h1><p class="lead">${escape(home.tagline)}</p></header>
${renderWorkspace(copy)}
<section class="native-section" id="app"><div class="native-heading"><div><h2>${escape(home.nativeTitle)}</h2><p>${escape(home.nativeBody)}</p></div><a class="button primary" href="${appStore}?ct=website-home&mt=8">${icon("download")}${copy.download}</a></div>
<figure class="native-screenshot"><picture><source media="(prefers-color-scheme: dark)" srcset="/images/app/mac_${screenshot}_dark_learn.webp"><img src="/images/app/mac_${screenshot}_light_learn.webp" alt="${escape(home.imageAlt)}" width="1218" height="932" loading="lazy" decoding="async"></picture><figcaption>${escape(home.imageCaption)}</figcaption></figure></section>
<section data-study-workflow><h2>${escape(workflowCopy[copy.lang].title)}</h2><div class="learning-steps">${home.steps.map(([title, body], index) => `<article><span class="step-number">0${index + 1}</span><h3>${escape(title)}</h3><p>${escape(body)}</p></article>`).join("")}</div></section>
<section data-search-overview><h2><a href="study">${seo.overviewHeading}</a></h2><p>${seo.overview}</p><a class="text-link" href="help">${copy.help}</a></section>
${sourceSection(copy.lang)}
<section class="home-faq"><h2>${escape(home.nativeFAQ)}</h2>${nativeQuestions}</section>
${copy.lang === "en" ? `<section class="home-guides"><h2>${home.guide}</h2><div class="guide-links"><a href="learn-words-from-sentences">How to learn words from sentences</a><a href="sentence-based-vocabulary">Sentence-based vocabulary</a><a href="export-language-study-materials">CSV and Anki export</a></div></section>` : ""}
</main>`);
      content = content.replace(/<body[^>]*>/, '<body class="study-page home-page">');
      const homeOptions = Object.values(locales).map(other => `<option value="${other.folder ? `/${other.folder}/` : "/"}"${other.lang === copy.lang ? " selected" : ""}>${other.name}</option>`).join("");
      content = content.replace(/<nav class="nav"[^>]*>[\s\S]*?<\/nav>/, `<nav class="nav" aria-label="PhraseCut"><a href="help">${copy.help}</a><a href="privacy-policy">${copy.privacy}</a><select class="language-switch" id="site-language" aria-label="Language">${homeOptions}</select><a class="download-link" href="${appStore}?ct=website-nav&mt=8">${copy.download}</a></nav>`);
      content = content.replace(/<script id="study-copy" type="application\/json">[\s\S]*?<\/script>\n?/g, "");
      content = content.replace(/<script type="application\/ld\+json" data-web-workspace>[\s\S]*?<\/script>\n?/g, "");
      const homeURL = `${origin}/${copy.folder ? copy.folder + "/" : ""}`;
      const webSchema = { "@context": "https://schema.org", "@type": "WebApplication", "@id": homeURL + "#workspace", name: "PhraseCut Online", url: homeURL, applicationCategory: "EducationalApplication", operatingSystem: "Web", isAccessibleForFree: true, inLanguage: copy.lang, description: seo.toolDescription };
      content = content.replace("</head>", `<script type="application/ld+json" data-web-workspace>${JSON.stringify(webSchema)}</script>\n</head>`);
      if (!content.includes('src="/js/study.mjs"')) content = content.replace("</head>", '<script type="module" src="/js/study.mjs"></script>\n</head>');
      if (!content.includes('name="phrasecut-api"')) content = content.replace("</head>", '<meta name="phrasecut-api" content="https://quote.luopeike.com/study/analyze">\n</head>');
      content = content.replace(/<link rel="stylesheet" href="[^\"]*style\/study\.css[^\"]*">/g, "");
      content = content.replace("</head>", `<link rel="stylesheet" href="/style/study.css?v=${studyStyleVersion}"><script id="study-copy" type="application/json">${data}</script>\n</head>`);
      content = content.replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.homeTitle)}</title>`)
        .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(")/g, `$1${escape(seo.homeDescription)}$2`)
        .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(")/g, `$1${escape(seo.homeTitle)}$2`);
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
const facts = `# PhraseCut

> Learn words from sentences you like: your own text or English excerpts from updating public sources. The free online tool translates sentences and words, offers listening practice, and exports CSV. Native apps add local saving and spaced repetition.

## Online tool

The website translates a whole sentence and individual words, offers browser pronunciation with adjustable speed and repeats, and exports selected words to CSV or Anki-compatible CSV. No account is needed. Translation is online Google machine translation from the browser, with a Cloudflare proxy available for network failures. The web endpoint can be rate-limited. Provider refusals are not retried through the proxy. Each analysis accepts up to 400 Unicode characters and 40 words. The website does not save history or maintain a review library. Individual word translations are not contextual AI tutor explanations. Available browser voices depend on the user's device; pronunciation is synthesized speech, not a publisher recording.

## Updating content sources

Online suggestions are English-language short excerpts or labeled headlines from Wikipedia's public daily/article APIs, Global Voices RSS, NASA RSS, and Wikivoyage's public API. Users can select interests and sentence length. Topic compatibility differs by provider: NASA covers science and technology, and Wikivoyage covers travel. This is a vocabulary practice tool, not a complete news reader. Fixed practice samples are not part of online recommendations.

Source pools are cached in R2 and refreshed after one hour on demand. A scheduled job also refreshes general source pools every six hours. During outages, previously retrieved content can be served for up to seven days with an explicit stale-cache label. Publication/update dates differ from retrieval dates: dynamically fetched content is not necessarily newly published or from today.

Original publisher, article link, available author and publication/update date, and license are displayed above excerpts. Machine translations are identified as PhraseCut output, not publisher translations. Original and adapted text retain their indicated licenses. Source information is also retained in source-based exports.

Public sources: ${contentSources.map(([name, url]) => `[${name}](${url})`).join(", ")}.

## Languages and exports

Recommendations are currently in English, but users can paste text in any of the ${languageCodes.length} supported translation languages. Translation languages: ${new Intl.ListFormat("en").format(languageCodes.map(code => new Intl.DisplayNames(["en"], { type: "language" }).of(code)))}. Website interfaces are available in English, Simplified Chinese, Traditional Chinese, Hindi, Indonesian, Vietnamese, and Brazilian Portuguese.

The base CSV columns are Word, Meaning, Sentence, Translation, Source language, and Target language. Source-based CSV/Anki CSV exports additionally include Publisher, Author, Original URL, License, License URL, and Attribution. Anki export is CSV, not an APKG deck; importing uses Anki's own note fields and scheduling.

## Native apps and release boundary

The iPhone, iPad, and Mac apps add a local study library, saved words and sentences, spaced repetition, and library exports. They use Apple Translation, which can work offline after the required language packs are downloaded. They are not limited to learning English. The website and native app use different translation engines.

As of October 25, 2026, native version 1.4.0 (33) is available on the App Store for iPhone, iPad, and Mac. The native app and website both support interest-based dynamic sources. Existing installed versions 1.3.0 and earlier continue to use the legacy quote interface until updated. Fetching new recommendations requires internet access; native Apple Translation can still work offline after language packs are downloaded.

## Canonical pages

- [Online sentence translator](${origin}/study): The working web tool.
- [App and website overview](${origin}/): Product overview.
- [Help](${origin}/help): Native app help.
- [Privacy](${origin}/privacy-policy): Text processing and local storage boundaries.
- [App Store](${appStore}): The native app listing.
`;
await writeFile(`${root}product-facts.md`, facts);
await writeFile(`${root}llms.txt`, `# PhraseCut

> Learn words from sentences you like. Paste your text or explore English article excerpts by interest; translate, practice listening, and export vocabulary online. Save and review in the native app.

The free website recommends excerpts from updating Wikipedia, Global Voices, NASA, and Wikivoyage sources, with original links and licenses. Recommendations are currently in English; pasted text supports ${languageCodes.length} translation languages. Refreshing the source cache does not mean an article was published today.

The website has no saved history or review library. Native apps provide local saving and spaced repetition. Native version 1.4.0 (33), with dynamic recommendations and listening practice, is available on the App Store as of October 25, 2026. Installed versions 1.3.0 and earlier still use legacy quotes until updated. New recommendations need internet access. This file is an optional navigation aid, not a sitemap, robots policy, or Google ranking requirement.

## Product

- [Product facts](${origin}/product-facts.md): Feature and release boundaries, content sources, freshness, languages, translation providers, and CSV attribution.
- [Online tool](${origin}/study): Interest-based English excerpts, sentence and word translation, adjustable pronunciation, CSV and Anki CSV export.
- [Help](${origin}/help): Native app learning and review workflow.

## Learning guides

- [Learn words from sentences](${origin}/learn-words-from-sentences): A practical workflow with examples.
- [Sentence-based vocabulary](${origin}/sentence-based-vocabulary): Keep words connected to their context.
- [CSV and Anki export](${origin}/export-language-study-materials): Web exports, source attribution, and native library exports.

## Localized tools

${Object.values(locales).map(copy => `- [${copy.name}](${origin + pathFor(copy)}): ${searchCopy[copy.lang].toolDescription}`).join("\n")}

## Optional

- [Privacy](${origin}/privacy-policy): How text is processed.
- [Support](${origin}/support): Contact the developer.
- [App Store](${appStore}): Download the native app.
`);
const output = `${root}dist`;
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of await readdir(root)) {
  if (file.endsWith(".html") || ["robots.txt", "sitemap.xml", "llms.txt", "product-facts.md", "_headers", "_redirects", "favicon", "images", "style", "js", ...Object.keys(locales).filter(key => key !== "en")].includes(file)) {
    await cp(`${root}${file}`, `${output}/${file}`, { recursive: true });
  }
}
console.log("Built 7 localized study pages, navigation, privacy notices, icon sprite, and sitemap.");

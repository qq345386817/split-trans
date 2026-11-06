const origin = "https://phrase-cut.luopeike.com";
const appStore = "https://apps.apple.com/app/id6740488386";
const escape = text => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export function localizedShell(locale, content, route) {
  const study = content.study;
  const page = route === "index" ? {
    title: content.native.homeTitle, description: content.native.homeDescription,
    heading: "PhraseCut", kicker: "PhraseCut", lead: content.native.summary, sections: []
  } : route === "help" ? {
    title: content.native.helpTitle, description: content.native.helpDescription,
    heading: content.native.helpHeading, kicker: study.help, lead: content.native.summary, sections: []
  } : content.pages[route === "privacy-policy" ? "privacy" : route];
  const url = `${origin}/${locale}/${route === "index" ? "" : route}`;
  const schema = route === "index" ? [
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PhraseCut", url, applicationCategory: "EducationalApplication", operatingSystem: "iOS, iPadOS, macOS", downloadUrl: appStore },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] }
  ] : [{ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, url }];
  return `<!DOCTYPE html>
<html lang="${locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="index,follow">
<meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="${origin}/favicon/android-chrome-512x512.png">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${origin}/favicon/android-chrome-512x512.png">
<link rel="canonical" href="${url}"><link rel="icon" href="/favicon/favicon.ico"><link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
<link rel="stylesheet" href="/style/base.css">
${schema.map(value => `<script type="application/ld+json">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`).join("\n")}
</head><body><div class="page"><div class="container${route === "index" ? "" : " narrow"}">
<header class="topbar"><a class="brand" href="./"><img src="/favicon/apple-touch-icon.png" alt=""><span>PhraseCut</span></a><nav class="nav"><a href="./">${escape(study.home)}</a><a href="help">${escape(study.help)}</a><a href="support">${escape(content.pages.support.kicker)}</a><a href="privacy-policy">${escape(study.privacy)}</a><a class="download-link" href="${appStore}">${escape(study.download)}</a></nav></header>
<main class="article"><p class="kicker">${escape(page.kicker)}</p><h1>${escape(page.heading)}</h1><p class="lead">${escape(page.lead)}</p>${page.sections.map(([title, body]) => `<section><h2>${escape(title)}</h2><p>${escape(body)}</p></section>`).join("")}</main>
<footer class="footer"><div class="footer-links"><a href="help">${escape(study.help)}</a><a href="support">${escape(content.pages.support.kicker)}</a><a href="privacy-policy">${escape(study.privacy)}</a><a href="mailto:cameoshell09@gmail.com">cameoshell09@gmail.com</a></div></footer>
</div></div></body></html>\n`;
}

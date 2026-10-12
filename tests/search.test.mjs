import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { locales } from "../scripts/study-locales.mjs";
import { searchCopy } from "../scripts/search-copy.mjs";

const root = new URL("../", import.meta.url);
const htmlEscape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

test("all locales have unique search titles and complete, visible FAQ answers", async () => {
  const titles = new Set();
  for (const locale of Object.values(locales)) {
    const copy = searchCopy[locale.lang];
    assert.ok(copy && copy.homeDescription && copy.toolDescription);
    assert.ok(!titles.has(copy.toolTitle));
    titles.add(copy.toolTitle);
    const html = await readFile(new URL((locale.folder ? locale.folder + "/" : "") + "study.html", root), "utf8");
    assert.ok(html.includes("<title>" + htmlEscape(copy.toolTitle) + "</title>"));
    const languages = html.match(/<select[^>]*id="site-language"[^>]*>([\s\S]*?)<\/select>/)?.[1];
    assert.ok(languages);
    assert.equal((languages.match(/ selected>/g) || []).length, 1);
    const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const faq = structured.find(item => item["@type"] === "FAQPage");
    assert.equal(faq.mainEntity.length, copy.faqs.length);
    for (const [index, [question, answer]] of copy.faqs.entries()) {
      assert.equal(faq.mainEntity[index].name, question);
      assert.equal(faq.mainEntity[index].acceptedAnswer.text, answer);
      assert.ok(html.includes("<summary>" + htmlEscape(question) + "</summary>"));
      assert.ok(html.includes("<p>" + htmlEscape(answer) + "</p>"));
    }
  }
});

test("AI discovery files link to real public pages and are published outside the sitemap", async () => {
  const llms = await readFile(new URL("llms.txt", root), "utf8");
  assert.ok(llms.startsWith("# PhraseCut\n\n> "));
  assert.ok(llms.includes("not a sitemap"));
  assert.ok(llms.includes("product-facts.md"));
  for (const match of llms.matchAll(/\]\(https:\/\/phrase-cut\.luopeike\.com\/([^)]*)\)/g)) {
    const path = match[1];
    const file = !path ? "index.html" : path.endsWith("/") ? path + "index.html" : path.includes(".") ? path : path + ".html";
    assert.ok((await readFile(new URL(file, root), "utf8")).length);
  }
  const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
  assert.ok(!sitemap.includes("llms.txt") && !sitemap.includes("product-facts.md"));
  assert.ok((await readFile(new URL("dist/llms.txt", root), "utf8")) === llms);
});

test("contact links opt out of technical email-protection redirects and no fake ratings are added", async () => {
  for (const locale of Object.values(locales)) {
    const folder = locale.folder ? locale.folder + "/" : "";
    for (const name of ["index", "study", "support", "privacy-policy"]) {
      const html = await readFile(new URL(folder + name + ".html", root), "utf8");
      assert.ok(html.includes('<!--email_off--><a href="mailto:'));
      assert.ok(!html.includes('href="/cdn-cgi/l/email-protection'));
      assert.ok(!html.includes('"aggregateRating"'));
    }
  }
});

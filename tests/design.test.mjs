import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { locales } from "../scripts/study-locales.mjs";
import { sourceCopy } from "../scripts/source-copy.mjs";
import { interestCopy } from "../scripts/interest-copy.mjs";
import { renderWorkspace } from "../scripts/study-layout.mjs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const tokens = JSON.parse(await readFile(new URL("design-system/tokens.json", root), "utf8"));
const luminance = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

test("home mounts the real shared workspace in all seven languages without duplicate IDs", async () => {
  for (const locale of Object.values(locales)) {
    const html = await readFile(new URL((locale.folder ? `${locale.folder}/` : "") + "index.html", root), "utf8");
    assert.ok(html.includes(renderWorkspace({ ...locale, ...interestCopy[locale.lang], ...sourceCopy[locale.lang] })));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    assert.equal((html.match(/src="\/js\/study.mjs"/g) || []).length, 1);
    assert.ok(html.includes('<body class="study-page home-page">'));
    assert.ok(!html.includes("product-panel") && !html.includes("workspace-preview"));
    const paths = [...html.matchAll(/(?:src|srcset)="(\/images\/app\/[^"]+)"/g)].map(match => match[1]);
    assert.equal(paths.length, 2);
    const manifest = JSON.parse(await readFile(new URL("images/app/manifest.json", root), "utf8"));
    for (const path of paths) {
      const url = new URL(path.slice(1), root);
      const version = url.searchParams.get("v");
      url.search = "";
      const bytes = await readFile(url);
      const file = url.pathname.split("/").at(-1);
      const entry = manifest.images[file];
      assert.ok(bytes.length < 150_000);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256);
      assert.equal(version, entry.sha256.slice(0, 12));
      assert.ok(html.includes(`width="${entry.width}" height="${entry.height}"`));
    }
  }
});

test("theme preserves native brand identity and accessible text, controls, and actions", () => {
  const colors = Object.fromEntries(tokens.color.tokens.map(token => [token.name, token.value]));
  assert.deepEqual(colors.main, { light: "#2f6bff", dark: "#5b8cff" });
  for (const theme of ["light", "dark"]) {
    for (const background of ["bg", "surface-strong", "main-soft"]) {
      for (const foreground of ["text", "muted", "main-deep"]) assert.ok(contrast(colors[foreground][theme], colors[background][theme]) >= 4.5, `${theme} ${foreground}/${background}`);
    }
    for (const background of ["bg", "surface-strong"]) assert.ok(contrast(colors.border[theme], colors[background][theme]) >= 3);
  }
  assert.ok(contrast(colors["main-deep"].light, "#ffffff") >= 4.5);
  assert.ok(contrast(colors.main.dark, colors.bg.dark) >= 4.5);
});

test("design source files stay private to the checkout, not in the deployed artifact", async () => {
  await assert.rejects(stat(new URL("dist/design-system", root)), { code: "ENOENT" });
  assert.ok((await readFile(new URL("dist/style/theme.css", root), "utf8")).includes("--main: #2f6bff"));
  assert.ok((await readFile(new URL("dist/images/app/mac_en_US_light_learn.webp", root))).length);
});

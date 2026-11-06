import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appScreenshotLocales, loadAppScreenshots } from "../scripts/app-screenshots.mjs";
import { extraContent } from "../scripts/extra-locales.mjs";

const root = new URL("../", import.meta.url);

// The reader is entirely in memory; these bytes are not generated image assets.
function fixture() {
  const files = new Map();
  const manifest = { version: "1.4.1", build: "34", images: {} };
  for (const captureLocale of Object.values(appScreenshotLocales)) {
    for (const mode of ["light", "dark"]) {
      const file = `mac_${captureLocale}_${mode}_learn.webp`;
      const bytes = Buffer.from(`reader stub: ${file}`);
      files.set(file, bytes);
      manifest.images[file] = { width: 1218, height: 972, sha256: createHash("sha256").update(bytes).digest("hex") };
    }
  }
  const read = async url => {
    const file = url.pathname.split("/").at(-1);
    if (file === "manifest.json") return JSON.stringify(manifest);
    if (!files.has(file)) throw Object.assign(Error(`Missing file: ${file}`), { code: "ENOENT" });
    return files.get(file);
  };
  return { manifest, files, read };
}

test("native screenshot routing covers exactly the twelve interface locales", () => {
  assert.deepEqual(appScreenshotLocales, {
    en: "en_US", "zh-Hans": "zh_Hans", "zh-Hant": "zh_Hant", hi: "hi", id: "id", vi: "vi", "pt-BR": "pt_BR",
    fr: "fr_FR", de: "de_DE", es: "es_ES", ja: "ja", ko: "ko"
  });
});

test("new captions identify their own UI language, not an English preview", () => {
  const captions = {
    fr: "Aperçu de l'application Mac en français", de: "Vorschau der Mac-App auf Deutsch",
    es: "Vista previa de la aplicación para Mac en español", ja: "Macアプリのプレビュー（日本語表示）",
    ko: "한국어로 표시된 Mac 앱 미리보기"
  };
  for (const [locale, caption] of Object.entries(captions)) assert.equal(extraContent[locale].home.imageCaption, caption);
});

test("loader verifies both modes and uses per-image versions without relabeling legacy captures", async () => {
  const { manifest, read } = fixture();
  for (const mode of ["light", "dark"]) Object.assign(manifest.images[`mac_fr_FR_${mode}_learn.webp`], { version: "1.5.0", build: "35" });
  const screenshots = await loadAppScreenshots(root, read);
  assert.equal(Object.keys(screenshots).length, 12);
  for (const [locale, captureLocale] of Object.entries(appScreenshotLocales)) {
    for (const mode of ["light", "dark"]) {
      const file = `mac_${captureLocale}_${mode}_learn.webp`;
      assert.equal(screenshots[locale][mode].url, `/images/app/${file}?v=${manifest.images[file].sha256.slice(0, 12)}`);
      assert.equal(screenshots[locale][mode].version, locale === "fr" ? "1.5.0" : "1.4.1");
      assert.equal(screenshots[locale][mode].build, locale === "fr" ? "35" : "34");
    }
  }
});

test("missing localized manifest entries never fall back to English", async () => {
  const { manifest, read } = fixture();
  delete manifest.images["mac_fr_FR_light_learn.webp"];
  await assert.rejects(loadAppScreenshots(root, read), /Invalid native screenshot manifest entry: mac_fr_FR_light_learn.webp/);
});

test("missing localized image files never fall back to English", async () => {
  const { files, read } = fixture();
  files.delete("mac_ko_dark_learn.webp");
  await assert.rejects(loadAppScreenshots(root, read), { code: "ENOENT" });
});

test("hash mismatches, undersized frames and missing versions stop screenshot loading", async () => {
  for (const [change, error] of [
    [entry => { entry.sha256 = "wrong"; }, /Native screenshot and manifest differ/],
    [entry => { entry.width = 859; }, /Invalid native screenshot manifest entry/],
    [entry => { entry.height = 759; }, /Invalid native screenshot manifest entry/],
    [entry => { entry.version = ""; }, /Missing native screenshot version or build/],
    [entry => { entry.build = ""; }, /Missing native screenshot version or build/]
  ]) {
    const { manifest, read } = fixture();
    change(manifest.images["mac_de_DE_light_learn.webp"]);
    await assert.rejects(loadAppScreenshots(root, read), error);
  }
});

test("light/dark pairs must describe the same captured app version and build", async () => {
  for (const field of ["version", "build"]) {
    const { manifest, read } = fixture();
    manifest.images["mac_ja_dark_learn.webp"][field] = "different";
    await assert.rejects(loadAppScreenshots(root, read), /Native screenshot light\/dark versions differ: ja/);
  }
});

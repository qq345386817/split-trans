import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export const appScreenshotLocales = Object.freeze({
  en: "en_US", "zh-Hans": "zh_Hans", "zh-Hant": "zh_Hant",
  hi: "hi", id: "id", vi: "vi", "pt-BR": "pt_BR",
  fr: "fr_FR", de: "de_DE", es: "es_ES", ja: "ja", ko: "ko"
});

export async function loadAppScreenshots(root, read = readFile) {
  const manifest = JSON.parse(await read(new URL("images/app/manifest.json", root), "utf8"));
  const screenshots = {};
  for (const [locale, captureLocale] of Object.entries(appScreenshotLocales)) {
    screenshots[locale] = {};
    for (const mode of ["light", "dark"]) {
      const file = `mac_${captureLocale}_${mode}_learn.webp`;
      const entry = manifest.images?.[file];
      if (!entry || !Number.isInteger(entry.width) || !Number.isInteger(entry.height) || entry.width < 860 || entry.height < 760) {
        throw new Error(`Invalid native screenshot manifest entry: ${file}`);
      }
      const hash = createHash("sha256").update(await read(new URL(`images/app/${file}`, root))).digest("hex");
      if (hash !== entry.sha256) throw new Error(`Native screenshot and manifest differ: ${file}`);
      const version = entry.version ?? manifest.version;
      const build = entry.build ?? manifest.build;
      if (typeof version !== "string" || !version || typeof build !== "string" || !build) {
        throw new Error(`Missing native screenshot version or build: ${file}`);
      }
      screenshots[locale][mode] = { ...entry, version, build, url: `/images/app/${file}?v=${hash.slice(0, 12)}` };
    }
    const { light, dark } = screenshots[locale];
    if (light.version !== dark.version || light.build !== dark.build) {
      throw new Error(`Native screenshot light/dark versions differ: ${locale}`);
    }
  }
  return screenshots;
}

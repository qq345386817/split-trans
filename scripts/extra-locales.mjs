import { readFileSync } from "node:fs";

export const addedLocaleIDs = ["fr", "de", "es", "ja", "ko"];
export const extraContent = Object.fromEntries(addedLocaleIDs.map(locale => [
  locale, JSON.parse(readFileSync(new URL(`../translations/${locale}.json`, import.meta.url), "utf8"))
]));

export const extraSection = section => Object.fromEntries(
  addedLocaleIDs.map(locale => [locale, extraContent[locale][section]])
);

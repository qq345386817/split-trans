export const languageCodes = ["en", "zh-Hans", "zh-Hant", "es", "fr", "de", "hi", "id", "vi", "pt", "ja", "ko", "ar", "it", "nl", "pl", "ru", "th", "tr", "uk"];
export const characterCount = value => [...value.normalize("NFC")].length;

export function csvCell(value) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function exportCSV(result, selected, format) {
  const rows = result.words.filter(word => selected.has(word.index) && word.target);
  const content = rows.map(word => [word.source, word.target, result.source, result.fullTranslation, result.sourceLanguage, result.targetLanguage]);
  const columns = ["Word", "Meaning", "Sentence", "Translation", "Source language", "Target language"];
  if (result.origin) {
    columns.push("Publisher", "Author", "Original URL", "License", "License URL", "Attribution");
    for (const row of content) row.push(result.origin.name, result.origin.author, result.origin.url, result.origin.license, result.origin.licenseURL,
      "Excerpt; machine translation by PhraseCut, not the original publisher. Original and adapted text retain the indicated license.");
  }
  const header = format === "anki"
    ? "#separator:Comma\n#html:false\n#columns:" + columns.join(",") + "\n"
    : "\uFEFF" + columns.map(csvCell).join(",") + "\r\n";
  return header + content.map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function validateResult(value, snapshot) {
  if (!value || value.source !== snapshot.text.normalize("NFC") || value.sourceLanguage !== snapshot.sourceLanguage || value.targetLanguage !== snapshot.targetLanguage ||
      typeof value.fullTranslation !== "string" || !value.fullTranslation.trim() || !Array.isArray(value.words) || !value.words.length || value.words.length > 40 ||
      value.words.some((word, index) => word.index !== index || typeof word.source !== "string" || !word.source || (word.target !== null && (typeof word.target !== "string" || !word.target.trim())))) {
    throw new Error("translation_failed");
  }
  return value;
}

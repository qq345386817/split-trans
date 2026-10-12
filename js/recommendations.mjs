export const topicIDs = ["all", "daily", "reading", "travel", "technology", "business", "science", "health", "sports", "culture"];
export const lengthRanges = [[20, 180], [20, 80], [81, 180]];
export const sources = [{ id: "auto", name: "" }, { id: "wikipedia", name: "Wikipedia" }, { id: "globalvoices", name: "Global Voices" }, { id: "nasa", name: "NASA" }, { id: "wikivoyage", name: "Wikivoyage" }];
export const supportsTopic = (source, topic) => source === "nasa" ? ["all", "science", "technology"].includes(topic) : source === "wikivoyage" ? ["all", "travel"].includes(topic) : true;

export function recommendationURL(topic, length, exclude, source = "auto") {
  if (!topicIDs.includes(topic) || !lengthRanges[length]) throw new Error("invalid_recommendation");
  if (!sources.some(item => item.id === source) || !supportsTopic(source, topic)) throw new Error("invalid_recommendation");
  const [min, max] = lengthRanges[length];
  const url = new URL("https://quote.luopeike.com/quotes/random");
  url.search = new URLSearchParams({ limit: "1", topic, source, minLength: String(min), maxLength: String(max) });
  if (exclude) url.searchParams.set("exclude", exclude);
  return url.toString();
}

export function validateOrigin(origin) {
  const allowed = { wikipedia: ["en.wikipedia.org"], wikivoyage: ["en.wikivoyage.org"], nasa: ["www.nasa.gov", "science.nasa.gov"], globalvoices: ["globalvoices.org"] };
  const licenses = { wikipedia: "https://creativecommons.org/licenses/by-sa/4.0/", wikivoyage: "https://creativecommons.org/licenses/by-sa/4.0/", nasa: "https://www.nasa.gov/nasa-brand-center/images-and-media/", globalvoices: "https://creativecommons.org/licenses/by/3.0/" };
  if (!origin || !allowed[origin.id] || !["name", "url", "title", "author", "license", "licenseURL", "fetchedAt"].every(key => typeof origin[key] === "string" && origin[key] && origin[key].length <= 2048) || !["sentence", "headline"].includes(origin.kind)) throw new Error("quote_failed");
  const url = new URL(origin.url);
  if (url.protocol !== "https:" || url.username || url.password || !allowed[origin.id].includes(url.hostname) || origin.licenseURL !== licenses[origin.id]) throw new Error("quote_failed");
  return origin;
}

export function playbackPreferences(rate, count) {
  return { rate: Math.min(Math.max(Number(rate) || 1, 0.5), 1.5), count: [1, 3, 5].includes(Number(count)) ? Number(count) : 1 };
}

export const topicIDs = ["all", "daily", "reading", "travel", "technology", "business", "science", "health", "sports", "culture"];
export const lengthRanges = [[20, 180], [20, 80], [81, 180]];

export function recommendationURL(topic, length, exclude) {
  if (!topicIDs.includes(topic) || !lengthRanges[length]) throw new Error("invalid_recommendation");
  const [min, max] = lengthRanges[length];
  const url = new URL("https://quote.luopeike.com/quotes/random");
  url.search = new URLSearchParams({ limit: "1", topic, minLength: String(min), maxLength: String(max) });
  if (exclude) url.searchParams.set("exclude", exclude);
  return url.toString();
}

export function playbackPreferences(rate, count) {
  return { rate: Math.min(Math.max(Number(rate) || 1, 0.5), 1.5), count: [1, 3, 5].includes(Number(count)) ? Number(count) : 1 };
}

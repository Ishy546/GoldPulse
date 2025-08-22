import { fetchGNews, fetchFinnhubNews, fetchRedditPostsNoAuth } from "./fetchNews";
import { dedupeItems, addSentiment, SentimentItem } from "./fetchSentiment";
import { NewsItem } from "./fetchSentiment";

export type HfSentiment = {
  date: string;
  sentiment: "POSITIVE" | "NEGATIVE";
  score: number;
};

export async function fetchAndStoreData(): Promise<SentimentItem[]> {
  // 1) Fetch from all sources (failure-tolerant)
  const [newsdata, finnhub, reddit] = await Promise.allSettled([
    fetchGNews(),
    fetchFinnhubNews(),
    fetchRedditPostsNoAuth(),
  ]);

  const all: NewsItem[] = [
    ...(newsdata.status === "fulfilled" ? newsdata.value : []),
    ...(finnhub.status === "fulfilled" ? finnhub.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
  ];

  if (all.length === 0) {
    console.warn("No items fetched from any source this run.");
    return [];
  }

  // 2) Deduplicate and add sentiment
  const combined = dedupeItems(all);
  const processed = await addSentiment(combined, 4);

  // 3) Format for chart
  // 3) Format as SentimentItem[] (keep all NewsItem fields)
const formatted: SentimentItem[] = processed.map((item) => ({
  title: item.title,
  url: item.url,
  source: item.source,
  date: item.date
    ? new Date(item.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  sentiment: item.sentiment,
  score: item.score, // assume already normalized to 0..1 inside addSentiment
}));

return formatted;
}
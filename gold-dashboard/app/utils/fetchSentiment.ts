
import Sentiment from "sentiment"
import emojiStrip from 'emoji-strip';

export type NewsItem = {
  title: string;
  url: string;
  date: string;
  source: string;
};

export type SentimentItem = NewsItem & {
  sentiment: "POSITIVE" | "NEGATIVE";
  score: number; // 0 to 1
};

// ------------------ helpers --------------------

export function cleanText(text: string): string {
  const noEmoji = emojiStrip(text || "");
  const noUrls = noEmoji.replace(/http\S+/g, "");
  const noPunct = noUrls.replace(/[^A-Za-z0-9\s]/g, "");
  return noPunct.trim();
}

export function dedupeItems<T extends { title: string; url?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const keyOf = (it: T) => (it.url ? it.url.toLowerCase() : it.title.toLowerCase());
  return items.filter((it) => {
    const k = keyOf(it);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ------------------ Sentiment --------------------

const analyzer = new Sentiment();

export async function addSentiment(
  items: NewsItem[]
): Promise<SentimentItem[]> {
  return items.map((item) => {
    const cleaned = cleanText(item.title);
    if (!cleaned) return { ...item, sentiment: "NEGATIVE", score: 0 }; // neutral fallback

    const result = analyzer.analyze(cleaned);
    const rawScore = Math.min(Math.max(result.comparative, -1), 1); // already -1..1
    const sentiment = rawScore >= 0 ? "POSITIVE" : "NEGATIVE";

    return { ...item, sentiment, score: Number(rawScore.toFixed(3)) };
  });
}
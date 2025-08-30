import { NewsItem } from "./fetchSentiment";

type FinnhubArticle = {
  headline?: string;
  datetime?: number; // Unix timestamp
  url?: string;
};

type RedditPost = {
  data: {
    created_utc: number;
    title: string;
    permalink: string;
  };
};
// ---------- tiny fetch helpers ----------
// goal of this function is to add a timeout and error checking to a fetch call, ensures app fails fast instead of hanging
const DEFAULT_TIMEOUT_MS = 15_000;
async function fetchJSON<T>(url: string, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T>{
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)// sends a signal to cancel the fetch after 15sec
    try {
        const res = await fetch(url, {...init, signal: controller.signal})
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
        return (await res.json()) as T
    }finally{
        clearTimeout(id)// clears timer from running and trying to cancel a request if already finished 
    }
}
// focuses on the task of retying an operation when it fails, a simple network glitch wont destroy the function entirely
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs= 800): Promise<T> {
    let lastErr: unknown
    for (let i = 0; i <= retries; i++){
        try {
            return await fn()
        }catch (e){
            lastErr = e
            if (i < retries) await new Promise(r => setTimeout(r, delayMs * (i+1)))
        }
    }
    throw lastErr
}

// ------------------ Individual Fetchers ------------------
// Finnhub
export async function fetchFinnhubNews(): Promise<NewsItem[]> {
  try {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`;
    const data = await withRetry(() => fetchJSON<FinnhubArticle[]>(url));
    if (!Array.isArray(data)) return [];

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return data
      .filter(
        art =>
          typeof art.headline === "string" &&
          art.headline.toLowerCase().includes("gold") &&
          art.datetime !== undefined &&
          new Date(art.datetime * 1000).getTime() >= sevenDaysAgo
      )
      .slice(0, 10)
      .map(art => ({
        title: art.headline!,
        url: art.url ?? "#",
        date: new Date((art.datetime ?? 0) * 1000).toISOString(),
        source: "finnhub" as const,
      }));
  } catch (e) {
    console.error("fetchFinnhubNews failed:", e);
    return [];
  }
}

// Reddit
export const fetchRedditPostsNoAuth = async (): Promise<NewsItem[]> => {
  try {
    const url = `https://www.reddit.com/search.json?q=gold%20price&sort=new&limit=10`;
    const res = await fetch(url, {
      headers: { "User-Agent": "gold-sentiment-app/0.1 (by /u/Interesting-Boat7154)" },
    });
    if (!res.ok) throw new Error(`Reddit no-auth failed: ${res.status}`);
    const data = await res.json();

    return (data.data?.children as RedditPost[] ?? []).map(p => ({
      title: p.data.title,
      url: `https://reddit.com${p.data.permalink}`,
      // created_utc is in seconds, convert to ISO
      date: new Date(p.data.created_utc * 1000).toISOString(),
      source: "reddit" as const,
    }));
  } catch (e) {
    console.error("fetchRedditPostsNoAuth failed:", e);
    return [];
  }
};


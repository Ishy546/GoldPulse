"use client"
import { formatDate } from "../utils/calculations";
import SentimentChartClient from "../components/SentimentVsPriceChart";
import MultiSourceSentimentChartClient from "../components/MultiSourceSentimentChartClient";
import { Item } from "../utils/extraFunc";
import { useState, useEffect } from "react";
import { SentimentItem } from "../utils/fetchSentiment";

export default function Page() {
  const [goldData, setGoldData] = useState<Item[]>([]);
  const [goldLoading, setGoldLoading] = useState(true);
  const [goldError, setGoldError] = useState<string | null>(null);

  const [sentimentData, setSentimentData] = useState<SentimentItem[]>([]);
  const [sentimentLoading, setSentimentLoading] = useState(true);
  const [sentimentError, setSentimentError] = useState<string | null>(null);
  console.log(goldLoading, goldError, sentimentLoading, sentimentError);

  useEffect(() => {
    async function fetchAll() {
      // Run both fetches in parallel
      const [goldResult, sentimentResult] = await Promise.allSettled([
        fetch("/api/gold"),
        fetch("/api/Fetch-Sentiment"),
      ]);

      // ----- GOLD -----
      if (goldResult.status === "fulfilled") {
        try {
          if (!goldResult.value.ok) throw new Error(`HTTP ${goldResult.value.status}`);
          const data: Item[] = await goldResult.value.json();
          setGoldData(data);
        } catch (err) {
          setGoldError((err as Error).message);
        }
      } else {
        setGoldError(goldResult.reason?.message || "Failed to fetch gold data");
      }
      setGoldLoading(false);

      // ----- SENTIMENT -----
      if (sentimentResult.status === "fulfilled") {
        try {
          if (!sentimentResult.value.ok) throw new Error(`HTTP ${sentimentResult.value.status}`);
          const data: SentimentItem[] = await sentimentResult.value.json();
          setSentimentData(data);
        } catch (err) {
          setSentimentError((err as Error).message);
        }
      } else {
        setSentimentError(sentimentResult.reason?.message || "Failed to fetch sentiment data");
      }
      setSentimentLoading(false);
    }

    fetchAll();
  }, []);

  const goldDataApi: Item[] = goldData.map(d => ({
    date: d.date,
    open: d.open ? Number(d.open) : null,
    high: d.high ? Number(d.high) : null,
    low: d.low ? Number(d.low) : null,
    close: d.close ? Number(d.close) : null,
    volume: d.volume ? Number(d.volume) : null,
  })).filter(
    (d) =>
      d.open !== null &&
      d.high !== null &&
      d.low !== null &&
      d.close !== null &&
      d.volume !== null &&
      d.volume !== 0 // also remove zero-volume days
  ).map((item) => ({
    ...item,
    date: formatDate(item.date) // new field
  }));
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-12">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Gold Sentiment Dashboard
      </h1>

      {/* Gold Price + Composite Sentiment Chart */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Gold Prices vs Avg Sentiment
        </h2>
        <SentimentChartClient sentimentItems={sentimentData} goldData={goldDataApi} />
      </div>

      {/* Multi-Source Sentiment Chart */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Sentiment by Source
        </h2>
        <MultiSourceSentimentChartClient sentimentItems={sentimentData} />
      </div>
    </div>
  );
}

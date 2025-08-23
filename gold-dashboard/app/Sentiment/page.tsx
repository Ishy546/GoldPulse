import { fetchAndStoreData } from "../utils/StoreData";
import fetchGoldData from "@/app/utils/fetchGold";
import SentimentChartClient from "../components/SentimentVsPriceChart";
import WeightedSentimentChartClient from "../components/WeightedSentiment";
import MultiSourceSentimentChartClient from "../components/MultiSourceSentimentChartClient";
import { Item } from "../utils/extraFunc";

export default async function Page() {
  const sentimentItems = await fetchAndStoreData();
  const rawApiData = await fetchGoldData();

  const goldData: Item[] = rawApiData.map(d => ({
    date: d.date,
    open: d.open ? Number(d.open) : null,
    high: d.high ? Number(d.high) : null,
    low: d.low ? Number(d.low) : null,
    close: d.close ? Number(d.close) : null,
    volume: d.volume ? Number(d.volume) : null,
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
        <SentimentChartClient sentimentItems={sentimentItems} goldData={goldData} />
      </div>

      {/* Multi-Source Sentiment Chart */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Sentiment by Source
        </h2>
        <MultiSourceSentimentChartClient sentimentItems={sentimentItems} />
      </div>
    </div>
  );
}

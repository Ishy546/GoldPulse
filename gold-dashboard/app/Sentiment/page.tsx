import { fetchAndStoreData } from "../utils/StoreData";
import fetchGoldData from "@/app/utils/fetchGold";
import SentimentChartClient from "../components/SentimentVsPriceChart";
import { Item } from "../utils/extraFunc";

export default async function Page() {
  const sentimentItems = await fetchAndStoreData()
  const rawApiData = await fetchGoldData();
  const goldData: Item[] = rawApiData.map(d => ({
  date: d.date,
  open: d.open ? Number(d.open) : null,
  high: d.high ? Number(d.high) : null,
  low: d.low ? Number(d.low) : null,
  close: d.close ? Number(d.close) : null,
  volume: d.volume ? Number(d.volume) : null,
}));
  // Fetch gold prices
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gold Price vs Sentiment</h1>
      <SentimentChartClient sentimentItems={sentimentItems} goldData={goldData} />
    </div>
  );
}
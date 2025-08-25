"use client"
import { formatDate } from "../utils/calculations";
import GoldLineChart from "@/app/components/lineChart"
import GoldCandlestick from "../components/candleStickChart"
import RsiChart from "../components/RsiChart";
import MacdChart from "../components/MacdChart";
import VolumeChart from "../components/VolumeChart";
import { useState, useEffect } from "react"
import { Item } from "../utils/extraFunc";


export default function Page() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/gold");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching gold data:", err);
      }
    }

    fetchData();
  }, []);
const cleanedData = data.filter(
  (item) =>
    item.open !== null &&
    item.high !== null &&
    item.low !== null &&
    item.close !== null &&
    item.volume !== null &&
    item.volume !== 0
).map((item) => ({
    ...item,
    date: formatDate(item.date) // new field
  }));// very important, removes null values.
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-12">
      {/* Page Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800">
        Gold Market Dashboard
      </h1>

      {/* Gold Line Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 max-w-6xl mx-auto">
        <GoldLineChart data={cleanedData} />
      </div>

      {/* Candlestick Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 max-w-6xl mx-auto">
        <GoldCandlestick data={cleanedData} />
      </div>

      {/* RSI & MACD in a horizontal flex on larger screens */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <RsiChart data={cleanedData} />
        </div>
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <MacdChart data={cleanedData} />
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 max-w-6xl mx-auto">
        <VolumeChart data={cleanedData} />
      </div>
    </div>
  );
}
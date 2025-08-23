"use client";

import { useMemo } from "react";
import { SentimentItem } from "../utils/fetchSentiment";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type Props = {
  sentimentItems: SentimentItem[];
};

const SOURCE_WEIGHTS: Record<string, number> = {
  gnews: 0.4,
  finnhub: 0.4,
  reddit: 0.2,
};

export default function WeightedSentimentChartClient({ sentimentItems }: Props) {
  const weightedData = useMemo(() => {
    if (!sentimentItems.length) return [];

    // Group scores by day
    const daily: Record<string, { weightedSum: number; totalWeight: number }> = {};

    sentimentItems.forEach(item => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const weight = SOURCE_WEIGHTS[item.source.toLowerCase()] ?? 0.33; // fallback

      if (!daily[date]) daily[date] = { weightedSum: 0, totalWeight: 0 };

      daily[date].weightedSum += item.score * weight;
      daily[date].totalWeight += weight;
    });

    // Normalize per day
    const result = Object.entries(daily).map(([date, { weightedSum, totalWeight }]) => ({
      date,
      weightedSentiment: Number((weightedSum / totalWeight).toFixed(3)),
    }));

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sentimentItems]);

  return (
    <div className="w-full h-96">
      <h2 className="font-semibold text-lg mb-2">Weighted Sentiment Index</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weightedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="weightedSentiment" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
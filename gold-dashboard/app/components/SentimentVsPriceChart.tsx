"use client";

import { useMemo } from "react";
import SentimentPriceChart from "./SentimentPriceChart";
import { SentimentItem } from "../utils/fetchSentiment";
import { Item } from "../utils/extraFunc";

type Props = {
  sentimentItems: SentimentItem[];
  goldData: Item[];
};

export default function SentimentChartClient({ sentimentItems, goldData }: Props) {
  const combinedData = useMemo(() => {
  if (!goldData.length || !sentimentItems.length) return [];

  // Build lookup: date → sentiment scores
  const dailySentiment: Record<string, number[]> = {};
  sentimentItems.forEach(item => {
    if (!dailySentiment[item.date]) dailySentiment[item.date] = [];
    dailySentiment[item.date].push(item.score); // -1..1 already
  });

  // Average sentiment per date
  const sentimentByDate: Record<string, number> = {};
  for (const [date, scores] of Object.entries(dailySentiment)) {
    sentimentByDate[date] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Merge price + sentiment only for overlapping dates
  const merged = goldData
    .map(priceItem => {
      const formattedDate = new Date(priceItem.date).toISOString().split("T")[0];
      const sentimentScore = sentimentByDate[formattedDate];
      if (sentimentScore === undefined) return null;
      return {
        date: formattedDate,
        price: Number(priceItem.close!.toFixed(2)), // format price to 2 decimals
        sentiment: Number((sentimentScore * 20).toFixed(2)), // scale then format
      };
    })
    .filter((d): d is { date: string; price: number; sentiment: number } => d !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Limit to last 30 matching days if there are more
  return merged.slice(-30);
}, [sentimentItems, goldData]);

  return <SentimentPriceChart data={combinedData} />;
}

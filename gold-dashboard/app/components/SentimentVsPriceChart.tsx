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
          price: priceItem.close!,
          sentiment: sentimentScore,
        };
      })
      .filter((d): d is { date: string; price: number; sentiment: number } => d !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Limit to last 30 matching days if there are more
    const last30 = merged.slice(-30);

    // Scale sentiment for visualization
    const SCALE_FACTOR = 20;
    return last30.map(d => ({
      ...d,
      sentiment: d.sentiment * SCALE_FACTOR,
    }));
  }, [sentimentItems, goldData]);

  return <SentimentPriceChart data={combinedData} />;
}

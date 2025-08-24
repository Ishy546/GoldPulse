"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  sentimentItems: { date: string; source: string; score: number }[];
}

export default function MultiSourceSentimentChartClient({ sentimentItems }: Props) {
  const chartData = useMemo(() => {
    if (!sentimentItems.length) return [];

    const perDayPerSource: Record<string, Record<string, number[]>> = {};
    sentimentItems.forEach(item => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!perDayPerSource[date]) perDayPerSource[date] = {};
      if (!perDayPerSource[date][item.source]) perDayPerSource[date][item.source] = [];
      perDayPerSource[date][item.source].push(item.score);
    });

    const dailyScores: Record<string, Record<string, number>> = {};
    for (const [date, sources] of Object.entries(perDayPerSource)) {
      const entry: Record<string, number> = {};
      let compositeSum = 0;
      let compositeCount = 0;

      for (const [src, scores] of Object.entries(sources)) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const scaled = avg * 20; // scale to match first chart
  const rounded = Number(scaled.toFixed(2)); // same 2-decimal formatting
  entry[src] = rounded;
  compositeSum += rounded;
  compositeCount++;
}

      entry.composite = compositeCount > 0 ? Number((compositeSum / compositeCount).toFixed(3)) : 0;
      dailyScores[date] = entry;
    }

    return Object.entries(dailyScores)
      .map(([date, vals]) => ({ date, ...vals }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sentimentItems]);

  const sources = useMemo(() => {
    const allSources = new Set<string>();
    sentimentItems.forEach(item => allSources.add(item.source));
    return Array.from(allSources);
  }, [sentimentItems]);

  const generateColor = (index: number) => `hsl(${(index * 80) % 360}, 70%, 45%)`;

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 30, right: 50, left: 20, bottom: 30 }}
        >
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 13, fill: "#666" }}
            tickFormatter={(str) =>
              new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 13, fill: "#666" }}
            label={{
              value: "Sentiment Score",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: "#4caf50",
              style: { fontWeight: 600 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              fontSize: "14px",
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            }
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 14, fontWeight: 600 }}
          />
          {sources.map((src, i) => (
            <Line
              key={src}
              type="monotone"
              dataKey={src}
              stroke={generateColor(i)}
              strokeWidth={2}
              dot={{ r: 2, fill: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name={src}
            />
          ))}
          <Line
            type="monotone"
            dataKey="composite"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 2, fill: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Composite"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
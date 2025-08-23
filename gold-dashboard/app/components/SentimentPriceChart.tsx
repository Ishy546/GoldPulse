"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  date: string;
  price: number;
  sentiment: number;
};

type Props = { data: DataPoint[] };

  export default function SentimentPriceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        data={data}
        margin={{ top: 30, right: 50, left: 20, bottom: 30 }}
      >
        {/* Soft grid for better readability */}
        <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" />

        {/* X-axis with better spacing */}
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: "#666" }}
          tickFormatter={(str) =>
            new Date(str).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
          padding={{ left: 10, right: 10 }}
        />

        {/* Left Y-axis for Gold Price */}
        <YAxis
          yAxisId="left"
          domain={["auto", "auto"]}
          tick={{ fontSize: 13, fill: "#666" }}
          label={{
            value: "Gold Price ($)",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fill: "#ff9800",
            style: { fontWeight: 600 },
          }}
        />

        {/* Right Y-axis for Sentiment */}
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={["auto", "auto"]}
          tick={{ fontSize: 13, fill: "#666" }}
          label={{
            value: "Sentiment",
            angle: 90,
            position: "insideRight",
            offset: 10,
            fill: "#4caf50",
            style: { fontWeight: 600 },
          }}
        />

        {/* Tooltip with nicer formatting */}
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

        {/* Legend styling */}
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ fontSize: 14, fontWeight: 600 }}
        />

        {/* Gold Price Line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="price"
          stroke="#ff9800"
          strokeWidth={3}
          dot={{ r: 2, stroke: "#ff9800", strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 6 }}
          name="Gold Price"
        />

        {/* Sentiment Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sentiment"
          stroke="#4caf50"
          strokeWidth={3}
          dot={{ r: 2, stroke: "#4caf50", strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 6 }}
          name="Avg Sentiment"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
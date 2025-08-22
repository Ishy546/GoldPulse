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
      <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(str) =>
            new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
        />
        <YAxis
          yAxisId="left"
          domain={["auto", "auto"]}
          tick={{ fontSize: 12 }}
          label={{
            value: "Gold Price",
            angle: -90,
            position: "insideLeft",
            offset: 10,
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={["auto", "auto"]}
          tick={{ fontSize: 12 }}
          label={{
            value: "Sentiment (scaled)",
            angle: 90,
            position: "insideRight",
            offset: 10,
          }}
        />
        <Tooltip
          labelFormatter={(label) =>
            new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="price"
          stroke="#ff9800"
          strokeWidth={2}
          dot={false}
          name="Gold Price"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sentiment"
          stroke="#4caf50"
          strokeWidth={2}
          dot={false}
          name="Avg Sentiment"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export function GoldLineChart() {
  const [goldData, setGoldData] = useState<{ date: string; close: number }[]>([]);

  useEffect(() => {
    async function loadGold() {
      const res = await fetch("/api/gold");
      const data = await res.json();
      setGoldData(data);
    }
    loadGold();
  }, []);

  const minY =
    goldData.length > 0
      ? Math.min(...goldData.map((d) => d.close)) * 0.95
      : undefined;

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-bold text-4xl text-center mb-8">Gold Price Trend</h1>
      <div className="w-full max-w-5xl p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={goldData} >
            {/* Gradient fill definition */}
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f797e1" stopOpacity={0.7} />
                <stop offset="100%" stopColor="white" stopOpacity={1} />
              </linearGradient>
            </defs>

            {/* Grid for visual clarity */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X axis */}
            <XAxis
              dataKey="date"
              angle={45}
              textAnchor="start"
              interval={15}
              height={60}
              tick={{ fontSize: 14, fontWeight: "bold" }}
              label={{
    position: "insideBottom",
    offset: -5,
    style: { fontSize: 20, fontStyle: "italic", fontFamily: "Arial" },
    textAnchor: "middle",
  }}
            />

            {/* Y axis */}
            <YAxis
              tick={{ fontSize: 14, fontWeight: "bold" }}
              label={{
    value: "Close Price (USD)",
    angle: -90,
    textAnchor: "start",
    style: { fontSize: 20, fontStyle: "italic", fontFamily: "Arial" },
  }}
              domain={[minY || "auto", "auto"]}
            />

            {/* Tooltip + Legend */}
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 14 }} />

            {/* Filled area under the line */}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#cb0c9f"
              strokeWidth={3}
              fill="url(#goldGradient)"
              dot={{ stroke: "#cb0c9f", strokeWidth: 3, r: 3 }}
              name="Gold Price"
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GoldLineChart;

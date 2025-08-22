"use client";
import { useMemo } from "react";
import { calculateMACD } from "../utils/calculations";
import { Item } from "../utils/extraFunc";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Bar
} from "recharts";


const MacdChart = ({ data }: { data: Item[] }) => {
  const closes = data
    .map((item) => Number(item.close))
    .filter((c) => !Number.isNaN(c));

  // Calculate using standard (12,26,9)
  const macd = useMemo(() => calculateMACD(closes), [closes]);
  if (!macd) return null;

  const slowPeriod = 26;
const signalPeriod = 9;

const chartData = data
  .slice(slowPeriod - 1)
  .slice(signalPeriod - 1)
  .map((item, idx) => ({
    date: item.date,
    macd: Number(macd.macdLine[idx]?.toFixed(2)) || 0,
    signal: Number(macd.signalLine[idx]?.toFixed(2)) || 0,
    histogram: Number(macd.histogram[idx]?.toFixed(2)) || 0,
  }));

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="font-bold text-2xl mb-4">MACD (12, 26, 9)</h2>
      <div className="w-full max-w-4xl p-4 bg-white rounded-2xl shadow-lg">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={Math.floor(chartData.length / 6)}
              tick={{ fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis tick={{ fontSize: 12, fontWeight: "bold" }} />
            <Tooltip formatter={(value: number) => value != null ? value.toFixed(2) : "0.00"} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            {/* MACD Line */}
            <Line
              type="monotone"
              dataKey="macd"
              strokeWidth={2}
              dot={false}
              name="MACD"
            />

            {/* Signal Line */}
            <Line
              type="monotone"
              dataKey="signal"
              strokeWidth={2}
              dot={false}
              name="Signal"
            />

            {/* Histogram as bars */}
            <Bar dataKey="histogram" barSize={3} name="Histogram" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MacdChart;
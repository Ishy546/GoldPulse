"use client";
import { Item } from "../utils/extraFunc";
import { calculateRSI } from "../utils/calculations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

const RsiChart = ({ data }: { data: Item[] }) => {
  const closes = data
  .map((item) => Number(item.close))
  .filter((c) => !Number.isNaN(c));

  // Make sure we pass at least period+1 points
  const period = 14;
  const rsiValues = calculateRSI(closes, period) || [];

  // Build chart data only for valid RSI values
  const trimmedRSI = rsiValues.slice(0, data.length - period);
    const chartData = data.slice(period).map((item, idx) => ({
        date: item.date,
        rsi: trimmedRSI[idx],
    }));

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="font-bold text-2xl mb-4">RSI (14)</h2>
      <div className="w-full max-w-4xl p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={Math.floor(chartData.length / 6)}
              tick={{ fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis
              domain={[0, 100]}
              tickCount={6}
              tick={{ fontSize: 12, fontWeight: "bold" }}
            />
            <Tooltip formatter={(val: number) => val.toFixed(0)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            
            {/* Optional standard RSI reference levels */}
            <ReferenceLine y={70} stroke="#ff0000" strokeDasharray="4 4" />
            <ReferenceLine y={30} stroke="#00ff00" strokeDasharray="4 4" />

            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#008FFB"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              name="RSI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RsiChart;
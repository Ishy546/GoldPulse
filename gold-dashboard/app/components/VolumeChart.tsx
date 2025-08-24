"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Item } from "../utils/extraFunc";

const VolumeChart = ({ data }: { data: Item[] }) => {
  const cutoff = 20000;

  // Keep original volume + clipped version for rendering
  const chartData = data.map((item) => ({
    date: item.date,
    volume: item.volume ?? 0, // true volume
    clippedVolume: Math.min(item.volume ?? 0, cutoff), // for bar rendering
  }));

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="font-bold text-2xl mb-4">Volume</h2>
      <div className="w-full max-w-4xl p-4 bg-white rounded-2xl shadow-lg">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={Math.floor(chartData.length / 6)}
              tick={{ fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis
              domain={[0, cutoff]} // keep axis max at cutoff
              tick={{ fontSize: 12, fontWeight: "bold" }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              formatter={(_, __, props: any) => [
                props.payload.volume.toLocaleString(), // show real volume
                "Volume",
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="clippedVolume"
              barSize={6}
              name="Volume"
              fill="#8884d8"
              shape={(props: any) => {
                const { height, y, value, x, width, payload } = props;
                const color = payload.volume > cutoff ? "#ff4d4f" : "#8884d8";
                return (
                  <rect x={x} y={y} width={width} height={height} fill={color} />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
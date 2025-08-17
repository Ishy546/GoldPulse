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

const VolumeChart = ({
  data,
}: {
  data: Item[];
}) => {
  // Use only the most recent `limit` entries
  const cutoff = 20000; // volumes above this will be clipped

const chartData = data.map(item => ({
  date: item.date,
  volume: Math.min(item.volume ?? 0, cutoff),
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
      scale="pow"
      exponent={0.5}
      tick={{ fontSize: 12, fontWeight: "bold" }}
      tickFormatter={(value) => value.toLocaleString()}
    />
    <Tooltip />
    <Legend wrapperStyle={{ fontSize: 12 }} />
    <Bar
  dataKey="volume"
  barSize={6}
  name="Volume"
  fill="#8884d8"
  shape={(props: any) => {
    const { height, y, value, x, width } = props;
    const color = value === cutoff ? "#ff4d4f" : "#8884d8";
    return <rect x={x} y={y} width={width} height={height} fill={color} />;
  }}
/>

  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
};

export default VolumeChart;
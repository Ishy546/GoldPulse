"use client";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { ChartOptions, ScriptableChartContext } from "chart.js";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale,   // y axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

function LineChart() {
  const [goldData, setGoldData] = useState<{ date: string; close: number }[]>([]);

  useEffect(() => {
    async function loadGold() {
      const res = await fetch("/api/gold");
      const data = await res.json();
      setGoldData(data);
    }
    loadGold();
  }, []);

  const data = {
    labels: goldData.map((d) => d.date),
    datasets: [
      {
        label: "Gold Price",
        data: goldData.map((d) => d.close),
        borderColor: "#cb0c9f",
        borderWidth: 3,
        pointBorderColor: "#cb0c9f",
        pointBorderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (context: ScriptableChartContext) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#f797e1");
          gradient.addColorStop(1, "white");
          return gradient;
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { font: { size: 14 } } },
      tooltip: { mode: "nearest", intersect: false },
    },
    interaction: { mode: "index", intersect: false },
    spanGaps: true,
    scales: {
      y: {
        ticks: { font: { size: 14, weight: "bold" } },
        title: {
          display: true,
          text: "Close Price (USD)",
          font: { size: 20, style: "italic", family: "Arial" },
        },
        min: goldData.length > 0 ? Math.min(...goldData.map(d => d.close)) * 0.95 : undefined,
      },
      x: {
        ticks: { font: { size: 14, weight: "bold" }, maxRotation: 45, minRotation: 45 },
        title: {
          display: true,
          text: "Date",
          font: { size: 20, style: "italic", family: "Arial" },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-bold text-4xl text-center mb-8">Gold Price Trend</h1>
      <div className="w-full max-w-5xl p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Line data={data} options={options}></Line>
      </div>
    </div>
  );
}

export default LineChart;
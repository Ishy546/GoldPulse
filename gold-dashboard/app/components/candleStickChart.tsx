"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
type Item ={
    date: Date,
    open: number | null,
    high: number | null,
    low: number | null,
    close: number | null,
    volume: number | null,
}
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function GoldChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/gold");
        const result = await res.json();

        // ApexCharts needs this format: [timestamp, open, high, low, close]
        const seriesData = result.slice(-90).map((item: Item) => [
            new Date(item.date).getTime(),
            item.open!,
            item.high!,
            item.low!,
            item.close!,
        ]);
        setData(seriesData);
      } catch (err) {
        console.error("Error fetching gold data:", err);
      }
    }
    

    fetchData();
  }, []);
  const prices = data.flatMap(d => [d[1], d[2], d[3], d[4]]); // open, high, low, close
    const minPrice = Math.min(...prices) * 0.9995; // 5% lower for padding
    const maxPrice = Math.max(...prices) * 1.0005; // 5% higher for padding

  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Gold Daily Price",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
        min: (min: number) => min * 0.95,
        max: (max: number) => max * 1.05,
      tooltip: {
        enabled: true,
      },
    },
  };

  const series = [
    {
      data,
    },
  ];

  return <Chart options={options} series={series} type="candlestick" height={350} />;
}
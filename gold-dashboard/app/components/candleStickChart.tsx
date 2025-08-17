"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Item } from "../utils/extraFunc";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function GoldChart({ data }: { data: Item[] }) {
    const seriesData = data.slice(-90).map((item: Item) => [
        new Date(item.date).getTime(),
        Number(item.open),
        Number(item.high),
        Number(item.low),
        Number(item.close),
    ]);

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
      data: seriesData,
    },
  ];

  return <Chart options={options} series={series} type="candlestick" height={350} />;
}
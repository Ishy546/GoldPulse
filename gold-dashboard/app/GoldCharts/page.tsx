"use client"

import GoldLineChart from "@/app/components/lineChart"
import GoldCandlestick from "../components/candleStickChart"
import RsiChart from "../components/RsiChart";
import { useState, useEffect } from "react"
import { Item } from "../utils/extraFunc";

export default function Page() {
  const [data, setData] = useState<Item[]>([]); // inside the component

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/gold");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching gold data:", err);
      }
    }

    fetchData();
  }, []);

  
  return (
    <>
      <GoldLineChart data={data}/>
      <GoldCandlestick data={data}/>
      <RsiChart data={data}/>
    </>
  );
}

import { NextResponse } from "next/server";
import fetchGoldData from "@/app/GoldCharts/fetchGold";

export async function GET() {
  const data = await fetchGoldData();
  return NextResponse.json(data);
}
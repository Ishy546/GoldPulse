import { NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import fetchGoldData from "@/app/utils/fetchGold";

export async function GET() {
  const data = await fetchGoldData();
  return NextResponse.json(data);
}
/*
export async function GET() {
  fetchGoldData()
  const { data, error } = await supabase
    .from("gold_prices")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch gold data" }, { status: 500 });
  }
  return NextResponse.json(data);
}
  */
import { NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import fetchGoldData from "@/app/utils/fetchGold";

export async function GET() {
  try {
    // 1. Try reading from Supabase first
    const { data, error } = await supabase
      .from("gold_prices")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase read error:", error.message);
    }

    if (data && data.length > 0) {
      // Return cached data if available
      return NextResponse.json(data);
    }

    // 2. If no cached data, fetch from Yahoo Finance
    console.log("No data found in Supabase, fetching from Yahoo Finance...");
    const freshData = await fetchGoldData();

    // 3. Insert into Supabase so it's cached for next time
    const { error: insertError } = await supabase
      .from("gold_prices")
      // @ts-expect-error onConflict typing isn't strict
      .upsert(freshData, { onConflict: ["date"] });

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
    }

    // 4. Return the freshly fetched data to the client
    return NextResponse.json(freshData);
  } catch (err) {
    console.error("Error in /api/gold:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
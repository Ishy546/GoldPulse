import { NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import { fetchAndStoreData } from "@/app/utils/StoreData";
import { SentimentItem } from "@/app/utils/fetchSentiment";

export async function GET() {
  try {
    // 1) Try reading from Supabase first
    const { data, error } = await supabase
      .from("sentiment_table")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase read error:", error.message);
    }

    if (data && data.length > 0) {
      // Return cached data
      return NextResponse.json(data);
    }

    // 2) If no data, fetch live
    console.log("No sentiment data in DB, fetching live...");
    const freshData: SentimentItem[] = await fetchAndStoreData();

    if (freshData.length > 0) {
      // 3) Upsert into Supabase so future requests are cached
      const { error: insertError } = await supabase
        .from("sentiment_table")
        // @ts-expect-error onConflict typing isn't strict
        .upsert(freshData, { onConflict: ["date", "url"] });

      if (insertError) console.error("Supabase insert error:", insertError.message);
    }

    // 4) Return freshly fetched data
    return NextResponse.json(freshData);
  } catch (err) {
    console.error("Error in /api/sentiment:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
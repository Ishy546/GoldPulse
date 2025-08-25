export const runtime = "nodejs";  // 👈 forces Node runtime instead of Edge
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import { fetchAndStoreData } from "@/app/utils/StoreData";
import { SentimentItem } from "@/app/utils/fetchSentiment";

export async function GET(_req: NextRequest){
    try{
 // 1) Fetch fresh sentiment data
    const sentimentData: SentimentItem[] = await fetchAndStoreData();

    if (!sentimentData || sentimentData.length === 0) {
      console.warn("No sentiment data fetched this run.");
      return NextResponse.json({ success: true, inserted: 0 });
    }

    // 2) Delete rows older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: deleteError } = await supabase
      .from("sentiment_table")
      .delete()
      .lt("date", thirtyDaysAgo.toISOString().split("T")[0]);

    if (deleteError) {
      console.error("Error deleting old sentiment rows:", deleteError.message);
    }

    // 3) Upsert new sentiment data
    // Make sure you have a UNIQUE constraint on (date, url) or (date, title)
    const { error: upsertError } = await supabase
      .from("sentiment_table")
      // @ts-expect-error onConflict type isn't strict
      .upsert(sentimentData, { onConflict: ["date", "url"] });

    if (upsertError) {
      console.error("Error upserting sentiment data:", upsertError.message);
      throw upsertError;
    }

    return NextResponse.json({ success: true, inserted: sentimentData.length });
  } catch (err) {
    console.error("Error in /api/update-sentiment:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
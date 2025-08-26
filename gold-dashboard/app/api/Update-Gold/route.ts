import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import fetchGoldData from "@/app/utils/fetchGold";

export async function GET(_req: NextRequest) {
  try {
    // Always fetch the last 6 months from Yahoo
    const goldData = await fetchGoldData();

    // Upsert everything first (this ensures if fetch partially fails, we don't lose old data)
    const { error: upsertError } = await supabase
      .from("gold_prices")
      // @ts-expect-error onConflict typing is not strict
      .upsert(goldData, { onConflict: ["date"] });

    if (upsertError) throw upsertError;

    // Then prune anything older than 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { error: deleteError } = await supabase
      .from("gold_prices")
      .delete()
      .lt("date", sixMonthsAgo.toISOString().split("T")[0]);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, updated: goldData.length });
  } catch (err) {
    console.error("Error refreshing gold data:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
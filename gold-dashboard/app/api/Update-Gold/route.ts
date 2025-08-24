import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/utils/supabase-client";
import fetchGoldData from "@/app/utils/fetchGold";

export async function GET(_req: NextRequest) {
  try {
    const goldData = await fetchGoldData();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Remove old data
    await supabase
      .from("gold_prices")
      .delete()
      .lt("date", sixMonthsAgo.toISOString().split("T")[0]);

    // Bulk upsert
    const { error } = await supabase
      .from("gold_prices")
      // @ts-expect-error onConflict type is not strict
      .upsert(goldData, { onConflict: ["date"] });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
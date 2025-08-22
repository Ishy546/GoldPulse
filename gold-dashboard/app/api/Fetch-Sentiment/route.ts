import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreData } from "@/app/utils/StoreData";
import { SentimentItem } from "@/app/utils/fetchSentiment";

export async function GET(_req: NextRequest) {
  try {
    const sentimentData: SentimentItem[] = await fetchAndStoreData();
    return NextResponse.json(sentimentData);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch sentiment data" },
      { status: 500 }
    );
  }
}
import yahooFinance from "yahoo-finance2"
import supabase from "./supabase-client";
export default async function fetchGoldData(){
    const today = new Date();
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(today.getMonth() - 6);
    try {
        // "GC=F" is gold futures symbol
        // Adjust range as needed
        const goldData = await yahooFinance.chart("GC=F", {
            period1: nineMonthsAgo.toISOString().split("T")[0],
            period2: today.toISOString().split("T")[0],
            interval: "1d"
        })
        const mapped = goldData.quotes.map(item => ({
      date: new Date(item.date).toISOString().split("T")[0], // YYYY-MM-DD
      open: item.open?.toFixed(2)!,
      high: item.high?.toFixed(2)!,
      low: item.low?.toFixed(2)!,
      close: item.close?.toFixed(2)!,
      volume: item.volume?.toFixed(2)!
    }));
    return mapped
    // the rest dont worry about except when deploying
    // --- insert into Supabase ---
    const { error } = await supabase
      .from("gold_prices")
      .upsert(mapped, { onConflict: "date" }); 
      // upsert avoids duplicates

    if (error) {
      console.error("Error inserting gold data:", error);
      throw new Error("Supabase insert failed");
    }

    return mapped; // still return for API usage

    }catch (err){
        console.log(err)
        throw new Error("yFinance data not fetching")
    }
    
    // make sure you return the gold prices mapped
}
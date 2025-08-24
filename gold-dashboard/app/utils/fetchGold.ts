import yahooFinance from "yahoo-finance2";

export default async function fetchGoldData() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  try {
    // "GC=F" is gold futures symbol
    const goldData = await yahooFinance.chart("GC=F", {
      period1: sixMonthsAgo.toISOString().split("T")[0],
      period2: today.toISOString().split("T")[0],
      interval: "1d",
    });

    const mapped = goldData.quotes.map(item => ({
      date: new Date(item.date).toISOString().split("T")[0], // YYYY-MM-DD
      open: item.open?.toFixed(2) ?? null,
      high: item.high?.toFixed(2) ?? null,
      low: item.low?.toFixed(2) ?? null,
      close: item.close?.toFixed(2) ?? null,
      volume: item.volume ?? null, // volume should stay integer
    }));

    return mapped;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch gold price data from Yahoo Finance");
  }
}
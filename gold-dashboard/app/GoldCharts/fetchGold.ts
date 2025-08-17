import yahooFinance from "yahoo-finance2"
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
         return goldData.quotes.map(item => ({
      date: new Intl.DateTimeFormat('en-US').format(new Date(item.date)),
      open: item.open?.toFixed(2),
      high: item.high?.toFixed(2),
      low: item.low?.toFixed(2),
      close: item.close?.toFixed(2),
      volume: item.volume?.toFixed(2)
    }));

    }catch (err){
        throw new Error("yFinance data not fetching")
    }
    
    // make sure you return the gold prices mapped
}
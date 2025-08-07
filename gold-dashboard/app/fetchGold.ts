export async function fetchGold(){
    const res = await fetch("")//https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD
    const data = res.json()
    // make sure you return the gold prices mapped
}
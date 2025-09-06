# GoldPulse
A full-stack Next.js dashboard that tracks gold market trends and sentiment.

## 🚀 Live Demo
[View Project](https://gold-pulse.vercel.app)



GoldPulse is a data-driven dashboard that combines **financial market data** and **social/news sentiment analysis** to provide insights into gold price movements.  

- 📊 **Charts:** Technical indicators (Close Price, RSI, MACD, Volume, Candlesticks)  
- 📰 **Sentiment Analysis:** Reddit + Finnhub news, averaged and compared against gold price  
- ⚡ **Automation:** Daily data refresh via Vercel cron jobs, stored in Supabase  
- 🖥️ **Tech Stack:** Next.js, Supabase, Recharts, ApexCharts, Reddit OAuth, Finnhub API, yFinance, Vercel  

### /GoldCharts
- Close price vs date
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Volume
- Candlestick chart

### /Sentiment
- Gold close price vs average sentiment
- Sentiment by source (Reddit, Finnhub)

### Dashboard (/)
- Navbar navigation (Home, Gold, Sentiment)
- Overview of data sources and insights

### Supabase - Data and Automation
- **Gold Data**: Fetched from yFinance API (past 6 months), stored in Supabase  
- **Sentiment Data**: Reddit OAuth + Finnhub API (last 7 days, expanding to 30 days)  
- **Automation**: Vercel cron jobs run daily  
  - Gold data: upserts new day, removes tail to maintain rolling dataset  
  - Sentiment data: updates daily scores in Supabase  

**Check it out!**
export function calculateRSI(prices: number[] | null, period = 14): number[] | undefined {
    if (prices===null){
        return []
    }
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  // Initialize with first `period` changes
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  gains /= period;
  losses /= period;

  // First RSI value
  let rs = gains / losses;
  rsi[period] = 100 - 100 / (1 + rs);

  // Subsequence RSI
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];

    if (diff >= 0) {
      gains = (gains * (period - 1) + diff) / period;
      losses = (losses * (period - 1)) / period;
    } else {
      gains = (gains * (period - 1)) / period;
      losses = (losses * (period - 1) - diff) / period;
    }

    rs = gains / losses;
    rsi[i] = 100 - 100 / (1 + rs);
  }

  return rsi;
}

function calculateEMA(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];

  // Seed the EMA with a simple moving average for the first value
  const initialSMA =
    values.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  ema.push(initialSMA);

  for (let i = period; i < values.length; i++) {
    const price = values[i];
    const prevEma = ema[ema.length - 1];
    ema.push(price * k + prevEma * (1 - k));
  }

  return ema;
}
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  if (closes.length < slowPeriod) return null;

  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  // Align to same length
  const macdLine: number[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i + (slowPeriod - fastPeriod)] - slowEMA[i]);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine
    .slice(signalPeriod - 1)
    .map((val, idx) => val - signalLine[idx]);

  return {
    macdLine: macdLine.slice(signalPeriod - 1),
    signalLine,
    histogram,
  };
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",  // Feb
    day: "2-digit",  // 28
    // year removed
  });
}
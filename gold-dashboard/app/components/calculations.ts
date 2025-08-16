function calculateRSI(prices: number[], period = 14): number[] {
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

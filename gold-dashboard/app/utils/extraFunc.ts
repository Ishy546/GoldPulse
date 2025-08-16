export function movingAverage(data: number[], n: number) {
  return data.map((d, i, arr) => {
    if (i < n - 1) return { date: d.date, sma: null };
    const slice = arr.slice(i - n + 1, i + 1);
    const avg = slice.reduce((sum, val) => sum + val.close, 0) / n;
    return { date: d.date, sma: avg };
  });
}
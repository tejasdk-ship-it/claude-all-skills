import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Serverless route to fetch live Yahoo Finance chart & quote
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'TSLA').toUpperCase();
  const range = searchParams.get('range') || '1d';
  const interval = searchParams.get('interval') || '5m';

  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  const hosts = ['https://query2.finance.yahoo.com', 'https://query1.finance.yahoo.com'];

  for (const host of hosts) {
    try {
      const url = `${host}/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=true`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
        },
        next: { revalidate: 10 } // Cache 10 seconds
      });

      if (res.ok) {
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (result) {
          const meta = result.meta;
          const quotes = result.indicators?.quote?.[0] || {};
          const timestamps = result.timestamp || [];

          const currentPrice = meta.regularMarketPrice || meta.chartPreviousClose || 0;
          const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
          const change = currentPrice - prevClose;
          const changePct = prevClose ? (change / prevClose) * 100 : 0;

          // Build clean candle list
          const candles = [];
          for (let i = 0; i < timestamps.length; i++) {
            if (quotes.close && quotes.close[i] !== null && quotes.close[i] !== undefined) {
              candles.push({
                time: timestamps[i],
                open: quotes.open?.[i] || quotes.close[i],
                high: quotes.high?.[i] || quotes.close[i],
                low: quotes.low?.[i] || quotes.close[i],
                close: quotes.close[i],
                volume: quotes.volume?.[i] || 0
              });
            }
          }

          return NextResponse.json({
            success: true,
            source: 'live-yahoo',
            symbol,
            price: Number(currentPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePct: Number(changePct.toFixed(2)),
            high: meta.regularMarketDayHigh || (candles.length ? Math.max(...candles.map(c => c.high)) : currentPrice),
            low: meta.regularMarketDayLow || (candles.length ? Math.min(...candles.map(c => c.low)) : currentPrice),
            volume: meta.regularMarketVolume || 0,
            candles: candles.slice(-78) // recent 78 5-min bars
          });
        }
      }
    } catch (err) {
      // Continue to next host or fallback
    }
  }

  // Graceful fallback for offline / rate-limited cloud IPs
  return NextResponse.json({
    success: true,
    source: 'simulated-fixture',
    symbol,
    price: symbol === 'NVDA' ? 142.60 : symbol === 'AAPL' ? 231.45 : 364.18,
    change: symbol === 'NVDA' ? 3.10 : symbol === 'AAPL' ? -0.85 : 4.82,
    changePct: symbol === 'NVDA' ? 2.22 : symbol === 'AAPL' ? -0.37 : 1.34,
    high: 366.50,
    low: 353.90,
    volume: 48200000,
    candles: []
  });
}

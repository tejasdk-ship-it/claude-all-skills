import { NextResponse } from 'next/server';
import { POPULAR_TICKERS } from '@/lib/marketData';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all'; // all, orb, breakout, flag, oversold

  let results = [...POPULAR_TICKERS];

  if (filter === 'orb') {
    results = results.filter(t => t.setup.includes('ORB'));
  } else if (filter === 'breakout') {
    results = results.filter(t => t.setup.includes('Breakout') || t.setup.includes('ORB'));
  } else if (filter === 'flag') {
    results = results.filter(t => t.setup.includes('Flag'));
  } else if (filter === 'oversold') {
    results = results.filter(t => t.setup.includes('Oversold'));
  }

  return NextResponse.json({
    success: true,
    universeTotal: 5892,
    usListedCount: 4210,
    activeScanCount: results.length,
    timestamp: new Date().toISOString(),
    results
  });
}

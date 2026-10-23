import { NextResponse } from 'next/server';
import { INITIAL_PELOSI_TRADES } from '@/lib/marketData';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const member = (searchParams.get('member') || '').toLowerCase();
  const symbol = (searchParams.get('symbol') || '').toUpperCase();

  let trades = [...INITIAL_PELOSI_TRADES];

  if (member) {
    trades = trades.filter(t => t.filer.toLowerCase().includes(member));
  }
  if (symbol) {
    trades = trades.filter(t => t.symbol === symbol);
  }

  return NextResponse.json({
    success: true,
    totalDisclosures: trades.length,
    source: 'House Clerk Public Disclosure Index (STOCK Act PTRs)',
    trades
  });
}

import { NextResponse } from 'next/server';
import { INITIAL_NEWS } from '@/lib/marketData';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'TSLA').toUpperCase();

  try {
    const rssUrl = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (DayTraderApp/2.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 30 }
    });

    if (res.ok) {
      const xmlText = await res.text();
      // Regex parsing of RSS items without heavy external XML libraries
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
      const linkRegex = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i;
      const pubDateRegex = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i;

      const items = [];
      let match;
      let count = 0;

      while ((match = itemRegex.exec(xmlText)) !== null && count < 15) {
        const itemContent = match[1];
        const titleMatch = titleRegex.exec(itemContent);
        const linkMatch = linkRegex.exec(itemContent);
        const dateMatch = pubDateRegex.exec(itemContent);

        if (titleMatch && titleMatch[1]) {
          const title = titleMatch[1].trim();
          const link = linkMatch ? linkMatch[1].trim() : `https://finance.yahoo.com/quote/${symbol}`;
          const dateStr = dateMatch ? dateMatch[1].trim() : new Date().toLocaleTimeString();

          // Generate smart tags
          const tags = [];
          const lower = title.toLowerCase();
          if (lower.includes('earning') || lower.includes('eps') || lower.includes('revenue')) tags.push('earnings');
          if (lower.includes('sec') || lower.includes('8-k') || lower.includes('filing')) tags.push('8-K');
          if (lower.includes('deal') || lower.includes('buy') || lower.includes('merger') || lower.includes('acquire')) tags.push('deal');
          if (lower.includes('ai') || lower.includes('chip') || lower.includes('tech')) tags.push('tech/ai');
          if (tags.length === 0) tags.push('market');

          // Sentiment detection
          let sentiment = 'neutral';
          if (lower.includes('surge') || lower.includes('jump') || lower.includes('beat') || lower.includes('high') || lower.includes('record') || lower.includes('bull')) {
            sentiment = 'bullish';
          } else if (lower.includes('drop') || lower.includes('fall') || lower.includes('miss') || lower.includes('plunge') || lower.includes('probe') || lower.includes('slump')) {
            sentiment = 'bearish';
          }

          items.push({
            id: `rss-${count}-${Date.now()}`,
            ticker: symbol,
            headline: title,
            time: dateStr,
            source: 'Yahoo Finance RSS',
            type: tags.includes('8-K') ? '8-K' : 'headline',
            tags,
            sentiment,
            url: link
          });
          count++;
        }
      }

      if (items.length > 0) {
        return NextResponse.json({ success: true, source: 'live-rss', news: items });
      }
    }
  } catch (err) {
    // fallback below
  }

  // Fallback to rich curated items if Yahoo RSS blocked/empty
  const fallback = INITIAL_NEWS.filter(n => n.ticker === symbol || symbol === 'ALL');
  return NextResponse.json({
    success: true,
    source: 'fixture',
    news: fallback.length > 0 ? fallback : INITIAL_NEWS
  });
}

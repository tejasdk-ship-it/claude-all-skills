'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { INITIAL_NEWS } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function NewsTab({ activeSymbol, activePrice, activeChangePct }) {
  const [newsItems, setNewsItems] = useState(INITIAL_NEWS);
  const [filterType, setFilterType] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/news?symbol=${activeSymbol}`);
      const data = await res.json();
      if (data && data.news && data.news.length > 0) {
        setNewsItems(data.news);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [activeSymbol]);

  const filteredNews = newsItems.filter(item => {
    const matchesSymbol = item.ticker === activeSymbol || item.ticker === 'ALL' || item.headline.toLowerCase().includes(activeSymbol.toLowerCase());
    const matchesFilter = filterType === 'ALL' || 
      (filterType === '8-K' && item.type === '8-K') ||
      (filterType === 'EARNINGS' && item.tags.includes('earnings')) ||
      (filterType === 'DEAL' && item.tags.includes('deal'));
    const matchesSearch = item.headline.toLowerCase().includes(searchFilter.toLowerCase());
    return (matchesSymbol || newsItems.length < 3) && matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Active Stock News Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-news</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                News Monitor & SEC 8-K Filings for {activeSymbol}
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Real-time headlines and SEC Form 8-K filings. Checks for material catalysts, deals, and reports before market entry.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TODAY'S MOVE</div>
              <div className="font-mono" style={{ 
                fontWeight: '700', 
                color: activeChangePct >= 0 ? 'var(--neon-green)' : 'var(--neon-red)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {activeChangePct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                ${activePrice?.toFixed(2)} ({activeChangePct >= 0 ? '+' : ''}{activeChangePct?.toFixed(2)}%)
              </div>
            </div>

            <button 
              onClick={() => {
                sound.playClick();
                fetchNews();
              }} 
              className="btn btn-secondary" 
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['ALL', '8-K', 'EARNINGS', 'DEAL'].map(type => (
            <button
              key={type}
              onClick={() => {
                sound.playClick();
                setFilterType(type);
              }}
              className="btn"
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                borderRadius: '16px',
                background: filterType === type ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: filterType === type ? '#070A12' : 'var(--text-secondary)',
                fontWeight: filterType === type ? '700' : '500',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {type === 'ALL' ? 'All Updates' : type === '8-K' ? 'SEC 8-K Filings' : type}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Stream */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Newspaper size={16} style={{ color: 'var(--neon-cyan)' }} />
          Catalyst Timeline ({filteredNews.length} items)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNews.map((news) => (
            <div
              key={news.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="font-mono badge badge-cyan">{news.ticker}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{news.source}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{news.time}</span>
                  
                  {news.type === '8-K' && (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>SEC FORM 8-K</span>
                  )}
                  {news.sentiment === 'bullish' && (
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Bullish Catalyst</span>
                  )}
                  {news.sentiment === 'bearish' && (
                    <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>Bearish Catalyst</span>
                  )}
                </div>

                <a 
                  href={news.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    lineHeight: '1.4',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {news.headline}
                  <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                </a>

                {news.tags && news.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {news.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

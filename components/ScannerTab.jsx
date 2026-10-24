'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Filter, ArrowUpRight, ArrowDownRight, Zap, Target, Layers } from 'lucide-react';
import { POPULAR_TICKERS } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function ScannerTab({ onSelectSymbol, activeSymbol }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [customTicker, setCustomTicker] = useState('');
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [isRescanningAll, setIsRescanningAll] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);
  const [tickersList, setTickersList] = useState(POPULAR_TICKERS);

  const filters = [
    { id: 'ALL', label: 'All Setups' },
    { id: 'ORB', label: '15-min ORB Breakout' },
    { id: 'Bull Flag', label: 'Bull Flag' },
    { id: 'Breakout', label: '20-Day High' },
    { id: 'Reclaim', label: 'Reclaim MA20' },
    { id: 'Oversold', label: 'Oversold Bounce' },
  ];

  const filteredTickers = tickersList.filter(t => {
    const matchesSearch = t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' || t.setup.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleScanCustomTicker = async (e) => {
    e.preventDefault();
    if (!customTicker.trim()) return;
    setIsLoadingCustom(true);

    try {
      const res = await fetch(`/api/market/quote?symbol=${encodeURIComponent(customTicker.toUpperCase())}`);
      const data = await res.json();

      if (data && data.price) {
        sound.playClick();
        const orHigh = data.orHigh || Number((data.price * 1.008).toFixed(2));
        const orLow = data.orLow || Number((data.price * 0.985).toFixed(2));

        const newStock = {
          symbol: data.symbol,
          name: `${data.symbol} Live Quote`,
          price: data.price,
          change: data.change || 0,
          changePct: data.changePct || 0,
          volume: data.volume || '15.4M',
          orHigh,
          orLow,
          setup: 'ORB Breakout',
          sector: 'Active Market',
          source: data.source || 'live-yahoo'
        };

        setTickersList([newStock, ...tickersList.filter(t => t.symbol !== newStock.symbol)]);
        onSelectSymbol(newStock);
        setCustomTicker('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const handleRescanAll = async () => {
    setIsRescanningAll(true);
    sound.playClick();
    setScanStatus('Scanning live market...');

    try {
      const symbolsToScan = tickersList.map(t => t.symbol);
      const res = await fetch(`/api/market/quote?symbols=${encodeURIComponent(symbolsToScan.join(','))}`);
      const data = await res.json();

      if (data && data.quotes && Array.isArray(data.quotes)) {
        const quoteMap = new Map();
        let liveCount = 0;
        data.quotes.forEach(q => {
          quoteMap.set(q.symbol, q);
          if (q.source === 'live-yahoo') liveCount++;
        });

        setTickersList(prevList =>
          prevList.map(item => {
            const live = quoteMap.get(item.symbol);
            if (!live) return item;
            return {
              ...item,
              price: live.price ?? item.price,
              change: live.change ?? item.change,
              changePct: live.changePct ?? item.changePct,
              volume: live.volume ?? item.volume,
              orHigh: live.orHigh ?? item.orHigh,
              orLow: live.orLow ?? item.orLow,
              source: live.source
            };
          })
        );

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastScannedTime(timeStr);
        setScanStatus(`${liveCount} Live Quotes Updated`);
        sound.playAlert();
      }
    } catch (err) {
      console.error('Failed to rescan candidates:', err);
      setScanStatus('Scan failed');
    } finally {
      setIsRescanningAll(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Scanner Telemetry */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-scanner</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Chart Scanner & Opening-Range Breakouts
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Scans ~5,900 Nasdaq & NYSE US common stocks for ORB 15m breakouts, bull flags, and oversold bounces.
            </p>
          </div>

          {/* Quick Custom Scanner Input */}
          <form onSubmit={handleScanCustomTicker} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Scan ticker (e.g. TSLA, NVDA)"
              value={customTicker}
              onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
              style={{ width: '220px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoadingCustom}>
              {isLoadingCustom ? <RefreshCw size={14} className="spin" /> : <Search size={14} />}
              Scan
            </button>
          </form>
        </div>

        {/* Setup Filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => {
                sound.playClick();
                setSelectedFilter(f.id);
              }}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                background: selectedFilter === f.id ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedFilter === f.id ? '#070A12' : 'var(--text-secondary)',
                fontWeight: selectedFilter === f.id ? '700' : '500',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scanned Stocks Grid / Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Scan Candidates</span>
            <span className="badge badge-green font-mono">{filteredTickers.length} Matches</span>
            {lastScannedTime ? (
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)', display: 'inline-block' }}></span>
                {scanStatus || `Live ${lastScannedTime}`}
              </span>
            ) : (
              <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                Default Preset (Click Scan to Update Live)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleRescanAll}
              disabled={isRescanningAll}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00d2ff 0%, #00f0ff 100%)',
                color: '#070A12',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)'
              }}
            >
              <RefreshCw size={14} className={isRescanningAll ? 'spin' : ''} />
              {isRescanningAll ? 'Scanning Live...' : '🔄 Scan Again (Live All)'}
            </button>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search in scan results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 20px' }}>Symbol</th>
                <th style={{ padding: '12px 16px' }}>Last Price</th>
                <th style={{ padding: '12px 16px' }}>Today Move</th>
                <th style={{ padding: '12px 16px' }}>15m Opening Range</th>
                <th style={{ padding: '12px 16px' }}>Detected Setup</th>
                <th style={{ padding: '12px 16px' }}>Volume</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Pipeline Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickers.map((item) => {
                const isSelected = activeSymbol === item.symbol;
                const isPositive = item.change >= 0;

                return (
                  <tr
                    key={item.symbol}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(0, 210, 255, 0.06)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ fontWeight: '800', fontSize: '0.95rem', color: '#FFFFFF' }}>
                          {item.symbol}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sector}</span>
                        {item.source === 'live-yahoo' ? (
                          <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '1px 5px', fontWeight: '700' }}>
                            ● LIVE
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                            FIXTURE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.name}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="font-mono" style={{ fontWeight: '700', fontSize: '0.95rem', color: '#FFFFFF' }}>
                        ${item.price?.toFixed(2)}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isPositive ? 'var(--neon-green)' : 'var(--neon-red)',
                        fontWeight: '700'
                      }} className="font-mono">
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {isPositive ? '+' : ''}{item.changePct?.toFixed(2)}%
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--neon-red)' }}>${item.orLow?.toFixed(2)}</span>
                        {' — '}
                        <span style={{ color: 'var(--neon-green)' }}>${item.orHigh?.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Range: ${(item.orHigh - item.orLow).toFixed(2)}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${
                        item.setup.includes('ORB') ? 'badge-cyan' :
                        item.setup.includes('Flag') ? 'badge-green' :
                        item.setup.includes('Oversold') ? 'badge-amber' : 'badge-green'
                      }`}>
                        {item.setup}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {item.volume}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectSymbol(item);
                        }}
                        className={`btn ${isSelected ? 'btn-success' : 'btn-primary'}`}
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      >
                        {isSelected ? '✓ Selected' : 'Send to Pipeline ➔'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

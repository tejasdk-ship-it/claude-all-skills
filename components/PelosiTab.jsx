'use client';

import React, { useState } from 'react';
import { Landmark, Search, ExternalLink, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { INITIAL_PELOSI_TRADES } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function PelosiTab({ onSelectSymbol }) {
  const [trades, setTrades] = useState(INITIAL_PELOSI_TRADES);
  const [filterMember, setFilterMember] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const members = ['ALL', 'Pelosi', 'McCaul'];

  const filtered = trades.filter(t => {
    const matchesMember = filterMember === 'ALL' || t.filer.toLowerCase().includes(filterMember.toLowerCase());
    const matchesSearch = t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.filer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMember && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-pelosi</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Pelosi & Congress Stock Trade Tracker (STOCK Act PTRs)
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Reads the House Clerk's public financial disclosures (Periodic Transaction Reports). Due within 45 days under the STOCK Act.
            </p>
          </div>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search member, stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '32px', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Member filter buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {members.map(m => (
            <button
              key={m}
              onClick={() => {
                sound.playClick();
                setFilterMember(m);
              }}
              className="btn"
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                borderRadius: '16px',
                background: filterMember === m ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: filterMember === m ? '#070A12' : 'var(--text-secondary)',
                fontWeight: filterMember === m ? '700' : '500',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {m === 'ALL' ? 'All Members' : `Rep. ${m}`}
            </button>
          ))}
        </div>
      </div>

      {/* Disclosures Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={16} style={{ color: 'var(--neon-green)' }} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Recent Congressional Filings</span>
          </div>
          <span className="badge badge-green font-mono">{filtered.length} Disclosures</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 20px' }}>Filer & District</th>
                <th style={{ padding: '12px 16px' }}>Ticker & Asset</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Amount Range</th>
                <th style={{ padding: '12px 16px' }}>Dates & Delay</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const isBuy = t.txType.toLowerCase().includes('purchase');

                return (
                  <tr
                    key={t.docId}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#FFFFFF' }}>{t.filer}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.stateDistrict} • Doc #{t.docId}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="font-mono" style={{ fontWeight: '800', color: 'var(--neon-cyan)', fontSize: '0.95rem' }}>
                          {t.symbol}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.company}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {t.assetType} ({t.owner})
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${isBuy ? 'badge-green' : 'badge-red'}`}>
                        {t.txType}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="font-mono" style={{ fontWeight: '700', color: '#FFFFFF' }}>
                        {t.amountRange}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Traded: <span className="font-mono">{t.txDate}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Filed: <span className="font-mono">{t.filedDate}</span> ({t.daysDelayed}d lag)
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectSymbol({
                            symbol: t.symbol,
                            name: t.company,
                            price: t.symbol === 'NVDA' ? 142.60 : t.symbol === 'MSFT' ? 428.50 : 231.45,
                            change: 3.10,
                            changePct: 2.22,
                            setup: 'Congressional Momentum'
                          });
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Trade {t.symbol} ➔
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

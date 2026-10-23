'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { INITIAL_ANALYST_FACTS } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function AnalystTab({ activeSymbol }) {
  const [facts, setFacts] = useState(INITIAL_ANALYST_FACTS[activeSymbol] || INITIAL_ANALYST_FACTS.TSLA);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analyst?symbol=${activeSymbol}`);
      const json = await res.json();
      if (json && json.data) {
        setFacts(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts();
  }, [activeSymbol]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-analyst</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Earnings Analyst & SEC EDGAR Facts ({facts.symbol})
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Reads company financial facts directly from SEC EDGAR XBRL filings. Tracks quarterly EPS, margin expansion, and revenue.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-green font-mono">CIK: {facts.cik}</span>
            <button 
              onClick={() => {
                sound.playClick();
                fetchFacts();
              }} 
              className="btn btn-secondary" 
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              Query EDGAR
            </button>
          </div>
        </div>
      </div>

      {/* Financial Scorecard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>QUARTERLY REVENUE</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>
            {facts.revenue}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neon-green)', marginTop: '2px' }}>
            YoY: {facts.revenueYoY}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EPS (DILUTED)</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-green)', marginTop: '4px' }}>
            {facts.epsReported}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            vs consensus {facts.epsConsensus} ({facts.epsBeat})
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GROSS MARGIN</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-cyan)', marginTop: '4px' }}>
            {facts.grossMargin}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Operating Income: {facts.operatingIncome}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CASH & SHORT-TERM INV.</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>
            {facts.cashAndInvestments}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Total Debt: {facts.debtTotal}
          </div>
        </div>
      </div>

      {/* SEC Filing Highlights */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} style={{ color: 'var(--neon-green)' }} />
          Management Discussion & Key Operational Highlights ({facts.latestQuarter})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {facts.highlights?.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--neon-cyan)', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, PieChart, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { calculatePositionSize } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function BudgetTab({ tradePlan, setTradePlan, onProceedToRisk }) {
  const [accountBudget, setAccountBudget] = useState(5000);
  const [maxLossUSD, setMaxLossUSD] = useState(50);

  const entry = tradePlan.entryPrice || 364.18;
  const stop = tradePlan.stopPrice || 358.32;
  const target = tradePlan.targetPrice || 370.04;

  const sizing = calculatePositionSize({
    accountBudget,
    maxLossUSD,
    entryPrice: entry,
    stopPrice: stop,
    targetPrice: target
  });

  const handleUpdateShares = (shares) => {
    setTradePlan(prev => ({
      ...prev,
      shares,
      budget: accountBudget,
      maxLossUSD
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-budget</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Budget Manager & Position Sizing Calculator
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Sizes the exact position based on your account size and max loss per trade: <span className="font-mono">Shares = MaxLoss / (Entry - Stop)</span>.
            </p>
          </div>

          <div className="badge badge-green" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            Risk Controlled: &lt;= ${maxLossUSD} Loss
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Controls */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} style={{ color: 'var(--neon-cyan)' }} />
            Account Sizing Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Cash Balance</label>
                <span className="font-mono" style={{ fontWeight: '700', color: '#FFFFFF' }}>${accountBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={accountBudget}
                onChange={(e) => setAccountBudget(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {[2000, 5000, 10000, 25000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAccountBudget(val)}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                  >
                    ${val / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Max Loss Allowed Per Trade ($)</label>
                <span className="font-mono" style={{ fontWeight: '700', color: 'var(--neon-red)' }}>${maxLossUSD}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={maxLossUSD}
                onChange={(e) => setMaxLossUSD(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {[25, 50, 100, 200].map(val => (
                  <button
                    key={val}
                    onClick={() => setMaxLossUSD(val)}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stop Distance per Share:</span>
                <span className="font-mono" style={{ color: 'var(--neon-red)' }}>${sizing.riskPerShare}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Calculation:</span>
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>${maxLossUSD} / ${sizing.riskPerShare} = {sizing.shares} shares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} style={{ color: 'var(--neon-green)' }} />
            Position Output & Bracket Metrics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 210, 255, 0.08)', border: '1px solid var(--border-highlight)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>POSITION SIZE</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-cyan)' }}>
                {sizing.shares} Shares
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                ${sizing.totalCost?.toLocaleString()} notional
              </div>
            </div>

            <div style={{ background: 'rgba(255, 71, 87, 0.08)', border: '1px solid rgba(255, 71, 87, 0.25)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MAX LOSS AT STOP</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-red)' }}>
                -${sizing.maxLossActual}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                if filled at ${stop.toFixed(2)}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.25)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED GAIN AT TARGET</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-green)' }}>
                +${sizing.maxGainActual}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                if filled at ${target.toFixed(2)}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PORTFOLIO EXPOSURE</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
                {sizing.portfolioPct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                of ${accountBudget.toLocaleString()} equity
              </div>
            </div>
          </div>

          {/* Formatted Alpaca Bracket Order Spec */}
          <div style={{ marginTop: '16px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PROPOSED BRACKET ORDER</div>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--neon-green)' }}>
              BUY {sizing.shares} {tradePlan.symbol} @ MKT/LMT ${entry.toFixed(2)} • STOP ${stop.toFixed(2)} • TP ${target.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Position sized to {sizing.shares} shares. Ready for pre-trade 7-point safety audit.
        </div>
        <button
          onClick={() => {
            sound.playClick();
            handleUpdateShares(sizing.shares);
            onProceedToRisk(sizing.shares);
          }}
          className="btn btn-primary"
          style={{ padding: '10px 24px', fontSize: '0.9rem' }}
        >
          Proceed to 7-Point Risk Check
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

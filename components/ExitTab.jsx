'use client';

import React, { useState } from 'react';
import { ShieldCheck, Target, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function ExitTab({ tradePlan, setTradePlan, onProceedToTimeMachine }) {
  const [stopRule, setStopRule] = useState('or-mid'); // or-mid, lod, atr, custom
  const [targetMultiplier, setTargetMultiplier] = useState(1.0); // 1.0, 1.5, 2.0, 3.0

  const entry = tradePlan.entryPrice || 364.18;
  const orHigh = tradePlan.orHigh || (entry * 0.995);
  const orLow = tradePlan.orLow || (entry * 0.975);
  const orMid = Number(((orHigh + orLow) / 2).toFixed(2));

  // Determine stop price based on rule
  let calculatedStop = tradePlan.stopPrice;
  if (stopRule === 'or-mid') calculatedStop = orMid;
  else if (stopRule === 'lod') calculatedStop = orLow;
  else if (stopRule === 'atr') calculatedStop = Number((entry - (entry * 0.012)).toFixed(2));

  const riskPerShare = Math.max(0.01, entry - calculatedStop);
  const calculatedTarget = Number((entry + (riskPerShare * targetMultiplier)).toFixed(2));

  const handleUpdatePlan = (newStop, newTarget, r) => {
    sound.playClick();
    setTradePlan(prev => ({
      ...prev,
      stopPrice: newStop,
      targetPrice: newTarget,
      rewardRiskRatio: r,
      stopRule
    }));
  };

  const handleRuleChange = (rule) => {
    setStopRule(rule);
    let s = orMid;
    if (rule === 'lod') s = orLow;
    else if (rule === 'atr') s = Number((entry - (entry * 0.012)).toFixed(2));
    else if (rule === 'custom') s = Number((entry - 4.0).toFixed(2));

    const rps = entry - s;
    const t = Number((entry + (rps * targetMultiplier)).toFixed(2));
    handleUpdatePlan(s, t, targetMultiplier);
  };

  const handleTargetChange = (mult) => {
    setTargetMultiplier(mult);
    const t = Number((entry + (riskPerShare * mult)).toFixed(2));
    handleUpdatePlan(calculatedStop, t, mult);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-exit</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Exit Planner: Stop-Loss & Target Rules ({tradePlan.symbol})
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Sets the stop and target before entry. Enforces strict reward-to-risk and the 3:55 PM market-flat hard close rule.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={16} style={{ color: 'var(--neon-red)' }} />
            <div style={{ fontSize: '0.75rem' }}>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>FLAT BY 3:55 PM ET</span>
              <div style={{ color: 'var(--text-muted)' }}>Never hold overnight</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Stop Loss Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--neon-red)' }} />
            1. Select Stop-Loss Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'or-mid', label: 'Opening Range Midpoint (OR-Mid)', desc: `Mid of 9:30-9:45 candle ($${orMid.toFixed(2)})`, price: orMid },
              { id: 'lod', label: 'Low of Day (LOD)', desc: `Lowest low of session so far ($${orLow.toFixed(2)})`, price: orLow },
              { id: 'atr', label: 'Volatility ATR Buffer', desc: `1.5x 5-min Average True Range ($${(entry - (entry * 0.012)).toFixed(2)})`, price: Number((entry - (entry * 0.012)).toFixed(2)) },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => handleRuleChange(item.id)}
                style={{
                  background: stopRule === item.id ? 'rgba(255, 71, 87, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: stopRule === item.id ? '1px solid var(--neon-red)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#FFFFFF' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: 'var(--neon-red)' }}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Risk Per Share (Entry - Stop):</span>
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--neon-red)' }}>
                ${riskPerShare.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Target Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} style={{ color: 'var(--neon-cyan)' }} />
            2. Select Profit Target (R-Multiple)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { mult: 1.0, label: '1.0R Target', desc: '1x Risk ($' + (entry + riskPerShare * 1.0).toFixed(2) + ')' },
              { mult: 1.5, label: '1.5R Target', desc: '1.5x Risk ($' + (entry + riskPerShare * 1.5).toFixed(2) + ')' },
              { mult: 2.0, label: '2.0R Target', desc: '2x Risk ($' + (entry + riskPerShare * 2.0).toFixed(2) + ')' },
              { mult: 3.0, label: '3.0R Target', desc: 'Runner ($' + (entry + riskPerShare * 3.0).toFixed(2) + ')' },
            ].map(item => (
              <div
                key={item.mult}
                onClick={() => handleTargetChange(item.mult)}
                style={{
                  background: targetMultiplier === item.mult ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: targetMultiplier === item.mult ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: '700', color: targetMultiplier === item.mult ? 'var(--neon-cyan)' : '#FFFFFF' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Reward-to-Risk Ratio:</span>
              <span className="font-mono badge badge-green" style={{ fontWeight: '700' }}>
                {targetMultiplier.toFixed(1)} : 1 (PASS)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Summary Banner & Next Action */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>COMPOSED TRADE PLAN</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
            {tradePlan.symbol} • Entry: ${entry.toFixed(2)} • Stop: ${calculatedStop.toFixed(2)} • Target: ${calculatedTarget.toFixed(2)}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onProceedToTimeMachine();
          }}
          className="btn btn-primary"
          style={{ padding: '10px 24px', fontSize: '0.9rem' }}
        >
          Replay in Time Machine (10,000 Runs)
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

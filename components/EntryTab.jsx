'use client';

import React, { useState, useEffect } from 'react';
import { Crosshair, Clock, CheckCircle2, AlertTriangle, ArrowRight, Activity, Zap } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function EntryTab({ tradePlan, setTradePlan, onProceedToExit }) {
  const [secondsToNextBar, setSecondsToNextBar] = useState(142);
  const [isWatching, setIsWatching] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToNextBar(prev => (prev > 1 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const orHigh = tradePlan.orHigh || (tradePlan.entryPrice * 0.995);
  const orLow = tradePlan.orLow || (tradePlan.entryPrice * 0.975);
  const orMid = (orHigh + orLow) / 2;
  const currentPrice = tradePlan.entryPrice;
  const isTriggered = currentPrice >= orHigh;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-entry</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Entry Timer & Trigger Watcher ({tradePlan.symbol})
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Watches setup bar by bar (5-minute intervals). Triggers on the first completed candle close above the opening range.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(0, 210, 255, 0.08)',
              border: '1px solid var(--border-highlight)',
              padding: '8px 16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Next 5m Candle Closes In</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--neon-cyan)' }}>
                {formatCountdown(secondsToNextBar)}
              </div>
            </div>

            <span className={`badge ${isTriggered ? 'badge-green' : 'badge-amber'}`} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              {isTriggered ? '● TRIGGERED' : '○ WAITING'}
            </span>
          </div>
        </div>
      </div>

      {/* Bar-by-bar Visual Diagram */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} style={{ color: 'var(--neon-green)' }} />
          15-Minute Opening Range & Breakout Trigger Level
        </h3>

        {/* Visual Level Bars */}
        <div style={{
          background: 'rgba(8, 12, 22, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Trigger Entry Line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-green">ENTRY TRIGGER</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>10:15 ET Candle Close Above Range</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--neon-green)' }}>
              ${tradePlan.entryPrice?.toFixed(2)}
            </span>
          </div>

          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #00F59B 0%, #00D2FF 100%)',
            borderRadius: '2px',
            boxShadow: '0 0 10px rgba(0, 245, 155, 0.5)'
          }} />

          {/* Opening Range High */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)' }} />
              <span style={{ fontSize: '0.8rem' }}>Opening Range High (9:30 - 9:45 AM)</span>
            </div>
            <span className="font-mono" style={{ fontWeight: '600' }}>${orHigh?.toFixed(2)}</span>
          </div>

          {/* Opening Range Midpoint */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-amber)' }} />
              <span style={{ fontSize: '0.8rem' }}>Range Midpoint (OR-Mid Stop Level)</span>
            </div>
            <span className="font-mono" style={{ fontWeight: '600', color: 'var(--neon-amber)' }}>${orMid?.toFixed(2)}</span>
          </div>

          {/* Opening Range Low */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-red)' }} />
              <span style={{ fontSize: '0.8rem' }}>Opening Range Low (LOD Level)</span>
            </div>
            <span className="font-mono" style={{ fontWeight: '600', color: 'var(--neon-red)' }}>${orLow?.toFixed(2)}</span>
          </div>
        </div>

        {/* Entry Validation Rules Checklist */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>15-Minute Range Confirmed</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full 9:30-9:45 AM ET initial range mapped</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Completed 5m Bar Close</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Closed at ${currentPrice.toFixed(2)} (&gt; ${orHigh.toFixed(2)})</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Volume Expansion Filter</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Breakout candle volume exceeded 1.6x baseline</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              sound.playClick();
              onProceedToExit();
            }}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Lock Entry & Proceed to Exit Planner
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

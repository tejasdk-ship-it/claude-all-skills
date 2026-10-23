'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Lock } from 'lucide-react';
import { auditRiskRules } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function RiskTab({ tradePlan, onProceedToBroker }) {
  const order = {
    symbol: tradePlan.symbol,
    entryPrice: tradePlan.entryPrice,
    stopPrice: tradePlan.stopPrice,
    targetPrice: tradePlan.targetPrice,
    shares: tradePlan.shares || 8,
    tradesToday: 1
  };

  const audit = auditRiskRules({ order });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-risk</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Pre-Trade Risk Auditor & 7 Safety Rules
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Every proposed order is checked against your account limits, stop loss requirements, and trading windows before execution.
            </p>
          </div>

          <div style={{
            background: audit.allPassed ? 'rgba(0, 245, 155, 0.15)' : 'rgba(255, 71, 87, 0.15)',
            border: `1px solid ${audit.allPassed ? 'var(--neon-green)' : 'var(--neon-red)'}`,
            borderRadius: '8px',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {audit.allPassed ? (
              <CheckCircle2 size={20} style={{ color: 'var(--neon-green)' }} />
            ) : (
              <XCircle size={20} style={{ color: 'var(--neon-red)' }} />
            )}
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AUDIT VERDICT</div>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '900', color: audit.allPassed ? 'var(--neon-green)' : 'var(--neon-red)' }}>
                {audit.verdict}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Point Checklist */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} style={{ color: 'var(--neon-cyan)' }} />
          Automated Risk Safety Checklist
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {audit.checks.map((chk, idx) => {
            const isPass = chk.status === 'PASS';

            return (
              <div
                key={chk.name}
                style={{
                  background: isPass ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 71, 87, 0.08)',
                  border: isPass ? '1px solid var(--border-subtle)' : '1px solid var(--neon-red)',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isPass ? 'rgba(0, 245, 155, 0.15)' : 'rgba(255, 71, 87, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: isPass ? 'var(--neon-green)' : 'var(--neon-red)'
                  }}>
                    {idx + 1}
                  </span>

                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#FFFFFF' }}>{chk.name}</div>
                    <div style={{ fontSize: '0.75rem', color: isPass ? 'var(--text-muted)' : 'var(--neon-red)', marginTop: '2px' }}>
                      {chk.reason}
                    </div>
                  </div>
                </div>

                <span className={`badge ${isPass ? 'badge-green' : 'badge-red'}`} style={{ fontWeight: '800' }}>
                  {chk.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {audit.allPassed 
            ? '✓ All 7 safety criteria passed. Order ticket is ready for broker execution.' 
            : '⚠️ Order blocked by risk manager. Adjust stop, size or timing to proceed.'}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onProceedToBroker();
          }}
          disabled={!audit.allPassed}
          className="btn btn-primary"
          style={{ padding: '10px 24px', fontSize: '0.9rem', opacity: audit.allPassed ? 1 : 0.5 }}
        >
          View & Confirm Broker Ticket
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

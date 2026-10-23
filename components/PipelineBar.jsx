'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { sound } from '@/lib/sound';

export const PIPELINE_STEPS = [
  { id: 'scanner', stepNum: 1, label: 'Scanner', desc: 'Setup Found' },
  { id: 'news', stepNum: 2, label: 'News', desc: 'Catalyst' },
  { id: 'entry', stepNum: 3, label: 'Entry', desc: 'Trigger' },
  { id: 'exit', stepNum: 4, label: 'Exit', desc: 'Stop & 1R' },
  { id: 'timemachine', stepNum: 5, label: 'Time Machine', desc: '10k Odds' },
  { id: 'budget', stepNum: 6, label: 'Budget', desc: 'Size Sizing' },
  { id: 'risk', stepNum: 7, label: 'Risk', desc: '7-Check Audit' },
  { id: 'broker', stepNum: 8, label: 'Broker', desc: 'Ready Ticket' },
];

export default function PipelineBar({ activeTab, setActiveTab, tradePlan, riskAudit }) {
  const isAuditPassed = riskAudit?.verdict === 'PASS';

  return (
    <div style={{
      background: 'rgba(11, 16, 28, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Active Trade Summary Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(0, 210, 255, 0.1)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Setup:</span>
          <span className="font-mono" style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1rem' }}>
            {tradePlan.symbol}
          </span>
          <span className="font-mono" style={{ color: 'var(--neon-green)', fontWeight: '700' }}>
            ${tradePlan.entryPrice?.toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Stop:</span>
          <span className="font-mono" style={{ color: 'var(--neon-red)', fontWeight: '600' }}>
            ${tradePlan.stopPrice?.toFixed(2)}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>Target:</span>
          <span className="font-mono" style={{ color: 'var(--neon-cyan)', fontWeight: '600' }}>
            ${tradePlan.targetPrice?.toFixed(2)}
          </span>
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
            {tradePlan.rewardRiskRatio || 1.0}R
          </span>
        </div>
      </div>

      {/* Sequential Pipeline Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
        {PIPELINE_STEPS.map((step, idx) => {
          const isActive = activeTab === step.id;
          const isPassed = step.id === 'risk' ? isAuditPassed : true;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab(step.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'rgba(0, 210, 255, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: isActive ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#070A12' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: '800'
                }}>
                  {step.stepNum}
                </span>
                <span>{step.label}</span>
              </button>

              {idx < PIPELINE_STEPS.length - 1 && (
                <ArrowRight size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

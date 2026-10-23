'use client';

import React, { useState, useEffect } from 'react';
import { Hourglass, Play, RefreshCw, BarChart2, CheckCircle2, ArrowRight, Activity, Percent } from 'lucide-react';
import { runTimeMachineSim } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function TimeMachineTab({ tradePlan, setTradePlan, onProceedToBudget }) {
  const [replays, setReplays] = useState(10000);
  const [seed, setSeed] = useState(19);
  const [isRunning, setIsRunning] = useState(false);
  const [simResults, setSimResults] = useState(null);

  const entry = tradePlan.entryPrice || 364.18;
  const stop = tradePlan.stopPrice || 358.32;
  const target = tradePlan.targetPrice || 370.04;

  const runSimulation = () => {
    setIsRunning(true);
    sound.playClick();

    setTimeout(() => {
      const results = runTimeMachineSim({
        entryPrice: entry,
        stopPrice: stop,
        targetPrice: target,
        replaysCount: replays,
        seed
      });
      setSimResults(results);
      setIsRunning(false);
      sound.playTargetHit();
    }, 400);
  };

  useEffect(() => {
    runSimulation();
  }, [entry, stop, target]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-timemachine</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Time Machine: 10,000 Session Replays ({tradePlan.symbol})
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Replays every possible outcome before risking a dollar: 10,000 simulated runs scaled to recent 5-minute bars.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seed:</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 1)}
                style={{ width: '60px', padding: '4px 8px', fontSize: '0.8rem', textAlign: 'center' }}
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ padding: '8px 16px' }}
            >
              {isRunning ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
              Rerun 10k Sim
            </button>
          </div>
        </div>
      </div>

      {/* Honest Verdict Banner */}
      {simResults && (
        <div style={{
          background: 'rgba(16, 23, 41, 0.85)',
          border: `1px solid ${simResults.verdictColor}`,
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: `0 0 25px rgba(0, 0, 0, 0.4)`
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge font-mono" style={{ background: simResults.verdictColor, color: '#070A12', fontWeight: '800' }}>
                HONEST ODDS VERDICT
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                {simResults.verdict}
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              {simResults.lean}. At {simResults.rMultiple}R, break-even requires {simResults.breakEvenShare}% target wins; simulation hit {simResults.actualTargetShare}%.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(0, 245, 155, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 245, 155, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TARGET FIRST</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-green)' }}>
                {simResults.targetPct}%
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 71, 87, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STOP FIRST</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-red)' }}>
                {simResults.stopPct}%
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(255, 184, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OPEN AT 3:55 PM</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--neon-amber)' }}>
                {simResults.neitherPct}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fan Chart Visualization */}
      {simResults && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={16} style={{ color: 'var(--neon-cyan)' }} />
              Monte Carlo Fan Chart: Percentile Trajectory Paths
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Entry: ${entry.toFixed(2)} • Stop: ${stop.toFixed(2)} • Target: ${target.toFixed(2)}
            </div>
          </div>

          {/* SVG Fan Chart Visualizer */}
          <div style={{
            background: 'rgba(7, 10, 18, 0.95)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg viewBox="0 0 800 240" style={{ width: '100%', height: '240px' }}>
              <defs>
                <linearGradient id="fanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FF4757" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Target Line */}
              <line x1="50" y1="40" x2="780" y2="40" stroke="#00F59B" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="785" y="44" fill="#00F59B" fontSize="10" fontFamily="monospace" textAnchor="end">
                Target: ${target.toFixed(2)}
              </text>

              {/* Entry Line */}
              <line x1="50" y1="120" x2="780" y2="120" stroke="#00D2FF" strokeWidth="1.5" />
              <text x="785" y="124" fill="#00D2FF" fontSize="10" fontFamily="monospace" textAnchor="end">
                Entry: ${entry.toFixed(2)}
              </text>

              {/* Stop Line */}
              <line x1="50" y1="200" x2="780" y2="200" stroke="#FF4757" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="785" y="204" fill="#FF4757" fontSize="10" fontFamily="monospace" textAnchor="end">
                Stop: ${stop.toFixed(2)}
              </text>

              {/* Median Fan Path */}
              <path
                d="M 50 120 Q 200 110, 400 100 T 750 90"
                fill="none"
                stroke="#00D2FF"
                strokeWidth="2.5"
              />

              {/* 95th Percentile Top Band */}
              <path
                d="M 50 120 Q 200 80, 400 60 T 750 45"
                fill="none"
                stroke="rgba(0, 245, 155, 0.6)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* 5th Percentile Bottom Band */}
              <path
                d="M 50 120 Q 200 160, 400 180 T 750 195"
                fill="none"
                stroke="rgba(255, 71, 87, 0.6)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Sample simulated paths */}
              {simResults.samplePaths?.slice(0, 12).map((item, idx) => {
                const color = item.outcome === 'target' ? 'rgba(0, 245, 155, 0.25)' : item.outcome === 'stop' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 255, 255, 0.15)';
                const points = item.path.map((val, step) => {
                  const x = 50 + (step / (item.path.length - 1)) * 700;
                  // scale entry to y=120, stop to y=200, target to y=40
                  const diff = val - entry;
                  const range = Math.max(Math.abs(target - entry), Math.abs(stop - entry));
                  const y = 120 - (diff / (range || 1)) * 80;
                  return `${x.toFixed(1)},${Math.min(230, Math.max(10, y)).toFixed(1)}`;
                }).join(' L ');

                return (
                  <path
                    key={idx}
                    d={`M ${points}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                  />
                );
              })}
            </svg>

            {/* Percentile Stats Strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.8rem'
            }}>
              <div><span style={{ color: 'var(--text-muted)' }}>5th Pct: </span><span className="font-mono" style={{ color: 'var(--neon-red)' }}>${simResults.percentiles.p05.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--text-muted)' }}>25th Pct: </span><span className="font-mono">${simResults.percentiles.p25.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Median (50th): </span><span className="font-mono" style={{ color: 'var(--neon-cyan)', fontWeight: '700' }}>${simResults.percentiles.p50.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--text-muted)' }}>75th Pct: </span><span className="font-mono">${simResults.percentiles.p75.toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--text-muted)' }}>95th Pct: </span><span className="font-mono" style={{ color: 'var(--neon-green)' }}>${simResults.percentiles.p95.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Odds calculated. Ready to size the position according to your budget and max loss limit.
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onProceedToBudget();
          }}
          className="btn btn-primary"
          style={{ padding: '10px 24px', fontSize: '0.9rem' }}
        >
          Proceed to Budget & Position Sizer
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

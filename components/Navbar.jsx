'use client';

import React from 'react';
import { 
  Radar, 
  Newspaper, 
  Crosshair, 
  ShieldCheck, 
  Hourglass, 
  Calculator, 
  AlertTriangle, 
  Send, 
  Bell, 
  BarChart3, 
  Landmark,
  Sliders,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { sound } from '@/lib/sound';

export const SKILL_TABS = [
  { id: 'scanner', label: 'Scanner', icon: Radar, skill: '/trader-scanner', desc: 'Chart Screener' },
  { id: 'news', label: 'News', icon: Newspaper, skill: '/trader-news', desc: 'Headlines & 8-Ks' },
  { id: 'entry', label: 'Entry', icon: Crosshair, skill: '/trader-entry', desc: 'Timing & Trigger' },
  { id: 'exit', label: 'Exit', icon: ShieldCheck, skill: '/trader-exit', desc: 'Stop & Target' },
  { id: 'timemachine', label: 'Time Machine', icon: Hourglass, skill: '/trader-timemachine', desc: '10k Replays' },
  { id: 'budget', label: 'Budget', icon: Calculator, skill: '/trader-budget', desc: 'Position Sizer' },
  { id: 'risk', label: 'Risk', icon: AlertTriangle, skill: '/trader-risk', desc: '7-Point Auditor' },
  { id: 'broker', label: 'Broker', icon: Send, skill: '/trader-broker', desc: 'Order Execution' },
  { id: 'alerts', label: 'Alerts', icon: Bell, skill: '/trader-alerts', desc: 'Price & Bell' },
  { id: 'analyst', label: 'Analyst', icon: BarChart3, skill: '/trader-analyst', desc: 'SEC EDGAR Facts' },
  { id: 'pelosi', label: 'Pelosi', icon: Landmark, skill: '/trader-pelosi', desc: 'Congress PTRs' },
];

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  marketStatus = 'REGULAR', 
  nyseTime = '10:15:00 AM ET',
  isMuted,
  setIsMuted,
  onOpenSettings,
  activeAlertsCount = 0
}) {
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleTestBell = () => {
    sound.playBell();
  };

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'rgba(7, 10, 18, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Top Telemetry Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '1.1rem', 
              fontWeight: '900', 
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #00D2FF 0%, #00F59B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ⚡ DAY TRADER PRO
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>v2.0 Claude</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span className="pulse-dot pulse-green" />
            <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{nyseTime}</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: '600' }}>NYSE {marketStatus}</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>Closes 4:00 PM (Flat by 3:55 PM)</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleTestBell}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            title="Ring NYSE Opening/Closing Bell"
          >
            🔔 Bell Chime
          </button>

          <button 
            onClick={toggleSound}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={14} style={{ color: 'var(--neon-red)' }} /> : <Volume2 size={14} style={{ color: 'var(--neon-green)' }} />}
            {isMuted ? 'Muted' : 'Sound On'}
          </button>

          <button 
            onClick={onOpenSettings}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            <Sliders size={14} />
            Config
          </button>
        </div>
      </div>

      {/* Main 11 Skills Navigation Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        gap: '4px'
      }}>
        {SKILL_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                background: isActive ? 'rgba(0, 210, 255, 0.08)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              <Icon 
                size={16} 
                style={{ 
                  color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.6))' : 'none'
                }} 
              />
              <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{tab.label}</span>
                  {tab.id === 'alerts' && activeAlertsCount > 0 && (
                    <span className="badge badge-amber" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>
                      {activeAlertsCount}
                    </span>
                  )}
                  {tab.id === 'timemachine' && (
                    <span className="badge badge-cyan" style={{ padding: '1px 5px', fontSize: '0.6rem' }}>
                      10k
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {tab.skill}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </header>
  );
}

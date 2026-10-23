'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Key, AlertCircle } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function SettingsModal({ isOpen, onClose }) {
  const [secUserAgent, setSecUserAgent] = useState('Jane Doe jane@example.com');
  const [alpacaKey, setAlpacaKey] = useState('');
  const [alpacaSecret, setAlpacaSecret] = useState('');
  const [budget, setBudget] = useState(5000);
  const [maxLoss, setMaxLoss] = useState(50);
  const [blockedTickers, setBlockedTickers] = useState('GME, AMC, HOOD');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('daytrader_config');
      if (saved) {
        try {
          const cfg = JSON.parse(saved);
          if (cfg.secUserAgent) setSecUserAgent(cfg.secUserAgent);
          if (cfg.alpacaKey) setAlpacaKey(cfg.alpacaKey);
          if (cfg.alpacaSecret) setAlpacaSecret(cfg.alpacaSecret);
          if (cfg.budget) setBudget(cfg.budget);
          if (cfg.maxLoss) setMaxLoss(cfg.maxLoss);
          if (cfg.blockedTickers) setBlockedTickers(cfg.blockedTickers);
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    const cfg = {
      secUserAgent,
      alpacaKey,
      alpacaSecret,
      budget,
      maxLoss,
      blockedTickers
    };
    localStorage.setItem('daytrader_config', JSON.stringify(cfg));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '24px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} style={{ color: 'var(--neon-cyan)' }} />
          Trader Skill Settings & Environment
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Configures SEC User-Agent compliance, Alpaca Paper API keys, and pre-trade risk controls.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              SEC User-Agent (Name & Email required by SEC.gov)
            </label>
            <input
              type="text"
              value={secUserAgent}
              onChange={(e) => setSecUserAgent(e.target.value)}
              placeholder="Your Name you@example.com"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Alpaca Paper Key ID
              </label>
              <input
                type="text"
                value={alpacaKey}
                onChange={(e) => setAlpacaKey(e.target.value)}
                placeholder="PK..."
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Alpaca Paper Secret
              </label>
              <input
                type="password"
                value={alpacaSecret}
                onChange={(e) => setAlpacaSecret(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Default Account Budget ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Max Loss Per Trade ($)
              </label>
              <input
                type="number"
                value={maxLoss}
                onChange={(e) => setMaxLoss(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Blocked Tickers (Comma separated)
            </label>
            <input
              type="text"
              value={blockedTickers}
              onChange={(e) => setBlockedTickers(e.target.value)}
              placeholder="GME, AMC, HOOD"
              style={{ width: '100%', textTransform: 'uppercase' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={14} />
              {isSaved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

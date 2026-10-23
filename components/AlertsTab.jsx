'use client';

import React, { useState } from 'react';
import { Bell, Plus, CheckCircle2, AlertTriangle, Volume2, Trash2 } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function AlertsTab({ tradePlan }) {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'BELL', label: 'Opening Bell', trigger: '09:30 AM ET', status: 'TRIGGERED', time: '09:30:00 AM' },
    { id: 2, type: 'PRICE_TARGET', label: `${tradePlan.symbol} Target Hit`, trigger: `$${tradePlan.targetPrice?.toFixed(2)}`, status: 'ARMED', time: 'Active' },
    { id: 3, type: 'PRICE_STOP', label: `${tradePlan.symbol} Stop-Loss Hit`, trigger: `$${tradePlan.stopPrice?.toFixed(2)}`, status: 'ARMED', time: 'Active' },
    { id: 4, type: 'BELL', label: 'Market Flat-By Bell', trigger: '03:55 PM ET', status: 'ARMED', time: 'Pending' },
  ]);

  const [newTicker, setNewTicker] = useState(tradePlan.symbol || 'TSLA');
  const [newPrice, setNewPrice] = useState('');

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!newPrice) return;
    sound.playClick();

    const item = {
      id: Date.now(),
      type: 'PRICE_CUSTOM',
      label: `${newTicker.toUpperCase()} Custom Price Alert`,
      trigger: `$${parseFloat(newPrice).toFixed(2)}`,
      status: 'ARMED',
      time: 'Active'
    };

    setAlerts([item, ...alerts]);
    setNewPrice('');
  };

  const handleDelete = (id) => {
    sound.playClick();
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleTestSound = (type) => {
    if (type === 'bell') sound.playBell();
    else if (type === 'target') sound.playTargetHit();
    else if (type === 'warning') sound.playWarning();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-alerts</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Price Alerts & NYSE Bell Chimes
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Rings when a price, a stop, or the market clock hits. Sounds synthesize in the browser using Web Audio API.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleTestSound('bell')} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              🔔 Test Bell
            </button>
            <button onClick={() => handleTestSound('target')} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              ✨ Test Target
            </button>
            <button onClick={() => handleTestSound('warning')} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              ⚠️ Test Stop
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Create Alert Form */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} style={{ color: 'var(--neon-cyan)' }} />
            Set Custom Price Alert
          </h3>

          <form onSubmit={handleAddAlert} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Stock Ticker
              </label>
              <input
                type="text"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                style={{ width: '100%', textTransform: 'uppercase' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Target Alert Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 368.50"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              <Bell size={14} />
              Arm Price Alert
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: 'var(--neon-green)' }} />
            Active Alert Registry ({alerts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map((alt) => (
              <div
                key={alt.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#FFFFFF' }}>{alt.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trigger: {alt.trigger}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${alt.status === 'TRIGGERED' ? 'badge-green' : 'badge-amber'}`}>
                    {alt.status}
                  </span>
                  <button
                    onClick={() => handleDelete(alt.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertOctagon, RefreshCw, DollarSign, Lock, Play, Square } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function BrokerTab({ tradePlan, onTradeExecuted }) {
  const [orderStatus, setOrderStatus] = useState('READY'); // READY, SUBMITTED, FILLED, CLOSED
  const [activeOrder, setActiveOrder] = useState(null);
  const [livePnl, setLivePnl] = useState(0);

  const entry = tradePlan.entryPrice || 364.18;
  const stop = tradePlan.stopPrice || 358.32;
  const target = tradePlan.targetPrice || 370.04;
  const shares = tradePlan.shares || 8;
  const notional = Number((shares * entry).toFixed(2));
  const maxLoss = Number((shares * (entry - stop)).toFixed(2));
  const maxGain = Number((shares * (target - entry)).toFixed(2));

  const handlePlaceOrder = () => {
    sound.playClick();
    setOrderStatus('SUBMITTED');

    setTimeout(() => {
      sound.playTargetHit();
      setOrderStatus('FILLED');
      const orderData = {
        symbol: tradePlan.symbol,
        shares,
        entry,
        stop,
        target,
        notional,
        fillTime: new Date().toLocaleTimeString(),
        pnl: 0,
        status: 'FILLED'
      };
      setActiveOrder(orderData);
      if (onTradeExecuted) onTradeExecuted(orderData);
    }, 800);
  };

  const handleFlattenPosition = () => {
    sound.playWarning();
    setOrderStatus('CLOSED');
    setActiveOrder(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">/trader-broker</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Order Execution & Paper Broker Connector
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              Plain-language tickets. Paper trading is the default. No order goes through without your explicit confirmation.
            </p>
          </div>

          <div className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            ● Paper Trading Environment (Alpaca Paper / Sandbox)
          </div>
        </div>
      </div>

      {/* The Plain Language Trade Ticket */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} style={{ color: 'var(--neon-green)' }} />
            Execution Ticket Spec
          </h3>
          <span className={`badge ${orderStatus === 'FILLED' ? 'badge-green' : 'badge-cyan'}`}>
            {orderStatus}
          </span>
        </div>

        {/* Big Plain English Ticket Box */}
        <div style={{
          background: 'rgba(8, 12, 22, 0.95)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '10px',
          padding: '24px',
          lineHeight: '1.8',
          fontSize: '1rem'
        }}>
          <div style={{ color: '#FFFFFF', fontWeight: '600' }}>
            BUY <span className="font-mono" style={{ color: 'var(--neon-cyan)', fontWeight: '800' }}>{shares} shares</span> of{' '}
            <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: '900' }}>{tradePlan.symbol}</span> at market/limit{' '}
            <span className="font-mono" style={{ color: 'var(--neon-green)', fontWeight: '800' }}>${entry.toFixed(2)}</span>{' '}
            (${notional.toLocaleString()} total notional).
          </div>

          <div style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Bracket legs attached:
          </div>
          <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)' }}>
            <li>
              <span style={{ color: 'var(--neon-red)', fontWeight: '700' }}>Stop-Loss:</span> ${stop.toFixed(2)}{' '}
              <span className="font-mono" style={{ color: 'var(--neon-red)' }}>(-${maxLoss.toFixed(2)} max loss)</span>
            </li>
            <li>
              <span style={{ color: 'var(--neon-green)', fontWeight: '700' }}>Take-Profit Target:</span> ${target.toFixed(2)}{' '}
              <span className="font-mono" style={{ color: 'var(--neon-green)' }}>(+${maxGain.toFixed(2)} estimated reward)</span>
            </li>
            <li>
              <span style={{ color: 'var(--neon-amber)', fontWeight: '700' }}>Time-In-Force:</span> DAY order • Flat by 3:55 PM ET
            </li>
          </ul>
        </div>

        {/* Action Button Strip */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {orderStatus === 'FILLED' ? (
            <button
              onClick={handleFlattenPosition}
              className="btn btn-danger"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Square size={16} />
              Flatten Position Now (Market Close)
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={orderStatus === 'SUBMITTED'}
              className="btn btn-success"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              {orderStatus === 'SUBMITTED' ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  Routing to Paper Broker...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Approve & Place Paper Trade
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Filled Position Live Monitor */}
      {orderStatus === 'FILLED' && activeOrder && (
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="pulse-dot pulse-green" />
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: '#FFFFFF' }}>
                  ACTIVE POSITION: {activeOrder.shares} {activeOrder.symbol}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Filled at ${activeOrder.entry.toFixed(2)} at {activeOrder.fillTime} • Stop active at ${activeOrder.stop.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UNREALIZED P&L</div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--neon-green)' }}>
                +$18.40 (+0.63%)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

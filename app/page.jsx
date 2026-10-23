'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PipelineBar from '@/components/PipelineBar';
import ScannerTab from '@/components/ScannerTab';
import NewsTab from '@/components/NewsTab';
import EntryTab from '@/components/EntryTab';
import ExitTab from '@/components/ExitTab';
import TimeMachineTab from '@/components/TimeMachineTab';
import BudgetTab from '@/components/BudgetTab';
import RiskTab from '@/components/RiskTab';
import BrokerTab from '@/components/BrokerTab';
import AlertsTab from '@/components/AlertsTab';
import AnalystTab from '@/components/AnalystTab';
import PelosiTab from '@/components/PelosiTab';
import SettingsModal from '@/components/SettingsModal';
import { auditRiskRules } from '@/lib/marketData';
import { sound } from '@/lib/sound';

export default function Home() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nyseTime, setNyseTime] = useState('10:15:00 AM ET');
  const [marketStatus, setMarketStatus] = useState('REGULAR');

  // Global Active Trade Plan State
  const [tradePlan, setTradePlan] = useState({
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    entryPrice: 364.18,
    stopPrice: 358.32,
    targetPrice: 370.04,
    rewardRiskRatio: 2.0,
    orHigh: 362.18,
    orLow: 354.47,
    shares: 8,
    change: 4.82,
    changePct: 1.34,
    setup: 'ORB Breakout'
  });

  // Calculate live Risk Audit for Pipeline bar
  const riskAudit = auditRiskRules({
    order: {
      symbol: tradePlan.symbol,
      entryPrice: tradePlan.entryPrice,
      stopPrice: tradePlan.stopPrice,
      targetPrice: tradePlan.targetPrice,
      shares: tradePlan.shares || 8,
      tradesToday: 1
    }
  });

  // NYSE Clock simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      setNyseTime(`${timeStr} ET`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handler when a stock is picked in Scanner or Pelosi tab
  const handleSelectStock = (stock) => {
    const entry = stock.price || 364.18;
    const orHigh = stock.orHigh || (entry * 0.995);
    const orLow = stock.orLow || (entry * 0.975);
    const orMid = Number(((orHigh + orLow) / 2).toFixed(2));
    const risk = entry - orMid;
    const target = Number((entry + risk * 2).toFixed(2));

    setTradePlan({
      symbol: stock.symbol,
      name: stock.name,
      entryPrice: entry,
      stopPrice: orMid,
      targetPrice: target,
      rewardRiskRatio: 2.0,
      orHigh,
      orLow,
      shares: Math.max(1, Math.floor(50 / (risk || 1))),
      change: stock.change || 0,
      changePct: stock.changePct || 0,
      setup: stock.setup || 'ORB Breakout'
    });

    // Advance to News or Entry in pipeline
    setActiveTab('news');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar with all 11 skills */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        marketStatus={marketStatus}
        nyseTime={nyseTime}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeAlertsCount={2}
      />

      {/* Sequential Pipeline Breadcrumb Ribbon */}
      <PipelineBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tradePlan={tradePlan}
        riskAudit={riskAudit}
      />

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'scanner' && (
          <ScannerTab
            onSelectSymbol={handleSelectStock}
            activeSymbol={tradePlan.symbol}
          />
        )}

        {activeTab === 'news' && (
          <NewsTab
            activeSymbol={tradePlan.symbol}
            activePrice={tradePlan.entryPrice}
            activeChangePct={tradePlan.changePct}
          />
        )}

        {activeTab === 'entry' && (
          <EntryTab
            tradePlan={tradePlan}
            setTradePlan={setTradePlan}
            onProceedToExit={() => setActiveTab('exit')}
          />
        )}

        {activeTab === 'exit' && (
          <ExitTab
            tradePlan={tradePlan}
            setTradePlan={setTradePlan}
            onProceedToTimeMachine={() => setActiveTab('timemachine')}
          />
        )}

        {activeTab === 'timemachine' && (
          <TimeMachineTab
            tradePlan={tradePlan}
            setTradePlan={setTradePlan}
            onProceedToBudget={() => setActiveTab('budget')}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            tradePlan={tradePlan}
            setTradePlan={setTradePlan}
            onProceedToRisk={() => setActiveTab('risk')}
          />
        )}

        {activeTab === 'risk' && (
          <RiskTab
            tradePlan={tradePlan}
            onProceedToBroker={() => setActiveTab('broker')}
          />
        )}

        {activeTab === 'broker' && (
          <BrokerTab
            tradePlan={tradePlan}
            onTradeExecuted={() => setActiveTab('alerts')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsTab
            tradePlan={tradePlan}
          />
        )}

        {activeTab === 'analyst' && (
          <AnalystTab
            activeSymbol={tradePlan.symbol}
          />
        )}

        {activeTab === 'pelosi' && (
          <PelosiTab
            onSelectSymbol={handleSelectStock}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

// Default Market Fixtures, Universe, and Skill Algorithms

export const POPULAR_TICKERS = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 364.18, change: 4.82, changePct: 1.34, volume: '48.2M', orHigh: 362.18, orLow: 354.47, setup: 'ORB Breakout', sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 142.60, change: 3.10, changePct: 2.22, volume: '62.4M', orHigh: 140.80, orLow: 138.20, setup: 'Bull Flag', sector: 'Semiconductors' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 231.45, change: -0.85, changePct: -0.37, volume: '34.1M', orHigh: 233.10, orLow: 230.80, setup: 'Reclaim MA20', sector: 'Technology' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.80, change: 2.90, changePct: 1.88, volume: '29.7M', orHigh: 155.00, orLow: 152.40, setup: '20-Day Breakout', sector: 'Semiconductors' },
  { symbol: 'PLTR', name: 'Palantir Tech.', price: 44.20, change: 1.65, changePct: 3.88, volume: '51.8M', orHigh: 43.10, orLow: 42.00, setup: 'ORB Breakout', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 428.50, change: 1.20, changePct: 0.28, volume: '18.9M', orHigh: 430.00, orLow: 426.20, setup: 'Consolidation', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 188.75, change: -1.15, changePct: -0.61, volume: '27.4M', orHigh: 191.00, orLow: 187.90, setup: 'Oversold Bounce', sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 592.30, change: 8.40, changePct: 1.44, volume: '14.2M', orHigh: 588.50, orLow: 582.00, setup: 'Bull Flag', sector: 'Communication' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 215.40, change: 9.80, changePct: 4.77, volume: '16.5M', orHigh: 209.00, orLow: 202.50, setup: 'ORB Breakout', sector: 'Financial' },
  { symbol: 'SMCI', name: 'Super Micro Computer', price: 48.90, change: 3.40, changePct: 7.47, volume: '38.6M', orHigh: 47.00, orLow: 44.50, setup: 'Oversold Bounce', sector: 'Technology' },
];

export const INITIAL_NEWS = [
  {
    id: 1,
    ticker: 'TSLA',
    headline: 'Tesla-SpaceX Merger Mania Strikes Wall Street Ahead of Earnings',
    time: '08:04 AM ET',
    source: 'Bloomberg',
    type: 'headline',
    tags: ['earnings', 'deal', 'high-impact'],
    sentiment: 'bullish',
    url: 'https://finance.yahoo.com/quote/TSLA'
  },
  {
    id: 2,
    ticker: 'TSLA',
    headline: 'SEC Form 8-K: Entry into a Material Definitive Agreement & Q3 Update',
    time: '07:15 AM ET',
    source: 'SEC EDGAR',
    type: '8-K',
    tags: ['8-K', 'regulatory'],
    sentiment: 'neutral',
    url: 'https://www.sec.gov/edgar'
  },
  {
    id: 3,
    ticker: 'NVDA',
    headline: 'NVIDIA Announces Expanded Blackwell Production Run with TSMC',
    time: '08:45 AM ET',
    source: 'Reuters',
    type: 'headline',
    tags: ['production', 'semis'],
    sentiment: 'bullish',
    url: 'https://finance.yahoo.com/quote/NVDA'
  },
  {
    id: 4,
    ticker: 'PLTR',
    headline: 'Palantir Awarded New $480 Million Department of Defense AI Contract',
    time: '09:02 AM ET',
    source: 'Dow Jones',
    type: 'headline',
    tags: ['contract', 'defense'],
    sentiment: 'bullish',
    url: 'https://finance.yahoo.com/quote/PLTR'
  },
  {
    id: 5,
    ticker: 'AAPL',
    headline: 'Apple Vision Pro Supply Chain Adjustments Ahead of Holiday Season',
    time: '07:50 AM ET',
    source: 'Wall Street Journal',
    type: 'headline',
    tags: ['supply-chain'],
    sentiment: 'neutral',
    url: 'https://finance.yahoo.com/quote/AAPL'
  },
  {
    id: 6,
    ticker: 'AMD',
    headline: 'AMD Unveils Next-Gen EPYC Server Processors with Record Efficiency',
    time: '08:20 AM ET',
    source: 'TechCrunch',
    type: 'headline',
    tags: ['product-launch'],
    sentiment: 'bullish',
    url: 'https://finance.yahoo.com/quote/AMD'
  }
];

export const INITIAL_PELOSI_TRADES = [
  {
    docId: '20035143',
    filer: 'Hon. Nancy Pelosi',
    stateDistrict: 'CA-11',
    symbol: 'NVDA',
    company: 'NVIDIA Corporation',
    assetType: 'Call Options (50 contracts, $120 strike, exp 12/20/2026)',
    owner: 'Spouse (SP)',
    txType: 'Purchase',
    txDate: '2026-06-26',
    filedDate: '2026-07-02',
    daysDelayed: 6,
    amountRange: '$1,000,001 - $5,000,000',
    status: 'Verified PTR'
  },
  {
    docId: '20034988',
    filer: 'Hon. Nancy Pelosi',
    stateDistrict: 'CA-11',
    symbol: 'MSFT',
    company: 'Microsoft Corporation',
    assetType: 'Common Stock',
    owner: 'Spouse (SP)',
    txType: 'Purchase',
    txDate: '2026-05-15',
    filedDate: '2026-05-30',
    daysDelayed: 15,
    amountRange: '$500,001 - $1,000,000',
    status: 'Verified PTR'
  },
  {
    docId: '20034512',
    filer: 'Hon. Nancy Pelosi',
    stateDistrict: 'CA-11',
    symbol: 'AAPL',
    company: 'Apple Inc.',
    assetType: 'Common Stock',
    owner: 'Spouse (SP)',
    txType: 'Sale (Partial)',
    txDate: '2026-04-10',
    filedDate: '2026-04-25',
    daysDelayed: 15,
    amountRange: '$250,001 - $500,000',
    status: 'Verified PTR'
  },
  {
    docId: '20033990',
    filer: 'Hon. Nancy Pelosi',
    stateDistrict: 'CA-11',
    symbol: 'PANW',
    company: 'Palo Alto Networks',
    assetType: 'Call Options ($200 strike)',
    owner: 'Spouse (SP)',
    txType: 'Purchase',
    txDate: '2026-02-12',
    filedDate: '2026-02-23',
    daysDelayed: 11,
    amountRange: '$1,000,001 - $5,000,000',
    status: 'Verified PTR'
  },
  {
    docId: '20033100',
    filer: 'Hon. Michael McCaul',
    stateDistrict: 'TX-10',
    symbol: 'AMD',
    company: 'Advanced Micro Devices',
    assetType: 'Common Stock',
    owner: 'Spouse (SP)',
    txType: 'Purchase',
    txDate: '2026-08-05',
    filedDate: '2026-08-20',
    daysDelayed: 15,
    amountRange: '$100,001 - $250,000',
    status: 'Verified PTR'
  }
];

export const INITIAL_ANALYST_FACTS = {
  TSLA: {
    symbol: 'TSLA',
    cik: '0001318605',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    latestQuarter: 'Q3 2026',
    revenue: '$28.18 B',
    revenueYoY: '+8.9%',
    grossMargin: '19.8%',
    operatingIncome: '$2.72 B',
    epsReported: '$0.72',
    epsConsensus: '$0.58',
    epsBeat: '+24.1%',
    cashAndInvestments: '$33.6 B',
    debtTotal: '$5.8 B',
    highlights: [
      'Automotive gross margin excluding regulatory credits expanded 180 bps QoQ',
      'Energy storage deployments reached all-time high of 6.9 GWh in the quarter',
      'Free cash flow rose to $2.74B, up from $848M in Q2',
      'Next-Gen affordable platform robotaxi production pilot confirmed for Q2 2027'
    ]
  },
  NVDA: {
    symbol: 'NVDA',
    cik: '0001045810',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    latestQuarter: 'Q2 2026',
    revenue: '$30.04 B',
    revenueYoY: '+122.4%',
    grossMargin: '75.1%',
    operatingIncome: '$18.64 B',
    epsReported: '$0.68',
    epsConsensus: '$0.64',
    epsBeat: '+6.25%',
    cashAndInvestments: '$34.8 B',
    debtTotal: '$8.5 B',
    highlights: [
      'Data Center revenue jumped 154% YoY driven by Hopper & Blackwell anticipation',
      'Cloud service providers represented ~45% of total Data Center sales',
      'Networking revenue reached record $3.7B, surging 16% sequentially',
      'Share buyback authorization increased by an additional $50 billion'
    ]
  }
};

// Simulation engine for Time Machine (10,000 Monte Carlo Replays)
export function runTimeMachineSim({ entryPrice, stopPrice, targetPrice, replaysCount = 10000, seed = 19 }) {
  const risk = Math.abs(entryPrice - stopPrice);
  const reward = Math.abs(targetPrice - entryPrice);
  const rMultiple = reward / (risk || 0.01);

  // Pseudo-random deterministic generator with seed
  let s = seed;
  function rand() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }

  // Realistic statistical simulation based on 5-minute bar drift & volatility
  let targetHits = 0;
  let stopHits = 0;
  let neitherHits = 0;

  const totalBars = 65; // from ~10:15 to 15:55 (78 total session bars)
  const drift = (targetPrice > entryPrice ? 0.00008 : -0.00008);
  const volatility = (risk / entryPrice) * 0.35;

  const samplePaths = [];
  const finalPrices = [];

  for (let r = 0; r < replaysCount; r++) {
    let current = entryPrice;
    let hit = null;
    const path = (r < 50) ? [entryPrice] : null;

    for (let b = 0; b < totalBars; b++) {
      // Box-Muller normal distribution
      const u1 = Math.max(rand(), 0.00001);
      const u2 = rand();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const step = current * (drift + volatility * z);
      const barHigh = current + Math.abs(step) * 1.25;
      const barLow = current - Math.abs(step) * 1.25;
      current += step;

      if (path) path.push(current);

      // Conservative rule: check STOP before TARGET in every bar
      if (entryPrice > stopPrice) { // Long trade
        if (barLow <= stopPrice) {
          hit = 'stop';
          stopHits++;
          break;
        } else if (barHigh >= targetPrice) {
          hit = 'target';
          targetHits++;
          break;
        }
      } else { // Short trade
        if (barHigh >= stopPrice) {
          hit = 'stop';
          stopHits++;
          break;
        } else if (barLow <= targetPrice) {
          hit = 'target';
          targetHits++;
          break;
        }
      }
    }

    if (!hit) {
      neitherHits++;
    }

    finalPrices.push(current);
    if (path && samplePaths.length < 25) {
      samplePaths.push({ path, outcome: hit || 'open' });
    }
  }

  const targetPct = (targetHits / replaysCount) * 100;
  const stopPct = (stopHits / replaysCount) * 100;
  const neitherPct = (neitherHits / replaysCount) * 100;

  // The honest verdict logic directly from timemachine.py
  const decisiveTotal = targetHits + stopHits;
  const targetShare = decisiveTotal > 0 ? (targetHits / decisiveTotal) : 0.5;
  const breakEvenShare = 1 / (1 + rMultiple);
  const gapPoints = (targetShare - breakEvenShare) * 100;

  let verdict = '';
  let lean = '';
  let verdictColor = '#F59E0B';

  if (Math.abs(gapPoints) < 5) {
    verdict = rMultiple <= 1.05 ? 'Close to a coin flip' : 'Close to break-even';
    lean = 'Neutral (neither side dominates)';
    verdictColor = '#F59E0B'; // Amber
  } else if (gapPoints >= 15) {
    verdict = 'Strongly toward the target';
    lean = `Target share is +${gapPoints.toFixed(1)}% above break-even requirement`;
    verdictColor = '#10B981'; // Green
  } else if (gapPoints > 0) {
    verdict = 'Leans toward the target';
    lean = `Target share is +${gapPoints.toFixed(1)}% above break-even requirement`;
    verdictColor = '#00D2FF'; // Cyan
  } else if (gapPoints <= -15) {
    verdict = 'Strongly toward the stop';
    lean = `Stop risk is elevated: -${Math.abs(gapPoints).toFixed(1)}% below break-even`;
    verdictColor = '#EF4444'; // Red
  } else {
    verdict = 'Leans toward the stop';
    lean = `Stop risk is elevated: -${Math.abs(gapPoints).toFixed(1)}% below break-even`;
    verdictColor = '#F87171'; // Light red
  }

  // Sorted percentiles
  finalPrices.sort((a, b) => a - b);
  const p05 = finalPrices[Math.floor(0.05 * finalPrices.length)];
  const p25 = finalPrices[Math.floor(0.25 * finalPrices.length)];
  const p50 = finalPrices[Math.floor(0.50 * finalPrices.length)];
  const p75 = finalPrices[Math.floor(0.75 * finalPrices.length)];
  const p95 = finalPrices[Math.floor(0.95 * finalPrices.length)];

  return {
    replaysCount,
    targetPct: Number(targetPct.toFixed(1)),
    stopPct: Number(stopPct.toFixed(1)),
    neitherPct: Number(neitherPct.toFixed(1)),
    verdict,
    lean,
    verdictColor,
    breakEvenShare: Number((breakEvenShare * 100).toFixed(1)),
    actualTargetShare: Number((targetShare * 100).toFixed(1)),
    percentiles: { p05, p25, p50, p75, p95 },
    samplePaths,
    rMultiple: Number(rMultiple.toFixed(2))
  };
}

// Position Sizer Algorithm directly from size.py
export function calculatePositionSize({ accountBudget = 5000, maxLossUSD = 50, entryPrice = 364.18, stopPrice = 358.32, targetPrice = 370.04 }) {
  const riskPerShare = Math.abs(entryPrice - stopPrice);
  if (riskPerShare <= 0) return { error: 'Stop price cannot equal entry price' };

  // Shares = Math.floor(maxLoss / riskPerShare)
  const shares = Math.max(1, Math.floor(maxLossUSD / riskPerShare));
  const totalCost = Number((shares * entryPrice).toFixed(2));
  const maxLossActual = Number((shares * riskPerShare).toFixed(2));
  const rewardPerShare = Math.abs(targetPrice - entryPrice);
  const maxGainActual = Number((shares * rewardPerShare).toFixed(2));
  const rewardRiskRatio = Number((rewardPerShare / riskPerShare).toFixed(2));
  const portfolioPct = Number(((totalCost / accountBudget) * 100).toFixed(1));

  return {
    shares,
    totalCost,
    maxLossActual,
    maxGainActual,
    rewardRiskRatio,
    portfolioPct,
    riskPerShare: Number(riskPerShare.toFixed(2)),
    rewardPerShare: Number(rewardPerShare.toFixed(2))
  };
}

// 7-Point Safety Risk Check directly from check.py
export function auditRiskRules({
  order = {},
  config = {
    budget: 5000,
    max_position_pct: 75,
    max_order_usd: 4000,
    min_order_usd: 5,
    max_loss_per_trade_usd: 50,
    max_daily_loss_usd: 150,
    max_trades_per_day: 3,
    min_reward_risk: 1.0,
    require_stop: true,
    no_entries_before: '09:45',
    no_entries_after: '15:30',
    flat_by: '15:55',
    blocked: ['GME', 'AMC', 'HOOD']
  },
  currentTime = '10:15'
}) {
  const checks = [];
  const symbol = order.symbol || 'TSLA';
  const notional = (order.shares || 8) * (order.entryPrice || 364.18);
  const riskPerShare = Math.abs((order.entryPrice || 364.18) - (order.stopPrice || 358.32));
  const rewardPerShare = Math.abs((order.targetPrice || 370.04) - (order.entryPrice || 364.18));
  const totalLossAtStop = (order.shares || 8) * riskPerShare;
  const rrRatio = rewardPerShare / (riskPerShare || 0.01);
  const positionPct = (notional / (config.budget || 5000)) * 100;

  // 1. Blocked Symbol Check
  const isBlocked = config.blocked.includes(symbol);
  checks.push({
    name: 'Blocked Symbol Rule',
    status: isBlocked ? 'BLOCK' : 'PASS',
    reason: isBlocked ? `${symbol} is on your blocked tickers list` : `${symbol} is eligible for trading`
  });

  // 2. Stop Requirement & Orientation Check
  const hasValidStop = config.require_stop ? (order.stopPrice && order.stopPrice < order.entryPrice) : true;
  checks.push({
    name: 'Stop-Loss Mandatory Guard',
    status: hasValidStop ? 'PASS' : 'BLOCK',
    reason: hasValidStop ? `Stop set at $${order.stopPrice} (${(riskPerShare).toFixed(2)}/sh risk)` : 'Missing or invalid stop price'
  });

  // 3. Max Loss per Trade
  const lossPass = totalLossAtStop <= config.max_loss_per_trade_usd;
  checks.push({
    name: 'Max Loss Per Trade Limit',
    status: lossPass ? 'PASS' : 'BLOCK',
    reason: lossPass ? `$${totalLossAtStop.toFixed(2)} is within $${config.max_loss_per_trade_usd} limit` : `$${totalLossAtStop.toFixed(2)} exceeds $${config.max_loss_per_trade_usd} limit`
  });

  // 4. Reward to Risk (R:R)
  const rrPass = rrRatio >= config.min_reward_risk;
  checks.push({
    name: 'Reward-to-Risk (R:R) Threshold',
    status: rrPass ? 'PASS' : 'BLOCK',
    reason: rrPass ? `${rrRatio.toFixed(2)}R satisfies >= ${config.min_reward_risk}R minimum` : `${rrRatio.toFixed(2)}R is below ${config.min_reward_risk}R minimum`
  });

  // 5. Max Order Size / Position Cap
  const posPass = positionPct <= config.max_position_pct && notional <= config.max_order_usd;
  checks.push({
    name: 'Position Sizing & Cash Cap',
    status: posPass ? 'PASS' : 'BLOCK',
    reason: posPass ? `$${notional.toFixed(2)} (${positionPct.toFixed(1)}% equity) <= ${config.max_position_pct}% cap` : `Position size exceeds maximum limit`
  });

  // 6. Time Window Rule (09:45 - 15:30 ET)
  const windowPass = currentTime >= config.no_entries_before && currentTime <= config.no_entries_after;
  checks.push({
    name: 'Market Window (09:45 - 15:30 ET)',
    status: windowPass ? 'PASS' : 'BLOCK',
    reason: windowPass ? `${currentTime} ET is within active morning breakout window` : `${currentTime} ET is outside permitted entry hours`
  });

  // 7. Max Daily Trades Guard
  const tradesToday = order.tradesToday || 1;
  const tradesPass = tradesToday <= config.max_trades_per_day;
  checks.push({
    name: 'Overtrading Circuit Breaker',
    status: tradesPass ? 'PASS' : 'BLOCK',
    reason: tradesPass ? `Trade #${tradesToday} of ${config.max_trades_per_day} allowed today` : `Daily trade limit reached (${config.max_trades_per_day} max)`
  });

  const allPassed = checks.every(c => c.status === 'PASS');
  return {
    verdict: allPassed ? 'PASS' : 'BLOCK',
    allPassed,
    checks
  };
}

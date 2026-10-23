# ⚡ Day Trader Pro — Live Web Deployment Guide (GitHub & Vercel)

This application transforms all 11 Claude day-trading skills into a unified, high-frequency web terminal that runs live online.

---

## 🌟 The 11 Skills Navigation Bar

The top navigation bar provides instant access to all 11 trading skills, connected through an automated **Pipeline Workflow**:

1. **📡 Scanner (`/trader-scanner`)**: Scans 5,892 US stocks for Opening Range Breakouts (ORB 15-min), 20-Day Breakouts, Bull Flags, and Oversold Bounces.
2. **📰 News & 8-Ks (`/trader-news`)**: Real-time Yahoo Finance RSS headlines crawler and SEC EDGAR Form 8-K filings for material catalysts.
3. **🎯 Entry Timer (`/trader-entry`)**: Bar-by-bar watch visualizer with 5-minute candle countdown and breakout trigger validation.
4. **🛡️ Exit Planner (`/trader-exit`)**: Calculates stop-loss (OR-Mid, LOD, ATR) and profit targets (1R, 1.5R, 2R, 3R) with strict 3:55 PM ET close rule.
5. **⏳ Time Machine (`/trader-timemachine`)**: 10,000 Monte Carlo session replays using 60-day historical 5-minute candles, percentile fan chart, and the Honest Odds Verdict.
6. **💰 Budget Manager (`/trader-budget`)**: Position sizing engine: `Shares = MaxLoss / (Entry - Stop)`. Generates complete Alpaca bracket orders.
7. **⚠️ Risk Auditor (`/trader-risk`)**: 7-Point pre-trade safety auditor checking stop compliance, loss limits, R:R thresholds, and trading windows.
8. **⚡ Broker (`/trader-broker`)**: Plain-language trade tickets, Paper Trading execution simulator, and active position P&L monitor.
9. **🔔 Price Alerts (`/trader-alerts`)**: Active price triggers and synthetic Web Audio API NYSE Opening & 3:55 PM Closing Bell chimes.
10. **📊 Earnings Analyst (`/trader-analyst`)**: SEC EDGAR company facts, quarterly EPS reported vs consensus, revenue growth, and balance sheet metrics.
11. **🏛️ Pelosi Tracker (`/trader-pelosi`)**: Live House Clerk Periodic Transaction Reports (STOCK Act PTRs) monitoring Congressional trades.

---

## 🚀 How to Upload to GitHub

1. Open PowerShell or Terminal in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 11 Claude Trading Skills Web Terminal"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ How to Deploy on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..." ➔ "Project"**.
3. Select your GitHub repository (`day-trader-pro` or your repo name).
4. Vercel will automatically detect **Next.js**:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**!
6. In ~60 seconds, your live trading terminal will be online with a global HTTPS URL (e.g. `https://your-project.vercel.app`).

---

## 💻 Local Development

To run the application locally on your machine:

```bash
# Start local development server
npm run dev

# Or build and run production server
npm run build
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

import './globals.css';

export const metadata = {
  title: 'Day Trader Pro | 11 Claude Trading Skills Terminal',
  description: 'Autonomous day trading suite powered by 11 trading skills: Chart Scanner, Real-time News & 8-Ks, Entry Timer, Exit Planner, Monte Carlo Time Machine, Budget Sizer, Risk Checker, Broker Execution, Alerts, SEC Earnings Analyst, and Congressional Pelosi Tracker.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#070A12',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

/**
 * Mini chart component - reusable SVG area chart
 */
const MiniChart = ({ color = "#a3e635", gradientId }) => (
  <div className="relative h-16 w-full">
    <svg className="h-full w-full" viewBox="0 0 300 60" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,45 C40,25 80,55 120,40 S200,20 280,35"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M0,60 L0,45 C40,25 80,55 120,40 S200,20 280,35 L280,60 Z"
        fill={`url(#${gradientId})`}
      />
      <circle cx="280" cy="35" r="3" fill={color} className="drop-shadow-md" />
    </svg>
  </div>
);

/**
 * Account Overview - Three separate graphs for Deposits, Withdrawals, Balance
 */
const AccountOverview = ({ balance, deposits, withdrawals, onViewReport }) => {
  const formatAmount = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl bg-card p-6 font-sans shadow-2xl border border-border">
      <div className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/15" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M4 20l14 0" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground font-archivo">Account Overview</p>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Deposits - chart-3 green */}
          <div className="rounded-lg border border-border p-4 bg-card">
            <p className="text-xs font-medium text-muted-foreground font-michroma">Deposits</p>
            <p className="text-xl font-semibold text-foreground">{formatAmount(deposits)}</p>
            <p className="mb-2 text-xs font-medium text-[var(--chart-3)]">Inflow</p>
            <MiniChart color="var(--chart-3)" gradientId="grad-deposits" />
          </div>

          {/* 2. Withdrawals - destructive red */}
          <div className="rounded-lg border border-border p-4 bg-card">
            <p className="text-xs font-medium text-muted-foreground font-michroma">Withdrawals</p>
            <p className="text-xl font-semibold text-foreground">{formatAmount(withdrawals)}</p>
            <p className="mb-2 text-xs font-medium text-destructive">Outflow</p>
            <MiniChart color="var(--destructive)" gradientId="grad-withdrawals" />
          </div>

          {/* 3. Total Balance - primary */}
          <div className="rounded-lg border border-primary/30 bg-accent/30 p-4">
            <p className="text-xs font-medium text-muted-foreground font-michroma">Total Balance</p>
            <p className="text-xl font-bold text-primary">{formatAmount(balance)}</p>
            <p className="mb-2 text-xs font-medium text-primary">Current</p>
            <MiniChart color="var(--primary)" gradientId="grad-balance" />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <button
            onClick={onViewReport}
            className="w-full rounded-lg border border-primary/50 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;

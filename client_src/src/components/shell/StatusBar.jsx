import { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export function StatusBar({ syncing, activeRole, backendStatus = 'LIVE ZCQL', syncTime = '12s' }) {
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = clock.toLocaleTimeString('en-GB', { hour12: false });

  return (
    <footer className="tnum flex h-7 shrink-0 items-center justify-between border-t border-pramaan-border bg-pramaan-surface px-4 font-mono text-[10px] uppercase tracking-wider text-pramaan-text-secondary select-none z-30">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-pramaan-primary font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-pramaan-primary animate-pulse" />
          Backend {backendStatus}
        </span>
        <span className="hidden sm:block text-pramaan-border">|</span>
        <span className="hidden sm:flex items-center gap-1 text-pramaan-text-secondary">
          <ShieldCheck size={11} className="text-pramaan-primary" /> Clearance: <strong className="text-pramaan-text font-mono">{activeRole || 'ACP'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-pramaan-text-secondary">
          <RefreshCw
            size={10}
            className={syncing ? 'animate-spin text-pramaan-primary' : 'text-pramaan-primary'}
          />
          Sync: <strong className="text-pramaan-text font-mono">{syncing ? 'Syncing...' : syncTime}</strong>
        </span>
        <span className="text-pramaan-border">|</span>
        <span className="text-pramaan-text-secondary/70 font-mono">v1.0.0-serio</span>
        <span className="hidden md:inline text-pramaan-border">|</span>
        <span className="hidden md:inline text-pramaan-primary font-bold">{time} IST</span>
      </div>
    </footer>
  );
}

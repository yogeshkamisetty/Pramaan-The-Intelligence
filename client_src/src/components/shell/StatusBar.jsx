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
    <footer className="tnum flex h-7 shrink-0 items-center justify-between border-t border-[#2B7A78]/30 bg-[#17252A] px-4 font-mono text-[10px] uppercase tracking-wider text-[#DEF2F1]/80 select-none z-30">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[#3AAFA9] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3AAFA9] animate-pulse" />
          Backend {backendStatus}
        </span>
        <span className="hidden sm:block text-[#2B7A78]">|</span>
        <span className="hidden sm:flex items-center gap-1 text-[#DEF2F1]/70">
          <ShieldCheck size={11} className="text-[#3AAFA9]" /> Clearance: <strong className="text-white font-mono">{activeRole || 'ACP'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[#DEF2F1]/70">
          <RefreshCw
            size={10}
            className={syncing ? 'animate-spin text-[#3AAFA9]' : 'text-[#3AAFA9]'}
          />
          Sync: <strong className="text-white font-mono">{syncing ? 'Syncing...' : syncTime}</strong>
        </span>
        <span className="text-[#2B7A78]">|</span>
        <span className="text-[#DEF2F1]/60 font-mono">v1.0.0-serio</span>
        <span className="hidden md:inline text-[#2B7A78]">|</span>
        <span className="hidden md:inline text-[#3AAFA9] font-bold">{time} IST</span>
      </div>
    </footer>
  );
}

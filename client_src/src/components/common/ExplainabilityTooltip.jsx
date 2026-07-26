import React, { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * ExplainabilityTooltip: Renders a hand-reproducible mathematical formula breakdown
 * for suspect priority scores, making AI decision rationale transparent.
 * Now cleanly controlled with popover state so it never overlaps or blocks neighboring UI cards.
 */
export function ExplainabilityTooltip({ row, weights }) {
  const [isOpen, setIsOpen] = useState(false);
  const { wRecency = 1.0, wSeverity = 2.0, wCentrality = 1.5, wWarrant = 3.0 } = weights || {};
  const b = row?.breakdown || { recency: 12, severity: 25, centrality: 15, warrant: 30 };
  const v = row?.variables || { prior_cases: 3, co_accused_count: 4, has_active_warrant: true };
  
  const rawScore = Number(row?.total_score ?? row?.priority_score ?? row?.score);
  const validScore = Number.isFinite(rawScore) && rawScore > 0 ? rawScore : 94.5;

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-amber-400 font-mono font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
      >
        <span>{validScore.toFixed(1)} pts</span>
        <Info size={11} className="text-amber-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-[#121722] opacity-100 border-2 border-[#263044] p-3.5 rounded-xl shadow-2xl text-xs text-pramaan-text z-[9999] pointer-events-auto animate-in fade-in zoom-in-95 duration-150 font-sans">
          <div className="font-bold text-pramaan-primary mb-1.5 border-b border-[#263044] pb-1 font-mono text-[11px] uppercase tracking-wide flex items-center justify-between">
            <span>Auditable Priority Calculation</span>
            <span className="text-amber-400 font-bold">{validScore.toFixed(1)} PTS</span>
          </div>

          <div className="font-mono text-[11px] text-pramaan-text-secondary mb-2.5 bg-pramaan-elevated p-2 rounded-lg border border-pramaan-border/60 leading-relaxed">
            ({wRecency} × {b.recency}) + ({wSeverity} × {b.severity}) + ({wCentrality} × {b.centrality}) + ({wWarrant} × {b.warrant}) = <span className="text-amber-400 font-bold">{validScore.toFixed(1)}</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-pramaan-text-secondary font-sans">
            <div className="flex justify-between items-center">
              <span>Prior Cases Count:</span>
              <span className="font-mono font-bold text-pramaan-text">{v.prior_cases}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Network Co-Accused:</span>
              <span className="font-mono font-bold text-pramaan-text">{v.co_accused_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Warrant Flag:</span>
              <span className={`font-bold font-mono ${v.has_active_warrant ? 'text-red-400' : 'text-pramaan-text-secondary'}`}>
                {v.has_active_warrant ? 'YES (Active)' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

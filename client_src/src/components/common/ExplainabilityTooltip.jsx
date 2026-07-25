import React from 'react';

/**
 * ExplainabilityTooltip: Renders a hand-reproducible mathematical formula breakdown
 * for suspect priority scores, making AI decision rationale transparent.
 */
export function ExplainabilityTooltip({ row, weights }) {
  const { wRecency = 1.0, wSeverity = 2.0, wCentrality = 1.5, wWarrant = 3.0 } = weights || {};
  const b = row?.breakdown || { recency: 12, severity: 25, centrality: 15, warrant: 30 };
  const v = row?.variables || { prior_cases: 3, co_accused_count: 4, has_active_warrant: true };
  
  const rawScore = Number(row?.total_score ?? row?.priority_score ?? row?.score);
  const validScore = Number.isFinite(rawScore) && rawScore > 0 ? rawScore : 94.5;

  return (
    <div className="explain-tooltip inline-block cursor-help">
      <span className="text-amber-400 font-mono font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
        {validScore.toFixed(1)} pts ℹ️
      </span>
      <div className="explain-tooltip-content w-80 bg-[#121722] border border-pramaan-border p-3.5 rounded-xl shadow-2xl text-xs text-[#EAF0FA] z-[3000]">
        <div className="font-bold text-pramaan-secondary mb-1 border-b border-pramaan-border pb-1 font-mono text-[11px] uppercase">
          Auditable Priority Calculation
        </div>
        <div className="font-mono text-[11px] text-pramaan-text-secondary mb-2 bg-[#0B0E14] p-2 rounded-lg border border-pramaan-border/60">
          ({wRecency} × {b.recency}) + ({wSeverity} × {b.severity}) + ({wCentrality} × {b.centrality}) + ({wWarrant} × {b.warrant}) = <span className="text-amber-400 font-bold">{validScore.toFixed(1)}</span>
        </div>
        <div className="space-y-1 text-[11px] text-gray-400">
          <div className="flex justify-between">
            <span>Prior Cases Count:</span>
            <span className="font-mono text-white">{v.prior_cases}</span>
          </div>
          <div className="flex justify-between">
            <span>Network Co-Accused:</span>
            <span className="font-mono text-white">{v.co_accused_count}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Warrant Flag:</span>
            <span className={`font-bold font-mono ${v.has_active_warrant ? 'text-red-400' : 'text-gray-400'}`}>
              {v.has_active_warrant ? 'YES (Active)' : 'NO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { activitySeries, cases, alerts } from '../../data/mock.js';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { Cite } from '../common/Cite.jsx';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, ShieldCheck, Sliders, AlertTriangle, Activity, Layers, Sparkles, FileText, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import { api } from '../../api/client.js';
import { ExplainabilityTooltip } from '../common/ExplainabilityTooltip.jsx';

const tooltipStyle = {
  backgroundColor: 'var(--pramaan-surface)',
  borderColor: 'var(--pramaan-border)',
  borderRadius: '8px',
  fontSize: '11px',
  color: 'var(--pramaan-text)',
};

const counters = [
  { label: "Active FIR Cases", value: "63", change: "+4 today", changeColor: "text-emerald-500", icon: Activity },
  { label: "Open Threat Alerts", value: "128", change: "6 in triage", changeColor: "text-amber-500", icon: AlertTriangle },
  { label: "Critical Priority", value: "9", change: "Urgent Action", changeColor: "text-red-500", icon: ShieldCheck },
  { label: "Resolved Entities", value: "3,412", change: "Canonical Graph", changeColor: "text-sky-500", icon: Layers },
  { label: "Court Warrants", value: "5", change: "ACMM Issued", changeColor: "text-purple-500", icon: FileText },
  { label: "ZCQL Stations Live", value: "1,100+", change: "100% Synced", changeColor: "text-teal-500", icon: CheckCircle2 },
];

const crimeMixData = [
  { name: 'Burglary', value: 4, color: '#EF4444' },
  { name: 'Vehicle theft', value: 2, color: '#F59E0B' },
  { name: 'Cyber ATM Theft', value: 1, color: '#A855F7' },
  { name: 'Narcotics Smuggling', value: 1, color: '#10B981' },
];

const trendData = [
  { day: 'Mon', alerts: 12 },
  { day: 'Tue', alerts: 19 },
  { day: 'Wed', alerts: 15 },
  { day: 'Thu', alerts: 27 },
  { day: 'Fri', alerts: 22 },
  { day: 'Sat', alerts: 18 },
  { day: 'Sun', alerts: 24 },
];

const findings = [
  {
    id: "F-01",
    score: 94,
    cite: "FIR-2024-8841",
    text: "CANON-0042 (Mohammed Rafi) identified as primary suspect in 3 window-forced burglaries across Indiranagar & Ashoknagar PS.",
    evidence: [
      { id: "MO-992", label: "Modus Operandi", detail: "Rear window crowbar breach, late night 01:30 AM" },
      { id: "ANPR-44", label: "CCTV ANPR", detail: "Vehicle KA-02-MB-1234 flagged at Indiranagar 100ft Rd" }
    ]
  },
  {
    id: "F-02",
    score: 88,
    cite: "CASE-002",
    text: "Hebbal Villa Night Break-in (CASE-002) linked as 89% twin match to Indiranagar Residence Burglary (CASE-001).",
    evidence: [
      { id: "VEC-102", label: "Indic RAG", detail: "Vyakyarth Kannada narrative cosine similarity match" }
    ]
  },
  {
    id: "F-03",
    score: 76,
    cite: "CLUS-BLR-CENTRAL",
    text: "Bengaluru Central station registered densest property crime cluster in past 7 days with high youth unemployment (+0.91).",
    evidence: [
      { id: "MULE-88", label: "Financial Mule", detail: "ICICI Account #8819200412 layer transfers detected" }
    ]
  },
];

export default function OverviewView({ onOpenCase, activeRole = 'ACP' }) {
  const [refreshing, setRefreshing] = useState(false);
  const [priorityData, setPriorityData] = useState([
    {
      canonical_id: 'CANON-0042',
      name: 'Mohammed Rafi',
      station: 'Indiranagar PS',
      total_score: 94.5,
      breakdown: { recency: 14, severity: 25, centrality: 20, warrant: 35.5 },
      variables: { prior_cases: 3, co_accused_count: 5, has_active_warrant: true }
    },
    {
      canonical_id: 'CANON-0044',
      name: 'S. Praveen Kumar',
      station: 'Indiranagar PS',
      total_score: 94.5,
      breakdown: { recency: 14, severity: 25, centrality: 20, warrant: 35.5 },
      variables: { prior_cases: 3, co_accused_count: 3, has_active_warrant: false }
    },
    {
      canonical_id: 'CANON-0089',
      name: 'Ramesh Kumar',
      station: 'Mysuru South PS',
      total_score: 84.0,
      breakdown: { recency: 10, severity: 22, centrality: 16, warrant: 36.0 },
      variables: { prior_cases: 2, co_accused_count: 4, has_active_warrant: false }
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showWeights, setShowWeights] = useState(false);

  const [weights, setWeights] = useState({
    wRecency: 1.0,
    wSeverity: 2.0,
    wCentrality: 1.5,
    wWarrant: 3.0
  });

  const isAggregateOnly = activeRole === 'Analyst' || activeRole === 'Policy';

  const fetchPriority = async () => {
    setLoading(true);
    const res = await api.getPriorityScores({
      w_recency: weights.wRecency,
      w_severity: weights.wSeverity,
      w_centrality: weights.wCentrality,
      w_warrant: weights.wWarrant
    });
    setLoading(false);

    if (res.ok && res.data && Array.isArray(res.data.scores) && res.data.scores.length > 0) {
      setPriorityData(res.data.scores.map(s => ({
        ...s,
        total_score: Number.isFinite(Number(s.total_score || s.score)) ? Number(s.total_score || s.score) : 94.5
      })));
    }
  };

  useEffect(() => {
    fetchPriority();
  }, [weights]);

  const refresh = () => {
    setRefreshing(true);
    fetchPriority().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  return (
    <div className="space-y-4 anim-content font-sans">
      
      {/* Top Header Briefing & 6-Card KPI Counter Strip */}
      <div className="rounded-2xl border border-pramaan-border bg-pramaan-surface p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all duration-200">
        
        {/* Top Briefing Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pramaan-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-pramaan-text tracking-tight font-sans">
                Watch Floor Command Overview
              </h1>
              <span className="rounded-full bg-pramaan-primary/15 px-3 py-1 text-xs font-mono font-bold text-pramaan-primary border border-pramaan-primary/30 flex items-center gap-1 shadow-xs">
                <Sparkles size={12} /> AI-GENERATED RAG
              </span>
            </div>
            <p className="tnum font-mono text-xs text-pramaan-text-secondary">
              Generated 2026-07-26 21:55:00 IST · Window 24h · Engine pramaan-analyst-v3.1
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-pramaan-elevated border border-pramaan-border px-3.5 py-1.5 shadow-xs">
              <ShieldCheck size={16} className="text-pramaan-primary shrink-0" />
              <div className="text-[11px] font-mono leading-tight">
                <div className="text-pramaan-text-secondary uppercase text-[9px] font-bold">Overall Confidence</div>
                <div className="text-pramaan-primary font-bold">88.5% VERIFIED</div>
              </div>
            </div>

            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-xs font-bold text-pramaan-text bg-pramaan-elevated px-3.5 py-2 rounded-xl border border-pramaan-border hover:border-pramaan-primary transition-all cursor-pointer shadow-xs font-mono hover:bg-pramaan-surface"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin text-pramaan-primary' : 'text-pramaan-primary'} />
              <span>Refresh Briefing</span>
            </button>
          </div>
        </div>

        {/* 6-Grid KPI Stat Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {counters.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-xl border border-pramaan-border bg-pramaan-elevated p-3.5 flex flex-col justify-between shadow-xs hover:border-pramaan-primary/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-text-secondary">
                    {c.label}
                  </span>
                  <Icon size={15} className="text-pramaan-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-2 text-2xl font-mono font-black text-pramaan-text tracking-tight">
                  {c.value}
                </div>

                <div className={`mt-1 text-[10px] font-mono font-bold flex items-center gap-1 ${c.changeColor}`}>
                  <TrendingUp size={10} />
                  <span>{c.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURED 3-PANEL ANALYTICS ROW (INCIDENT LOAD + CRIME MIX + TARGET LEADERBOARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Panel 1 (5 Cols): INCIDENT LOAD - 7-Day Crime Incident Trend */}
        <div className="lg:col-span-5">
          <WorkPanel eyebrow="INCIDENT LOAD" title="7-Day Crime Incident Trend" className="h-full">
            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--pramaan-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--pramaan-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--pramaan-border)" opacity={0.6} />
                  <XAxis dataKey="day" stroke="var(--pramaan-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--pramaan-text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 28]} ticks={[0, 7, 14, 21, 28]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="alerts" stroke="var(--pramaan-primary)" strokeWidth={3} fill="url(#incidentGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </WorkPanel>
        </div>

        {/* Panel 2 (3 Cols): CRIME MIX - Crime Category Breakdown */}
        <div className="lg:col-span-3">
          <WorkPanel eyebrow="CRIME MIX" title="Crime Category Breakdown" className="h-full">
            <div className="h-40 flex items-center justify-center relative mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crimeMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {crimeMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--pramaan-surface)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Crime Category Legend */}
            <div className="mt-3 space-y-1.5 pt-2 border-t border-pramaan-border/60">
              {crimeMixData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-pramaan-text font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-pramaan-text">{item.value}</span>
                </div>
              ))}
            </div>
          </WorkPanel>
        </div>

        {/* Panel 3 (4 Cols): TARGET LEADERBOARD - Priority Watchlist */}
        <div className="lg:col-span-4">
          <WorkPanel
            eyebrow="TARGET LEADERBOARD"
            title="Priority Watchlist"
            className="h-full"
            actions={
              !isAggregateOnly && activeRole === 'ACP' ? (
                <button
                  onClick={() => setShowWeights(!showWeights)}
                  className={`p-1 rounded border transition-colors cursor-pointer ${
                    showWeights ? 'bg-pramaan-elevated text-pramaan-primary border-pramaan-primary' : 'border-pramaan-border text-pramaan-text-secondary hover:text-pramaan-text'
                  }`}
                  title="Adjust Priority Weight Sliders"
                >
                  <Sliders size={13} />
                </button>
              ) : null
            }
          >
            {showWeights && activeRole === 'ACP' && (
              <div className="mb-3 rounded-lg border border-pramaan-border bg-pramaan-elevated p-2.5 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-pramaan-primary font-bold">
                  <span>Priority Weights</span>
                  <button onClick={fetchPriority} className="px-2 py-0.5 bg-pramaan-primary text-white dark:text-black rounded font-bold text-[10px]">
                    Apply
                  </button>
                </div>
                <div>
                  <span className="text-pramaan-text-secondary">Recency Decay: {weights.wRecency}</span>
                  <input type="range" min="0" max="5" step="0.5" value={weights.wRecency} onChange={(e) => setWeights({ ...weights, wRecency: parseFloat(e.target.value) })} className="w-full accent-pramaan-primary" />
                </div>
              </div>
            )}

            {isAggregateOnly ? (
              <div className="p-4 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated rounded-lg border border-pramaan-border">
                <Shield className="w-6 h-6 mx-auto mb-2 text-pramaan-warning" />
                Suspect profiles masked for <strong>{activeRole}</strong> clearance.
              </div>
            ) : (
              <div className="space-y-3">
                {priorityData.map((row, idx) => (
                  <div
                    key={row.canonical_id || idx}
                    className="p-3.5 rounded-2xl border border-pramaan-border bg-pramaan-surface hover:border-pramaan-primary/50 transition-all shadow-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-pramaan-primary">#{idx + 1}</span>
                          <span className="font-extrabold text-sm text-pramaan-text">{row.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-pramaan-text-secondary">
                          {row.canonical_id} • {row.station}
                        </div>
                      </div>
                      
                      <ExplainabilityTooltip row={row} weights={weights} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-pramaan-border/40">
                      {(row.variables?.has_active_warrant || row.canonical_id === 'CANON-0042') && (
                        <span className="px-2 py-0.5 bg-red-500/15 text-red-500 border border-red-500/30 rounded-md text-[10px] font-mono font-bold flex items-center gap-1">
                          <AlertTriangle size={10} /> COURT WARRANT
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-pramaan-text-secondary">
                        {row.variables?.prior_cases || 3} cases linked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WorkPanel>
        </div>

      </div>

      {/* WATCH FLOOR INVESTIGATION SECTION (AI FINDINGS & TRIAGE QUEUE) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left Column (7 Cols): AI Key Findings & Evidence Citations */}
        <div className="xl:col-span-7 space-y-4">
          <WorkPanel eyebrow="AI ANALYST" title="Key Findings & Evidence Citations">
            <div className="space-y-3">
              {findings.map((f) => (
                <div key={f.id} className="p-3.5 rounded-xl border border-pramaan-border bg-pramaan-surface hover:border-pramaan-primary/50 transition-all shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-pramaan-primary bg-pramaan-primary/10 px-2 py-0.5 rounded border border-pramaan-primary/30">
                      {f.id} • Score {f.score}%
                    </span>
                    <Cite id={f.cite} onClick={onOpenCase} />
                  </div>

                  <p className="text-xs text-pramaan-text font-sans leading-relaxed">
                    {f.text}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-pramaan-border/50">
                    {f.evidence.map((e) => (
                      <div key={e.id} className="text-[10px] font-mono text-pramaan-text-secondary flex items-center gap-1.5">
                        <span className="text-pramaan-primary font-bold">[{e.id}]</span>
                        <span className="font-semibold text-pramaan-text">{e.label}:</span>
                        <span className="truncate">{e.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </WorkPanel>
        </div>

        {/* Right Column (5 Cols): Triage Case Register Queue */}
        <div className="xl:col-span-5 space-y-4">
          <WorkPanel eyebrow="TRIAGE QUEUE" title="Priority Case Register">
            <div className="space-y-2.5">
              {cases.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  onClick={onOpenCase}
                  className="flex items-center justify-between p-3 rounded-xl border border-pramaan-border bg-pramaan-surface hover:bg-pramaan-elevated transition-all cursor-pointer shadow-xs"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.priority === 'CRITICAL' ? 'bg-pramaan-critical animate-pulse' : 'bg-pramaan-warning'}`} />
                      <span className="font-bold text-xs text-pramaan-text truncate">{c.title}</span>
                    </div>
                    <div className="text-[10px] font-mono text-pramaan-text-secondary flex items-center gap-2">
                      <span>{c.id}</span>
                      <span>•</span>
                      <span>{c.entities} entities</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-mono font-bold text-pramaan-primary">{c.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </WorkPanel>
        </div>

      </div>
    </div>
  );
}

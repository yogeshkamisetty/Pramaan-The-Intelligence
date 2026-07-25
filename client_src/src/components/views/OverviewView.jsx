import React, { useState, useEffect } from 'react';
import { activitySeries, cases, alerts, caseTypeBreakdown } from '../../data/mock.js';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { Cite } from '../common/Cite.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, ShieldCheck, Sliders, AlertTriangle, ChevronRight, Activity, Users, Shield, Layers, Image as ImageIcon, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { ExplainabilityTooltip } from '../common/ExplainabilityTooltip.jsx';

export default function OverviewView({ onOpenCase, activeRole = 'ACP' }) {
  const [refreshing, setRefreshing] = useState(false);
  const [priorityData, setPriorityData] = useState([
    {
      canonical_id: 'CANON-0042',
      name: 'Mohammed Rafi',
      station: 'Indiranagar PS',
      total_score: 94.5,
      breakdown: { recency: 14, severity: 25, centrality: 20, warrant: 35.5 },
      variables: { prior_cases: 4, co_accused_count: 5, has_active_warrant: true }
    },
    {
      canonical_id: 'CANON-0044',
      name: 'S. Praveen Kumar',
      station: 'Bengaluru Central PS',
      total_score: 88.2,
      breakdown: { recency: 12, severity: 20, centrality: 18, warrant: 38.2 },
      variables: { prior_cases: 3, co_accused_count: 3, has_active_warrant: true }
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
  const [error, setError] = useState(null);
  const [showWeights, setShowWeights] = useState(false);

  const [weights, setWeights] = useState({
    wRecency: 1.0,
    wSeverity: 2.0,
    wCentrality: 1.5,
    wWarrant: 3.0
  });

  const isAggregateOnly = activeRole === 'Analyst' || activeRole === 'Policy';

  const findings = [
    { 
      score: 91, 
      cite: 'FIR-2024-8841', 
      text: 'CANON-0042 identified as highest-priority threat linked to multi-district serial burglaries.', 
      img: '/demo_faces/000049.jpg' 
    },
    { 
      score: 84, 
      cite: 'CASE-002', 
      text: 'CASE-002 flagged as 88% twin match to CASE-001 based on MO, timing, and weapon similarity.', 
      img: '/demo_faces/000050.jpg' 
    },
    { 
      score: 76, 
      cite: 'CLUS-BLR-CENTRAL', 
      text: 'Bengaluru Central station registered densest property crime cluster in past 7 days.', 
      img: '/demo_faces/000051.jpg' 
    },
  ];

  const fetchPriority = async () => {
    setLoading(true);
    setError(null);
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
      setTimeout(() => setRefreshing(false), 900);
    });
  };

  const activeCasesCount = cases.length;
  const openAlertsCount = alerts.length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length;
  const resolvedIdsCount = priorityData.length;

  return (
    <div className="space-y-5 anim-content">
      {/* Header Banner */}
      <WorkPanel
        eyebrow="Watch Floor Command Briefing"
        title="KSP Crime Intelligence Command Overview"
        actions={
          <div className="flex items-center gap-3">
            <ModeBadge mode="live" />
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-xs font-semibold text-pramaan-secondary bg-pramaan-elevated px-3 py-1.5 rounded-lg border border-pramaan-border hover:border-pramaan-secondary/40 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        }
      >
        <p className="text-xs text-pramaan-text-secondary">
          Real-time situation brief, suspect priority scores, incident trends, and AI-derived evidence citations for Karnataka State Police.
        </p>

        {/* Row 1 — High-Tech Stat Tiles (4-Up Grid) */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-pramaan-border bg-gradient-to-br from-[#121722] to-[#182030] p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-text-secondary">Active Cases</span>
              <Activity size={16} className="text-pramaan-primary opacity-80" />
            </div>
            <div className="text-3xl font-mono font-bold text-pramaan-text mt-2">{activeCasesCount}</div>
            <div className="text-[11px] font-mono font-bold text-pramaan-success mt-1 flex items-center gap-1">
              <span>↑ +4 from yesterday</span>
            </div>
          </div>

          <div className="rounded-xl border border-pramaan-border bg-gradient-to-br from-[#121722] to-[#182030] p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-text-secondary">Open Alerts</span>
              <AlertTriangle size={16} className="text-pramaan-warning opacity-80" />
            </div>
            <div className="text-3xl font-mono font-bold text-pramaan-text mt-2">{openAlertsCount}</div>
            <div className="text-[11px] font-mono font-bold text-pramaan-warning mt-1 flex items-center gap-1">
              <span>6 requiring review</span>
            </div>
          </div>

          <div className="rounded-xl border border-pramaan-critical/30 bg-gradient-to-br from-[#181217] to-[#251419] p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-critical">Critical Priority</span>
              <ShieldCheck size={16} className="text-pramaan-critical opacity-80 animate-pulse" />
            </div>
            <div className="text-3xl font-mono font-bold text-pramaan-critical mt-2">{criticalAlertsCount}</div>
            <div className="text-[11px] font-mono font-bold text-pramaan-critical mt-1 flex items-center gap-1">
              <span>High urgency action</span>
            </div>
          </div>

          <div className="rounded-xl border border-pramaan-secondary/30 bg-gradient-to-br from-[#121722] to-[#142232] p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-secondary">
                {isAggregateOnly ? 'Cluster Rollups' : 'Resolved Identities'}
              </span>
              <Layers size={16} className="text-pramaan-secondary opacity-80" />
            </div>
            <div className="text-3xl font-mono font-bold text-pramaan-secondary mt-2">
              {isAggregateOnly ? 14 : resolvedIdsCount}
            </div>
            <div className="text-[11px] font-mono font-bold text-pramaan-secondary mt-1 flex items-center gap-1">
              <span>Canonical graph</span>
            </div>
          </div>
        </div>
      </WorkPanel>

      {/* Row 2 — 2 Column Layout */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Left 2 Cols: Incident Load & AI Findings */}
        <div className="space-y-5 xl:col-span-2">
          
          {/* Incident Trends & Crime Mix Breakdown */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <WorkPanel eyebrow="Incident Load" title="7-Day Crime Incident Trend">
                <div className="h-56 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activitySeries}>
                      <defs>
                        <linearGradient id="alertValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A3346" />
                      <XAxis dataKey="time" stroke="#8A97AD" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8A97AD" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#2A3346', borderRadius: '8px', fontSize: '11px' }}
                        itemStyle={{ color: '#EAF0FA' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#alertValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </WorkPanel>
            </div>

            {/* Crime Category Pie Chart */}
            <WorkPanel eyebrow="Crime Mix" title="Crime Category Breakdown">
              <div className="h-44 mt-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={caseTypeBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3}>
                      {caseTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#2A3346', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2 text-[10px] font-mono">
                {caseTypeBreakdown.slice(0, 4).map((c) => (
                  <div key={c.type} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-pramaan-text-secondary">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.type}
                    </span>
                    <span className="font-bold text-pramaan-text">{c.count}</span>
                  </div>
                ))}
              </div>
            </WorkPanel>
          </div>

          {/* AI Key Findings with Visual Evidence Cards */}
          <WorkPanel eyebrow="Automated Intelligence" title="AI Key Findings & Evidence Citations">
            <div className="grid gap-4 md:grid-cols-3">
              {findings.map((f) => (
                <div key={f.cite} className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface flex flex-col justify-between gap-3 shadow-lg hover:border-pramaan-primary/40 transition-all">
                  <div className="flex items-center justify-between border-b border-pramaan-border/60 pb-2">
                    <span className="text-[10px] font-mono font-bold text-pramaan-primary bg-pramaan-primary/10 px-2 py-0.5 rounded-full border border-pramaan-primary/30">
                      Confidence: {f.score}%
                    </span>
                    <Cite id={f.cite} onClick={onOpenCase} />
                  </div>
                  {f.img && (
                    <img src={f.img} alt="Evidence media" className="h-28 w-full object-cover rounded-lg border border-pramaan-border/80 shadow" />
                  )}
                  <p className="text-xs text-pramaan-text leading-relaxed font-sans">{f.text}</p>
                </div>
              ))}
            </div>
          </WorkPanel>
        </div>

        {/* Right Rail: Target Leaderboard Priority Watchlist */}
        <WorkPanel
          eyebrow="Target Leaderboard"
          title="Priority Watchlist"
          actions={
            !isAggregateOnly && activeRole === 'ACP' ? (
              <button
                onClick={() => setShowWeights(!showWeights)}
                className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                  showWeights ? 'bg-pramaan-elevated text-pramaan-primary border-pramaan-primary' : 'border-pramaan-border text-pramaan-text-secondary hover:text-pramaan-text'
                }`}
                title="Adjust Weight Sliders"
              >
                <Sliders size={14} />
              </button>
            ) : null
          }
        >
          {showWeights && activeRole === 'ACP' && (
            <div className="mb-4 rounded-xl border border-pramaan-border bg-pramaan-elevated p-3.5 space-y-2.5 shadow-lg">
              <div className="flex justify-between items-center text-xs font-bold text-pramaan-secondary font-mono">
                <span>Adjust Priority Weights</span>
                <button
                  onClick={fetchPriority}
                  disabled={loading}
                  className="px-2.5 py-1 bg-pramaan-primary text-white rounded-lg text-[10px] hover:bg-pramaan-primary/80 cursor-pointer font-mono font-bold"
                >
                  Apply Weights
                </button>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-pramaan-text-secondary mb-0.5">
                    <span>Recency Decay</span> <span>{weights.wRecency}</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.5"
                    value={weights.wRecency}
                    onChange={(e) => setWeights({ ...weights, wRecency: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-pramaan-text-secondary mb-0.5">
                    <span>Crime Severity</span> <span>{weights.wSeverity}</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.5"
                    value={weights.wSeverity}
                    onChange={(e) => setWeights({ ...weights, wSeverity: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {isAggregateOnly ? (
            <div className="p-4 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated rounded-xl border border-pramaan-border">
              <Shield className="w-6 h-6 mx-auto mb-2 text-pramaan-warning opacity-80" />
              Individual suspect profiles are masked for <strong>{activeRole}</strong> role. Showing aggregated district crime scores.
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {priorityData.map((row, idx) => (
                <div
                  key={row.canonical_id || idx}
                  className="rounded-xl border border-pramaan-border bg-pramaan-surface p-3.5 hover:border-pramaan-primary/50 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-pramaan-primary bg-pramaan-primary/10 px-1.5 py-0.2 rounded">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-pramaan-text">{row.name}</span>
                      </div>
                      <div className="font-mono text-[10px] text-pramaan-text-secondary">{row.canonical_id} • {row.station || 'Indiranagar PS'}</div>
                    </div>
                    <ExplainabilityTooltip row={row} weights={weights} />
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {(row.variables?.has_active_warrant || row.canonical_id === 'CANON-0042') && (
                      <span className="px-2 py-0.5 bg-pramaan-critical/15 text-pramaan-critical border border-pramaan-critical/30 rounded-full text-[9px] font-mono font-bold flex items-center gap-0.5">
                        <AlertTriangle size={9} /> COURT WARRANT
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-pramaan-elevated text-pramaan-text-secondary rounded-full text-[9px] font-mono">
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
  );
}

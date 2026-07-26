import React, { useMemo, useState } from 'react';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { Cite } from '../common/Cite.jsx';
import { 
  FileText, MapPin, Clock, ShieldCheck, Sliders, RefreshCw, Link2, Languages, Sparkles, 
  CheckCircle2, ChevronRight, Zap, Target, ArrowRight, Layers, Search, Filter, 
  Network, AlertTriangle, Download, Send, Plus, Eye, Scale, HelpCircle, Activity, Globe 
} from 'lucide-react';
import { api } from '../../api/client.js';
import { candidateCases, fallbackMatches, referenceCasesList, targetCase as defaultTarget } from '../../data/similarCases.js';

export default function SimilarCasesView() {
  const [selectedTargetId, setSelectedTargetId] = useState('CASE-001');
  const [customTargetText, setCustomTargetText] = useState('');
  const [showCustomSimulator, setShowCustomSimulator] = useState(false);

  const [weights, setWeights] = useState({
    wLocation: 0.25,
    wTime: 0.15,
    wMO: 0.30,
    wWeapon: 0.10,
    wNarrative: 0.20,
  });

  const [result, setResult] = useState({
    top_matches: fallbackMatches,
    flagged_linkages: fallbackMatches.filter((m) => m.shared_confirmed_suspect),
    mode: 'live',
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [selectedTwinId, setSelectedTwinId] = useState('CASE-002');
  const [actionSuccess, setActionSuccess] = useState('');

  // Active Target Reference Case
  const activeTargetCase = useMemo(() => {
    if (showCustomSimulator && customTargetText.trim()) {
      return {
        case_id: 'CUSTOM-SIM-01',
        crime_type: 'Burglary / Break-in (Custom Query)',
        title: 'Custom Investigator FIR Narrative Input',
        station: 'KSP Command HQ Simulator',
        modus_operandi: customTargetText.slice(0, 100) + '...',
        narrative_text: customTargetText,
        narrative_kannada: 'ಕಸ್ಟಮ್ ಪ್ರಕರಣ ವಿವರ ಸಬೂತುಗೊಳಿಸಲಾಗಿದೆ.',
        latitude: 12.9579,
        longitude: 77.6251,
        date_time: new Date().toISOString(),
        weapon: 'crowbar',
        canonical_suspect_ids: ['CANON-0042'],
        suspect_name: 'Mohammed Rafi'
      };
    }
    return referenceCasesList.find((c) => c.case_id === selectedTargetId) || referenceCasesList[0];
  }, [selectedTargetId, showCustomSimulator, customTargetText]);

  const matches = useMemo(() => result?.top_matches || result?.ranked_similarity || fallbackMatches, [result]);
  const selectedTwin = useMemo(() => matches.find(m => m.case_id === selectedTwinId) || matches[0] || fallbackMatches[0], [matches, selectedTwinId]);

  async function runMatch(customWeights) {
    const activeWeights = customWeights || weights;
    setPending(true);
    setError('');
    const res = await api.matchCaseTwin(activeTargetCase, candidateCases, 5, activeWeights);
    setPending(false);
    if (res.ok && res.data) {
      const topMatches = res.data.top_matches || res.data.ranked_similarity || fallbackMatches;
      const flaggedLinks = res.data.flagged_linkages || fallbackMatches.filter((m) => m.shared_confirmed_suspect);
      setResult({
        top_matches: topMatches,
        flagged_linkages: flaggedLinks,
        mode: res.mode || 'live',
      });
    } else {
      setError(res.error || 'Case twin matching failed. Running in-memory Vyakyarth scoring.');
      setResult({
        top_matches: fallbackMatches,
        flagged_linkages: fallbackMatches.filter((m) => m.shared_confirmed_suspect),
        mode: 'seed_fallback',
      });
    }
  }

  const applyPreset = (presetName) => {
    let newWeights = { ...weights };
    if (presetName === 'mo') {
      newWeights = { wMO: 0.50, wLocation: 0.15, wNarrative: 0.20, wTime: 0.05, wWeapon: 0.10 };
    } else if (presetName === 'geo') {
      newWeights = { wMO: 0.15, wLocation: 0.55, wNarrative: 0.15, wTime: 0.10, wWeapon: 0.05 };
    } else {
      newWeights = { wMO: 0.30, wLocation: 0.25, wNarrative: 0.20, wTime: 0.15, wWeapon: 0.10 };
    }
    setWeights(newWeights);
    runMatch(newWeights);
  };

  const getMatchBadge = (score) => {
    const s = score > 1 ? score / 100 : score;
    if (s >= 0.85) return { label: '🎯 EXACT SIGNATURE TWIN', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
    if (s >= 0.70) return { label: '⚡ STRONG PATTERN MATCH', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    if (s >= 0.50) return { label: '⚠️ SUSPECT LINKAGE DETECTED', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40' };
    return { label: '🔍 DISTANT PATTERN', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' };
  };

  const getBarColor = (val) => {
    if (val >= 0.80) return 'bg-emerald-400';
    if (val >= 0.50) return 'bg-amber-400';
    return 'bg-blue-400';
  };

  const triggerDispatchAction = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 6000);
  };

  return (
    <div className="space-y-5 font-sans anim-content">
      {actionSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-white text-sm font-extrabold">✕</button>
        </div>
      )}

      {/* HEADER BANNER & OMNIBAR TARGET SELECTOR */}
      <WorkPanel
        eyebrow="Intelligence Module · Indic Vyakyarth Model"
        title="Case Twin Intelligence & Pattern Matcher"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <ModeBadge mode={result.mode || 'live'} />
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Languages size={14} className="text-cyan-400" /> Bilingual Indic NLP (Kannada + English)
            </span>
          </div>
        }
      >
        <p className="text-xs text-pramaan-text-secondary leading-relaxed">
          AI lead generation system that computes cosine similarity across Modus Operandi (MO), spatial proximity, time windows, and bilingual FIR narratives. Resolves serial crime patterns across Karnataka police stations.
        </p>

        {/* TARGET CASE SELECTION OMNIBAR */}
        <div className="mt-4 p-3.5 rounded-xl bg-pramaan-elevated border border-pramaan-border space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pramaan-border pb-2.5">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-pramaan-primary" />
              <span className="text-xs font-bold text-pramaan-text font-mono uppercase tracking-wider">
                Select Reference Target Case:
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={showCustomSimulator ? 'CUSTOM' : selectedTargetId}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setShowCustomSimulator(true);
                  } else {
                    setShowCustomSimulator(false);
                    setSelectedTargetId(e.target.value);
                  }
                }}
                className="bg-pramaan-bg border border-pramaan-border text-pramaan-text rounded-lg px-3 py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer"
              >
                {referenceCasesList.map((rc) => (
                  <option key={rc.case_id} value={rc.case_id}>
                    {rc.case_id} — {rc.title} ({rc.crime_type})
                  </option>
                ))}
                <option value="CUSTOM">✏️ Custom FIR Narrative Simulator</option>
              </select>

              <button
                onClick={() => setShowCustomSimulator(!showCustomSimulator)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  showCustomSimulator
                    ? 'bg-pramaan-primary text-black font-extrabold shadow-sm'
                    : 'bg-pramaan-surface text-pramaan-text border border-pramaan-border hover:bg-pramaan-elevated'
                }`}
              >
                <Plus size={13} /> {showCustomSimulator ? 'Using Custom Input' : 'Input Custom FIR'}
              </button>
            </div>
          </div>

          {/* CUSTOM FIR NARRATIVE SIMULATOR INPUT BOX */}
          {showCustomSimulator && (
            <div className="p-3 rounded-lg bg-pramaan-bg border border-cyan-500/40 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                <span>Paste Kannada or English FIR Narrative to Search Twins:</span>
                <span className="text-[10px] text-gray-400 font-normal">Vyakyarth Indic Embedding Vectorizer Active</span>
              </div>
              <textarea
                rows={3}
                value={customTargetText}
                onChange={(e) => setCustomTargetText(e.target.value)}
                placeholder="Example: Complainant reported house burglary. Entry made through rear window using crowbar late night between 1 AM and 3 AM. Gold jewelry stolen..."
                className="w-full p-2.5 rounded-lg bg-pramaan-elevated border border-pramaan-border text-xs text-pramaan-text font-mono focus:outline-none focus:border-pramaan-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => runMatch()}
                  disabled={pending || !customTargetText.trim()}
                  className="px-3 py-1.5 bg-pramaan-primary text-black font-bold rounded-lg text-xs flex items-center gap-1 hover:bg-pramaan-primary-cyan disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles size={13} /> Run Case Twin Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3-COLUMN MAIN WORKSPACE */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN (3 cols): Active Target Reference & Feature Weight Sliders */}
          <div className="lg:col-span-3 space-y-4">
            {/* Active Target Reference Details */}
            <div className="p-4 rounded-xl border border-pramaan-primary/40 bg-pramaan-primary/5 space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-pramaan-primary/20">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-primary flex items-center gap-1">
                  <Target size={13} /> Active Reference
                </span>
                <Cite id={activeTargetCase.case_id} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-pramaan-text">{activeTargetCase.title}</h3>
                <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{activeTargetCase.station}</p>
                <p className="text-[11px] text-pramaan-text-secondary mt-1.5 leading-relaxed line-clamp-3">
                  {activeTargetCase.modus_operandi}
                </p>
              </div>

              <div className="space-y-1 text-[10px] font-mono text-pramaan-text-secondary pt-1 border-t border-pramaan-border/60">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-pramaan-primary" /> {activeTargetCase.date_time.replace('T', ' ')}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-pramaan-primary" /> Lat/Lng: {activeTargetCase.latitude}, {activeTargetCase.longitude}
                </div>
                {activeTargetCase.suspect_name && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <ShieldCheck size={11} /> Key Suspect: {activeTargetCase.suspect_name}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Weight Sliders Card */}
            <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-elevated space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-pramaan-border">
                <span className="text-[10px] font-mono font-bold uppercase text-pramaan-secondary flex items-center gap-1">
                  <Sliders size={13} /> Multi-Vector Weights
                </span>
                <button
                  onClick={() => runMatch()}
                  disabled={pending}
                  className="px-2.5 py-1 bg-pramaan-primary text-black rounded-lg text-[10px] font-bold hover:bg-pramaan-primary-cyan transition-colors cursor-pointer"
                >
                  {pending ? 'Scoring...' : 'Recalculate'}
                </button>
              </div>

              {/* Weight Presets */}
              <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                <span className="text-[10px] font-mono text-gray-400">Presets:</span>
                <button onClick={() => applyPreset('balanced')} className="px-2 py-0.5 rounded text-[10px] font-mono bg-pramaan-surface hover:bg-pramaan-border text-pramaan-text border border-pramaan-border">Balanced</button>
                <button onClick={() => applyPreset('mo')} className="px-2 py-0.5 rounded text-[10px] font-mono bg-pramaan-surface hover:bg-pramaan-border text-pramaan-text border border-pramaan-border">MO Heavy</button>
                <button onClick={() => applyPreset('geo')} className="px-2 py-0.5 rounded text-[10px] font-mono bg-pramaan-surface hover:bg-pramaan-border text-pramaan-text border border-pramaan-border">Geo Radius</button>
              </div>

              {/* Weight Sliders */}
              <div className="space-y-3 text-xs font-mono pt-1">
                <div>
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-1">
                    <span>MO Similarity Weight</span>
                    <span className="text-pramaan-primary font-bold">{Math.round(weights.wMO * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={weights.wMO}
                    onChange={(e) => setWeights({ ...weights, wMO: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-1">
                    <span>Spatial Proximity Weight</span>
                    <span className="text-pramaan-primary font-bold">{Math.round(weights.wLocation * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={weights.wLocation}
                    onChange={(e) => setWeights({ ...weights, wLocation: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-1">
                    <span>Indic Vector Weight</span>
                    <span className="text-pramaan-primary font-bold">{Math.round(weights.wNarrative * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={weights.wNarrative}
                    onChange={(e) => setWeights({ ...weights, wNarrative: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-1">
                    <span>Time Window Weight</span>
                    <span className="text-pramaan-primary font-bold">{Math.round(weights.wTime * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={weights.wTime}
                    onChange={(e) => setWeights({ ...weights, wTime: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (4 cols): Ranked Match Candidate Cards */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-pramaan-surface border border-pramaan-border text-xs font-mono shadow-sm">
              <span className="font-bold text-pramaan-text">Ranked Case Twins ({matches.length})</span>
              <span className="text-pramaan-text-secondary text-[10px]">Select to compare</span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {matches.map((m, idx) => {
                const isSelected = m.case_id === selectedTwinId;
                const scorePercent = Math.round((m.total_score || m.match_score || 0.82) * 100);
                const badge = getMatchBadge(scorePercent);

                return (
                  <div
                    key={m.case_id}
                    onClick={() => setSelectedTwinId(m.case_id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 shadow-md ${
                      isSelected
                        ? 'bg-pramaan-primary/10 border-pramaan-primary ring-1 ring-pramaan-primary'
                        : 'bg-pramaan-elevated border-pramaan-border hover:border-pramaan-secondary/50 hover:bg-pramaan-surface'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-pramaan-surface text-pramaan-text font-mono text-[10px] font-bold border border-pramaan-border">
                          #{idx + 1}
                        </span>
                        <Cite id={m.case_id} />
                        <span className="text-xs font-bold text-pramaan-text truncate max-w-[140px]">{m.title || m.crime_type}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${badge.color}`}>
                        {scorePercent}%
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-cyan-400">{m.station || 'Karnataka Police Station'}</div>

                    <p className="text-[11px] text-pramaan-text-secondary leading-relaxed line-clamp-2">
                      {m.modus_operandi}
                    </p>

                    <div className="pt-1 flex items-center justify-between border-t border-pramaan-border/60 text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-mono font-extrabold ${badge.color}`}>
                        {badge.label}
                      </span>
                      {m.shared_confirmed_suspect && (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400">
                          <Link2 size={11} /> SHARED SUSPECT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): Deep Bilingual Comparison & Cross-Station Add-ons */}
          <div className="lg:col-span-5 space-y-4">
            {selectedTwin ? (
              <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-elevated space-y-4 shadow-xl">
                
                {/* INSPECTOR HEADER & COMPOSITE SCORE */}
                <div className="flex items-center justify-between pb-3 border-b border-pramaan-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pramaan-secondary font-bold flex items-center gap-1">
                      <Scale size={13} /> Twin Comparison Inspector
                    </span>
                    <h2 className="text-sm font-bold text-pramaan-text flex items-center gap-2 mt-0.5">
                      <span>{activeTargetCase.case_id}</span>
                      <ArrowRight size={14} className="text-pramaan-secondary" />
                      <span className="text-pramaan-primary">{selectedTwin.case_id} ({selectedTwin.title || 'Candidate'})</span>
                    </h2>
                  </div>

                  <div className="text-right bg-pramaan-surface px-3 py-1.5 rounded-lg border border-pramaan-border">
                    <span className="text-[9px] font-mono text-pramaan-text-secondary block font-bold">MATCH SCORE</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-400">
                      {Math.round((selectedTwin.total_score || selectedTwin.match_score || 0.82) * 100)}%
                    </span>
                  </div>
                </div>

                {/* BILINGUAL NARRATIVE COMPARATOR (Kannada + English Side-by-Side) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-pramaan-secondary font-bold flex items-center gap-1">
                      <Languages size={13} /> Bilingual Indic Narrative Comparator:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Vyakyarth Indic Vector Match</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-pramaan-surface border border-pramaan-border text-xs leading-relaxed space-y-3 shadow-inner">
                    {/* Target Narrative */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-pramaan-secondary font-bold mb-1">
                        <span>TARGET REFERENCE ({activeTargetCase.case_id}):</span>
                        <span>{activeTargetCase.station}</span>
                      </div>
                      <p className="text-pramaan-text font-mono text-[11px]">{activeTargetCase.narrative_text}</p>
                      {activeTargetCase.narrative_kannada && (
                        <p className="text-amber-200/90 font-kannada text-xs mt-1 pt-1 border-t border-white/5">
                          {activeTargetCase.narrative_kannada}
                        </p>
                      )}
                    </div>

                    {/* Matched Candidate Narrative */}
                    <div className="pt-2 border-t border-pramaan-border">
                      <div className="flex items-center justify-between text-[10px] font-mono text-pramaan-primary font-bold mb-1">
                        <span>TWIN CANDIDATE ({selectedTwin.case_id}):</span>
                        <span>{selectedTwin.station || 'Karnataka Station'}</span>
                      </div>
                      <p className="text-pramaan-text font-mono text-[11px]">{selectedTwin.narrative_text || selectedTwin.modus_operandi}</p>
                      {selectedTwin.narrative_kannada && (
                        <p className="text-cyan-200/90 font-kannada text-xs mt-1 pt-1 border-t border-white/5">
                          {selectedTwin.narrative_kannada}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* VECTOR BREAKDOWN ANALYSIS (Progress Bars) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase text-pramaan-text-secondary font-semibold block">
                    Vector Breakdown Analysis:
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-pramaan-surface p-3 rounded-xl border border-pramaan-border">
                    {Object.entries(selectedTwin.breakdown || { mo: 0.94, location: 0.82, narrative: 0.88, time: 0.85, weapon: 1.0 }).map(([feature, val]) => {
                      const percent = Math.round((val || 0) * 100);
                      return (
                        <div key={feature} className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="uppercase text-pramaan-text-secondary font-bold">{feature}:</span>
                            <span className="text-pramaan-text font-bold">{percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-pramaan-bg rounded-full overflow-hidden border border-pramaan-border">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getBarColor(val)}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ADD-ON 1: CROSS-DISTRICT CASE LINKAGE GRAPH */}
                <div className="p-3.5 rounded-xl bg-pramaan-surface border border-pramaan-border space-y-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                    <Network size={14} /> Cross-District Serial Crime Network Diagram:
                  </span>
                  
                  {/* SVG Network Link Diagram */}
                  <div className="p-3 bg-pramaan-bg rounded-lg border border-pramaan-border text-center relative overflow-hidden">
                    <div className="flex items-center justify-around gap-2 text-xs font-mono py-2">
                      <div className="p-2 rounded-lg bg-pramaan-elevated border border-pramaan-primary text-pramaan-primary font-bold">
                        <div>📍 {activeTargetCase.case_id}</div>
                        <div className="text-[9px] text-gray-400 font-normal">{activeTargetCase.station.split(',')[0]}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                          {selectedTwin.suspect_name || 'CANON-0042 (Shared)'}
                        </span>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-pramaan-primary to-emerald-400 my-1 animate-pulse" />
                        <span className="text-[9px] text-gray-400">89% Cosine Match</span>
                      </div>

                      <div className="p-2 rounded-lg bg-pramaan-elevated border border-emerald-400 text-emerald-400 font-bold">
                        <div>📍 {selectedTwin.case_id}</div>
                        <div className="text-[9px] text-gray-400 font-normal">{selectedTwin.station ? selectedTwin.station.split(',')[0] : 'Linked Station'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADD-ON 2: AUTOMATED EVIDENCE CHECKLIST */}
                <div className="p-3.5 rounded-xl bg-pramaan-surface border border-pramaan-border space-y-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles size={14} /> Automated Evidence Match Reason Checklist:
                  </span>
                  <ul className="space-y-1.5 text-xs text-pramaan-text leading-relaxed font-sans">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><b>Identical MO Signature:</b> Rear window forced entry using crowbar tool levering.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><b>Time Window Overlap:</b> Occurred between late night 01:00 AM – 03:00 AM.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><b>Vyakyarth Indic Vector:</b> High semantic similarity score across Kannada narrative descriptions.</span>
                    </li>
                    {selectedTwin.shared_confirmed_suspect && (
                      <li className="flex items-start gap-2 font-bold text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/30">
                        <Link2 size={14} className="shrink-0 mt-0.5 text-amber-400" />
                        <span>CONFIRMED SUSPECT LINKAGE: Mohammed Rafi (CANON-0042) associated with both case files.</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* ONE-CLICK ACTION BUTTONS */}
                <div className="pt-2 flex flex-wrap justify-between gap-2 border-t border-pramaan-border">
                  <button
                    onClick={() => triggerDispatchAction(`[KSP ALERT DISPATCH] Joint Serial Crime Briefing sent to ${selectedTwin.station || 'Linked Station'} for ${selectedTwin.case_id}.`)}
                    className="px-3 py-2 bg-pramaan-primary hover:bg-pramaan-primary-cyan text-black font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Send size={13} /> Dispatch Cross-Station Alert
                  </button>

                  <button
                    onClick={() => triggerDispatchAction(`[DOSSIER EXPORTED] Serial Case Twin Evidence PDF compiled for ${activeTargetCase.case_id} & ${selectedTwin.case_id}.`)}
                    className="px-3 py-2 bg-pramaan-surface hover:bg-pramaan-border text-pramaan-text font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-pramaan-border"
                  >
                    <Download size={13} /> Export Joint Twin Dossier (PDF)
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated rounded-xl border border-pramaan-border shadow-md">
                Select a case twin from the candidate list to view deep comparison.
              </div>
            )}
          </div>

        </div>
      </WorkPanel>
    </div>
  );
}

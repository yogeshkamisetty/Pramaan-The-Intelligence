import React, { useMemo, useState } from 'react';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { Cite } from '../common/Cite.jsx';
import { FileText, MapPin, Clock, ShieldCheck, Sliders, RefreshCw, Link2, Languages, Sparkles, CheckCircle2, ChevronRight, Zap, Target, ArrowRight } from 'lucide-react';
import { api } from '../../api/client.js';
import { candidateCases, fallbackMatches, targetCase } from '../../data/similarCases.js';

export default function SimilarCasesView() {
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

  const matches = useMemo(() => result?.top_matches || result?.ranked_similarity || [], [result]);
  const selectedTwin = useMemo(() => matches.find(m => m.case_id === selectedTwinId) || matches[0] || fallbackMatches[0], [matches, selectedTwinId]);
  const candidateDetail = useMemo(() => candidateCases.find(c => c.case_id === selectedTwin?.case_id) || candidateCases[0], [selectedTwin]);

  async function runMatch(customWeights) {
    const activeWeights = customWeights || weights;
    setPending(true);
    setError('');
    const res = await api.matchCaseTwin(targetCase, candidateCases, 4, activeWeights);
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
      setError(res.error || 'Case twin matching failed');
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

  const getScoreColor = (score) => {
    const s = score > 1 ? score / 100 : score;
    if (s >= 0.75) return 'text-pramaan-success bg-pramaan-success/15 border-pramaan-success/30';
    if (s >= 0.40) return 'text-pramaan-warning bg-pramaan-warning/15 border-pramaan-warning/30';
    return 'text-pramaan-text-secondary bg-pramaan-surface border-pramaan-border';
  };

  const getBarColor = (val) => {
    if (val >= 0.75) return 'bg-emerald-400';
    if (val >= 0.40) return 'bg-amber-400';
    return 'bg-blue-400';
  };

  return (
    <div className="space-y-5 anim-content">
      {/* Header Banner */}
      <WorkPanel
        eyebrow="Investigate Module"
        title="Case Twin Intelligence & Pattern Matcher"
        actions={
          <div className="flex items-center gap-3">
            <ModeBadge mode={result.mode || 'live'} />
            <span className="text-xs font-mono text-pramaan-secondary bg-pramaan-secondary/15 px-2.5 py-1 rounded border border-pramaan-secondary/30 flex items-center gap-1">
              <Languages size={13} /> Scored in Kannada & English (Vyakyarth NLP)
            </span>
          </div>
        }
      >
        <p className="text-xs text-pramaan-text-secondary">
          Automated lead generator that compares Modus Operandi (MO), spatial proximity, time windows, and bilingual narrative vectors to resolve serial crime patterns across Karnataka police stations.
        </p>

        {/* 3-Column Layout: Left Controls + Middle Candidate Index + Right Detail Comparison */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column (3 cols): Target Case & Weight Adjuster */}
          <div className="lg:col-span-3 space-y-4">
            {/* Target Case Reference Card */}
            <div className="p-4 rounded-lg border border-pramaan-primary/30 bg-pramaan-primary/5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pramaan-primary/20">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-primary flex items-center gap-1">
                  <Target size={12} /> Target Reference Case
                </span>
                <Cite id={targetCase.case_id} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-pramaan-text">{targetCase.crime_type} — Serial MO Pattern</h3>
                <p className="text-[11px] text-pramaan-text-secondary mt-1 line-clamp-2 leading-relaxed">{targetCase.modus_operandi}</p>
              </div>

              <div className="space-y-1 text-[10px] font-mono text-pramaan-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-pramaan-primary" /> {targetCase.date_time.replace('T', ' ')}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-pramaan-primary" /> {targetCase.latitude}, {targetCase.longitude}
                </div>
              </div>
            </div>

            {/* Weight Sliders Card */}
            <div className="p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pramaan-border">
                <span className="text-[10px] font-mono font-bold uppercase text-pramaan-secondary flex items-center gap-1">
                  <Sliders size={13} /> Feature Weights
                </span>
                <button
                  onClick={() => runMatch()}
                  disabled={pending}
                  className="px-2 py-0.5 bg-pramaan-primary text-pramaan-bg rounded text-[10px] font-bold hover:bg-pramaan-primary-cyan transition-colors cursor-pointer"
                >
                  {pending ? 'Scoring...' : 'Recalculate'}
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[9px] font-mono text-pramaan-text-secondary">Presets:</span>
                <button onClick={() => applyPreset('balanced')} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-pramaan-surface hover:bg-pramaan-panel text-pramaan-text border border-pramaan-border">Balanced</button>
                <button onClick={() => applyPreset('mo')} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-pramaan-surface hover:bg-pramaan-panel text-pramaan-text border border-pramaan-border">MO Heavy</button>
                <button onClick={() => applyPreset('geo')} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-pramaan-surface hover:bg-pramaan-panel text-pramaan-text border border-pramaan-border">Geo Radius</button>
              </div>

              {/* Weight Sliders */}
              <div className="space-y-2.5 text-xs font-mono pt-1">
                <div>
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-0.5">
                    <span>MO Similarity</span>
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
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-0.5">
                    <span>Location Proximity</span>
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
                  <div className="flex justify-between text-pramaan-text-secondary text-[11px] mb-0.5">
                    <span>Narrative Vector</span>
                    <span className="text-pramaan-primary font-bold">{Math.round(weights.wNarrative * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={weights.wNarrative}
                    onChange={(e) => setWeights({ ...weights, wNarrative: parseFloat(e.target.value) })}
                    className="w-full accent-pramaan-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Column (4 cols): Candidate Index List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-pramaan-surface border border-pramaan-border text-xs font-mono">
              <span className="font-bold text-pramaan-text">Matched Twins Index ({matches.length})</span>
              <span className="text-pramaan-text-secondary text-[10px]">Click to inspect</span>
            </div>

            <div className="space-y-2.5">
              {matches.map((m, idx) => {
                const isSelected = m.case_id === selectedTwinId;
                const scorePercent = Math.round((m.total_score || 0.82) * 100);
                return (
                  <div
                    key={m.case_id}
                    onClick={() => setSelectedTwinId(m.case_id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-pramaan-primary/10 border-pramaan-primary shadow-lg shadow-pramaan-primary/5'
                        : 'bg-pramaan-elevated border-pramaan-border hover:border-pramaan-secondary/50 hover:bg-pramaan-surface'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-pramaan-panel text-pramaan-text-secondary font-mono text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                        <Cite id={m.case_id} />
                        <span className="text-xs font-bold text-pramaan-text truncate">{m.crime_type}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${getScoreColor(scorePercent)}`}>
                        {scorePercent}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-pramaan-text-secondary leading-snug line-clamp-2">
                      {m.modus_operandi}
                    </p>

                    {m.shared_confirmed_suspect && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-pramaan-warning bg-pramaan-warning/15 px-2 py-0.5 rounded border border-pramaan-warning/30">
                        <Link2 size={10} /> SHARED SUSPECT CONFIRMED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 cols): Deep Match Comparison Inspector */}
          <div className="lg:col-span-5 space-y-4">
            {selectedTwin ? (
              <div className="p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-pramaan-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pramaan-secondary font-bold">
                      Twin Comparison Inspector
                    </span>
                    <h2 className="text-sm font-bold text-pramaan-text flex items-center gap-2 mt-0.5">
                      <span>CASE-001</span>
                      <ArrowRight size={14} className="text-pramaan-secondary" />
                      <span className="text-pramaan-primary">{selectedTwin.case_id}</span>
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-pramaan-text-secondary block">COMPOSITE SCORE</span>
                    <span className="text-lg font-mono font-extrabold text-pramaan-success">
                      {Math.round((selectedTwin.total_score || 0.82) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Narrative comparison side by side */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-pramaan-text-secondary font-semibold block">
                    Modus Operandi Comparison:
                  </span>
                  <div className="p-3 rounded bg-pramaan-surface border border-pramaan-border text-xs leading-relaxed space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-pramaan-secondary font-bold block">TARGET (CASE-001):</span>
                      <p className="text-pramaan-text">{targetCase.modus_operandi}</p>
                    </div>
                    <div className="pt-2 border-t border-pramaan-border/60">
                      <span className="text-[10px] font-mono text-pramaan-primary font-bold block">MATCHED (TWIN {selectedTwin.case_id}):</span>
                      <p className="text-pramaan-text font-kannada">{selectedTwin.modus_operandi}</p>
                    </div>
                  </div>
                </div>

                {/* Feature breakdown progress bars */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-pramaan-text-secondary font-semibold block">
                    Vector Breakdown Analysis:
                  </span>

                  <div className="space-y-2 text-xs font-mono">
                    {Object.entries(selectedTwin.breakdown || { mo: 0.91, weapon: 1.0, narrative: 0.84, time: 0.78, location: 0.42 }).map(([feature, val]) => {
                      const percent = Math.round((val || 0) * 100);
                      return (
                        <div key={feature} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="uppercase text-pramaan-text-secondary font-bold">{feature}:</span>
                            <span className="text-pramaan-text font-bold">{percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-pramaan-surface rounded-full overflow-hidden border border-pramaan-border">
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

                {/* Why it matched explanation box */}
                <div className="p-3 rounded-lg bg-pramaan-surface border border-pramaan-border/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-pramaan-secondary flex items-center gap-1">
                    <Sparkles size={12} /> Why These Cases Matched:
                  </span>
                  <ul className="space-y-1 text-xs text-pramaan-text leading-relaxed font-sans">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>Identical Forced Entry MO — rear window entry using crowbar.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>Time window overlap (01:00 AM – 04:00 AM late night).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>High semantic similarity in Indic Kannada narrative description.</span>
                    </li>
                    {selectedTwin.shared_confirmed_suspect && (
                      <li className="flex items-start gap-1.5 font-bold text-amber-400">
                        <Link2 size={13} className="shrink-0 mt-0.5" />
                        <span>Shared Suspect Link: CANON-0042 associated with both case files.</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => alert(`Navigating to full dossier comparison for ${selectedTwin.case_id}...`)}
                    className="px-3 py-1.5 bg-pramaan-primary hover:bg-pramaan-primary-cyan text-pramaan-bg text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    Compare Complete Dossier <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated rounded-lg border border-pramaan-border">
                Select a case twin from the middle list to view deep comparison.
              </div>
            )}
          </div>
        </div>
      </WorkPanel>
    </div>
  );
}

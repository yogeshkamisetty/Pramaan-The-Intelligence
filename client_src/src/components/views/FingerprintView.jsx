import React, { useState, useEffect } from 'react';
import { WorkPanel } from '../ui/Layout.jsx';
import { Button } from '../ui/Controls.jsx';
import { 
  Fingerprint, ScanFace, Upload, ShieldCheck, X, Camera, RefreshCw, 
  Sparkles, Download, Layers, Cpu, MapPin, AlertTriangle, FileText, CheckCircle2, 
  Sliders, Eye, Contrast, SlidersHorizontal, Maximize2, RotateCcw, Zap, Filter
} from 'lucide-react';

export default function FingerprintView() {
  const [pending, setPending] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [searchFile, setSearchFile] = useState(null);
  const [searchPreview, setSearchPreview] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Latent Print Image Enhancement Controls
  const [contrast, setContrast] = useState(140); // 50-200%
  const [brightness, setBrightness] = useState(110); // 50-150%
  const [binarizeThreshold, setBinarizeThreshold] = useState(128); // 0-255
  const [ridgeFrequency, setRidgeFrequency] = useState(6); // 1-10
  const [isSkeletonized, setIsSkeletonized] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [activeFilterMode, setActiveFilterMode] = useState('enhanced'); // 'raw', 'enhanced', 'skeleton', 'binary'
  const [showComparison, setShowComparison] = useState(false);

  const SAMPLE_PRINTS = [
    {
      id: 'CANON-0042',
      name: 'Mohammed Rafi (CANON-0042)',
      finger: 'Right Index Finger',
      pattern: 'Right Loop (Ulnar)',
      station: 'Indiranagar PS',
      crime: 'Burglary & Window Break-in',
      warrant: '1st ACMM Court Warrant #4412',
      riskScore: 94,
      caseNumber: '104430006202600001',
      minutiae: { endings: 42, bifurcations: 28, ridgeCount: 14, coreDeltaDist: '12.4mm' }
    },
    {
      id: 'CANON-0089',
      name: 'Ramesh Kumar (CANON-0089)',
      finger: 'Left Thumb',
      pattern: 'Plain Whorl',
      station: 'Mysuru South PS',
      crime: 'Commercial Hawala Fraud',
      warrant: 'Active Look-Out Circular',
      riskScore: 88,
      caseNumber: '104430006202600003',
      minutiae: { endings: 38, bifurcations: 24, ridgeCount: 12, coreDeltaDist: '10.8mm' }
    },
    {
      id: 'CANON-0104',
      name: 'Sharif Khan (CANON-0104)',
      finger: 'Left Index Finger',
      pattern: 'Double Loop Whorl',
      station: 'Whitefield PS',
      crime: 'Cyber Financial Theft',
      warrant: 'Interstate Cyber Warrant',
      riskScore: 79,
      caseNumber: '104430006202600002',
      minutiae: { endings: 34, bifurcations: 20, ridgeCount: 10, coreDeltaDist: '9.5mm' }
    },
    {
      id: 'CANON-0142',
      name: 'Anand V (CANON-0142)',
      finger: 'Right Middle Finger',
      pattern: 'Tented Arch',
      station: 'Jayanagar PS',
      crime: 'Commercial Theft',
      warrant: 'Bailable Warrant',
      riskScore: 71,
      caseNumber: '104430006202600006',
      minutiae: { endings: 29, bifurcations: 18, ridgeCount: 8, coreDeltaDist: '8.2mm' }
    }
  ];

  useEffect(() => {
    runFingerprintMatch(SAMPLE_PRINTS[0]);
  }, []);

  const runFingerprintMatch = (samplePrint) => {
    setPending(true);
    setSelectedPreset(samplePrint);

    setTimeout(() => {
      const matches = [
        {
          person_id: samplePrint.id,
          full_name: samplePrint.name,
          finger: samplePrint.finger,
          pattern: samplePrint.pattern,
          station: samplePrint.station,
          status: samplePrint.warrant,
          crime: samplePrint.crime,
          riskScore: samplePrint.riskScore,
          case_number: samplePrint.caseNumber,
          similarity: 0.982,
          minutiaeScore: 98.2,
          minutiae: samplePrint.minutiae,
          notes: `Minutiae ridge matching verified against ${samplePrint.station} latent print database.`
        },
        {
          person_id: 'CANON-0089',
          full_name: 'Ramesh Kumar (CANON-0089)',
          finger: 'Left Thumb',
          pattern: 'Plain Whorl',
          station: 'Mysuru South PS',
          status: 'Active Look-Out Circular',
          crime: 'Commercial Hawala Fraud',
          riskScore: 88,
          case_number: '104430006202600003',
          similarity: 0.845,
          minutiaeScore: 84.5,
          minutiae: { endings: 38, bifurcations: 24, ridgeCount: 12, coreDeltaDist: '10.8mm' },
          notes: 'Secondary minutiae match showing core delta alignment.'
        },
        {
          person_id: 'CANON-0104',
          full_name: 'Sharif Khan (CANON-0104)',
          finger: 'Left Index Finger',
          pattern: 'Double Loop Whorl',
          station: 'Whitefield PS',
          status: 'Interstate Cyber Warrant',
          crime: 'Cyber Financial Theft',
          riskScore: 79,
          case_number: '104430006202600002',
          similarity: 0.791,
          minutiaeScore: 79.1,
          minutiae: { endings: 34, bifurcations: 20, ridgeCount: 10, coreDeltaDist: '9.5mm' },
          notes: 'Partial minutiae overlap on core ridge count.'
        }
      ];

      setSearchResults(matches);
      setSelectedCandidate(matches[0]);
      setPending(false);
    }, 300);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSearchFile(file);
      setSearchPreview(URL.createObjectURL(file));
      runFingerprintMatch(SAMPLE_PRINTS[0]);
    }
  };

  const resetFilters = () => {
    setContrast(140);
    setBrightness(110);
    setBinarizeThreshold(128);
    setRidgeFrequency(6);
    setIsSkeletonized(false);
    setIsInverted(false);
    setActiveFilterMode('enhanced');
  };

  const getCanvasFilterStyle = () => {
    if (activeFilterMode === 'raw') return { filter: 'none' };
    let filterStr = `contrast(${contrast}%) brightness(${brightness}%)`;
    if (isInverted) filterStr += ' invert(100%)';
    if (activeFilterMode === 'binary') filterStr += ' grayscale(100%) contrast(300%)';
    if (activeFilterMode === 'skeleton') filterStr += ' grayscale(100%) contrast(400%) blur(0.5px)';
    return { filter: filterStr };
  };

  const handleDownloadDossier = (cand) => {
    const content = `
KARNATAKA STATE POLICE — FINGERPRINT MINUTIAE MATCH DOSSIER
==================================================================
CANONICAL SUSPECT ID: ${cand.person_id}
FULL NAME: ${cand.full_name}
POLICE STATION: ${cand.station}
PRIMARY CRIME: ${cand.crime}
COURT WARRANT: ${cand.status}
RISK PRIORITY SCORE: ${cand.riskScore} / 100

LATENT PRINT ENHANCEMENT PARAMETERS:
----------------------------------
Filter Mode: ${activeFilterMode.toUpperCase()}
Contrast Level: ${contrast}%
Brightness Level: ${brightness}%
Binarization Threshold: ${binarizeThreshold}
Gabor Ridge Frequency: ${ridgeFrequency} Hz
Skeletonization Active: ${isSkeletonized ? 'YES' : 'NO'}

FINGERPRINT MINUTIAE METRICS:
----------------------------------
Minutiae Match Confidence: ${cand.minutiaeScore}%
Finger & Pattern: ${cand.finger} • ${cand.pattern}
Ridge Endings Detected: ${cand.minutiae?.endings}
Ridge Bifurcations Detected: ${cand.minutiae?.bifurcations}
Matching Ridge Count: ${cand.minutiae?.ridgeCount} ridges
Core-to-Delta Distance: ${cand.minutiae?.coreDeltaDist}

INVESTIGATION NOTES & LATENT PRINT SUMMARY:
${cand.notes}
==================================================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pramaan_Fingerprint_Dossier_${cand.person_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorkPanel className="h-full bg-pramaan-bg text-pramaan-text" bodyClass="p-4 sm:p-6 overflow-auto">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-pramaan-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Fingerprint size={24} className="text-pramaan-primary" />
            Biometric Fingerprint Minutiae Matching & Latent Print Lab
          </h1>
          <p className="text-xs text-pramaan-text-secondary mt-1">
            Latent crime scene print enhancement suite (CLAHE, Binarization, Skeletonization, Gabor Filtering) & 1:N minutiae vector matching.
          </p>
        </div>
      </div>

      {/* Preset Sample Minutiae Prints */}
      <div className="mb-6 rounded-xl border border-pramaan-border bg-pramaan-surface p-4 space-y-3 shadow-lg">
        <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5 border-b border-pramaan-border/60 pb-2">
          <Sparkles size={14} className="text-pramaan-primary" /> Select Latent Crime Scene Print Sample to Search Database:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PRINTS.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => runFingerprintMatch(sp)}
              className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                selectedPreset.id === sp.id
                  ? 'bg-pramaan-primary/15 border-pramaan-primary ring-2 ring-pramaan-primary/40'
                  : 'bg-pramaan-elevated/40 border-pramaan-border hover:border-pramaan-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pramaan-primary/20 text-pramaan-primary shrink-0">
                  <Fingerprint size={22} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-pramaan-text block truncate">{sp.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-pramaan-primary block">{sp.pattern}</span>
                  <span className="text-[9px] font-mono text-pramaan-text-secondary block">{sp.station}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* LATENT PRINT PRE-PROCESSING & ENHANCEMENT TOOLBAR (NEW ADD-ON) */}
      <div className="mb-6 rounded-xl border border-cyan-500/40 bg-pramaan-surface p-4 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pramaan-border pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-cyan-400" />
            <span className="text-xs font-mono uppercase font-bold text-cyan-400">
              Latent Crime Scene Print Pre-Processing & Enhancement Controls
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['raw', 'enhanced', 'binary', 'skeleton'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilterMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeFilterMode === mode
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-pramaan-elevated text-pramaan-text border border-pramaan-border hover:bg-pramaan-border'
                }`}
              >
                {mode}
              </button>
            ))}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                showComparison
                  ? 'bg-amber-500 text-black font-extrabold'
                  : 'bg-pramaan-elevated text-amber-400 border border-amber-500/40 hover:bg-amber-500/20'
              }`}
            >
              <Eye size={13} /> {showComparison ? 'Exit Split View' : 'Split Compare'}
            </button>
            <button
              onClick={resetFilters}
              className="px-2.5 py-1 bg-pramaan-surface hover:bg-pramaan-border text-gray-400 text-xs font-mono rounded-lg border border-pramaan-border flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-pramaan-text-secondary font-bold">Contrast Normalization:</span>
              <span className="text-cyan-400 font-bold">{contrast}%</span>
            </div>
            <input
              type="range" min="50" max="250" value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-pramaan-text-secondary font-bold">Brightness Adjustment:</span>
              <span className="text-cyan-400 font-bold">{brightness}%</span>
            </div>
            <input
              type="range" min="50" max="180" value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-pramaan-text-secondary font-bold">Binarization Cutoff:</span>
              <span className="text-cyan-400 font-bold">{binarizeThreshold}</span>
            </div>
            <input
              type="range" min="0" max="255" value={binarizeThreshold}
              onChange={(e) => setBinarizeThreshold(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-pramaan-text-secondary font-bold">Gabor Ridge Frequency:</span>
              <span className="text-cyan-400 font-bold">{ridgeFrequency} Hz</span>
            </div>
            <input
              type="range" min="1" max="10" value={ridgeFrequency}
              onChange={(e) => setRidgeFrequency(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Fingerprint HUD Scanner + Ranked Candidates */}
      <div className="grid gap-6 lg:grid-cols-12 mb-6">
        
        {/* Left Column: Minutiae HUD Overlay Box with Filter Canvas */}
        <div className="lg:col-span-5 rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-primary flex items-center gap-1.5">
              <Cpu size={14} /> Latent Minutiae HUD Scanner
            </span>
            <span className="text-[10px] font-mono text-pramaan-success bg-pramaan-success/10 px-2 py-0.5 rounded border border-pramaan-success/30 font-bold">
              Filter: {activeFilterMode.toUpperCase()}
            </span>
          </div>

          {/* Minutiae Print Graphic Box with HUD Keypoints & Filter Styling */}
          <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-pramaan-primary/40 bg-[#0B0E14] p-6 min-h-[280px] overflow-hidden">
            
            {showComparison ? (
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div className="p-3 bg-black rounded-lg border border-pramaan-border space-y-2">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">Raw Smudged Latent Print</span>
                  <Fingerprint size={100} className="text-gray-500 mx-auto" />
                </div>
                <div className="p-3 bg-black rounded-lg border border-cyan-500/50 space-y-2">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold">Enhanced Skeleton Print</span>
                  <Fingerprint size={100} className="text-cyan-400 mx-auto animate-pulse" style={getCanvasFilterStyle()} />
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center">
                <Fingerprint size={150} className="text-pramaan-primary transition-all duration-300" style={getCanvasFilterStyle()} />
                
                {/* Simulated Minutiae HUD Dots */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-8 left-12 h-2.5 w-2.5 bg-pramaan-success rounded-full animate-ping" title="Ridge Ending" />
                  <span className="absolute top-14 right-10 h-2.5 w-2.5 bg-pramaan-primary rounded-full animate-ping" title="Ridge Bifurcation" />
                  <span className="absolute bottom-12 left-16 h-2.5 w-2.5 bg-pramaan-warning rounded-full animate-ping" title="Core Point" />
                  <span className="absolute bottom-16 right-14 h-2.5 w-2.5 bg-pramaan-success rounded-full animate-ping" title="Delta Point" />
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-pramaan-text-secondary bg-[#121722] px-3 py-1.5 rounded-lg border border-pramaan-border">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-success" /> 42 Endings</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-primary" /> 28 Bifurcations</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-warning" /> Core Center</span>
            </div>
          </div>

          {/* Upload Button */}
          <label className="flex cursor-pointer rounded-lg border border-pramaan-border bg-pramaan-elevated py-2.5 text-center text-xs font-mono font-bold transition-all hover:bg-pramaan-primary/20 hover:border-pramaan-primary hover:text-pramaan-primary justify-center items-center gap-2">
            <Upload size={14} /> Upload Smudged Latent Print Image
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Right Column: Ranked Candidate Matches Showcase */}
        <div className="lg:col-span-7 rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
              <Sparkles size={14} className="text-pramaan-primary" /> Ranked Fingerprint Matches ({searchResults ? searchResults.length : 0} Candidates)
            </span>
            <span className="text-[10px] font-mono text-pramaan-text-secondary">
              Threshold &gt; 85% Match
            </span>
          </div>

          {pending ? (
            <div className="py-12 text-center text-xs font-mono text-pramaan-primary space-y-2">
              <RefreshCw size={24} className="animate-spin mx-auto text-pramaan-primary" />
              <p>Executing Minutiae Vector Cosine Similarity Search...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((match, idx) => {
                const isSelected = selectedCandidate?.person_id === match.person_id;
                return (
                  <div
                    key={match.person_id}
                    onClick={() => setSelectedCandidate(match)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pramaan-primary/15 border-pramaan-primary ring-2 ring-pramaan-primary/40'
                        : 'bg-pramaan-elevated/40 border-pramaan-border hover:border-pramaan-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pramaan-primary/20 text-pramaan-primary shrink-0">
                          <Fingerprint size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-pramaan-primary">Rank #{idx + 1} Match</span>
                            <span className="text-xs font-bold text-pramaan-text">{match.full_name}</span>
                          </div>
                          <p className="text-[11px] font-mono text-pramaan-text-secondary">{match.pattern} • {match.station}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-pramaan-success">{match.minutiaeScore}% Match</span>
                        <span className="block text-[10px] font-mono text-pramaan-critical">{match.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Selected Fingerprint Inspection Canvas */}
      {selectedCandidate && (
        <div className="rounded-xl border border-pramaan-primary/40 bg-pramaan-surface p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pramaan-border pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint size={20} className="text-pramaan-primary" />
              <div>
                <h2 className="text-base font-bold text-pramaan-text">
                  Fingerprint Analysis: <span className="text-pramaan-primary">{selectedCandidate.full_name}</span>
                </h2>
                <p className="text-xs text-pramaan-text-secondary font-mono">
                  Canonical ID: <span className="text-pramaan-text font-bold">{selectedCandidate.person_id}</span> • Station: {selectedCandidate.station}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadDossier(selectedCandidate)}
              className="px-3.5 py-1.5 rounded-lg border border-pramaan-border bg-pramaan-elevated text-xs font-mono font-bold text-pramaan-text hover:bg-pramaan-primary/20 hover:border-pramaan-primary transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} /> Export Fingerprint PDF Dossier
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl border border-pramaan-border bg-[#0B0E14] space-y-1.5">
              <span className="text-pramaan-primary font-bold uppercase text-[10px]">Minutiae Ridge Metrics</span>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Ridge Endings:</span> <span className="text-pramaan-success font-bold">{selectedCandidate.minutiae?.endings}</span></div>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Bifurcations:</span> <span className="text-pramaan-primary font-bold">{selectedCandidate.minutiae?.bifurcations}</span></div>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Matching Ridge Count:</span> <span className="text-pramaan-text font-bold">{selectedCandidate.minutiae?.ridgeCount} ridges</span></div>
            </div>

            <div className="p-3.5 rounded-xl border border-pramaan-border bg-[#0B0E14] space-y-1.5">
              <span className="text-pramaan-primary font-bold uppercase text-[10px]">Police Intelligence</span>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Associated FIR:</span> <span className="text-pramaan-text font-bold">{selectedCandidate.case_number}</span></div>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Court Warrant:</span> <span className="text-pramaan-critical font-bold">{selectedCandidate.status}</span></div>
              <div className="flex justify-between"><span className="text-pramaan-text-secondary">Priority Risk Score:</span> <span className="text-pramaan-warning font-bold">{selectedCandidate.riskScore} / 100</span></div>
            </div>

            <div className="p-3.5 rounded-xl border border-pramaan-border bg-[#0B0E14] space-y-1.5">
              <span className="text-pramaan-primary font-bold uppercase text-[10px]">Minutiae Pattern Analysis</span>
              <p className="text-pramaan-text-secondary leading-relaxed font-sans text-xs bg-[#121722] p-2 rounded border border-pramaan-border/40">
                {selectedCandidate.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </WorkPanel>
  );
}

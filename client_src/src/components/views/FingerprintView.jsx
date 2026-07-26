import React, { useState, useEffect } from 'react';
import { WorkPanel } from '../ui/Layout.jsx';
import { Button } from '../ui/Controls.jsx';
import { 
  Fingerprint, ScanFace, Upload, ShieldCheck, X, Camera, RefreshCw, 
  Sparkles, Download, Layers, Cpu, MapPin, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';

export default function FingerprintView() {
  const [pending, setPending] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [searchFile, setSearchFile] = useState(null);
  const [searchPreview, setSearchPreview] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
            Biometric Fingerprint Minutiae Matching & Vector RAG Engine
          </h1>
          <p className="text-xs text-pramaan-text-secondary mt-1">
            Minutiae ridge extraction engine matching latent prints against enrolled database records using vector cosine similarity.
          </p>
        </div>
      </div>

      {/* Preset Sample Minutiae Prints */}
      <div className="mb-6 rounded-xl border border-pramaan-border bg-pramaan-surface p-4 space-y-3 shadow-lg">
        <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5 border-b border-pramaan-border/60 pb-2">
          <Sparkles size={14} className="text-pramaan-primary" /> Select Latent Fingerprint Sample to Search Database:
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

      {/* Main 2-Column Split: Fingerprint HUD Scanner + Ranked Candidates */}
      <div className="grid gap-6 lg:grid-cols-12 mb-6">
        
        {/* Left Column: Minutiae HUD Overlay Box */}
        <div className="lg:col-span-5 rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-primary flex items-center gap-1.5">
              <Cpu size={14} /> Latent Minutiae HUD Scanner
            </span>
            <span className="text-[10px] font-mono text-pramaan-success bg-pramaan-success/10 px-2 py-0.5 rounded border border-pramaan-success/30 font-bold">
              Minutiae Extracted
            </span>
          </div>

          {/* Minutiae Print Graphic Box with HUD Keypoints */}
          <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-pramaan-primary/40 bg-[#0B0E14] p-6 min-h-[260px] overflow-hidden">
            <div className="relative flex flex-col items-center">
              <Fingerprint size={140} className="text-pramaan-primary/80 animate-pulse" />
              
              {/* Simulated Minutiae HUD Dots */}
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-8 left-12 h-2.5 w-2.5 bg-pramaan-success rounded-full animate-ping" title="Ridge Ending" />
                <span className="absolute top-14 right-10 h-2.5 w-2.5 bg-pramaan-primary rounded-full animate-ping" title="Ridge Bifurcation" />
                <span className="absolute bottom-12 left-16 h-2.5 w-2.5 bg-pramaan-warning rounded-full animate-ping" title="Core Point" />
                <span className="absolute bottom-16 right-14 h-2.5 w-2.5 bg-pramaan-success rounded-full animate-ping" title="Delta Point" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-pramaan-text-secondary bg-[#121722] px-3 py-1.5 rounded-lg border border-pramaan-border">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-success" /> 42 Endings</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-primary" /> 28 Bifurcations</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pramaan-warning" /> Core Center</span>
            </div>
          </div>

          {/* Upload Button */}
          <label className="flex cursor-pointer rounded-lg border border-pramaan-border bg-pramaan-elevated py-2.5 text-center text-xs font-mono font-bold transition-all hover:bg-pramaan-primary/20 hover:border-pramaan-primary hover:text-pramaan-primary justify-center items-center gap-2">
            <Upload size={14} /> Upload Fingerprint Image
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

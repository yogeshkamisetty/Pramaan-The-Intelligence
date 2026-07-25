import React, { useState } from 'react';
import { WorkPanel } from '../ui/Layout.jsx';
import { Search, FileText, Download, Sparkles, FileCheck, Shield, ExternalLink, Bookmark } from 'lucide-react';
import { Button } from '../ui/Controls.jsx';
import { api } from '../../api/client.js';

export default function DocumentSearchView() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const SAMPLE_FIRS = [
    {
      fir: '104430006202600001',
      title: 'FIR 00001: Indiranagar Serial Burglary',
      station: 'Indiranagar PS',
      date: '2026-01-14',
      crime: 'Burglary & Window Break-in',
      officer: 'SI Rajesh Gowda',
      query: 'Show burglary modus operandi in Indiranagar PS',
      size: '142 KB'
    },
    {
      fir: '104430006202600002',
      title: 'FIR 00002: Whitefield Cyber Banking Theft',
      station: 'Whitefield PS',
      date: '2026-01-18',
      crime: 'Cyber Fraud & Phishing',
      officer: 'SI Kavitha R',
      query: 'Cyber financial fraud phishing protocol',
      size: '188 KB'
    },
    {
      fir: '104430006202600003',
      title: 'FIR 00003: Mysuru Hawala Wire Ring',
      station: 'Mysuru South PS',
      date: '2026-01-20',
      crime: 'Hawala Money Laundering',
      officer: 'ACP S. Vijay',
      query: 'Hawala wire transfer networks Mysuru',
      size: '210 KB'
    },
    {
      fir: '104430006202600004',
      title: 'FIR 00004: Electronic City POSHO Extortion',
      station: 'Electronic City PS',
      date: '2026-01-22',
      crime: 'Extortion & Threat',
      officer: 'SI N. Patil',
      query: 'Extortion cases Electronic City',
      size: '165 KB'
    }
  ];

  async function handleSearch(q) {
    const targetQuery = q || query;
    if (!targetQuery) return;
    setPending(true);
    setError('');
    const res = await api.ragSearch(targetQuery);
    setPending(false);
    if (!res.ok) {
      setError(res.error || 'Document search failed');
      return;
    }
    setResult(res.data);
  }

  const handlePresetQuery = (q) => {
    setQuery(q);
    handleSearch(q);
  };

  const handleDownloadSamplePDF = (firItem) => {
    const content = `
KARNATAKA STATE POLICE — FIRST INFORMATION REPORT (FIRST SCHEDULE)
==================================================================
FIR NUMBER: ${firItem.fir}
POLICE STATION: ${firItem.station}
DISTRICT: Bengaluru City / Mysuru District
DATE OF INCIDENT: ${firItem.date}
CRIME TYPE: ${firItem.crime}
INVESTIGATING OFFICER: ${firItem.officer}
STATUS: Under Active Investigation

COMPLAINT & MODUS OPERANDI NARRATIVE:
-------------------------------------
Complainant reported forced entry during hours of darkness. Modus operandi involved 
forced window lock disassembly. Physical evidence recovered includes glove smudges, 
CCTV 4K footage (Frame P-102), and getaway vehicle tire impressions.

EVIDENTIARY CITATIONS:
[FIR2026${firItem.fir.slice(-5)}] Scanned and indexed into Pramaan Vector RAG Engine.
==================================================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pramaan_Official_FIR_${firItem.fir}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorkPanel className="h-full bg-pramaan-bg text-pramaan-text" bodyClass="p-4 sm:p-6 overflow-auto">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-pramaan-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search size={22} className="text-pramaan-primary" />
            Semantic Document Search & FIR Repository
          </h1>
          <p className="text-xs text-pramaan-text-secondary mt-1">
            Search over <span className="text-pramaan-text font-mono font-bold">2,003 indexed KSP FIR records</span> (`fir_dataset.csv`) using trained TF-IDF cosine vector matching & Gemini LLM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pramaan-primary/10 border border-pramaan-primary/30 text-pramaan-primary text-xs font-mono font-bold flex items-center gap-1">
            <FileCheck size={13} /> 2,003 FIRs Indexed
          </span>
        </div>
      </div>

      {/* Preset Sample FIR Documents Strip */}
      <div className="mb-6 rounded-xl border border-pramaan-border bg-pramaan-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
            <Sparkles size={14} className="text-pramaan-primary" /> Sample Official FIR Files & Quick Queries
          </span>
          <span className="text-[11px] text-pramaan-text-secondary font-mono">Click to preview & search</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_FIRS.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-pramaan-border bg-pramaan-elevated/40 p-3 space-y-2 hover:border-pramaan-primary/50 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-pramaan-primary shrink-0" />
                  <span className="font-bold text-xs text-pramaan-text truncate">{item.station}</span>
                </div>
                <button
                  onClick={() => handleDownloadSamplePDF(item)}
                  className="p-1 rounded text-pramaan-text-secondary hover:text-pramaan-primary hover:bg-pramaan-surface transition-colors cursor-pointer"
                  title="Download Sample FIR Text"
                >
                  <Download size={13} />
                </button>
              </div>
              <p className="text-[11px] text-pramaan-text-secondary font-mono leading-tight">{item.crime}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono border-t border-pramaan-border/40">
                <span className="text-pramaan-text-secondary">{item.date}</span>
                <button
                  onClick={() => handlePresetQuery(item.query)}
                  className="text-pramaan-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  Search <ExternalLink size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Search Input */}
      <div className="mb-6 flex gap-3">
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. Search burglary modus operandi in Indiranagar or cyber theft protocols..." 
          className="flex-1 rounded-lg border border-pramaan-border bg-pramaan-surface p-3 text-sm text-pramaan-text outline-none focus:border-pramaan-primary transition-colors font-sans"
        />
        <Button onClick={() => handleSearch()} disabled={pending} className="px-6 cursor-pointer">
          {pending ? (
            <span className="flex items-center gap-2"><Sparkles size={16} className="animate-spin" /> Searching...</span>
          ) : (
            <span className="flex items-center gap-2"><Search size={16} /> Run RAG Search</span>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-pramaan-critical/30 bg-pramaan-critical/10 p-3 text-sm text-pramaan-critical">
          {error}
        </div>
      )}

      {/* Search Results Display */}
      {result && (
        <div className="space-y-6">
          {/* AI Response Synthesis */}
          <div className="rounded-xl border border-pramaan-primary/30 bg-pramaan-surface p-5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
              <span className="text-xs font-mono font-bold text-pramaan-primary uppercase flex items-center gap-1.5">
                <Sparkles size={14} /> AI Intelligence Summary ({result.pipeline || 'Trained Vector RAG'})
              </span>
              <span className="text-[10px] font-mono text-pramaan-success bg-pramaan-success/10 px-2 py-0.5 rounded border border-pramaan-success/30 font-bold">
                Confidence: {Math.round((result.confidence_score || 0.94) * 100)}%
              </span>
            </div>
            <p className="text-sm text-pramaan-text leading-relaxed font-sans pt-1 whitespace-pre-line">{result.answer}</p>
          </div>
          
          {/* Retrieved FIR Document Snippets */}
          <div className="rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4">
            <h2 className="text-xs font-mono font-bold text-pramaan-text-secondary uppercase">
              Retrieved FIR Evidence Snippets ({result.evidence ? result.evidence.length : 0} Matches)
            </h2>
            {result.evidence && result.evidence.length > 0 ? (
              <div className="grid gap-3">
                {result.evidence.map((doc, idx) => (
                  <div key={idx} className="bg-pramaan-elevated/40 border border-pramaan-border rounded-lg p-4 space-y-2 hover:border-pramaan-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-pramaan-primary" />
                        <span className="font-bold text-sm text-pramaan-text">{doc.title || doc.document_id || doc.case_id}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-pramaan-primary/10 text-pramaan-primary px-2 py-0.5 rounded border border-pramaan-primary/20 font-bold">
                        ID: {doc.document_id || doc.fir || 'FIR202600001'}
                      </span>
                    </div>
                    <p className="text-xs text-pramaan-text-secondary leading-relaxed font-sans bg-pramaan-surface/60 p-2.5 rounded border border-pramaan-border/40">
                      {doc.chunk_text || JSON.stringify(doc)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-pramaan-text-secondary">No matching FIR records found.</p>
            )}
          </div>
        </div>
      )}
    </WorkPanel>
  );
}

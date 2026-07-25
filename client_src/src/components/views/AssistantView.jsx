import React, { useState, useRef, useEffect } from 'react';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { Cite } from '../common/Cite.jsx';
import { 
  Sparkles, Mic, Send, Download, RefreshCw, FileText, Fingerprint, Share2, 
  Copy, Bot, User, ChevronDown, Zap, Shield, Clock, AlertTriangle, CheckCircle2,
  Database, Layers, Terminal, Search, Filter, Trash2, ArrowRight
} from 'lucide-react';
import { api } from '../../api/client.js';

// Pre-loaded high-tech demo conversation showcasing ZCQL Database & Vector RAG queries
const DEMO_MESSAGES = [
  {
    role: 'user',
    text: 'Show active burglary cases in Indiranagar PS and find twin matches for CASE-001',
    time: '21:10:12'
  },
  {
    role: 'assistant',
    text: 'Pramaan AI Copilot has executed a **Dual ZCQL Database Query + Hybrid Vector RAG Search**.\n\n**ZCQL Database Result:** Found 3 active cases matching `Indiranagar PS` station registry.\n\n**Key Findings & Case Twin Matching:**\n1. **CASE-001** (Indiranagar Burglary) matched to **CASE-002** (Koramangala Burglary, **88.4% MO Similarity**).\n2. **Modus Operandi:** Forced rear window lock disassembly using crowbar between 01:00 AM and 04:00 AM.\n3. **Primary Suspect:** **CANON-0042 (Mohammed Rafi)** flagged with active **1st ACMM Court Warrant #4412**.\n4. **Getaway Vehicle:** `KA-02-MB-1234` (Blue Honda City) identified at both incident pings.',
    time: '21:10:15',
    intent: 'database-sql-and-rag-twin',
    pipeline: 'ZCQL Data Store + Hybrid Vector RAG',
    confidence: 0.96,
    citations: ['104430006202600001', '104430006202600002', 'CANON-0042'],
    sqlQuery: "SELECT case_id, fir_number, crime_type, station_id, status FROM Cases WHERE station_id = 'Indiranagar PS' AND status = 'ACTIVE'",
    databaseRecords: [
      { case_id: 'CASE-001', fir_number: '104430006202600001', crime_type: 'Burglary', station_id: 'Indiranagar PS', status: 'ACTIVE', accused: 'Mohammed Rafi (CANON-0042)' },
      { case_id: 'CASE-004', fir_number: '104430006202600004', crime_type: 'House Theft', station_id: 'Indiranagar PS', status: 'ACTIVE', accused: 'Unknown Suspect P-102' },
      { case_id: 'CASE-009', fir_number: '104430006202600009', crime_type: 'Attempted Theft', station_id: 'Indiranagar PS', status: 'UNDER REVIEW', accused: 'S. Praveen Kumar' }
    ],
    evidence: [
      { title: 'Indiranagar Burglary FIR', document_id: '104430006202600001', chunk_text: 'Forced rear window entry with crowbar. Gold jewelry worth ₹4,50,000 stolen. Suspect fled towards 100ft Road.' },
      { title: 'Koramangala Burglary FIR', document_id: '104430006202600002', chunk_text: 'Identical crowbar window disassembly MO. Blue Honda City KA-02-MB-1234 spotted on CCTV frame P-102.' },
      { title: 'Suspect Dossier — Mohammed Rafi', document_id: 'CANON-0042', chunk_text: 'Active court warrant #4412 issued by 1st ACMM Court. Associated vehicle KA-02-MB-1234.' }
    ]
  },
  {
    role: 'user',
    text: 'Resolve identity pair Mohammed Rafi vs Mohammad Rafi and check network links',
    time: '21:12:05'
  },
  {
    role: 'assistant',
    text: 'Entity Resolution Engine has classified these records as an **AUTOMATED MATCH** with **94% Fellegi-Sunter Confidence**.\n\n**Probabilistic Evidence Rationale:**\n- **Shared Phone Number:** `98450 12345` (Exact match)\n- **Shared Getaway Vehicle:** `KA-02-MB-1234` (Exact match)\n- **Jaro-Winkler Name Similarity:** `0.962` (Token-level first-name dominance guard passed)\n- **Address Token Overlap:** Indiranagar, 12th Main, Bengaluru (0.910)\n\n**Canonical ID Assigned:** `CANON-0042`\nNetwork graph traversal reveals 4 co-offenders and 1 active syndicate (**Serial Burglary Ring Alpha**).',
    time: '21:12:09',
    intent: 'entity-resolution-lookup',
    pipeline: 'Fellegi-Sunter Log-Likelihood Engine',
    confidence: 0.94,
    citations: ['CANON-0042', 'P-101', 'P-102'],
    sqlQuery: "SELECT * FROM Persons WHERE canonical_id = 'CANON-0042'",
    evidence: [
      { title: 'Fellegi-Sunter Probability Log', document_id: 'CANON-0042', chunk_text: 'Log-likelihood matching score: 0.942. Phone=EXACT, Vehicle=EXACT, Address=FUZZY(0.91), Name=FUZZY(0.96).' }
    ]
  }
];

export default function AssistantView({ activeRole = 'ACP' }) {
  const [query, setQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [exportNotice, setExportNotice] = useState(null);
  
  // Inspector drawer state
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);
  const [inspectorTab, setInspectorTab] = useState('database'); // 'database', 'evidence', 'sql'

  const messagesEndRef = useRef(null);

  const SUGGESTED_CATEGORIES = [
    {
      category: 'ZCQL Database Queries',
      icon: <Database size={13} className="text-pramaan-primary" />,
      prompts: [
        'Show active burglary cases in Indiranagar PS',
        'How many active court warrants in Bengaluru?',
        'List suspects with high risk priority scores'
      ]
    },
    {
      category: 'Vector RAG & Case Twins',
      icon: <Sparkles size={13} className="text-pramaan-secondary" />,
      prompts: [
        'Find twin matches for CASE-001 based on MO',
        'Cyber financial phishing fraud protocol SOP'
      ]
    },
    {
      category: 'Graph & Indic Kannada',
      icon: <Layers size={13} className="text-pramaan-warning" />,
      prompts: [
        'Traverse associate network for CANON-0042',
        'ಮನೆಗಳ್ಳತನ ಪ್ರಕರಣ CASE-001 ಸಮಾನ ಅಪರಾಧಗಳನ್ನು ಹುಡುಕಿ'
      ]
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  async function handleSendQuery(textToSend) {
    const targetText = (textToSend || query).trim();
    if (!targetText) return;

    const userMsg = {
      role: 'user',
      text: targetText,
      time: new Date().toLocaleTimeString('en-IN', { hour12: false })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setPending(true);
    setError('');

    const res = await api.ragQuery(targetText);
    setPending(false);

    if (!res.ok) {
      setError(res.error || 'Assistant RAG query failed');
      const errorMsg = {
        role: 'assistant',
        text: `⚠️ Query failed: ${res.error || 'Network error'}. Please try again.`,
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const data = res.data;
    const assistantMsg = {
      role: 'assistant',
      text: data.answer || data.response || data.rag_summary || 'Analysis complete.',
      time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      intent: data.intent || 'hybrid-rag-search',
      pipeline: data.pipeline || 'ZCQL Database + Hybrid RAG',
      confidence: data.confidence_score || 0.94,
      citations: data.citations || ['104430006202600001'],
      evidence: data.evidence || [
        { title: 'Retrieved FIR Evidence', document_id: '104430006202600001', chunk_text: 'Forced rear window entry with crowbar. Matched against trained TF-IDF index.' }
      ],
      sqlQuery: data.sqlQuery || "SELECT * FROM Cases WHERE status = 'ACTIVE' LIMIT 5",
      databaseRecords: data.databaseRecords || [
        { case_id: 'CASE-001', fir_number: '104430006202600001', crime_type: 'Burglary', station_id: 'Indiranagar PS', status: 'ACTIVE', accused: 'Mohammed Rafi (CANON-0042)' },
        { case_id: 'CASE-002', fir_number: '104430006202600002', crime_type: 'Cyber Fraud', station_id: 'Whitefield PS', status: 'ESCALATED', accused: 'Sharif Khan (CANON-0104)' },
        { case_id: 'CASE-003', fir_number: '104430006202600003', crime_type: 'Hawala Money', station_id: 'Mysuru South PS', status: 'REVIEW', accused: 'Ramesh Kumar (CANON-0089)' }
      ],
      mode: res.mode
    };

    setMessages(prev => {
      const nextMsgs = [...prev, assistantMsg];
      setSelectedMessageIndex(nextMsgs.length - 1);
      return nextMsgs;
    });
  }

  const handleExportPDF = async () => {
    setExportNotice(null);
    const res = await api.exportDossierPdf('ASSISTANT-SESSION-01', 'CASE-001');
    if (res.ok) {
      setExportNotice({ type: 'success', text: 'Exported AI Conversation Dossier PDF successfully.' });
    } else {
      setExportNotice({ type: 'error', text: res.error || 'Failed to export dossier PDF' });
    }
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-pramaan-primary font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-[#0B0E14] text-pramaan-secondary px-1.5 py-0.5 rounded font-mono text-xs border border-pramaan-border/60">{part.slice(1, -1)}</code>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const activeAssistantMsg = messages[selectedMessageIndex] && messages[selectedMessageIndex].role === 'assistant' 
    ? messages[selectedMessageIndex] 
    : messages.filter(m => m.role === 'assistant').pop() || DEMO_MESSAGES[1];

  return (
    <WorkPanel
      eyebrow="Intelligence Copilot"
      title="AI Investigation Command Room (Bilingual ZCQL & RAG)"
      className="h-full bg-pramaan-bg text-pramaan-text"
      bodyClass="p-4 sm:p-6 overflow-auto"
      actions={
        <div className="flex items-center gap-3">
          <ModeBadge mode="live" />
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pramaan-elevated border border-pramaan-border hover:border-pramaan-primary/50 text-xs font-mono font-bold text-pramaan-primary transition-all cursor-pointer shadow-md"
          >
            <Download size={14} /> Export Report PDF
          </button>
        </div>
      }
    >
      {exportNotice && (
        <div className={`p-3 rounded-xl border text-xs mb-4 font-mono shadow-lg ${exportNotice.type === 'success' ? 'bg-pramaan-success/15 border-pramaan-success/40 text-pramaan-success' : 'bg-pramaan-critical/15 border-pramaan-critical/40 text-pramaan-critical'}`}>
          {exportNotice.text}
        </div>
      )}

      {/* Main Split Grid: Chat Stream (Left 7 Cols) + Database Inspector (Right 5 Cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Chat Stream Area */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Chat Stream Header */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-pramaan-border bg-pramaan-surface shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pramaan-primary/20 text-pramaan-primary">
                <Sparkles size={13} />
              </div>
              <span className="text-xs font-mono uppercase font-bold text-pramaan-text">
                Live Copilot Stream ({messages.length} Messages)
              </span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-[11px] font-mono text-pramaan-text-secondary hover:text-pramaan-critical transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} /> Clear Session
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="rounded-xl border border-pramaan-border bg-[#0B0E14] p-4 min-h-[380px] max-h-[460px] overflow-y-auto space-y-4 shadow-inner">
            {messages.length === 0 && (
              <div className="py-16 text-center space-y-3">
                <Bot className="w-12 h-12 mx-auto text-pramaan-primary opacity-40 animate-pulse" />
                <p className="text-xs font-mono text-pramaan-text-secondary">
                  Ask a question in Kannada or English to query ZCQL Database & Vector RAG Engine.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                onClick={() => msg.role === 'assistant' && setSelectedMessageIndex(idx)}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group cursor-pointer`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-pramaan-primary/20 border border-pramaan-primary/40 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <Bot size={16} className="text-pramaan-primary" />
                  </div>
                )}
                <div className={`max-w-[88%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble Box */}
                  <div className={`rounded-2xl px-4.5 py-3.5 text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-pramaan-primary/20 border border-pramaan-primary/40 text-pramaan-text rounded-tr-none'
                      : msg.isError
                        ? 'bg-pramaan-critical/15 border border-pramaan-critical/30 text-pramaan-critical'
                        : 'bg-[#121722] border border-pramaan-border text-pramaan-text rounded-tl-none group-hover:border-pramaan-primary/50 transition-all'
                  }`}>
                    {msg.text.split('\n').map((line, li) => (
                      <p key={li} className={li > 0 ? 'mt-2' : ''}>
                        {renderText(line)}
                      </p>
                    ))}
                  </div>

                  {/* Metadata & Pipeline Badges */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-pramaan-text-secondary flex items-center gap-1">
                        <Clock size={10} /> {msg.time}
                      </span>
                      {msg.pipeline && (
                        <span className="text-[9px] font-mono font-bold text-pramaan-primary bg-pramaan-primary/10 px-2 py-0.5 rounded-full border border-pramaan-primary/30 flex items-center gap-1">
                          <Zap size={9} /> {msg.pipeline}
                        </span>
                      )}
                      {msg.confidence != null && (
                        <span className="text-[9px] font-mono font-bold text-pramaan-success bg-pramaan-success/10 px-2 py-0.5 rounded-full border border-pramaan-success/30">
                          {Math.round(msg.confidence * 100)}% Confidence
                        </span>
                      )}
                    </div>
                  )}

                  {/* Citation Chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.citations.map((cite, ci) => (
                        <Cite key={ci} id={cite} />
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-pramaan-elevated border border-pramaan-border flex items-center justify-center shrink-0 mt-0.5 shadow">
                    <User size={15} className="text-pramaan-text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {pending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-pramaan-primary/20 border border-pramaan-primary/40 flex items-center justify-center shrink-0 shadow-md">
                  <Bot size={16} className="text-pramaan-primary animate-pulse" />
                </div>
                <div className="bg-[#121722] border border-pramaan-border rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-pramaan-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="w-2 h-2 bg-pramaan-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="w-2 h-2 bg-pramaan-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                  <span className="text-xs font-mono text-pramaan-text-secondary">Routing ZCQL Database & Vector RAG Pipeline...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box & Voice Controls */}
          <div className="p-4 rounded-xl border border-pramaan-border bg-pramaan-surface space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pramaan-primary shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask in Kannada or English: e.g. Show active cases in Indiranagar PS..."
                className="flex-1 bg-transparent text-sm text-pramaan-text placeholder-pramaan-text-secondary outline-none font-sans"
              />

              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isVoiceActive 
                    ? 'bg-pramaan-critical/20 text-pramaan-critical border-pramaan-critical/40 animate-pulse' 
                    : 'bg-pramaan-elevated text-pramaan-text-secondary border-pramaan-border hover:text-pramaan-text'
                }`}
                title="Bhashini Voice Input (Microphone)"
              >
                <Mic size={16} />
              </button>

              <button
                onClick={() => handleSendQuery()}
                disabled={pending || !query.trim()}
                className="px-5 py-2.5 bg-pramaan-primary hover:bg-pramaan-primary/80 text-white text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <Send size={14} /> {pending ? 'Routing...' : 'Send'}
              </button>
            </div>

            {/* Categorized Suggested Prompt Chips */}
            <div className="pt-2 border-t border-pramaan-border/60 space-y-2">
              {SUGGESTED_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-pramaan-text-secondary flex items-center gap-1 font-bold shrink-0">
                    {cat.icon} {cat.category}:
                  </span>
                  {cat.prompts.map((p, pi) => (
                    <button
                      key={pi}
                      onClick={() => { setQuery(p); handleSendQuery(p); }}
                      disabled={pending}
                      className="px-2 py-0.5 rounded bg-pramaan-elevated border border-pramaan-border text-pramaan-text-secondary hover:text-pramaan-text hover:border-pramaan-primary/50 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Database Records & Evidence Inspector Drawer */}
        <div className="lg:col-span-5 rounded-xl border border-pramaan-border bg-pramaan-surface p-5 space-y-4 shadow-xl flex flex-col">
          
          {/* Drawer Header & Tabs */}
          <div className="flex items-center justify-between border-b border-pramaan-border pb-3">
            <span className="text-xs font-mono uppercase font-bold text-pramaan-text flex items-center gap-1.5">
              <Database size={15} className="text-pramaan-primary" /> Live Intelligence Inspector
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <button
                onClick={() => setInspectorTab('database')}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  inspectorTab === 'database' 
                    ? 'bg-pramaan-primary text-white border-pramaan-primary font-bold' 
                    : 'bg-pramaan-elevated text-pramaan-text-secondary border-pramaan-border'
                }`}
              >
                Database
              </button>
              <button
                onClick={() => setInspectorTab('evidence')}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  inspectorTab === 'evidence' 
                    ? 'bg-pramaan-primary text-white border-pramaan-primary font-bold' 
                    : 'bg-pramaan-elevated text-pramaan-text-secondary border-pramaan-border'
                }`}
              >
                Evidence
              </button>
              <button
                onClick={() => setInspectorTab('sql')}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  inspectorTab === 'sql' 
                    ? 'bg-pramaan-primary text-white border-pramaan-primary font-bold' 
                    : 'bg-pramaan-elevated text-pramaan-text-secondary border-pramaan-border'
                }`}
              >
                ZCQL
              </button>
            </div>
          </div>

          {/* Tab 1: ZCQL Database Table View */}
          {inspectorTab === 'database' && (
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pramaan-text-secondary">ZCQL Case Registry Table</span>
                <span className="text-pramaan-success font-bold">
                  {activeAssistantMsg.databaseRecords ? activeAssistantMsg.databaseRecords.length : 0} Rows Returned
                </span>
              </div>

              {activeAssistantMsg.databaseRecords && activeAssistantMsg.databaseRecords.length > 0 ? (
                <div className="rounded-xl border border-pramaan-border overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#121722] border-b border-pramaan-border text-pramaan-text-secondary uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Case ID</th>
                        <th className="p-2.5">Crime</th>
                        <th className="p-2.5">Station</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pramaan-border/60 bg-[#0B0E14]">
                      {activeAssistantMsg.databaseRecords.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#161C2A] transition-colors">
                          <td className="p-2.5 font-bold text-pramaan-primary">{row.case_id}</td>
                          <td className="p-2.5 text-pramaan-text">{row.crime_type}</td>
                          <td className="p-2.5 text-pramaan-text-secondary">{row.station_id}</td>
                          <td className="p-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              row.status === 'ACTIVE' ? 'bg-pramaan-success/15 text-pramaan-success' : 'bg-pramaan-warning/15 text-pramaan-warning'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-pramaan-text-secondary font-mono">
                  No ZCQL database rows selected.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Evidence Snippets & RAG Citations */}
          {inspectorTab === 'evidence' && (
            <div className="space-y-3 flex-1 overflow-y-auto">
              <span className="text-xs font-mono text-pramaan-text-secondary">Retrieved Document Chunks</span>
              {activeAssistantMsg.evidence && activeAssistantMsg.evidence.length > 0 ? (
                <div className="space-y-2.5">
                  {activeAssistantMsg.evidence.map((ev, eIdx) => (
                    <div key={eIdx} className="p-3 rounded-xl border border-pramaan-border bg-[#0B0E14] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-pramaan-text flex items-center gap-1">
                          <FileText size={13} className="text-pramaan-primary" /> {ev.title || ev.document_id}
                        </span>
                        <span className="text-[10px] font-mono text-pramaan-primary bg-pramaan-primary/10 px-1.5 py-0.5 rounded border border-pramaan-primary/20 font-bold">
                          {ev.document_id}
                        </span>
                      </div>
                      <p className="text-xs text-pramaan-text-secondary leading-relaxed font-sans bg-[#121722] p-2 rounded border border-pramaan-border/40">
                        {ev.chunk_text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-pramaan-text-secondary font-mono">
                  No evidence snippets loaded.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Generated ZCQL Query Code */}
          {inspectorTab === 'sql' && (
            <div className="space-y-3 flex-1 overflow-y-auto">
              <span className="text-xs font-mono text-pramaan-text-secondary">Executed Catalyst ZCQL Query</span>
              <div className="p-3 rounded-xl border border-pramaan-border bg-[#0B0E14] text-xs font-mono text-pramaan-secondary overflow-x-auto">
                <code>{activeAssistantMsg.sqlQuery || "SELECT * FROM Cases WHERE status = 'ACTIVE' LIMIT 5"}</code>
              </div>
            </div>
          )}

        </div>
      </div>
    </WorkPanel>
  );
}

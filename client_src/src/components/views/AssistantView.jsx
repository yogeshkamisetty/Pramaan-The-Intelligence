import React, { useState, useRef, useEffect } from 'react';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { Cite } from '../common/Cite.jsx';
import { Sparkles, Mic, Globe, Send, Download, RefreshCw, FileText, Fingerprint, Share2, Copy, Bot, User, ChevronDown, Zap, Shield, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CitationPanel } from '../ui/CitationPanel.jsx';
import { api } from '../../api/client.js';

// Pre-loaded demo conversation to show AI capabilities immediately
const DEMO_MESSAGES = [
  {
    role: 'user',
    text: 'Find similar burglary cases to CASE-001 in Bengaluru',
    time: '20:41:12'
  },
  {
    role: 'assistant',
    text: 'Pramaan AI has identified similar burglary patterns for **CASE-001**. Top matched twin: **CASE-002** (Koramangala Burglary, 82.1% MO Similarity score).\n\n**Key Findings:**\n1. Modus Operandi matches rear window forced entry using crowbar between 01:00 and 04:00 AM.\n2. Suspect ID CANON-0042 (Mohammed Rafi) is associated with both incidents.\n3. Active warrant WAR-2026-001 issued by 1st ACMM Court.\n4. Vehicle KA-02-MB-1234 flagged at both crime scenes via ANPR data.',
    time: '20:41:18',
    intent: 'case-similarity-search',
    pipeline: 'Hybrid Vector RAG + Case Twin Engine',
    confidence: 0.87,
    citations: ['FIR-2026-0001', 'FIR-2026-0002', 'CANON-0042'],
    evidence: [
      { title: 'Burglary at Indiranagar PS', document_id: 'FIR-2026-0001', chunk_text: 'Rear window forced entry using crowbar, suspect fled with gold assets worth ₹4,50,000. Time: 03:30 AM.' },
      { title: 'Burglary at Koramangala PS', document_id: 'FIR-2026-0002', chunk_text: 'Similar MO — rear window crowbar entry at night. Jewelry worth ₹2,20,000 stolen.' },
      { title: 'Suspect Profile — Mohammed Rafi', document_id: 'CANON-0042', chunk_text: 'Active warrant WAR-2026-001. Associated vehicle KA-02-MB-1234 spotted near both scenes.' }
    ]
  },
  {
    role: 'user',
    text: 'Resolve identity pair Mohammed Rafi vs Mohammad Rafi',
    time: '20:43:05'
  },
  {
    role: 'assistant',
    text: 'Entity Resolution Engine has classified these records as a **MATCH** with 94% confidence (Fellegi-Sunter score: 0.94).\n\n**Matching Evidence:**\n- Shared phone number: 98450 12345\n- Same vehicle registration: KA-02-MB-1234\n- Address overlap: Indiranagar, Bengaluru\n- Age within 1-year tolerance\n\n**Canonical ID assigned:** CANON-0042\n\nBoth records point to the same individual. This canonical ID links to 3 active cases.',
    time: '20:43:11',
    intent: 'entity-lookup',
    pipeline: 'Fellegi-Sunter Entity Resolution Engine',
    confidence: 0.94,
    citations: ['CANON-0042', 'CASE-001', 'CASE-005'],
    evidence: [
      { title: 'Entity Resolution Result', document_id: 'CANON-0042', chunk_text: 'Fellegi-Sunter probabilistic matching: phone=EXACT, vehicle=EXACT, address=FUZZY(0.91), name=FUZZY(0.96)' }
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
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Find similar burglary cases to CASE-001',
    'Resolve identity pair Mohammed Rafi vs Mohammad Rafi',
    'Traverse associate network for CANON-0042',
    'How many active cases are in Bengaluru Central?',
    'ಮನೆಗಳ್ಳತನ ಪ್ರಕರಣ CASE-001 ಸಮಾನ ಅಪರಾಧಗಳನ್ನು ಹುಡುಕಿ'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSendQuery(textToSend) {
    const targetText = (textToSend || query).trim();
    if (!targetText) return;

    // Add user message
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
      pipeline: data.pipeline || 'Pramaan RAG Engine',
      confidence: data.confidence_score,
      citations: data.citations,
      evidence: data.evidence,
      mode: res.mode
    };
    setMessages(prev => [...prev, assistantMsg]);
  }

  const handleExportPDF = async () => {
    setExportNotice(null);
    const res = await api.exportDossierPdf('ASSISTANT-SESSION-01', 'CASE-001');
    if (res.ok) {
      setExportNotice({ type: 'success', text: 'Exported conversation dossier PDF successfully.' });
    } else {
      setExportNotice({ type: 'error', text: res.error || 'Failed to export dossier PDF' });
    }
    setTimeout(() => setExportNotice(null), 4000);
  };

  const toggleEvidence = (idx) => {
    setExpandedEvidence(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  // Simple markdown-like rendering for bold text
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-pramaan-primary font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-5 anim-content">
      <WorkPanel
        eyebrow="Analyze Module"
        title="AI Investigation Assistant (Bilingual Voice & Text)"
        actions={
          <div className="flex items-center gap-3">
            <ModeBadge mode="live" />
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pramaan-elevated border border-pramaan-border hover:border-pramaan-secondary/40 text-xs font-semibold text-pramaan-secondary transition-colors cursor-pointer"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        }
      >
        {exportNotice && (
          <div className={`p-3 rounded-lg border text-xs mb-4 font-mono ${exportNotice.type === 'success' ? 'bg-pramaan-success/15 border-pramaan-success/30 text-pramaan-success' : 'bg-pramaan-critical/15 border-pramaan-critical/30 text-pramaan-critical'}`}>
            {exportNotice.text}
          </div>
        )}

        {/* Conversation Messages Area */}
        <div className="rounded-lg border border-pramaan-border bg-pramaan-surface overflow-hidden mb-4">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-pramaan-border bg-pramaan-elevated/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pramaan-secondary" />
              <span className="text-[11px] font-mono uppercase font-bold text-pramaan-text-secondary">
                Intelligence Chat • {messages.length} messages
              </span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-[10px] font-mono text-pramaan-text-secondary hover:text-pramaan-critical transition-colors cursor-pointer"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="py-12 text-center space-y-3">
                <Bot className="w-10 h-10 mx-auto text-pramaan-text-secondary opacity-40" />
                <p className="text-xs text-pramaan-text-secondary">
                  Ask a question to query the Pramaan intelligence engine.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-pramaan-secondary/15 border border-pramaan-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-pramaan-secondary" />
                  </div>
                )}
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message bubble */}
                  <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-pramaan-primary/15 border border-pramaan-primary/25 text-pramaan-text'
                      : msg.isError
                        ? 'bg-pramaan-critical/10 border border-pramaan-critical/20 text-pramaan-critical'
                        : 'bg-pramaan-elevated border border-pramaan-border text-pramaan-text'
                  }`}>
                    {msg.text.split('\n').map((line, li) => (
                      <p key={li} className={li > 0 ? 'mt-1.5' : ''}>
                        {renderText(line)}
                      </p>
                    ))}
                  </div>

                  {/* Metadata badges for assistant messages */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-mono text-pramaan-text-secondary flex items-center gap-1">
                        <Clock size={9} /> {msg.time}
                      </span>
                      {msg.intent && (
                        <span className="text-[9px] font-mono uppercase font-bold text-pramaan-secondary bg-pramaan-secondary/10 px-1.5 py-0.5 rounded border border-pramaan-secondary/20">
                          {msg.intent}
                        </span>
                      )}
                      {msg.pipeline && (
                        <span className="text-[9px] font-mono text-pramaan-text-secondary bg-pramaan-surface px-1.5 py-0.5 rounded border border-pramaan-border">
                          ⚡ {msg.pipeline}
                        </span>
                      )}
                      {msg.confidence != null && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          msg.confidence >= 0.8
                            ? 'text-pramaan-success bg-pramaan-success/10 border-pramaan-success/20'
                            : msg.confidence >= 0.5
                              ? 'text-pramaan-warning bg-pramaan-warning/10 border-pramaan-warning/20'
                              : 'text-pramaan-critical bg-pramaan-critical/10 border-pramaan-critical/20'
                        }`}>
                          {(msg.confidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                      {msg.mode && msg.mode !== 'live' && (
                        <span className="text-[9px] font-mono text-pramaan-warning bg-pramaan-warning/10 px-1.5 py-0.5 rounded border border-pramaan-warning/20">
                          {msg.mode === 'seed_fallback' ? 'DEMO DATA' : msg.mode}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.citations.map((cite, ci) => (
                        <span key={ci} className="text-[9px] font-mono text-pramaan-primary bg-pramaan-primary/10 px-1.5 py-0.5 rounded border border-pramaan-primary/20 cursor-default">
                          📄 {cite}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Evidence panel (collapsible) */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="mt-1">
                      <button
                        onClick={() => toggleEvidence(idx)}
                        className="flex items-center gap-1 text-[10px] font-mono text-pramaan-secondary hover:text-pramaan-primary transition-colors cursor-pointer"
                      >
                        <ChevronDown size={12} className={`transition-transform ${expandedEvidence[idx] ? 'rotate-180' : ''}`} />
                        {expandedEvidence[idx] ? 'Hide' : 'Show'} {msg.evidence.length} evidence sources
                      </button>
                      {expandedEvidence[idx] && (
                        <div className="mt-2 space-y-2">
                          {msg.evidence.map((ev, ei) => (
                            <div key={ei} className="p-2.5 rounded-lg bg-pramaan-surface border border-pramaan-border/70 text-xs">
                              <div className="flex items-center gap-1.5 mb-1">
                                <FileText size={11} className="text-pramaan-secondary" />
                                <span className="font-bold text-pramaan-text">{ev.title || ev.document_id}</span>
                                {ev.document_id && (
                                  <span className="text-[9px] font-mono text-pramaan-text-secondary bg-pramaan-elevated px-1 py-0.5 rounded">{ev.document_id}</span>
                                )}
                              </div>
                              <p className="text-pramaan-text-secondary leading-relaxed">{ev.chunk_text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* User message timestamp */}
                  {msg.role === 'user' && (
                    <span className="text-[9px] font-mono text-pramaan-text-secondary flex items-center gap-1 justify-end">
                      <Clock size={9} /> {msg.time}
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-pramaan-primary/15 border border-pramaan-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-pramaan-primary" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {pending && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-pramaan-secondary/15 border border-pramaan-secondary/30 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-pramaan-secondary" />
                </div>
                <div className="bg-pramaan-elevated border border-pramaan-border rounded-xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-pramaan-secondary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="w-2 h-2 bg-pramaan-secondary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="w-2 h-2 bg-pramaan-secondary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                  <span className="text-xs font-mono text-pramaan-text-secondary">Routing through Pramaan AI...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Panel */}
        <div className="p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pramaan-secondary shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask in Kannada or English: e.g. Find twin cases to CASE-001..."
              className="flex-1 bg-transparent text-sm text-pramaan-text placeholder-pramaan-text-secondary outline-none font-sans"
            />

            {/* Voice Input */}
            <button
              type="button"
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isVoiceActive ? 'bg-pramaan-critical/20 text-pramaan-critical border-pramaan-critical/40 animate-pulse' : 'bg-pramaan-surface text-pramaan-text-secondary border-pramaan-border hover:text-pramaan-text'
              }`}
              title="Bhashini Voice Input (Microphone)"
            >
              <Mic size={16} />
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendQuery()}
              disabled={pending || !query.trim()}
              className="px-4 py-2 bg-pramaan-primary hover:bg-pramaan-primary-cyan text-pramaan-bg text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={13} /> {pending ? 'Routing...' : 'Send'}
            </button>
          </div>

          {/* Suggested Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pramaan-border/60">
            <span className="text-[10px] font-mono uppercase text-pramaan-text-secondary font-semibold">
              Suggested:
            </span>
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(prompt);
                  handleSendQuery(prompt);
                }}
                disabled={pending}
                className="text-[11px] font-mono bg-pramaan-surface hover:bg-pramaan-panel border border-pramaan-border text-pramaan-text-secondary hover:text-pramaan-text px-2.5 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="p-3 rounded-lg border border-pramaan-critical/30 bg-pramaan-critical/10 text-xs text-pramaan-critical font-mono flex items-center gap-2">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
      </WorkPanel>
    </div>
  );
}

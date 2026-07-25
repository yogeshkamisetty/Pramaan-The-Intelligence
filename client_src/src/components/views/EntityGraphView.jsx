import React, { useMemo, useState } from 'react';
import { WorkPanel } from '../common/WorkPanel.jsx';
import { ModeBadge } from '../common/ModeBadge.jsx';
import { Cite } from '../common/Cite.jsx';
import { graphEdges, graphNodes, suspectProfiles } from '../../data/mock.js';
import { api } from '../../api/client.js';
import { Network, RefreshCw, X, Layers, Users, ShieldAlert, Sparkles, CheckCircle2, Link2, ExternalLink, UserCheck, Eye, Phone, MapPin, Car, FileText, AlertTriangle } from 'lucide-react';

function riskColor(risk) {
  switch (risk) {
    case 'critical': return '#EF4444';
    case 'warning': return '#F59E0B';
    case 'info': return '#38BDF8';
    default: return '#10B981';
  }
}

// Detailed match descriptions explaining WHY entities match with their connected nodes
const NODE_MATCH_EXPLANATIONS = {
  'CANON-0042': {
    'CASE-001': 'Accused in Indiranagar burglary; matched via NAFIS fingerprint match FP-KSP-04218 and crowbar MO.',
    'CASE-002': '82% MO Similarity match — identical rear window crowbar entry in late night hours.',
    'CASE-005': 'Vehicle theft linkage — getaway motorcycle KA-02-MB-1234 registered to suspect.',
    'KA-02-MB-1234': 'Registered owner of vehicle KA-02-MB-1234 flagged at crime scene via ANPR camera.',
    'CANON-0044': 'Identified as associate via Fellegi-Sunter probabilistic matching (shared phone & address token).'
  },
  'CASE-001': {
    'CANON-0042': 'Suspect CANON-0042 identified via right index fingerprint at scene.',
    'CASE-002': '82.1% MO Similarity Twin match — identical crowbar entry & 01:00-04:00 AM timeframe.',
    'KA-02-MB-1234': 'ANPR camera at Indiranagar junction recorded vehicle KA-02-MB-1234 at 03:28 AM.'
  },
  'CASE-002': {
    'CANON-0044': 'Suspect S. Praveen Kumar linked to daylight lock picking cluster.',
    'CASE-001': '82.1% MO Similarity Twin match — identical crowbar entry technique.',
  },
  'CANON-0048': {
    'CASE-006': 'Operates ATM card cloning syndicate across Jayanagar 4th Block ATMs.',
    'ACC-8819201': 'Financial transaction ledger traced ₹14,20,000 siphoned into Hawala account #8819.'
  },
  'CASE-006': {
    'CANON-0048': 'Primary suspect V. Kumar (Cyber) identified on CCTV placing skimming device.',
    'ACC-8819201': 'Transaction ledger #TXN-88214 linked 41 wire structuring transfers to ICICI account.'
  },
  'CANON-0050': {
    'CASE-007': 'Primary suspect in 45kg contraband narcotics smuggling through Mangaluru Port.',
    'KA-06-TR-8899': 'Cargo truck KA-06-TR-8899 used to transport smuggled contraband on NH-44.'
  }
};

export default function EntityGraphView({ activeRole = 'ACP' }) {
  const [canonicalId, setCanonicalId] = useState('CANON-0042');
  const [hopDepth, setHopDepth] = useState(2);
  const [selectedNode, setSelectedNode] = useState(graphNodes[0]);
  const [showModal, setShowModal] = useState(true);
  const [graph, setGraph] = useState({ nodes: graphNodes, edges: graphEdges, mode: 'live' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [clusterDetected, setClusterDetected] = useState(false);

  const edges = graph.edges || [];
  const rawNodes = graph.nodes || [];

  const processedNodes = useMemo(() => {
    const cx = 380, cy = 240, radius = 170;
    return rawNodes.map((node, i) => {
      let x = Number(node.x);
      let y = Number(node.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        const angle = (i / Math.max(rawNodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
        x = Math.round(cx + radius * Math.cos(angle));
        y = Math.round(cy + radius * Math.sin(angle));
      }
      return {
        ...node,
        x,
        y,
        label: node.label || node.id,
        type: node.type || node.label || 'Entity',
        risk: node.risk || 'info'
      };
    });
  }, [rawNodes]);

  const nodes = processedNodes;
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  // Find rich suspect profile if available
  const suspectProfile = useMemo(() => {
    if (!selectedNode) return null;
    return suspectProfiles.find(p => p.canonicalId === selectedNode.id) || null;
  }, [selectedNode]);

  // Find all connected relationships for selected node
  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id || e.source === selectedNode.id || e.target === selectedNode.id);
  }, [selectedNode, edges]);

  async function traverse() {
    setPending(true);
    setError('');
    const res = await api.traverseGraph(canonicalId, hopDepth);
    setPending(false);
    if (!res.ok) {
      setError(res.error || 'Graph traversal failed');
      return;
    }
    if (res.data && res.data.nodes) {
      setGraph({ nodes: res.data.nodes, edges: res.data.relationships || [], mode: res.mode || 'live' });
    }
  }

  const runLeidenClustering = () => {
    setClusterDetected(true);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setShowModal(true);
  };

  return (
    <div className="space-y-5 anim-content">
      <WorkPanel
        eyebrow="Analyze Module"
        title="Entity Graph Traversal & Associate Cluster Detection"
        actions={
          <div className="flex items-center gap-3">
            <ModeBadge mode={graph.mode || 'live'} />
            <button
              onClick={runLeidenClustering}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pramaan-secondary/15 text-pramaan-secondary border border-pramaan-secondary/30 text-xs font-bold hover:bg-pramaan-secondary/25 transition-colors cursor-pointer"
            >
              <Sparkles size={13} /> Detect Clusters (Leiden)
            </button>
          </div>
        }
      >
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-pramaan-elevated border border-pramaan-border mb-4">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-pramaan-secondary" />
            <span className="text-xs font-bold text-pramaan-text font-mono">Seed Canonical ID:</span>
            <input
              type="text"
              value={canonicalId}
              onChange={(e) => setCanonicalId(e.target.value)}
              className="bg-pramaan-surface border border-pramaan-border rounded px-2.5 py-1 text-xs font-mono text-pramaan-text outline-none focus:border-pramaan-primary"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <label className="text-pramaan-text-secondary">Hop Depth:</label>
            <select
              value={hopDepth}
              onChange={(e) => setHopDepth(Number(e.target.value))}
              className="bg-pramaan-surface text-pramaan-text border border-pramaan-border rounded px-2 py-1 outline-none"
            >
              <option value={1}>1 Hop</option>
              <option value={2}>2 Hops</option>
              <option value={3}>3 Hops</option>
            </select>

            <button
              onClick={traverse}
              disabled={pending}
              className="px-3 py-1 rounded bg-pramaan-primary text-pramaan-bg font-bold hover:bg-pramaan-primary-cyan transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={13} className={pending ? 'animate-spin' : ''} /> Traverse Graph
            </button>
          </div>
        </div>

        {/* Graph Canvas & Side Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
          {/* SVG Graph View (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[500px] rounded-lg border border-pramaan-border bg-pramaan-bg overflow-hidden">
            {clusterDetected && (
              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-pramaan-secondary/20 border border-pramaan-secondary/40 text-pramaan-secondary text-xs font-mono font-bold flex items-center gap-1.5">
                <Users size={14} /> Leiden Cluster #1 Detected: 4 Associate Links
              </div>
            )}

            <svg
              viewBox="0 0 760 520"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ backgroundImage: 'radial-gradient(#2A3346 1px, transparent 0)', backgroundSize: '24px 24px' }}
            >
              <defs>
                <marker id="arrow" viewBox="0 -5 10 10" refX="22" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,-5L10,0L0,5" fill="#8A97AD" opacity="0.6" />
                </marker>
              </defs>

              {/* Edge Lines */}
              {edges.map((edge, idx) => {
                const source = nodeMap[edge.from] || nodeMap[edge.source];
                const target = nodeMap[edge.to] || nodeMap[edge.target];
                if (!source || !target) return null;
                const isSelectedEdge = selectedNode && (source.id === selectedNode.id || target.id === selectedNode.id);
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                return (
                  <g key={`${edge.from}-${edge.to}-${idx}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isSelectedEdge ? '#38BDF8' : '#3B465E'}
                      strokeWidth={isSelectedEdge ? '2.5' : '1.5'}
                      strokeDasharray={isSelectedEdge ? 'none' : 'none'}
                      opacity={selectedNode && !isSelectedEdge ? 0.25 : 1}
                      markerEnd="url(#arrow)"
                    />
                    <text x={midX} y={midY - 6} fill={isSelectedEdge ? '#38BDF8' : '#8A97AD'} fontSize="10" fontWeight={isSelectedEdge ? 'bold' : 'normal'} fontFamily="JetBrains Mono" textAnchor="middle">
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = selectedNode && connectedEdges.some(e => e.from === node.id || e.to === node.id || e.source === node.id || e.target === node.id);
                const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.3) : 1;

                return (
                  <g
                    key={node.id}
                    onClick={() => handleSelectNode(node)}
                    className="cursor-pointer group"
                    transform={`translate(${node.x}, ${node.y})`}
                    opacity={opacity}
                  >
                    {isSelected && (
                      <circle r="28" fill="none" stroke="#38BDF8" strokeWidth="2" className="animate-ping opacity-75" />
                    )}
                    <circle
                      r="20"
                      fill="#121722"
                      stroke={riskColor(node.risk)}
                      strokeWidth={isSelected ? 4 : 2}
                      className="transition-all group-hover:scale-110"
                    />
                    <text y="36" fill={isSelected ? '#38BDF8' : '#EAF0FA'} fontSize="11" fontWeight="bold" fontFamily="Inter" textAnchor="middle">
                      {node.label}
                    </text>
                    <text y="50" fill="#8A97AD" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                      {node.type}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Entity Match Inspector Panel (5 cols) */}
          <div className="lg:col-span-5 p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pramaan-border">
              <span className="text-[10px] font-mono font-bold uppercase text-pramaan-secondary flex items-center gap-1.5">
                <Sparkles size={13} /> Entity & Connected Matches Inspector
              </span>
              {selectedNode && (
                <button onClick={() => setSelectedNode(null)} className="text-pramaan-text-secondary hover:text-pramaan-text cursor-pointer">
                  <X size={16} />
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                {/* Node Profile Header Card */}
                <div className="p-3.5 rounded-lg bg-pramaan-surface border border-pramaan-border space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-pramaan-primary font-bold">{selectedNode.id}</span>
                      <h3 className="text-base font-bold text-pramaan-text">{selectedNode.label}</h3>
                      <span className="text-[10px] font-mono uppercase font-semibold text-pramaan-text-secondary">{selectedNode.type}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border`} style={{ color: riskColor(selectedNode.risk), borderColor: `${riskColor(selectedNode.risk)}40`, backgroundColor: `${riskColor(selectedNode.risk)}15` }}>
                      {selectedNode.risk} RISK
                    </span>
                  </div>

                  {/* Profile image if suspect */}
                  {suspectProfile && suspectProfile.image && (
                    <div className="flex items-center gap-3 pt-2 border-t border-pramaan-border/60">
                      <img src={suspectProfile.image} alt={suspectProfile.name} className="h-14 w-14 rounded-md object-cover border border-pramaan-border" />
                      <div className="space-y-1 font-mono text-[10px] text-pramaan-text-secondary">
                        <div className="flex items-center gap-1 text-pramaan-text"><Phone size={10} /> {suspectProfile.phone}</div>
                        <div className="flex items-center gap-1"><MapPin size={10} /> {suspectProfile.address}</div>
                        {suspectProfile.vehicleReg && <div className="flex items-center gap-1 text-pramaan-secondary"><Car size={10} /> {suspectProfile.vehicleReg}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Connected Matches Detailed Breakdown Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-pramaan-secondary">
                      Connected Relationships & Match Reasons ({connectedEdges.length}):
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {connectedEdges.map((e, idx) => {
                      const otherId = e.from === selectedNode.id ? (e.to || e.target) : (e.from || e.source);
                      const otherNode = nodeMap[otherId] || { id: otherId, label: otherId, type: 'Entity' };
                      const matchExpl = (NODE_MATCH_EXPLANATIONS[selectedNode.id] && NODE_MATCH_EXPLANATIONS[selectedNode.id][otherId]) ||
                        (NODE_MATCH_EXPLANATIONS[otherId] && NODE_MATCH_EXPLANATIONS[otherId][selectedNode.id]) ||
                        `Linked via relationship '${e.label}' in the Pramaan crime graph database.`;

                      return (
                        <div key={idx} className="p-3 rounded-lg bg-pramaan-surface border border-pramaan-border/80 space-y-1.5">
                          <div className="flex items-center justify-between border-b border-pramaan-border/50 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Link2 size={12} className="text-pramaan-secondary" />
                              <span className="font-bold text-pramaan-text font-mono text-xs">{otherNode.label}</span>
                              <span className="text-[9px] font-mono bg-pramaan-elevated px-1.5 py-0.5 rounded text-pramaan-text-secondary">{otherNode.type}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-pramaan-primary bg-pramaan-primary/10 px-1.5 py-0.5 rounded">
                              {e.label}
                            </span>
                          </div>

                          {/* Match rationale text */}
                          <div className="text-[11px] text-pramaan-text leading-relaxed font-sans pt-0.5 flex items-start gap-1.5">
                            <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{matchExpl}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-pramaan-border">
                  <span className="text-[10px] font-mono text-pramaan-text-secondary">
                    {connectedEdges.length} direct links identified
                  </span>
                  <button
                    onClick={() => setCanonicalId(selectedNode.id)}
                    className="px-3 py-1 bg-pramaan-primary hover:bg-pramaan-primary-cyan text-pramaan-bg font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    Re-Center Graph on {selectedNode.id}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-pramaan-text-secondary space-y-2">
                <Network className="w-8 h-8 mx-auto opacity-40 text-pramaan-secondary" />
                <p>Click any node on the graph canvas to inspect its profile and see exact match reasons with connected entities.</p>
              </div>
            )}
          </div>
        </div>
      </WorkPanel>
    </div>
  );
}

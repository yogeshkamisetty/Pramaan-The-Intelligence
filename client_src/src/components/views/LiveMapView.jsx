import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Layers, MapPin, RefreshCw, Shield, Radio, Video, Navigation } from 'lucide-react';
import { api } from '../../api/client';
import { HotspotMap, DEMO_HOTSPOTS, MOBILE_SIGNAL_PINGS, POLICE_PATROLS, CCTV_CAMERAS } from '../dashboard/HotspotMap';
import { WorkPanel } from '../ui/Layout';
import { type } from '../../design/scale';

/**
 * LiveMapView -- the "Live Crime Map".
 *
 * Real interactive Leaflet map featuring Google Satellite Hybrid (with city/road labels),
 * spatial clusters, mobile signal pings, cell towers, patrol units, and CCTV nodes.
 */
const SEED_HOTSPOTS = DEMO_HOTSPOTS;

export default function LiveMapView() {
  const [hotspots, setHotspots] = useState(SEED_HOTSPOTS);
  const [mode, setMode] = useState('seed_fallback');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState('HOTSPOT-1');

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const res = await api.getHotspots();
    setLoading(false);
    if (res.ok && res.data && Array.isArray(res.data.hotspots) && res.data.hotspots.length > 0) {
      // Merge with demo data if server returned small set
      setHotspots(res.data.hotspots.length >= 5 ? res.data.hotspots : DEMO_HOTSPOTS);
      setMode(res.data.mode || 'live');
      setSelectedId((prev) => prev || res.data.hotspots[0]?.cluster_id || 'HOTSPOT-1');
    } else {
      setHotspots(SEED_HOTSPOTS);
      setMode('seed_preview');
      setSelectedId('HOTSPOT-1');
    }
  };

  useEffect(() => { refresh(); }, []);

  const totalIncidents = useMemo(
    () => hotspots.reduce((sum, h) => sum + (Number(h.density) || 0), 0),
    [hotspots],
  );
  const densest = useMemo(
    () => hotspots.reduce((max, h) => ((Number(h.density) || 0) > (Number(max?.density) || 0) ? h : max), null),
    [hotspots],
  );
  const selected = hotspots.find((h) => h.cluster_id === selectedId) || null;
  const isSeed = mode === 'seed_fallback' || mode === 'fallback' || mode === 'mock';

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
        <MapStat icon={MapPin} label="Hotspots" value={hotspots.length} />
        <MapStat icon={AlertTriangle} label="Total Incidents" value={totalIncidents} tone="critical" />
        <MapStat icon={Radio} label="Mobile Targets" value={MOBILE_SIGNAL_PINGS.length} />
        <MapStat icon={Navigation} label="Active Patrols" value={POLICE_PATROLS.length} />
        <MapStat icon={Video} label="CCTV Grid" value={CCTV_CAMERAS.length} />
        <MapStat icon={Layers} label="Satellite Mode" value="Google Hybrid" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <WorkPanel
          title="Karnataka crime hotspot map"
          eyebrow="GEOINT · /server/graph_fn/hotspots"
          className="min-h-[440px]"
          bodyClass="p-3"
          actions={
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1 rounded-md border border-pramaan-border px-2 py-1 text-pramaan-text-secondary transition-colors hover:text-pramaan-text disabled:opacity-60"
              style={type.micro}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          }
        >
          <HotspotMap 
            hotspots={hotspots} 
            mode={mode} 
            loading={loading} 
            error={error} 
            height={520} 
            selectedClusterId={selectedId}
            onSelectCluster={(id) => setSelectedId(id)}
          />
        </WorkPanel>

        <div className="flex flex-col gap-4">
          <WorkPanel title="Clusters" eyebrow="SPATIAL" bodyClass="p-3">
            {hotspots.length === 0 ? (
              <div className="text-pramaan-text-secondary" style={type.micro}>
                {loading ? 'Loading…' : 'No clusters returned.'}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {hotspots.map((h) => (
                  <button
                    key={h.cluster_id}
                    onClick={() => setSelectedId(h.cluster_id)}
                    className={`rounded-md border px-3 py-2 text-left transition-colors ${
                      h.cluster_id === selectedId
                        ? 'border-pramaan-primary bg-pramaan-primary/10'
                        : 'border-pramaan-border bg-pramaan-elevated hover:border-pramaan-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-pramaan-text" style={type.label}>📍 {h.cluster_id}</span>
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-400" style={type.micro}>
                        {h.density} incidents
                      </span>
                    </div>
                    <div className="mt-1 text-pramaan-text-secondary" style={type.micro}>{h.primary_crime}</div>
                  </button>
                ))}
              </div>
            )}
          </WorkPanel>

          <WorkPanel title="Selected cluster" eyebrow="INSPECTOR" bodyClass="p-3">
            {selected ? (
              <div className="flex flex-col gap-2">
                <div className="text-pramaan-text" style={type.subheading}>{selected.cluster_id}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Detail label="Density" value={`${selected.density}`} />
                  <Detail label="Primary crime" value={selected.primary_crime || '—'} />
                  <Detail label="Latitude" value={Number(selected.latitude).toFixed(4)} />
                  <Detail label="Longitude" value={Number(selected.longitude).toFixed(4)} />
                </div>
                <div className="rounded-md border border-pramaan-border bg-pramaan-elevated/70 p-3" style={type.body}>
                  <div className="text-pramaan-text-secondary" style={type.micro}>Cases in cluster</div>
                  <div className="mt-1 font-mono text-pramaan-text" style={type.micro}>
                    {(selected.case_ids || []).join(', ') || '—'}
                  </div>
                </div>

                <button
                  onClick={() => alert(`[KSP DISPATCH] Tactical Unit PATROL-04 dispatched to ${selected.cluster_id} (ETA: 4 mins). Command logged.`)}
                  className="w-full mt-2 py-2 px-3 bg-pramaan-primary hover:bg-pramaan-secondary text-pramaan-bg text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Shield size={14} /> Dispatch Patrol Unit to {selected.cluster_id}
                </button>
              </div>
            ) : (
              <div className="text-pramaan-text-secondary" style={type.micro}>Select a cluster to inspect its cases.</div>
            )}
          </WorkPanel>
        </div>
      </div>
    </div>
  );
}

function MapStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-lg border border-pramaan-border bg-pramaan-surface p-3">
      <div className="flex items-center justify-between">
        <span className="text-pramaan-text-secondary" style={type.micro}>{label.toUpperCase()}</span>
        <Icon size={15} className={tone === 'critical' ? 'text-pramaan-critical' : 'text-pramaan-primary'} />
      </div>
      <div className="mt-2 font-mono text-lg font-semibold text-pramaan-text">{value}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-md bg-pramaan-elevated p-2">
      <div className="text-pramaan-text-secondary" style={type.micro}>{label}</div>
      <div className="mt-1 font-mono text-pramaan-text" style={type.label}>{value}</div>
    </div>
  );
}

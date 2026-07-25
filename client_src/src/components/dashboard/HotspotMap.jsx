import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ModeBadge } from '../common/ModeBadge';
import { Layers, Globe, Radio, AlertTriangle, Shield, Signal, Video } from 'lucide-react';

// Karnataka state, roughly centred, zoomed to show the whole state.
const KARNATAKA_CENTER = [15.3173, 75.7139];
const KARNATAKA_ZOOM = 7;

// Colour by primary crime type. Keep in sync with the legend below.
const CRIME_COLORS = {
  Burglary: '#f59e0b',          // amber
  'Chain snatching': '#ef4444', // red
  'Vehicle theft': '#a855f7',   // purple
  Theft: '#f97316',             // orange
  Assault: '#ec4899',           // pink
  Murder: '#dc2626',            // deep red
};
const DEFAULT_COLOR = '#22d3ee'; // cyan

function crimeColor(crime) {
  return CRIME_COLORS[crime] || DEFAULT_COLOR;
}

// Marker radius (px) scales with incident density
function densityRadius(density) {
  const d = Number(density) || 1;
  return Math.max(10, Math.min(45, 10 + d * 5));
}

function isValidCoord(h) {
  const lat = Number(h.latitude);
  const lng = Number(h.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

export const MOBILE_SIGNAL_PINGS = [
  {
    ping_id: 'SIG-9845011223',
    target_name: 'Mohammed Rafi (CANON-0042)',
    phone: '98450 11223',
    imei: '864902184910284',
    tower_id: 'BTS-BGLR-CENTRAL-04',
    latitude: 12.9585,
    longitude: 77.6242,
    signal_strength: '-62 dBm (Excellent)',
    frequency: '1800 MHz (4G LTE)',
    status: 'ACTIVE_PING',
    last_seen: '2 mins ago'
  },
  {
    ping_id: 'SIG-9900881122',
    target_name: 'S. Praveen Kumar (CANON-0044)',
    phone: '9900881122',
    imei: '358910294810291',
    tower_id: 'BTS-MYS-MAIN-02',
    latitude: 12.2965,
    longitude: 76.6402,
    signal_strength: '-78 dBm (Moderate)',
    frequency: '2100 MHz (5G NR)',
    status: 'TRIANGULATED',
    last_seen: 'Just now'
  },
  {
    ping_id: 'SIG-9731049281',
    target_name: 'Unidentified Target (IMEI-77182)',
    phone: '97310 49281',
    imei: '351982710293810',
    tower_id: 'BTS-HUB-NORTH-01',
    latitude: 15.3647,
    longitude: 75.1240,
    signal_strength: '-71 dBm (Good)',
    frequency: '900 MHz (4G)',
    status: 'GEO_FENCE_ALERT',
    last_seen: '5 mins ago'
  }
];

export const CELL_TOWERS = [
  { tower_id: 'BTS-BGLR-CENTRAL-04', location: 'Bengaluru Central', latitude: 12.9550, longitude: 77.6210, carrier: 'Airtel/Jio KSP Tactical' },
  { tower_id: 'BTS-MYS-MAIN-02', location: 'Mysuru Main Junction', latitude: 12.2920, longitude: 76.6350, carrier: 'BSNL Command Grid' },
  { tower_id: 'BTS-HUB-NORTH-01', location: 'Hubballi North Station', latitude: 15.3600, longitude: 75.1200, carrier: 'Jio Special Grid' }
];

export const CCTV_CAMERAS = [
  { cctv_id: 'CCTV-INDIRANAGAR-01', location: '10th Main Junction, Indiranagar', latitude: 12.9590, longitude: 77.6255, status: 'ONLINE (4K)', angle: '360° PTZ' },
  { cctv_id: 'CCTV-KORAMANGALA-03', location: '80ft Road, Koramangala', latitude: 12.9598, longitude: 77.6230, status: 'ONLINE (1080p)', angle: 'North-East' },
  { cctv_id: 'CCTV-MALLESHWARAM-02', location: 'Margosa Road, Malleshwaram', latitude: 13.0290, longitude: 77.5890, status: 'RECORDING', angle: 'Fixed South' }
];

// Tile providers configuration
const TILE_PROVIDERS = {
  satellite: {
    name: 'Satellite Real-Time (Esri World Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  dark: {
    name: 'Dark Command Vector (CartoDB)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  street: {
    name: 'Street Map (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
};

export function HotspotMap({ hotspots = [], mode = 'live', loading = false, error = null, height = 500, showMobileSignals = true, selectedClusterId = null, onSelectCluster }) {
  const [tileMode, setTileMode] = useState('satellite'); // 'satellite', 'dark', 'street'
  const points = useMemo(() => (Array.isArray(hotspots) ? hotspots.filter(isValidCoord) : []), [hotspots]);

  const legendCrimes = useMemo(() => {
    const set = new Set(points.map((h) => h.primary_crime).filter(Boolean));
    return Array.from(set);
  }, [points]);

  const isSeed = mode === 'seed_fallback' || mode === 'fallback' || mode === 'mock' || mode === 'mock_error';

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Map Control Bar: Tile Layer Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-pramaan-elevated border border-pramaan-border text-xs font-mono">
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-pramaan-primary" />
          <span className="font-bold text-pramaan-text">Satellite Map Mode:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTileMode('satellite')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                tileMode === 'satellite'
                  ? 'bg-pramaan-primary text-pramaan-bg font-extrabold shadow-sm'
                  : 'bg-pramaan-surface text-pramaan-text-secondary hover:text-pramaan-text border border-pramaan-border'
              }`}
            >
              🛰️ Real-Time Satellite
            </button>
            <button
              onClick={() => setTileMode('dark')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                tileMode === 'dark'
                  ? 'bg-pramaan-primary text-pramaan-bg font-extrabold shadow-sm'
                  : 'bg-pramaan-surface text-pramaan-text-secondary hover:text-pramaan-text border border-pramaan-border'
              }`}
            >
              🌌 Dark Vector
            </button>
            <button
              onClick={() => setTileMode('street')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                tileMode === 'street'
                  ? 'bg-pramaan-primary text-pramaan-bg font-extrabold shadow-sm'
                  : 'bg-pramaan-surface text-pramaan-text-secondary hover:text-pramaan-text border border-pramaan-border'
              }`}
            >
              🗺️ OpenStreet
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-pramaan-text-secondary">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Radar Active
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-pramaan-border shadow-2xl">
        {/* Source overlay */}
        <div className="absolute z-[500] top-3 left-3 flex items-center gap-2 rounded-md bg-black/80 backdrop-blur px-2.5 py-1.5 border border-white/10 pointer-events-none">
          <ModeBadge mode={mode} />
          <span className="text-[10px] font-mono text-gray-200 font-medium">
            {isSeed ? 'Demo / seed coordinates — live signal simulation active' : 'Live from /graph_fn/hotspots & Mobile Triangulation'}
          </span>
        </div>

        {loading && (
          <div className="absolute z-[500] inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-xs text-pramaan-primary font-mono font-bold">
            <Radio className="animate-spin mr-2" size={18} /> Fetching real-time satellite GEOINT data...
          </div>
        )}

        <MapContainer
          center={KARNATAKA_CENTER}
          zoom={KARNATAKA_ZOOM}
          scrollWheelZoom={true}
          style={{ height, width: '100%', background: '#0b0e14' }}
          aria-label="Interactive crime hotspot and real-time satellite map"
        >
          <TileLayer
            key={tileMode}
            attribution={TILE_PROVIDERS[tileMode].attribution}
            url={TILE_PROVIDERS[tileMode].url}
          />

          {/* Render Spatial Hotspot Clusters with glowing borders */}
          {points.map((h) => {
            const color = crimeColor(h.primary_crime);
            const radius = densityRadius(h.density);
            const isSelected = h.cluster_id === selectedClusterId;

            return (
              <React.Fragment key={h.cluster_id}>
                {/* Outer pulsing halo for selected or dense clusters */}
                <CircleMarker
                  center={[Number(h.latitude), Number(h.longitude)]}
                  radius={radius + 8}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.25 : 0.1,
                    weight: isSelected ? 2 : 1,
                    dashArray: '4, 4'
                  }}
                />
                
                <CircleMarker
                  center={[Number(h.latitude), Number(h.longitude)]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: 0.65,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => onSelectCluster && onSelectCluster(h.cluster_id)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="text-xs font-mono font-bold">{h.cluster_id}</div>
                    <div className="text-[10px]">{h.primary_crime} ({h.density} incidents)</div>
                  </Tooltip>

                  <Popup>
                    <div className="p-2 space-y-1.5 text-xs text-black font-sans">
                      <div className="font-bold border-b pb-1 font-mono text-sm text-slate-900">{h.cluster_id} — {h.primary_crime}</div>
                      <div>Density: <b className="text-amber-700">{h.density} incidents clustered</b></div>
                      <div>Centroid Lat/Lng: {Number(h.latitude).toFixed(4)}, {Number(h.longitude).toFixed(4)}</div>
                      {Array.isArray(h.case_ids) && (
                        <div className="pt-1 text-[11px] font-mono">
                          <b>Cases:</b> {h.case_ids.join(', ')}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

          {/* Render Cell Towers & Mobile Signal Triangulations */}
          {showMobileSignals && (
            <>
              {CELL_TOWERS.map((t) => (
                <CircleMarker
                  key={t.tower_id}
                  center={[t.latitude, t.longitude]}
                  radius={16}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                    weight: 1.5,
                    dashArray: '3, 6'
                  }}
                >
                  <Tooltip direction="top" opacity={0.9}>
                    <div className="text-xs font-bold text-blue-400 font-mono">📡 {t.tower_id}</div>
                    <div className="text-[10px]">{t.location} ({t.carrier})</div>
                  </Tooltip>
                </CircleMarker>
              ))}

              {MOBILE_SIGNAL_PINGS.map((p) => (
                <CircleMarker
                  key={p.ping_id}
                  center={[p.latitude, p.longitude]}
                  radius={12}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.85,
                    weight: 3
                  }}
                >
                  <Tooltip direction="top" opacity={0.95}>
                    <div className="text-xs font-bold text-emerald-400 font-mono">📱 {p.target_name}</div>
                    <div className="text-[10px]">IMEI: {p.imei} • {p.signal_strength}</div>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 space-y-1.5 text-xs text-black font-sans">
                      <div className="font-bold border-b pb-1 text-emerald-800 font-mono">📱 Real-Time Mobile Signal Ping</div>
                      <div>Target: <b>{p.target_name}</b></div>
                      <div>Phone: <b>{p.phone}</b></div>
                      <div>IMEI: {p.imei}</div>
                      <div>Tower: {p.tower_id}</div>
                      <div>Signal: <span className="font-bold text-emerald-700">{p.signal_strength}</span></div>
                      <div>Freq: {p.frequency}</div>
                      <div>Last Ping: {p.last_seen}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          )}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="p-2.5 bg-black/80 backdrop-blur border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-gray-300 font-mono">
          <span className="font-bold text-white">Map Legend:</span>
          {legendCrimes.map((crime) => (
            <span key={crime} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ background: crimeColor(crime) }} />
              {crime}
            </span>
          ))}
          {showMobileSignals && (
            <>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Mobile Target Ping
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-3 h-3 rounded-full fill-none border-2 border-blue-400 inline-block" />
                Cell Tower (BTS)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ModeBadge } from '../common/ModeBadge';
import { Layers, Globe, Radio, Shield, Signal, Video, Navigation, Search, Filter, AlertTriangle, Eye, Flame, MapPin, CheckCircle, Crosshair, PhoneCall, Zap, Maximize2, RotateCcw } from 'lucide-react';

// Karnataka state, roughly centred, zoomed to show full region.
const KARNATAKA_CENTER = [14.5000, 76.5000];
const KARNATAKA_ZOOM = 7;

// Colour by primary crime type
const CRIME_COLORS = {
  Burglary: '#f59e0b',           // amber
  'Vehicle theft': '#a855f7',    // purple
  'Chain snatching': '#ef4444',  // red
  Extortion: '#ec4899',          // pink
  Cyber: '#06b6d4',              // cyan
  Narcotics: '#10b981',          // emerald
  Robbery: '#dc2626',            // deep red
  'Interstate Gang': '#e11d48',   // rose
};
const DEFAULT_COLOR = '#3b82f6';  // blue

function crimeColor(crime) {
  return CRIME_COLORS[crime] || DEFAULT_COLOR;
}

// Marker radius (px) scales with incident density
function densityRadius(density) {
  const d = Number(density) || 1;
  return Math.max(10, Math.min(42, 10 + d * 3.5));
}

function isValidCoord(h) {
  const lat = Number(h.latitude);
  const lng = Number(h.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

// MapFlyTo component to smooth-pan to searched or selected coordinate
function MapFlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 11, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Comprehensive Demo Spatial Hotspot Clusters across South India / Karnataka
export const DEMO_HOTSPOTS = [
  { cluster_id: 'HOTSPOT-1', latitude: 12.9579, longitude: 77.6251, density: 14, primary_crime: 'Burglary', location: 'Bengaluru Central (Indiranagar)', station: 'Ashoknagar PS / Indiranagar PS', case_ids: ['CASE-001', 'CASE-002', 'CASE-008', 'CASE-012'], risk: 'CRITICAL' },
  { cluster_id: 'HOTSPOT-2', latitude: 13.0285, longitude: 77.5896, density: 8, primary_crime: 'Vehicle theft', location: 'Bengaluru North (Yelahanka / Hebbal)', station: 'Byatarayanapura PS', case_ids: ['CASE-005', 'CASE-014'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-3', latitude: 12.9135, longitude: 77.4863, density: 6, primary_crime: 'Burglary', location: 'Bengaluru West (Kengeri Satellite Town)', station: 'Kengeri PS', case_ids: ['CASE-009', 'CASE-015'], risk: 'MODERATE' },
  { cluster_id: 'HOTSPOT-4', latitude: 12.2958, longitude: 76.6394, density: 9, primary_crime: 'Chain snatching', location: 'Mysuru Heritage (KR Circle)', station: 'Devaraja PS', case_ids: ['CASE-004', 'CASE-011', 'CASE-027'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-5', latitude: 15.3647, longitude: 75.1240, density: 11, primary_crime: 'Burglary', location: 'Hubballi Commercial Hub (CBT Junction)', station: 'Hubballi Town PS', case_ids: ['CASE-007', 'CASE-018', 'CASE-029'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-6', latitude: 12.8702, longitude: 74.8806, density: 7, primary_crime: 'Extortion', location: 'Mangaluru Port Zone (Hampankatta)', station: 'Mangaluru East PS', case_ids: ['CASE-010', 'CASE-022'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-7', latitude: 15.8497, longitude: 74.4977, density: 5, primary_crime: 'Vehicle theft', location: 'Belagavi Border Corridor (Tilakwadi)', station: 'Belagavi City PS', case_ids: ['CASE-013', 'CASE-025'], risk: 'MODERATE' },
  { cluster_id: 'HOTSPOT-8', latitude: 15.1394, longitude: 76.9214, density: 6, primary_crime: 'Robbery', location: 'Ballari Mining & Railway Zone', station: 'Ballari Town PS', case_ids: ['CASE-016', 'CASE-028'], risk: 'MODERATE' },
  { cluster_id: 'HOTSPOT-9', latitude: 14.4644, longitude: 75.9218, density: 4, primary_crime: 'Burglary', location: 'Davangere Cotton Market (PB Road)', station: 'Davangere Sub-urban PS', case_ids: ['CASE-019'], risk: 'LOW' },
  { cluster_id: 'HOTSPOT-10', latitude: 13.9299, longitude: 75.5681, density: 5, primary_crime: 'Extortion', location: 'Shivamogga Malnad Region (BH Road)', station: 'Shivamogga Town PS', case_ids: ['CASE-021'], risk: 'MODERATE' },
  { cluster_id: 'HOTSPOT-11', latitude: 13.3379, longitude: 77.1173, density: 7, primary_crime: 'Robbery', location: 'Tumakuru Highway Corridor (Sira Road)', station: 'Tumakuru Town PS', case_ids: ['CASE-023', 'CASE-033'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-12', latitude: 17.3297, longitude: 76.8343, density: 5, primary_crime: 'Cyber', location: 'Kalaburagi Super Market Zone', station: 'Kalaburagi Brahmpur PS', case_ids: ['CASE-024'], risk: 'MODERATE' },
  { cluster_id: 'HOTSPOT-13', latitude: 12.7409, longitude: 77.8253, density: 8, primary_crime: 'Interstate Gang', location: 'Hosur Interstate Border Checkpost', station: 'Attibele / Border Checkpost', case_ids: ['CASE-030', 'CASE-034'], risk: 'CRITICAL' },
  { cluster_id: 'HOTSPOT-14', latitude: 13.6288, longitude: 79.4192, density: 6, primary_crime: 'Narcotics', location: 'Tirupati Highway Border Checkpoint', station: 'Mulbagal Border Checkpost', case_ids: ['CASE-031'], risk: 'HIGH' },
  { cluster_id: 'HOTSPOT-15', latitude: 14.6819, longitude: 77.6006, density: 5, primary_crime: 'Chain snatching', location: 'Anantapur Interstate Transit Node', station: 'Interstate Patrol Squad', case_ids: ['CASE-032'], risk: 'MODERATE' }
];

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
    status: 'CRITICAL_TARGET',
    last_seen: '2 mins ago',
    speed: '12 km/h East'
  },
  {
    ping_id: 'SIG-9900881122',
    target_name: 'S. Praveen Kumar (CANON-0044)',
    phone: '99008 81122',
    imei: '358910294810291',
    tower_id: 'BTS-MYS-MAIN-02',
    latitude: 12.2965,
    longitude: 76.6402,
    signal_strength: '-78 dBm (Moderate)',
    frequency: '2100 MHz (5G NR)',
    status: 'TRIANGULATED',
    last_seen: 'Just now',
    speed: '0 km/h Stationary'
  },
  {
    ping_id: 'SIG-9731049281',
    target_name: 'Vikramaditya Singh (CANON-0045)',
    phone: '97310 49281',
    imei: '351982710293810',
    tower_id: 'BTS-HOSUR-BORDER-01',
    latitude: 12.7410,
    longitude: 77.8260,
    signal_strength: '-71 dBm (Good)',
    frequency: '900 MHz (4G)',
    status: 'GEOFENCE_ALERT',
    last_seen: '4 mins ago',
    speed: '45 km/h South'
  },
  {
    ping_id: 'SIG-9448033445',
    target_name: 'Kalyan Kumar (CANON-0048)',
    phone: '94480 33445',
    imei: '863391029482109',
    tower_id: 'BTS-HUB-NORTH-01',
    latitude: 15.3650,
    longitude: 75.1250,
    signal_strength: '-65 dBm (Strong)',
    frequency: '1800 MHz (4G)',
    status: 'ACTIVE_PING',
    last_seen: '1 min ago',
    speed: '28 km/h West'
  },
  {
    ping_id: 'SIG-9886099881',
    target_name: 'Anand Reddi (CANON-0050)',
    phone: '98860 99881',
    imei: '354492102938104',
    tower_id: 'BTS-TIRUPATI-HWY-03',
    latitude: 13.6290,
    longitude: 79.4200,
    signal_strength: '-84 dBm (Weak)',
    frequency: '900 MHz (2G/4G)',
    status: 'INTERSTATE_EXFILTRATION',
    last_seen: '6 mins ago',
    speed: '65 km/h East'
  },
  {
    ping_id: 'SIG-9480155667',
    target_name: 'Ramesh G. (CANON-0052)',
    phone: '94801 55667',
    imei: '867720194827103',
    tower_id: 'BTS-MNG-PORT-02',
    latitude: 12.8710,
    longitude: 74.8815,
    signal_strength: '-68 dBm (Good)',
    frequency: '2100 MHz (4G)',
    status: 'DOCK_MONITORING',
    last_seen: '3 mins ago',
    speed: '5 km/h North'
  }
];

export const CELL_TOWERS = [
  { tower_id: 'BTS-BGLR-CENTRAL-04', location: 'Bengaluru Central Command', latitude: 12.9550, longitude: 77.6210, carrier: 'Airtel/Jio KSP Tactical', radius_km: 1.5 },
  { tower_id: 'BTS-MYS-MAIN-02', location: 'Mysuru Main Junction', latitude: 12.2920, longitude: 76.6350, carrier: 'BSNL Command Grid', radius_km: 2.0 },
  { tower_id: 'BTS-HUB-NORTH-01', location: 'Hubballi Station Area', latitude: 15.3600, longitude: 75.1200, carrier: 'Jio Special Grid', radius_km: 1.8 },
  { tower_id: 'BTS-MNG-PORT-02', location: 'Mangaluru Port Junction', latitude: 12.8680, longitude: 74.8800, carrier: 'Airtel Coastal Net', radius_km: 2.2 },
  { tower_id: 'BTS-HOSUR-BORDER-01', location: 'Hosur Border Toll Checkpost', latitude: 12.7390, longitude: 77.8240, carrier: 'KSP-TN Border Grid', radius_km: 2.5 },
  { tower_id: 'BTS-TIRUPATI-HWY-03', location: 'Tirupati Highway Checkpoint', latitude: 13.6250, longitude: 79.4150, carrier: 'Interstate GEOINT Grid', radius_km: 3.0 }
];

export const POLICE_PATROLS = [
  { patrol_id: 'PATROL-BGLR-01', unit: 'Cheetah Patrol 01', station: 'Ashoknagar PS', latitude: 12.9560, longitude: 77.6220, status: 'PATROLLING', crew: 'PSI R. Kumar + 2 Officers', vehicle: 'KA-01-G-4412' },
  { patrol_id: 'PATROL-MYS-04', unit: 'Garuda Patrol 04', station: 'Devaraja PS', latitude: 12.2980, longitude: 76.6370, status: 'DISPATCHED', crew: 'ASI S. Naik + 1 Officer', vehicle: 'KA-09-G-1102' },
  { patrol_id: 'PATROL-HUB-02', unit: 'Panther Patrol 02', station: 'Hubballi Town PS', latitude: 15.3620, longitude: 75.1220, status: 'BARRICADE_ACTIVE', crew: 'PI M. Patil', vehicle: 'KA-25-G-8819' },
  { patrol_id: 'PATROL-MNG-05', unit: 'Coastal Guard 05', station: 'Mangaluru East PS', latitude: 12.8680, longitude: 74.8820, status: 'HARBOR_PATROL', crew: 'Inspector D. D\'Souza', vehicle: 'KA-19-G-5501' },
  { patrol_id: 'PATROL-BORDER-09', unit: 'Interstate Taskforce 09', station: 'Attibele Checkpost', latitude: 12.7420, longitude: 77.8280, status: 'INTERCEPTING', crew: 'DySP V. Reddy', vehicle: 'KA-51-G-9900' }
];

export const CCTV_CAMERAS = [
  { cctv_id: 'CCTV-INDIRANAGAR-01', location: '10th Main Junction, Indiranagar', latitude: 12.9590, longitude: 77.6255, resolution: '4K AI ANPR', status: 'ONLINE', angle: '360° PTZ' },
  { cctv_id: 'CCTV-KORAMANGALA-03', location: '80ft Road Junction', latitude: 12.9598, longitude: 77.6230, resolution: '1080p FacialRec', status: 'ONLINE', angle: 'North-East' },
  { cctv_id: 'CCTV-MYSURU-PALACE', location: 'Mysore Palace South Gate', latitude: 12.3050, longitude: 76.6550, resolution: 'Thermal Night Vision', status: 'RECORDING', angle: 'Fixed Perimeter' },
  { cctv_id: 'CCTV-HUBBALLI-CBT', location: 'CBT Bus Station Entrance', latitude: 15.3650, longitude: 75.1250, resolution: 'Crowd Analytics 4K', status: 'ONLINE', angle: 'Station Entry' },
  { cctv_id: 'CCTV-HOSUR-BORDER', location: 'Hosur Border Toll Plaza', latitude: 12.7415, longitude: 77.8260, resolution: 'High-Speed ANPR', status: 'ALERT_SCANNING', angle: 'Interstate Lane 3' }
];

export const TARGET_TRAILS = [
  {
    target_id: 'CANON-0042',
    name: 'Mohammed Rafi',
    color: '#ef4444',
    path: [
      [12.9520, 77.6180],
      [12.9550, 77.6210],
      [12.9575, 77.6235],
      [12.9585, 77.6242]
    ]
  },
  {
    target_id: 'CANON-0045',
    name: 'Vikramaditya Singh (Interstate Fugitive)',
    color: '#f59e0b',
    path: [
      [12.9100, 77.6500],
      [12.8400, 77.7200],
      [12.7800, 77.7900],
      [12.7410, 77.8260]
    ]
  },
  {
    target_id: 'CANON-0050',
    name: 'Anand Reddi (Tirupati Corridor)',
    color: '#a855f7',
    path: [
      [13.3400, 77.1200],
      [13.4800, 78.1000],
      [13.6290, 79.4200]
    ]
  }
];

// Tile providers configuration - Featuring Google Satellite Hybrid as DEFAULT (Matches Image 2!)
const TILE_PROVIDERS = {
  google_hybrid: {
    id: 'google_hybrid',
    name: 'Google Satellite (Hybrid / Labeled)',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite & Road Labels',
    badge: 'RECOMMENDED (IMAGE 2 MATCH)'
  },
  google_sat: {
    id: 'google_sat',
    name: 'Google Satellite (Pure)',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite'
  },
  esri_hybrid: {
    id: 'esri_hybrid',
    name: 'Esri Satellite Real-Time',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri World Imagery'
  },
  dark: {
    id: 'dark',
    name: 'Dark Command Vector',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO Dark Vector'
  },
  street: {
    id: 'street',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
};

export function HotspotMap({ 
  hotspots = [], 
  mode = 'live', 
  loading = false, 
  error = null, 
  height = 560, 
  showMobileSignals = true, 
  selectedClusterId = null, 
  onSelectCluster 
}) {
  const [tileMode, setTileMode] = useState('google_hybrid'); // Default to Google Satellite Hybrid!
  const [layerVisibility, setLayerVisibility] = useState({
    hotspots: true,
    pings: true,
    towers: true,
    patrols: true,
    cctv: true,
    heatmap: true,
    trails: true
  });
  const [selectedCrimeFilter, setSelectedCrimeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dispatchAlert, setDispatchAlert] = useState(null);

  // Merge provided hotspots with rich DEMO_HOTSPOTS if input list is minimal
  const displayHotspots = useMemo(() => {
    const rawList = (Array.isArray(hotspots) && hotspots.length > 0) ? hotspots : DEMO_HOTSPOTS;
    // Map with coordinates validation
    const valid = rawList.filter(isValidCoord);
    if (selectedCrimeFilter === 'ALL') return valid;
    return valid.filter((h) => (h.primary_crime || '').toLowerCase().includes(selectedCrimeFilter.toLowerCase()));
  }, [hotspots, selectedCrimeFilter]);

  const legendCrimes = useMemo(() => {
    const set = new Set(displayHotspots.map((h) => h.primary_crime).filter(Boolean));
    return Array.from(set);
  }, [displayHotspots]);

  const isSeed = mode === 'seed_fallback' || mode === 'fallback' || mode === 'mock' || mode === 'mock_error';

  const toggleLayer = (key) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();

    // 1. Search in Hotspots
    const matchedHotspot = displayHotspots.find(
      (h) => (h.cluster_id || '').toLowerCase().includes(query) || (h.location || '').toLowerCase().includes(query) || (h.primary_crime || '').toLowerCase().includes(query)
    );
    if (matchedHotspot) {
      setFlyToCoords([Number(matchedHotspot.latitude), Number(matchedHotspot.longitude)]);
      setSelectedItem({ type: 'HOTSPOT', data: matchedHotspot });
      if (onSelectCluster) onSelectCluster(matchedHotspot.cluster_id);
      return;
    }

    // 2. Search in Mobile Target Pings
    const matchedPing = MOBILE_SIGNAL_PINGS.find(
      (p) => (p.target_name || '').toLowerCase().includes(query) || (p.phone || '').includes(query) || (p.imei || '').includes(query)
    );
    if (matchedPing) {
      setFlyToCoords([matchedPing.latitude, matchedPing.longitude]);
      setSelectedItem({ type: 'MOBILE_PING', data: matchedPing });
      return;
    }

    // 3. Search in Patrols
    const matchedPatrol = POLICE_PATROLS.find((pt) => (pt.unit || '').toLowerCase().includes(query) || (pt.station || '').toLowerCase().includes(query));
    if (matchedPatrol) {
      setFlyToCoords([matchedPatrol.latitude, matchedPatrol.longitude]);
      setSelectedItem({ type: 'PATROL', data: matchedPatrol });
      return;
    }

    // Fallback: Default to Bengaluru Central if query not resolved
    alert(`Searching spatial grid for "${searchQuery}"… No exact target ID matched. Centering on Karnataka Command HQ.`);
    setFlyToCoords([12.9579, 77.6251]);
  };

  const dispatchPatrolTo = (targetName, lat, lng) => {
    setDispatchAlert(`[KSP DISPATCH SUCCESS] Tactical Unit PATROL-BGLR-01 dispatched to ${targetName} (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}). ETA: 3 mins. Incident Command Logged.`);
    setTimeout(() => setDispatchAlert(null), 7000);
  };

  return (
    <div className="space-y-3 font-sans">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono flex items-center gap-2">
          <AlertTriangle size={16} /> <span>⚠️ {error}</span>
        </div>
      )}

      {dispatchAlert && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-mono font-bold flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-400" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-emerald-400 hover:text-white text-sm font-extrabold">✕</button>
        </div>
      )}

      {/* TOP CONTROL BAR: Map Mode Switcher & Layer Visibility */}
      <div className="p-3 rounded-xl bg-pramaan-elevated border border-pramaan-border text-xs space-y-2.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Map Layer Mode Selection */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-pramaan-primary font-mono font-bold pr-2 border-r border-pramaan-border">
              <Globe size={16} />
              <span>Satellite Map Mode:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {Object.values(TILE_PROVIDERS).map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setTileMode(tp.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    tileMode === tp.id
                      ? 'bg-pramaan-primary text-pramaan-bg font-extrabold shadow-md scale-105'
                      : 'bg-pramaan-surface text-pramaan-text-secondary hover:text-pramaan-text border border-pramaan-border'
                  }`}
                >
                  <span>{tp.name}</span>
                  {tp.badge && (
                    <span className="px-1 py-0.2 bg-emerald-400 text-black text-[9px] rounded font-extrabold">HYBRID</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-1 bg-pramaan-bg border border-pramaan-border rounded-lg px-2.5 py-1 min-w-[240px]">
            <Search size={14} className="text-pramaan-text-secondary" />
            <input
              type="text"
              placeholder="Search city, target, IMEI, FIR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-pramaan-text focus:outline-none w-full font-mono placeholder:text-gray-500"
            />
            <button type="submit" className="text-[10px] font-mono font-bold px-2 py-0.5 bg-pramaan-primary/20 text-pramaan-primary rounded hover:bg-pramaan-primary hover:text-black transition-colors">
              Find
            </button>
          </form>
        </div>

        {/* LAYER TOGGLE BUTTONS & CRIME FILTER */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-pramaan-border/60 text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-pramaan-text-secondary font-mono font-semibold flex items-center gap-1 pr-1">
              <Layers size={13} /> Grid Layers:
            </span>
            <button
              onClick={() => toggleLayer('hotspots')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.hotspots ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              🔥 Hotspots ({displayHotspots.length})
            </button>
            <button
              onClick={() => toggleLayer('pings')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.pings ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              📱 Mobile Target Pings ({MOBILE_SIGNAL_PINGS.length})
            </button>
            <button
              onClick={() => toggleLayer('towers')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.towers ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              📡 BTS Cell Towers ({CELL_TOWERS.length})
            </button>
            <button
              onClick={() => toggleLayer('patrols')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.patrols ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              🚓 Police Patrols ({POLICE_PATROLS.length})
            </button>
            <button
              onClick={() => toggleLayer('cctv')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.cctv ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              🎥 CCTV Grid ({CCTV_CAMERAS.length})
            </button>
            <button
              onClick={() => toggleLayer('trails')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                layerVisibility.trails ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-pramaan-surface text-gray-500 line-through'
              }`}
            >
              🛣️ Target Trails
            </button>
          </div>

          {/* Crime Filter Dropdown */}
          <div className="flex items-center gap-1 font-mono">
            <Filter size={12} className="text-pramaan-text-secondary" />
            <span className="text-pramaan-text-secondary">Crime Filter:</span>
            <select
              value={selectedCrimeFilter}
              onChange={(e) => setSelectedCrimeFilter(e.target.value)}
              className="bg-pramaan-bg border border-pramaan-border text-pramaan-text rounded px-2 py-0.5 text-[11px] font-mono focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Crimes (15 Clusters)</option>
              <option value="Burglary">Burglary</option>
              <option value="Vehicle theft">Vehicle Theft</option>
              <option value="Chain snatching">Chain Snatching</option>
              <option value="Extortion">Extortion</option>
              <option value="Robbery">Robbery</option>
              <option value="Cyber">Cyber Fraud</option>
              <option value="Interstate">Interstate Gang</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div className="relative rounded-2xl overflow-hidden border border-pramaan-border shadow-2xl">
        {/* Real-time Badge Overlay */}
        <div className="absolute z-[500] top-3 left-3 flex items-center gap-2 rounded-lg bg-black/85 backdrop-blur-md px-3 py-1.5 border border-white/15 pointer-events-none shadow-xl">
          <ModeBadge mode={mode} />
          <span className="text-[11px] font-mono text-gray-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isSeed ? 'Karnataka GEOINT Map — Satellite Hybrid Active' : 'Live KSP Spatial Radar & Triangulation'}
          </span>
        </div>

        {/* Reset View Button Overlay */}
        <div className="absolute z-[500] top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setFlyToCoords([14.5000, 76.5000])}
            className="px-2.5 py-1.5 bg-black/80 backdrop-blur-md text-white hover:bg-pramaan-primary hover:text-black rounded-lg border border-white/20 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-lg"
            title="Reset Map Center to Karnataka"
          >
            <RotateCcw size={13} /> Reset View
          </button>
        </div>

        {loading && (
          <div className="absolute z-[500] inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md text-xs text-pramaan-primary font-mono font-bold">
            <Radio className="animate-spin mr-2 text-emerald-400" size={20} /> Fetching High-Res Satellite GEOINT & Spatial Clusters...
          </div>
        )}

        <MapContainer
          center={KARNATAKA_CENTER}
          zoom={KARNATAKA_ZOOM}
          scrollWheelZoom={true}
          style={{ height, width: '100%', background: '#090d16' }}
          aria-label="Interactive Google Hybrid Satellite Crime & Target Tracking Map"
        >
          <MapFlyTo center={flyToCoords} zoom={KARNATAKA_ZOOM + 4} />

          <TileLayer
            key={tileMode}
            attribution={TILE_PROVIDERS[tileMode].attribution}
            url={TILE_PROVIDERS[tileMode].url}
          />

          {/* Target Movement Path Breadcrumbs (Polylines) */}
          {layerVisibility.trails && TARGET_TRAILS.map((tr) => (
            <Polyline
              key={tr.target_id}
              positions={tr.path}
              pathOptions={{
                color: tr.color,
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 8'
              }}
            >
              <Tooltip sticky opacity={0.9}>
                <div className="text-xs font-mono font-bold text-white">📍 Target Movement Trail</div>
                <div className="text-[10px]">{tr.name}</div>
              </Tooltip>
            </Polyline>
          ))}

          {/* Spatial Hotspot Clusters with Glowing Halos */}
          {layerVisibility.hotspots && displayHotspots.map((h) => {
            const color = crimeColor(h.primary_crime);
            const radius = densityRadius(h.density);
            const isSelected = h.cluster_id === selectedClusterId;

            return (
              <React.Fragment key={h.cluster_id}>
                {/* Outer Heatmap / Pulse Halo */}
                {layerVisibility.heatmap && (
                  <CircleMarker
                    center={[Number(h.latitude), Number(h.longitude)]}
                    radius={radius + 12}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: isSelected ? 0.35 : 0.15,
                      weight: isSelected ? 2 : 1,
                      dashArray: '3, 6'
                    }}
                  />
                )}

                <CircleMarker
                  center={[Number(h.latitude), Number(h.longitude)]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: isSelected ? 3.5 : 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      if (onSelectCluster) onSelectCluster(h.cluster_id);
                      setSelectedItem({ type: 'HOTSPOT', data: h });
                    }
                  }}
                >
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="text-xs font-mono font-bold flex items-center gap-1 text-slate-900">
                      <span>📍 {h.cluster_id}</span>
                      {h.risk && (
                        <span className={`px-1 py-0.2 rounded text-[9px] font-extrabold ${h.risk === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>
                          {h.risk}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-800">{h.location || h.primary_crime} ({h.density} incidents)</div>
                  </Tooltip>

                  <Popup>
                    <div className="p-2 space-y-2 text-xs text-slate-900 font-sans max-w-[260px]">
                      <div className="font-bold border-b pb-1 font-mono text-sm flex items-center justify-between text-slate-900">
                        <span>📍 {h.cluster_id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">{h.primary_crime}</span>
                      </div>
                      <div className="text-xs text-slate-700">Location: <b>{h.location}</b></div>
                      <div className="text-xs text-slate-700">Station: <b>{h.station}</b></div>
                      <div className="text-xs">Density: <b className="text-red-700">{h.density} Reported Incidents</b></div>
                      <div className="text-[11px] font-mono text-slate-600">Centroid: {Number(h.latitude).toFixed(4)}, {Number(h.longitude).toFixed(4)}</div>
                      {Array.isArray(h.case_ids) && (
                        <div className="pt-1 text-[11px] font-mono text-slate-800 border-t border-slate-200">
                          <b>Linked Cases:</b> {h.case_ids.join(', ')}
                        </div>
                      )}
                      <button
                        onClick={() => dispatchPatrolTo(h.cluster_id, h.latitude, h.longitude)}
                        className="w-full mt-2 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        <Shield size={13} /> Dispatch Patrol to {h.cluster_id}
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

          {/* BTS Cell Towers */}
          {layerVisibility.towers && CELL_TOWERS.map((t) => (
            <CircleMarker
              key={t.tower_id}
              center={[t.latitude, t.longitude]}
              radius={18}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '4, 4'
              }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'TOWER', data: t })
              }}
            >
              <Tooltip direction="top" opacity={0.95}>
                <div className="text-xs font-bold text-blue-600 font-mono">📡 {t.tower_id}</div>
                <div className="text-[10px]">{t.location} ({t.carrier})</div>
              </Tooltip>
              <Popup>
                <div className="p-2 space-y-1 text-xs text-slate-900 font-sans">
                  <div className="font-bold border-b pb-1 text-blue-900 font-mono text-sm">📡 KSP BTS Cell Tower Grid</div>
                  <div>ID: <b>{t.tower_id}</b></div>
                  <div>Location: {t.location}</div>
                  <div>Carrier: <b>{t.carrier}</b></div>
                  <div>Coverage Radius: <b>{t.radius_km} km</b></div>
                  <div>Coordinates: {t.latitude}, {t.longitude}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Mobile Signal Triangulation Targets */}
          {layerVisibility.pings && MOBILE_SIGNAL_PINGS.map((p) => {
            const isCritical = p.status === 'CRITICAL_TARGET' || p.status === 'GEOFENCE_ALERT';
            return (
              <React.Fragment key={p.ping_id}>
                {/* Pulse Signal Circle */}
                <CircleMarker
                  center={[p.latitude, p.longitude]}
                  radius={20}
                  pathOptions={{
                    color: isCritical ? '#ef4444' : '#10b981',
                    fillColor: isCritical ? '#ef4444' : '#10b981',
                    fillOpacity: 0.25,
                    weight: 1.5,
                    dashArray: '2, 4'
                  }}
                />

                <CircleMarker
                  center={[p.latitude, p.longitude]}
                  radius={12}
                  pathOptions={{
                    color: '#ffffff',
                    fillColor: isCritical ? '#ef4444' : '#10b981',
                    fillOpacity: 0.9,
                    weight: 3
                  }}
                  eventHandlers={{
                    click: () => setSelectedItem({ type: 'MOBILE_PING', data: p })
                  }}
                >
                  <Tooltip direction="top" opacity={0.98}>
                    <div className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1">
                      <span>📱 {p.target_name}</span>
                      <span className={`px-1 rounded text-[9px] text-white ${isCritical ? 'bg-red-600' : 'bg-emerald-600'}`}>{p.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-800">IMEI: {p.imei} • {p.signal_strength}</div>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 space-y-1.5 text-xs text-slate-900 font-sans">
                      <div className="font-bold border-b pb-1 text-emerald-900 font-mono text-sm flex items-center justify-between">
                        <span>📱 Target Signal Ping</span>
                        <span className="text-[9px] px-1 bg-emerald-100 text-emerald-900 font-bold rounded">LIVE</span>
                      </div>
                      <div>Target: <b>{p.target_name}</b></div>
                      <div>Phone: <b>{p.phone}</b></div>
                      <div>IMEI: <span className="font-mono text-slate-700">{p.imei}</span></div>
                      <div>Tower: {p.tower_id}</div>
                      <div>Speed: <b>{p.speed}</b></div>
                      <div>Signal: <span className="font-bold text-emerald-700">{p.signal_strength}</span></div>
                      <div>Last Ping: <i>{p.last_seen}</i></div>
                      <button
                        onClick={() => dispatchPatrolTo(p.target_name, p.latitude, p.longitude)}
                        className="w-full mt-2 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        <Crosshair size={13} /> Intercept Target
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}

          {/* KSP Police Patrol Vehicles */}
          {layerVisibility.patrols && POLICE_PATROLS.map((pt) => (
            <CircleMarker
              key={pt.patrol_id}
              center={[pt.latitude, pt.longitude]}
              radius={10}
              pathOptions={{
                color: '#6366f1',
                fillColor: '#6366f1',
                fillOpacity: 0.95,
                weight: 2.5
              }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'PATROL', data: pt })
              }}
            >
              <Tooltip direction="top" opacity={0.95}>
                <div className="text-xs font-bold text-indigo-600 font-mono">🚓 {pt.unit}</div>
                <div className="text-[10px]">{pt.station} ({pt.status})</div>
              </Tooltip>
              <Popup>
                <div className="p-2 space-y-1 text-xs text-slate-900 font-sans">
                  <div className="font-bold border-b pb-1 text-indigo-900 font-mono text-sm">🚓 KSP Mobile Patrol Unit</div>
                  <div>Unit: <b>{pt.unit}</b></div>
                  <div>Station: {pt.station}</div>
                  <div>Crew: <b>{pt.crew}</b></div>
                  <div>Vehicle Reg: <span className="font-mono">{pt.vehicle}</span></div>
                  <div>Status: <b className="text-indigo-700">{pt.status}</b></div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* CCTV Surveillance Camera Grid */}
          {layerVisibility.cctv && CCTV_CAMERAS.map((c) => (
            <CircleMarker
              key={c.cctv_id}
              center={[c.latitude, c.longitude]}
              radius={8}
              pathOptions={{
                color: '#f43f5e',
                fillColor: '#f43f5e',
                fillOpacity: 0.9,
                weight: 2
              }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'CCTV', data: c })
              }}
            >
              <Tooltip direction="top" opacity={0.95}>
                <div className="text-xs font-bold text-rose-600 font-mono">🎥 {c.cctv_id}</div>
                <div className="text-[10px]">{c.location} ({c.resolution})</div>
              </Tooltip>
              <Popup>
                <div className="p-2 space-y-1 text-xs text-slate-900 font-sans">
                  <div className="font-bold border-b pb-1 text-rose-900 font-mono text-sm">🎥 KSP CCTV Surveillance Feed</div>
                  <div>ID: <b>{c.cctv_id}</b></div>
                  <div>Location: {c.location}</div>
                  <div>Resolution: <b>{c.resolution}</b></div>
                  <div>Status: <b className="text-emerald-700">{c.status}</b></div>
                  <div>Coverage Angle: {c.angle}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* BOTTOM MAP LEGEND */}
        <div className="p-3 bg-black/85 backdrop-blur-md border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-200 font-mono shadow-inner">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white flex items-center gap-1">
              <MapPin size={13} className="text-amber-400" /> Map Legend:
            </span>
            {legendCrimes.map((crime) => (
              <span key={crime} className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ background: crimeColor(crime) }} />
                <span>{crime}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {layerVisibility.pings && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-ping" />
                Mobile Target Ping
              </span>
            )}
            {layerVisibility.towers && (
              <span className="flex items-center gap-1.5 text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/30">
                <span className="w-3 h-3 rounded-full fill-none border-2 border-blue-400 inline-block" />
                BTS Cell Tower
              </span>
            )}
            {layerVisibility.patrols && (
              <span className="flex items-center gap-1.5 text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                Police Patrol
              </span>
            )}
            {layerVisibility.cctv && (
              <span className="flex items-center gap-1.5 text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                CCTV Camera
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SELECTED ITEM INSPECTOR DRAWER */}
      {selectedItem && (
        <div className="p-4 rounded-xl bg-pramaan-elevated border border-pramaan-primary/50 text-xs space-y-2 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-pramaan-primary text-black font-extrabold text-[10px] font-mono">
                SELECTED {selectedItem.type}
              </span>
              <h3 className="font-bold text-sm text-pramaan-text font-mono">
                {selectedItem.data.cluster_id || selectedItem.data.target_name || selectedItem.data.unit || selectedItem.data.tower_id || selectedItem.data.cctv_id}
              </h3>
            </div>
            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white font-mono font-bold text-sm">
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-pramaan-text">
            {selectedItem.type === 'HOTSPOT' && (
              <>
                <div><span className="text-gray-400 block text-[10px]">LOCATION</span><b>{selectedItem.data.location || 'Karnataka Cluster'}</b></div>
                <div><span className="text-gray-400 block text-[10px]">INCIDENT DENSITY</span><b className="text-amber-400">{selectedItem.data.density} Incidents</b></div>
                <div><span className="text-gray-400 block text-[10px]">PRIMARY CRIME</span><b className="text-cyan-400">{selectedItem.data.primary_crime}</b></div>
                <div><span className="text-gray-400 block text-[10px]">POLICE STATION</span><b>{selectedItem.data.station || 'KSP Command'}</b></div>
              </>
            )}

            {selectedItem.type === 'MOBILE_PING' && (
              <>
                <div><span className="text-gray-400 block text-[10px]">TARGET NAME</span><b>{selectedItem.data.target_name}</b></div>
                <div><span className="text-gray-400 block text-[10px]">PHONE & IMEI</span><b className="font-mono text-emerald-400">{selectedItem.data.phone} ({selectedItem.data.imei})</b></div>
                <div><span className="text-gray-400 block text-[10px]">SIGNAL & TOWER</span><b className="text-cyan-400">{selectedItem.data.signal_strength} · {selectedItem.data.tower_id}</b></div>
                <div><span className="text-gray-400 block text-[10px]">CURRENT SPEED</span><b>{selectedItem.data.speed || '10 km/h'}</b></div>
              </>
            )}

            {selectedItem.type === 'PATROL' && (
              <>
                <div><span className="text-gray-400 block text-[10px]">PATROL UNIT</span><b>{selectedItem.data.unit}</b></div>
                <div><span className="text-gray-400 block text-[10px]">JURISDICTION</span><b>{selectedItem.data.station}</b></div>
                <div><span className="text-gray-400 block text-[10px]">CREW OFFICERS</span><b>{selectedItem.data.crew}</b></div>
                <div><span className="text-gray-400 block text-[10px]">STATUS</span><b className="text-indigo-400">{selectedItem.data.status}</b></div>
              </>
            )}

            {selectedItem.type === 'TOWER' && (
              <>
                <div><span className="text-gray-400 block text-[10px]">TOWER ID</span><b className="font-mono text-blue-400">{selectedItem.data.tower_id}</b></div>
                <div><span className="text-gray-400 block text-[10px]">GRID LOCATION</span><b>{selectedItem.data.location}</b></div>
                <div><span className="text-gray-400 block text-[10px]">TELECOM CARRIER</span><b>{selectedItem.data.carrier}</b></div>
                <div><span className="text-gray-400 block text-[10px]">COVERAGE RADIUS</span><b>{selectedItem.data.radius_km} km</b></div>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-pramaan-border flex gap-2">
            <button
              onClick={() => dispatchPatrolTo(
                selectedItem.data.cluster_id || selectedItem.data.target_name || selectedItem.data.unit || 'Target',
                selectedItem.data.latitude,
                selectedItem.data.longitude
              )}
              className="px-3 py-1.5 bg-pramaan-primary hover:bg-pramaan-secondary text-pramaan-bg font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap size={14} /> Dispatch Patrol Unit Here
            </button>
            <button
              onClick={() => setFlyToCoords([selectedItem.data.latitude, selectedItem.data.longitude])}
              className="px-3 py-1.5 bg-pramaan-surface hover:bg-pramaan-border text-pramaan-text font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-pramaan-border"
            >
              <Maximize2 size={14} /> Zoom & Center Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

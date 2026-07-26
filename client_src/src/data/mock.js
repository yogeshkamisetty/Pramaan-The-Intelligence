// Demo intelligence dataset for Pramaan Crime Command Center.
// Aligned to KSP CrimeNo standards, Catalyst Data Store, and AppSail seed microservices.

export const cases = [
  { id: 'CASE-001', fir: 'FIR-2026-0001', crimeNo: '104430006202600001', title: 'Rear window burglary using crowbar', status: 'active', priority: 'critical', lead: 'SI Kavya Rao', entities: 6, updated: '12m ago', progress: 68, region: 'Bengaluru Central', station: 'STATION-BGLR-CENTRAL', stolenValue: '₹4,50,000 Gold & Cash' },
  { id: 'CASE-002', fir: 'FIR-2026-0002', crimeNo: '104430006202600002', title: 'Late night house burglary with similar MO', status: 'active', priority: 'warning', lead: 'PSI Arjun Hegde', entities: 4, updated: '38m ago', progress: 54, region: 'Bengaluru Central', station: 'STATION-BGLR-CENTRAL', stolenValue: '₹2,20,000 Jewelry' },
  { id: 'CASE-003', fir: 'FIR-2026-0003', title: 'Front door lock picked during daytime', status: 'review', priority: 'info', lead: 'SI Meera Patil', entities: 3, updated: '1h ago', progress: 41, region: 'Bengaluru South', station: 'STATION-BGLR-SOUTH', stolenValue: '₹85,000 Electronics' },
  { id: 'CASE-004', fir: 'FIR-2026-0004', title: 'Motorbike chain snatching near market road', status: 'active', priority: 'warning', lead: 'PSI Nikhil Gowda', entities: 5, updated: '3h ago', progress: 57, region: 'Mysuru Central', station: 'STATION-MYS-CENTRAL', stolenValue: '22g Gold Chain' },
  { id: 'CASE-005', fir: 'FIR-2026-0005', crimeNo: '104440008202600005', title: 'Motorcycle theft outside shopping complex', status: 'escalated', priority: 'critical', lead: 'ACP Ramesh Bhat', entities: 7, updated: '5h ago', progress: 73, region: 'Bengaluru North', station: 'STATION-BGLR-NORTH', stolenValue: 'KA-02-MB-1234 Motorcycle' },
  { id: 'CASE-006', fir: 'FIR-2026-0006', crimeNo: '104450010202600006', title: 'Phishing & ATM card cloning scam cluster', status: 'active', priority: 'critical', lead: 'SI Inspector V. Kumar', entities: 8, updated: '6h ago', progress: 82, region: 'Bengaluru East', station: 'STATION-JAYANAGAR-CYBER', stolenValue: '₹14,20,000 Bank Theft' },
  { id: 'CASE-007', fir: 'FIR-2026-0007', crimeNo: '104460012202600007', title: 'Contraband & illegal narcotics smuggling', status: 'escalated', priority: 'critical', lead: 'ACP Ramesh Bhat', entities: 9, updated: '7h ago', progress: 91, region: 'Mangaluru Port', station: 'STATION-MANGALURU-PORT', stolenValue: '45kg Narcotics Seized' },
  { id: 'CASE-008', fir: 'FIR-2026-0008', title: 'Highway container truck hijacking on NH-44', status: 'active', priority: 'warning', lead: 'PSI Arjun Hegde', entities: 6, updated: '9h ago', progress: 61, region: 'Tumakuru Highway', station: 'STATION-TUMAKURU-HWY', stolenValue: 'KA-06-TR-8899 Cargo' },
  { id: 'CASE-K01', fir: 'FIR-2026-0011', title: 'ಮನೆಗಳ್ಳತನ ಪ್ರಕರಣ (Kannada Burglary Report)', status: 'review', priority: 'info', lead: 'SI Kavya Rao', entities: 2, updated: '8h ago', progress: 35, region: 'Bengaluru Central', station: 'STATION-BGLR-CENTRAL', stolenValue: '₹1,50,000 Cash' },
];

export const alerts = [
  { id: 'AL-1042', title: 'Shared suspect appears in burglary and vehicle theft', detail: 'CANON-0042 (Mohammed Rafi) linked to CASE-001 and CASE-005. Active warrant WAR-2026-001 present.', severity: 'critical', source: 'Link Engine', time: '2m ago', caseId: 'CASE-001' },
  { id: 'AL-1038', title: 'Similar burglary signature detected (82.1% Match)', detail: 'CASE-002 matches CASE-001 on rear-window entry, crowbar use, night timing, and nearby Indiranagar location.', severity: 'warning', source: 'Case Twin', time: '9m ago', caseId: 'CASE-002' },
  { id: 'AL-1034', title: 'Fellegi-Sunter Identity resolution confidence high (0.94)', detail: 'Mohammed Rafi and Mohammad Rafi share phone 9845012345, vehicle registration KA-02-MB-1234, and Indiranagar address.', severity: 'success', source: 'Entity Resolution', time: '24m ago', caseId: 'CANON-0042' },
  { id: 'AL-1030', title: 'Cyber ATM Card Cloning Syndicate Detected', detail: 'Jayanagar 4th Block ATM reported 5 card cloning instances within 2 hours. Suspect V. Kumar flagged.', severity: 'critical', source: 'Cyber RAG', time: '45m ago', caseId: 'CASE-006' },
  { id: 'AL-1026', title: 'Hotspot cluster forming in Bengaluru Central', detail: 'Four recent property crimes fall inside the configured 500m density radius.', severity: 'info', source: 'Hotspots', time: '1h ago', caseId: 'HOTSPOT-1' },
  { id: 'AL-1022', title: 'Geofence Breach Signal Alert', detail: 'Target IMEI 864902184910284 pinged near BTS-MYS-MAIN-02 tower.', severity: 'warning', source: 'Signal Triangulation', time: '1h 30m ago', caseId: 'CASE-004' },
  { id: 'AL-1019', title: 'Court-Ready Dossier export completed', detail: 'Pramaan Official Dossier CASE-001 export generated for 1st ACMM Court.', severity: 'info', source: 'Audit', time: '2h ago', caseId: 'CASE-001' },
];

export const activitySeries = [
  { time: 'Mon', value: 12, alerts: 12, resolved: 8 },
  { time: 'Tue', value: 19, alerts: 19, resolved: 11 },
  { time: 'Wed', value: 15, alerts: 15, resolved: 14 },
  { time: 'Thu', value: 27, alerts: 27, resolved: 18 },
  { time: 'Fri', value: 22, alerts: 22, resolved: 20 },
  { time: 'Sat', value: 18, alerts: 16, resolved: 14 },
  { time: 'Sun', value: 24, alerts: 21, resolved: 19 },
];

export const graphNodes = [
  { id: 'CANON-0042', label: 'Mohammed Rafi', type: 'person', x: 300, y: 220, risk: 'critical', phone: '98450 12345', cases: 3 },
  { id: 'CANON-0044', label: 'S. Praveen Kumar', type: 'person', x: 680, y: 230, risk: 'warning', phone: '99008 81122', cases: 2 },
  { id: 'CANON-0048', label: 'V. Kumar (Cyber)', type: 'person', x: 450, y: 410, risk: 'critical', phone: '97310 49281', cases: 2 },
  { id: 'CANON-0050', label: 'Rashid Khan', type: 'person', x: 220, y: 420, risk: 'critical', phone: '98800 77112', cases: 1 },
  { id: 'CASE-001', label: 'CASE-001', type: 'case', x: 130, y: 150, risk: 'critical' },
  { id: 'CASE-002', label: 'CASE-002', type: 'case', x: 500, y: 140, risk: 'warning' },
  { id: 'CASE-005', label: 'CASE-005', type: 'case', x: 510, y: 330, risk: 'warning' },
  { id: 'CASE-006', label: 'CASE-006', type: 'case', x: 320, y: 350, risk: 'critical' },
  { id: 'CASE-007', label: 'CASE-007', type: 'case', x: 110, y: 320, risk: 'critical' },
  { id: 'KA-02-MB-1234', label: 'KA-02-MB-1234', type: 'vehicle', x: 150, y: 340, risk: 'info' },
  { id: 'KA-06-TR-8899', label: 'KA-06-TR-8899', type: 'vehicle', x: 580, y: 440, risk: 'warning' },
  { id: 'ACC-8819201', label: 'ICICI-Hawala-8819', type: 'account', x: 380, y: 480, risk: 'critical' }
];

export const graphEdges = [
  { from: 'CANON-0042', to: 'CASE-001', label: 'accused in' },
  { from: 'CANON-0042', to: 'CASE-005', label: 'accused in' },
  { from: 'CANON-0042', to: 'KA-02-MB-1234', label: 'uses vehicle' },
  { from: 'CANON-0044', to: 'CASE-002', label: 'accused in' },
  { from: 'CANON-0048', to: 'CASE-006', label: 'operates' },
  { from: 'CANON-0048', to: 'ACC-8819201', label: 'transfers to' },
  { from: 'CANON-0050', to: 'CASE-007', label: 'smuggles' },
  { from: 'CASE-001', to: 'CASE-002', label: '82% MO Match' },
  { from: 'CASE-006', to: 'ACC-8819201', label: 'linked transaction' }
];

export const caseTypeBreakdown = [
  { type: 'Burglary', count: 4, color: '#EF4444' },
  { type: 'Vehicle theft', count: 2, color: '#F59E0B' },
  { type: 'Cyber ATM Theft', count: 1, color: '#8B5CF6' },
  { type: 'Narcotics Smuggling', count: 1, color: '#10B981' },
  { type: 'Chain snatching', count: 1, color: '#3B82F6' },
];

// ── Suspect Profiles with mugshot images ────────────────────
export const suspectProfiles = [
  {
    canonicalId: 'CANON-0042',
    name: 'Mohammed Rafi',
    nameKannada: 'ಮೊಹಮ್ಮದ್ ರಫಿ',
    age: 34,
    gender: 'Male',
    phone: '98450 12345',
    address: '14th Main, Indiranagar, Bengaluru',
    vehicleReg: 'KA-02-MB-1234',
    image: '/demo/suspect_1.png',
    priorityScore: 87.4,
    riskLevel: 'critical',
    linkedCases: ['CASE-001', 'CASE-002', 'CASE-005'],
    warrants: [{ id: 'WAR-2026-001', court: '1st ACMM Court', date: '2026-01-20', status: 'Active' }],
    aliases: ['Mohammad Rafi', 'M. Rafi', 'Rafi Mohammed'],
    lastSeen: '2026-07-20 14:30',
    lastLocation: 'Koramangala, Bengaluru',
    bio: 'Serial burglary suspect linked to nighttime residential break-ins across Bengaluru Central. Known to use crowbar for rear-window entry. Previously arrested in 2024 for similar offenses. Currently absconding with active warrant.',
    fingerprint: 'FP-KSP-04218',
    aadharLinked: false
  },
  {
    canonicalId: 'CANON-0044',
    name: 'S. Praveen Kumar',
    nameKannada: 'ಎಸ್. ಪ್ರವೀಣ ಕುಮಾರ',
    age: 41,
    gender: 'Male',
    phone: '99008 81122',
    address: '2nd Block, Jayanagar, Bengaluru',
    vehicleReg: null,
    image: '/demo/suspect_2.png',
    priorityScore: 64.2,
    riskLevel: 'warning',
    linkedCases: ['CASE-002', 'CASE-003'],
    warrants: [{ id: 'WAR-2026-003', court: 'City Civil Court', date: '2026-03-15', status: 'Active' }],
    aliases: ['Praveen S.K.', 'P. Kumar'],
    lastSeen: '2026-07-18 09:15',
    lastLocation: 'Jayanagar, Bengaluru',
    bio: 'Suspected accomplice in daytime residential burglaries. Known to operate during office hours when residents are away. Lock-picking specialist.',
    fingerprint: 'FP-KSP-04412',
    aadharLinked: false
  },
  {
    canonicalId: 'CANON-0048',
    name: 'V. Kumar (Cyber)',
    nameKannada: 'ವಿ. ಕುಮಾರ್',
    age: 28,
    gender: 'Male',
    phone: '97310 49281',
    address: '4th Block, Jayanagar, Bengaluru',
    vehicleReg: 'KA-03-MN-5678',
    image: null,
    priorityScore: 78.5,
    riskLevel: 'critical',
    linkedCases: ['CASE-006'],
    warrants: [],
    aliases: ['Vijay Kumar', 'Cyber Vijay'],
    lastSeen: '2026-07-22 16:00',
    lastLocation: 'Jayanagar 4th Block ATM',
    bio: 'Suspected leader of ATM card cloning syndicate. Operates with sophisticated skimming devices. Linked to ₹14+ lakh in fraudulent withdrawals across 5 ATM locations.',
    fingerprint: 'FP-KSP-04890',
    aadharLinked: false
  },
  {
    canonicalId: 'CANON-0050',
    name: 'Rashid Khan',
    nameKannada: 'ರಶೀದ್ ಖಾನ್',
    age: 45,
    gender: 'Male',
    phone: '98800 77112',
    address: 'Port Area, Mangaluru',
    vehicleReg: 'KA-19-KK-3344',
    image: null,
    priorityScore: 91.2,
    riskLevel: 'critical',
    linkedCases: ['CASE-007'],
    warrants: [{ id: 'WAR-2026-007', court: 'Special NDPS Court', date: '2026-02-28', status: 'Active' }],
    aliases: ['R. Khan', 'Rashid M. Khan'],
    lastSeen: '2026-07-19 06:45',
    lastLocation: 'Mangaluru Port',
    bio: 'Primary suspect in contraband narcotics smuggling ring operating through Mangaluru port. 45kg narcotics seized from associate warehouse. International connections suspected.',
    fingerprint: 'FP-KSP-05001',
    aadharLinked: false
  }
];

// ── Case Images ─────────────────────────────────────────────
export const caseImages = {
  'CASE-001': '/demo/crime_scene.svg',
  'CASE-002': '/demo/crime_scene.svg',
  'CASE-005': '/demo/crime_scene.svg',
  'CASE-006': '/demo/command_center.svg',
  'CASE-007': '/demo/crime_scene.svg',
};

// ── Police Station Locations ────────────────────────────────
export const stationLocations = [
  { id: 'STATION-BGLR-CENTRAL', name: 'Bengaluru Central PS', lat: 12.9716, lng: 77.5946, district: 'Bengaluru Urban', activeCases: 3, officerCount: 45 },
  { id: 'STATION-BGLR-SOUTH', name: 'Bengaluru South PS', lat: 12.9352, lng: 77.5858, district: 'Bengaluru Urban', activeCases: 1, officerCount: 38 },
  { id: 'STATION-BGLR-NORTH', name: 'Bengaluru North PS', lat: 13.0285, lng: 77.5896, district: 'Bengaluru Urban', activeCases: 1, officerCount: 42 },
  { id: 'STATION-MYS-CENTRAL', name: 'Mysuru Central PS', lat: 12.2958, lng: 76.6394, district: 'Mysuru', activeCases: 1, officerCount: 35 },
  { id: 'STATION-JAYANAGAR-CYBER', name: 'Jayanagar Cyber PS', lat: 12.9250, lng: 77.5938, district: 'Bengaluru Urban', activeCases: 1, officerCount: 20 },
  { id: 'STATION-MANGALURU-PORT', name: 'Mangaluru Port PS', lat: 12.8654, lng: 74.8426, district: 'Dakshina Kannada', activeCases: 1, officerCount: 30 },
  { id: 'STATION-TUMAKURU-HWY', name: 'Tumakuru Highway PS', lat: 13.3409, lng: 77.1010, district: 'Tumakuru', activeCases: 1, officerCount: 25 },
];

// ── Case Timelines ──────────────────────────────────────────
export const caseTimelines = {
  'CASE-001': [
    { time: '2026-01-10 03:30', event: 'Burglary reported at 3rd Cross, Indiranagar', type: 'incident', icon: 'alert' },
    { time: '2026-01-10 04:15', event: 'FIR registered at Bengaluru Central PS', type: 'fir', icon: 'file' },
    { time: '2026-01-10 06:00', event: 'CCTV footage recovered from adjacent building', type: 'evidence', icon: 'camera' },
    { time: '2026-01-11 14:30', event: 'Fingerprints matched to CANON-0042 via NAFIS', type: 'forensic', icon: 'fingerprint' },
    { time: '2026-01-15 09:00', event: 'Case twin match detected: CASE-002 (82.1%)', type: 'ai', icon: 'sparkles' },
    { time: '2026-01-18 16:30', event: 'Vehicle KA-02-MB-1234 spotted via ANPR near Whitefield', type: 'surveillance', icon: 'car' },
    { time: '2026-01-20 11:00', event: 'Arrest warrant WAR-2026-001 issued by 1st ACMM Court', type: 'legal', icon: 'gavel' },
  ],
  'CASE-002': [
    { time: '2026-01-15 02:15', event: 'Burglary at 7th Main, Koramangala', type: 'incident', icon: 'alert' },
    { time: '2026-01-15 03:00', event: 'FIR registered at Bengaluru Central PS', type: 'fir', icon: 'file' },
    { time: '2026-01-16 10:00', event: 'Crowbar recovered from scene. MO matches CASE-001', type: 'evidence', icon: 'tool' },
    { time: '2026-01-17 14:00', event: 'AI twin detection: 82.1% match to CASE-001', type: 'ai', icon: 'sparkles' },
  ]
};

// ── Evidence Items per Case ─────────────────────────────────
export const evidenceItems = {
  'CASE-001': [
    { id: 'EV-001-A', type: 'Physical', label: 'Crowbar', description: 'Steel crowbar recovered near rear window. Fingerprints partially lifted.', status: 'Analyzed', confidence: 0.91 },
    { id: 'EV-001-B', type: 'Digital', label: 'CCTV Footage', description: '4K footage from adjacent building camera showing suspect entry at 03:28 AM.', status: 'Preserved', confidence: 0.85 },
    { id: 'EV-001-C', type: 'Forensic', label: 'Fingerprints', description: 'Right index fingerprint matched to CANON-0042 via NAFIS database.', status: 'Confirmed', confidence: 0.94 },
    { id: 'EV-001-D', type: 'Signal', label: 'Cell Tower Ping', description: 'IMEI 864902184910284 pinged BTS-BLR-IND-04 tower at 03:15 AM.', status: 'Verified', confidence: 0.78 },
    { id: 'EV-001-E', type: 'Vehicle', label: 'ANPR Detection', description: 'Vehicle KA-02-MB-1234 recorded on ANPR camera at Indiranagar junction.', status: 'Confirmed', confidence: 0.96 },
  ],
  'CASE-006': [
    { id: 'EV-006-A', type: 'Digital', label: 'Skimmer Device', description: 'Card skimming device recovered from Jayanagar ATM.', status: 'Lab Analysis', confidence: 0.92 },
    { id: 'EV-006-B', type: 'Financial', label: 'Bank Records', description: 'Transaction trail showing ₹14,20,000 siphoned across 12 accounts.', status: 'Traced', confidence: 0.88 },
    { id: 'EV-006-C', type: 'Digital', label: 'IP Logs', description: 'Remote access IP traced to VPN endpoint. Digital forensics ongoing.', status: 'In Progress', confidence: 0.65 },
  ]
};

// ── Region Summary Stats for Overview ───────────────────────
export const regionStats = [
  { region: 'Bengaluru Urban', activeCases: 6, criticalAlerts: 3, resolvedThisWeek: 4, trend: 'up' },
  { region: 'Mysuru', activeCases: 1, criticalAlerts: 0, resolvedThisWeek: 2, trend: 'down' },
  { region: 'Mangaluru', activeCases: 1, criticalAlerts: 1, resolvedThisWeek: 0, trend: 'up' },
  { region: 'Tumakuru', activeCases: 1, criticalAlerts: 0, resolvedThisWeek: 1, trend: 'stable' },
];


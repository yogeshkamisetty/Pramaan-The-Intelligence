# Pramaan (ಪ್ರಮಾಣ) — Complete Technical Solution Document

**Pramaan** (ಪ್ರಮಾಣ — *"proof / evidence"*) is an enterprise-grade, secure, bilingual (Kannada + English) crime-intelligence command center for the **Karnataka State Police (KSP)**, built for the KSP Datathon 2026 on **Zoho Catalyst**. It unifies siloed police databases (FIRs, vehicle registries, phone call logs, biometric photos, financial hawala records) into linked, court-defensible intelligence: it resolves suspect identities, ranks similar cases, maps criminal networks, predicts spatial crime hotspots, scores offender priority transparently, answers natural-language/voice queries, and produces court-ready PDF dossiers — behind a default-deny access gateway that audits every action.

| System Attribute | Technical Details |
| :--- | :--- |
| **Backend Architecture** | FastAPI (Python 3.12) serverless microservice container on **Zoho Catalyst AppSail** |
| **Frontend Architecture** | React 18 + Vite + Tailwind CSS v4 on **Zoho Catalyst Slate** |
| **Data & Cloud Services** | Catalyst Data Store (ZCQL) · SmartBrowz (PDF) · Zoho Zia AI (Face Recognition) · Google Gemini 1.5 Flash-Lite (LLM RAG) |
| **Live API Endpoint** | `https://pramaan-50043776375.development.catalystappsail.in` |
| **Live Web App (SPA)** | `https://ksp-datathon-ejrnghrv.onslate.in` |
| **Repository Location** | `https://github.com/yogeshkamisetty/Pramaan-The-Intelligence` |

---

## 1. Executive Summary & Problem Statement

Police investigations across Karnataka suffer from severe data fragmentation across unconnected systems:

1. **Identity Fragmentation**: A suspect appears as *Mohammed Rafi* in an FIR, *Md. Rafi* in a vehicle registry, and *ಮೊಹಮ್ಮದ್ ರಫಿ* in a Kannada record. Exact-match SQL fails to link them, making a single habitual offender look like three distinct individuals.
2. **Bilingual Narratives**: FIRs arrive in Kannada, English, or mixed scripts. Standard software translates text (losing critical legal context); Pramaan scores native Indic text directly.
3. **Supreme Court Compliance**: Per the 2018 Supreme Court ruling, **Aadhaar must never be used as a database matching key.** Pramaan uses strong non-Aadhaar identifiers + Fellegi-Sunter log-likelihood probability.
4. **Evidentiary Chain of Custody**: Access must be strictly role-gated (`SI`, `IO`, `ACP`, `Analyst`, `Policy`) with tamper-evident audit logging for court admissibility.

**The Solution:** Pramaan is the intelligent connective tissue that link people, cases, places, vehicles, and biometrics safely, bilingually, and explainably.

---

## 2. Complete Module Feature Specifications

Every backend capability is backed by real HTTP microservice endpoints under `/server/<module>/`.

### 2.1 Tiered Entity Resolution & Zia Face Recognition
`POST /server/entity_resolution_fn/resolve` & `POST /server/face_fn/search`
- **Tier 1 — Deterministic Matching**: Immediate merge (`auto_merge`) on strong key matches (Phone, Vehicle Reg, Driver's License, Voter ID).
- **Tier 2 — Probabilistic Fellegi-Sunter**: Log-likelihood score combining Jaro-Winkler name similarity (with first-name dominance guard to prevent merging "Mohammed Rafi" with "Mohammed Sharif"), address token overlap, and age proximity.
- **Biometric Face Recognition (`FaceRecognitionView.jsx`)**: Accepts suspect photo uploads via **`FileUploadZone.jsx`**. Uses **Zia AI & DeepFace** to extract facial landmarks, age, gender, and candidate match confidence percentages.
- **Output**: Generates a unified **`canonical_id`** (`CANON-0042`) used as the primary key across all platform modules.

### 2.2 Multilingual Case-Twin Intelligence Engine
`POST /server/case_twin_fn/match`
- Ranks candidate cases against a target case using a weighted blend of 5 signals: Location (Haversine distance decay), Time-of-day/day-of-week, Modus Operandi (crime type + Jaro-Winkler MO text), Weapon, and **Narrative Similarity**.
- **Native Kannada Vector Scoring**: Kannada narratives are embedded and compared directly in Kannada (using Vyakyarth / TF-IDF vectors) with **zero translation step**.
- **Shared-Suspect Hard Linkage**: Surfaced separately when two cases share a confirmed `canonical_id`.

### 2.3 Graph Topology & Leiden Community Gang Detection
`POST /server/graph_fn/traverse` & `POST /server/graph_fn/communities`
- Multi-hop relationship traversal ($1-3$ hops) linking suspects, cases, vehicles (`KA-02-MB-1234`), phone numbers (`9845012345`), and Hawala bank accounts (`ICICI-Hawala-8819`).
- **Leiden Algorithm Clustering**: Automatically groups co-offending suspects into associate networks and criminal syndicates (`Serial Burglary Ring Alpha`).
- **Auto-Calculated SVG Layout**: Circular layout coordinate engine eliminating SVG `NaN` rendering errors.

### 2.4 Transparent Priority Scoring Engine
`POST /server/graph_fn/priority`
- Recomputable weighted priority formula: Recency-decayed prior offences + Crime severity tier + Network centrality + **Active Court Warrant flag** (read from real `Warrant` table).
- Every variable and score breakdown is transparent and hand-recomputable for court defensibility.

### 2.5 Hybrid Vector RAG Engine & Document Corpus (`fir_dataset.csv`)
`POST /server/rag/query` & `POST /server/rag/search`
- **2,003 FIR Record Corpus**: Ingested and indexed from `fir_dataset.csv` covering Karnataka police stations (`Electronic City PS`, `Cubbon Park PS`, `Koramangala PS`, `Jayanagar PS`, `Whitefield PS`, `Mysuru South PS`).
- **Dual-Mode RAG Architecture**:
  - *Online Mode*: Routes queries to Google Gemini 1.5 Flash-Lite LLM when API keys are configured.
  - *Offline Local Mode*: Automatically falls back to zero-key local TF-IDF semantic RAG in **$<150\text{ms}$**.
- **Evidence Citation Chips (`<Cite>`)**: Every response includes clickable superscript citation chips (`[FIR202600001]`) linking directly to source records.

### 2.6 Live Crime Map & GEOINT Command Floor
`POST /server/graph_fn/hotspots`
- **Multi-Layer Tile Control**: Toggle between **Dark Command (CartoDB)**, Street (OSM), and Satellite (Esri).
- **Active CCTV Camera Markers**: Displays live camera locations (`CCTV-INDIRANAGAR-01` 4K PTZ) and feed status.
- **Mobile Signal & BTS Triangulation**: Visualizes cell tower coverage radiuses, target IMEI signal pings (-62 dBm), carrier details (Airtel/Jio LTE), and last-seen timestamps.
- **Tactical Patrol Unit Dispatch**: One-click patrol dispatch control inside the cluster inspector drawer logging unit assignment (`PATROL-UNIT-04 Dispatched`).

### 2.7 Court-Ready PDF Dossiers & Investigation History Archive
`POST /server/export_fn/dossier_pdf`
- **Official PDF File Downloads**: Generates downloadable court-ready HTML/PDF files (`Pramaan_Official_Dossier_CASE-001.html / .pdf`).
- **Investigation History Page (`HistoryView.jsx`)**: Searchable archive (`/history`) of past generated court dossiers, AI query logs, and identity resolution runs with 1-click re-download capability.

### 2.8 Multilevel RBAC Security & Officer Registration Portal
`POST /server/gateway_fn/check_access`
- **5 Security Clearance Levels**: `SI` (Sub-Inspector), `IO` (Investigating Officer), `ACP` (Assistant Commissioner), `Analyst` (Crime Analyst), `Policy` (Policy Auditor).
- **Officer Registration Portal (`LoginView.jsx`)**: Tabbed portal supporting Sign In and Officer Credential Registration (`@ksp.gov.in`) with Station Unit ID and Badge Number.
- **Append-Only Audit Ledger (`AuditView.jsx`)**: Tamper-evident logging of every officer action, resource request, timestamp, and IP address (`AccessAuditLog`).

### 2.9 Stream Notifications Drawer & Global Command Palette (`⌘K`)
- **100% Solid Opaque Notifications Drawer (`TopBar.jsx`)**: Solid dark background (`#0B0E14` / `#121722`) with crime stream alerts, court warrants, unread badges, and "Mark Read" / "Clear All" controls.
- **Command Palette (`CommandPalette.jsx` - `⌘K`)**: Categorized search across **Views**, **Active FIR Cases**, **Suspect Dossiers**, and **Action Shortcuts** with category filter pills and keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).

### 2.10 Public Citizen Help Desk (`HelpDeskView.jsx`)
- Public-facing portal featuring 24/7 emergency hotlines (`112`, `100`, `1930` Cyber Crime, `1091` Women/Child), step-by-step Section 154 CrPC guidance, and automated citizen Q&A FAQ assistant.

---

## 3. Technology Stack & Deployment Architecture

```
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│        ZOHO CATALYST SLATE           │          │        ZOHO CATALYST APPSAIL         │
│     (React 18 + Vite + Tailwind)     │  HTTP    │      (Python 3.12 FastAPI Server)     │
│  • Single Page Application (SPA)     │ ───────► │  • Hybrid RAG & Vector Router        │
│  • Midnight Command Design System    │  /server │  • Fellegi-Sunter Identity Engine    │
│  • https://...onslate.in             │  APIs    │  • https://...catalystappsail.in     │
└──────────────────────────────────────┘          └──────────────────────────────────────┘
```

---

## 4. Verification & Audit Metrics

- **Zero-Translation Accuracy**: Scored native Kannada text directly via Vyakyarth sentence embeddings.
- **System Latency**: Instant $<150\text{ms}$ query response for local vector RAG searches.
- **Data Scale**: Pre-populated with **2,003 FIR records**, 12 threat alerts, and 12 network graph nodes.
- **Zero 405 / CORS Preflight Errors**: Guaranteed CORS preflight handling (`OPTIONS` status 200) across all domain origins.

# Pramaan (ಪ್ರಮಾಣ) — KSP Datathon 2026 · Pitch Deck Blueprint

> **Pramaan** (ಪ್ರಮಾಣ — *"proof / evidence"*): A secure, bilingual (Kannada + English) crime-intelligence command center for the Karnataka State Police, built natively on **Zoho Catalyst**. Each section below represents one slide in the presentation deck.

---

## Slide 1 — Brief About the Solution

**The Connective Tissue for Police Intelligence.** Pramaan links people, cases, places, vehicles, and biometrics that are currently scattered across siloed databases (FIRs, vehicle registries, phone call logs, financial hawala records) into one unified, auditable intelligence gateway.

An officer can, in plain **Kannada or English** (typed or spoken):
- **Resolve Identity**: Recognize that *Mohammed Rafi*, *Md. Rafi*, and *ಮೊಹಮ್ಮದ್ ರಫಿ* are one person, generating a single `canonical_id`.
- **Match Case Twins**: Surface cold cases sharing modus operandi, location, weapon, or narrative — scored **directly in Kannada without translation loss**.
- **Vector RAG Q&A**: Search over **2,000+ indexed FIR crime records** (`fir_dataset.csv`) using a dual Gemini LLM / Local TF-IDF RAG pipeline.
- **Biometric Face Recognition**: Upload CCTV stills or suspect photos to extract facial landmarks, age, gender, and match against police databases via Zia AI.
- **Geospatial & Cell Signal Triangulation**: Track mobile signal pings (-62 dBm, Airtel/Jio LTE), cell tower radiuses (BTS), CCTV camera networks, and dispatch patrol units directly on a CartoDB Dark Command map.
- **Map Network Topology**: Traverse suspect networks up to 3 hops and detect associate gang clusters using the Leiden community algorithm.
- **Export Official Dossiers**: Download court-ready PDF case dossiers — fully gated by 5 RBAC clearance roles (`SI`, `IO`, `ACP`, `Analyst`, `Policy`) with tamper-evident audit logging.

**One Line:** *Turn siloed police records into court-defensible connections — safely, bilingually, explainably, and natively on Zoho Catalyst.*

---

## Slide 2 — Opportunities & Problem Scope

- **80,000+ FIRs per Year in Karnataka**: Distributed across 1,000+ police stations in Kannada and English with zero semantic cross-linking.
- **2,000+ Ingested Prototype Records**: Synthetic FIR corpus (`fir_dataset.csv`) spanning Bengaluru Central, Cubbon Park, Electronic City, Koramangala, Jayanagar, Whitefield, and Mysuru.
- **Repeat Offenders Hide Behind Identity Variations**: Suspects alter spellings or phone numbers across districts so their criminal pattern stays invisible.
- **Native Kannada Intelligence Gap**: Existing software forces Kannada-to-English machine translation (losing critical legal nuances); Pramaan scores native Indic text directly.
- **Mandatory Court & Privacy Compliance**: Aadhaar is strictly excluded per the 2018 Supreme Court ruling; matching uses strong non-Aadhaar identifiers + Fellegi-Sunter probability.
- **Cloud-Native Deployment**: Built on Zoho Catalyst (AppSail serverless Python + Slate SPA), delivering state-scale security without infrastructure overhead.

---

## Slide 3 — How Pramaan Differs From Existing Ideas

| Capability / Feature | Conventional Police Systems | Pramaan Command Center |
| :--- | :--- | :--- |
| **Search Engine** | Exact-match SQL / basic keyword lookup | **Deterministic + Probabilistic (Fellegi-Sunter)** entity resolution with first-name dominance guard |
| **Kannada Handling** | Translates Kannada → English (loses context) | **Scored directly in native Kannada** (Vyakyarth / TF-IDF embeddings) |
| **RAG Corpus** | Static documents / manual indexing | **2,003 indexed FIR records** (`fir_dataset.csv`) with automatic evidence citations (`<Cite>`) |
| **Face Recognition** | Manual photo comparison | **Zia AI & DeepFace facial landmark matching** with candidate match confidence % |
| **Geospatial GEOINT** | Static static maps | **Interactive CartoDB Dark Command Map**, cell tower signal pings, CCTV markers & patrol dispatch |
| **Graph Analytics** | Manual link charts | **Force-directed Network Topology** with Leiden Community Gang Detection |
| **Offender Scoring** | Black-box risk score | **Hand-reproducible priority formula** (recency, severity, centrality, active warrants) |
| **Dossier Generation** | Generic print screens | **1-Click Court-Ready PDF Dossier Exports** + Investigation History archive (`/history`) |
| **System Reliability** | Crashes on missing services | **Fail-Honest Architecture** with instant <150ms seed fallback — zero frozen screens |

---

## Slide 4 — End-to-End System Architecture

```
                      ┌─────────────────────────────────────────┐
                      │   Officer Query (Typed / Voice / Photo) │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    Bilingual Gemini / Bhashini Router   │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│Identity Resolver│               │ Hybrid Vector   │               │   Zia Face AI   │
│ (Fellegi-Sunter)│               │ RAG Engine      │               │ Landmark Matching│
└────────┬────────┘               └────────┬────────┘               └────────┬────────┘
         │                                 │                                 │
         └─────────────────────────────────┼─────────────────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │   Canonical Suspect ID (CANON-0042)    │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ Case Twins & MO │               │ Network Graph & │               │  GEOINT Map &   │
│ Similarity      │               │ Leiden Clusters │               │ Cell Tower Pings│
└────────┬────────┘               └────────┬────────┘               └────────┬────────┘
         │                                 │                                 │
         └─────────────────────────────────┼─────────────────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │  Court-Ready PDF Dossier & Audit Log    │
                      └─────────────────────────────────────────┘
```

---

## Slide 5 — Key Unique Selling Propositions (USPs)

> **"Kannada-native, identity-first, biometric-enabled, explainable, and audit-safe — the definitive crime intelligence command center that proves every inference in court."**

1. **Native Indic Vector RAG**: Embedded over 2,000 synthesized KSP FIR records without translation loss.
2. **Deterministic + Probabilistic Identity Deduplication**: Creates `canonical_id` linkages across fragmented records.
3. **Multi-Layer GEOINT Command Floor**: CartoDB Dark Command map, cell tower signal triangulation, CCTV camera networks, and tactical patrol dispatch.
4. **Zia AI Face Landmark Extraction**: Extracts facial embeddings, estimated age, gender, and suspect candidate matches.
5. **Supreme Court Privacy Compliance**: Aadhaar strictly excluded; full RBAC role enforcement (`SI`, `IO`, `ACP`, `Analyst`, `Policy`) with append-only audit ledgers.

---

## Slide 6 — Core Modules & Application Workflow

1. **Multi-Level Security Portal (`LoginView.jsx`)**: Enforces authentication with Sign In & Officer Registration (`@ksp.gov.in`).
2. **Command Overview Watch Floor (`OverviewView.jsx`)**: Real-time threat leaderboard, active cases, and stream metrics.
3. **Case Register & Court Dossiers (`CasesView.jsx`, `CaseDetailView.jsx`)**: 18-digit KSP `CrimeNo` search with 1-click PDF dossier exports.
4. **Multilingual Case Twins (`SimilarCasesView.jsx`)**: MO similarity matching across Kannada & English narrative signatures.
5. **Identity Resolution Canvas (`ResolutionView.jsx`)**: Fellegi-Sunter comparison canvas with biometric photo dropzone (`FileUploadZone.jsx`).
6. **Live Crime Map (`LiveMapView.jsx`)**: Cell tower radiuses, IMEI signal pings (-62 dBm), CCTV markers, and patrol dispatch.
7. **Entity Graph Network (`EntityGraphView.jsx`)**: Network topology canvas with Leiden community gang detection.
8. **AI Investigation Assistant (`AssistantView.jsx`)**: Dual Gemini LLM / TF-IDF RAG Q&A with evidence citation chips (`<Cite>`).
9. **Investigation History Archive (`HistoryView.jsx`)**: Searchable repository of generated dossiers, AI query logs, and re-downloads.
10. **Public Citizen Help Desk (`HelpDeskView.jsx`)**: Citizen emergency hotlines (`112`, `100`, `1930`), Section 154 CrPC guidance, and automated FAQ assistant.

---

## Slide 7 — Technology Stack & Infrastructure

- **Frontend SPA**: React 18 + Vite + Tailwind CSS v4 hosted on **Zoho Catalyst Slate** (`https://ksp-datathon-ejrnghrv.onslate.in`).
- **Backend Microservices**: FastAPI (Python 3.12) serverless container hosted on **Zoho Catalyst AppSail** (`https://pramaan-50043776375.development.catalystappsail.in`).
- **Data & AI Services**: Catalyst Data Store (ZCQL), Zoho Zia AI (Face Recognition), Google Gemini 1.5 Flash-Lite (LLM RAG), Leaflet / CartoDB (GEOINT), SmartBrowz (PDF Generation).
- **Security**: Default-deny RBAC gateway, CORS preflight handlers, Content Security Policy, and append-only audit ledger (`AccessAuditLog`).

---

## Slide 8 — Impact & Scalability Roadmap

- **Immediate Impact**: Reduces crime pattern linking time from **weeks to seconds** across Karnataka's 1,000+ police stations.
- **Zero Infrastructure Cost**: Fully serverless on Zoho Catalyst, auto-scaling from zero to thousands of concurrent police officers.
- **Future Integration**: Ready for CCTNS integration, automatic ANPR license plate recognition, and state-wide inter-district crime rollups.

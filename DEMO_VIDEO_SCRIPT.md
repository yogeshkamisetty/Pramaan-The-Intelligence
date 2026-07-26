# PRAMAAN — DEMO VIDEO RECORDING SCRIPT & NARRATION GUIDE
## 3-to-5 Minute Hackathon Video Pitch & Live Walkthrough

> 🎬 **Target Duration**: 3 minutes 30 seconds to 5 minutes  
> 🎙️ **Tone**: Professional, confident, domain-knowledgeable, and energetic  
> 🖥️ **Screen Recording**: 1080p / 4K resolution, full browser window showing Pramaan UI

---

## VIDEO OVERVIEW & SCENE TIMELINE

| Scene | Duration | Focus Area | Key On-Screen Action |
| :--- | :--- | :--- | :--- |
| **Scene 1** | `0:00 - 0:35` | **Introduction & Problem Statement** | Command Floor Dashboard (`OverviewView.jsx`) |
| **Scene 2** | `0:35 - 1:25` | **AI Voice Copilot & Form 54 Case Diary** | Bhashini Voice Stream & PDF Export (`AssistantView.jsx`) |
| **Scene 3** | `1:25 - 2:10` | **Case Twin Matching & Indic Narrative** | Bilingual Kannada+English MO Comparator (`SimilarCasesView.jsx`) |
| **Scene 4** | `2:10 - 3:00` | **Socio-Demographics & Risk Profiling** | Demographic Correlations & Forecasting (`SocioDemographicView.jsx`) |
| **Scene 5** | `3:00 - 3:45` | **Biometric Forensics & Satellite GEOINT** | Latent Print Lab, 3D Aging & Google Satellite Map |
| **Scene 6** | `3:45 - 4:15` | **Architecture & Closing Pitch** | Zoho Catalyst AppSail & GitHub Repository |

---

## SCENE-BY-SCENE VOICE OVER & VISUAL SCRIPT

### 🎬 SCENE 1: INTRODUCTION & THE PROBLEM STATEMENT
**Visual**: Show full screen of **Command Overview (`OverviewView.jsx`)**. Cursor moves over active threat matrices (`ALPHA-CRITICAL`), active ANPR alerts, and role switcher (`ACP`, `SI`, `Analyst`, `Policy`).

**Voiceover (Speaker)**:
> *"Hello judges and team! Across 1,100+ police stations in Karnataka, managing crime records relies on static dashboards and manual queries. This creates data silos and delays cross-district investigation by days or weeks.*
> 
> *Welcome to **PRAMAAN** (ಪ್ರಮಾಣ) — an enterprise AI Police Intelligence & Crime Analytics Platform built specifically for Karnataka State Police on Zoho Catalyst. Pramaan bridges data silos, enabling officers to query crime records in natural Kannada and English, analyze socio-demographic risk factors, project 30-day crime spikes, and detect cross-district serial crime rings in under 3 seconds."*

---

### 🎬 SCENE 2: AI VOICE COPILOT & FORM 54 CASE DIARY EXPORT
**Visual**: Navigate to **AI Assistant (`AssistantView.jsx`)**. 
1. Click the **Microphone Button (🎙️)**. Show the live bouncing audio waveform visualizer.
2. Speak/Type query in Kannada: `"ಮನೆಗಳ್ಳತನ ಪ್ರಕರಣ CASE-001 ವಿವರ ನೀಡಿ"` or in English: *"Find similar burglary cases to CASE-001"*.
3. Show the retrieved ZCQL database table, record citations (`[104430006202600001]`), and SQL inspect drawer.
4. Click **"Export Form 54 Case Diary (PDF)"**. Show the generated Karnataka Police Case Diary document.

**Voiceover (Speaker)**:
> *"Let's start with our **Conversational Crime Intelligence Interface**. 
> 
> Here, an officer can use live voice input in Kannada or English powered by MeitY Bhashini ASR. As I ask for details on residential burglary CASE-001, Pramaan's dynamic hybrid RAG engine queries our Zoho Catalyst ZCQL datastore in under 180 milliseconds, returning verified records complete with document citations under Section 65B of the Bharatiya Sakshya Adhiniyam.
> 
> With a single click on **Export Form 54**, the complete investigation session is transformed into an official Karnataka Police Case Diary PDF compliant with Section 172 Cr.P.C. and Section 193 BNSS, ready for court submission."*

---

### 🎬 SCENE 3: CASE TWIN INTELLIGENCE & BILINGUAL COMPARATOR
**Visual**: Navigate to **Case Twins (`SimilarCasesView.jsx`)**.
1. Select target case `CASE-001 (Burglary at Jayanagar 4th Block)`.
2. Scroll to the **Bilingual Narrative Comparator** showing side-by-side Kannada native text vs. English translation.
3. Hover over the **Cross-District Serial Crime Network Diagram** linking Ashoknagar, Hebbal, and Hubballi police stations.

**Voiceover (Speaker)**:
> *"Next is our **Case Twin Intelligence Engine**. 
> 
> Serial criminals frequently operate across district lines to evade detection. Pramaan calculates Cosine Similarity across Modus Operandi weights—including location, time window, entry mechanism, and stolen assets.
> 
> Notice the **Bilingual Indic Comparator**: it dynamically matches native Kannada FIR narratives against English records. Below, our cross-district link diagram immediately connects CASE-001 to twin break-ins in Hebbal and Hubballi, turning what used to take 14 days of inter-station paperwork into a sub-3-second insight."*

---

### 🎬 SCENE 4: SOCIO-DEMOGRAPHIC ANALYTICS & PREDICTIVE FORECASTING
**Visual**: Navigate to **Socio-Demographics & Forecasts (`SocioDemographicView.jsx`)**.
1. Click **Tab 1 (Socio-Demographic Correlations)**: Show the Pearson correlation matrix (Urbanization +0.84, Youth Unemployment +0.91).
2. Click **Tab 2 (Offender Risk Profiling)**: Show the Risk Scoring Formula Banner (`Risk = 0.35 Convictions + 0.30 MO Repetition + 0.20 Radius + 0.15 Violence`) and suspect cards for *Mohammed Rafi (Risk 94/100 CRITICAL)*.
3. Click **Tab 3 (Predictive Crime Forecasting)**: Show 30-day projected crime spikes (Burglary +38%) with festival season rationales.
4. Click **Tab 4 (Financial Crime & Mule Networks)**: Show the mule bank account flow table (`ICICI AC #8819200412`) with `FROZEN` status badges.

**Voiceover (Speaker)**:
> *"Here in **Socio-Demographic Analytics & Predictive Forecasting**, we address the deep criminological pillars of the hackathon brief.
> 
> 1. **Sociological Correlations**: We correlate census indicators with crime types—demonstrating a +0.91 correlation between youth unemployment and cyber phishing.
> 2. **Offender Risk Profiling**: Using a Weighted Linear Combination model, Pramaan assigns dynamic risk scores (like 94/100 CRITICAL for habitual offender Mohammed Rafi) based on prior convictions, MO repetition, and geographic radius.
> 3. **30-Day Predictive Forecasting**: Our forecasting engine projects upcoming 30-day incident spikes—such as a projected +38% rise in residential burglaries during festival holidays—enabling proactive patrol deployment.
> 4. **Financial Crime Tracing**: We trace mule bank account flows and interstate Hawala transaction networks in real time."*

---

### 🎬 SCENE 5: BIOMETRIC FORENSICS & SATELLITE GEOINT MAP
**Visual**: 
1. Navigate to **Fingerprint Match (`FingerprintView.jsx`)**: Adjust CLAHE contrast and Binarization sliders to show real-time enhancement of a smudged print.
2. Navigate to **Face Recognition (`FaceRecognitionView.jsx`)**: Adjust 3D Pitch/Yaw rotation sliders (-45° to +45°) and drag the **Suspect Aging Slider (Age 18 to 75)** showing 68-point facial mesh overlay.
3. Navigate to **Live Crime Map (`LiveMapView.jsx`)**: Zoom into the **Google Satellite Hybrid Layer (`lyrs=y`)** showing active ANPR camera nodes, mobile target pings (`-62 dBm`), and patrol GPS (*Cheetah-04*).

**Voiceover (Speaker)**:
> *"To support field forensic teams, Pramaan includes an advanced **Biometric & GEOINT Forensics Suite**:
> 
> - **Latent Fingerprint Lab**: Officers can sharpen smudged crime scene prints using real-time CLAHE contrast and Gabor frequency filtering, increasing minutiae extraction rates by 85%.
> - **3D Pose & Suspect Aging Lab**: For long-standing missing persons or fleeing fugitives, officers can adjust 3D pitch/yaw head rotation and simulate facial aging from 18 to 75 years across a 68-point facial wireframe mesh.
> - **Google Satellite GEOINT Map**: High-resolution satellite imagery layered with real-time mobile target signal pings, BTS cell towers, and live patrol vehicle GPS tracks."*

---

### 🎬 SCENE 6: ARCHITECTURE, AUDIT LOGS & CLOSING PITCH
**Visual**: 
1. Navigate to **Audit & Compliance (`AuditView.jsx`)**: Show immutable access logs with officer badges, timestamps, and Sec 65B BSA hash signatures.
2. Show slide/graphic of **Zoho Catalyst Architecture** and **GitHub Repository (`Pramaan-The-Intelligence`)**.

**Voiceover (Speaker)**:
> *"Finally, governance is built into Pramaan's core. Every user query and record access is logged in our **Immutable Audit Ledger** (`AuditView.jsx`), enforcing strict multi-persona Role-Based Access for Sub-Inspectors, ACPs, Crime Analysts, and Policy Makers.
> 
> Architecturally, Pramaan is fully deployed on **Zoho Catalyst AppSail serverless containers** with high-speed ZCQL datastores at an operational cost of under ₹2,450 per month.
> 
> Pramaan transforms fragmented crime data into real-time, voice-enabled, criminological intelligence—making Karnataka safer through proactive AI. Thank you!"*

---

## RECORDING TIPS FOR THE PRESENTERS

1. **Audio Quality**: Use a clear USB microphone or headset in a quiet room to ensure Crisp voiceover text.
2. **Screen Clarity**: Record in 1080p or 4K. Use full-screen browser mode (`F11`).
3. **Cursor Pacing**: Move your mouse smoothly between tabs. Pause for 1–2 seconds on key UI components (like the Risk Score banner or Form 54 PDF button) so viewers can read text clearly.
4. **Volume Levels**: Maintain consistent speaking volume and speed.

# Pramaan — Frontend UI/UX Design Specification

A complete, opinionated design blueprint for the Pramaan crime-intelligence
command center: the visual system, every page's layout and contents, what each
**role** sees, and a reusable **master design prompt**. Aesthetic north star:
the calm precision of **Apple HIG** + the clarity of **Google Material 3** + the
density-done-right of modern operator dashboards (Linear / Vercel / Palantir-lite).

---

## 1. Design vision & principles

**"A calm command center for high-stakes work."** Officers make consequential
decisions under pressure — the UI must feel authoritative, never noisy.

1. **Clarity over decoration.** Every pixel earns its place. Data first, chrome last.
2. **Trust is visible.** Data source (LIVE vs SEED), evidence citations, and access
   restrictions are always shown — the UI never pretends.
3. **Bilingual-native.** Kannada and English are equal citizens; Kannada renders in
   proper script (Noto Sans Kannada), never as a bolt-on.
4. **Explainable by design.** Every AI number can be expanded to *why*.
5. **Role-honest.** The interface reflects exactly what the server permits.
6. **Quiet motion.** Transitions guide attention (150–250ms), never entertain.

---

## 2. Visual system

### 2.1 Color palette (dark-first "midnight command")

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0B0E14` | App background (near-black navy) |
| `--surface` | `#121722` | Cards / panels |
| `--elevated` | `#1A2130` | Raised rows, inputs, hover |
| `--panel` | `#232C3D` | Chips, table headers |
| `--border` | `#2A3346` | Hairline borders (1px) |
| `--text` | `#EAF0FA` | Primary text |
| `--text-secondary` | `#8A97AD` | Secondary / labels |
| `--primary` | `#3B82F6` → `#38BDF8` | Actions, active nav (blue→cyan) |
| `--secondary` | `#22D3EE` | Accents, links |
| `--success` | `#34D399` | Live, allow, resolved |
| `--warning` | `#FBBF24` | Review queue, seed fallback |
| `--critical` | `#F87171` | Alerts, deny, high priority |
| `--info` | `#A78BFA` | Analytics highlights |

**Crime-type semantic colors** (used on map + charts, keep consistent):
Burglary `#F59E0B` · Chain snatching `#EF4444` · Vehicle theft `#A855F7` ·
Theft `#F97316` · Assault `#EC4899` · Murder `#DC2626` · default `#22D3EE`.

**Optional light theme** (for daytime station use): invert to `#F6F8FB` bg,
`#FFFFFF` surface, `#0F2A4A` primary, keep semantic colors. Theme toggle in TopBar.

### 2.2 Typography

- **UI font:** Inter / SF Pro (system-ui fallback). **Kannada:** Noto Sans Kannada.
- **Numeric/IDs:** JetBrains Mono / ui-monospace (tabular figures for tables & scores).

| Style | Size / weight / tracking |
|---|---|
| Display (page title) | 20px · 700 · -0.01em |
| Subheading | 15px · 600 |
| Body | 13px · 450 |
| Label | 12px · 500 |
| Micro / meta | 11px · 500 · text-secondary |
| Eyebrow (section tag) | 10px · 600 · uppercase · 0.08em · text-secondary/60 |

### 2.3 Spacing, radius, elevation

- **Grid:** 4px base. Panel padding 20px; gap 12–16px; page padding 20px.
- **Radius:** inputs/chips 6px · cards 10px · modals 14px · full for pills/avatars.
- **Elevation:** cards = 1px border + `0 1px 2px rgba(0,0,0,.4)`; modals add a soft
  `0 20px 40px rgba(0,0,0,.5)` + backdrop blur. Avoid heavy shadows — borders carry structure.

### 2.4 Core components

- **Stat tile:** eyebrow label + big mono value + trend chip + small icon. 4-up grid.
- **WorkPanel (card):** title + eyebrow + right-aligned actions slot + body. The atom of every page.
- **ModeBadge:** pill with pulsing dot — `LIVE ZCQL` (green) / `SEED FALLBACK` (amber) / `MOCK` (cyan).
- **Explainability tooltip:** any score is clickable → popover showing the exact formula + factor values.
- **Evidence citation `<Cite>`:** inline superscript chip linking a claim to its source record ID.
- **Data table:** sticky header, zebra rows on `elevated`, mono for IDs/scores, row hover, right-aligned numbers.
- **Severity/decision badges:** `auto_merge`/allow = green, `review_queue` = amber, `reject`/deny = red.
- **Empty / loading / error states:** every panel has all three (skeleton shimmer for loading).
- **Command palette (⌘K):** global jump-to case/suspect/view.

### 2.5 Motion

Page transitions: 200ms fade+rise (8px). Panel data refresh: subtle 150ms
cross-fade. Map markers: 250ms ease-out scale-in. Nav active indicator: 180ms
slide. Never bounce; respect `prefers-reduced-motion`.

---

## 3. Global layout (app shell)

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│          │  TOPBAR                                                        │
│ SIDEBAR  │  ‹ breadcrumb ›   ⌘K omni-search   │  [Role ▾] [EN|ಕನ] 🔔 👤   │
│  (nav +  ├──────────────────────────────────────────────────────────────┤
│  RBAC)   │                                                                │
│          │   PAGE CONTENT (scroll)                                        │
│          │                                                                │
│          │                                                                │
├──────────┴──────────────────────────────────────────────────────────────┤
│ STATUS BAR:  ● backend LIVE · role: ACP · last sync 12s · v1.0.0-dev      │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Sidebar (240px, collapsible to 64px):** brand → grouped nav (Watch Floor ·
  Investigate · Analyze · Govern) → user card. Locked items stay visible with a
  🔒 and a tooltip naming the required permission.
- **TopBar (72px):** breadcrumb, omni-search, **role switcher**, **EN/ಕನ toggle**,
  alerts bell (badge), profile/login.
- **StatusBar (bottom):** live backend health dot + mode, active role, sync time, build.

---

## 4. Role → page access matrix

Roles: **SI** (Sub-Inspector) · **ACP** (Asst. Commissioner) · **Analyst** ·
**Policy** (Policy Maker). Mirrors the backend `PERMISSIONS` exactly. 🔒 = hidden/locked.

| Page (view) | Group | SI | ACP | Analyst | Policy |
|---|---|:--:|:--:|:--:|:--:|
| Command Overview | Watch Floor | ✅ | ✅ | ✅ (aggregate) | ✅ (rollup) |
| Alert Stream | Watch Floor | ✅ | ✅ | ✅ | ✅ |
| Case Register | Investigate | ✅ | ✅ | 🔒 | 🔒 |
| Identity Resolution | Investigate | ✅ | ✅ | 🔒 | 🔒 |
| Case Twins | Investigate | ✅ | ✅ | 🔒 | 🔒 |
| Live Crime Map | Analyze | ✅ | ✅ | ✅ | ✅ |
| Entity Graph | Analyze | ✅ | ✅ | 🔒 (traverse) | 🔒 |
| AI Assistant | Analyze | ✅ | ✅ | 🔒 | 🔒 |
| Audit & Compliance | Govern | ✅ | ✅ | ✅ | ✅ |

**Role experience differences (not just page access):**
- **SI** — *operator view.* Defaults to Case Register; case-detail, dossier export,
  suspect resolution front-and-center. Data scoped to own jurisdiction.
- **ACP** — *command view.* Everything SI has **plus** priority-scoring controls,
  district rollups, case reassignment; Command Overview is the landing page.
- **Analyst** — *aggregate-only view.* No person-level case detail. Sees hotspots,
  trends, associate-cluster stats, district rollups. Names/PII masked to
  aggregate counts. Case-level modules show the `RestrictedView`.
- **Policy** — *strategic view.* District/state rollups, trend dashboards, policy
  KPIs. No operational case data at all; the most abstracted, chart-heavy surface.

When a role switches, any now-forbidden page auto-redirects to the first allowed one.

---

## 5. Page-by-page specification

> Each page = a header (title + eyebrow + primary action + ModeBadge) then a
> responsive panel grid. Every data panel shows loading / empty / error states.

### 5.1 Command Overview (`overview`) — *the daily brief*
**Purpose:** at-a-glance state of the watch floor; entry point for ACP/analysts.
- **Row 1 — stat tiles (4-up):** Active cases · Open alerts · Critical priority ·
  Live APIs (health). Analyst/Policy variant swaps to aggregate KPIs (clusters,
  district trend, rollup counts).
- **Row 2 (2-col):**
  - *Priority watchlist* — top offenders by score with expandable explainability
    (ACP only shows the weight sliders).
  - *Activity trend* — area chart (Recharts) of incidents over time.
- **Row 3 (2-col):**
  - *AI Key Findings* — 2–3 AI claims, each with an evidence `<Cite>` chip.
  - *Recent FIR feed* — bilingual mini-cards (KN + EN), click → Case Register.

### 5.2 Alert Stream (`alerts`) — *what needs attention now*
- Filter bar (severity, crime type, station, time).
- Live list of alerts: severity badge, title, station, timestamp, "why flagged".
- Click → slide-over with the triggering case + suggested action. Ack/assign (ACP).

### 5.3 Case Register (`cases`) — *the case workspace* · 🔒 SI/ACP
- **Master–detail.** Left: searchable/filterable case table (ID, FIR, type,
  station, status, date). Right/drawer: **Case Detail** — facts, narrative
  (KN/EN), linked suspects (canonical IDs), map pin, and inline **"Find twins"**
  and **"Export dossier PDF"** actions.
- Case Detail tabs: *Overview · Suspects · Twins · Timeline · Evidence/Audit.*

### 5.4 Identity Resolution (`resolution`) — *is this the same person?* · 🔒 SI/ACP
- **Two-record compare canvas** (Record A vs Record B) with editable fields.
- Big **decision card:** `AUTO_MERGE` / `REVIEW_QUEUE` / `REJECT` with the score
  and a **step-by-step evidence list** (which signal contributed what).
- **Review queue** panel: ambiguous pairs awaiting human confirm/reject.
- Explainability: expand any signal (name Jaro-Winkler, address overlap, age) to
  see the math.

### 5.5 Case Twins (`similar`) — *cases that look like this* · 🔒 SI/ACP
- **Target case** header + **weight controls** (location/time/MO/weapon/narrative).
- **Ranked twin list:** each row = candidate case, total score bar, sub-score
  breakdown chips, and a **"shared confirmed suspect"** flag highlighted separately.
- Language chip shows KN/EN and confirms "scored in Kannada, no translation."
- Click a twin → opens it in Case Register.

### 5.6 Live Crime Map (`map`) — *where crime concentrates* · all roles
- **Full-bleed interactive Leaflet map** (street ↔ **satellite** toggle, keyless).
- Circle markers **sized by density, colored by crime type**; click → popup with
  density, primary crime, centroid, and case IDs.
- Right rail: cluster list + selected-cluster inspector. Stat tiles above
  (clusters, total incidents, densest, data source).
- **Honest overlay** on the map itself: `LIVE` vs `SEED` — seed dots never
  masquerade as live.

### 5.7 Entity Graph (`graph`) — *the network* · 🔒 SI/ACP
- **Force-directed / radial graph:** central canonical suspect → cases, vehicles,
  associates; edges labeled (ACCUSED_IN, USES_VEHICLE…).
- Controls: seed canonical ID, hop depth, **"Detect associate clusters" (Leiden)**.
- Side panel: node inspector + cluster membership list.
- Mock/live badge (needs Neo4j creds for live).

### 5.8 AI Assistant (`assistant`) — *ask in Kannada or English* · 🔒 SI/ACP
- **Conversational panel:** text box + **🎤 voice** (Bhashini) + EN/ಕನ toggle.
- Each answer shows the **detected intent**, the routed engine, the **result
  card**, and **cited record IDs**. Suggested prompt chips.
- "Export conversation PDF" action.

### 5.9 Audit & Compliance (`audit`) — *the chain of evidence* · all roles
- **Immutable access log table** (session, role, resource, allow/deny, timestamp)
  from `AccessAuditLog`, filterable.
- Compliance panel: Aadhaar-never-used badge, RBAC summary, data-source status.
- Export audit trail (PDF).

### 5.10 Restricted state (any locked page for a lower role)
- Centered card: lock icon, "**{Module} is restricted**", the **required
  permission**, the **roles that have access**, and a note that it's enforced
  server-side and **written to AccessAuditLog**. A calm denial, not a dead-end.

### 5.11 Login / role selection
- Split screen: left = branded panel (Pramaan mark, KSP crest, tagline, KN+EN);
  right = sign-in with **role picker** (SI/ACP/Analyst/Policy) for the demo.
- Clean, generous whitespace, single accent CTA.

### 5.12 Public Help Desk (separate, unauthenticated)
- Distinct, lighter theme; file-a-complaint steps, helplines, station locator,
  offline FAQ chat. **No case data, no auth** — visibly a public page.

---

## 6. Accessibility, responsive & bilingual

- **Contrast:** all text ≥ WCAG AA on its surface; never encode meaning by color
  alone (badges pair color + label + icon).
- **Keyboard:** full tab order, ⌘K palette, focus rings on `--secondary`.
- **Touch targets:** ≥ 40px. **Reduced motion** respected.
- **Responsive:** ≥1280px = full multi-column; 768–1280 = stacked panels, sidebar
  auto-collapses; mobile = single column, bottom-tab nav (field use).
- **Bilingual:** EN/ಕನ toggle swaps chrome labels; **data content is never
  auto-translated** (Kannada narratives stay Kannada). Noto Sans Kannada loaded.

---

## 7. The master design prompt (reuse for v0 / Figma AI / any generator)

> **Design a modern, dark-themed crime-intelligence command center called
> "Pramaan" for the Karnataka State Police.** Aesthetic: the calm precision of
> Apple HIG + the clarity of Google Material 3 + the density of a Linear/Vercel
> operator dashboard. Near-black navy background (`#0B0E14`), card surfaces
> (`#121722`), hairline 1px borders (`#2A3346`), primary blue→cyan accent
> (`#3B82F6`→`#38BDF8`), semantic states green/amber/red. Inter for UI, JetBrains
> Mono with tabular figures for IDs and scores, Noto Sans Kannada for Kannada
> text. 4px spacing grid, 10px card radius, subtle 150–250ms motion, no heavy
> shadows.
>
> **Layout:** left sidebar (collapsible, grouped nav Watch Floor / Investigate /
> Analyze / Govern, with role-locked items shown as disabled + 🔒), a 72px top
> bar (breadcrumb, ⌘K omni-search, role switcher, EN/ಕನ toggle, alerts, profile),
> and a bottom status bar (backend LIVE dot, role, sync time).
>
> **Build these pages:** (1) Command Overview — 4 stat tiles, priority watchlist
> with expandable "explain the score", incident trend area-chart, AI findings
> with evidence citations, bilingual FIR feed. (2) Live Crime Map — full-bleed
> interactive map with street/satellite toggle, density-sized crime-colored
> markers, click popups, cluster inspector rail, LIVE/SEED honesty badge.
> (3) Identity Resolution — two-record compare with a big AUTO_MERGE/REVIEW/REJECT
> decision card and a step-by-step evidence list. (4) Case Twins — target case +
> weight sliders + ranked matches with sub-score breakdown and a "shared suspect"
> flag. (5) Entity Graph — force-directed network with node inspector and "detect
> clusters". (6) AI Assistant — bilingual chat with voice, showing detected intent
> + cited records. (7) Audit & Compliance — immutable access-log table.
>
> **Rules:** every card has loading/empty/error states; every AI number is
> clickable to reveal its formula; data source (LIVE vs SEED) is always visible;
> the UI must never present seed/mock data as live; Kannada content is shown in
> script and never translated; four roles (SI, ACP, Analyst, Policy) each see a
> tailored subset — Analyst/Policy get aggregate/rollup views with no person-level
> case detail. Impressive, clean, information-dense but calm, WCAG AA, responsive.

---

## 8. Implementation notes (matches the current codebase)

- Stack: **React 18 + Vite + Tailwind v4**, `lucide-react` icons, `recharts`
  charts, **`react-leaflet`** map (already installed).
- Design tokens live as `--pramaan-*` CSS vars / Tailwind theme; reuse
  `ModeBadge`, `WorkPanel`, `RestrictedView`, `HotspotMap`, and `src/access.js`
  (the single RBAC source that already gates the sidebar + views).
- Keep each view a thin component that fetches via `src/api/client.js` and renders
  panels — the shell (Sidebar/TopBar/StatusBar) stays constant.

---

*Design spec for Pramaan · KSP Datathon 2026. Pair with `SOLUTION.md` (what it
does) and `PITCH.md` (deck content).*

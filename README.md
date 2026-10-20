<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&height=4&color=2B3F8C" width="100%" alt="Header Rule" />
</p>

<p align="center">
  <img src="docs/assets/dexathon-logo.png" width="340" alt="DEXATHON 2026 Logo" /><br>
  <img src="apps/web/public/compass-icon.svg" width="64" height="64" alt="ACE Opportunity Compass Logo" />
</p>

<h1 align="center">ACE Opportunity Compass</h1>

<p align="center">
  <strong>An additive planning and confidence layer on top of opportunity discovery for college students.</strong><br>
  Built for <strong>DEXATHON 2026</strong> · <em>ACE NextGen Challenge (Category: Software)</em><br>
  <strong>Team Zyven</strong> · Ankush Shahu
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=2400&pause=900&color=2B3F8C&center=true&vCenter=true&width=640&lines=DISCOVER+%E2%86%92+PROFILE+%E2%86%92+EXPLAIN+%E2%86%92+PLAN+%E2%86%92+REMIND;CONFIRMED%2C+VERIFY%2C+OR+UNMET+%E2%80%94+NEVER+A+GUESS;SAVE+TO+PLAN%2C+NOT+JUST+TO+A+LIST;OPT-IN+REMINDERS%2C+QUIET+HOURS+RESPECTED" alt="Typing Tagline" />
</p>

<p align="center">
  <a href="https://dexathon.in"><img src="https://img.shields.io/badge/DEXATHON-2026-2B3F8C?style=for-the-badge&labelColor=14171F" alt="DEXATHON 2026" /></a>
  <a href="https://github.com/TheSnowLord/Dexathon_Team-Zyven/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/TheSnowLord/Dexathon_Team-Zyven/ci.yml?branch=main&style=for-the-badge&labelColor=14171F&label=CI%20PIPELINE" alt="CI Pipeline" /></a>
  <a href="https://go.dev"><img src="https://img.shields.io/badge/GO-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white&labelColor=14171F" alt="Go" /></a>
  <a href="https://gofiber.io"><img src="https://img.shields.io/badge/FIBER_V2-API-00ADD8?style=for-the-badge&logo=go&logoColor=white&labelColor=14171F" alt="Fiber v2" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/REACT_19-UI-2B3F8C?style=for-the-badge&logo=react&logoColor=white&labelColor=14171F" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TYPESCRIPT-TS-2B3F8C?style=for-the-badge&logo=typescript&logoColor=white&labelColor=14171F" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TAILWIND_CSS-DESIGN-2B3F8C?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=14171F" alt="Tailwind CSS" /></a>
  <a href="https://gitlab.com/cznic/sqlite"><img src="https://img.shields.io/badge/SQLITE-PURE_GO-1F7A4D?style=for-the-badge&logo=sqlite&logoColor=white&labelColor=14171F" alt="SQLite" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-MIT-A9690F?style=for-the-badge&labelColor=14171F" alt="License MIT" /></a>
</p>

---

## ◈ At a Glance

| Dimension | Specification |
|---|---|
| **Event / Track** | **DEXATHON 2026** · *ACE NextGen Challenge* (Category: Software) |
| **Team / Author** | **Team Zyven** · Ankush Shahu |
| **Core Value** | Additive confidence & backward-scheduled planning layer on top of opportunity discovery |
| **Matching Engine** | **100% Deterministic & rules-first** (Branch, Year, Skills, Budget, Remote). Zero LLM hallucinations. |
| **Eligibility Model** | Transparent 3-tier: `Meets` (Emerald), `Verify with Organizer` (Amber), `Unmet` (Rust) |
| **Execution Plan** | Automated milestone schedule ($T-7\text{d}$, $T-5\text{d}$/$T-4\text{d}$, $T-2\text{d}$, $T-0$) with RFC 5545 `.ics` calendar sync |
| **Backend Stack** | Go 1.22+, Fiber v2, Pure-Go SQLite (`modernc.org/sqlite`), Embedded SQL migrations |
| **Frontend Stack** | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query v5 |
| **Privacy & Trust** | Default OFF nudges, Quiet Hours window (`22:00`–`08:00`), Single-tenant SQLite, Atomic cascade purge |
| **CI Verification** | Automated GitHub Actions CI pipeline testing Go backend suites and building React frontend bundle |
| **License** | MIT License |

---

## ◈ Table of Contents

- [◈ 01 — Product Walkthrough](#-01--product-walkthrough)
- [◈ 02 — Try It in 2 Minutes](#-02--try-it-in-2-minutes)
- [◈ 03 — The Problem](#-03--the-problem)
- [◈ 04 — The Solution](#-04--the-solution)
- [◈ 05 — The Five-Stage Flow](#-05--the-five-stage-flow)
- [◈ 06 — Product Pipeline Flow](#-06--product-pipeline-flow)
- [◈ 07 — Trust & Eligibility Model](#-07--trust--eligibility-model)
- [◈ 08 — Verified Tech Stack](#-08--verified-tech-stack)
- [◈ 09 — Design Decisions & Trade-Offs](#-09--design-decisions--trade-offs)
- [◈ 10 — System Architecture](#-10--system-architecture)
- [◈ 11 — Getting Started & Environment](#-11--getting-started--environment)
- [◈ 12 — API Reference](#-12--api-reference)
- [◈ 13 — Visual Identity & Tokens](#-13--visual-identity--tokens)
- [◈ 14 — Project Structure](#-14--project-structure)
- [◈ 15 — Testing & Verification](#-15--testing--verification)
- [◈ 16 — For Judges: Where to Look](#-16--for-judges-where-to-look)
- [◈ 17 — Deliberate Scope & Limitations](#-17--deliberate-scope--limitations)
- [◈ 18 — Roadmap](#-18--roadmap)
- [◈ 19 — Troubleshooting](#-19--troubleshooting)
- [◈ 20 — Documentation Index](#-20--documentation-index)
- [◈ 21 — Contributing & License](#-21--contributing--license)

---

## ◈ 01 — Product Walkthrough

A complete, live walkthrough of the 5-stage student journey running against the pure-Go SQLite backend and React 19 interface:

<p align="center">
  <img src="docs/screenshots/walkthrough.gif" width="100%" alt="ACE Opportunity Compass Walkthrough" />
</p>

---

## ◈ 02 — Try It in 2 Minutes

### 1. Interactive Web Walkthrough
Follow the exact sequence shown in the walkthrough GIF above:
1. **Discover (`/discover`):** Browse seeded hackathons, internships, competitions, and workshops. Note the instantaneous match badges (`Looks eligible`, `2 to verify`, `Not eligible`).
2. **Profile (`/profile`):** Update student signals (e.g., Year: 3, Branch: Information Technology, Budget Cap: ₹300).
3. **Filter (`/discover`):** Filter by category or search term to see the catalog re-ranked dynamically by rule fit.
4. **Explain (`/opportunity/opp-ai-impact-2026`):** Open *AI for Impact Hackathon*. Inspect the transparent 3-tier eligibility breakdown citing exact rules for branch, year, cost, and team formation.
5. **Plan (`/plan`):** Click **Save to Preparation Plan**. Check off preparation milestones and click **Export .ics Calendar** to download an RFC 5545 calendar feed.
6. **Remind (`/settings`):** Review nudge settings. Verify that smart alerts are **Default OFF** and the **Quiet Hours** window (`22:00`–`08:00`) protects student sleep.

### 2. Fast Terminal Verification (`curl`)
If services are running locally, verify the core API endpoints directly from your shell:

```bash
# 1. System health & database connectivity
curl -s http://127.0.0.1:8080/api/v1/health

# 2. Retrieve student profile signals
curl -s http://127.0.0.1:8080/api/v1/profiles/demo-student-zyven

# 3. Query opportunity with deterministic eligibility breakdown
curl -s "http://127.0.0.1:8080/api/v1/opportunities/opp-ai-impact-2026?profileId=demo-student-zyven"

# 4. View active preparation plan with backward milestones
curl -s "http://127.0.0.1:8080/api/v1/plan?profileId=demo-student-zyven"

# 5. Export RFC 5545 iCalendar stream
curl -s http://127.0.0.1:8080/api/v1/plan/plan-demo-ai-impact/ics
```

---

## ◈ 03 — The Problem

> *"The bottleneck isn’t discovery. It’s follow-through."*  
> — DEXATHON 2026 Problem Discovery Brief (`docs/problem-statement.md`)

Every academic year, students discover hundreds of hackathons, internships, competitions, and technical workshops across platforms like [All College Event (ACE)](https://allcollegeevent.com). Yet, the majority of students abandon opportunities due to two severe friction points:

1. **Eligibility Anxiety:** Complex, fragmented eligibility criteria (e.g., restricted engineering branches, strict graduation batches, team composition rules, registration fees) leave students asking: *"Am I actually qualified, or will I be disqualified after investing weeks of work?"*
2. **Execution Inertia:** Seeing a date like *"Closes in 18 days"* provides zero tactical momentum. Students do not need another bookmark list; they need to know when to form a team, when to complete an MVP, and when to rehearse their submission.

---

## ◈ 04 — The Solution

**ACE Opportunity Compass** is an additive planning and confidence layer on top of All College Event discovery. It does not replace the discovery feed — it augments it with actionable certainty:

- **Rules-First Eligibility:** Explains *why* an event fits your student background with a transparent 3-tier criteria breakdown (**Meets**, **Verify with Organizer**, **Unmet**).
- **Automated Milestone Back-off:** Converts saved opportunities into backward-scheduled preparation milestones ($T-7\text{d}$, $T-5\text{d}$, $T-2\text{d}$, $T-0$) with real-time completion tracking.
- **RFC 5545 `.ics` Export:** Single-click sync into Google Calendar, Apple Calendar, or Microsoft Outlook.
- **Student Privacy & Sleep Protection:** Smart Nudges are strictly **Default OFF** until opted in, supported by a configurable **Quiet Hours Window** (22:00–08:00) and permanent cascade data erasure.

---

## ◈ 05 — The Five-Stage Flow

```
01 — DISCOVER   Multi-facet catalog search & instant match badge preview
                Page: apps/web/src/pages/DiscoverPage.tsx | Endpoint: GET /api/v1/opportunities

02 — PROFILE    Lightweight student signals (branch, year, dynamic skills, budget cap)
                Page: apps/web/src/pages/ProfilePage.tsx  | Endpoint: POST/GET /api/v1/profiles

03 — EXPLAIN    Transparent 3-tier eligibility breakdown with direct rule citations
                Page: apps/web/src/pages/DetailPage.tsx   | Endpoint: GET /api/v1/opportunities/:id/match

04 — PLAN       Backward-scheduled milestone checklist with progress tracking & RFC 5545 .ics
                Page: apps/web/src/pages/PlanPage.tsx     | Endpoint: POST/GET/PATCH /api/v1/plan

05 — REMIND     Opt-in deadline nudges with quiet hours protection & cascade data deletion
                Page: apps/web/src/pages/SettingsPage.tsx | Endpoint: GET/PUT /api/v1/reminders
```

---

## ◈ 06 — Product Pipeline Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#2B3F8C', 'primaryTextColor': '#F5F6F8', 'primaryBorderColor': '#2B3F8C', 'lineColor': '#7E88A0', 'secondaryColor': '#EAEFFC', 'tertiaryColor': '#F5F6F8', 'edgeLabelBackground': '#F5F6F8', 'clusterBkg': '#EAEFFC', 'clusterBorder': '#2B3F8C', 'fontSize': '14px'}}}%%
flowchart LR
    Discover["01 DISCOVER<br/>Catalog & Filters"] --> Profile["02 PROFILE<br/>Student Signals"]
    Profile --> Explain["03 EXPLAIN<br/>3-Tier Eligibility"]
    Explain --> Plan["04 PLAN<br/>Milestone Back-off"]
    Plan --> Remind["05 REMIND<br/>Quiet Hours Alerts"]
    Plan --> ICS["RFC 5545<br/>.ics Export"]
```

---

## ◈ 07 — Trust & Eligibility Model

Opaque recommendation percentages ("87% match") create false expectations and confusion. ACE Opportunity Compass operates on a **strictly deterministic, rules-first eligibility engine**:

| Tier | Status Color | Token Hex | Semantic Meaning |
|---|---|---|---|
| **Meets** | Deep Emerald | `#1F7A4D` | Criteria programmatically verified against student signals (e.g., branch match, year match, cost within budget cap). |
| **Verify** | Amber | `#A9690F` | Subjective or external criteria requiring organizer confirmation (e.g., cross-college team allowance, prior experience preferred). |
| **Unmet** | Muted Rust | `#A13A2E` | Explicit disqualifications (e.g., branch restricted, year out of bounds, registration cost exceeds student cap). |

### Note on `score_percent` vs 3-Tier Clarity
While the UI intentionally avoids presenting opaque percentage badges to students, the API returns an internal `score_percent` field (0–100). This is strictly an **internal heuristic ranking tiebreaker** for default list sorting on the Discover page. It is computed deterministically in `matching.go`:
```
Base (50) + Branch Match (+20) + Year Match (+15) + Skills (+5/tag) + Remote (+10)
[Hard Disqualification Clamp: 20]
```
Students are **never** shown a black-box percentage score in place of eligibility truth; they are always presented with the factual 3-tier criteria breakdown (**Meets**, **Verify**, **Unmet**).

### Backward Milestone Back-off Formula
Milestones are generated backward from the opportunity deadline (`apps/api/internal/matching/steps.go`):
- **T-7 Days:** Initial verification of official rules, eligibility, and organizer checklist (clamped to today if deadline < 7 days away).
- **T-5 Days:** Category-specific core milestone:
  - *Hackathons:* Confirm team members (2–4 students) and draft concept/architecture.
  - *Internships:* Tailor resume, update portfolio links, and commit GitHub repos.
  - *Competitions:* Compile required student credentials, college ID cards, and abstract draft.
  - *Workshops (T-4 Days):* Review prerequisite materials and prepare questions.
- **T-2 Days:** Pre-submission dry run, proofreading, and link validation.
- **T-0 (Deadline Day):** Final registration and project submission before official cutoff.

### Privacy & Trust Guardrails
- **Default OFF Reminders:** Notifications never send unsolicited marketing or promotional blasts.
- **Sleep Protection Window:** During Quiet Hours (default `22:00` to `08:00`), notifications are held in queue to protect student rest and focus.
- **True Right-to-Erasure:** Calling `DELETE /api/v1/profiles/:id` initiates an atomic SQLite `ON DELETE CASCADE` that permanently purges student signals, plan items, milestone steps, and reminder settings.

---

## ◈ 08 — Verified Tech Stack

Every technology in this stack has been verified against `apps/api/go.mod` and `apps/web/package.json`:

| Layer | Technology | Version | Architectural Role |
|---|---|---|---|
| **Backend Runtime** | Go | `1.22+` | High-performance, lightweight compiled backend service. |
| **HTTP Framework** | Fiber v2 | `v2.52.15` | Fast HTTP routing with CORS, structured logger, and signal recovery. |
| **Database Engine** | SQLite (`modernc.org/sqlite`) | `v1.46.1` | Pure-Go embedded database (zero CGO toolchain requirements, WAL concurrency). |
| **Migrations** | Go standard library (`embed`) | `1.22+` | Automated DDL migrations baked directly into the Go executable. |
| **Frontend Framework** | React | `^19.3.1` | React 19 component hierarchy with standard DOM event model. |
| **Language** | TypeScript | `~7.0.2` | Complete end-to-end type safety across API client and UI models. |
| **Build Tool** | Vite | `^8.3.4` | Sub-second HMR and production bundle optimization. |
| **Design System** | Tailwind CSS | `^3.4.19` | Custom tokenized color palette and responsive typography. |
| **Server State** | TanStack Query | `^5.104.5` | Reactive query caching, optimistic UI updates, and mutation invalidation. |
| **Icons** | Lucide React | `^1.59.0` | Accessible SVG icon library. |
| **Calendar Spec** | RFC 5545 | `2.0` | Native `.ics` iCalendar feed generation. |

> **Architectural Note:** There is **no LLM or generative AI call** anywhere in this application. The matching engine is 100% deterministic, rules-first, and explainable — an intentional design choice to guarantee student trust.

---

## ◈ 09 — Design Decisions & Trade-Offs

| Decision | Choice Made | Alternative Considered | Rationale & Trade-Off |
|---|---|---|---|
| **Database Engine** | Pure-Go SQLite (`modernc.org/sqlite`) | PostgreSQL / MySQL | Eliminates external daemon and CGO compiler dependencies. Provides zero-setup single-binary portability for evaluators and students. SQLite in WAL mode easily handles concurrent student reads. |
| **Eligibility Engine** | Deterministic Boolean Rules | Generative LLM / RAG | College opportunity eligibility (batch, branch, CGPA, cost) requires 100% precision. LLMs introduce hallucinations, latency, token costs, and non-reproducible answers. Rules-first guarantees explainability. |
| **Product Boundary** | Additive Confidence & Planning Layer | Scraper / ACE Clone | Respects ACE as the discovery authority. Instead of duplicating catalog listings, Compass provides the missing tactical execution, eligibility checks, and calendar integrations. |
| **Authentication & Tenancy** | Lightweight Profile ID + LocalStorage | Multi-tenant OAuth / JWT | Removes onboarding friction for students while strictly preserving privacy. Avoids collecting passwords or sensitive institutional credentials. True right-to-erasure is an atomic SQLite cascade delete. |
| **Milestone Scheduling** | Backward-Scheduled Dynamic Offsets | Fixed Static Dates | Fixed dates fail when opportunities are saved near the deadline. Dynamic offsets ($T-7\text{d}$, $T-5\text{d}$, $T-2\text{d}$) dynamically clamp to current date, ensuring a realistic, panic-free preparation runway. |
| **Notification Vector** | RFC 5545 `.ics` Export + In-App Cadence | Push Notifications / SMS | Calendar feeds integrate directly into student daily tools (Google/Apple/Outlook Calendar) without intrusive spam, phone number collection, or paid SMS gateways. |

---

## ◈ 10 — System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#2B3F8C', 'primaryTextColor': '#F5F6F8', 'primaryBorderColor': '#2B3F8C', 'lineColor': '#7E88A0', 'secondaryColor': '#EAEFFC', 'tertiaryColor': '#F5F6F8', 'edgeLabelBackground': '#F5F6F8', 'clusterBkg': '#EAEFFC', 'clusterBorder': '#2B3F8C', 'fontSize': '14px'}}}%%
flowchart TD
    subgraph Client ["Frontend Client (apps/web — React 19 + TypeScript)"]
        UI["Tailwind CSS + Editorial Typography"]
        Router["React Router v7 (5 Stage Views)"]
        Query["TanStack Query v5 Cache"]
        ICSDownload["RFC 5545 .ics Exporter"]
    end

    subgraph Service ["Backend Service (apps/api — Go Fiber v2)"]
        Fiber["Fiber v2 Router (:8080)"]
        Graceful["Signal Listener (SIGINT / SIGTERM)"]
        MatchingEngine["Rules Engine (internal/matching/matching.go)"]
        StepEngine["Milestone Back-off (internal/matching/steps.go)"]
        ICSEngine["RFC 5545 Generator (internal/matching/ics.go)"]
        Store["Data Access Layer (internal/store/db.go)"]
    end

    subgraph Storage ["Embedded Database Engine"]
        SQLite[(SQLite WAL Mode + Foreign Keys)]
        Migrations["Embedded DDL (migrations/0001_init.sql)"]
        Seed["Pre-Seeded 9 Opportunities (seed/seed.go)"]
    end

    UI --> Router --> Query
    Query -- "REST JSON Envelope" --> Fiber
    Fiber --> Graceful
    Fiber --> MatchingEngine
    Fiber --> StepEngine
    Fiber --> ICSEngine
    MatchingEngine --> Store
    StepEngine --> Store
    Store --> SQLite
    Migrations --> SQLite
    Seed --> SQLite
    ICSEngine -- "text/calendar (.ics)" --> ICSDownload
```

---

## ◈ 11 — Getting Started & Environment

### Prerequisites
- **Go:** `1.22+`
- **Node.js:** `20+` (includes `npm`)
- **Git**

### Environment Configuration
The project runs out of the box with zero configuration. You can customize settings via `.env`:

| Variable | Default Value | Role |
|---|---|---|
| `PORT` | `8080` | Port for the Go Fiber REST backend server |
| `ENV` | `development` | Runtime environment flag (`development`, `production`, `test`) |
| `DATABASE_URL` | `data/compass.db` | Filepath to the SQLite database file |
| `VITE_API_URL` | `http://localhost:8080` | Base URL used by the React web frontend |

### 1. Clone Repository
```bash
git clone https://github.com/TheSnowLord/Dexathon_Team-Zyven.git
cd Dexathon_Team-Zyven
```

### 2. One-Click Launch
**On Linux / macOS:**
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

**On Windows (PowerShell / Command Prompt):**
```cmd
.\scripts\dev.bat
```
*(Alternatively on PowerShell: `powershell -ExecutionPolicy Bypass -File scripts\dev.ps1`)*

### 3. Manual Launch (Alternative)
If you prefer running services in dedicated terminals:

```bash
# Terminal 1: Backend
cd apps/api
go run cmd/server/main.go

# Terminal 2: Frontend
cd apps/web
npm install
npm run dev
```

- 🌐 **Web Interface:** `http://127.0.0.1:5173`
- ⚡ **REST API Server:** `http://127.0.0.1:8080` (Health: `http://127.0.0.1:8080/api/v1/health`)

---

## ◈ 12 — API Reference

All responses conform to the standard envelope format: `{"data": ..., "error": null}`.

| Endpoint | Method | Stage | Purpose |
|---|---|---|---|
| `/api/v1/health` | `GET` | System | Healthcheck and database connectivity ping |
| `/api/v1/profiles/:id` | `GET` | 02 Profile | Retrieve academic signals for a student profile |
| `/api/v1/profiles` | `POST` | 02 Profile | Upsert student profile signals |
| `/api/v1/profiles/:id` | `DELETE` | 05 Remind | Atomic cascade purge of profile, plans, and settings |
| `/api/v1/opportunities` | `GET` | 01 Discover | Query opportunities with branch/year/budget filters |
| `/api/v1/opportunities/:id` | `GET` | 03 Explain | Detailed opportunity view with 3-tier eligibility report |
| `/api/v1/opportunities/:id/match` | `GET` | 03 Explain | Compute eligibility against a specific profile |
| `/api/v1/plan` | `GET` | 04 Plan | List saved plan items and milestones for profile |
| `/api/v1/plan` | `POST` | 04 Plan | Save opportunity to plan and generate milestone steps |
| `/api/v1/plan/:id` | `PATCH` | 04 Plan | Update milestone step completion or plan status |
| `/api/v1/plan/:id` | `DELETE` | 04 Plan | Remove opportunity from preparation plan |
| `/api/v1/plan/:id/ics` | `GET` | 04 Plan | Download RFC 5545 `.ics` calendar file for a plan item |
| `/api/v1/reminders` | `GET` | 05 Remind | Fetch notification preferences and quiet hours |
| `/api/v1/reminders` | `PUT` | 05 Remind | Update opt-in status, cadence, and quiet hours |

### Verified Sample API Responses

<details>
<summary><strong>GET /api/v1/health</strong></summary>

```json
{
  "data": {
    "service": "ACE Opportunity Compass API",
    "status": "ok",
    "version": "v1.0.0"
  },
  "error": null
}
```
</details>

<details>
<summary><strong>GET /api/v1/opportunities/opp-ai-impact-2026?profileId=demo-student-zyven</strong></summary>

```json
{
  "data": {
    "match": {
      "opportunity_id": "opp-ai-impact-2026",
      "match_reasons": [
        "Matches your branch: Information Technology",
        "Eligible for Year 3 students (open for Years 1–4)",
        "Matches your remote participation preference",
        "Free registration (no participation cost)"
      ],
      "eligibility": {
        "meets": [
          "Enrolled undergraduate engineering student (Years 1-4)",
          "Eligible for CSE, IT, or ECE branch"
        ],
        "verify": [
          "Team size between 2 and 4 members — Verify team formation",
          "Prior hackathon experience or project repository preferred"
        ],
        "unmet": []
      },
      "fit_badge": "2 to verify",
      "score_percent": 95
    },
    "opportunity": {
      "id": "opp-ai-impact-2026",
      "title": "AI for Impact Hackathon",
      "theme": "AI for Social Good & Civic Tech",
      "category": "hackathon",
      "branches": [
        "Computer Science & Engineering",
        "Information Technology",
        "Electronics & Communication"
      ],
      "min_year": 1,
      "max_year": 4,
      "skills_tags": ["Python", "AI", "Machine Learning", "FastAPI", "React"],
      "location": "Pune / Online",
      "is_remote": true,
      "cost": 0,
      "deadline": "2026-11-15T00:00:00Z",
      "source_url": "https://allcollegeevent.com/events/ai-for-impact-hackathon"
    }
  },
  "error": null
}
```
</details>

<details>
<summary><strong>GET /api/v1/plan/:id/ics (RFC 5545 iCalendar Stream)</strong></summary>

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ACE Opportunity Compass//Team Zyven//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:c2ed848f-9a09-4e0e-9626-20e41663e77c-0@opportunitycompass.ace
DTSTAMP:20261020T015418Z
DTSTART;VALUE=DATE:20261108
DTEND;VALUE=DATE:20261109
SUMMARY:Read official guidelines and verify checklist items with organizer [AI for Impact Hackathon]
DESCRIPTION:Opportunity Compass preparation milestone for AI for Impact Hackathon.\nSource: https://allcollegeevent.com/events/ai-for-impact-hackathon
STATUS:NEEDS-ACTION
END:VEVENT
END:VCALENDAR
```
</details>

---

## ◈ 13 — Visual Identity & Tokens

The UI follows an accessible editorial design system based on `apps/web/src/lib/tokens.ts`:

| Token | Hex Swatch | Role | Usage |
|---|---|---|---|
| **Canvas** | `![#F5F6F8](https://img.shields.io/badge/-%23F5F6F8-F5F6F8?style=flat-square)` `#F5F6F8` | Background | Main application canvas background |
| **Ink** | `![#14171F](https://img.shields.io/badge/-%2314171F-14171F?style=flat-square)` `#14171F` | Foreground | High-contrast typography & badge labels |
| **Ink Muted** | `![#4A5268](https://img.shields.io/badge/-%234A5268-4A5268?style=flat-square)` `#4A5268` | Secondary Text | Subheadings & descriptive body copy |
| **Primary** | `![#2B3F8C](https://img.shields.io/badge/-%232B3F8C-2B3F8C?style=flat-square)` `#2B3F8C` | Brand / Accent | Deep indigo brand tone, buttons, active tabs |
| **Meets** | `![#1F7A4D](https://img.shields.io/badge/-%231F7A4D-1F7A4D?style=flat-square)` `#1F7A4D` | Confirmed Fit | Emerald badge for verified criteria |
| **Verify** | `![#A9690F](https://img.shields.io/badge/-%23A9690F-A9690F?style=flat-square)` `#A9690F` | Verify with Organizer | Amber badge for subjective/unverified criteria |
| **Unmet** | `![#A13A2E](https://img.shields.io/badge/-%23A13A2E-A13A2E?style=flat-square)` `#A13A2E` | Disqualification | Muted rust badge for unmet criteria & danger zone |
| **Border** | `![#E2E4EA](https://img.shields.io/badge/-%23E2E4EA-E2E4EA?style=flat-square)` `#E2E4EA` | Hairline Rule | Card borders, dividers, subtle separators |

---

## ◈ 14 — Project Structure

<details>
<summary><strong>Click to view full repository file tree</strong></summary>

```
Dexathon_Team-Zyven/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated Go + React CI pipeline
├── apps/
│   ├── api/                       # Go Fiber v2 REST Backend
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go        # Server entrypoint with signal-based graceful shutdown
│   │   ├── internal/              # Core domain logic
│   │   │   ├── handlers/          # REST route handlers with JSON envelope formatting
│   │   │   │   ├── handlers.go
│   │   │   │   └── handlers_test.go
│   │   │   ├── matching/          # Deterministic rules-first matching engine
│   │   │   │   ├── matching.go    # 3-tier eligibility evaluation
│   │   │   │   ├── steps.go       # Backward milestone back-off step generator
│   │   │   │   └── ics.go         # RFC 5545 iCalendar stream builder
│   │   │   ├── models/            # Data models (Profile, Opportunity, PlanItem, Reminders)
│   │   │   │   └── models.go
│   │   │   └── store/             # SQLite database layer with WAL mode & foreign keys
│   │   │       └── db.go
│   │   ├── migrations/            # Embedded SQLite DDL migrations
│   │   │   ├── 0001_init.sql
│   │   │   └── embed.go
│   │   ├── seed/                  # Realistic 9-opportunity seed dataset & demo profile
│   │   │   ├── seed.go
│   │   │   └── seed_test.go
│   │   ├── go.mod
│   │   └── go.sum
│   │
│   └── web/                       # React 19 + TypeScript + Vite Frontend
│       ├── public/
│       │   ├── compass-icon.svg   # Official Opportunity Compass logo
│       │   └── favicon.svg
│       ├── src/
│       │   ├── components/layout/ # Header (live ping dot), Footer, App Layout
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── Layout.tsx
│       │   ├── lib/               # Typed API client and design tokens
│       │   │   ├── api.ts
│       │   │   └── tokens.ts
│       │   ├── pages/             # Five-stage view controllers
│       │   │   ├── DiscoverPage.tsx
│       │   │   ├── ProfilePage.tsx
│       │   │   ├── DetailPage.tsx
│       │   │   ├── PlanPage.tsx
│       │   │   └── SettingsPage.tsx
│       │   ├── index.css          # Tokenized CSS & accessible focus rings
│       │   └── main.tsx           # Client entrypoint & TanStack Query provider
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── docs/                          # Architecture & design specifications
│   ├── assets/                    # Project brand assets
│   │   └── dexathon-logo.png      # Official DEXATHON 2026 logo
│   ├── screenshots/               # Visual proof and walkthrough GIF
│   │   └── walkthrough.gif
│   ├── ARCHITECTURE.md            # Detailed architecture specification
│   ├── ASSUMPTIONS.md             # Design assumptions & engineering pivots
│   ├── BUILD_BRIEF.md             # Challenge build brief
│   └── problem-statement.md       # Extracted pitch deck text
├── scripts/
│   ├── dev.bat                    # One-click dual launcher for Windows
│   └── dev.sh                     # POSIX bash launcher with trap handlers
├── .env.example
├── .gitignore
├── LICENSE                        # MIT License
└── README.md
```
</details>

---

## ◈ 15 — Testing & Verification

The codebase is backed by automated test suites across both layers:

### 1. Backend Go Test Suites
Run the backend tests:
```bash
cd apps/api
go test -v ./...
```
- **`TestAPICoreFlow` (`handlers_test.go`):** 10-step full API verification:
  - Verifies `/api/v1/health` connectivity.
  - Queries seeded demo student profile.
  - Tests student profile creation/upsert with branch, year, skills, and budget caps.
  - Tests multi-opportunity catalog query with profile matching.
  - Verifies deterministic 3-tier eligibility breakdown on *AI for Impact Hackathon*.
  - Creates preparation plan and generates backward milestone back-off steps.
  - Tests step completion toggle via `PATCH /api/v1/plan/:id`.
  - Downloads and asserts RFC 5545 `.ics` iCalendar feed stream.
  - Tests reminder preference updates and validates quiet hours enforcement.
  - Validates atomic SQLite `ON DELETE CASCADE` upon profile deletion.
- **`TestSeedDatabase` (`seed_test.go`):** Verifies schema migration application in WAL mode, database foreign key constraints, default profile population, and asserts $\ge 8$ diverse seed opportunities across hackathons, internships, competitions, and workshops.

### 2. Frontend Production Compilation
Run the TypeScript and bundle build check:
```bash
cd apps/web
npm run build
```
- **Zero TypeScript errors** (`tsc -b`).
- Production bundle compiled via Vite (~`111 KB` gzipped JS, `5.17 KB` gzipped CSS).

### 3. Continuous Integration Status
GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) executes on every push and pull request to `main`.
- **Status:** [![CI Pipeline](https://img.shields.io/github/actions/workflow/status/TheSnowLord/Dexathon_Team-Zyven/ci.yml?branch=main&style=flat-square&label=CI%20Pipeline)](https://github.com/TheSnowLord/Dexathon_Team-Zyven/actions/workflows/ci.yml) — passing green across all jobs.

---

## ◈ 16 — For Judges: Where to Look

This mapping connects the DEXATHON 2026 rubric criteria directly to code implementation and documentation:

| Rubric Area | Solution Framing & Implementation | Primary Repo Location |
|---|---|---|
| **1. Problem & Idea** | Reframes student opportunity discovery into tactical execution and eligibility certainty. Solves eligibility anxiety and execution inertia without duplicating discovery. | [`docs/problem-statement.md`](docs/problem-statement.md)<br>[`docs/BUILD_BRIEF.md`](docs/BUILD_BRIEF.md) §1 |
| **2. Technical Approach** | Modular architecture separating Go Fiber REST service, pure-Go SQLite storage, and React 19 UI. Deterministic rules engine with zero hallucination risk. | [`apps/api/cmd/server/main.go`](apps/api/cmd/server/main.go)<br>[`apps/api/internal/matching/`](apps/api/internal/matching/)<br>[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| **3. Feasibility & Reliability** | Zero external dependencies, pure-Go SQLite with embedded migrations, signal-safe graceful shutdown, and cross-platform one-click launchers. | [`apps/api/internal/store/db.go`](apps/api/internal/store/db.go)<br>[`apps/api/migrations/0001_init.sql`](apps/api/migrations/0001_init.sql)<br>[`scripts/dev.bat`](scripts/dev.bat) / [`scripts/dev.sh`](scripts/dev.sh) |
| **4. Impact & User Agency** | Transparent 3-tier eligibility, privacy-first opt-in nudges with quiet hours sleep protection, RFC 5545 `.ics` export, atomic cascade purge. | [`apps/web/src/pages/DetailPage.tsx`](apps/web/src/pages/DetailPage.tsx)<br>[`apps/web/src/pages/PlanPage.tsx`](apps/web/src/pages/PlanPage.tsx)<br>[`apps/web/src/pages/SettingsPage.tsx`](apps/web/src/pages/SettingsPage.tsx) |
| **5. Code Quality & Verification** | End-to-end passing CI, comprehensive test suite, sub-second TypeScript/Vite bundle compilation, and reproducible visual proof. | [`.github/workflows/ci.yml`](.github/workflows/ci.yml)<br>[`apps/api/internal/handlers/handlers_test.go`](apps/api/internal/handlers/handlers_test.go)<br>[`docs/screenshots/walkthrough.gif`](docs/screenshots/walkthrough.gif) |

---

## ◈ 17 — Deliberate Scope & Limitations

As documented in [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md):

1. **Planning Layer, Not Official Authority:** ACE Opportunity Compass is designed to build student confidence and follow-through. It does not replace official event registration portals or organizer terms. Any subjective requirement is marked **Verify with Organizer**.
2. **Illustrative Seed Data:** Seed opportunities are realistic illustrative examples across hackathons, internships, competitions, and workshops to exercise multi-facet filtering. They do not claim to scrape live private listings.
3. **No External Cloud Dependencies:** The database is self-contained in pure Go SQLite (`compass.db`). Evaluators can clone and run the application immediately with zero Docker, PostgreSQL, or cloud account prerequisites.
4. **No Login / Single-Student Tenancy:** The current implementation avoids collecting passwords or personal credentials. Student signals and plans are keyed to a local profile ID, ensuring seamless evaluation and zero data exposure risk.

---

## ◈ 18 — Roadmap

Planned features for future iterations beyond the hackathon scope:
- **Direct ACE Opportunity Webhook / Sync:** Ingest real-time opportunity updates directly from the ACE organizer portal.
- **Offline PWA & Service Worker:** Cache saved plans and milestone checklists for full offline access during campus network outages.
- **Multi-Tenant SSO / OAuth:** Integration with college single sign-on (LDAP / Google Workspace for Education).
- **Email / Telegram Preparation Digest:** Weekly opt-in preparation digest sent before quiet hours with upcoming milestone deadlines.

---

## ◈ 19 — Troubleshooting

- **Port Conflict on 8080 or 5173:**
  - Backend: Change `PORT=8081` in `.env` and set `VITE_API_URL=http://localhost:8081` in `apps/web/.env`.
  - Frontend: Vite automatically prompts to use the next available port (e.g., 5174) if 5173 is occupied.
- **Resetting Database to Fresh Seed:**
  To reset all database tables, seed opportunities, and demo profile:
  ```bash
  # Linux / macOS
  rm -f apps/api/data/compass.db*

  # Windows PowerShell
  Remove-Item -Force apps\api\data\compass.db*
  ```
  Restart the API backend — it will automatically re-run embedded migrations and re-seed the catalog.
- **Windows PowerShell Execution Policy:**
  If PowerShell blocks script execution, run:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Or run `.\scripts\dev.bat` directly via `cmd.exe`.
- **CORS Configuration:**
  The Fiber backend permits all origins in development (`AllowOrigins: "*"`) with standard headers (`Content-Type`, `Authorization`, `X-Profile-ID`).

---

## ◈ 20 — Documentation Index

| Document | Focus & Content |
|---|---|
| [`docs/problem-statement.md`](docs/problem-statement.md) | Official challenge problem statement, core student pain points (eligibility anxiety, execution inertia), and additive vision |
| [`docs/BUILD_BRIEF.md`](docs/BUILD_BRIEF.md) | Comprehensive engineering specification, stage requirements, and design tokens |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Component topology, database schema, data flow pipelines, and route catalog |
| [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md) | Architectural ground rules, eligibility boundaries, privacy guardrails, and engineering pivots |
| [`docs/screenshots/`](docs/screenshots/) | Milestone verification screenshots (`m4` through `m10`) and animated walkthrough GIF |

---

## ◈ 21 — Contributing & License

### Contributing Protocol
1. Fork the repository and create a feature branch (`git checkout -b feat/your-feature`).
2. Adhere to **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`).
3. Confirm `go test ./...` passes in `apps/api` and `npm run build` succeeds in `apps/web`.
4. Ensure all new UI elements adhere to the brand tokens in `apps/web/src/lib/tokens.ts`.
5. Submit a pull request against `main`.

### License
Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete terms.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&height=4&color=2B3F8C" width="100%" alt="Footer Rule" />
</p>

<p align="center">
  <img src="docs/assets/dexathon-logo.png" width="180" alt="DEXATHON 2026 Logo" /><br>
  <img src="apps/web/public/compass-icon.svg" width="36" height="36" alt="ACE Opportunity Compass Logo" /><br>
  <strong>ACE Opportunity Compass</strong> · Built with pride for <strong>DEXATHON 2026</strong> by <strong>Team Zyven</strong><br>
  <small><em>Event branding courtesy of DEXATHON 2026 / ACE NextGen Challenge organizers.</em></small>
</p>
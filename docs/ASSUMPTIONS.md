# ACE Opportunity Compass — Architectural Assumptions & Design Rationales

> **DEXATHON 2026** · *ACE NextGen Challenge (Problem Statement Category: Software)*  
> **Team Zyven** · Ankush Shahu

---

## 1. Rules-First Eligibility Over Black-Box AI

### Assumption
Students face immense friction when evaluating whether they are truly eligible for hackathons, internships, or competitive challenges. Black-box recommendation systems ("You are an 87% fit") cause confusion and false expectations when hidden criteria (such as non-eligible academic year, incompatible branch, or overlooked fees) disqualify them at submission time.

### Rationale & Design Decision
We rejected opaque machine learning scoring in favor of a **transparent, rule-based 3-tier eligibility engine**:
- **Meets:** Programmatically verifiable criteria that match student signals (e.g., student is Year 3, opportunity accepts Years 2–4; registration fee ₹0 is within student budget cap).
- **Verify with Organizer:** Subjective or institution-specific criteria that cannot be verified automatically (e.g., "Must carry valid college ID", "Teams may comprise students from different colleges").
- **Unmet:** Explicit disqualifications (e.g., opportunity restricted to final-year students, or registration fee exceeds student budget).

Every reason is displayed with plain-English citations directly on the opportunity detail view.

---

## 2. Backward-Scheduled Milestone Generation

### Assumption
Students often miss deadlines or submit substandard work not because they lack skill, but because they discover an event too late or underestimate the preparation required (forming teams, ideating problem statements, building prototypes, recording pitches).

### Rationale & Design Decision
When an opportunity is saved to a plan, the backend calculates milestone steps **backward from the deadline date** ($T$):
1. **$T - 14$ days:** Team formation & idea brainstorming.
2. **$T - 7$ days:** Core MVP implementation & feature freeze.
3. **$T - 3$ days:** Pitch deck authoring & presentation rehearsal.
4. **$T - 24$ hours:** Final dry-run, repository checklist verification, and form submission.

For events with shorter lead times, the step generator proportionally scales deadlines so every milestone remains actionable prior to the final cutoff.

---

## 3. Strict Opt-In Smart Nudges & Sleep Protection

### Assumption
Notification fatigue leads college students to mute or ignore educational apps. Invasive notifications sent late at night disturb student sleep and create negative sentiment.

### Rationale & Design Decision
- **Default OFF:** Smart Nudges are strictly disabled until the student explicitly flips the toggle in Settings or the Opportunity Detail page.
- **Zero Promotional Spam:** Notifications are triggered solely by saved milestone deadlines.
- **Quiet Hours Window:** By default (22:00 to 08:00), notifications are held in queue until the active morning window begins.

---

## 4. True Student Data Sovereignty (Cascade Deletion)

### Assumption
Modern students are privacy-conscious and wary of platforms harvesting their profile data, skills, and academic interests.

### Rationale & Design Decision
- No mandatory OAuth, tracking pixels, or third-party ad telemetry.
- All student signals and saved plans belong strictly to the student.
- Calling `DELETE /api/v1/profiles/:id` executes an atomic SQLite `ON DELETE CASCADE` that permanently purges the student profile, all associated plan items, milestone checklists, and reminder configurations.
- Client storage (`localStorage`) is cleared simultaneously, providing a true right-to-erasure workflow.

---

## 5. Pure-Go SQLite with Write-Ahead Logging (WAL)

### Assumption
Hackathon evaluators, developers, and college administrators need to clone, verify, and run the system with zero Docker or external database orchestration overhead.

### Rationale & Design Decision
- We selected `modernc.org/sqlite`, a pure Go SQLite engine requiring **no CGO toolchains** or external C compilers.
- Running with `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON` ensures high-concurrency read/write performance, immediate durability, and relational cascade integrity.
- Automatic database migrations are embedded inside the Go binary using `//go:embed sql/migrations/*.sql`, enabling instantaneous bootstrap upon initial launch.

---

## 6. RFC 5545 iCalendar Interoperability

### Assumption
Students organize their academic life using established calendar tools (Google Calendar, Apple Calendar, Microsoft Outlook, Notion Calendar). Forcing them to check a proprietary in-app calendar leads to abandonment.

### Rationale & Design Decision
The backend generates native RFC 5545 `.ics` streams with proper `VEVENT`, `UID`, `DTSTART`, and `DTEND` tags. Students can export individual opportunity milestones or their entire preparation roadmap with a single click, instantly syncing deadlines across desktop and mobile devices.

---

## 7. Frontend Form & Motion Library Substitution

### Assumption & Implementation Pivot
The initial brief mentioned exploring Framer Motion and React Hook Form + Zod. During project setup on React 19 (`^19.3.1`), these libraries presented known peer-dependency conflicts with React 19.

### Rationale & Design Decision
To guarantee build reliability, zero peer-dependency warnings, and sub-second bundle performance:
- **Hardware-Accelerated CSS Transitions:** Replaced heavy JS animation bundles (`framer-motion`) with native Tailwind CSS transitions, CSS transforms, and `@media (prefers-reduced-motion: reduce)` accessibility compliance in `index.css`.
- **Controlled React 19 Forms + TanStack Query v5:** Replaced `react-hook-form` + `zod` with native controlled inputs, direct type-safe validation, and TanStack Query mutations (`useMutation`). This keeps the client bundle light (~111KB gzipped total) while providing immediate UI state feedback and automatic server cache synchronization.


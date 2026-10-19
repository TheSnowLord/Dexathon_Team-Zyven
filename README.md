# ACE Opportunity Compass

> An additive planning and confidence layer on top of opportunity discovery for students.  
> DEXATHON 2026 · ACE NextGen Challenge · PS Category: Software  
> **Team Zyven** (Ankush Shahu)

---

## Overview

ACE Opportunity Compass bridges the gap between discovering opportunities and following through. It answers the critical student question: *"I know this looks interesting — now what do I actually need to do?"*

The product structures follow-through into five distinct stages:
1. **Discover** — Browse and filter verified hackathons, internships, competitions, and workshops.
2. **Profile** — Lightweight, privacy-respecting student preferences (branch, year, skills, remote preference, budget cap).
3. **Explain** — Transparent match reasons and a three-tier eligibility breakdown (`confirmed`, `uncertain`, `verify-with-organizer`). Never an unjustified guarantee.
4. **Plan** — One-click "Save to plan" generating concrete preparation milestones backing off from deadlines, plus calendar export (`.ics`).
5. **Remind** — Strictly opt-in smart reminders with quiet hours and instant opt-out.

---

## Quickstart

Run both backend and frontend with a single command:
```bash
./scripts/dev.sh
# or on Windows PowerShell:
.\scripts\dev.bat
```

- Web UI: `http://localhost:5173`
- API Server: `http://localhost:8080` (Healthcheck: `http://localhost:8080/api/v1/health`)

Full architecture and design system documentation available in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/BUILD_BRIEF.md`](docs/BUILD_BRIEF.md).
# ACE OPPORTUNITY COMPASS — Autonomous Build Brief for Antigravity

**Repo:** `https://github.com/TheSnowLord/Dexathon_Team-Zyven.git` (currently empty except README)
**Event:** ACE NextGen Challenge · DEXATHON 2026 — PS Category: Software
**Theme:** Student opportunity & career enablement
**Team:** Zyven (inferred from repo name — confirm/correct in the final pitch deck if wrong)

---

## 0. How to use this file (read this part yourself, human)

1. Open **Antigravity → Agent Manager → New Agent**, point the workspace at a local clone of the repo above.
2. Paste this entire file as the task. Let the agent run in **Planning Mode** first — it should come back with a task list / plan derived from Section 16 below. Approve it.
3. Switch it to autonomous execution (Fast Mode / "keep going"). Do **not** micromanage individual commands — the rules in Section 2 and Section 13 are written so the agent polices itself.
4. The agent has its own in-IDE browser — tell it (or it already knows, from Section 12) to use that browser to click through every flow and screenshot it before marking anything done.
5. First action it should take: commit this exact file into the repo at `docs/BUILD_BRIEF.md`. Everything after that is the agent's job.

Everything below this line is written **to the agent**, not to the human.

---

## 1. Mission briefing

You are an autonomous senior full-stack engineer. Your job is to take **ACE Opportunity Compass** from an empty repo to a working, demo-ready, professionally engineered prototype, pushed to GitHub, with full commit history — without stopping to ask the human unless you hit something that genuinely has no safe default (see Section 2.4).

**What the product is.** ACE (All College Event — allcollegeevent.com) already helps students *discover* opportunities (events, hackathons, internships, competitions). Opportunity Compass is an **additive planning layer** on top of that discovery — it does not replace ACE's search/catalog. It answers one question a student has after finding something interesting: *"I know this looks interesting — now what do I actually need to do?"*

It does this through five stages, and your entire product surface should map cleanly onto them:

1. **Discover** — browse/filter opportunities (branch, year, skills, location, cost).
2. **Profile** — lightweight student profile: branch, year, skills, location, preferences.
3. **Explain** — for a given opportunity: *why it fits* (match reasons, not just a score) and an *eligibility checklist* that clearly separates **confirmed**, **uncertain**, and **verify-with-organizer** criteria. Never claim a guaranteed outcome.
4. **Plan** — saving an opportunity turns it into concrete steps + deadlines ("save to plan").
5. **Remind** — **opt-in only** nudges (push/calendar), with quiet hours and one-tap unsubscribe.

**Trust guardrails — these are product requirements, not nice-to-haves:**
- Normalize opportunity requirements into structured checks; never present an eligibility guess as a guarantee.
- Always show a source link + last-updated time for any opportunity data.
- Collect the minimum profile data needed; the user can edit or delete it at any time.
- Ranking must stay transparent — no feature may let paid/sponsored placement change eligibility results.

**MVP scope (build this; don't gold-plate):** profile setup → match reasons → eligibility checklist → save-to-plan. **Pilot-tier (build if MVP is solid and verified):** calendar export (.ics), opt-in reminders, lightweight feedback capture. **Explicitly out of scope for this build:** real ACE API integration (no public API exists — use realistic seed data instead), behavior-based relevance tuning, native mobile app. The user who commissioned this build does not need a separate mobile app — a fast, responsive, installable web app covers "website and app" for this submission. Do not spend time on React Native.

---

## 2. Operating rules (non-negotiable)

**2.1 — Work continuously.** Run through the milestone list in Section 16 end-to-end in one continuous session. Do not pause between milestones to report progress and wait; keep going until the Section 17 checklist is fully green or you hit a 2.4-grade blocker.

**2.2 — Never claim a task is done without proof.** "Done" means you ran it and watched it work — not that the code looks correct. For every milestone: run the build/lint, start the server(s), open the app in your browser tool, actually click/scroll/type through the affected flow, confirm no console errors, and only then check it off. If you cannot verify something (e.g., a sandbox limitation), say so explicitly in the commit/PR description instead of silently marking it complete.

**2.3 — Self-heal instead of stalling.** If any command fails — a package won't install, a port's taken, a library version conflicts, an API is rate-limited — diagnose from the actual error output, pick the next-best alternative yourself (see Section 3's fallback chains and Section 13), and keep moving. Never retry the identical failing command more than twice without changing something. Never end a session on a failure if an alternative path exists.

**2.4 — The only things worth stopping for:** (a) `gh auth status` shows you are not authenticated and no credential is available to fix that yourself, (b) a requirement is genuinely ambiguous *and* every reasonable default would materially change the product (rare — most ambiguity in this brief already has a stated default). For everything else: pick the sensible default, write it down as an "Assumption" in the relevant commit message or in `docs/ASSUMPTIONS.md`, and move on.

**2.5 — No fabrication.** No placeholder Lorem Ipsum in anything user-facing in the final build — write real, specific copy grounded in this brief. No invented API responses presented as if they were real ACE data — seed data must be clearly yours (see Section 11). No fake test/verification output.

**2.6 — Security/privacy basics.** Never commit secrets — use `.env` (gitignored) + `.env.example` (committed, no real values). No tracking beyond what's needed to run the app. Respect the data-minimization and delete/edit guardrails from Section 1 in the actual implementation, not just the pitch.

---

## 3. Tech stack (firm recommendation, with fallback chains)

Build it in **Go** for the backend — it's installed on this machine, it is fast, it compiles to one static binary (nothing to "forget to start"), and it's a differentiator versus the generic FastAPI/Node stack every other team will default to. The original problem-statement slide suggests FastAPI/Node — that's explicitly a skippable suggestion, not a requirement.

| Layer | Primary choice | If it breaks, fall back to | Why |
|---|---|---|---|
| Backend language/framework | **Go 1.22+**, `gofiber/fiber v2` | `go-chi/chi` (stdlib-based) → raw `net/http` | Fiber = fast to write, chi = fewer surprises if Fiber's middleware ecosystem causes friction |
| Database | **SQLite** via `modernc.org/sqlite` (pure Go, no CGO) | `mattn/go-sqlite3` (CGO) → embedded JSON file store as last resort | Pure-Go driver avoids CGO cross-compile pain — this is the single most common "it builds on my machine but not in CI" failure point, so avoid it by default |
| Query layer | plain `database/sql` + hand-written SQL in `/migrations` (embedded via `go:embed`) | `sqlx` if raw scanning gets noisy | Zero extra moving parts for a hackathon timeline |
| Frontend tooling | **Vite + React 18 + TypeScript** | Next.js (App Router) if Vite tooling misbehaves | Vite = fastest dev loop and smoothest HMR, which matters for your "every click/scroll should feel smooth" requirement |
| Styling | **Tailwind CSS** + `shadcn/ui` primitives (own the component code, don't fight it) | Hand-rolled CSS modules following the same design tokens if the shadcn CLI can't reach npm | shadcn gives you accessible, unstyled-enough primitives — you still have to make them look distinctive (Section 10) |
| Data fetching | **TanStack Query v5** | plain `fetch` + custom hooks | caching + background refetch = perceived smoothness without extra work |
| Routing | **React Router v6** | — | |
| Motion | **Framer Motion**, used sparingly (Section 10) | CSS transitions only | |
| Icons | **lucide-react** (one consistent set, never mix with emoji) | — | |
| Forms/validation | **React Hook Form + Zod** | — | |
| PWA/installability | `vite-plugin-pwa` | skip if it fights the build — not required for MVP | covers "the app" part of the brief without a second codebase |

If any exact install command below is stale by the time you run it, check `--help` or the tool's own docs rather than giving up on the whole tool.

**Auth:** skip real authentication for the MVP. Model a single local "student profile" keyed by a client-generated ID persisted in `localStorage` and sent as a header/cookie to the API. This is consistent with the "minimum profile data" guardrail and keeps you from burning a day on OAuth. Note this as a stated simplification in the README, with a one-paragraph note on how real auth would slot in later.

---

## 4. Repository layout

Arrange it as a monorepo, not a tangle of files at root:

```
Dexathon_Team-Zyven/
├── .github/
│   └── workflows/
│       └── ci.yml
├── apps/
│   ├── web/                 # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/    # discover/, profile/, plan/, reminders/
│   │   │   ├── lib/         # api client, query client, design tokens
│   │   │   ├── pages/
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                 # Go backend
│       ├── cmd/server/main.go
│       ├── internal/
│       │   ├── handlers/
│       │   ├── matching/    # rules-first eligibility + match-reason engine
│       │   ├── store/       # db access
│       │   └── models/
│       ├── migrations/
│       │   └── 0001_init.sql
│       ├── seed/
│       │   └── seed.go
│       └── go.mod
├── docs/
│   ├── BUILD_BRIEF.md        # this file, committed verbatim
│   ├── problem-statement.md  # extracted text of the uploaded deck
│   ├── ARCHITECTURE.md       # mermaid diagram + explanation
│   ├── ASSUMPTIONS.md
│   └── screenshots/
├── scripts/
│   └── dev.sh                # one command to run both apps locally
├── .env.example
├── .gitignore
├── LICENSE                   # MIT
└── README.md
```

Keep `apps/web` and `apps/api` fully independent (separate `package.json`/`go.mod`) so either can be deployed or run alone.

---

## 5. Git & commit discipline

- **Branches:** `main` is always the last-known-good state. Every milestone in Section 16 gets its own branch (`feat/...`, `chore/...`, `docs/...`, `ci/...` — names given per-milestone below). Open the branch, do the work, verify it (Section 12), merge to `main` (via `gh pr create` + `gh pr merge --squash --delete-branch`, or a direct fast-forward merge if `gh` PR flow is unavailable — either is fine, just keep history clean), then move to the next branch. Never commit the next milestone's work onto an unmerged previous branch.
- **Commit granularity:** commit **every time you finish one coherent change** — one new file, one function, one config tweak — don't bundle unrelated edits into a single commit. If you touch 5 unrelated files for 5 different reasons, that's 5 commits.
- **Commit messages:** Conventional Commits, and the message must describe what the diff *actually* does, not a vague placeholder:
  ```
  feat(api): add SQLite migration runner using go:embed
  feat(web): add discover screen filter chips for branch/year/skills
  fix(api): correct eligibility status enum serialization to lowercase
  chore(repo): add .gitignore for node_modules, dist, .env, go build output
  docs: add architecture diagram to docs/ARCHITECTURE.md
  ```
  Never commit with messages like `update`, `wip`, `fix stuff`, `final`, `changes`.
- **Push after every commit.** Don't batch five local commits and push once — push as you go, so the remote history mirrors your actual working order.
- Set git identity once at the start if unset: `git config user.name`/`user.email` to match the authenticated `gh` account.
- `.gitignore` must cover: `node_modules/`, `dist/`, `build/`, `.env`, `*.db`, Go build artifacts, `.DS_Store`, editor folders.

---

## 6. Data model

SQL (adapt types as needed for SQLite, this is the intent):

```sql
-- students use a client-generated id, no password
CREATE TABLE profiles (
  id            TEXT PRIMARY KEY,
  branch        TEXT NOT NULL,
  year          INTEGER NOT NULL,
  skills        TEXT NOT NULL,        -- JSON array
  location      TEXT,
  remote_ok     BOOLEAN DEFAULT 0,
  budget_cap    INTEGER,              -- max cost student can justify, null = no cap
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE opportunities (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  theme           TEXT,
  category        TEXT,               -- hackathon / internship / competition / workshop
  branches        TEXT,                -- JSON array, empty = open to all
  min_year        INTEGER,
  max_year        INTEGER,
  skills_tags     TEXT,                -- JSON array
  location        TEXT,
  is_remote       BOOLEAN DEFAULT 0,
  cost            INTEGER DEFAULT 0,
  deadline        DATE,
  source_url      TEXT NOT NULL,
  last_updated    DATETIME NOT NULL,
  eligibility_raw TEXT                 -- JSON array of {criterion, verifiable: bool}
);

CREATE TABLE plan_items (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT NOT NULL REFERENCES profiles(id),
  opportunity_id  TEXT NOT NULL REFERENCES opportunities(id),
  steps           TEXT NOT NULL,       -- JSON array of {label, done, due_date}
  status          TEXT DEFAULT 'saved',-- saved / in_progress / done / dropped
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminder_settings (
  profile_id      TEXT PRIMARY KEY REFERENCES profiles(id),
  opted_in        BOOLEAN DEFAULT 0,
  quiet_hours_start TEXT,              -- "22:00"
  quiet_hours_end   TEXT,              -- "08:00"
  cadence         TEXT DEFAULT 'per_deadline'
);
```

Eligibility status for any given profile+opportunity pair is **computed at request time**, not stored — it's a function of `profiles` and `opportunities`, categorized per criterion as `meets` / `verify` / `unmet`, per the trust guardrails.

---

## 7. Backend spec (Go)

REST, JSON, versioned under `/api/v1`. Keep responses boring and consistent: `{"data": ..., "error": null}` on success, `{"data": null, "error": {"message": "..."}}` on failure, correct HTTP status codes either way.

Endpoints:

```
GET    /api/v1/health
POST   /api/v1/profiles              create/replace the local profile
GET    /api/v1/profiles/:id
DELETE /api/v1/profiles/:id           full data deletion — this is a guardrail, implement it for real

GET    /api/v1/opportunities          ?branch=&year=&skill=&location=&remote=&maxCost=
GET    /api/v1/opportunities/:id
GET    /api/v1/opportunities/:id/match?profileId=...
                                      -> { matchReasons: string[], eligibility: {meets:[], verify:[], unmet:[]} }

POST   /api/v1/plan                  { profileId, opportunityId } -> creates plan_item with generated steps/dates
GET    /api/v1/plan?profileId=...
PATCH  /api/v1/plan/:id              update step completion / status
DELETE /api/v1/plan/:id

GET    /api/v1/plan/:id/ics          returns a calendar .ics file for the plan's deadlines

GET    /api/v1/reminders?profileId=...
PUT    /api/v1/reminders             upsert opt-in + quiet hours + cadence
```

**Matching engine (`internal/matching`) — rules-first, no ML, no black box:**
- Compute match reasons as plain sentences built from real field comparisons: branch match, year in range, skill overlap count (name the matched skills), location/remote fit, deadline runway ("12 days left — workable"), cost vs. budget cap.
- Compute eligibility by walking `eligibility_raw` criteria: if the criterion maps cleanly onto a structured profile field → `meets`/`unmet`; if it needs information the profile doesn't capture (e.g., "must have completed X certification") → `verify`. Never upgrade a `verify` to `meets` by guessing.
- An optional LLM-summary step is explicitly optional in the original brief — skip it for MVP; rules-first is the whole point of the trust story. Don't add an LLM call you then can't verify is accurate.

**Step generation for "save to plan":** when a plan item is created, generate a small, sensible step list from the opportunity (e.g., "Read full eligibility notice", "Prepare required documents", "Register before deadline", "Form/confirm team" if `category` is hackathon) each with a due date derived by backing off from the opportunity's deadline. This is a deterministic template, not a vague generator — keep the logic in one readable function so it's obviously not black-box.

---

## 8. Frontend spec (React)

Screens (each maps directly onto the five stages from Section 1):

1. **Onboarding / Profile** — branch, year, skill tags (multi-select, typeable), location, remote toggle, optional budget cap. Writes to `POST /profiles`. This is the Profile stage.
2. **Discover** — filterable opportunity list. Each card: title, category tag, a plain-language eligibility summary badge ("2 to verify" / "Looks eligible" / "Not eligible"), "Save to plan" action. This is the Discover stage, and the card is the one thing shown in the uploaded mock — match its intent, not its exact pixels.
3. **Opportunity detail** — four clearly separated sections matching the brief's four callouts: **Why it fits** (match reasons as a short list, not a bare score), **Eligibility check** (three visually distinct groups: confirmed / unknown / verify-with-organizer), **Action plan** (the generated steps + dates, editable/checkable), **Smart nudges** (an opt-in toggle, off by default — this is the Remind stage, and it must default to off).
4. **My Plan** — every saved opportunity with its step checklist and due dates, a "Download calendar (.ics)" button, and status.
5. **Settings/Privacy** — edit or delete profile data, reminder cadence + quiet hours, a visible "delete all my data" action that actually deletes.

**Performance/smoothness requirements (these are functional requirements, not polish):**
- Route-level code splitting; no single giant JS bundle.
- Every async view has a skeleton loading state — never a blank flash or a layout jump when data arrives.
- Optimistic updates for save-to-plan and step-checking (update the UI immediately, reconcile with the response).
- Debounce the discover-screen filters (don't refetch on every keystroke).
- Reserve space for images/avatars so nothing shifts on load (no CLS).
- Verify in your browser tool: no dropped frames scrolling the discover list, no input lag typing in filters, no console errors/warnings on any screen.
- Before calling the frontend milestone done, run a Lighthouse pass (your browser tool can do this) and aim for Performance ≥ 90, Accessibility ≥ 90. If you land lower, say what's pulling the score down rather than rounding up.

---

## 9. Design system — make it look like a real product, not a generated one

The subject matter is **trust and clarity under uncertainty** — a student deciding whether something is worth their time, with "confirmed vs. uncertain vs. verify" as the core mechanic. Design toward that: calm, legible, confident — closer to how a good fintech or admissions product feels than a flashy consumer app. If you have access to Google Stitch (`stitch.withgoogle.com`) or a Figma-to-code plugin (Anima / Locofy / Builder.io Visual Copilot / similar) in this environment, you may use it to rough out **visual direction only** for one or two screens — do not depend on it, and do not let it block you if unavailable; everything below is specific enough to build directly in code.

**Concrete tokens (commit these to `apps/web/src/lib/tokens.ts` or Tailwind config — don't drift from them):**

- Background: `#F5F6F8` (cool neutral, not warm cream). Ink text: `#14171F`.
- Primary accent (actions, links, focus rings): a confident deep indigo/cobalt, `#2B3F8C`. Used sparingly — one accent, not a gradient.
- Status colors carry real meaning, not decoration: `meets` = deep emerald `#1F7A4D`, `verify` = amber `#A9690F`, `unmet`/error = muted rust `#A13A2E`. These map 1:1 onto the eligibility states — don't introduce extra colors for the same concept elsewhere.
- Typography: a distinctive pairing grounded in the subject (academic/institutional confidence), not the generic default. Display/headlines: **Fraunces** (a serif with real character, for the handful of places a headline needs presence — hero, section titles). UI/body: **Public Sans** (clean, highly legible grotesk, used for everything functional — forms, cards, data). Set a real type scale (don't eyeball sizes); keep line length under ~80 characters for body copy.
- Borders over shadows: default to 1px hairline borders (`#E2E4EA`) to separate content; reserve shadow for genuinely elevated things (an open modal, a dropdown) — don't put the same soft grey shadow under every card, and don't give every component the same border-radius regardless of role (denser data containers like the eligibility checklist can be sharper-cornered; primary content cards can be softer).
- Numbered step markers (01/02/03 style) are only used where something is a genuine sequence — the five-stage lifecycle diagram and an onboarding wizard's steps qualify; nothing else does.
- Motion: one deliberate, orchestrated moment per screen (e.g., the eligibility groups resolving in on first load of the detail screen), plus motion that directly answers a user action (checking a step, saving to plan). Do **not** apply a generic fade-slide-up to every section or a hover-lift to every card — that reads as templated.

**Explicitly avoid** (these are the common tells of an AI-generated-looking page — do not reproduce them):
- Warm cream background + terracotta/clay accent, or a near-black background with a single acid-green/vermillion accent.
- The "SaaS card kit": every piece of content chopped into identical rounded cards with the same soft shadow and a gradient wash behind them.
- Tracked-out ALL-CAPS eyebrow labels above every heading, meta text joined with middle-dots ("A · B · C"), labels styled as "WORD — fragment" with a spaced em dash, or a "→" tacked onto every button/link. (Note: the source pitch-deck template uses this presentation-deck chrome heavily — that's fine for a slide, it is **not** the target look for the actual product UI. Don't carry deck styling into the app.)
- Monospace font for small data labels "because it looks technical."
- Accenting a single word in a headline with italics/bold/color for no structural reason.
- Lorem-ipsum or generically upbeat SaaS copy ("Unlock your potential!") — write plain, specific copy in the app's own voice: actions say exactly what they do ("Save to plan", not "Get started"), and the result of an action uses the same word ("Saved to plan" toast, not "Success!").

Before you consider any screen's visual pass complete, take a screenshot with your browser tool and critique it against the "avoid" list above — if it matches one of those patterns, revise it.

---

## 10. Seed data

Seed at least 8 realistic opportunities via `apps/api/seed/seed.go`, run once at first startup if the table is empty. Include, verbatim in spirit, the one example the brief itself uses as a sample listing so the demo matches the pitch:

- *"AI for Impact Hackathon"* — category: hackathon, branches: open to all (CSE/IT/ECE), remote-friendly, 2 eligibility criteria where one is structurally verifiable (team size ≤ 4, checkable) and one genuinely requires organizer verification (e.g., "prior hackathon experience preferred" — mark this `verify`, not `meets`, however the demo profile looks).

Add 7 more spanning internships, competitions, and workshops with varied branches/years/skills/locations/costs/deadlines so filtering and "verify" vs "meets" states are visibly exercised. Mark every seed row's `source_url` clearly as example data (e.g. point to the real ACE site as the "kind of place this would come from" with a note in `docs/ASSUMPTIONS.md` that these are illustrative, matching the uploaded brief's own "concept UI, not an actual ACE screen" caveat) — do not imply you scraped real current ACE listings.

Seed one demo profile too (CSE/IT, 1st year, a handful of common skills) so the app is populated and demoable the moment it starts, with zero manual setup.

---

## 11. Verification protocol — the actual "definition of done" per milestone

For **every** milestone in Section 16, before checking it off:

1. **Build/compile cleanly.** `go build ./...` and `go vet ./...` for the backend; `npm run build` and `tsc --noEmit` for the frontend. Zero errors. Warnings get looked at, not ignored by default.
2. **Lint.** `gofmt -l .` (should print nothing) and `golangci-lint run` if available; ESLint + Prettier on the frontend.
3. **Run it for real.** Start both servers (`scripts/dev.sh`), confirm `GET /api/v1/health` returns 200, confirm the frontend loads with zero console errors.
4. **Exercise the actual flow with your browser tool** — not just "the code looks right": click through the specific screen(s) this milestone touched, type into the actual filters/forms, confirm the UI updates, take a screenshot.
5. **Write the commit(s)** per Section 5, push, and merge the branch.

Only after all five steps pass does a milestone get marked complete in your task list. If step 1–3 fails, you're in Section 13 territory, not done.

---

## 12. Self-healing / failure recovery

- Read the actual error text before changing anything — don't guess blind.
- First failure on a given command: fix the obvious cause (missing dependency, wrong path, version mismatch) and retry.
- Second failure on the same approach: switch to the documented fallback for that layer (Section 3's table) rather than retrying a third time with no change.
- Record every non-trivial pivot ("switched DB driver from X to Y because Z failed to cross-compile") in the relevant commit message so the history explains itself.
- If a whole milestone is blocked by something external (e.g., no network access to fetch a font), substitute the nearest available equivalent (a locally bundled font, a different package mirror) and note the substitution in `docs/ASSUMPTIONS.md` — don't stall the whole run over one unavailable resource.
- Use your browser tool's screenshots as your own feedback loop: if a page is visibly broken (overlapping text, unstyled elements, broken layout), that's a bug to fix now, not a "pre-existing issue" to leave for later.

---

## 13. CI & deployment (do this — it's part of "professionally engineered," and it's free)

`.github/workflows/ci.yml`: on every push to `main` and every PR — install deps, build both apps, run lints, run `go vet`/`tsc --noEmit`. Keep it fast (a few minutes, not an epic).

Optional but recommended if time allows after Section 17 is green: deploy `apps/web` to Vercel (or Netlify) and `apps/api` to Fly.io or Render's free tier; wire the frontend's API base URL via an env var so both local dev and the deployed build work without code changes. Link both in the README. If free-tier deploy friction eats more than a small amount of time, skip it — a flawless local run beats a flaky public deploy for a hackathon demo.

---

## 14. Documentation deliverables

- `docs/problem-statement.md` — the extracted text of the uploaded pitch deck, committed so the repo is self-contained and judges don't need the original pptx.
- `docs/ARCHITECTURE.md` — a short write-up plus a Mermaid diagram of the five-stage flow (Discover→Profile→Explain→Plan→Remind) mapped onto actual screens/endpoints from Sections 7–8.
- `docs/ASSUMPTIONS.md` — every default you picked instead of asking, per Section 2.4.
- `README.md` — what this is (2–3 sentences), the five-stage concept, setup/run instructions (`scripts/dev.sh`, one command), screenshots of the real running app (not mockups), and the "what's MVP vs. pilot vs. explicitly out of scope" split from Section 1 so judges know the scope was deliberate.

---

## 15. (reserved — verification protocol lives in Section 11, keep numbering as-is for traceability with the task list below)

---

## 16. Milestone task list — run in this order

- [ ] **M0 `chore/bootstrap`** — folder skeleton (Section 4), `.gitignore`, `LICENSE` (MIT), README stub, commit this brief to `docs/BUILD_BRIEF.md` and the extracted problem statement to `docs/problem-statement.md`.
- [ ] **M1 `feat/api-skeleton`** — Go module, Fiber server, `/health`, SQLite connection + `go:embed` migration runner, CI lint/build wired for the Go side.
- [ ] **M2 `feat/db-schema-seed`** — all four tables from Section 6, `seed.go` with 8+ opportunities per Section 10 and one demo profile, runs automatically on empty DB.
- [ ] **M3 `feat/api-core`** — all endpoints from Section 7 including the matching/eligibility engine, with real request/response testing via curl or an HTTP client, not just compiling.
- [ ] **M4 `feat/web-skeleton`** — Vite+React+TS+Tailwind+shadcn init, router shell, `tokens.ts` from Section 9, base responsive layout, API client + TanStack Query wired to `/health`.
- [ ] **M5 `feat/web-profile`** — Onboarding/Profile screen, posts to the real API.
- [ ] **M6 `feat/web-discover`** — Discover screen with working filters and match cards against real seed data.
- [ ] **M7 `feat/web-detail`** — Opportunity detail: why-it-fits, eligibility groups, action plan, smart-nudges toggle (default off), save-to-plan.
- [ ] **M8 `feat/web-plan`** — My Plan screen, step checklist, `.ics` calendar export actually downloadable and valid.
- [ ] **M9 `feat/web-settings`** — Settings/privacy: edit/delete profile (really deletes), reminder cadence + quiet hours.
- [ ] **M10 `chore/polish`** — motion pass (Section 9), skeleton/error states everywhere, responsive check at 375/768/1440px, a11y pass (focus rings, contrast, `prefers-reduced-motion` respected), Lighthouse check.
- [ ] **M11 `docs/readme`** — all of Section 14, with real screenshots dropped into `docs/screenshots/`.
- [ ] **M12 `ci/pipeline`** — CI workflow green on `main`; attempt the optional free-tier deploy from Section 13.
- [ ] **M13** — final sweep against Section 17, tag `v1.0-submission` on `main`.

---

## 17. Final submission checklist — do not call this done until every line is genuinely true

- [ ] `main` builds and runs from a clean clone with nothing but `scripts/dev.sh`.
- [ ] All five stages (Discover, Profile, Explain, Plan, Remind) are reachable and functional in the running app — verified by you, in the browser, this session.
- [ ] Eligibility is always shown as confirmed/uncertain/verify, never as a bare guarantee, anywhere in the UI.
- [ ] Reminders/notifications default to opt-out (off) until the user explicitly opts in.
- [ ] Delete-my-data actually deletes, verified by checking the DB/API after calling it.
- [ ] No console errors on any screen; no visible layout shift or jank scrolling the Discover list.
- [ ] Every commit in `git log` has a specific, accurate message; no `wip`/`update`/`fix stuff`.
- [ ] `main` has no unmerged, abandoned feature branches left dangling for work that's actually done.
- [ ] README lets a stranger run the whole thing in under five minutes.
- [ ] Nothing in the running app looks like a generic AI-generated template per the Section 9 "avoid" list.

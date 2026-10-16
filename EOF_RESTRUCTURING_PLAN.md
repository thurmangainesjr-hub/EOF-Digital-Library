# EOF ECOSYSTEM RESTRUCTURING PLAN
**From Monolith to Hub-and-Spoke Architecture**
June 2026 | Architecture: Modular Multi-Repo

---

## THE PROBLEM

The current EOF Digital Library Vite app hosts 110+ pages, 64 components, and 14 layout files covering 10+ conceptually distinct applications inside one repository, one Claude project, and one conversation context. Every session must load context about all of them, causing:

- Context window exhaustion in Claude conversations
- Slow iteration (touching Film Studio code requires loading Library code)
- No isolation between divisions (a bug in FHHL code can affect Music Studio)
- Claude project memory limits hit because all app knowledge lives in one place
- Impossible to onboard AI agents into a single division without the whole ecosystem

**Current inventory:**
- 1 monolithic Vite/React repo at `localhost:5174`
- 1 Next.js repo at `localhost:3000` (Griot AI — already isolated, correct pattern)
- 110 pages, 64 components, 14 layouts — all in `frontend/src`

---

## THE SOLUTION: HUB-AND-SPOKE ARCHITECTURE

EOF Central = hub. Every other app = spoke. Each spoke is fully independent.

```
                    ┌─────────────────┐
                    │   EOF CENTRAL   │
                    │  (The Hub OS)   │
                    │   Port: 5100    │
                    └────────┬────────┘
          ┌─────────┬────────┼────────┬─────────┐
          ▼         ▼        ▼        ▼         ▼
     ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
     │  Griot  │ │ DIY  │ │ Film │ │Music │ │ FHHL │
     │  AI     │ │ Univ │ │Studio│ │Studio│ │      │
     │  :3000  │ │:5175 │ │:5176 │ │:5177 │ │:5178 │
     └─────────┘ └──────┘ └──────┘ └──────┘ └──────┘
          ▼         ▼        ▼        ▼         ▼
     ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
     │   EOF   │ │Legacy│ │Orion │ │Akash │ │Growth│
     │ Library │ │Vault │ │Media │ │  ic  │ │Suite │
     │  :5174  │ │:5180 │ │:5179 │ │:5181 │ │:5182 │
     └─────────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

---

## DELIVERABLE 1: REPOSITORY STRUCTURE

### Target: One Repo Per App

```
C:\Users\dhous\
├── eof-central\               ← NEW: Master OS hub
│   └── frontend\              (Vite/React, port 5100)
│
├── eof-digital-library\       ← EXISTING: Refactored to Library only
│   └── frontend\              (Vite/React, port 5174)
│
├── GriotAI\story-engine\      ← EXISTING: Already isolated ✓
│                              (Next.js, port 3000)
│
├── diy-university\            ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5175)
│
├── eof-film-studio\           ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5176)
│
├── eof-music-studio\          ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5177)
│
├── fhhl\                      ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5178)
│
├── orion-media\               ← NEW: Build from scratch
│   └── frontend\              (Vite/React, port 5179)
│
├── eof-legacy-vault\          ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5180)
│
├── eof-akashic\               ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5181)
│
├── eof-growth-suite\          ← NEW: Extract from eof-digital-library
│   └── frontend\              (Vite/React, port 5182)
│
└── eof-shared\                ← NEW: Shared design system npm package
    ├── components\            (shared UI primitives)
    ├── tokens\                (colors, typography, spacing)
    └── utils\                 (appUrl linking, agent helpers)
```

### Migration Priority Order
1. **Phase 1** (highest ROI): Extract EOF Central → standalone app
2. **Phase 2**: Extract Film Studio + Music Studio (most developed, most code)
3. **Phase 3**: Extract DIY University + FHHL
4. **Phase 4**: Extract Legacy Vault + Akashic Records
5. **Phase 5**: Build Orion Media + Growth Suite from scratch in own repos

### What Stays in `eof-digital-library`
After migration, the library repo retains only:
- `Dashboard.jsx` (book shelves, reading)
- `Library.jsx`, `Bookshelves.jsx`, `Reader.jsx`
- `Gutenberg.jsx`, `GutenbergReader.jsx`
- `Membership.jsx`
- `LibraryAppLayout.jsx`
- `LibraryWidgetPage.jsx`

---

## DELIVERABLE 2: CLAUDE PROJECT STRUCTURE

### One Claude Project Per App

| Claude Project Name | Working Directory | CLAUDE.md Focus |
|--------------------|-------------------|-----------------|
| **EOF Central** | `eof-central/frontend` | OS control plane, agent registry, division summaries |
| **EOF Library** | `eof-digital-library/frontend` | Books, archives, search, Gutenberg |
| **Griot AI** | `GriotAI/story-engine` | Story engine, character/world/canon builders |
| **DIY University** | `diy-university/frontend` | Courses, professors, certs, learning paths |
| **Film Studio** | `eof-film-studio/frontend` | NLE editor, storyboard, production pipeline |
| **Music Studio** | `eof-music-studio/frontend` | DAW, recording, mixing, releases |
| **FHHL** | `fhhl/frontend` | League, draft, battles, standings |
| **Legacy Vault** | `eof-legacy-vault/frontend` | Family archives, memory vaults |
| **Akashic Records** | `eof-akashic/frontend` | Genealogy, diaspora research |
| **Growth Suite** | `eof-growth-suite/frontend` | SEO, marketing, advertising |
| **Orion Media** | `orion-media/frontend` | News, radio, streaming, magazine |

### CLAUDE.md Requirement Per Project
Each CLAUDE.md must include ONLY:
```markdown
# [App Name] — Claude Project Context

## What This App Does
[2-3 sentences]

## Tech Stack
[Framework, port, key files]

## Key Data Files
[data/*.js files specific to this app]

## Agent in Charge
[Head agent name and role]

## Integration Points
[How this app connects to EOF Central]

## DO NOT LOAD
The following are in other projects — do not load their context:
- [list of other apps]

## Reference
See EOF_MASTER_SUMMARY.md for the full ecosystem overview.
```

### Memory Files Per Project
Each Claude project maintains its own memory:
```
<project>/.claude/memory/
  project_[app]_pages.md       ← routes and page inventory
  project_[app]_agents.md      ← agents specific to this app
  project_[app]_design.md      ← color, layout, components
  feedback_[app]_conventions.md ← app-specific coding conventions
```

---

## DELIVERABLE 3: DOCUMENTATION STRUCTURE

### Per-App Documentation
```
<app-repo>/
├── docs/
│   ├── AGENTS.md              ← All agents: role, level, capabilities
│   ├── ROUTES.md              ← All routes and page descriptions
│   ├── COMPONENTS.md          ← Component catalog with usage
│   ├── DATA_MODELS.md         ← Data structures and exports
│   ├── DESIGN.md              ← Color, layout, UI rules specific to app
│   └── INTEGRATION.md        ← How this app talks to EOF Central
├── EOF_MASTER_SUMMARY.md      ← Symlink or copy of the global master doc
└── CLAUDE.md                  ← Claude project instructions
```

### Ecosystem-Level Documentation
```
C:\Users\dhous\
├── EOF_MASTER_SUMMARY.md      ← Global 20-page reference (already created)
├── EOF_RESTRUCTURING_PLAN.md  ← This document
├── EOF_AGENT_REGISTRY.md      ← All agents across all apps
├── EOF_PORT_MAP.md            ← Server → port → route map
└── EOF_DESIGN_SYSTEM.md       ← Color tokens, typography, shared UI rules
```

---

## DELIVERABLE 4: SHARED STANDARDS ARCHITECTURE

### Shared npm Package: `@eof/shared`

```
eof-shared/
├── src/
│   ├── tokens/
│   │   ├── colors.js          ← All hex values by system name
│   │   ├── typography.js      ← Font families, sizes, weights
│   │   └── spacing.js         ← Padding, margin, gap standards
│   ├── components/
│   │   ├── EOFTopNav/         ← Universal top navigation
│   │   ├── EOFSidebar/        ← Universal sidebar shell
│   │   ├── AgentCard/         ← Agent avatar card (used everywhere)
│   │   ├── UniversalIntro/    ← EOF intro animation
│   │   ├── ComingSoon/        ← Placeholder for unfinished pages
│   │   └── AppWidget/         ← Base widget shell
│   └── utils/
│       ├── appLink.js         ← External vs internal link helper
│       ├── agentEvolution.js  ← Knowledge score / level calc
│       └── systemHealth.js    ← Health status helpers
├── package.json
└── index.js
```

### Standards Every App Must Implement
1. **EOF Universal Intro** — black → particles → "Powered by EOF" → app identity
2. **Universal Top Nav** — Logo, Search, Notifications, Profile, Agent Hub, Settings
3. **appLink pattern** — check `appUrl` in system meta before rendering `<Link>` vs `<a>`
4. **Color token** — import from `@eof/shared/tokens/colors` — never hardcode hex
5. **Coming Soon guard** — every stub route renders `<ComingSoon />`, never blank page

---

## DELIVERABLE 5: AGENT HIERARCHY MAP

```
THE CONDUCTOR (EOF Central — Level 5)
│   Role: Ecosystem orchestration, cross-division coordination
│   Spawns: Any division head on demand
│
├── GRIOT CENTRAL (Griot AI — Level 5)
│   ├── Canon Keeper (Level 4)
│   ├── Story Architect (Level 4)
│   ├── Character Builder Agent (Level 3)
│   └── World Builder Agent (Level 3)
│
├── CHANCELLOR AI (DIY University — Level 5)
│   ├── Professor Agents × N (Level 3, per school/subject)
│   ├── Curriculum Designer (Level 4)
│   └── Student Success Agent (Level 3)
│
├── THE ARCHIVIST (EOF Library — Level 4)
│   ├── Research Analyst (Level 3)
│   └── Catalog Agent (Level 2)
│
├── DIRECTOR PRIME (Film Studio — Level 5)
│   ├── Storyboard Agent (Level 3)
│   ├── Asset Manager (Level 3)
│   └── Visual Effects Agent (Level 3)
│
├── THE ARCHITECT (Music Studio — Level 5)
│   ├── Producer Agent (Level 4)
│   ├── Mixing Agent (Level 3)
│   └── Release Manager (Level 3)
│
├── COMMISSIONER AI (FHHL — Level 4)
│   ├── Draft Analyst (Level 3)
│   ├── Stats Tracker (Level 2)
│   └── Battle Judge (Level 3)
│
├── THE KEEPER (Legacy Vault — Level 4)
│   ├── Memory Archivist (Level 3)
│   └── Family History Agent (Level 3)
│
├── THE ARCHIVIST (Akashic Records — Level 4)
│   ├── Genealogy Researcher (Level 3)
│   └── Diaspora Intel Agent (Level 3)
│
├── SENTINEL PRIME (Security — Level 5)
│   ├── Threat Detection Agent (Level 4)
│   ├── Compliance Agent (Level 3)
│   └── Access Manager (Level 3)
│
├── ORION NEWS DIRECTOR (Orion Media — Level 5)
│   ├── Journalism Agent (Level 3)
│   ├── Marketing Director (Level 4)
│   └── Social Media Manager (Level 3)
│
└── SEO DIRECTOR (Growth Suite — Level 5)
    ├── Keyword Intelligence Agent (Level 3)
    ├── Technical SEO Agent (Level 3)
    ├── Local SEO Agent (Level 3)
    ├── GEO Agent (Level 3)
    ├── Marketing Director (Level 4)
    │   ├── Market Research Analyst (Level 3)
    │   ├── Funnel Architect (Level 3)
    │   └── Campaign Manager (Level 3)
    └── Advertising Director (Level 4)
        ├── Meta Ads Specialist (Level 3)
        └── Search Ads Specialist (Level 3)
```

---

## DELIVERABLE 6: NAVIGATION MAP

### Port / URL Map

| App | Dev URL | Prod URL (future) |
|-----|---------|-------------------|
| EOF Central | `localhost:5100` | `central.eof.app` |
| EOF Library | `localhost:5174` | `library.eof.app` |
| Griot AI | `localhost:3000` | `griot.eof.app` |
| DIY University | `localhost:5175` | `university.eof.app` |
| Film Studio | `localhost:5176` | `film.eof.app` |
| Music Studio | `localhost:5177` | `music.eof.app` |
| FHHL | `localhost:5178` | `fhhl.eof.app` |
| Orion Media | `localhost:5179` | `orion.eof.app` |
| Legacy Vault | `localhost:5180` | `vault.eof.app` |
| Akashic Records | `localhost:5181` | `akashic.eof.app` |
| Growth Suite | `localhost:5182` | `growth.eof.app` |

### Route Structure Per App (Standard Template)
```
<app-root>/                    ← Hub/Dashboard
<app-root>/agents              ← Agent Hub for this app
<app-root>/widgets             ← Widget showcase
<app-root>/settings            ← App-level settings
<app-root>/<feature-1>         ← Primary feature
<app-root>/<feature-2>         ← Secondary feature
...
```

### Cross-App Navigation Flow
```
User at EOF Central
  → Clicks "Film Studio" division card
  → Central checks SYSTEM_META: appUrl = "http://localhost:5176"
  → Opens Film Studio in new tab (or iframe embed)
  → Film Studio top nav shows "← Back to EOF Central" link
  → Film Studio Agent Hub shows Director Prime agents only
```

---

## DELIVERABLE 7: CONTEXT OPTIMIZATION STRATEGY

### Claude Conversation Isolation Rules

**Rule 1: One project = one Claude conversation context**  
Never discuss DIY University code in the Film Studio Claude project. Start a new conversation in the correct project.

**Rule 2: EOF_MASTER_SUMMARY.md is the only cross-project file**  
When a conversation needs ecosystem-level context, attach only `EOF_MASTER_SUMMARY.md` — never individual app docs from other projects.

**Rule 3: Agent data stays in app repos**  
`agentData.js` must be split into per-app data files:
```
eof-central/src/data/agentData.js        ← Division summaries only
eof-film-studio/src/data/filmAgents.js   ← Film agents only
eof-music-studio/src/data/musicAgents.js ← Music agents only
... etc
```

**Rule 4: No global state in EOF Central**  
Central imports only: `{ id, name, status, agentCount, uptime }` per division.  
Never: individual agent details, sub-page routes, or operational data.

**Rule 5: Context budget per conversation**  
| Content Type | Max Tokens |
|---|---|
| CLAUDE.md for current app | 500 tokens |
| EOF_MASTER_SUMMARY.md (when needed) | 2,000 tokens |
| Current files being edited | Unlimited |
| Other apps' files | 0 (never load) |

### Splitting agentData.js (Current Monolith → Per-App)

Current: `src/data/agentData.js` — 15 divisions, all agents, all health data in ONE file  
Target: Each app repo has its own data file with only its agents.

EOF Central's `agentData.js` after split:
```javascript
// eof-central/src/data/agentData.js
// Only division-level summaries — NO agent details from other apps
export const DIVISIONS = [
  { id: 'film-studio', name: 'Film Studio', appUrl: 'http://localhost:5176', status: 'active' },
  { id: 'music-studio', name: 'Music Studio', appUrl: 'http://localhost:5177', status: 'active' },
  // ... one entry per division, no sub-agent data
];
```

---

## DELIVERABLE 8: FILE ORGANIZATION STRATEGY

### Standard Per-App File Structure
```
<app-name>/
├── frontend/
│   ├── src/
│   │   ├── pages/             ← Route-level components (flat, no subfolders needed)
│   │   ├── components/        ← App-specific UI components
│   │   │   ├── layout/        ← Sidebar, TopNav wrappers
│   │   │   ├── agents/        ← Agent cards, panels, chat modals
│   │   │   └── widgets/       ← Widget components
│   │   ├── data/              ← ALL data files for this app only
│   │   ├── context/           ← React context (auth, theme)
│   │   └── services/          ← API calls
│   ├── public/
│   ├── index.html
│   ├── vite.config.js         ← port set here (e.g., server: { port: 5176 })
│   └── package.json
├── docs/
│   ├── AGENTS.md
│   ├── ROUTES.md
│   └── DESIGN.md
├── CLAUDE.md                  ← Must exist in every repo
└── README.md
```

### Component Naming Convention (Preserved)
- Layout wrappers: `<AppName>AppLayout.jsx` (e.g., `FilmStudioAppLayout.jsx`)
- Hub pages: `<AppName>Hub.jsx` (e.g., `FilmStudioHub.jsx`)
- Editor apps: `<AppName>App.jsx` (e.g., `FilmEditorApp.jsx`)
- Agent cards: `<AppName>AgentCard.jsx` (e.g., `FilmAgentCard.jsx`)
- Intro components: `<AppName>Intro.jsx` (e.g., `FilmIntro.jsx`)
- Widget pages: `<AppName>WidgetPage.jsx`

### Files to Extract Per App (Migration Guide)

**Film Studio extract:**
```
src/pages/FilmEditorApp.jsx       → eof-film-studio/src/pages/
src/pages/FilmStudioHub.jsx       → eof-film-studio/src/pages/
src/pages/FilmStudioWidgetPage.jsx → eof-film-studio/src/pages/
src/components/FilmAgentCard.jsx   → eof-film-studio/src/components/
src/components/FilmIntro.jsx       → eof-film-studio/src/components/
src/layouts/FilmStudioAppLayout.jsx → eof-film-studio/src/components/layout/
```

**Music Studio extract:**
```
src/pages/MusicRecorderApp.jsx    → eof-music-studio/src/pages/
src/pages/MusicStudioHub.jsx      → eof-music-studio/src/pages/
src/pages/MusicStudioWidgetPage.jsx → eof-music-studio/src/pages/
src/components/MusicAgentCard.jsx  → eof-music-studio/src/components/
src/components/MusicIntro.jsx      → eof-music-studio/src/components/
src/layouts/MusicStudioAppLayout.jsx → eof-music-studio/src/components/layout/
```

*(Same pattern for DIY University, FHHL, Legacy Vault, Akashic)*

---

## DELIVERABLE 9: KNOWLEDGE MANAGEMENT STRATEGY

### Three-Tier Knowledge Architecture

**Tier 1 — Global (ecosystem-wide):**  
`EOF_MASTER_SUMMARY.md` — 20 pages max, lives in `C:\Users\dhous\`  
Load ONLY when working on cross-ecosystem features. Never load this and an app's full context at the same time.

**Tier 2 — App-Level (per Claude project):**  
Each Claude project's memory files cover only that app.  
Maximum total memory per app: ~5,000 tokens.

**Tier 3 — Session-Level (ephemeral):**  
In-conversation context: current files, current task, immediate history.  
Do not persist session knowledge — it belongs in git history or docs.

### Agent Memory System (In-App)
Each agent stores its own knowledge vault:
```javascript
// Per-agent knowledge vault structure
{
  agentId: 'director-prime',
  knowledgeScore: 450,          // Current XP
  level: 'Expert',              // Derived from score
  researchLog: [],              // Research done (titles only, not full content)
  performanceHistory: [],       // Task completion rates
  specializations: [],          // Temporary sub-agent contexts spawned
  lastActive: '2026-06-16'
}
```

### Cross-Project Knowledge Handoff
When work spans apps (e.g., "add Film Studio card to EOF Central"):  
1. Open EOF Central project
2. Attach only: `EOF_MASTER_SUMMARY.md` + Film Studio's `INTEGRATION.md` (2 files max)
3. Never attach Film Studio's full pages/components context
4. After work: update `EOF_MASTER_SUMMARY.md` if division status changed

---

## DELIVERABLE 10: LONG-TERM SCALING ROADMAP

### Phase 1 — Stabilize (Weeks 1–2)
- [ ] Create `EOF_MASTER_SUMMARY.md` ✓ (done)
- [ ] Create `EOF_RESTRUCTURING_PLAN.md` ✓ (done)
- [ ] Create `eof-central` repo — extract EOF Central from monolith
- [ ] Create `CLAUDE.md` in `eof-central` and `eof-digital-library`
- [ ] Split `agentData.js` — Central gets summary-only version

### Phase 2 — Extract High-Traffic Apps (Weeks 3–6)
- [ ] Extract Film Studio → `eof-film-studio` repo (port 5176)
- [ ] Extract Music Studio → `eof-music-studio` repo (port 5177)
- [ ] Update `appUrl` entries in EOF Central's agentData for both
- [ ] Update desktop shortcuts to new ports

### Phase 3 — Extract Education & Community (Weeks 7–10)
- [ ] Extract DIY University → `diy-university` repo (port 5175)
- [ ] Extract FHHL → `fhhl` repo (port 5178)
- [ ] Extract Legacy Vault → `eof-legacy-vault` repo (port 5180)

### Phase 4 — Extract Specialized Apps (Weeks 11–14)
- [ ] Extract Akashic Records → `eof-akashic` repo (port 5181)
- [ ] Create `@eof/shared` npm package with design tokens + shared components
- [ ] Wire all extracted apps to import from `@eof/shared`

### Phase 5 — Build New Apps (Weeks 15–20)
- [ ] Build Orion Media Network → `orion-media` repo (port 5179)
- [ ] Build Growth Intelligence Suite → `eof-growth-suite` repo (port 5182)
- [ ] Build EOF Security Command → `eof-security` repo (port 5183)

### Phase 6 — Production Infrastructure (Months 6–12)
- [ ] Move from localhost ports to subdomain routing (`*.eof.app`)
- [ ] Real authentication layer (JWT/OAuth) replacing session mock
- [ ] Real agent backend (API endpoints, LLM calls, memory persistence)
- [ ] Real database (PostgreSQL or Supabase) per app
- [ ] CI/CD pipeline per repo (GitHub Actions)
- [ ] Staging environments per app

### Scaling Principles (Long-Term)
1. **Micro-frontend optional** — apps can stay separate Vite instances or migrate to Module Federation
2. **API-first** — all cross-app data flows through a REST or GraphQL API, never direct imports
3. **Agent backend** — Level 4/5 agents require backend LLM calls; build these when ready
4. **White-label mode** — Growth Suite clients get their own subdomain with custom branding
5. **Mobile** — React Native extraction from shared component library (when needed)

---

## IMMEDIATE NEXT ACTIONS (DO THESE FIRST)

1. **Create `eof-central` directory** — move `EOFCentralHub.jsx`, `CentralAppLayout.jsx`, `CentralWidgetPage.jsx`, `CentralAgentCard.jsx`, `CentralIntro.jsx` there
2. **Create `CLAUDE.md`** in `eof-central/frontend` and `eof-digital-library/frontend`
3. **Split `agentData.js`** — central gets division summary only; move full agent data to per-app files
4. **Create separate Claude projects** in Claude.ai: "EOF Central", "EOF Library" as the first two
5. **Start new conversations** for each app in its own project — never mix app contexts

---

*All existing features, agents, pages, systems, databases, workflows, and functionality are preserved. This is architecture only — not a deletion plan.*

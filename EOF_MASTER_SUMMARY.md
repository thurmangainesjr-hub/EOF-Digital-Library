# EOF MASTER SUMMARY
**Expression of Freedom — Ecosystem Overview**
Version 1.0 | Updated: June 2026 | Max Load Document: 20 pages

---

## WHAT IS EOF

Expression of Freedom (EOF) is a creator, media, education, and business operating system — a family of interconnected applications comparable to Adobe Creative Cloud + Google Workspace + HubSpot, designed for independent creators, artists, educators, and businesses.

**One OS. Many specialized apps. Everything connected.**

---

## ECOSYSTEM MAP

| # | Application | Purpose | Color | Status |
|---|-------------|---------|-------|--------|
| 0 | **EOF Central** | Master OS control plane, agent registry, auth | Gold `#D4AF37` | Live |
| 1 | **Griot AI Story Engine** | AI story, character, world, canon creation | Purple `#7C3AED` | Live |
| 2 | **DIY University** | Education platform — courses, AI professors, certs | Blue `#2563EB` | Live |
| 3 | **EOF Digital Library** | Knowledge preservation — books, archives, research | Gold `#D4AF37` | Live |
| 4 | **Film Studio** | Video production — NLE editor, storyboard, AI director | Red `#EF4444` | Live |
| 5 | **Music Studio** | Music production — DAW, mixing, mastering, releases | Orange `#F97316` | Live |
| 6 | **FHHL** | Fantasy Hip-Hop League — draft, battles, stats | Green `#10B981` | Live |
| 7 | **Legacy Vault** | Digital legacy — family archives, memory preservation | Indigo `#818CF8` | Live |
| 8 | **Orion Media Network** | News, radio, streaming, marketing, PR | Indigo `#6366F1` | Coming Soon |
| 9 | **Akashic Records** | Genealogy / African diaspora research | Teal `#0D9488` | Live |
| 10 | **Growth Intelligence Suite** | AI-powered SEO, marketing, advertising for clients | Teal/Emerald | In Dev |
| 11 | **EOF Security Command** | Threat detection, compliance, access management | Red `#EF4444` | Planned |
| 12 | **Orion Talent Agency** | Creator marketplace — profiles, bookings, contracts | Pink `#EC4899` | Coming Soon |
| 13 | **The B List** | Artist development and curation | — | In Dev |
| 14 | **BAC** | Business Advisory Center | Green `#10B981` | In Dev |

---

## EOF CENTRAL — THE CONDUCTOR

**The master OS control plane. Everything connects here.**

EOF Central (`/central`) is the AI operating system layer for the entire EOF ecosystem. It does NOT contain detailed operational data from individual apps. It contains:

- **Division Status Dashboard** — health of all 15 divisions
- **Agent Registry** — master list of all agents across all apps
- **Pending Approvals** — cross-app workflow approvals
- **Active Projects** — projects spanning multiple apps
- **Global Activity Feed** — real-time events from all divisions
- **Universal Search** — search across the entire ecosystem
- **Authentication** — membership and access management
- **Navigation** — launch pad to all apps

**Head Agent:** The Conductor  
**Data file:** `src/data/agentData.js` (AGENT_SYSTEMS, SYSTEM_META, SYSTEM_HEALTH exports)

---

## AGENT ARCHITECTURE

### Agent Evolution Framework (5 Levels)

| Level | Name | Capability |
|-------|------|------------|
| 1 | Task Execution | Performs assigned tasks |
| 2 | Research | Searches, updates knowledge, learns industry changes |
| 3 | Metacognition | Evaluates own work, identifies weaknesses |
| 4 | Specialist Creation | Spawns sub-agents for specific projects |
| 5 | Department Operations | Coordinates teams, manages workflows |

### Knowledge Score Thresholds
- Beginner: 0 XP → Skilled: 100 → Expert: 300 → Master: 700 → Elite: 1,500 → Legendary: 3,000

### Division Head Agents

| Division | Head Agent | Nickname |
|----------|-----------|---------|
| EOF Central | The Conductor | Conductor |
| Griot AI | Griot Central | Griot |
| EOF Library | The Archivist | Archivist |
| FHHL | Commissioner AI | Commissioner |
| DIY University | Chancellor AI | Chancellor |
| BAC | Business Coach | Coach |
| Legacy Vault | The Keeper | Keeper |
| Akashic Records | The Archivist | Archivist |
| EOF Radio | Programming Director | Director |
| Film Studio | Director Prime | Director |
| Music Studio | The Architect | Architect |
| Streaming | Channel Manager | Manager |
| Security | Sentinel Prime | Sentinel |
| Orion Media | Orion News Director | Orion |
| Orion Talent | Talent Director | Talent |

---

## BRANDING — COLOR CANON

| Color Name | Hex | Assigned To |
|------------|-----|-------------|
| Gold | `#D4AF37` | EOF Central, EOF Library |
| Purple | `#7C3AED` | Griot AI |
| Blue | `#2563EB` | DIY University |
| Red | `#EF4444` | Film Studio, Security |
| Orange | `#F97316` | Music Studio |
| Green | `#10B981` | FHHL, BAC |
| Indigo | `#6366F1` | Streaming, Legacy Vault (nav), Orion Media |
| Indigo-light | `#818CF8` | Legacy Vault (primary) |
| Cyan | `#0891B2` | EOF Radio |
| Cyan-bright | `#22D3EE` | Radio Widget |
| Teal | `#0D9488` | Akashic Records |
| Pink | `#EC4899` | Orion Talent, Image Studio |
| Emerald | `#10B981` + Neon | EOF Production Hub (master control) |

### Universal Design Language
- Style: Modern SaaS — Notion + Airtable + Discord + Adobe + Netflix + ESPN
- Every button functions. Every card is clickable. Dead links → "Coming Soon" pages.
- Universal intro: Black → particles → "Powered by Expression of Freedom" → app identity

---

## MEMBERSHIP STRUCTURE

| Tier | Access |
|------|--------|
| Public | Content, Library browse, course previews |
| Member | Full Library, courses, community |
| Creator | All apps, project management, agent assistance |
| Pro | Advanced AI agents, unlimited projects, analytics |
| Enterprise | White-label, custom agents, API access |

Public functions and admin functions are always completely separated.

---

## NAVIGATION STRUCTURE

### Primary Navigation (EOF Central)
```
EOF Central (/)
├── All Divisions (grid/list view)
├── Agent Registry
├── Active Projects
├── Pending Approvals
├── Activity Feed
└── System Health
```

### Cross-App Top Nav
Every app shows: Logo · Search · Notifications · User Profile · Agent Hub · Settings

### App Sidebar Navigation (per app)
Each app has its own left sidebar scoped to that app's features only.

### Studios Dropdown (Griot AI Story Engine)
Links to: Film Studio · Music Studio · DIY University · EOF Library · Image Studio

---

## INTEGRATION RULES

### Cross-App Linking
When an app lives on a different server, use full URL (not React Router Link):
- Same server: React Router `<Link to="/path">`
- Different server: `<a href="http://host:port/path" target="_blank">`

### appUrl Pattern
Systems on separate servers declare `appUrl` in SYSTEM_META. Components check for `appUrl` → render external anchor tag.

Currently cross-server: `griot` → `http://localhost:3000`

### Data Contracts Between Apps
EOF Central receives only: `{ id, name, status, agentCount, taskCount, uptime }` per division.  
Each app owns its own full data. Central stores only summaries.

---

## BUSINESS MODEL

### Revenue Categories

| Category | Apps | Revenue Model |
|----------|------|---------------|
| Creative Tools | Griot AI, Film Studio, Music Studio | Subscriptions |
| Knowledge Products | DIY University, EOF Library, Legacy Vault | Memberships, Courses, Certs |
| Business Services | Growth Suite, SEO, Marketing, Advertising | Monthly retainers, Enterprise licenses |

### The Creator Journey (Linear Progression)
1. Learn → DIY University
2. Research → EOF Library
3. Create stories → Griot AI
4. Produce content → Film Studio
5. Produce music → Music Studio
6. Publish → Orion Media Network
7. Find talent → Orion Talent Agency
8. Preserve work → Legacy Vault
9. Build a fanbase → FHHL
10. Grow a business → Growth Intelligence Suite

---

## TECH STACK

| Server | Framework | Port | Codebase |
|--------|-----------|------|----------|
| EOF Digital Library (monolith) | React + Vite | 5174 | `C:\Users\dhous\eof-digital-library\frontend` |
| Griot AI Story Engine | Next.js App Router | 3000 | `C:\Users\dhous\GriotAI\story-engine` |

**Target state:** Each major division → own repo, own port, own Claude project.

---

## DESKTOP WIDGETS

Standalone HTML files (no React). Open in Edge `--app` mode at 420×680px.  
Location: `C:\Users\dhous\Desktop\<Widget Name>\index.html`

12 widgets exist: Library, Griot AI, Operations, Film Studio, University, Music Studio, Streaming, Radio, Akashic, EOF Central, Legacy Vault, FHHL.

## DESKTOP SHORTCUTS

OneDrive Desktop shortcuts open full apps in Edge `--app` at 1440×900.  
Pattern: `msedge --app="http://localhost:PORT/route" --window-size=1440,900`

---

*This document is the only globally shared reference. Do not load individual app documentation alongside this file. Each app maintains its own repository, documentation, Claude project, and memory summaries.*

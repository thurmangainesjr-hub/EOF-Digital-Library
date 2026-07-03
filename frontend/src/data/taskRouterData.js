/**
 * EOF Task Router — Intent detection + agent routing + demo responses
 * Maps natural language requests to the correct division/agent/app
 */

export const TASK_ROUTES = [
  {
    id: 'story',
    keywords: ['write a story', 'story', 'narrative', 'plot', 'fiction', 'chapter', 'scene', 'screenplay', 'script'],
    division: 'Griot AI',
    agent: 'Story Architect',
    avatar: '✨',
    color: '#7C3AED',
    app: '/griot/story-architect',
    appLabel: 'Story Architect',
    tags: ['Creative', 'Writing', 'AI'],
    demoResponse: (input) => `**Story Architect** is analyzing your request...\n\n📖 **Concept Development**\nGenre: Literary Fiction / African Diaspora\nTheme: Identity, legacy, and cultural memory\nNarrative arc: Three-act structure with ensemble cast\n\n🧠 **AI Suggestions**\n• Opening scene: Protagonist discovers old family letters in an attic\n• Inciting incident: A secret from the past threatens the present\n• Character ensemble: 4 main voices across 2 generations\n\n✅ **Story seed created.** Open Story Architect to continue building your narrative.`,
  },
  {
    id: 'character',
    keywords: ['character', 'build a character', 'create a character', 'character design', 'persona', 'protagonist', 'antagonist'],
    division: 'Griot AI',
    agent: 'Canon Keeper',
    avatar: '🔒',
    color: '#7C3AED',
    app: '/griot/canon-keeper',
    appLabel: 'Canon Keeper',
    tags: ['Creative', 'World-Building'],
    demoResponse: () => `**Canon Keeper** initializing character engine...\n\n👤 **Character Draft**\nName: Imani Delacroix\nAge: 34 | Role: Protagonist\nBackground: Documentary filmmaker from New Orleans\nMotivation: Uncover her grandmother's untold story\n\n🔒 **Canon Entry Created**\nAll details locked in the Vault — consistent across every story chapter.\n\n✅ Character successfully added to your universe's canon.`,
  },
  {
    id: 'course',
    keywords: ['create a course', 'lesson', 'teach', 'curriculum', 'class', 'training', 'learn', 'education', 'professor'],
    division: 'DIY University',
    agent: 'Chancellor AI',
    avatar: '🎓',
    color: '#6366F1',
    app: '/university',
    appLabel: 'DIY University',
    tags: ['Education', 'Learning'],
    demoResponse: (input) => `**Chancellor AI** building your course outline...\n\n🎓 **Course: ${input || 'Custom Learning Path'}**\nEstimated Duration: 6 weeks | Level: Intermediate\nFormat: Video + Text + Interactive exercises\n\n📚 **Module Breakdown**\n• Module 1: Foundations & Core Concepts (Week 1–2)\n• Module 2: Applied Practice + Case Studies (Week 3–4)\n• Module 3: Advanced Techniques + Final Project (Week 5–6)\n\n👨‍🏫 **Assigned Professors:** 3 AI agents ready\n\n✅ Course framework created. Open DIY University to add lessons.`,
  },
  {
    id: 'music',
    keywords: ['record a track', 'music', 'song', 'beat', 'melody', 'lyrics', 'album', 'audio', 'mix', 'produce'],
    division: 'Music Studio',
    agent: 'Studio Director',
    avatar: '🎵',
    color: '#8B5CF6',
    app: '/music-studio/hub',
    appLabel: 'Music Studio',
    tags: ['Music', 'Audio', 'Production'],
    demoResponse: (input) => `**Studio Director** loading session...\n\n🎵 **Track Structure Generated**\nTitle: "${input || 'Untitled Track'}"\nGenre: Neo-Soul / Hip-Hop\nTempo: 87 BPM | Key: C Minor\n\n🎚️ **Session Plan**\n• Verse 1 (0:00–0:45): Establishing hook\n• Chorus (0:45–1:15): Anthemic build\n• Verse 2 (1:15–2:00): Story progression\n• Bridge (2:00–2:20): Emotional peak\n• Outro (2:20–2:45): Resolution\n\n🎛️ Instruments assigned: Drums, Bass, Piano, Strings, Vocals\n\n✅ Session template ready. Open Music Studio to start recording.`,
  },
  {
    id: 'video',
    keywords: ['edit a video', 'film', 'video', 'movie', 'shoot', 'scene', 'cut', 'documentary', 'cinematic', 'director'],
    division: 'Film Studio',
    agent: 'Production Director',
    avatar: '🎬',
    color: '#EF4444',
    app: '/film-studio/hub',
    appLabel: 'Film Studio',
    tags: ['Film', 'Video', 'Production'],
    demoResponse: (input) => `**Production Director** setting up the shot list...\n\n🎬 **Project: "${input || 'New Film Project'}"**\nFormat: Short Film | Runtime: ~12 min\nAspect Ratio: 2.39:1 (Cinematic) | Frame Rate: 24fps\n\n📋 **Scene Breakdown**\n• Scene 1: Establishing exterior — golden hour\n• Scene 2: Interior dialogue — 3-camera setup\n• Scene 3: Action sequence — hand-held coverage\n• Scene 4: Climax — wide master + closeups\n\n🎞️ Color grade: Warm teal/orange contrast suggested\n\n✅ Shot list generated. Open Film Studio to begin editing.`,
  },
  {
    id: 'marketing',
    keywords: ['marketing', 'campaign', 'launch a campaign', 'seo', 'advertising', 'social media', 'brand', 'content plan', 'growth', 'leads'],
    division: 'Growth Intelligence',
    agent: 'Marketing Director',
    avatar: '📣',
    color: '#10B981',
    app: '/dev-team/growth/marketing',
    appLabel: 'Growth Intelligence',
    tags: ['Marketing', 'Growth', 'Strategy'],
    demoResponse: (input) => `**Marketing Director** analyzing target audience...\n\n📣 **Campaign Framework**\nObjective: Awareness + Conversion\nBudget Tier: Mid-range | Timeline: 30 days\n\n📊 **Channel Strategy**\n• SEO: 12 target keywords identified (avg rank potential: #3–7)\n• Meta Ads: 3 audience segments | $800/day recommended budget\n• Content: 2 blog posts/week + daily social schedule\n• Email: 4-email drip sequence for new leads\n\n📈 **Projected Outcomes** (30 days)\n→ Organic reach: +2,400 visitors\n→ Paid reach: ~18,000 impressions\n→ Lead gen: 85–120 qualified leads\n\n✅ Campaign brief ready. Route to Growth Intelligence to launch.`,
  },
  {
    id: 'software',
    keywords: ['build software', 'build an app', 'code', 'app', 'website', 'saas', 'platform', 'development', 'feature', 'deploy'],
    division: 'Dev Team Elite',
    agent: 'General Vance',
    avatar: '👑',
    color: '#06B6D4',
    app: '/dev-team/dev',
    appLabel: 'Dev Studios',
    tags: ['Development', 'Engineering', 'AI'],
    demoResponse: (input) => `**General Vance** routing to Engineering Command...\n\n⚙️ **Project Brief: "${input || 'New Software Build'}"**\nType: SaaS Platform | Stack: React + Node + Postgres\nTimeline Estimate: 6–8 weeks | Team: 4 agents assigned\n\n📋 **Dev Roadmap**\n• Sprint 1: Architecture + DB schema + Auth (Week 1–2)\n• Sprint 2: Core features + API layer (Week 3–4)\n• Sprint 3: UI polish + integrations (Week 5–6)\n• Sprint 4: QA + security audit + deploy (Week 7–8)\n\n🤖 **Agents Assigned**\n→ Colonel Blueprint (Architecture)\n→ Commander Volt (Full Stack)\n→ QA Director (Testing)\n→ DevOps Major (Cloud Deploy)\n\n✅ Build request logged. Open Dev Studios to manage the project.`,
  },
  {
    id: 'security',
    keywords: ['security', 'scan', 'audit', 'vulnerability', 'threat', 'protect', 'firewall', 'penetration', 'hack'],
    division: 'Dev Team Elite',
    agent: 'Sentinel Prime',
    avatar: '🛡️',
    color: '#EF4444',
    app: '/dev-team/dev/security',
    appLabel: 'Security Command',
    tags: ['Security', 'Audit', 'Defense'],
    demoResponse: () => `**Sentinel Prime** running security sweep...\n\n🛡️ **System Security Report**\nScan initiated: All surfaces\nThreats detected: 0 critical | 2 warnings\n\n⚠️ **Warnings**\n• Rate limiting: Recommend stricter API throttle (GET /api/search)\n• Token expiry: Session tokens should be < 24h for admin routes\n\n✅ **Passed Checks (14/16)**\n→ SQL injection protection: Active\n→ XSS headers: Configured\n→ CORS policy: Strict\n→ Password hashing: bcrypt-14 rounds\n→ HTTPS enforcement: Enabled\n→ Input validation: All endpoints covered\n\n✅ Security audit complete. 2 action items queued.`,
  },
  {
    id: 'library',
    keywords: ['analyze my library', 'book', 'read', 'knowledge', 'research', 'summarize', 'report', 'document', 'notes'],
    division: 'EOF Library',
    agent: 'Knowledge Manager',
    avatar: '📚',
    color: '#D4AF37',
    app: '/library',
    appLabel: 'EOF Library',
    tags: ['Research', 'Knowledge', 'Curation'],
    demoResponse: (input) => `**Knowledge Manager** scanning the collection...\n\n📚 **Library Analysis**\nCollection size: 2,412 titles\nActive reading: 8 titles in progress\nLast added: 3 titles this week\n\n🔍 **Topic Cluster: "${input || 'Your Query'}"**\n→ 34 relevant titles found\n→ Top match: "The Warmth of Other Suns" (Isabel Wilkerson)\n→ Related collections: African Diaspora, Migration, History\n\n📝 **AI Summary Ready**\nKey themes across matched titles:\n• Systemic resilience and generational persistence\n• Migration as both loss and liberation\n• Cultural identity across time and geography\n\n✅ Knowledge report generated. Open the Library to explore results.`,
  },
  {
    id: 'business',
    keywords: ['business plan', 'business', 'startup', 'revenue', 'strategy', 'pitch', 'entrepreneur', 'company', 'plan'],
    division: 'BAC',
    agent: 'Strategy Director',
    avatar: '⭐',
    color: '#FBBF24',
    app: '/bac',
    appLabel: 'BAC',
    tags: ['Business', 'Strategy', 'Revenue'],
    demoResponse: (input) => `**Strategy Director** building your business framework...\n\n⭐ **Business Plan Draft**\nVenture: "${input || 'New Venture'}"\nModel: B2B SaaS | Stage: Pre-seed\nTarget Market: Creative professionals\n\n📊 **Financial Projections (Yr 1)**\n• Revenue target: $240K ARR\n• Customer acquisition: 80 clients @ $250/mo avg\n• Break-even: Month 8\n• Burn rate: $18K/month\n\n🔑 **Strategic Pillars**\n1. Product-led growth via free tier conversion\n2. Community-driven word-of-mouth\n3. Partnership with creator platforms\n\n✅ Business framework ready. Open BAC to refine your plan.`,
  },
  {
    id: 'fhhl',
    keywords: ['player card', 'fantasy', 'fhhl', 'hip-hop', 'league', 'draft', 'player', 'team', 'trade', 'stats'],
    division: 'FHHL',
    agent: 'Commissioner AI',
    avatar: '🏆',
    color: '#F59E0B',
    app: '/fhhl',
    appLabel: 'FHHL',
    tags: ['Fantasy', 'Hip-Hop', 'Gaming'],
    demoResponse: () => `**Commissioner AI** accessing the league database...\n\n🏆 **Fantasy Hip-Hop League Update**\nSeason: 2026 | Week 3 | 8 teams active\n\n📋 **Player Card Generated**\nPlayer: Kendrick Lamar\nPosition: Battle MC | Tier: Legendary (S+)\nStats: Lyricism 99 | Delivery 98 | Catalog 97 | Influence 100\nRecent: "GNX" album boosted Influence +8 points\n\n🏅 **League Standings (Top 3)**\n1. Vinyl Kingz — 142 pts\n2. Lyrical Warlords — 138 pts\n3. Golden Era FC — 131 pts\n\n✅ Player card locked. Open FHHL to manage your roster.`,
  },
  {
    id: 'workflow',
    keywords: ['workflow', 'automate', 'automation', 'pipeline', 'process', 'build a workflow', 'schedule', 'trigger'],
    division: 'Dev Team Elite',
    agent: 'General Kaine',
    avatar: '📋',
    color: '#10B981',
    app: '/dev-team/dev/factories',
    appLabel: 'Dev Factories',
    tags: ['Automation', 'Operations', 'AI'],
    demoResponse: (input) => `**General Kaine** designing your workflow...\n\n📋 **Automation Workflow: "${input || 'New Workflow'}"**\nType: Event-driven pipeline | Trigger: API webhook\n\n⚙️ **Steps**\n1. [Trigger] Incoming request received\n2. [Validate] Schema check + auth verification\n3. [Route] Intent detection → assign to correct agent\n4. [Execute] Agent processes task (avg: 2.3s)\n5. [Store] Result logged to knowledge vault\n6. [Notify] User notified via dashboard + email\n\n📊 **Performance Targets**\n→ Throughput: 1,000 tasks/hour\n→ SLA: 99.9% uptime\n→ Error retry: 3x with exponential backoff\n\n✅ Workflow blueprint created. Open Dev Factories to build.`,
  },
];

export function detectRoute(input) {
  if (!input || input.trim().length < 2) return null;
  const q = input.toLowerCase().trim();

  let best = null;
  let bestScore = 0;

  for (const route of TASK_ROUTES) {
    for (const kw of route.keywords) {
      if (q.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          best = route;
        }
      }
    }
  }

  // Fallback — general assistant
  if (!best) {
    return {
      id: 'general',
      division: 'EOF Central',
      agent: 'EOF Central AI',
      avatar: '⚡',
      color: '#D4AF37',
      app: '/central',
      appLabel: 'EOF Central',
      tags: ['General', 'Assistant'],
      demoResponse: (inp) => `**EOF Central** routing your request...\n\nI analyzed: "${inp}"\n\nNo specific division detected, so I'm handling this directly.\n\n🧠 **Analysis**\nYour request touches on multiple EOF systems. Here are the most relevant options:\n\n→ **Griot AI** — creative writing & storytelling\n→ **DIY University** — learning & course creation\n→ **Growth Intelligence** — marketing & strategy\n→ **Dev Team Elite** — software & automation\n→ **EOF Library** — research & knowledge\n\n💡 **Tip:** Try phrasing like "write a story", "create a course", or "build software" for precise routing.\n\n✅ Type a more specific task or click any system above.`,
    };
  }

  return best;
}

export const QUICK_TASKS = [
  { label: 'Write a story',         icon: '✨', query: 'Write a story about legacy and family' },
  { label: 'Create a course',       icon: '🎓', query: 'Create a course on music production' },
  { label: 'Build software',        icon: '⚙️', query: 'Build a client portal web app' },
  { label: 'Launch a campaign',     icon: '📣', query: 'Launch a marketing campaign for my brand' },
  { label: 'Record a track',        icon: '🎵', query: 'Record a track — neo-soul vibes' },
  { label: 'Edit a video',          icon: '🎬', query: 'Edit a short documentary video' },
  { label: 'Generate player card',  icon: '🏆', query: 'Generate a fantasy hip-hop player card' },
  { label: 'Run security audit',    icon: '🛡️', query: 'Run a security audit on my system' },
  { label: 'Analyze my library',    icon: '📚', query: 'Analyze my library on African diaspora' },
  { label: 'Build a workflow',      icon: '🔁', query: 'Build an automation workflow for content publishing' },
  { label: 'Business plan',         icon: '⭐', query: 'Write a business plan for my creative agency' },
  { label: 'Build a character',     icon: '🔒', query: 'Build a character for my fiction universe' },
];

export const TASK_HISTORY_KEY = 'eof_task_history';

export function logTask(task) {
  try {
    const raw = localStorage.getItem(TASK_HISTORY_KEY);
    const hist = raw ? JSON.parse(raw) : [];
    hist.unshift({ ...task, ts: Date.now() });
    localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(hist.slice(0, 50)));
  } catch (_) {}
}

export function getTaskHistory() {
  try {
    const raw = localStorage.getItem(TASK_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

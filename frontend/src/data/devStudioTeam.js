/**
 * EOF Dev Team Elite (DTE) — AI Agent Roster
 * Military branch-themed names · Same roles, new identities.
 * Branches: Army · Navy · Marine Corps · Air Force · Space Force · Coast Guard
 *
 * Shared by DevStudioTeamPage, DevStudioDept, and DevTeamHub.
 */
export const DEPARTMENTS = [
  {
    id: 'executive', label: 'Executive Suite',      icon: '🏛️', color: '#F0C040',
    tagline: 'Vision · Strategy · Operations',
    description: 'AI leadership team overseeing every division, project pipeline, and business decision.',
    path: '/dev-studio/executive',
    agents: [
      { name: 'General Vance',    icon: '👑', focus: 'Vision & Strategy',    task: 'Reviewing Q4 product roadmap',            status: 'active', branch: 'Army'        },
      { name: 'Admiral Nexus',    icon: '⚙️', focus: 'Architecture & Stack', task: 'Evaluating AI infrastructure upgrade',    status: 'active', branch: 'Navy'        },
      { name: 'General Kaine',    icon: '📋', focus: 'Operations & Process', task: 'Optimizing client delivery pipeline',     status: 'active', branch: 'Marine Corps' },
      { name: 'Admiral Banks',    icon: '💰', focus: 'Finance & Revenue',    task: 'Analyzing project profitability metrics', status: 'active', branch: 'Coast Guard'  },
    ],
  },
  {
    id: 'engineering', label: 'Engineering',         icon: '💻', color: '#06B6D4',
    tagline: 'Frontend · Backend · Mobile · Database',
    description: 'Full-spectrum engineering team building production-grade software across every platform.',
    path: '/dev-studio/engineering',
    agents: [
      { name: 'Colonel Blueprint', icon: '🏛️', focus: 'System Design',        task: 'Designing microservice architecture for SaaS client', status: 'active',   branch: 'Army'       },
      { name: 'Commander Volt',    icon: '⚡', focus: 'Frontend + Backend',    task: 'Building admin dashboard for e-commerce client',      status: 'building', branch: 'Navy'       },
      { name: 'Captain Vex',       icon: '🎨', focus: 'UI/UX Implementation', task: 'Creating reusable component library in React',         status: 'active',   branch: 'Air Force'  },
      { name: 'Major Forge',       icon: '⚙️', focus: 'APIs & Services',      task: 'Optimizing REST API response times',                  status: 'active',   branch: 'Army'       },
      { name: 'Lieutenant Vault',  icon: '🗄️', focus: 'Data Architecture',   task: 'Schema migration for client v2.0 launch',             status: 'idle',     branch: 'Space Force'},
      { name: 'Sergeant Swift',    icon: '📱', focus: 'iOS & Android',        task: 'React Native app — Phase 2 features',                 status: 'building', branch: 'Marine Corps'},
    ],
  },
  {
    id: 'ai-division', label: 'AI Division',         icon: '🤖', color: '#A78BFA',
    tagline: 'Agents · Prompts · Orchestration · Knowledge',
    description: 'Designs and deploys AI agent systems, prompt engineering workflows, and intelligent automation.',
    path: '/dev-studio/ai-division',
    agents: [
      { name: 'Colonel Neural',    icon: '🤖', focus: 'Model Integration',     task: 'Integrating Claude into client CRM system',    status: 'active',   branch: 'Space Force' },
      { name: 'Commander Ghost',   icon: '🧠', focus: 'Agent System Design',   task: 'Designing 12-agent orchestration workflow',    status: 'active',   branch: 'Navy'        },
      { name: 'Major Echo',        icon: '✍️', focus: 'Prompt Optimization',   task: 'Fine-tuning system prompts for accuracy',     status: 'active',   branch: 'Air Force'   },
      { name: 'Captain Phantom',   icon: '🎯', focus: 'Multi-Agent Systems',   task: 'Testing agent handoff and error recovery',    status: 'testing',  branch: 'Marine Corps'},
      { name: 'Lieutenant Archive',icon: '📚', focus: 'RAG & Knowledge Bases', task: 'Building vector DB for client knowledge hub', status: 'building', branch: 'Army'        },
    ],
  },
  {
    id: 'qa', label: 'Quality Assurance',            icon: '✅', color: '#34D399',
    tagline: 'Testing · Debug · Automation · UX',
    description: 'Ensures every build ships bug-free with automated test suites, manual review, and UX auditing.',
    path: '/dev-studio/qa',
    agents: [
      { name: 'Colonel Veritas',   icon: '✅', focus: 'QA Strategy & Process', task: 'Setting test coverage targets for 3 active projects', status: 'active',  branch: 'Army'      },
      { name: 'Commander Cypher',  icon: '🔄', focus: 'Test Automation',        task: 'Writing Playwright e2e tests for SaaS client',        status: 'active',  branch: 'Navy'      },
      { name: 'Captain Hawkeye',   icon: '🔍', focus: 'Bug Hunting',            task: 'Investigating performance regression on mobile app',   status: 'active',  branch: 'Air Force' },
      { name: 'Lieutenant Scout',  icon: '👤', focus: 'User Experience',        task: 'Running usability audit on client onboarding flow',   status: 'testing', branch: 'Marine Corps'},
    ],
  },
  {
    id: 'security', label: 'Security Division',      icon: '🛡️', color: '#F87171',
    tagline: 'Pentesting · Compliance · Identity · Threat Intel',
    description: 'Protects every client deliverable with proactive security audits, compliance checks, and identity management.',
    path: '/dev-studio/security',
    agents: [
      { name: 'General Shield',    icon: '🛡️', focus: 'Security Strategy',      task: 'Reviewing security posture for fintech client',  status: 'active',   branch: 'Army'       },
      { name: 'Colonel Specter',   icon: '🔓', focus: 'Ethical Hacking',         task: 'Running auth flow penetration test',             status: 'active',   branch: 'Navy'       },
      { name: 'Major Charter',     icon: '📜', focus: 'GDPR · SOC2 · HIPAA',    task: 'Preparing SOC2 documentation checklist',        status: 'active',   branch: 'Air Force'  },
      { name: 'Captain Keystone',  icon: '🔑', focus: 'Auth & Access Control',  task: 'Implementing OAuth2 + RBAC system',             status: 'building', branch: 'Marine Corps'},
    ],
  },
  {
    id: 'cloud', label: 'Cloud Operations',          icon: '☁️', color: '#60A5FA',
    tagline: 'DevOps · Deploy · Monitor · Disaster Recovery',
    description: 'Manages cloud infrastructure, CI/CD pipelines, uptime monitoring, and production reliability.',
    path: '/dev-studio/cloud',
    agents: [
      { name: 'Colonel Nimbus',   icon: '☁️', focus: 'CI/CD & Infrastructure', task: 'Setting up GitHub Actions pipeline for client',  status: 'active',    branch: 'Air Force'  },
      { name: 'Commander Launch', icon: '🚀', focus: 'Production Deployments', task: 'Zero-downtime deploy for client v2.1 launch',    status: 'deploying', branch: 'Navy'       },
      { name: 'Major Recon',      icon: '📡', focus: 'Observability & Alerts', task: 'Configuring Datadog dashboards for 4 projects', status: 'active',    branch: 'Army'       },
      { name: 'Captain Phoenix',  icon: '🔁', focus: 'Backup & Resilience',    task: 'Testing failover procedures for SaaS client',   status: 'testing',   branch: 'Space Force'},
    ],
  },
  {
    id: 'clients', label: 'Client Services',         icon: '🤝', color: '#FB923C',
    tagline: 'Analysis · PM · Success · Delivery',
    description: 'Bridges client needs with the dev team — scoping, managing, and delivering projects on time.',
    path: '/dev-studio/clients',
    agents: [
      { name: 'Colonel Intel',      icon: '📊', focus: 'Requirements & Scope',     task: 'Documenting specs for new church platform project', status: 'active', branch: 'Army'       },
      { name: 'Commander Waypoint', icon: '🗺️', focus: 'Roadmap & Prioritization', task: 'Updating sprint board for 3 active clients',       status: 'active', branch: 'Navy'       },
      { name: 'Major Anchor',       icon: '📅', focus: 'Timeline & Delivery',      task: 'Coordinating cross-team launch for e-commerce',    status: 'active', branch: 'Coast Guard' },
      { name: 'Captain Victory',    icon: '⭐', focus: 'Retention & Satisfaction', task: 'Preparing monthly delivery report for 8 clients',  status: 'active', branch: 'Marine Corps'},
    ],
  },
  {
    id: 'factories', label: 'Dev Factories',         icon: '⚡', color: '#FBBF24',
    tagline: 'SaaS · Website · AI · Mobile · Automation · Game',
    description: 'Specialized production lines for the 6 core product types — each factory has its own agent team and workflow.',
    path: '/dev-studio/factories',
    agents: [
      { name: 'Colonel Ironworks',   icon: '🏭', focus: 'SaaS Platform Builds',  task: 'Building multi-tenant SaaS dashboard for client', status: 'active',    branch: 'Army'       },
      { name: 'Commander Beacon',    icon: '🌐', focus: 'Web Presence & CMS',    task: 'Launching 3 church websites this sprint',          status: 'building',  branch: 'Navy'       },
      { name: 'Major Spectre',       icon: '🤖', focus: 'AI Product Builds',     task: 'Deploying custom chatbot for real estate client',  status: 'active',    branch: 'Space Force'},
      { name: 'Captain Striker',     icon: '📱', focus: 'iOS & Android Apps',    task: 'Publishing mobile app to App Store',               status: 'deploying', branch: 'Air Force'  },
      { name: 'Lieutenant Gearworks',icon: '⚙️', focus: 'Workflow Automation',   task: 'Building Zapier replacement for nonprofit client', status: 'active',    branch: 'Army'       },
      { name: 'Sergeant Vanguard',   icon: '🎮', focus: 'Game Development',      task: 'Prototyping educational game for schools client',  status: 'building',  branch: 'Marine Corps'},
    ],
  },
  {
    id: 'knowledge', label: 'Knowledge Center',      icon: '📚', color: '#818CF8',
    tagline: 'Docs · Standards · Templates · History',
    description: 'Maintains the institutional memory — architecture standards, reusable templates, and project documentation.',
    path: '/dev-studio/knowledge',
    agents: [
      { name: 'Major Chronicle',    icon: '📝', focus: 'Technical Writing',             task: 'Documenting API endpoints for 4 active projects', status: 'active',   branch: 'Army'      },
      { name: 'Commander Codex',    icon: '📐', focus: 'Code Standards & Best Practices',task: 'Updating component library guidelines',           status: 'active',   branch: 'Navy'      },
      { name: 'Captain Blueprint',  icon: '📋', focus: 'Reusable Starters',             task: 'Building Next.js SaaS starter template',          status: 'building', branch: 'Air Force' },
      { name: 'Lieutenant Scrolls', icon: '🗂️', focus: 'Past Project Archive',         task: 'Tagging and indexing completed project assets',   status: 'idle',     branch: 'Space Force'},
    ],
  },
  {
    id: 'rnd', label: 'Research & Innovation',       icon: '🔬', color: '#F472B6',
    tagline: 'AI Research · XR · Cybersecurity · Game Tech',
    description: 'Explores bleeding-edge technology — from AI model research to extended reality and next-gen game engines.',
    path: '/dev-studio/rnd',
    agents: [
      { name: 'Colonel Nexus',     icon: '🧪', focus: 'AI Model Research',           task: 'Benchmarking Claude 4 vs GPT-5 for coding tasks',    status: 'active',   branch: 'Space Force' },
      { name: 'Commander Phantom', icon: '🥽', focus: 'Extended Reality & Robotics', task: 'Prototyping AR overlay for field service app',        status: 'building', branch: 'Navy'        },
      { name: 'Major Ghost',       icon: '🔒', focus: 'Emerging Threat Research',    task: 'Researching AI-powered social engineering attacks',   status: 'active',   branch: 'Army'        },
      { name: 'Captain Surge',     icon: '🎮', focus: 'Game Engine Innovation',      task: 'Evaluating WebGPU for in-browser 3D experiences',    status: 'active',   branch: 'Air Force'   },
    ],
  },
];

export const STATUS_STYLE = {
  active:    { color: '#34D399', label: 'Active'    },
  building:  { color: '#60A5FA', label: 'Building'  },
  testing:   { color: '#FBBF24', label: 'Testing'   },
  deploying: { color: '#F97316', label: 'Deploying' },
  idle:      { color: '#6B7280', label: 'Idle'      },
};

export const BRANCH_COLOR = {
  'Army':        '#4B9E4B',
  'Navy':        '#1B3B8F',
  'Marine Corps':'#8B1A1A',
  'Air Force':   '#1A6DB5',
  'Space Force': '#1A1A3E',
  'Coast Guard': '#E8A020',
};

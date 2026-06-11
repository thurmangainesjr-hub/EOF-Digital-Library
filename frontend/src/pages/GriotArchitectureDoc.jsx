import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronDown, FiChevronRight, FiCheck, FiAlertTriangle,
  FiAlertCircle, FiCircle, FiArrowRight, FiGrid, FiLayers,
  FiUsers, FiShield, FiBook, FiMusic, FiFilm, FiGlobe,
  FiCpu, FiDatabase, FiSearch, FiFolder, FiPackage,
  FiStar, FiZap, FiFlag,
} from 'react-icons/fi';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEMS = [
  {
    id: 'griot-ai', emoji: '🌀', label: 'Griot AI', color: '#8B5CF6',
    purpose: 'Creative Operating System',
    path: '/griot',
    mainPages: ['Dashboard','Projects','Agent Center','Canon Keeper','Knowledge Hub','File Manager','Settings'],
    subSystems: [
      { name: 'Story Architect', pages: ['Story Dashboard','Characters','World Building','Lore','Timeline','Plot Builder','Scene Builder','Book Writer','Comic Writer','Script Writer','Canon Integration'] },
      { name: 'Canon Keeper',    pages: ['Characters','Locations','Organizations','Weapons','Technology','Magic Systems','Events','Lore','Version History','Diff Viewer'] },
      { name: 'Research Studio', pages: ['Research Dashboard','Knowledge Sources','Web Research','Book Research','Document Analysis','Agent Research','Citation Manager'] },
      { name: 'Film Studio',     pages: ['Film Dashboard','Project Manager','Shot Designer','Scene Builder','Storyboard','Casting','Production Schedule','Call Sheets','Budgeting','Editor','Trailer Builder','Distribution Planner'],
        openSource: ['Storyboarder','Blender','Kdenlive','OpenShot','FFmpeg'] },
      { name: 'Music Studio',    pages: ['Studio Dashboard','Recording Studio','Beat Lab','Lyrics Room','Mixing Room','Mastering Room','Rights & Splits','Release Planner','Marketing Kit','Distribution Hub'],
        openSource: ['Ardour','LMMS','Audacity','WaveSurfer','FFmpeg'] },
      { name: 'Visual Design Studio', pages: ['Art Dashboard','Character Design','Concept Art','Cover Creator','Comic Layout','Brand Kit','Thumbnail Studio'],
        openSource: ['Krita','GIMP','Inkscape','Blender'] },
      { name: 'Marketing Studio',    pages: [] },
      { name: 'Business Operations', pages: [] },
    ],
  },
  {
    id: 'eof-library', emoji: '📚', label: 'EOF Library', color: '#3B82F6',
    purpose: 'Knowledge Repository',
    path: '/library',
    mainPages: ['Books','Comics','Scripts','Music','Audio Library','Video Library','Research Library','Course Materials','Templates','Business Documents','Legal Documents','Marketing Assets','Historical Archives'],
    agentFunctions: ['Summarize','Search','Cross Reference','Recommend','Teach'],
    subSystems: [],
  },
  {
    id: 'eof-media', emoji: '📺', label: 'EOF Media Network', color: '#EF4444',
    purpose: 'Distribution Network',
    path: '/streaming',
    mainPages: ['Dashboard','Internet Radio','Streaming Network','Video On Demand','Podcast Network','Creator Portal','Advertising Portal','Analytics'],
    integrations: ['Live365 (Internet Radio)','TVStartup (Streaming Network)'],
    subSystems: [],
  },
  {
    id: 'fhhl', emoji: '🏆', label: 'EOF Fantasy Hip-Hop League', color: '#F59E0B',
    purpose: 'Fantasy Sports for Hip-Hop Culture',
    path: '/fhhl',
    mainPages: ['League Home','Standings','Teams','Artists','Artist Profiles','Draft Center','Battles','Season Schedule','Player Cards','Fan Voting','Statistics Center','League Media'],
    agentFunctions: ['League Operations Agent','Artist Review Agent','Draft Agent','Stats Agent','Voting Agent','Commissioner Agent'],
    subSystems: [],
  },
  {
    id: 'university', emoji: '🎓', label: 'DIY University', color: '#10B981',
    purpose: 'Education & Certification',
    path: '/university',
    mainPages: ['University Home','Schools','Courses','Professors','Certifications','Student Dashboard','Projects','Capstones'],
    subSystems: [
      { name: 'Schools', pages: ['Writing Academy','Film Academy','Music Academy','Design Academy','Technology Academy','Business Academy'] },
    ],
    agentFunctions: ['Chancellor AI','Professor Agents','Mentor Agents','Critique Agents'],
  },
  {
    id: 'bac', emoji: '💼', label: 'BAC System', color: '#0891B2',
    purpose: 'Financial Literacy & Community Empowerment',
    path: '/bac',
    mainPages: ['Financial Literacy','Credit Education','Entrepreneurship','Grant Writing','Homeownership','Business Incubator','Community Programs'],
    subSystems: [],
  },
  {
    id: 'legacy-vault', emoji: '🏛️', label: 'Legacy Vault', color: '#D4AF37',
    purpose: 'Family & Personal Archive',
    path: '/legacy-vault',
    mainPages: ['Vault Dashboard','Family Archive','Media Archive','Documents','Jarvis Companion','Release Planning'],
    subSystems: [],
  },
  {
    id: 'akashic', emoji: '🔮', label: 'Akashic Records', color: '#A78BFA',
    purpose: 'Generational History & Family Tree',
    path: '/akashic',
    mainPages: ['Family Tree','Generational Records','Historical Archives','Legacy Stories','Visual Archives'],
    subSystems: [],
  },
];

const UNIVERSAL_AGENTS = [
  { id:'research',      emoji:'🔍', name:'Research Agent',       desc:'Searches internal + external knowledge sources' },
  { id:'knowledge',     emoji:'📖', name:'Knowledge Agent',      desc:'Manages the central knowledge graph' },
  { id:'metacognition', emoji:'🧠', name:'Metacognition Agent',  desc:'Self-monitors AI reasoning quality' },
  { id:'critique',      emoji:'✏️',  name:'Critique Agent',       desc:'Reviews and improves all creative output' },
  { id:'collaboration', emoji:'🤝', name:'Collaboration Agent',  desc:'Coordinates cross-system agent teamwork' },
];

const MEMBERSHIP_TIERS = [
  { name:'Owner',           color:'#D4AF37', emoji:'👑', desc:'Full ecosystem. All systems integrated. Unlimited agents. System Admin.' },
  { name:'Enterprise',      color:'#8B5CF6', emoji:'🏢', desc:'White-label deployment. Custom branding. Private agents. Private knowledge base.' },
  { name:'Professional',    color:'#3B82F6', emoji:'⚡', desc:'Selected ecosystem bundle. Cross-system integrations. Expanded agent access.' },
  { name:'Individual',      color:'#10B981', emoji:'🌱', desc:'Access only purchased system. Limited integrations, storage, and agents.' },
];

const GAPS = [
  {
    category: 'Critical Infrastructure', color: '#EF4444', emoji: '🔴',
    items: [
      { label:'Unified Authentication (SSO)', severity:'critical' },
      { label:'Billing & Membership Engine',  severity:'critical' },
      { label:'Marketplace',                  severity:'high'     },
      { label:'Notifications System',         severity:'high'     },
      { label:'Messaging System',             severity:'high'     },
      { label:'Mobile App Framework',         severity:'medium'   },
    ],
  },
  {
    category: 'AI Infrastructure', color: '#F97316', emoji: '🟠',
    items: [
      { label:'Long-Term Memory Database',    severity:'critical' },
      { label:'Agent Training Pipeline',      severity:'high'     },
      { label:'Agent Research Refresh',       severity:'high'     },
      { label:'Agent Confidence Scoring',     severity:'medium'   },
      { label:'Agent Performance Analytics',  severity:'medium'   },
      { label:'Agent Governance Dashboard',   severity:'medium'   },
    ],
  },
  {
    category: 'Library Gaps', color: '#F59E0B', emoji: '🟡',
    items: [
      { label:'Metadata Standards',           severity:'high'   },
      { label:'Citation Engine',              severity:'medium' },
      { label:'Versioning System',            severity:'medium' },
      { label:'Archive Management',           severity:'medium' },
      { label:'Rights Management',            severity:'high'   },
    ],
  },
  {
    category: 'Music Studio', color: '#A78BFA', emoji: '🎵',
    items: [
      { label:'Real DAW Engine Integration',  severity:'critical' },
      { label:'Plugin Support',               severity:'high'     },
      { label:'MIDI Editing',                 severity:'high'     },
      { label:'Audio Effects Library',        severity:'medium'   },
      { label:'Collaboration Sessions',       severity:'medium'   },
      { label:'Stem Management',              severity:'medium'   },
    ],
  },
  {
    category: 'Film Studio', color: '#EF4444', emoji: '🎬',
    items: [
      { label:'Asset Management',             severity:'high'   },
      { label:'Rendering Queue',              severity:'high'   },
      { label:'Camera Database',              severity:'medium' },
      { label:'Scene Continuity Engine',      severity:'high'   },
      { label:'Production Tracking',          severity:'high'   },
    ],
  },
  {
    category: 'Fantasy Hip-Hop League', color: '#F59E0B', emoji: '🏆',
    items: [
      { label:'League Page (/league)',         severity:'critical' },
      { label:'Draft Hub (/draft)',            severity:'critical' },
      { label:'Social Media Fields Editor',   severity:'high'     },
      { label:'Artist Submission Portal',     severity:'high'     },
      { label:'Fan Voting Moderation',        severity:'medium'   },
      { label:'Commissioner Dashboard',       severity:'high'     },
    ],
  },
  {
    category: 'DIY University', color: '#10B981', emoji: '🎓',
    items: [
      { label:'Testing Engine',               severity:'high'   },
      { label:'Certification Issuance',       severity:'high'   },
      { label:'Student Analytics',            severity:'medium' },
      { label:'Assignment Grading',           severity:'high'   },
      { label:'Course Builder',               severity:'critical'},
    ],
  },
  {
    category: 'Security', color: '#6B7280', emoji: '🔒',
    items: [
      { label:'RBAC Permissions',             severity:'critical' },
      { label:'Audit Logging',                severity:'high'     },
      { label:'Backup System',                severity:'high'     },
      { label:'Disaster Recovery',            severity:'medium'   },
      { label:'Agent Safety Controls',        severity:'critical' },
      { label:'API Security Layer',           severity:'critical' },
    ],
  },
];

const BUILD_ORDER = [
  { n:1,  label:'Griot Central',            emoji:'🌐', status:'in-progress', color:'#F97316', desc:'Master orchestrator, memory, permissions, billing' },
  { n:2,  label:'Authentication & Memberships', emoji:'🔐', status:'planned', color:'#EF4444', desc:'SSO, subscription engine, tier enforcement' },
  { n:3,  label:'Universal Project System', emoji:'📁', status:'planned',     color:'#3B82F6', desc:'Files, tasks, notes, agents, timeline, analytics, publishing' },
  { n:4,  label:'Universal File System',    emoji:'🗄️', status:'planned',     color:'#3B82F6', desc:'Single asset repo auto-categorized across all systems' },
  { n:5,  label:'Canon Keeper',             emoji:'📜', status:'planned',     color:'#8B5CF6', desc:'Characters, lore, timeline, version history, diff viewer' },
  { n:6,  label:'EOF Library',              emoji:'📚', status:'in-progress', color:'#3B82F6', desc:'Books, media, research, legal, archives, agent functions' },
  { n:7,  label:'Agent Framework',          emoji:'🤖', status:'in-progress', color:'#8B5CF6', desc:'Universal agents, memory, knowledge graph, governance' },
  { n:8,  label:'Music Studio',             emoji:'🎵', status:'in-progress', color:'#D4AF37', desc:'Full DAW integration, beat lab, release planning' },
  { n:9,  label:'Film Studio',              emoji:'🎬', status:'in-progress', color:'#EF4444', desc:'NLE editor, storyboard, production tracking, distribution' },
  { n:10, label:'EOF Fantasy Hip-Hop League',emoji:'🏆',status:'planned',     color:'#F59E0B', desc:'Drafts, battles, stats, fan voting, commissioner tools' },
  { n:11, label:'DIY University',           emoji:'🎓', status:'in-progress', color:'#10B981', desc:'Schools, courses, professors, certifications, capstones' },
  { n:12, label:'EOF Media Network',        emoji:'📺', status:'in-progress', color:'#EF4444', desc:'Radio, streaming, VOD, podcasts, advertising' },
  { n:13, label:'BAC System',               emoji:'💼', status:'in-progress', color:'#0891B2', desc:'Financial literacy, grants, incubator, community programs' },
  { n:14, label:'Legacy Vault',             emoji:'🏛️', status:'in-progress', color:'#D4AF37', desc:'Family archive, media, documents, Jarvis companion' },
  { n:15, label:'Akashic Records',          emoji:'🔮', status:'in-progress', color:'#A78BFA', desc:'Family tree, generational records, historical archives' },
];

const STATUS_META = {
  'in-progress': { label:'In Progress', color:'#10B981', dot:'bg-green-500' },
  'planned':      { label:'Planned',     color:'#F59E0B', dot:'bg-amber-500' },
  'not-started':  { label:'Not Started', color:'#6B7280', dot:'bg-gray-600'  },
};

const SEVERITY_META = {
  critical: { label:'Critical', color:'#EF4444', bg:'rgba(239,68,68,0.1)' },
  high:     { label:'High',     color:'#F59E0B', bg:'rgba(245,158,11,0.1)' },
  medium:   { label:'Medium',   color:'#60A5FA', bg:'rgba(96,165,250,0.1)' },
};

const TOP_NAV    = ['Dashboard','Projects','Agents','Library','Messages','Marketplace','Publish','Settings'];
const LEFT_NAV   = ['Griot AI','EOF Media','EOF Fantasy Hip-Hop League','DIY University','BAC','Legacy Vault','Akashic Records','Community','Admin'];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ emoji, title, subtitle, color }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        {emoji}
      </div>
      <div>
        <h2 className="text-lg font-black text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Pill({ label, color }) {
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

function SystemCard({ sys, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [openSub, setOpenSub] = useState(null);

  return (
    <motion.div layout
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${sys.color}25` }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/3 transition-colors text-left">
        <span className="text-2xl leading-none">{sys.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-white">{sys.label}</span>
            <Pill label={sys.purpose} color={sys.color} />
          </div>
          {sys.path && (
            <p className="text-[10px] text-gray-700 mt-0.5 font-mono">{sys.path}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {sys.mainPages && (
            <span className="text-[9px] text-gray-600 hidden sm:block">{sys.mainPages.length} pages</span>
          )}
          <FiChevronDown size={14} className="text-gray-600 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t"
            style={{ borderColor: `${sys.color}15` }}>
            <div className="px-5 py-4 space-y-4">

              {/* Main pages */}
              {sys.mainPages?.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Main Pages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sys.mainPages.map(p => (
                      <span key={p} className="text-[10px] px-2 py-1 rounded-lg font-medium"
                        style={{ background: `${sys.color}10`, color: sys.color, border: `1px solid ${sys.color}20` }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent functions */}
              {sys.agentFunctions?.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Agent Functions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sys.agentFunctions.map(a => (
                      <span key={a} className="text-[10px] px-2 py-1 rounded-lg font-medium border border-white/8 text-gray-400">
                        🤖 {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrations */}
              {sys.integrations?.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Integrations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sys.integrations.map(i => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-lg font-medium border border-white/8 text-gray-400">
                        🔗 {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-systems */}
              {sys.subSystems?.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Sub-Systems ({sys.subSystems.length})</p>
                  <div className="space-y-1.5">
                    {sys.subSystems.map(sub => (
                      <div key={sub.name}
                        className="rounded-xl border overflow-hidden"
                        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                        <button
                          onClick={() => setOpenSub(s => s === sub.name ? null : sub.name)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/3 transition-colors">
                          <span className="text-xs font-bold" style={{ color: sys.color }}>{sub.name}</span>
                          <div className="flex items-center gap-2">
                            {sub.pages?.length > 0 && (
                              <span className="text-[9px] text-gray-700">{sub.pages.length} pages</span>
                            )}
                            {sub.openSource?.length > 0 && (
                              <span className="text-[9px] text-green-600 font-bold">{sub.openSource.length} OSS</span>
                            )}
                            <FiChevronDown size={11} className="text-gray-600 transition-transform"
                              style={{ transform: openSub === sub.name ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                          </div>
                        </button>
                        <AnimatePresence>
                          {openSub === sub.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden border-t"
                              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                              <div className="px-3 py-2 space-y-2">
                                {sub.pages?.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {sub.pages.map(p => (
                                      <span key={p} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                        style={{ background: `${sys.color}0d`, color: `${sys.color}cc` }}>
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {sub.openSource?.length > 0 && (
                                  <div>
                                    <p className="text-[8px] font-bold tracking-widest uppercase text-gray-700 mb-1">Open Source</p>
                                    <div className="flex flex-wrap gap-1">
                                      {sub.openSource.map(o => (
                                        <span key={o} className="text-[9px] px-1.5 py-0.5 rounded font-mono border border-green-900/40 text-green-600 bg-green-900/10">{o}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GapCategory({ cat, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const critical = cat.items.filter(i => i.severity === 'critical').length;

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${cat.color}20` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors text-left">
        <span className="text-lg leading-none">{cat.emoji}</span>
        <span className="text-sm font-bold text-white flex-1">{cat.category}</span>
        <div className="flex items-center gap-2">
          {critical > 0 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
              {critical} critical
            </span>
          )}
          <span className="text-[9px] text-gray-600">{cat.items.length} items</span>
          <FiChevronDown size={13} className="text-gray-600 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="px-5 py-3 space-y-1.5">
              {cat.items.map((item, i) => {
                const sev = SEVERITY_META[item.severity];
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b last:border-0"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <FiCircle size={7} style={{ color: sev.color, fill: sev.color, flexShrink: 0 }} />
                    <span className="text-xs text-gray-300 flex-1">{item.label}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: sev.bg, color: sev.color }}>
                      {sev.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id:'overview',    label:'Overview' },
  { id:'navigation',  label:'Navigation' },
  { id:'systems',     label:'Systems' },
  { id:'agents',      label:'Agents' },
  { id:'membership',  label:'Membership' },
  { id:'universal',   label:'Universal' },
  { id:'gaps',        label:'Gap Report' },
  { id:'build-order', label:'Build Order' },
];

export default function GriotArchitectureDoc() {
  const [activeSection, setActiveSection] = useState('overview');

  const totalGaps = GAPS.reduce((s, g) => s + g.items.length, 0);
  const criticalGaps = GAPS.reduce((s, g) => s + g.items.filter(i => i.severity === 'critical').length, 0);
  const inProgress = BUILD_ORDER.filter(b => b.status === 'in-progress').length;

  function scrollTo(id) {
    setActiveSection(id);
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-12 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(10,10,10,0) 60%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 10% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              🌐
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                  Master Architecture
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                  v1.0
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Griot Ecosystem<br />
                <span style={{ color: '#8B5CF6' }}>Master Architecture</span>
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Owner: <span className="text-white font-semibold">Thurman Gaines Jr</span>
                {' '}· One ecosystem. Every system connected. All routes through Griot Central.
              </p>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label:'Total Systems',  value:SYSTEMS.length,        color:'#8B5CF6', emoji:'📦' },
              { label:'Build Phases',   value:BUILD_ORDER.length,    color:'#3B82F6', emoji:'🏗️' },
              { label:'In Progress',    value:inProgress,            color:'#10B981', emoji:'⚡' },
              { label:'Gap Items',      value:`${totalGaps} (${criticalGaps} critical)`, color:'#EF4444', emoji:'🔴' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">{s.emoji} {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky section nav ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b px-6 overflow-x-auto"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-0 min-w-max py-0">
          {NAV_SECTIONS.map(s => (
            <button key={s.id}
              onClick={() => scrollTo(s.id)}
              className="px-4 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap"
              style={activeSection === s.id
                ? { color: '#8B5CF6', borderBottomColor: '#8B5CF6' }
                : { color: '#6B7280', borderBottomColor: 'transparent' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16 pt-10">

        {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
        <section id="sec-overview">
          <SectionHeader emoji="🌐" title="Core Principle" color="#8B5CF6"
            subtitle="The foundational laws of this ecosystem" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon:'🌐', title:'One Ecosystem',          desc:'There is only ONE ecosystem. Every application is a module inside it — not a separate platform.' },
              { icon:'🔀', title:'Everything Through Central', desc:'Every system reports to Griot Central. All routing, permissions, memory, and billing flow through the core.' },
              { icon:'🔑', title:'Owner Has Full Access',   desc:'Only the ecosystem owner (Thurman Gaines Jr) has unrestricted access to all systems and cross-system integrations.' },
              { icon:'🛒', title:'Subscription Access',     desc:'Members gain access based on subscription tier. Systems are available individually or in bundles.' },
            ].map(c => (
              <div key={c.title} className="rounded-2xl border p-5"
                style={{ background: 'rgba(139,92,246,0.04)', borderColor: 'rgba(139,92,246,0.2)' }}>
                <span className="text-2xl mb-3 block">{c.icon}</span>
                <p className="text-sm font-bold text-white mb-1">{c.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Griot Central box */}
          <div className="mt-6 rounded-2xl border p-6"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(10,10,10,0))', borderColor: 'rgba(139,92,246,0.3)' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌐</span>
              <div>
                <p className="text-base font-black text-white">Griot Central</p>
                <p className="text-xs text-gray-500">Master AI Orchestrator — Everything connects here</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Agent Management','Permissions','Membership Management','Billing','Project Routing','Memory Management','Canon Management','Knowledge Graph','Cross-System Communication','Analytics','Security'].map(r => (
                <div key={r} className="flex items-center gap-1.5">
                  <FiCheck size={10} className="text-purple-400 flex-shrink-0" />
                  <span className="text-[10px] text-gray-400">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NAVIGATION ────────────────────────────────────────────────── */}
        <section id="sec-navigation">
          <SectionHeader emoji="🗺️" title="Master Navigation" color="#3B82F6"
            subtitle="Global nav structure applied across the entire ecosystem" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5"
              style={{ background: 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.2)' }}>
              <p className="text-[9px] font-bold tracking-widest uppercase text-blue-500 mb-3">Top Navigation</p>
              <div className="flex flex-wrap gap-2">
                {TOP_NAV.map(n => (
                  <span key={n} className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(59,130,246,0.12)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border p-5"
              style={{ background: 'rgba(139,92,246,0.04)', borderColor: 'rgba(139,92,246,0.2)' }}>
              <p className="text-[9px] font-bold tracking-widest uppercase text-purple-500 mb-3">Left Navigation (Systems)</p>
              <div className="space-y-1">
                {LEFT_NAV.map((n, i) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-gray-700 w-4">{i+1}</span>
                    <span className="text-xs text-gray-300 font-medium">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SYSTEMS ───────────────────────────────────────────────────── */}
        <section id="sec-systems">
          <SectionHeader emoji="📦" title="All Systems" color="#F97316"
            subtitle={`${SYSTEMS.length} systems — all modules inside the Griot Ecosystem`} />
          <div className="space-y-3">
            {SYSTEMS.map((sys, i) => (
              <motion.div key={sys.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <SystemCard sys={sys} defaultOpen={sys.id === 'griot-ai'} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── AGENTS ────────────────────────────────────────────────────── */}
        <section id="sec-agents">
          <SectionHeader emoji="🤖" title="Agent System" color="#8B5CF6"
            subtitle="Universal agents deployed to every system — no duplicates, one memory" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            {UNIVERSAL_AGENTS.map(ag => (
              <div key={ag.id} className="rounded-xl border p-4"
                style={{ background: 'rgba(139,92,246,0.04)', borderColor: 'rgba(139,92,246,0.18)' }}>
                <span className="text-xl mb-2 block">{ag.emoji}</span>
                <p className="text-xs font-bold text-white mb-1">{ag.name}</p>
                <p className="text-[10px] text-gray-500 leading-snug">{ag.desc}</p>
              </div>
            ))}
            <div className="rounded-xl border p-4 flex flex-col justify-center items-center text-center"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed' }}>
              <FiZap size={16} className="text-gray-700 mb-2" />
              <p className="text-[10px] text-gray-600 leading-snug">Specialized agents<br />spawn automatically<br />per system</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label:'One Central Memory System',    desc:'All agents share a single long-term memory database', emoji:'🧠' },
              { label:'One Knowledge Graph',          desc:'No duplicate knowledge — one graph powers all agents',  emoji:'🕸️' },
              { label:'One Permission System',        desc:'Agent actions governed by a single RBAC layer',         emoji:'🔐' },
            ].map(p => (
              <div key={p.label} className="rounded-xl border px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="text-lg mb-1.5 block">{p.emoji}</span>
                <p className="text-xs font-bold text-white mb-0.5">{p.label}</p>
                <p className="text-[10px] text-gray-600 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MEMBERSHIP ────────────────────────────────────────────────── */}
        <section id="sec-membership">
          <SectionHeader emoji="👑" title="Membership Structure" color="#D4AF37"
            subtitle="4 tiers — from individual system access to full white-label enterprise" />
          <div className="grid sm:grid-cols-2 gap-4">
            {MEMBERSHIP_TIERS.map((tier, i) => (
              <motion.div key={tier.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border p-5"
                style={{ background: `${tier.color}07`, borderColor: `${tier.color}30` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{tier.emoji}</span>
                  <span className="text-sm font-black text-white">{tier.name} Tier</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{tier.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── UNIVERSAL SYSTEMS ─────────────────────────────────────────── */}
        <section id="sec-universal">
          <SectionHeader emoji="🔗" title="Universal Systems" color="#10B981"
            subtitle="One project system. One file system. One search. No duplication across apps." />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5"
              style={{ background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.22)' }}>
              <p className="text-sm font-black text-white mb-3">📁 Universal Project System</p>
              <p className="text-[10px] text-gray-500 mb-3">Every project across every app uses the same structure.</p>
              <div className="space-y-1">
                {['Files','Tasks','Notes','Agents','Timeline','Analytics','Publishing'].map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <FiCheck size={9} className="text-green-500" />
                    <span className="text-[10px] text-gray-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border p-5"
              style={{ background: 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.22)' }}>
              <p className="text-sm font-black text-white mb-3">🗄️ Universal File System</p>
              <p className="text-[10px] text-gray-500 mb-3">Single file repository. Assets auto-categorized and used by all systems.</p>
              <div className="space-y-1">
                {['Audio','Video','Images','Documents','Research','Projects','Templates'].map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <FiFolder size={9} className="text-blue-400" />
                    <span className="text-[10px] text-gray-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border p-5"
              style={{ background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.22)' }}>
              <p className="text-sm font-black text-white mb-3">🔍 Universal Search</p>
              <p className="text-[10px] text-gray-500 mb-3">One search engine across the entire ecosystem.</p>
              <div className="space-y-1">
                {['Library','Projects','Agents','Files','Courses','League Data','Media Data'].map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <FiSearch size={9} className="text-yellow-400" />
                    <span className="text-[10px] text-gray-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GAP REPORT ────────────────────────────────────────────────── */}
        <section id="sec-gaps">
          <SectionHeader emoji="🔴" title="Gap Report" color="#EF4444"
            subtitle={`${totalGaps} total gaps — ${criticalGaps} critical items require immediate attention before next phase`} />

          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label:'Critical',  count: criticalGaps, color:'#EF4444', bg:'rgba(239,68,68,0.1)' },
              { label:'High',      count: GAPS.reduce((s,g) => s + g.items.filter(i=>i.severity==='high').length, 0),   color:'#F59E0B', bg:'rgba(245,158,11,0.1)' },
              { label:'Medium',    count: GAPS.reduce((s,g) => s + g.items.filter(i=>i.severity==='medium').length, 0), color:'#60A5FA', bg:'rgba(96,165,250,0.1)' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border px-4 py-3 text-center"
                style={{ background: s.bg, borderColor: `${s.color}25` }}>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
                <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {GAPS.map((cat, i) => (
              <motion.div key={cat.category}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}>
                <GapCategory cat={cat} defaultOpen={i === 0} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BUILD ORDER ───────────────────────────────────────────────── */}
        <section id="sec-build-order">
          <SectionHeader emoji="🏗️" title="Highest Priority Build Order" color="#F97316"
            subtitle={`${BUILD_ORDER.length} phases — ${inProgress} currently in progress`} />
          <div className="space-y-2">
            {BUILD_ORDER.map((item, i) => {
              const meta = STATUS_META[item.status];
              return (
                <motion.div key={item.n}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all hover:bg-white/2"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: item.status === 'in-progress' ? `${item.color}35` : 'rgba(255,255,255,0.06)' }}>
                  {/* Number */}
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: item.status === 'in-progress' ? `${item.color}20` : 'rgba(255,255,255,0.05)', color: item.status === 'in-progress' ? item.color : '#6B7280' }}>
                    {item.n}
                  </div>
                  {/* Emoji + name */}
                  <span className="text-xl leading-none flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.label}</p>
                    <p className="text-[10px] text-gray-600 truncate">{item.desc}</p>
                  </div>
                  {/* Status */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.status === 'in-progress' ? 'animate-pulse' : ''}`}
                      style={{ background: meta.color }} />
                    <span className="text-[10px] font-semibold" style={{ color: meta.color }}>{meta.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-8 rounded-2xl border p-6"
            style={{ background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.25)' }}>
            <p className="text-xs font-bold text-white mb-2">📌 Architecture Principle</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              This structure eliminates almost all overlap and gives you one ecosystem where every future app plugs into the same foundation instead of becoming a separate platform.
              All existing apps retain their current layout and UI. New systems build on the universal project, file, and search foundation before being wired into Griot Central.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

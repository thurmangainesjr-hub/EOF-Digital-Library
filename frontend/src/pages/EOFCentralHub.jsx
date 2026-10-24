import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiActivity, FiUsers, FiGlobe, FiArrowRight,
  FiChevronRight, FiClock, FiShield, FiAlertTriangle,
  FiCheckCircle, FiGrid, FiList, FiBell, FiLock,
} from 'react-icons/fi';
import {
  AGENT_SYSTEMS, SYSTEM_META, SYSTEM_HEALTH,
  GLOBAL_ACTIVITY_FEED, ACTIVE_PROJECTS, AGENT_EVOLUTION, KNOWLEDGE_LEVELS,
} from '../data/agentData';
import AgentFullPanel from '../components/AgentFullPanel';

const ACCENT = '#D4AF37';

// Merge systems with meta
const ALL_DIVISIONS = AGENT_SYSTEMS.map(s => ({
  ...s,
  ...(SYSTEM_META[s.id] || {}),
})).filter(s => s.id !== 'central');

const CENTRAL = AGENT_SYSTEMS.find(s => s.id === 'central');
const TOTAL_AGENTS  = AGENT_SYSTEMS.reduce((n, s) => n + s.agents.length, 0);
const TOTAL_HELPERS = AGENT_SYSTEMS.reduce((n, s) => n + s.helpers.length, 0);
const ACTIVE_DIV    = ALL_DIVISIONS.filter(s => s.status === 'active').length;
const ACTIVE_TASKS  = SYSTEM_HEALTH.reduce((n, s) => n + s.tasks, 0);

// Conductor overview stats
const OS_STATS = [
  { label: 'Divisions',    value: AGENT_SYSTEMS.length, icon: FiGrid,     color: ACCENT },
  { label: 'Total Agents', value: TOTAL_AGENTS,          icon: FiUsers,    color: '#7C3AED' },
  { label: 'Helpers',      value: `${TOTAL_HELPERS}+`,   icon: FiZap,      color: '#10B981' },
  { label: 'Running Tasks',value: ACTIVE_TASKS,           icon: FiActivity, color: '#22D3EE' },
  { label: 'Live Now',     value: ACTIVE_DIV,             icon: FiCheckCircle, color: '#10B981' },
];

// Standalone apps that run on this PC (started by their own shortcut)
const LOCAL_APPS = [
  {
    id: 'image-forge',
    name: 'EOF Image Forge',
    emoji: '🎨',
    color: ACCENT,
    desc: 'Book covers, character art and talking puppets',
    status: 'LOCAL · BUILD',
    url: 'http://localhost:5190',
    bars: [
      { label: 'Development', value: 53 },
      { label: 'Business readiness', value: 8 },
    ],
    next: 'merge PR #7 (chat studio), test real pictures, finish the webcam puppet test.',
  },
];

// Status appearance
const STATUS_STYLE = {
  active:      { dot: '#10B981', label: 'ACTIVE',      bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
  live:        { dot: '#22D3EE', label: 'LIVE',        bg: 'rgba(34,211,238,0.08)',  border: 'rgba(34,211,238,0.2)' },
  idle:        { dot: '#6B7280', label: 'IDLE',        bg: 'rgba(107,114,128,0.06)', border: 'rgba(107,114,128,0.15)' },
  coming_soon: { dot: '#A78BFA', label: 'SOON',        bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.18)' },
};

const PENDING_APPROVALS = [
  { id: 1, agent: 'Story Architect',  action: 'Publish Chapter 5 outline',      system: 'Griot AI',    color: '#8B5CF6', urgent: false },
  { id: 2, agent: 'Threat Mapper',    action: 'Escalate API anomaly to review', system: 'Security',    color: '#EF4444', urgent: true  },
  { id: 3, agent: 'Grant Agent',      action: 'Submit NEA proposal draft',      system: 'BAC',         color: '#16A34A', urgent: false },
];

// ── Division card ────────────────────────────────────────────────────────────
function DivisionCard({ sys, i, onAgentOpen }) {
  const meta   = SYSTEM_META[sys.id] || {};
  const style  = STATUS_STYLE[meta.status] || STATUS_STYLE.idle;
  const head   = sys.agents.find(a => a.id === meta.headAgentId) || sys.agents[0];
  const health = SYSTEM_HEALTH.find(h => h.id === sys.id);
  const coming = meta.status === 'coming_soon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all group ${coming ? 'opacity-60' : 'hover:brightness-110'}`}
      style={{ background: `${sys.color}07`, borderColor: `${sys.color}20` }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: `${sys.color}15` }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{sys.emoji}</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{sys.shortName}</p>
              <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{meta.divisionLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: style.bg, border: `1px solid ${style.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: style.dot }} />
            <span className="text-[8px] font-bold tracking-wider" style={{ color: style.dot }}>{style.label}</span>
          </div>
        </div>

        {/* Head agent */}
        {head && (
          <button
            onClick={() => !coming && onAgentOpen({ agent: head, system: sys })}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all hover:bg-white/5 mt-1"
            style={{ background: `${sys.color}08`, borderColor: `${sys.color}20` }}
            disabled={coming}
          >
            <span className="text-base">{head.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white truncate">{meta.headName || head.name}</p>
              <p className="text-[9px] text-gray-500 truncate">{head.title}</p>
            </div>
            {!coming && <FiChevronRight size={10} className="text-gray-600 flex-shrink-0" />}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-600">
            <span className="text-white font-bold">{sys.agents.length}</span> agents
          </span>
          {health && health.tasks > 0 && (
            <span className="text-[10px] text-gray-600">
              <span className="font-bold" style={{ color: sys.color }}>{health.tasks}</span> tasks
            </span>
          )}
        </div>
        {!coming ? (
          meta.appUrl ? (
            <a href={meta.appUrl} target="_blank" rel="noreferrer"
              className="text-[9px] font-bold flex items-center gap-0.5 hover:brightness-110 transition-all"
              style={{ color: sys.color }}>
              Open <FiArrowRight size={9} />
            </a>
          ) : (
            <Link to={sys.path} className="text-[9px] font-bold flex items-center gap-0.5 hover:brightness-110 transition-all"
              style={{ color: sys.color }}>
              Open <FiArrowRight size={9} />
            </Link>
          )
        ) : (
          <span className="text-[9px] text-gray-600 font-bold">Coming Soon</span>
        )}
      </div>
    </motion.div>
  );
}

// ── System health mini-bar ───────────────────────────────────────────────────
function HealthBar() {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {SYSTEM_HEALTH.slice(0, 13).map(sys => {
        const style = STATUS_STYLE[sys.status] || STATUS_STYLE.idle;
        return (
          <div key={sys.id} className="flex items-center gap-1 px-2 py-1 rounded-lg border"
            style={{ background: style.bg, borderColor: style.border }}
            title={`${sys.name} — ${sys.status}`}>
            <span className="text-xs">{sys.emoji}</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Activity type badge ──────────────────────────────────────────────────────
const ACTIVITY_TYPE = {
  create:   { icon: '✨', color: '#10B981' },
  alert:    { icon: '⚠️', color: '#EF4444' },
  schedule: { icon: '📅', color: '#D4AF37' },
  complete: { icon: '✅', color: '#22D3EE' },
};

export default function EOFCentralHub() {
  const [openAgent, setOpenAgent] = useState(null);
  const [divView, setDivView]     = useState('grid'); // 'grid' | 'list'

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── OS Control Bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b px-6 py-2 flex items-center gap-4 flex-wrap"
        style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>

        {/* System health dots */}
        <HealthBar />

        <div className="flex-1" />

        {/* Pending approvals */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:brightness-110"
          style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.25)', color: ACCENT }}>
          <FiBell size={11} />
          {PENDING_APPROVALS.length} Pending
        </button>

        {/* Running tasks */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
          style={{ background: 'rgba(34,211,238,0.06)', borderColor: 'rgba(34,211,238,0.2)', color: '#22D3EE' }}>
          <FiActivity size={11} className="animate-pulse" />
          {ACTIVE_TASKS} Running
        </div>

        {/* Security status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
          <FiShield size={11} />
          Secure
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(124,58,237,0.04) 50%, transparent 100%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 85% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.28)', color: ACCENT }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                EOF Operating System · The Conductor
              </div>
              <h1 className="text-3xl font-black text-white mb-2 leading-tight tracking-tight">
                E.O.F Central AI
              </h1>
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                One intelligence core. {AGENT_SYSTEMS.length} divisions. {TOTAL_AGENTS} agents. Every workflow, every project, every creator — coordinated from a single command center.
              </p>

              <div className="flex gap-3 mt-5 flex-wrap">
                <Link to="/ecosystem"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:brightness-110"
                  style={{ background: 'rgba(212,175,55,0.12)', borderColor: 'rgba(212,175,55,0.35)', color: ACCENT }}>
                  🌐 Full Ecosystem
                </Link>
                <Link to="/central/widgets"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  <FiGrid size={13} /> Widgets
                </Link>
              </div>
            </div>

            {/* OS stat pills */}
            <div className="hidden md:flex flex-col gap-1.5 items-end flex-shrink-0">
              {OS_STATS.map(s => (
                <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                  style={{ background: `${s.color}07`, borderColor: `${s.color}18` }}>
                  <s.icon size={11} style={{ color: s.color }} />
                  <span className="text-sm font-bold text-white">{s.value}</span>
                  <span className="text-[10px] text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* ── Pending Approvals ────────────────────────────────────────────── */}
        {PENDING_APPROVALS.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Pending Approvals</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', color: ACCENT, border: '1px solid rgba(212,175,55,0.25)' }}>
                {PENDING_APPROVALS.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PENDING_APPROVALS.map(p => (
                <div key={p.id} className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                  style={{ background: p.urgent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)', borderColor: p.urgent ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)' }}>
                  {p.urgent && <FiAlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white truncate">{p.action}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{p.agent} · {p.system}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="px-2 py-1 rounded-lg text-[9px] font-bold border transition-all hover:brightness-110"
                      style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#10B981' }}>
                      ✓
                    </button>
                    <button className="px-2 py-1 rounded-lg text-[9px] font-bold border border-white/8 text-gray-500 hover:text-white transition-all">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Active Projects ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Active Projects</h2>
            <span className="text-[10px] text-gray-600">{ACTIVE_PROJECTS.length} in progress</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {ACTIVE_PROJECTS.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border px-3 py-3 hover:bg-white/3 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-gray-400"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>{p.type}</span>
                  <span className="text-[9px] text-gray-600">{p.deadline}</span>
                </div>
                <p className="text-xs font-bold text-white mb-1 leading-tight">{p.name}</p>
                <p className="text-[9px] text-gray-500 mb-2">{p.system}</p>
                {/* Progress bar */}
                <div className="h-1 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: ACCENT }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-600">{p.progress}% done</span>
                  <span className="text-[9px] font-bold" style={{ color: ACCENT }}>Q{p.quality}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Local Apps ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Local Apps</h2>
            <span className="text-[10px] text-gray-600">{LOCAL_APPS.length} on this PC</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {LOCAL_APPS.map(app => (
              <div key={app.id}
                className="rounded-xl border px-4 py-3 space-y-2"
                style={{ background: `${app.color}08`, borderColor: `${app.color}25` }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl flex-shrink-0">{app.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{app.name}</p>
                    <p className="text-[9px] text-gray-500 truncate">{app.desc}</p>
                  </div>
                  <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: '#FCD34D', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                    {app.status}
                  </span>
                </div>
                {app.bars.map(bar => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-500">{bar.label}</span>
                      <span className="text-[9px] font-bold" style={{ color: app.color }}>{bar.value}%</span>
                    </div>
                    <div className="h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${bar.value}%`, background: app.color }} />
                    </div>
                  </div>
                ))}
                <p className="text-[9px] text-gray-500 leading-relaxed">Next: {app.next}</p>
                <a href={app.url} target="_blank" rel="noreferrer"
                  className="inline-flex text-[10px] font-bold items-center gap-1 px-3 py-1.5 rounded-lg border transition-all hover:brightness-110"
                  style={{ borderColor: `${app.color}30`, color: app.color, background: `${app.color}08` }}>
                  Open <FiArrowRight size={9} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Division OS Grid ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">All Divisions</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', color: ACCENT, border: '1px solid rgba(212,175,55,0.2)' }}>
                {ALL_DIVISIONS.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setDivView('grid')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${divView === 'grid' ? 'text-white bg-white/10' : 'text-gray-600 hover:text-gray-400'}`}>
                <FiGrid size={12} />
              </button>
              <button onClick={() => setDivView('list')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${divView === 'list' ? 'text-white bg-white/10' : 'text-gray-600 hover:text-gray-400'}`}>
                <FiList size={12} />
              </button>
            </div>
          </div>

          {divView === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {ALL_DIVISIONS.map((sys, i) => (
                <DivisionCard key={sys.id} sys={sys} i={i} onAgentOpen={setOpenAgent} />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {ALL_DIVISIONS.map((sys, i) => {
                const meta  = SYSTEM_META[sys.id] || {};
                const style = STATUS_STYLE[meta.status] || STATUS_STYLE.idle;
                const health = SYSTEM_HEALTH.find(h => h.id === sys.id);
                return (
                  <motion.div key={sys.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl border hover:bg-white/3 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-xl flex-shrink-0">{sys.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{sys.name}</p>
                      <p className="text-[9px] text-gray-500">{meta.divisionLabel}</p>
                    </div>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                      <span className="text-[8px] font-bold tracking-wider" style={{ color: style.dot }}>{style.label}</span>
                    </div>
                    <span className="text-[10px] text-gray-600 flex-shrink-0 w-16 text-center">
                      <span className="text-white font-bold">{sys.agents.length}</span> agents
                    </span>
                    {health && (
                      <span className="text-[10px] flex-shrink-0 w-14 text-center" style={{ color: sys.color }}>
                        <span className="font-bold">{health.tasks}</span> tasks
                      </span>
                    )}
                    {meta.status !== 'coming_soon' ? (
                      meta.appUrl ? (
                        <a href={meta.appUrl} target="_blank" rel="noreferrer"
                          className="text-[10px] font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all hover:brightness-110 flex-shrink-0"
                          style={{ borderColor: `${sys.color}30`, color: sys.color, background: `${sys.color}08` }}>
                          Open <FiArrowRight size={9} />
                        </a>
                      ) : (
                        <Link to={sys.path}
                          className="text-[10px] font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all hover:brightness-110 flex-shrink-0"
                          style={{ borderColor: `${sys.color}30`, color: sys.color, background: `${sys.color}08` }}>
                          Open <FiArrowRight size={9} />
                        </Link>
                      )
                    ) : (
                      <span className="text-[9px] text-gray-600 font-bold flex-shrink-0 w-16 text-center">Coming Soon</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Two-column: Activity + Conductor Core ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Activity Feed — 3 cols */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Live Activity Feed</h2>
              <FiActivity size={11} className="text-gray-600" />
            </div>
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              {GLOBAL_ACTIVITY_FEED.map((item, i) => {
                const t = ACTIVITY_TYPE[item.type] || ACTIVITY_TYPE.create;
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-white/2 transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-sm flex-shrink-0 mt-0.5">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-300 leading-snug">{item.action}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">
                        <span style={{ color: item.color }}>{item.agent}</span> · {item.system}
                      </p>
                    </div>
                    <span className="text-[9px] text-gray-600 flex-shrink-0 flex items-center gap-1 mt-0.5">
                      <FiClock size={8} /> {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Conductor Core — 2 cols */}
          <section className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Conductor Core</h2>

            {/* Central agents */}
            {CENTRAL?.agents.map((agent, i) => {
              const evo = AGENT_EVOLUTION[agent.id];
              const lvl = evo ? KNOWLEDGE_LEVELS.find(l => l.label === evo.level) : null;
              return (
                <button key={agent.id}
                  onClick={() => setOpenAgent({ agent, system: CENTRAL })}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all hover:bg-white/4 hover:border-amber-500/20 group"
                  style={{ background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.12)' }}>
                  <span className="text-xl flex-shrink-0">{agent.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{agent.name}</p>
                    <p className="text-[9px] text-gray-500 truncate">{agent.title}</p>
                  </div>
                  {lvl && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: `${lvl.color}15`, color: lvl.color, border: `1px solid ${lvl.color}25` }}>
                      {evo.level}
                    </span>
                  )}
                  <FiChevronRight size={11} className="text-gray-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                </button>
              );
            })}

            {/* Spawning note */}
            <div className="rounded-xl border px-3 py-3"
              style={{ background: 'rgba(212,175,55,0.03)', borderColor: 'rgba(212,175,55,0.12)' }}>
              <p className="text-[10px] font-bold text-white mb-1">Live Agent Spawning</p>
              <p className="text-[9px] text-gray-500 leading-relaxed">
                Division heads spawn temporary helpers for specialized tasks. Helpers complete the work, report back, then close. Every action is logged and audited by Security Command.
              </p>
            </div>
          </section>
        </div>

        {/* ── EOF OS Flow ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">EOF OS Flow</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'Learn',     emoji: '🎓', color: '#2563EB', path: '/university' },
              { label: 'Create',    emoji: '✍️', color: '#7C3AED', path: '/griot' },
              { label: 'Direct',    emoji: '🎬', color: '#EF4444', path: '/film-studio' },
              { label: 'Record',    emoji: '🎵', color: '#D4AF37', path: '/music-studio' },
              { label: 'Broadcast', emoji: '📺', color: '#6366F1', path: '/streaming' },
              { label: 'Transmit',  emoji: '📻', color: '#0891B2', path: '/radio' },
              { label: 'Preserve',  emoji: '🏺', color: '#6366F1', path: '/legacy-vault' },
              { label: 'Compete',   emoji: '🏆', color: '#F97316', path: '/fhhl' },
              { label: 'Discover',  emoji: '🌌', color: '#0D9488', path: '/akashic' },
              { label: 'Secure',    emoji: '🛡️', color: '#EF4444', path: '/security' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                {i > 0 && <FiArrowRight size={10} className="text-gray-700 flex-shrink-0" />}
                <Link to={step.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all hover:brightness-110"
                  style={{ background: `${step.color}0d`, borderColor: `${step.color}25`, color: step.color }}>
                  <span className="text-sm">{step.emoji}</span>
                  <span className="text-[10px] font-bold">{step.label}</span>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </section>

      </div>

      {/* Agent full panel */}
      {openAgent && (
        <AgentFullPanel
          agent={openAgent.agent}
          systemId="central"
          system={openAgent.system}
          minTier={CENTRAL?.minTier}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

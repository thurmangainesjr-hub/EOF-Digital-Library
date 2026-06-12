import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight, FiActivity, FiZap, FiUsers, FiShield,
  FiAlertTriangle, FiCheckCircle, FiClock, FiPlay, FiStar,
  FiBarChart2, FiLayers, FiTrendingUp,
} from 'react-icons/fi';
import StudioRoundtable from '../components/StudioRoundtable';
import EcosystemStrip from '../components/EcosystemStrip';
import {
  SYSTEM_HEALTH,
  GLOBAL_ACTIVITY_FEED,
  ACTIVE_PROJECTS,
  AGENT_SYSTEMS,
} from '../data/agentData';

const ROUNDTABLE_OPTIONS = [
  { id: 'music',   label: 'Music Album',    icon: '🎵', desc: 'Production, Lyrics, Performance, Market Fit' },
  { id: 'film',    label: 'Film / Series',  icon: '🎬', desc: 'Story, Visual, Pacing, Audience Fit' },
  { id: 'content', label: 'Content Package', icon: '📺', desc: 'Quality, SEO, Engagement, Brand Fit' },
];

const AUTONOMY_STATS = [
  { label: 'Level 0 (Advisory)',     count: 4,  color: '#9CA3AF' },
  { label: 'Level 1 (Assisted)',     count: 12, color: '#60A5FA' },
  { label: 'Level 2 (Collaborative)',count: 7,  color: '#D4AF37' },
  { label: 'Level 3 (Executive)',    count: 3,  color: '#A78BFA' },
  { label: 'Level 4 (Studio Mode)', count: 1,  color: '#EC4899' },
];

const STATUS_CONFIG = {
  active: { label: 'Active',  color: '#10B981', dot: 'bg-emerald-500' },
  live:   { label: 'Live',    color: '#EF4444', dot: 'bg-red-500 animate-pulse' },
  idle:   { label: 'Idle',    color: '#6B7280', dot: 'bg-gray-600' },
};

const ACTIVITY_TYPE_COLOR = {
  create:   '#A78BFA',
  schedule: '#10B981',
  alert:    '#F97316',
  approve:  '#60A5FA',
};
const ACTIVITY_TYPE_ICON = {
  create:   '✨',
  schedule: '📅',
  alert:    '⚠️',
  approve:  '✓',
};

function QualityBar({ value, color }) {
  return (
    <div className="w-full h-1 rounded-full bg-white/8 mt-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function qualityColor(q) {
  if (q >= 90) return '#10B981';
  if (q >= 80) return '#D4AF37';
  return '#F97316';
}

export default function GriotCentralHub() {
  const [roundtableOpen, setRoundtableOpen]       = useState(false);
  const [roundtableType, setRoundtableType]       = useState('music');
  const [activityFilter, setActivityFilter]       = useState('all');
  const [dismissedAlerts, setDismissedAlerts]     = useState([]);

  const totalActive  = SYSTEM_HEALTH.filter(s => s.status !== 'idle').length;
  const totalAgents  = AGENT_SYSTEMS.reduce((sum, s) => sum + s.agents.length, 0);
  const totalTasks   = SYSTEM_HEALTH.reduce((sum, s) => sum + s.tasks, 0);
  const liveCount    = SYSTEM_HEALTH.filter(s => s.status === 'live').length;

  const filteredFeed = activityFilter === 'all'
    ? GLOBAL_ACTIVITY_FEED
    : GLOBAL_ACTIVITY_FEED.filter(e => e.type === activityFilter);

  function dismissAlert(i) {
    setDismissedAlerts(p => [...p, i]);
  }

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#D4AF37' }}>Griot Central</span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-amber-600/30 px-6 py-10 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(120,100,20,0.06) 50%, rgba(13,13,13,0.96) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(212,175,55,0.1) 0%, transparent 65%)' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-amber-300 mb-4 border"
              style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}>
              <FiShield size={11} /> Executive Production Suite
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
              Griot Central
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-5 max-w-xl">
              Executive Producer of the entire EOF ecosystem. All agents report here. Monitor system health, review proactive outputs, approve studio deliveries, and launch roundtable reviews — all from one command center.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <FiLayers size={13} />, label: `${totalActive} Systems Active`, color: '#10B981' },
                { icon: <FiUsers size={13} />, label: `${totalAgents} Agents Deployed`, color: '#60A5FA' },
                { icon: <FiActivity size={13} />, label: `${totalTasks} Tasks Running`, color: '#D4AF37' },
                { icon: <FiPlay size={13} />, label: `${liveCount} Live Now`, color: '#EF4444' },
              ].map((stat, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{ background: `${stat.color}12`, borderColor: `${stat.color}30`, color: stat.color }}>
                  {stat.icon} {stat.label}
                </div>
              ))}
            </div>
          </div>

          {/* Autonomy Distribution Card */}
          <div className="rounded-2xl border border-white/10 p-5 w-full md:w-64 flex-shrink-0 bg-white/3">
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-500 mb-3">
              Autonomy Distribution
            </p>
            <div className="space-y-2">
              {AUTONOMY_STATS.map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-gray-500">{s.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.count}</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(s.count / 27) * 100}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-700 mt-3">27 active agent instances</p>
          </div>
        </div>
      </motion.div>

      {/* ── System Health Grid ─────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">System Health</h2>
          <span className="text-xs text-gray-600">{SYSTEM_HEALTH.length} systems monitored</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SYSTEM_HEALTH.map((sys, i) => {
            const sc = STATUS_CONFIG[sys.status];
            return (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-white/8 p-3 bg-white/2 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{sys.emoji}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${sc.dot}`} />
                </div>
                <p className="text-xs font-bold text-white leading-tight truncate mb-0.5">{sys.name}</p>
                <p className="text-[9px] font-semibold mb-2" style={{ color: sc.color }}>{sc.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-600">{sys.agents} agents</span>
                  <span className="text-[9px] font-bold" style={{ color: sys.color }}>{sys.tasks} tasks</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Active Projects + Activity Feed ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

        {/* Active Projects */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl text-white font-bold">Active Projects</h2>
            <span className="text-xs text-gray-600">{ACTIVE_PROJECTS.length} in progress</span>
          </div>
          <div className="space-y-3">
            {ACTIVE_PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl border border-white/8 p-4 bg-white/2 hover:border-white/12 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight truncate">{proj.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{proj.type} · {proj.system}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: qualityColor(proj.quality) }}>
                      {proj.quality}/100
                    </p>
                    <p className="text-[9px] text-gray-600">{proj.agents} agents</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-600 mb-1.5">
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${proj.progress}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: qualityColor(proj.quality) }}
                  />
                </div>
                <p className="text-[9px] text-gray-600 mt-1.5">Due {proj.deadline}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Agent Activity Feed */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl text-white font-bold">Activity Feed</h2>
            <div className="flex gap-1">
              {['all', 'create', 'alert', 'schedule'].map(f => (
                <button
                  key={f}
                  onClick={() => setActivityFilter(f)}
                  className="text-[9px] px-2 py-1 rounded-md border capitalize transition-all"
                  style={activityFilter === f
                    ? { background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#6B7280' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredFeed.map((event, i) => {
                const tc = ACTIVITY_TYPE_COLOR[event.type] || '#9CA3AF';
                const ti = ACTIVITY_TYPE_ICON[event.type]  || '•';
                return (
                  <motion.div
                    key={`${event.agent}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-white/6 bg-white/2"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                      style={{ background: `${tc}15`, border: `1px solid ${tc}25` }}
                    >
                      {ti}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white leading-snug font-medium">{event.action}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">
                        {event.agent} · {event.system}
                      </p>
                    </div>
                    <span className="text-[9px] text-gray-600 flex-shrink-0">{event.time}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* ── Studio Roundtable Launcher ───────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Studio Roundtable</h2>
            <p className="text-sm text-gray-500">
              Launch a multi-agent review session. Agents score your project across key dimensions and deliver a consolidated recommendation.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROUNDTABLE_OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => { setRoundtableType(opt.id); setRoundtableOpen(true); }}
              className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-white/2 hover:border-amber-500/35 hover:bg-amber-500/5 transition-all text-left group"
            >
              <span className="text-3xl">{opt.icon}</span>
              <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {opt.label}
              </p>
              <p className="text-[10px] text-gray-500 leading-snug">{opt.desc}</p>
              <div className="mt-auto flex items-center gap-1 text-[10px] font-semibold text-amber-500/70 group-hover:text-amber-400 transition-colors">
                <FiPlay size={10} /> Launch Review
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Griot Central Role Card ──────────────────────────────────── */}
      <div
        className="rounded-2xl border border-amber-600/25 p-6 flex flex-col md:flex-row md:items-start gap-5 mb-4"
        style={{ background: 'rgba(212,175,55,0.05)' }}
      >
        <div className="text-4xl flex-shrink-0">🏛️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-2">What Griot Central Controls</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {[
              'Monitor all system health in real time',
              'Track active projects and deadlines',
              'Review agent activity across all 10 systems',
              'Launch Studio Roundtable reviews',
              'Approve or deny agent action proposals',
              'Escalate issues and reassign work',
              'Coordinate multi-agent Studio Mode operations',
              'Maintain creator control over all final decisions',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">›</span>
                <span className="text-xs text-gray-400 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link to="/ecosystem"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors">
            All Systems <FiChevronRight size={11} />
          </Link>
          <Link to="/griot"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors">
            Griot AI Studio <FiChevronRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Architecture Doc Link ───────────────────────────────────── */}
      <div className="mb-10">
        <Link
          to="/griot-architecture"
          className="flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all hover:brightness-110 group"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(10,10,10,0))', borderColor: 'rgba(139,92,246,0.35)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.2)' }}>
            🗂️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-black text-white">Griot Ecosystem Master Architecture v1.0</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                v1.0
              </span>
            </div>
            <p className="text-xs text-gray-500">All systems · Gap report · Build order · Ownership map</p>
          </div>
          <FiChevronRight size={18} className="text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      </div>

      <EcosystemStrip currentAppId="griot-central" />

      {/* Roundtable Modal */}
      <AnimatePresence>
        {roundtableOpen && (
          <StudioRoundtable
            template={roundtableType}
            projectName={ACTIVE_PROJECTS[0]?.name || 'Current Project'}
            onClose={() => setRoundtableOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

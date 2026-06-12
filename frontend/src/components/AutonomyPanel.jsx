import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiCpu, FiGrid, FiZap } from 'react-icons/fi';
import {
  AUTONOMY_LEVELS,
  APP_CONTROL_CATEGORIES,
  AGENT_APP_CONTROLS,
  PROACTIVE_TEMPLATES,
} from '../data/agentData';

// Mock pending actions per agent
function getPendingActions(agentId) {
  const PENDING = {
    'story-architect':     [
      { id: 'a1', type: 'create',   label: 'Generate scene outline for Chapter 5',    detail: 'Based on existing story arc + character goals' },
      { id: 'a2', type: 'review',   label: 'Write 3 dialogue variations for Marcus',  detail: 'Scene: confrontation in the marketplace' },
    ],
    'canon-keeper':        [
      { id: 'c1', type: 'fix',      label: 'Reconcile age discrepancy for Marcus',    detail: 'Ch. 1 says 32, Ch. 7 says 28 — standardize to 32' },
      { id: 'c2', type: 'review',   label: 'Audit Kalahari Council references',       detail: 'Cross-check Act I dissolution against Ep. 3' },
    ],
    'production-studio':   [
      { id: 'p1', type: 'create',   label: 'Generate 8 image prompts for Act II',     detail: 'Desert setting, golden hour, 3 key characters' },
      { id: 'p2', type: 'create',   label: 'Build shot list for Scene 7',             detail: '4 shots needed: wide, medium, close, tracking' },
    ],
    'world-builder':       [
      { id: 'w1', type: 'create',   label: 'Build Northlands faction profile',        detail: 'Required before Act II — culture + government' },
    ],
    'bac-coach':           [
      { id: 'b1', type: 'create',   label: 'Draft competitive analysis section',      detail: '3 direct competitors, matrix format' },
    ],
    'channel-manager':     [
      { id: 'ch1', type: 'schedule', label: 'Fill Thursday 6–8 PM content gap',       detail: '2 archival documentary pieces queued and ready' },
    ],
    'programming-director':[
      { id: 'r1', type: 'schedule', label: 'Assign Culture Connect to Thursday PM',   detail: 'Prime time slot currently empty on the schedule' },
    ],
    'distribution-agent':  [
      { id: 'd1', type: 'create',   label: 'Write metadata for EOF Summer Catalog',   detail: '12 titles need keyword-optimized descriptions' },
    ],
    'audience-growth':     [
      { id: 'ag1', type: 'create',  label: 'Generate 3 social clips from Episode 2',  detail: 'Target: Instagram (30s), TikTok (15s), YouTube Shorts (60s)' },
    ],
  };
  return PENDING[agentId] || [
    { id: 'def1', type: 'review', label: 'Review weekly project status report', detail: 'Summary ready — awaiting your approval to send' },
  ];
}

const TYPE_COLOR = { create: '#A78BFA', review: '#60A5FA', fix: '#F97316', schedule: '#10B981' };
const TYPE_ICON  = { create: '✨', review: '🔍', fix: '🔧', schedule: '📅' };

export default function AutonomyPanel({ agent }) {
  const [activeLevel, setActiveLevel]       = useState(1);
  const [actions, setActions]               = useState(getPendingActions(agent.id));
  const [approved, setApproved]             = useState([]);
  const [projectCtx, setProjectCtx]         = useState({ quality: 'streaming', budget: 'indie', timeline: '3 months' });

  const level     = AUTONOMY_LEVELS[activeLevel];
  const appCtrl   = AGENT_APP_CONTROLS[agent.id] || {};
  const proactive = PROACTIVE_TEMPLATES[agent.id] || [];
  const hasApps   = Object.keys(appCtrl).length > 0;

  function handleApprove(id) {
    setApproved(p => [...p, id]);
    setTimeout(() => setActions(p => p.filter(a => a.id !== id)), 650);
  }
  function handleDeny(id) {
    setTimeout(() => setActions(p => p.filter(a => a.id !== id)), 350);
  }

  return (
    <div className="p-5 space-y-6">

      {/* ── Autonomy Level Selector ─────────────────────────────────────── */}
      <section>
        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
          Autonomy Level
        </p>

        {/* Level buttons */}
        <div className="flex gap-1.5 mb-3">
          {AUTONOMY_LEVELS.map(l => (
            <button
              key={l.level}
              onClick={() => setActiveLevel(l.level)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all"
              style={activeLevel === l.level
                ? { background: `${l.color}18`, borderColor: `${l.color}50` }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-sm leading-none">{l.icon}</span>
              <span className="text-[9px] font-bold leading-none"
                style={{ color: activeLevel === l.level ? l.color : '#6B7280' }}>
                L{l.level}
              </span>
            </button>
          ))}
        </div>

        {/* Active level detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border p-3 space-y-2.5"
            style={{ background: `${level.color}0c`, borderColor: `${level.color}30` }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none">{level.icon}</span>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  Level {level.level} — {level.name}
                </p>
                <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                  {level.description}
                </p>
              </div>
            </div>

            {/* Example */}
            <div className="px-3 py-2 rounded-lg text-[10px] italic text-gray-400 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${level.color}50` }}>
              {level.example}
            </div>

            {/* Can / Cannot */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-500 mb-1.5">Can Do</p>
                {level.canDo.map((item, i) => (
                  <div key={i} className="flex items-start gap-1 mb-0.5">
                    <FiCheck size={8} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[9px] text-gray-400 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-red-400 mb-1.5">Cannot Do</p>
                {level.cannotDo.map((item, i) => (
                  <div key={i} className="flex items-start gap-1 mb-0.5">
                    <FiX size={8} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[9px] text-gray-400 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Pending Actions (shown at Level 1+) ─────────────────────────── */}
      {activeLevel >= 1 && actions.length > 0 && (
        <section>
          <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3 flex items-center gap-1.5">
            Pending Actions
            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold"
              style={{ background: `${agent.colorFrom}20`, color: agent.colorFrom }}>
              {actions.length}
            </span>
          </p>
          <div className="space-y-2">
            <AnimatePresence>
              {actions.map(action => {
                const tc = TYPE_COLOR[action.type] || '#9CA3AF';
                const ti = TYPE_ICON[action.type]  || '⚡';
                const isJustApproved = approved.includes(action.id);
                return (
                  <motion.div
                    key={action.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: isJustApproved ? 0.45 : 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl border p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${tc}25` }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `${tc}15`, border: `1px solid ${tc}25` }}>
                        {ti}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white leading-snug">{action.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{action.detail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleApprove(action.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:brightness-110"
                        style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }}
                      >
                        <FiCheck size={9} /> Approve
                      </button>
                      <button
                        onClick={() => handleDeny(action.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:brightness-110"
                        style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#EF4444' }}
                      >
                        <FiX size={9} /> Deny
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ── Proactive Recommendations ────────────────────────────────────── */}
      {proactive.length > 0 && (
        <section>
          <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3 flex items-center gap-1.5">
            <FiAlertTriangle size={9} className="text-amber-400" />
            Proactive Alerts
          </p>
          <div className="space-y-2">
            {proactive.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-amber-500/20 p-3 bg-amber-500/5"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm flex-shrink-0 leading-tight">{rec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-white leading-snug">{rec.message}</p>
                    <p className="text-[9px] text-amber-400/80 mt-1 leading-snug italic">
                      Suggestion: {rec.suggestion}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:brightness-110 transition-all">
                    <FiCheck size={9} /> Accept
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 transition-all">
                    <FiX size={9} /> Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── App Control Framework ────────────────────────────────────────── */}
      {hasApps && (
        <section>
          <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3 flex items-center gap-1.5">
            <FiCpu size={9} />
            App Control Framework
          </p>
          <div className="space-y-2">
            {Object.entries(appCtrl).map(([cat, apps]) => {
              const meta = APP_CONTROL_CATEGORIES[cat];
              if (!meta) return null;
              return (
                <div key={cat} className="rounded-xl border border-white/8 p-3 bg-white/2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base leading-none">{meta.icon}</span>
                    <span className="text-[10px] font-semibold" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {apps.map(app => (
                      <span key={app}
                        className="text-[9px] px-2 py-0.5 rounded-md border border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15 cursor-pointer transition-colors">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-gray-700 mt-2 italic">
            * Apps execute only after creator authorization at the active autonomy level.
          </p>
        </section>
      )}

      {/* ── Project Context / Awareness ──────────────────────────────────── */}
      <section>
        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3 flex items-center gap-1.5">
          <FiGrid size={9} />
          Project Awareness
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: 'Quality Target',
              key: 'quality',
              options: ['YouTube', 'Independent', 'Streaming', 'Commercial', 'Major Studio'],
            },
            {
              label: 'Budget Level',
              key: 'budget',
              options: ['Micro', 'Indie', 'Mid-Range', 'Commercial', 'Major'],
            },
            {
              label: 'Timeline',
              key: 'timeline',
              options: ['1 week', '1 month', '3 months', '6 months', '1 year'],
            },
          ].map(field => (
            <div key={field.key}>
              <p className="text-[9px] text-gray-600 mb-1.5">{field.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {field.options.map(opt => {
                  const isActive = projectCtx[field.key] === opt.toLowerCase().replace(/ /g, '-');
                  return (
                    <button
                      key={opt}
                      onClick={() => setProjectCtx(p => ({ ...p, [field.key]: opt.toLowerCase().replace(/ /g, '-') }))}
                      className="text-[9px] px-2 py-0.5 rounded-md border transition-all"
                      style={isActive
                        ? { background: `${agent.colorFrom}18`, borderColor: `${agent.colorFrom}40`, color: agent.colorFrom }
                        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#6B7280' }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Creator Control Principle ──────────────────────────────────────── */}
      <div className="rounded-xl border border-white/8 p-3"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[9px] font-semibold text-white mb-1.5 flex items-center gap-1.5">
          <FiZap size={9} style={{ color: agent.colorFrom }} />
          Creator Control Principle
        </p>
        <p className="text-[9px] text-gray-500 leading-relaxed">
          Agents can suggest, prepare, organize, and execute approved actions.
          They <span className="text-red-400 font-semibold">cannot</span> publish, delete, release, spend money, or modify canon without your direct authorization.
        </p>
      </div>

    </div>
  );
}

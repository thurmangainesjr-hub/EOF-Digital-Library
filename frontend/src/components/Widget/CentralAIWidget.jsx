/**
 * EOF Central AI Hub — Home Screen Widget
 *
 * Three sizes:
 *   small   155 × 155  — brand + system count + coordinator status
 *   medium  329 × 155  — brand + 4 core agents + active systems
 *   large   329 × 345  — full dashboard: all systems, agents, membership, flow
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AGENT_SYSTEMS, MEMBERSHIP_TIERS } from '../../data/agentData';

const CENTRAL = AGENT_SYSTEMS.find(s => s.id === 'central');
const ALL_SYSTEMS = AGENT_SYSTEMS.filter(s => s.id !== 'central');
const TOTAL_AGENTS = AGENT_SYSTEMS.reduce((n, s) => n + s.agents.length, 0);

// ── Central mark ──────────────────────────────────────────────────────────────
function CentralMark({ size = 26 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0 relative"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #D4AF37, #A8892A)',
        boxShadow: '0 0 10px rgba(212,175,55,0.35)',
        fontSize: size * 0.52,
      }}
    >
      🏛️
    </div>
  );
}

// ── Pulse dot ─────────────────────────────────────────────────────────────────
function PulseDot({ color = '#10B981' }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
      style={{ background: color }}
    />
  );
}

// ── Small 155 × 155 ───────────────────────────────────────────────────────────
function SmallCentralWidget() {
  const systemCount = AGENT_SYSTEMS.length;

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
      style={{
        width: 155, height: 155,
        background: 'linear-gradient(145deg, #130f00, #0d0d0d)',
        border: '1px solid rgba(212,175,55,0.22)',
      }}
    >
      <div className="flex items-center justify-between">
        <CentralMark size={24} />
        <div className="flex items-center gap-1">
          <PulseDot color="#D4AF37" />
          <span className="text-[9px] font-semibold" style={{ color: '#D4AF37' }}>Active</span>
        </div>
      </div>

      {/* Stats center */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-[28px] font-bold font-serif leading-none" style={{ color: '#D4AF37' }}>
          {systemCount}
        </p>
        <p className="text-[9px] text-gray-500 uppercase tracking-wide">Systems</p>
        <div className="w-full h-px bg-white/6 my-1" />
        <p className="text-[18px] font-bold font-serif leading-none text-white">{TOTAL_AGENTS}</p>
        <p className="text-[9px] text-gray-500 uppercase tracking-wide">Core Agents</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[8px] text-gray-600">EOF Central</span>
        <span className="text-[8px] font-semibold" style={{ color: '#D4AF37' }}>Hub</span>
      </div>
    </div>
  );
}

// ── Medium 329 × 155 ─────────────────────────────────────────────────────────
function MediumCentralWidget() {
  const coreAgents = CENTRAL.agents;

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex"
      style={{
        width: 329, height: 155,
        background: 'linear-gradient(145deg, #130f00, #0d0d0d)',
        border: '1px solid rgba(212,175,55,0.22)',
      }}
    >
      {/* Left — branding */}
      <div
        className="w-[110px] flex-shrink-0 flex flex-col justify-between p-3.5 border-r border-white/5"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.07), transparent)' }}
      >
        <CentralMark size={26} />
        <div>
          <p className="text-white font-serif font-bold leading-none" style={{ fontSize: 12 }}>
            EOF Central
          </p>
          <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">AI Hub</p>
        </div>
        <div>
          <p className="text-[18px] font-bold font-serif leading-none" style={{ color: '#D4AF37' }}>
            {AGENT_SYSTEMS.length}
          </p>
          <p className="text-[8px] text-gray-600">Systems active</p>
        </div>
      </div>

      {/* Right — 4 core agents */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600">Core Agents</p>
        <div className="space-y-1.5">
          {coreAgents.map(agent => (
            <div key={agent.id} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  background: `${agent.colorFrom}18`,
                  border: `1px solid ${agent.colorFrom}28`,
                }}
              >
                {agent.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white font-medium leading-none truncate">{agent.name}</p>
                <p className="text-[8px] text-gray-600 mt-0.5 truncate">{agent.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[9px]" style={{ color: '#D4AF37' }}>
          Open Hub →
        </div>
      </div>
    </div>
  );
}

// ── Large 329 × 345 ───────────────────────────────────────────────────────────
function LargeCentralWidget() {
  const topSystems = AGENT_SYSTEMS.slice(0, 6);

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex flex-col"
      style={{
        width: 329, height: 345,
        background: 'linear-gradient(145deg, #130f00, #0d0d0d)',
        border: '1px solid rgba(212,175,55,0.22)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <CentralMark size={22} />
          <div>
            <p className="text-[11px] font-bold text-white font-serif leading-none">EOF Central AI</p>
            <p className="text-[8px] mt-0.5" style={{ color: '#D4AF37' }}>
              {AGENT_SYSTEMS.length} Systems · {TOTAL_AGENTS} Agents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full px-2 py-0.5 border"
          style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.25)' }}>
          <PulseDot color="#D4AF37" />
          <span className="text-[7px] font-semibold" style={{ color: '#D4AF37' }}>LIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-3 py-2 border-b border-white/5">
        {[
          { v: AGENT_SYSTEMS.length,   l: 'Systems',  c: '#D4AF37' },
          { v: TOTAL_AGENTS,           l: 'Agents',   c: '#7C3AED' },
          { v: AGENT_SYSTEMS.reduce((n, s) => n + s.helpers.length, 0) + '+', l: 'Helpers', c: '#10B981' },
          { v: MEMBERSHIP_TIERS.length, l: 'Tiers',   c: '#6366F1' },
        ].map((s, i) => (
          <React.Fragment key={s.l}>
            {i > 0 && <div className="w-px h-5 bg-white/6" />}
            <div className="text-center">
              <p className="text-[14px] font-bold font-serif leading-none" style={{ color: s.c }}>{s.v}</p>
              <p className="text-[7px] text-gray-600 mt-0.5 uppercase tracking-wide">{s.l}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Systems grid (top 6) */}
      <div className="px-3 py-2.5 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Systems</p>
        <div className="grid grid-cols-3 gap-1.5">
          {topSystems.map(sys => (
            <div
              key={sys.id}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
              style={{
                background: `${sys.color}0a`,
                border: `1px solid ${sys.color}18`,
              }}
            >
              <span className="text-sm">{sys.emoji}</span>
              <span className="text-[8px] text-gray-400 truncate leading-none">{sys.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core agents strip */}
      <div className="px-3 py-2 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Central Core</p>
        <div className="flex gap-1.5">
          {CENTRAL.agents.map(agent => (
            <div
              key={agent.id}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg text-center"
              style={{
                background: `${agent.colorFrom}12`,
                border: `1px solid ${agent.colorFrom}22`,
              }}
            >
              <span className="text-base leading-none">{agent.avatar}</span>
              <p className="text-[7px] leading-tight text-gray-500" style={{ maxWidth: 36 }}>
                {agent.name.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem flow */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['Learn', 'Create', 'Build', 'Legacy'].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="text-[7px] text-white/15">→</span>}
              <span
                className="text-[7px] px-1.5 py-1 rounded-md font-medium border"
                style={{
                  background: i === 0 ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  borderColor: i === 0 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)',
                  color: i === 0 ? '#D4AF37' : '#374151',
                }}
              >
                {s}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-[8px] font-bold" style={{ color: '#D4AF37' }}>Open →</p>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
export default function CentralAIWidget({ size = 'medium', className = '' }) {
  const Widget =
    size === 'small' ? SmallCentralWidget :
    size === 'large' ? LargeCentralWidget :
    MediumCentralWidget;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${className}`}
    >
      <Widget />
    </motion.div>
  );
}

export { SmallCentralWidget, MediumCentralWidget, LargeCentralWidget };

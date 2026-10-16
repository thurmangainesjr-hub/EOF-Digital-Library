/**
 * Griot AI — Home Screen Widget
 *
 * Three sizes:
 *   small   155 × 155  — active format + current project
 *   medium  329 × 155  — current project + recent adaptations
 *   large   329 × 345  — full dashboard: formats, stats, capabilities
 */

import React from 'react';
import { motion } from 'framer-motion';

const FORMATS = [
  { id: 'audiobook',  icon: '🎧', label: 'Audiobook'  },
  { id: 'screenplay', icon: '🎬', label: 'Screenplay'  },
  { id: 'game',       icon: '🎮', label: 'Game'        },
  { id: 'podcast',    icon: '🎙️', label: 'Podcast'     },
  { id: 'graphic',    icon: '🖼️', label: 'Graphic'     },
  { id: 'doc',        icon: '📽️', label: 'Documentary' },
];

const EXAMPLE_PROJECTS = [
  { title: 'The Freedom Blueprint', type: 'Audiobook',    icon: '🎧', status: 'Complete'     },
  { title: 'Black Excellence',       type: 'Documentary',  icon: '📽️', status: 'In Progress'  },
  { title: 'Afrofuture Rising',      type: 'Game',         icon: '🎮', status: 'Complete'     },
];

// ── Shared mark ───────────────────────────────────────────────────────────────
function GroitMark({ size = 26 }) {
  return (
    <div className="rounded-xl flex items-center justify-center flex-shrink-0 relative"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #7C3AED, #4A0E4E)',
        boxShadow: '0 0 8px rgba(124,58,237,0.4)',
        fontSize: size * 0.55,
      }}>
      🌀
    </div>
  );
}

// ── Small 155 × 155 ───────────────────────────────────────────────────────────
function SmallGroitWidget({ stats = {} }) {
  const {
    activeFormat = FORMATS[0],
    currentProject = EXAMPLE_PROJECTS[0],
    adaptationCount = 500,
  } = stats;

  return (
    <div className="relative rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
      style={{
        width: 155, height: 155,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}>

      <div className="flex items-center justify-between">
        <GroitMark size={24} />
        <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: '#7C3AED' }}>
          Griot AI
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
          {activeFormat.icon}
        </div>
        <p className="text-[10px] text-white font-semibold leading-none">{activeFormat.label}</p>
        <p className="text-[8px] text-gray-500 truncate max-w-[120px] text-center">
          {currentProject.title}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-600">{adaptationCount}+ made</span>
        <span className="text-[9px] font-bold" style={{ color: '#10B981' }}>Active</span>
      </div>
    </div>
  );
}

// ── Medium 329 × 155 ─────────────────────────────────────────────────────────
function MediumGroitWidget({ stats = {} }) {
  const {
    currentProject = EXAMPLE_PROJECTS[0],
    recentProjects = EXAMPLE_PROJECTS,
    progress = 72,
  } = stats;

  return (
    <div className="relative rounded-[22px] overflow-hidden flex"
      style={{
        width: 329, height: 155,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}>

      {/* Left — current project */}
      <div className="w-[140px] flex-shrink-0 flex flex-col justify-between p-3.5 border-r border-white/5">
        <div className="flex items-center gap-2">
          <GroitMark size={22} />
          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Active</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
              {currentProject.icon}
            </div>
            <div>
              <p className="text-[11px] text-white font-bold leading-none truncate">{currentProject.title}</p>
              <p className="text-[9px] mt-0.5" style={{ color: '#7C3AED' }}>{currentProject.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#7C3AED' }} />
            </div>
            <span className="text-[8px] text-gray-500">{progress}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[8px] text-gray-500">Transforming</span>
        </div>
      </div>

      {/* Right — recent adaptations */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600">Recent</p>
        <div className="space-y-1.5">
          {recentProjects.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center">{p.icon}</span>
              <p className="text-[10px] text-gray-300 flex-1 truncate">{p.title}</p>
              <span className={`text-[8px] font-medium ${
                p.status === 'Complete' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {p.status === 'Complete' ? '✓' : '…'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-600">500+ total</span>
          <span className="text-[9px] font-bold" style={{ color: '#A78BFA' }}>6 formats</span>
        </div>
      </div>
    </div>
  );
}

// ── Large 329 × 345 ───────────────────────────────────────────────────────────
function LargeGroitWidget({ stats = {} }) {
  const {
    adaptationCount = 500,
    formatsCount = 6,
    activeProjects = 3,
    completedProjects = 247,
  } = stats;

  return (
    <div className="relative rounded-[22px] overflow-hidden flex flex-col"
      style={{
        width: 329, height: 345,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <GroitMark size={22} />
          <div>
            <p className="text-[11px] font-bold text-white font-serif leading-none">Griot AI</p>
            <p className="text-[8px] mt-0.5" style={{ color: '#7C3AED' }}>Story Transformation Engine</p>
          </div>
        </div>
        <div className="text-xl">🌀</div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-3 py-2 border-b border-white/5">
        {[
          { v: `${adaptationCount}+`, l: 'Adaptations', c: '#7C3AED' },
          { v: formatsCount,           l: 'Formats',     c: '#10B981' },
          { v: activeProjects,         l: 'Active',      c: '#F59E0B' },
          { v: completedProjects,      l: 'Complete',    c: '#D4AF37' },
        ].map((s, i) => (
          <React.Fragment key={s.l}>
            {i > 0 && <div className="w-px h-5 bg-white/6" />}
            <div className="text-center">
              <p className="text-[14px] font-bold font-serif leading-none" style={{ color: s.c }}>{s.v}</p>
              <p className="text-[8px] text-gray-600 mt-0.5 uppercase tracking-wide">{s.l}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Output formats grid */}
      <div className="px-3 py-2.5 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Output Formats</p>
        <div className="grid grid-cols-3 gap-1.5">
          {FORMATS.map(fmt => (
            <div key={fmt.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.14)' }}>
              <span className="text-sm">{fmt.icon}</span>
              <span className="text-[9px] text-gray-400 truncate leading-none">{fmt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active project */}
      <div className="px-3 py-2.5 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Now Transforming</p>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
            🎧
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white font-bold truncate">The Freedom Blueprint</p>
            <p className="text-[8px] text-gray-500">Audiobook · Marcus J. Freeman</p>
            <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: '72%', background: '#7C3AED' }} />
            </div>
          </div>
          <span className="text-[8px] font-bold text-green-400 flex-shrink-0">72%</span>
        </div>
      </div>

      {/* Journey / CTA strip */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['Read', 'Transform', 'Distribute'].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="text-[8px] text-white/20">→</span>}
              <span className="text-[8px] px-2 py-1 rounded-lg font-medium border"
                style={{
                  background: i === 1 ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)',
                  borderColor: i === 1 ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)',
                  color: i === 1 ? '#A78BFA' : '#4B5563',
                }}>
                {s}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-[8px] font-bold" style={{ color: '#7C3AED' }}>Create →</p>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
export default function GroitAppWidget({ size = 'medium', stats, className = '' }) {
  const Widget =
    size === 'small' ? SmallGroitWidget :
    size === 'large' ? LargeGroitWidget :
    MediumGroitWidget;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${className}`}>
      <Widget stats={stats} />
    </motion.div>
  );
}

export { SmallGroitWidget, MediumGroitWidget, LargeGroitWidget };

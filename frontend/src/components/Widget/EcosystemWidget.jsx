/**
 * EOF Ecosystem Widget
 *
 * iOS / Android / Windows home-screen widget covering the entire EOF platform.
 *
 * Sizes:
 *   small   155 × 155  — live status dots + EOF brand
 *   medium  329 × 155  — current activity across 3 apps
 *   large   329 × 345  — full mini-dashboard, all 6 apps
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiArrowRight } from 'react-icons/fi';

const APPS = [
  { id: 'library',        icon: '📚', label: 'Library',   color: '#D4AF37', path: '/',               live: false },
  { id: 'griot',          icon: '🌀', label: 'Griot AI',  color: '#7C3AED', path: '/griot',           live: true  },
  { id: 'university',     icon: '🎓', label: 'University', color: '#D4AF37', path: '/university',      live: false },
  { id: 'creator-academy',icon: '🌟', label: 'Academy',   color: '#C0392B', path: '/creator-academy', live: true  },
  { id: 'streaming',      icon: '📺', label: 'Streaming', color: '#6366F1', path: '/streaming',       live: true  },
  { id: 'radio',          icon: '📻', label: 'Radio',     color: '#0891B2', path: '/radio',           live: true  },
];

// ── EOF mark ─────────────────────────────────────────────────────────────────
function EOFMark({ size = 26 }) {
  return (
    <div
      className="rounded-lg bg-eof-gold flex items-center justify-center flex-shrink-0 relative shadow-gold-sm"
      style={{ width: size, height: size }}
    >
      <span className="font-serif font-bold text-eof-dark leading-none" style={{ fontSize: size * 0.5 }}>E</span>
      <span
        className="absolute -bottom-0.5 -right-0.5 rounded-full bg-eof-crimson border border-eof-dark"
        style={{ width: size * 0.28, height: size * 0.28 }}
      />
    </div>
  );
}

// ── Live pulse dot ────────────────────────────────────────────────────────────
function LiveDot({ color }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
      style={{ background: color }}
    />
  );
}

// ── Small 155 × 155 ───────────────────────────────────────────────────────────
function SmallEcosystemWidget() {
  const liveCount = APPS.filter(a => a.live).length;

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
      style={{
        width: 155, height: 155,
        background: 'linear-gradient(145deg, #111111, #0D0D0D)',
        border: '1px solid rgba(212,175,55,0.20)',
      }}
    >
      <div className="flex items-center justify-between">
        <EOFMark size={24} />
        <div className="flex items-center gap-1">
          <LiveDot color="#10B981" />
          <span className="text-[9px] text-green-400 font-semibold">{liveCount} Live</span>
        </div>
      </div>

      {/* App grid 3×2 */}
      <div className="grid grid-cols-3 gap-2 px-1">
        {APPS.map(app => (
          <div key={app.id} className="flex flex-col items-center gap-0.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm relative"
              style={{ background: `${app.color}15`, border: `1px solid ${app.color}25` }}
            >
              {app.icon}
              {app.live && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-eof-dark"
                  style={{ background: app.color }}
                />
              )}
            </div>
            <p className="text-[7px] text-gray-500 leading-none">{app.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[8px] text-eof-muted">EOF Platform</span>
        <span className="text-[8px] text-eof-gold font-semibold">6 Apps</span>
      </div>
    </div>
  );
}

// ── Medium 329 × 155 ──────────────────────────────────────────────────────────
function MediumEcosystemWidget({ stats = {} }) {
  const highlights = [
    { icon: '📻', label: 'Radio', sub: '2.4K listening',  color: '#0891B2', live: true  },
    { icon: '📺', label: 'Streaming', sub: '1 series live', color: '#6366F1', live: true  },
    { icon: '🌀', label: 'Griot AI',  sub: '500+ adapted', color: '#7C3AED', live: false },
  ];

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex gap-0"
      style={{
        width: 329, height: 155,
        background: 'linear-gradient(145deg, #111111, #0D0D0D)',
        border: '1px solid rgba(212,175,55,0.20)',
      }}
    >
      {/* Left — branding */}
      <div
        className="w-[100px] flex-shrink-0 flex flex-col justify-between p-3.5"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)' }}
      >
        <EOFMark size={26} />
        <div>
          <p className="text-white text-[12px] font-serif font-bold leading-none">EOF</p>
          <p className="text-eof-muted text-[9px] leading-none mt-0.5">Ecosystem</p>
        </div>
        <div className="flex items-center gap-1">
          <LiveDot color="#10B981" />
          <span className="text-[8px] text-green-400">4 Live</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/5 self-stretch" />

      {/* Right — live activity */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <p className="text-[9px] font-semibold tracking-widest text-eof-muted uppercase">Active Now</p>
        <div className="space-y-2">
          {highlights.map(h => (
            <div key={h.label} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${h.color}15`, border: `1px solid ${h.color}25` }}
              >
                {h.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-medium leading-none truncate">{h.label}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{h.sub}</p>
              </div>
              {h.live && <LiveDot color={h.color} />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[9px]" style={{ color: '#D4AF37' }}>
          Open Ecosystem <FiArrowRight size={9} />
        </div>
      </div>
    </div>
  );
}

// ── Large 329 × 345 ───────────────────────────────────────────────────────────
function LargeEcosystemWidget({ stats = {} }) {
  const { booksRead = 12, streak = 7, hoursRead = 24, adaptations = 8 } = stats;

  return (
    <div
      className="relative rounded-[22px] overflow-hidden flex flex-col"
      style={{
        width: 329, height: 345,
        background: 'linear-gradient(145deg, #111111, #0D0D0D)',
        border: '1px solid rgba(212,175,55,0.20)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <EOFMark size={24} />
          <div>
            <p className="text-white text-[12px] font-bold font-serif leading-none">EOF Platform</p>
            <p className="text-eof-muted text-[9px] mt-0.5">Complete Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
          <LiveDot color="#10B981" />
          <span className="text-[8px] text-green-400 font-semibold">4 LIVE</span>
        </div>
      </div>

      {/* App grid */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-white/5">
        {APPS.map(app => (
          <div key={app.id} className="flex items-center gap-2 relative">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: `${app.color}12`, border: `1px solid ${app.color}25` }}
            >
              {app.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-white font-medium leading-none truncate">{app.label}</p>
              {app.live && (
                <p className="text-[8px] mt-0.5" style={{ color: app.color }}>● Live</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div className="flex items-center justify-around px-4 py-2.5 border-b border-white/5">
        {[
          { label: 'Read',   value: booksRead,    color: '#D4AF37' },
          { label: 'Streak', value: `${streak}d`, color: '#C0392B' },
          { label: 'Hours',  value: hoursRead,    color: '#6366F1' },
          { label: 'Created',value: adaptations,  color: '#7C3AED' },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="w-px h-5 bg-white/8" />}
            <div className="text-center">
              <p className="text-[15px] font-bold font-serif leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-eof-muted text-[8px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Flow strip */}
      <div className="flex-1 px-4 py-3">
        <p className="text-[9px] font-semibold tracking-widest text-eof-muted uppercase mb-2">Your Journey</p>
        <div className="flex items-center gap-1.5">
          {['Learn', 'Create', 'Publish', 'Earn'].map((step, i) => (
            <React.Fragment key={step}>
              <div
                className="flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold border"
                style={{
                  background: i === 1 ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: i === 1 ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.08)',
                  color: i === 1 ? '#A78BFA' : '#6B7280',
                }}
              >
                {step}
              </div>
              {i < 3 && <span className="text-[8px] text-white/20">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-1 flex items-center justify-between border-t border-white/5">
        <p className="text-[9px] text-eof-muted">Learn → Create → Legacy</p>
        <div className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: '#D4AF37' }}>
          Open <FiArrowRight size={9} />
        </div>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
export default function EcosystemWidget({ size = 'medium', stats, className = '' }) {
  const Widget =
    size === 'small' ? SmallEcosystemWidget :
    size === 'large' ? LargeEcosystemWidget :
    MediumEcosystemWidget;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${className}`}
    >
      <Widget stats={stats} />
    </motion.div>
  );
}

export { SmallEcosystemWidget, MediumEcosystemWidget, LargeEcosystemWidget };

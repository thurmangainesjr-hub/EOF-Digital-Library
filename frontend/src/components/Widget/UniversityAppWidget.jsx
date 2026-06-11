/**
 * DIY University — Home Screen Widget
 *
 * Three sizes:
 *   small   155 × 155  — active professor + school
 *   medium  329 × 155  — session status + 3 schools
 *   large   329 × 345  — full dashboard: all schools, engines, journey
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SCHOOLS } from '../../data/universityData';

const ENGINES = [
  { label: 'Teaching',      color: '#3B82F6' },
  { label: 'Coaching',      color: '#10B981' },
  { label: 'Critique',      color: '#F59E0B' },
  { label: 'Creation',      color: '#8B5CF6' },
  { label: 'Metacognition', color: '#D4AF37' },
];

// ── Shared mark ───────────────────────────────────────────────────────────────
function UniversityMark({ size = 26 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0 text-base relative"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #D4AF37, #A8892A)',
        boxShadow: '0 0 8px rgba(212,175,55,0.3)',
        fontSize: size * 0.55,
      }}
    >
      🎓
    </div>
  );
}

// ── Small 155 × 155 ───────────────────────────────────────────────────────────
function SmallUniversityWidget({ stats = {} }) {
  const { school = SCHOOLS[0], professor = SCHOOLS[0].professors[0], progress = 34 } = stats;
  const r = 22, circ = 2 * Math.PI * r, dash = (progress / 100) * circ;

  return (
    <div className="relative rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
      style={{
        width: 155, height: 155,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}
    >
      <div className="flex items-center justify-between">
        <UniversityMark size={24} />
        <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: '#7C3AED' }}>
          University
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="relative w-14 h-14">
          <svg width={56} height={56} className="-rotate-90 absolute inset-0">
            <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth={4} />
            <circle cx={28} cy={28} r={r} fill="none" stroke="#7C3AED" strokeWidth={4}
              strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {school.icon}
          </div>
        </div>
        <p className="text-[10px] text-white font-semibold leading-none">{school.shortName}</p>
        <p className="text-[8px] text-gray-500 truncate max-w-[120px] text-center">{professor.name}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-600">{progress}% complete</span>
        <span className="text-[9px] font-bold" style={{ color: '#D4AF37' }}>Active</span>
      </div>
    </div>
  );
}

// ── Medium 329 × 155 ─────────────────────────────────────────────────────────
function MediumUniversityWidget({ stats = {} }) {
  const { currentSchool = SCHOOLS[0], professor = SCHOOLS[0].professors[0], engine = 'Teaching', streak = 5 } = stats;
  const topSchools = SCHOOLS.slice(0, 3);

  return (
    <div className="relative rounded-[22px] overflow-hidden flex"
      style={{
        width: 329, height: 155,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}
    >
      {/* Left — current session */}
      <div className="w-[130px] flex-shrink-0 flex flex-col justify-between p-3.5 border-r border-white/5">
        <div className="flex items-center gap-2">
          <UniversityMark size={22} />
          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Session</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-xl">{currentSchool.icon}</div>
            <div>
              <p className="text-[11px] text-white font-bold leading-none truncate">{currentSchool.shortName}</p>
              <p className="text-[9px] text-gray-500 mt-0.5 truncate">{professor.name.replace('Professor ', 'Prof. ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1 flex-1 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '34%', background: '#7C3AED' }} />
            </div>
            <span className="text-[8px] text-gray-500">34%</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />
          <span className="text-[8px] text-gray-500">{engine} Engine</span>
        </div>
      </div>

      {/* Right — schools + streak */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600">Schools</p>
        <div className="space-y-1.5">
          {topSchools.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center">{s.icon}</span>
              <p className="text-[11px] text-gray-300 flex-1 truncate">{s.shortName}</p>
              <div className="w-12 h-1 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: s.id === 'writing' ? '60%' : s.id === 'film' ? '20%' : '0%',
                  background: s.accent,
                }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-600">{streak} day streak</span>
          <span className="text-[9px] font-bold text-eof-gold">🔥 {streak}</span>
        </div>
      </div>
    </div>
  );
}

// ── Large 329 × 345 ───────────────────────────────────────────────────────────
function LargeUniversityWidget({ stats = {} }) {
  const { booksStudied = 6, streak = 5, hoursLearned = 18, completedCapstones = 2 } = stats;
  const activeSchools = SCHOOLS.slice(0, 6);

  return (
    <div className="relative rounded-[22px] overflow-hidden flex flex-col"
      style={{
        width: 329, height: 345,
        background: 'linear-gradient(145deg, #130d1f, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <UniversityMark size={22} />
          <div>
            <p className="text-[11px] font-bold text-white font-serif leading-none">DIY University</p>
            <p className="text-[8px] mt-0.5" style={{ color: '#7C3AED' }}>8 Schools · 24+ Professors</p>
          </div>
        </div>
        <div className="text-xl">🏛️</div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-3 py-2 border-b border-white/5">
        {[
          { v: booksStudied,       l: 'Studied',   c: '#D4AF37' },
          { v: `${streak}d`,       l: 'Streak',    c: '#C0392B' },
          { v: hoursLearned,       l: 'Hours',     c: '#7C3AED' },
          { v: completedCapstones, l: 'Capstones', c: '#10B981' },
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

      {/* Schools grid */}
      <div className="px-3 py-2.5 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Schools</p>
        <div className="grid grid-cols-3 gap-1.5">
          {activeSchools.map(school => (
            <div key={school.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
              style={{ background: `${school.accent}0a`, border: `1px solid ${school.accent}18` }}>
              <span className="text-sm">{school.icon}</span>
              <span className="text-[9px] text-gray-400 truncate leading-none">{school.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Engines */}
      <div className="px-3 py-2.5 border-b border-white/5">
        <p className="text-[8px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Professor Engines</p>
        <div className="flex gap-1">
          {ENGINES.map((e, i) => (
            <div key={e.label}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg text-center"
              style={{
                background: i === 4 ? `${e.color}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 4 ? e.color + '35' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <span className="text-[10px]">{['📖', '🎯', '🔍', '🛠️', '🧠'][i]}</span>
              <p className="text-[7px] leading-tight" style={{ color: i === 4 ? e.color : '#4B5563' }}>
                {e.label.slice(0, 5)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['Learn', 'Create', 'Earn'].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="text-[8px] text-white/20">→</span>}
              <span
                className="text-[8px] px-2 py-1 rounded-lg font-medium border"
                style={{
                  background: i === 0 ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                  borderColor: i === 0 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)',
                  color: i === 0 ? '#D4AF37' : '#4B5563',
                }}
              >{s}</span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-[8px] font-bold" style={{ color: '#7C3AED' }}>Open →</p>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
export default function UniversityAppWidget({ size = 'medium', stats, className = '' }) {
  const Widget =
    size === 'small' ? SmallUniversityWidget :
    size === 'large' ? LargeUniversityWidget :
    MediumUniversityWidget;

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

export { SmallUniversityWidget, MediumUniversityWidget, LargeUniversityWidget };

/**
 * Griot Central Widget — 3 sizes
 * Small 155×155 | Medium 329×155 | Large 329×345
 */
import React from 'react';
import { motion } from 'framer-motion';

const C = '#10B981'; // emerald accent

const SYSTEMS = [
  { name: 'Griot AI',    emoji: '🤖', status: 'active',  health: 98 },
  { name: 'Film Studio', emoji: '🎬', status: 'active',  health: 95 },
  { name: 'Music',       emoji: '🎵', status: 'active',  health: 92 },
  { name: 'FHHL',        emoji: '🏆', status: 'active',  health: 88 },
  { name: 'Library',     emoji: '📚', status: 'active',  health: 99 },
  { name: 'University',  emoji: '🎓', status: 'active',  health: 85 },
  { name: 'Streaming',   emoji: '📺', status: 'standby', health: 70 },
  { name: 'BAC',         emoji: '⭐', status: 'standby', health: 72 },
];

function StatusDot({ status }) {
  return (
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
      status === 'active' ? 'bg-green-400' : 'bg-amber-400'
    }`}/>
  );
}

function SmallWidget() {
  const active = SYSTEMS.filter(s => s.status === 'active').length;
  const avgHealth = Math.round(SYSTEMS.reduce((a, s) => a + s.health, 0) / SYSTEMS.length);
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #071A10, #0D0D0D)', border: '1px solid rgba(16,185,129,0.20)' }}>
      <div className="flex items-center justify-between">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
             style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>⚡</div>
        <span className="text-[9px] font-semibold tracking-widest text-emerald-400/70 uppercase">Central</span>
      </div>
      <div className="text-center">
        <p className="text-emerald-400 text-[28px] font-bold leading-none">{avgHealth}%</p>
        <p className="text-[9px] text-gray-500">ecosystem health</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
               style={{ width: `${avgHealth}%` }}/>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-emerald-400">{active} active</span>
        <span className="text-[9px] text-gray-500">{SYSTEMS.length} systems</span>
      </div>
    </div>
  );
}

function MediumWidget() {
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #071A10, #0D0D0D)', border: '1px solid rgba(16,185,129,0.20)' }}>
      <div className="w-[90px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3"
           style={{ background: 'linear-gradient(135deg, #0A2A18, #071A10)' }}>
        <span className="text-2xl">⚡</span>
        <p className="text-[9px] text-emerald-400/80 font-semibold uppercase tracking-widest text-center">Griot Central</p>
        <div className="text-center">
          <p className="text-white text-[18px] font-bold leading-none">8</p>
          <p className="text-[8px] text-gray-500 mt-0.5">systems</p>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-white/70">System Health</span>
          <span className="text-[9px] text-emerald-400">Owner Mode</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {SYSTEMS.slice(0, 6).map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <StatusDot status={s.status}/>
              <span className="text-[8px] text-gray-300 flex-1 truncate">{s.name}</span>
              <span className="text-[8px] text-gray-600">{s.health}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[9px] text-gray-600">
          <span className="text-emerald-400">6 active</span>
          <span>·</span>
          <span className="text-amber-400">2 standby</span>
          <span>·</span>
          <span>Thurman G.</span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget() {
  const AGENTS = [
    { name: 'Research Agent',     role: 'Knowledge & Search',   active: true  },
    { name: 'Story Architect',    role: 'Narrative Intelligence', active: true },
    { name: 'Film Director',      role: 'Visual Production',     active: true  },
    { name: 'Music Maestro',      role: 'Audio & Composition',   active: false },
  ];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #071A10, #0D0D0D)', border: '1px solid rgba(16,185,129,0.20)' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'rgba(16,185,129,0.15)' }}>⚡</div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-none">Griot Central</p>
            <p className="text-gray-500 text-[9px] mt-0.5">Thurman Gaines Jr · Owner</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StatusDot status="active"/>
          <span className="text-[9px] text-emerald-400 font-semibold">ALL SYSTEMS GO</span>
        </div>
      </div>

      {/* System grid */}
      <div className="px-4 py-2 border-b border-white/5">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-1.5">System Grid</p>
        <div className="grid grid-cols-4 gap-1.5">
          {SYSTEMS.map((s, i) => (
            <div key={i} className="rounded-lg p-1.5 flex flex-col items-center gap-0.5 border border-white/5"
                 style={{ background: s.status === 'active' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)' }}>
              <span className="text-[12px]">{s.emoji}</span>
              <span className="text-[7px] text-gray-500 text-center leading-tight truncate w-full text-center">{s.name}</span>
              <div className="flex items-center gap-0.5">
                <StatusDot status={s.status}/>
                <span className="text-[7px] text-gray-600">{s.health}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active agents */}
      <div className="flex-1 px-4 py-2 space-y-1.5 overflow-hidden">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-1">Active Agents</p>
        {AGENTS.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <StatusDot status={a.active ? 'active' : 'standby'}/>
            <span className="text-[10px] text-white font-medium flex-1">{a.name}</span>
            <span className="text-[9px] text-gray-500">{a.role}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        {[['8', 'Systems'], ['6', 'Active'], ['92%', 'Health']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-emerald-400 text-[16px] font-bold leading-none">{v}</p>
            <p className="text-gray-600 text-[9px] mt-0.5 uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GriotCentralWidget({ size = 'medium', className = '' }) {
  const W = size === 'small' ? SmallWidget : size === 'large' ? LargeWidget : MediumWidget;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className={`inline-block ${className}`}>
      <W />
    </motion.div>
  );
}
export { SmallWidget, MediumWidget, LargeWidget };

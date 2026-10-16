/**
 * Universal Projects Widget — 3 sizes
 * Small 155×155 | Medium 329×155 | Large 329×345
 */
import React from 'react';
import { motion } from 'framer-motion';

const C = '#3B82F6'; // blue accent

const PROJECTS = [
  { name: 'Afrofuture Rising',        system: '🎬', color: '#EF4444', progress: 72, status: 'Active',  tasks: 3 },
  { name: 'Crown Season EP',          system: '🎵', color: '#8B5CF6', progress: 74, status: 'Active',  tasks: 2 },
  { name: 'Afrofuture Canon',         system: '📖', color: '#EC4899', progress: 58, status: 'Active',  tasks: 5 },
  { name: 'Black Excellence Cert.',   system: '🎓', color: '#10B981', progress: 35, status: 'Pending', tasks: 1 },
  { name: 'Crown Season Promo',       system: '📺', color: '#F59E0B', progress: 15, status: 'Pending', tasks: 4 },
];

function SmallWidget() {
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #080F1A, #0D0D0D)', border: '1px solid rgba(59,130,246,0.20)' }}>
      <div className="flex items-center justify-between">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
             style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>📋</div>
        <span className="text-[9px] font-semibold tracking-widest text-blue-400/70 uppercase">Projects</span>
      </div>
      <div className="text-center">
        <p className="text-blue-400 text-[32px] font-bold leading-none">6</p>
        <p className="text-[9px] text-gray-500">active projects</p>
        <div className="mt-2 space-y-0.5">
          <div className="h-1 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: '72%' }}/>
          </div>
          <div className="h-1 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: '74%' }}/>
          </div>
          <div className="h-1 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: '58%' }}/>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-500">15 tasks</span>
        <span className="text-[9px] text-blue-400">5 systems</span>
      </div>
    </div>
  );
}

function MediumWidget() {
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #080F1A, #0D0D0D)', border: '1px solid rgba(59,130,246,0.20)' }}>
      <div className="w-[90px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3"
           style={{ background: 'linear-gradient(135deg, #0A1628, #08101A)' }}>
        <span className="text-2xl">📋</span>
        <p className="text-[9px] text-blue-400/80 font-semibold uppercase tracking-widest text-center">Projects</p>
        <div className="text-center">
          <p className="text-white text-[20px] font-bold leading-none">6</p>
          <p className="text-[8px] text-gray-500 mt-0.5">active</p>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-white/70">All Projects</span>
          <span className="text-[9px] text-blue-400">15 tasks open</span>
        </div>
        <div className="space-y-1.5">
          {PROJECTS.slice(0, 4).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px]">{p.system}</span>
              <span className="text-[9px] text-white flex-1 truncate">{p.name}</span>
              <div className="w-16 h-[3px] rounded-full bg-white/5 flex-shrink-0">
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }}/>
              </div>
              <span className="text-[9px] text-gray-600 w-8 text-right">{p.progress}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[9px] text-gray-600">
          <span>5 systems</span>
          <span>·</span>
          <span className="text-green-400">3 on track</span>
          <span>·</span>
          <span className="text-amber-400">2 pending</span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget() {
  const systemBreakdown = [
    { system: 'Film Studio',   emoji: '🎬', count: 1, color: '#EF4444' },
    { system: 'Music Studio',  emoji: '🎵', count: 2, color: '#8B5CF6' },
    { system: 'Griot AI',      emoji: '🤖', count: 1, color: '#EC4899' },
    { system: 'University',    emoji: '🎓', count: 1, color: '#10B981' },
    { system: 'FHHL',          emoji: '🏆', count: 1, color: '#F59E0B' },
  ];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #080F1A, #0D0D0D)', border: '1px solid rgba(59,130,246,0.20)' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'rgba(59,130,246,0.15)' }}>📋</div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-none">Universal Projects</p>
            <p className="text-gray-500 text-[9px] mt-0.5">6 projects · 5 systems</p>
          </div>
        </div>
        <span className="text-[8px] px-2 py-1 rounded-full text-blue-400"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>15 tasks</span>
      </div>

      {/* Projects list */}
      <div className="flex-1 px-4 py-2 space-y-1.5 overflow-hidden">
        {PROJECTS.map((p, i) => (
          <div key={i} className="rounded-xl p-2.5 border border-white/5 flex items-center gap-2"
               style={{ background: 'rgba(255,255,255,0.025)' }}>
            <span className="text-[14px] flex-shrink-0">{p.system}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[10px] font-semibold text-white truncate">{p.name}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 ${p.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }}/>
                </div>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{p.progress}%</span>
                <span className="text-[9px] text-gray-500 flex-shrink-0">{p.tasks}t</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System breakdown */}
      <div className="px-4 py-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          {systemBreakdown.map((s, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px] text-gray-400">
              <span>{s.emoji}</span>
              <span style={{ color: s.color }} className="font-semibold">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        {[['6', 'Projects'], ['15', 'Tasks'], ['3', 'On Track']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-blue-400 text-[16px] font-bold leading-none">{v}</p>
            <p className="text-gray-600 text-[9px] mt-0.5 uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsWidget({ size = 'medium', className = '' }) {
  const W = size === 'small' ? SmallWidget : size === 'large' ? LargeWidget : MediumWidget;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className={`inline-block ${className}`}>
      <W />
    </motion.div>
  );
}
export { SmallWidget, MediumWidget, LargeWidget };

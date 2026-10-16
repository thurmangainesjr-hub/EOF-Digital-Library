/**
 * Film Studio Widget — 3 sizes
 * Small 155×155 | Medium 329×155 | Large 329×345
 */
import React from 'react';
import { motion } from 'framer-motion';

const C = '#EF4444'; // red accent

function ProgressRing({ percent = 0, size = 48, stroke = 4 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"/>
    </svg>
  );
}

function SmallWidget() {
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #1A0808, #0D0D0D)', border: '1px solid rgba(239,68,68,0.20)' }}>
      <div className="flex items-center justify-between">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
             style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>🎬</div>
        <span className="text-[9px] font-semibold tracking-widest text-red-400/70 uppercase">Film</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <ProgressRing percent={72} size={52} stroke={5}/>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-red-400">72%</span>
        </div>
        <p className="text-[9px] text-gray-400 text-center leading-tight">Afrofuture Rising</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-500">3 projects</span>
        <span className="text-[9px] text-red-400">52 clips</span>
      </div>
    </div>
  );
}

function MediumWidget() {
  const clips = [
    { name: 'Opening Sequence', dur: '0:45', pct: 100 },
    { name: 'Market District',  dur: '1:12', pct: 80  },
    { name: 'Ancestor Grid',    dur: '2:03', pct: 45  },
  ];
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #1A0808, #0D0D0D)', border: '1px solid rgba(239,68,68,0.20)' }}>
      <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3"
           style={{ background: 'linear-gradient(135deg, #2A0808, #1A0404)' }}>
        <span className="text-3xl">🎬</span>
        <p className="text-[9px] text-red-400/80 font-semibold uppercase tracking-widest text-center">Film Studio</p>
        <div className="text-center">
          <p className="text-white text-[16px] font-bold leading-none">3</p>
          <p className="text-[8px] text-gray-500 mt-0.5">projects</p>
        </div>
      </div>
      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-white/70">Afrofuture Rising</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full text-red-400"
                style={{ background: 'rgba(239,68,68,0.12)' }}>IN PROD</span>
        </div>
        <div className="space-y-1.5">
          {clips.map((c, i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[9px] text-gray-400 truncate pr-2">{c.name}</span>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{c.dur}</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/5">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${c.pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-500">52 clips</span>
          <span className="text-[9px] text-red-400/70">8 suggestions</span>
          <span className="text-[9px] text-gray-500">81% quality</span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget() {
  const tracks = [
    { name: 'Afrofuture Rising', type: 'Feature Film', progress: 72, status: 'In Production', clips: 18 },
    { name: 'New Accra Promo',   type: 'Short Film',   progress: 45, status: 'Editing',       clips: 9  },
    { name: 'Crown Season',      type: 'Music Video',  progress: 90, status: 'Final Review',  clips: 6  },
  ];
  const agents = ['🎬 Director', '📷 Cinematographer', '✂️ Editor'];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #1A0808, #0D0D0D)', border: '1px solid rgba(239,68,68,0.20)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'rgba(239,68,68,0.15)' }}>🎬</div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-none">Film Studio</p>
            <p className="text-gray-500 text-[9px] mt-0.5">3 active productions</p>
          </div>
        </div>
        <span className="text-[8px] font-bold px-2 py-1 rounded-full text-red-400"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>LIVE</span>
      </div>

      {/* Projects */}
      <div className="flex-1 px-4 py-2 space-y-2 overflow-hidden">
        {tracks.map((t, i) => (
          <div key={i} className="rounded-xl p-2.5 border border-white/5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-[11px] font-semibold text-white leading-tight">{t.name}</p>
                <p className="text-[9px] text-gray-500">{t.type} · {t.clips} clips</p>
              </div>
              <span className="text-[8px] text-red-400/80 bg-red-400/10 px-1.5 py-0.5 rounded-full">{t.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${t.progress}%` }}/>
              </div>
              <span className="text-[9px] text-red-400 font-semibold flex-shrink-0">{t.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Agents */}
      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-1.5">AI Crew Active</p>
        <div className="flex gap-2">
          {agents.map((a, i) => (
            <span key={i} className="text-[9px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2 py-0.5">{a}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        {[['52', 'Clips'], ['8', 'Suggestions'], ['81%', 'Quality']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-red-400 text-[16px] font-bold leading-none">{v}</p>
            <p className="text-gray-600 text-[9px] mt-0.5 uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FilmStudioWidget({ size = 'medium', className = '' }) {
  const W = size === 'small' ? SmallWidget : size === 'large' ? LargeWidget : MediumWidget;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className={`inline-block ${className}`}>
      <W />
    </motion.div>
  );
}
export { SmallWidget, MediumWidget, LargeWidget };

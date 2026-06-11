/**
 * Music Studio Widget — 3 sizes
 * Small 155×155 | Medium 329×155 | Large 329×345
 */
import React from 'react';
import { motion } from 'framer-motion';

const C = '#8B5CF6'; // purple accent

function ProgressRing({ percent = 0, size = 48, stroke = 4 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"/>
    </svg>
  );
}

function WaveBar({ h }) {
  return <div className="w-[2px] rounded-full bg-purple-500/70" style={{ height: h }}/>;
}

function SmallWidget() {
  const bars = [3,5,8,6,10,7,4,9,6,8,5,3,7,6,9,4,8,5];
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #130A1F, #0D0D0D)', border: '1px solid rgba(139,92,246,0.20)' }}>
      <div className="flex items-center justify-between">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
             style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>🎵</div>
        <span className="text-[9px] font-semibold tracking-widest text-purple-400/70 uppercase">Music</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-end gap-[2px] h-8">
          {bars.map((h, i) => <WaveBar key={i} h={h * 2}/>)}
        </div>
        <p className="text-[9px] text-gray-400 text-center leading-tight">Crown Season</p>
        <p className="text-[9px] text-purple-400">94 BPM · D min</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-500">3 projects</span>
        <span className="text-[9px] text-purple-400">9 tracks</span>
      </div>
    </div>
  );
}

function MediumWidget() {
  const tracks = [
    { name: 'Lead Vocals', vol: 88 },
    { name: 'Beat',        vol: 75 },
    { name: 'Bass Line',   vol: 65 },
    { name: 'Keys',        vol: 55 },
  ];
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #130A1F, #0D0D0D)', border: '1px solid rgba(139,92,246,0.20)' }}>
      <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-3"
           style={{ background: 'linear-gradient(135deg, #1F0A2F, #130A1F)' }}>
        <span className="text-3xl">🎵</span>
        <p className="text-[9px] text-purple-400/80 font-semibold uppercase tracking-widest text-center">Music Studio</p>
        <div className="text-center">
          <p className="text-white text-[13px] font-bold leading-none">94 BPM</p>
          <p className="text-[8px] text-gray-500 mt-0.5">D minor · 4/4</p>
        </div>
      </div>
      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-white/70">Crown Season EP</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full text-purple-400"
                style={{ background: 'rgba(139,92,246,0.12)' }}>● REC</span>
        </div>
        <div className="space-y-1.5">
          {tracks.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[9px] text-gray-400 w-20 truncate">{t.name}</span>
              <div className="flex-1 h-[3px] rounded-full bg-white/5">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${t.vol}%` }}/>
              </div>
              <span className="text-[9px] text-gray-600 w-7 text-right">{t.vol}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-500">9 tracks</span>
          <span className="text-[9px] text-purple-400/70">9 suggestions</span>
          <span className="text-[9px] text-gray-500">74% quality</span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget() {
  const projects = [
    { name: 'Crown Season EP',        type: 'EP',           progress: 74, status: 'Recording',    tracks: 6,  bpm: 94, key: 'D min' },
    { name: 'Afrofuture Anthems',     type: 'Album',        progress: 38, status: 'Pre-Prod',     tracks: 3,  bpm: 88, key: 'G maj' },
    { name: 'Rise of the Griot',      type: 'Single',       progress: 95, status: 'Mixing',       tracks: 4,  bpm: 102, key: 'A min' },
  ];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #130A1F, #0D0D0D)', border: '1px solid rgba(139,92,246,0.20)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'rgba(139,92,246,0.15)' }}>🎵</div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-none">Music Studio</p>
            <p className="text-gray-500 text-[9px] mt-0.5">3 active sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-[8px] font-bold text-red-400">REC</span>
        </div>
      </div>

      {/* Projects */}
      <div className="flex-1 px-4 py-2 space-y-2 overflow-hidden">
        {projects.map((p, i) => (
          <div key={i} className="rounded-xl p-2.5 border border-white/5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-[11px] font-semibold text-white leading-tight">{p.name}</p>
                <p className="text-[9px] text-gray-500">{p.type} · {p.bpm} BPM · {p.key} · {p.tracks} tracks</p>
              </div>
              <span className="text-[8px] text-purple-400/80 bg-purple-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">{p.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-400" style={{ width: `${p.progress}%` }}/>
              </div>
              <span className="text-[9px] text-purple-400 font-semibold">{p.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini waveform */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1">
        {Array.from({length: 50}, (_, i) => (
          <div key={i} className="w-[3px] rounded-full bg-purple-500/40" style={{ height: `${4 + Math.sin(i * 0.4) * 6 + Math.random() * 4}px` }}/>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        {[['9', 'Tracks'], ['9', 'Suggestions'], ['74%', 'Quality']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-purple-400 text-[16px] font-bold leading-none">{v}</p>
            <p className="text-gray-600 text-[9px] mt-0.5 uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MusicStudioWidget({ size = 'medium', className = '' }) {
  const W = size === 'small' ? SmallWidget : size === 'large' ? LargeWidget : MediumWidget;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className={`inline-block ${className}`}>
      <W />
    </motion.div>
  );
}
export { SmallWidget, MediumWidget, LargeWidget };

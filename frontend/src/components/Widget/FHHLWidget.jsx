/**
 * FHHL Widget — 3 sizes
 * Small 155×155 | Medium 329×155 | Large 329×345
 */
import React from 'react';
import { motion } from 'framer-motion';

const C = '#F59E0B'; // amber accent

const STANDINGS = [
  { rank: 1, team: 'Griot Nation',   owner: 'Thurman G.', pts: 2847, wins: 10, losses: 3, artist: 'Kendrick', streak: 3 },
  { rank: 2, team: 'Lyric Empire',   owner: 'Zara M.',    pts: 2731, wins: 9,  losses: 4, artist: 'J. Cole',  streak: 1 },
  { rank: 3, team: 'Crown Council',  owner: 'Marcus O.',  pts: 2689, wins: 9,  losses: 4, artist: 'Nas',      streak: -1 },
  { rank: 4, team: 'Thread Boyz',    owner: 'Seun A.',    pts: 2540, wins: 8,  losses: 5, artist: 'Jay-Z',    streak: 2 },
  { rank: 5, team: 'Ancestor Vibes', owner: 'Elder K.',   pts: 2388, wins: 7,  losses: 6, artist: 'Lauryn',   streak: -2 },
];

function SmallWidget() {
  const top = STANDINGS[0];
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #1A1108, #0D0D0D)', border: '1px solid rgba(245,158,11,0.20)' }}>
      <div className="flex items-center justify-between">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
             style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>🏆</div>
        <span className="text-[8px] font-semibold tracking-widest text-amber-400/70 uppercase">🔴 LIVE</span>
      </div>
      <div className="text-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg mx-auto mb-1"
             style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>G</div>
        <p className="text-white text-[11px] font-bold leading-tight">{top.team}</p>
        <p className="text-amber-400 text-[13px] font-bold">{top.pts.toLocaleString()}</p>
        <p className="text-[9px] text-gray-500">pts · {top.artist}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-500">Wk 14 / 22</span>
        <span className="text-[9px] text-green-400">🔥 {top.wins}W</span>
      </div>
    </div>
  );
}

function MediumWidget() {
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #1A1108, #0D0D0D)', border: '1px solid rgba(245,158,11,0.20)' }}>
      <div className="w-[90px] flex-shrink-0 flex flex-col items-center justify-center gap-1 p-3"
           style={{ background: 'linear-gradient(135deg, #2A1A08, #1A1108)' }}>
        <span className="text-2xl">🏆</span>
        <p className="text-[8px] text-amber-400/80 font-semibold uppercase tracking-widest text-center">FHHL</p>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-[8px] text-red-400 font-bold">LIVE</span>
        </div>
        <p className="text-[8px] text-gray-600 text-center">Season 1 · Wk 14</p>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-white/70">Standings</span>
          <span className="text-[9px] text-amber-400">Top 5</span>
        </div>
        <div className="space-y-1">
          {STANDINGS.slice(0, 4).map((t) => (
            <div key={t.rank} className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-amber-400 w-4 flex-shrink-0">#{t.rank}</span>
              <span className="text-[9px] text-white flex-1 truncate font-medium">{t.team}</span>
              <span className="text-[9px] text-gray-500 flex-shrink-0">{t.pts.toLocaleString()}</span>
              <span className={`text-[9px] flex-shrink-0 ${t.streak > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {t.streak > 0 ? `↑${t.streak}` : `↓${Math.abs(t.streak)}`}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[9px] text-gray-600">
          <span>8 teams</span>
          <span>·</span>
          <span>Week 14/22</span>
          <span>·</span>
          <span className="text-amber-400">Draft Open</span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget() {
  const battles = [
    { home: 'Griot Nation', away: 'Lyric Empire',   homeScore: 284, awayScore: 271, live: true  },
    { home: 'Crown Council', away: 'Thread Boyz',   homeScore: 193, awayScore: 210, live: true  },
    { home: 'Ancestor Vibes', away: 'The Cyphers',  homeScore: 188, awayScore: 175, live: false },
    { home: 'Bars & Bonds', away: 'Fire & Finesse', homeScore: 220, awayScore: 215, live: false },
  ];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #1A1108, #0D0D0D)', border: '1px solid rgba(245,158,11,0.20)' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'rgba(245,158,11,0.15)' }}>🏆</div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-none">FHHL League</p>
            <p className="text-gray-500 text-[9px] mt-0.5">Season 1 · Week 14 of 22</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/15 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-[8px] font-bold text-red-400">LIVE</span>
        </div>
      </div>

      {/* Top 3 standings */}
      <div className="px-4 py-2 border-b border-white/5">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-1.5">Standings</p>
        <div className="space-y-1">
          {STANDINGS.slice(0, 3).map((t) => (
            <div key={t.rank} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 w-4">{t.rank === 1 ? '🥇' : t.rank === 2 ? '🥈' : '🥉'}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                   style={{ background: t.rank === 1 ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'rgba(255,255,255,0.08)' }}>
                {t.team[0]}
              </div>
              <span className="text-[10px] text-white flex-1 font-medium truncate">{t.team}</span>
              <span className="text-[9px] text-gray-500">{t.artist}</span>
              <span className="text-[10px] text-amber-400 font-bold">{t.pts.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live battles */}
      <div className="flex-1 px-4 py-2 space-y-1.5 overflow-hidden">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-1">Week 14 Battles</p>
        {battles.map((b, i) => (
          <div key={i} className="rounded-xl px-3 py-2 border border-white/5 flex items-center gap-2"
               style={{ background: 'rgba(255,255,255,0.025)' }}>
            <span className="text-[9px] text-white font-medium flex-1 truncate">{b.home}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-white">{b.homeScore}</span>
              <span className="text-[8px] text-gray-600">vs</span>
              <span className="text-[10px] font-bold text-white">{b.awayScore}</span>
            </div>
            <span className="text-[9px] text-white font-medium flex-1 truncate text-right">{b.away}</span>
            {b.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1"/>}
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        {[['8', 'Teams'], ['14', 'Battles'], ['1st', 'Griot Ntn']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-amber-400 text-[16px] font-bold leading-none">{v}</p>
            <p className="text-gray-600 text-[9px] mt-0.5 uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FHHLWidget({ size = 'medium', className = '' }) {
  const W = size === 'small' ? SmallWidget : size === 'large' ? LargeWidget : MediumWidget;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className={`inline-block ${className}`}>
      <W />
    </motion.div>
  );
}
export { SmallWidget, MediumWidget, LargeWidget };

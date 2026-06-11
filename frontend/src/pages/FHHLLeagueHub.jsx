import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight, FiTrendingUp, FiStar, FiUsers, FiMusic,
  FiAward, FiBarChart2, FiZap, FiFilter, FiSearch,
  FiArrowUp, FiArrowDown, FiMinus,
} from 'react-icons/fi';

// ── Data ──────────────────────────────────────────────────────────────────────

const SEASON = { name:'Season 1 · Spring 2057', week:14, totalWeeks:22, status:'Live' };

const STANDINGS = [
  {
    rank:1, prev:1, teamName:'Griot Nation',       owner:'Thurman G.',  pts:1842, wins:10, losses:3, ties:1,
    artist:'Kendrick Lamar', artistPts:284, streak:'W4', color:'#8B5CF6',
  },
  {
    rank:2, prev:3, teamName:'Crown Cypher',        owner:'Marcus W.',   pts:1724, wins:9,  losses:4, ties:1,
    artist:'J. Cole',         artistPts:261, streak:'W2', color:'#D4AF37',
  },
  {
    rank:3, prev:2, teamName:'Afrofuture FC',       owner:'Zara M.',     pts:1698, wins:9,  losses:5, ties:0,
    artist:'Lauryn Hill',     artistPts:253, streak:'L1', color:'#EC4899',
  },
  {
    rank:4, prev:4, teamName:'Legacy Grid',         owner:'Kweku A.',    pts:1612, wins:8,  losses:5, ties:1,
    artist:'Jay-Z',           artistPts:247, streak:'W1', color:'#3B82F6',
  },
  {
    rank:5, prev:6, teamName:'Sankofa Squad',       owner:'Amara D.',    pts:1589, wins:8,  losses:6, ties:0,
    artist:'Nas',             artistPts:239, streak:'W2', color:'#10B981',
  },
  {
    rank:6, prev:5, teamName:'Thread Runners',      owner:'Seun O.',     pts:1543, wins:7,  losses:6, ties:1,
    artist:'Andre 3000',      artistPts:231, streak:'L2', color:'#F97316',
  },
  {
    rank:7, prev:7, teamName:'Ancestor Walk',       owner:'Nia B.',      pts:1501, wins:7,  losses:7, ties:0,
    artist:'Missy Elliott',   artistPts:228, streak:'W1', color:'#60A5FA',
  },
  {
    rank:8, prev:8, teamName:'Archive Breakers',    owner:'Kofi S.',     pts:1447, wins:6,  losses:7, ties:1,
    artist:'Lil Wayne',       artistPts:219, streak:'L1', color:'#EF4444',
  },
];

const WEEKLY_BATTLES = [
  { id:'b1', teamA:'Griot Nation',   teamB:'Crown Cypher',  ptsA:138, ptsB:121, winner:'A', status:'Final',   week:14 },
  { id:'b2', teamA:'Afrofuture FC',  teamB:'Legacy Grid',   ptsA:119, ptsB:134, winner:'B', status:'Final',   week:14 },
  { id:'b3', teamA:'Sankofa Squad',  teamB:'Thread Runners',ptsA:143, ptsB:127, winner:'A', status:'Final',   week:14 },
  { id:'b4', teamA:'Ancestor Walk',  teamB:'Archive Breakers',ptsA:108,ptsB:99, winner:'A', status:'Final',   week:14 },
];

const TOP_ARTISTS = [
  { rank:1, name:'Kendrick Lamar', pts:284, change:'+12', team:'Griot Nation',    genre:'West Coast Hip-Hop', img:'🎤', hot:true  },
  { rank:2, name:'J. Cole',        pts:261, change:'+8',  team:'Crown Cypher',    genre:'Conscious Rap',      img:'🎤', hot:false },
  { rank:3, name:'Lauryn Hill',    pts:253, change:'+15', team:'Afrofuture FC',   genre:'Neo Soul / Hip-Hop', img:'🎤', hot:true  },
  { rank:4, name:'Jay-Z',          pts:247, change:'-3',  team:'Legacy Grid',     genre:'East Coast Hip-Hop', img:'🎤', hot:false },
  { rank:5, name:'Nas',            pts:239, change:'+6',  team:'Sankofa Squad',   genre:'Lyrical Hip-Hop',    img:'🎤', hot:false },
  { rank:6, name:'Andre 3000',     pts:231, change:'-1',  team:'Thread Runners',  genre:'ATL / Avant-Garde',  img:'🎤', hot:false },
  { rank:7, name:'Missy Elliott',  pts:228, change:'+19', team:'Ancestor Walk',   genre:'Hip-Hop / R&B',      img:'🎤', hot:true  },
  { rank:8, name:'Lil Wayne',      pts:219, change:'+4',  team:'Archive Breakers',genre:'New Orleans Rap',    img:'🎤', hot:false },
];

const LEAGUE_STATS = [
  { label:'Total Teams',     value:'8',    color:'#8B5CF6', emoji:'🏆' },
  { label:'Season Week',     value:'14/22',color:'#F97316', emoji:'📅' },
  { label:'Active Battles',  value:'4',    color:'#EF4444', emoji:'⚔️'  },
  { label:'Fan Votes Cast',  value:'24.8K',color:'#D4AF37', emoji:'🗳️'  },
];

const FAN_VOTE_ITEMS = [
  { id:'v1', question:'MVP of Week 14',           options:['Kendrick Lamar','Missy Elliott','Sankofa Squad'],  votes:[1240,890,654], ends:'2h' },
  { id:'v2', question:'Best Battle Performance',  options:['Griot Nation vs Crown','Sankofa vs Threads'],      votes:[1832,1104],    ends:'2h' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function RankChange({ curr, prev }) {
  const diff = prev - curr;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-[9px] text-green-400 font-bold"><FiArrowUp size={8} />{diff}</span>;
  if (diff < 0) return <span className="flex items-center gap-0.5 text-[9px] text-red-400 font-bold"><FiArrowDown size={8} />{Math.abs(diff)}</span>;
  return <FiMinus size={9} className="text-gray-700" />;
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function FHHLLeagueHub() {
  const [activeTab, setActiveTab] = useState('standings');
  const [votedItems, setVotedItems] = useState({});

  function castVote(voteId, optionIdx) {
    setVotedItems(p => ({ ...p, [voteId]: optionIdx }));
  }

  const tabs = [
    { id:'standings', label:'Standings'  },
    { id:'battles',   label:'Battles'    },
    { id:'artists',   label:'Top Artists'},
    { id:'vote',      label:'Fan Voting' },
  ];

  return (
    <div className="min-h-screen" style={{ background:'#0a0a0a', color:'#fff', fontFamily:'system-ui, sans-serif' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-10 border-b"
        style={{ borderColor:'rgba(255,255,255,0.07)', background:'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(10,10,10,0) 60%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse 60% 50% at 15% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)' }}>
              🏆
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.3)' }}>
                  Fantasy Hip-Hop League
                </span>
                <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 font-bold animate-pulse">
                  🔴 LIVE
                </span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">
                EOF Fantasy<br /><span style={{ color:'#F59E0B' }}>Hip-Hop League</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">{SEASON.name} · Week {SEASON.week} of {SEASON.totalWeeks}</p>
            </div>
            <Link to="/fhhl/draft"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:brightness-110 flex-shrink-0"
              style={{ background:'rgba(245,158,11,0.15)', borderColor:'rgba(245,158,11,0.35)', color:'#F59E0B' }}>
              🎯 Draft Hub <FiChevronRight size={12} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {LEAGUE_STATS.map(s => (
              <div key={s.label} className="rounded-xl border px-4 py-3"
                style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}>
                <p className="text-xl font-black" style={{ color:s.color }}>{s.value}</p>
                <p className="text-[9px] text-gray-600">{s.emoji} {s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation tabs ────────────────────────────────────────────── */}
      <div className="border-b px-6 sticky top-0 z-20"
        style={{ background:'rgba(10,10,10,0.95)', backdropFilter:'blur(12px)', borderColor:'rgba(255,255,255,0.07)' }}>
        <div className="flex max-w-5xl mx-auto">
          {tabs.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="px-5 py-3.5 text-xs font-semibold border-b-2 transition-all"
              style={activeTab===t.id
                ? { color:'#F59E0B', borderBottomColor:'#F59E0B' }
                : { color:'#6B7280', borderBottomColor:'transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.18 }}>

            {/* ── STANDINGS ─────────────────────────────────────────────── */}
            {activeTab==='standings' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">League Standings</h2>
                  <span className="text-[10px] text-gray-600">Week {SEASON.week} · {STANDINGS.length} teams</span>
                </div>
                <div className="rounded-2xl border overflow-hidden"
                  style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b text-[9px] font-bold tracking-widest uppercase text-gray-700"
                    style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Team</div>
                    <div className="col-span-3 hidden sm:block">Top Artist</div>
                    <div className="col-span-1 text-center">W</div>
                    <div className="col-span-1 text-center">L</div>
                    <div className="col-span-1 text-center hidden sm:block">T</div>
                    <div className="col-span-1 text-center">Pts</div>
                    <div className="col-span-1 text-center">Streak</div>
                  </div>
                  {/* Rows */}
                  {STANDINGS.map((team, i) => (
                    <motion.div
                      key={team.rank}
                      initial={{ opacity:0, x:-8 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b transition-all hover:bg-white/2 cursor-pointer"
                      style={{ borderColor:'rgba(255,255,255,0.05)', background: i===0 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <div className="col-span-1 flex items-center gap-1.5">
                        <span className="text-sm font-black" style={{ color: i<3 ? '#F59E0B' : '#6B7280' }}>
                          {i<3 ? ['🥇','🥈','🥉'][i] : team.rank}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:team.color }} />
                          <div>
                            <p className="text-xs font-bold text-white truncate">{team.teamName}</p>
                            <p className="text-[9px] text-gray-700 truncate">{team.owner}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 hidden sm:block">
                        <p className="text-[10px] font-semibold text-gray-300 truncate">{team.artist}</p>
                        <p className="text-[9px] text-gray-700">{team.artistPts} pts</p>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-xs font-bold text-green-400">{team.wins}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-xs font-bold text-red-400">{team.losses}</span>
                      </div>
                      <div className="col-span-1 text-center hidden sm:block">
                        <span className="text-xs text-gray-600">{team.ties}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-xs font-black" style={{ color:team.color }}>{team.pts}</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className={`text-[10px] font-bold ${team.streak.startsWith('W') ? 'text-green-400' : 'text-red-400'}`}>
                          {team.streak}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── BATTLES ───────────────────────────────────────────────── */}
            {activeTab==='battles' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">Week {SEASON.week} Battles</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {WEEKLY_BATTLES.map((battle, i) => {
                    const teamA = STANDINGS.find(t=>t.teamName===battle.teamA);
                    const teamB = STANDINGS.find(t=>t.teamName===battle.teamB);
                    return (
                      <motion.div key={battle.id}
                        initial={{ opacity:0, y:8 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ delay:i*0.07 }}
                        className="rounded-2xl border p-5"
                        style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Battle #{i+1}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                            {battle.status}
                          </span>
                        </div>

                        {/* Team A */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background:teamA?.color||'#666' }} />
                            <span className={`text-sm font-black ${battle.winner==='A' ? 'text-white' : 'text-gray-500'}`}>{battle.teamA}</span>
                            {battle.winner==='A' && <span className="text-[9px] text-amber-400 font-bold">👑 W</span>}
                          </div>
                          <span className={`text-xl font-black ${battle.winner==='A' ? 'text-white' : 'text-gray-600'}`}>{battle.ptsA}</span>
                        </div>

                        {/* vs divider */}
                        <div className="flex items-center gap-2 my-2">
                          <div className="flex-1 h-px bg-white/6" />
                          <span className="text-[9px] font-black text-gray-700">VS</span>
                          <div className="flex-1 h-px bg-white/6" />
                        </div>

                        {/* Team B */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background:teamB?.color||'#666' }} />
                            <span className={`text-sm font-black ${battle.winner==='B' ? 'text-white' : 'text-gray-500'}`}>{battle.teamB}</span>
                            {battle.winner==='B' && <span className="text-[9px] text-amber-400 font-bold">👑 W</span>}
                          </div>
                          <span className={`text-xl font-black ${battle.winner==='B' ? 'text-white' : 'text-gray-600'}`}>{battle.ptsB}</span>
                        </div>

                        <div className="mt-3 pt-3 border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                          <p className="text-[9px] text-gray-700">Margin: {Math.abs(battle.ptsA - battle.ptsB)} pts · Week {battle.week}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TOP ARTISTS ───────────────────────────────────────────── */}
            {activeTab==='artists' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">Top Artists — Week {SEASON.week}</h2>
                  <Link to="/fhhl/draft"
                    className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center gap-1">
                    View All in Draft <FiChevronRight size={10} />
                  </Link>
                </div>
                <div className="rounded-2xl border overflow-hidden"
                  style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                  <div className="grid grid-cols-12 px-4 py-2 border-b text-[9px] font-bold tracking-widest uppercase text-gray-700"
                    style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Artist</div>
                    <div className="col-span-3 hidden sm:block">Genre</div>
                    <div className="col-span-2 hidden sm:block">Team</div>
                    <div className="col-span-2 text-center">Pts</div>
                    <div className="col-span-1 text-center">Δ</div>
                  </div>
                  {TOP_ARTISTS.map((artist, i) => {
                    const team = STANDINGS.find(t=>t.teamName===artist.team);
                    const isUp = artist.change.startsWith('+');
                    return (
                      <motion.div key={artist.rank}
                        initial={{ opacity:0, x:-8 }}
                        animate={{ opacity:1, x:0 }}
                        transition={{ delay:i*0.04 }}
                        className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b transition-all hover:bg-white/2 cursor-pointer"
                        style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                        <div className="col-span-1">
                          <span className="text-sm font-black" style={{ color: i<3 ? '#F59E0B' : '#6B7280' }}>
                            {i<3 ? ['🥇','🥈','🥉'][i] : artist.rank}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <span className="text-lg">{artist.img}</span>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              {artist.name}
                              {artist.hot && <span className="text-[8px] text-orange-400">🔥</span>}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 hidden sm:block">
                          <p className="text-[10px] text-gray-500 truncate">{artist.genre}</p>
                        </div>
                        <div className="col-span-2 hidden sm:flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:team?.color||'#666' }} />
                          <p className="text-[10px] text-gray-500 truncate">{artist.team}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-black text-amber-400">{artist.pts}</span>
                        </div>
                        <div className="col-span-1 text-center">
                          <span className={`text-[10px] font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                            {artist.change}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── FAN VOTING ────────────────────────────────────────────── */}
            {activeTab==='vote' && (
              <div className="max-w-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">Fan Voting</h2>
                  <span className="text-[10px] text-gray-600">Week {SEASON.week} polls</span>
                </div>
                <div className="space-y-4">
                  {FAN_VOTE_ITEMS.map(vote => {
                    const hasVoted = votedItems[vote.id] !== undefined;
                    const totalVotes = vote.votes.reduce((s,v)=>s+v, 0);
                    return (
                      <motion.div key={vote.id}
                        initial={{ opacity:0, y:8 }}
                        animate={{ opacity:1, y:0 }}
                        className="rounded-2xl border p-5"
                        style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-black text-white">{vote.question}</p>
                          <span className="text-[9px] text-amber-400 font-bold">Ends in {vote.ends}</span>
                        </div>
                        <div className="space-y-2">
                          {vote.options.map((opt, oi) => {
                            const voteCount = vote.votes[oi];
                            const pct = Math.round((voteCount / totalVotes) * 100);
                            const isMyVote = votedItems[vote.id] === oi;
                            return (
                              <button
                                key={oi}
                                onClick={() => !hasVoted && castVote(vote.id, oi)}
                                disabled={hasVoted && !isMyVote}
                                className="w-full text-left rounded-xl border p-3 transition-all hover:brightness-110 disabled:opacity-40"
                                style={{
                                  background: isMyVote ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                                  borderColor: isMyVote ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)',
                                  cursor: hasVoted ? 'default' : 'pointer',
                                }}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-white">{opt}</span>
                                  {hasVoted && (
                                    <span className="text-xs font-black" style={{ color: isMyVote ? '#F59E0B' : '#6B7280' }}>
                                      {pct}%
                                    </span>
                                  )}
                                </div>
                                {hasVoted && (
                                  <div className="h-1.5 rounded-full bg-white/6">
                                    <motion.div
                                      initial={{ width:0 }}
                                      animate={{ width:`${pct}%` }}
                                      transition={{ duration:0.5 }}
                                      className="h-full rounded-full"
                                      style={{ background: isMyVote ? '#F59E0B' : '#374151' }} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-gray-700 mt-2">{totalVotes.toLocaleString()} votes cast</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiPlus, FiBook, FiUsers,
  FiGlobe, FiClock, FiLayout, FiEdit3, FiFilm, FiImage,
  FiAlignLeft, FiZap, FiStar, FiGrid, FiCheck,
  FiArrowRight, FiLayers, FiBookOpen,
} from 'react-icons/fi';

// ── Mock story data ───────────────────────────────────────────────────────────
const ACTIVE_PROJECT = {
  title: 'Afrofuture Rising',
  type: 'Series',
  status: 'In Production',
  episodes: 8,
  completedEpisodes: 1,
  logline: 'In 2057, a revolutionary architect must unlock his ancestral memory to stop a government from erasing the last traces of African cultural history from the digital record.',
  genre: ['Afrofuturist','Sci-Fi','Drama'],
  progress: {
    characters: 6,   charactersDone: 4,
    worldBuilding: 12, worldBuildingDone: 7,
    plotPoints: 24,  plotPointsDone: 14,
    scenes: 40,      scenesDone: 18,
  },
};

const TOOLS = [
  {
    id: 'story-dashboard', emoji: '📊', label: 'Story Dashboard',
    desc: 'Project overview, progress tracking, agent activity',
    color: '#8B5CF6', status: 'ready', path: '#',
  },
  {
    id: 'characters', emoji: '👤', label: 'Characters',
    desc: 'Character profiles, arcs, relationships, backstory',
    color: '#EC4899', status: 'ready', path: '#',
    stat: '6 characters · 4 confirmed',
  },
  {
    id: 'world-building', emoji: '🌍', label: 'World Building',
    desc: 'Settings, rules, geography, history, culture',
    color: '#3B82F6', status: 'ready', path: '#',
    stat: '12 entries · 3 in draft',
  },
  {
    id: 'lore', emoji: '📖', label: 'Lore',
    desc: 'Mythology, history, factions, belief systems',
    color: '#D4AF37', status: 'ready', path: '#',
    stat: '7 lore entries',
  },
  {
    id: 'timeline', emoji: '📅', label: 'Timeline',
    desc: 'Story chronology, event ordering, time jumps',
    color: '#10B981', status: 'ready', path: '#',
    stat: '5 key events · 2057 present',
  },
  {
    id: 'plot-builder', emoji: '🗺️', label: 'Plot Builder',
    desc: 'Story structure, act breaks, plot threads',
    color: '#F97316', status: 'ready', path: '#',
    stat: '24 plot points · 14 locked',
  },
  {
    id: 'scene-builder', emoji: '🎬', label: 'Scene Builder',
    desc: 'Scene breakdown, beat sheets, dialogue drafts',
    color: '#A78BFA', status: 'ready', path: '#',
    stat: '40 scenes · 18 complete',
  },
  {
    id: 'book-writer', emoji: '📚', label: 'Book Writer',
    desc: 'Long-form prose, chapters, manuscript view',
    color: '#60A5FA', status: 'ready', path: '#',
  },
  {
    id: 'comic-writer', emoji: '🖼️', label: 'Comic Writer',
    desc: 'Panel layouts, captions, speech bubbles, page flow',
    color: '#F59E0B', status: 'ready', path: '#',
  },
  {
    id: 'script-writer', emoji: '🎭', label: 'Script Writer',
    desc: 'Screenplay format, TV pilots, stage plays',
    color: '#EF4444', status: 'ready', path: '#',
    stat: 'Ep. 1 complete · Ep. 2 in progress',
  },
  {
    id: 'canon-integration', emoji: '📜', label: 'Canon Integration',
    desc: 'Sync with Canon Keeper, resolve conflicts, lock entries',
    color: '#8B5CF6', status: 'ready', path: '/griot/canon-keeper',
    stat: '2 conflicts to resolve',
    alert: true,
  },
];

const RECENT_ACTIVITY = [
  { time:'2h ago',  agent:'The Director',   action:'Suggested moving Market Scene to Act 1 opener', type:'suggestion', color:'#EF4444' },
  { time:'3h ago',  agent:'You',            action:'Locked Marcus Osei character profile in Canon Keeper', type:'canon', color:'#8B5CF6' },
  { time:'5h ago',  agent:'Story Architect',action:'Detected plot hole in Ep.1 Scene 10 — CARB motivation unclear', type:'alert', color:'#F59E0B' },
  { time:'1d ago',  agent:'The Lyricist',   action:'Rewrote Elder Kweku opening monologue — 2 versions generated', type:'draft', color:'#A78BFA' },
  { time:'1d ago',  agent:'You',            action:'Added The Ancestor Walk to Magic Systems — marked as disputed', type:'canon', color:'#8B5CF6' },
  { time:'2d ago',  agent:'Research Agent', action:'Added 14 historical references to The Great Erasure lore entry', type:'research', color:'#10B981' },
];

const PLOT_THREADS = [
  { id:'pt1', name:'The Thread Awakening',   color:'#8B5CF6', acts:[1,2,3], progress:60, status:'active' },
  { id:'pt2', name:'CARB\'s Second Erasure', color:'#EF4444', acts:[1,2,3], progress:40, status:'active' },
  { id:'pt3', name:'Zara\'s Hidden AI',      color:'#EC4899', acts:[2,3],   progress:15, status:'planted' },
  { id:'pt4', name:'The Griot Council',      color:'#D4AF37', acts:[3],     progress:5,  status:'seeded'  },
];

const STRUCTURE = [
  { act:'Act 1', scenes:12, complete:10, label:'Setup',      color:'#3B82F6' },
  { act:'Act 2A', scenes:10, complete:6, label:'Conflict',   color:'#8B5CF6' },
  { act:'Act 2B', scenes:10, complete:2, label:'Escalation', color:'#F97316' },
  { act:'Act 3',  scenes:8,  complete:0, label:'Resolution', color:'#EF4444' },
];

// ── Compact tool card ─────────────────────────────────────────────────────────
function ToolCard({ tool, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}>
      <Link to={tool.path}
        className="flex flex-col gap-2 p-4 rounded-2xl border transition-all hover:brightness-110 hover:scale-[1.01] group h-full"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: tool.alert ? `${tool.color}45` : 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${tool.color}18` }}>
            {tool.emoji}
          </div>
          {tool.alert && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
              ⚠ Needs attention
            </span>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-white">{tool.label}</p>
          <p className="text-[10px] text-gray-600 leading-snug mt-0.5">{tool.desc}</p>
          {tool.stat && (
            <p className="text-[9px] mt-1.5 font-medium" style={{ color: tool.color }}>{tool.stat}</p>
          )}
        </div>
        <div className="mt-auto flex items-center justify-end">
          <FiArrowRight size={11} className="text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function StoryArchitectHub() {
  const [activeView, setActiveView] = useState('dashboard');

  const p = ACTIVE_PROJECT.progress;
  const overallProgress = Math.round(
    ((p.charactersDone + p.worldBuildingDone + p.plotPointsDone + p.scenesDone) /
     (p.characters + p.worldBuilding + p.plotPoints + p.scenes)) * 100
  );

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 border-b sticky top-0 z-20"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link to="/griot" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0">
          <FiChevronLeft size={14} />
          <span className="text-xs font-bold hidden sm:block">Griot AI</span>
        </Link>
        <div className="w-px h-5 bg-white/10" />
        <span className="text-sm font-bold text-white flex-shrink-0">🗺️ Story Architect</span>
        <span className="text-[10px] text-gray-600 hidden md:block">— {ACTIVE_PROJECT.title}</span>

        {/* View tabs */}
        <div className="flex items-center gap-0 ml-4">
          {[{ id:'dashboard', label:'Dashboard' }, { id:'tools', label:'All Tools' }, { id:'structure', label:'Structure' }].map(v => (
            <button key={v.id}
              onClick={() => setActiveView(v.id)}
              className="px-3 py-1 text-xs font-semibold transition-all"
              style={activeView === v.id
                ? { color: '#8B5CF6', borderBottom: '2px solid #8B5CF6' }
                : { color: '#6B7280', borderBottom: '2px solid transparent' }}>
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:brightness-110 transition-all flex-shrink-0">
          <FiPlus size={11} /> New Project
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── DASHBOARD VIEW ────────────────────────────────────────────── */}
        {activeView === 'dashboard' && (
          <>
            {/* Project hero */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              className="rounded-2xl border p-6"
              style={{ background:'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(10,10,10,0))', borderColor:'rgba(139,92,246,0.3)' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background:'rgba(139,92,246,0.15)' }}>🌌</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-xl font-black text-white">{ACTIVE_PROJECT.title}</h1>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                      {ACTIVE_PROJECT.status}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(139,92,246,0.15)', color:'#A78BFA', border:'1px solid rgba(139,92,246,0.25)' }}>
                      {ACTIVE_PROJECT.type} · {ACTIVE_PROJECT.episodes} Episodes
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3 max-w-2xl">{ACTIVE_PROJECT.logline}</p>
                  <div className="flex items-center gap-2">
                    {ACTIVE_PROJECT.genre.map(g => (
                      <span key={g} className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:'rgba(139,92,246,0.1)', color:'#C4B5FD', border:'1px solid rgba(139,92,246,0.2)' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-black" style={{ color:'#8B5CF6' }}>{overallProgress}%</p>
                  <p className="text-[9px] text-gray-600">Overall Progress</p>
                </div>
              </div>
            </motion.div>

            {/* Progress cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Characters',   done:p.charactersDone,   total:p.characters,    color:'#EC4899', emoji:'👤' },
                { label:'World Entries',done:p.worldBuildingDone,total:p.worldBuilding,  color:'#3B82F6', emoji:'🌍' },
                { label:'Plot Points',  done:p.plotPointsDone,   total:p.plotPoints,     color:'#F97316', emoji:'🗺️' },
                { label:'Scenes',       done:p.scenesDone,       total:p.scenes,         color:'#A78BFA', emoji:'🎬' },
              ].map(stat => {
                const pct = Math.round((stat.done / stat.total) * 100);
                return (
                  <motion.div key={stat.label}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="rounded-xl border p-4"
                    style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{stat.emoji}</span>
                      <span className="text-xs font-black" style={{ color:stat.color }}>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/6 mb-2">
                      <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:stat.color }} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">{stat.label}</p>
                    <p className="text-[9px] text-gray-700">{stat.done}/{stat.total} complete</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Plot threads + recent activity */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Plot threads */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Active Plot Threads</p>
                <div className="space-y-2.5">
                  {PLOT_THREADS.map(pt => (
                    <div key={pt.id} className="rounded-xl border px-4 py-3"
                      style={{ background:'rgba(255,255,255,0.02)', borderColor:`${pt.color}20` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{pt.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize"
                          style={{ background:`${pt.color}15`, color:pt.color }}>
                          {pt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-white/6">
                          <div className="h-full rounded-full" style={{ width:`${pt.progress}%`, background:pt.color }} />
                        </div>
                        <span className="text-[9px] font-mono text-gray-600">{pt.progress}%</span>
                        <div className="flex gap-0.5">
                          {[1,2,3].map(act => (
                            <div key={act}
                              className="w-4 h-1.5 rounded-sm"
                              style={{ background: pt.acts.includes(act) ? pt.color : 'rgba(255,255,255,0.08)' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Recent Activity</p>
                <div className="space-y-1.5">
                  {RECENT_ACTIVITY.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b last:border-0"
                      style={{ borderColor:'rgba(255,255,255,0.05)' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: ev.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 leading-snug">{ev.action}</p>
                        <p className="text-[9px] text-gray-700 mt-0.5">{ev.agent} · {ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick access grid (top 6 tools) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Quick Access</p>
                <button onClick={() => setActiveView('tools')}
                  className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors font-bold flex items-center gap-1">
                  All Tools <FiChevronRight size={10} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {TOOLS.slice(0,6).map((tool, i) => (
                  <Link key={tool.id} to={tool.path}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all hover:brightness-110 hover:scale-[1.02]"
                    style={{ background:'rgba(255,255,255,0.02)', borderColor: tool.alert ? `${tool.color}40` : 'rgba(255,255,255,0.07)' }}>
                    <span className="text-2xl">{tool.emoji}</span>
                    <p className="text-[10px] font-bold text-white leading-tight">{tool.label}</p>
                    {tool.alert && <span className="text-[7px] text-amber-400">⚠ Action needed</span>}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── ALL TOOLS VIEW ────────────────────────────────────────────── */}
        {activeView === 'tools' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-white">Story Architect Tools</h2>
                <p className="text-xs text-gray-600 mt-0.5">{TOOLS.length} tools — all for {ACTIVE_PROJECT.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TOOLS.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STRUCTURE VIEW ────────────────────────────────────────────── */}
        {activeView === 'structure' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Story Structure</h2>
              <p className="text-xs text-gray-600">4-act structure · {STRUCTURE.reduce((s,a)=>s+a.scenes,0)} total scenes · {STRUCTURE.reduce((s,a)=>s+a.complete,0)} complete</p>
            </div>

            {/* Act breakdown */}
            <div className="grid sm:grid-cols-4 gap-4">
              {STRUCTURE.map((act, i) => {
                const pct = Math.round((act.complete / act.scenes) * 100);
                return (
                  <motion.div key={act.act}
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border p-5"
                    style={{ background:`${act.color}07`, borderColor:`${act.color}25` }}>
                    <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color:act.color }}>{act.label}</p>
                    <p className="text-base font-black text-white mb-3">{act.act}</p>
                    <div className="h-1.5 rounded-full bg-white/6 mb-2">
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, background:act.color }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-600">{act.complete}/{act.scenes} scenes</span>
                      <span className="text-xs font-black" style={{ color:act.color }}>{pct}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Scene timeline (visual) */}
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Scene Timeline</p>
              <div className="rounded-2xl border p-5 overflow-x-auto"
                style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1 min-w-max">
                  {STRUCTURE.map(act =>
                    Array.from({ length: act.scenes }).map((_, si) => (
                      <div key={`${act.act}-${si}`}
                        className="w-7 h-12 rounded-lg flex items-end pb-1 justify-center"
                        style={{
                          background: si < act.complete
                            ? `${act.color}30`
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${si < act.complete ? act.color + '50' : 'rgba(255,255,255,0.07)'}`,
                        }}
                        title={`${act.act} — Scene ${si+1}`}>
                        {si < act.complete && (
                          <FiCheck size={8} style={{ color: act.color }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-3 mt-3">
                  {STRUCTURE.map(act => (
                    <div key={act.act} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: `${act.color}50` }} />
                      <span className="text-[9px] text-gray-600">{act.act}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 ml-2">
                    <FiCheck size={9} className="text-white/30" />
                    <span className="text-[9px] text-gray-600">= Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plot threads full view */}
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Plot Thread Map</p>
              <div className="space-y-3">
                {PLOT_THREADS.map(pt => (
                  <div key={pt.id} className="rounded-xl border px-5 py-4"
                    style={{ background:'rgba(255,255,255,0.02)', borderColor:`${pt.color}20` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-white flex-1">{pt.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded capitalize"
                        style={{ background:`${pt.color}15`, color:pt.color }}>{pt.status}</span>
                      <span className="text-xs font-black" style={{ color:pt.color }}>{pt.progress}%</span>
                    </div>
                    {/* Acts indicator */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] text-gray-700 w-12">Active in:</span>
                      <div className="flex gap-2">
                        {[1,2,3].map(act => (
                          <span key={act}
                            className="text-[9px] font-bold px-2 py-0.5 rounded"
                            style={{
                              background: pt.acts.includes(act) ? `${pt.color}18` : 'rgba(255,255,255,0.04)',
                              color: pt.acts.includes(act) ? pt.color : '#374151',
                            }}>
                            Act {act}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6">
                      <div className="h-full rounded-full" style={{ width:`${pt.progress}%`, background:pt.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

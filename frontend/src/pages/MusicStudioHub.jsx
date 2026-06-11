import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMic, FiMusic, FiHeadphones, FiZap, FiChevronRight,
  FiStar, FiClock, FiFolder, FiUpload,
} from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import { AGENT_SYSTEMS } from '../data/agentData';

const musicSystem = AGENT_SYSTEMS.find(s => s.id === 'music-studio');

const RECENT_PROJECTS = [
  { id:'p1', title:'Crown Season — Track 4',   type:'Single',   progress:68, status:'In Session', statusColor:'#EC4899', tracks:6, bpm:94,  key:'D min', updated:'1h ago' },
  { id:'p2', title:'Afrofuture Anthems EP',     type:'EP',       progress:35, status:'Writing',    statusColor:'#A78BFA', tracks:3, bpm:102, key:'G maj', updated:'2d ago' },
  { id:'p3', title:'Crown Season — Full Album', type:'Album',    progress:12, status:'Planning',   statusColor:'#60A5FA', tracks:0, bpm:0,   key:'—',     updated:'5d ago' },
];

const TOOLS = [
  { id:'recorder',  label:'Music Recorder', icon:'🎵', desc:'Multi-track DAW recorder',       path:'/music-recorder', color:'#D4AF37' },
  { id:'beat',      label:'Beat Builder',   icon:'🥁', desc:'Pattern-based beat creation',    path:'#',              color:'#F97316' },
  { id:'mix',       label:'Mix & Master',   icon:'🎛️', desc:'Mixing and mastering assistant', path:'#',              color:'#10B981' },
  { id:'release',   label:'Release Planner',icon:'🚀', desc:'Distribution & rollout strategy',path:'#',              color:'#60A5FA' },
];

const STATS = [
  { label:'Projects',   value:'3',     icon:<FiFolder size={14}/>,    color:'#D4AF37' },
  { label:'Tracks',     value:'9',     icon:<FiMusic size={14}/>,     color:'#F97316' },
  { label:'Suggestions',value:'9',     icon:<FiZap size={14}/>,       color:'#A78BFA' },
  { label:'Avg Quality',value:'74%',   icon:<FiStar size={14}/>,      color:'#10B981' },
];

export default function MusicStudioHub() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="min-h-screen" style={{ background:'#0a0a0a', color:'#fff', fontFamily:'system-ui, sans-serif' }}>
      <EcosystemStrip />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-12"
        style={{ background:'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(10,10,10,0) 60%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎵</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)' }}>
                  Griot Music Studio
                </span>
              </div>
              <h1 className="text-3xl font-black text-white leading-none">Music Production Suite</h1>
              <p className="text-sm text-gray-400 mt-1">
                Record. Arrange. Mix. Release. — Your AI studio team, always in the session.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 max-w-xl">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-xl border p-3 text-center"
                style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}>
                <div className="flex justify-center mb-1" style={{ color:stat.color }}>{stat.icon}</div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-[9px] text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-8">

        {/* ── Open Recorder CTA ───────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <Link to="/music-recorder"
            className="flex items-center justify-between px-6 py-5 rounded-2xl border transition-all hover:brightness-110 group"
            style={{ background:'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(146,64,14,0.15))', borderColor:'rgba(212,175,55,0.35)' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:'rgba(212,175,55,0.2)' }}>
                🎙️
              </div>
              <div>
                <p className="text-base font-black text-white">Open Music Recorder</p>
                <p className="text-xs text-gray-400">Multi-track DAW · Avatar suggestions · Export-ready</p>
              </div>
            </div>
            <FiChevronRight size={20} className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* ── Tools Grid ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Studio Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOOLS.map(tool => (
              <Link key={tool.id} to={tool.path}
                className="rounded-xl border p-4 text-left transition-all hover:brightness-110 hover:scale-[1.02]"
                style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                <span className="text-2xl mb-2 block">{tool.icon}</span>
                <p className="text-xs font-bold text-white mb-0.5">{tool.label}</p>
                <p className="text-[9px] text-gray-600 leading-snug">{tool.desc}</p>
                {tool.id !== 'recorder' && (
                  <span className="text-[8px] text-gray-700 font-bold tracking-widest uppercase mt-1 block">Coming Soon</span>
                )}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Projects ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Recent Projects</h2>
            <button className="text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors font-bold">+ New Project</button>
          </div>
          <div className="space-y-2">
            {RECENT_PROJECTS.map(proj => (
              <motion.div key={proj.id}
                onHoverStart={() => setHoveredProject(proj.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-all cursor-pointer"
                style={{
                  background: hoveredProject === proj.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  borderColor:'rgba(255,255,255,0.07)',
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(212,175,55,0.12)', fontSize:16 }}>
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-white truncate">{proj.title}</p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                      style={{ background:`${proj.statusColor}15`, color:proj.statusColor }}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 rounded-full bg-white/6">
                      <div className="h-full rounded-full"
                        style={{ width:`${proj.progress}%`, background:'#D4AF37' }} />
                    </div>
                    <span className="text-[9px] font-mono text-gray-600">{proj.progress}%</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right hidden sm:block">
                  {proj.bpm > 0 ? (
                    <>
                      <p className="text-[9px] font-mono text-gray-600">{proj.bpm} BPM · {proj.key}</p>
                      <p className="text-[9px] text-gray-700">{proj.tracks} tracks</p>
                    </>
                  ) : (
                    <p className="text-[9px] text-gray-700">No tracks yet</p>
                  )}
                </div>
                <Link to="/music-recorder"
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-yellow-500/25 text-yellow-400 hover:brightness-110 transition-all">
                  Open →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Avatar Team ─────────────────────────────────────────────── */}
        {musicSystem && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Studio Team</h2>
              <span className="text-[9px] text-gray-700">{musicSystem.agents.length} agents</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {musicSystem.agents.map((agent, i) => (
                <motion.div key={agent.id}
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}>
                  <AgentAvatarCard agent={agent} systemId={musicSystem.id} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Helpers ─────────────────────────────────────────────────── */}
        {musicSystem?.helpers && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">AI Helpers</h2>
            <div className="flex flex-wrap gap-2">
              {musicSystem.helpers.map(h => (
                <span key={h}
                  className="text-[10px] px-3 py-1.5 rounded-full font-semibold border transition-all hover:border-yellow-500/40 hover:text-yellow-300 cursor-pointer"
                  style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.08)', color:'#9CA3AF' }}>
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

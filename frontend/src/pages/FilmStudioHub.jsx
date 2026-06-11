import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiFilm, FiVideo, FiCpu, FiZap, FiChevronRight,
  FiStar, FiClock, FiFolder, FiUpload, FiGrid,
} from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import { AGENT_SYSTEMS } from '../data/agentData';

const filmSystem = AGENT_SYSTEMS.find(s => s.id === 'film-studio');

const RECENT_PROJECTS = [
  { id:'p1', title:'Afrofuture Rising — Ep. 1', type:'Short Film', progress:72, status:'In Edit', statusColor:'#F97316', clips:34, duration:'12:42', updated:'2h ago' },
  { id:'p2', title:'The Ancestors\' Return',     type:'Feature',   progress:28, status:'Pre-Prod',statusColor:'#60A5FA', clips:0,  duration:'—',     updated:'1d ago' },
  { id:'p3', title:'Crown Season — Trailer',     type:'Trailer',   progress:90, status:'Review',  statusColor:'#D4AF37', clips:18, duration:'2:08',  updated:'3h ago' },
];

const TOOLS = [
  { id:'film-editor', label:'Film Editor',    icon:'✂️', desc:'Full NLE timeline editor',      path:'/film-editor',   color:'#EF4444' },
  { id:'trailer',     label:'Trailer Builder', icon:'🎥', desc:'Auto-assemble highlight reels',path:'#',              color:'#F59E0B' },
  { id:'storyboard',  label:'Storyboard',      icon:'🖼️', desc:'Shot planning & scene layout', path:'#',              color:'#A78BFA' },
  { id:'export',      label:'Export Suite',    icon:'📤', desc:'Multi-format export & deliver', path:'#',              color:'#10B981' },
];

const STATS = [
  { label:'Projects',   value:'3',    icon:<FiFolder size={14}/>,  color:'#EF4444' },
  { label:'Total Clips',value:'52',   icon:<FiFilm size={14}/>,    color:'#F59E0B' },
  { label:'Suggestions',value:'8',    icon:<FiZap size={14}/>,     color:'#A78BFA' },
  { label:'Avg Quality',value:'81%',  icon:<FiStar size={14}/>,    color:'#10B981' },
];

export default function FilmStudioHub() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <EcosystemStrip />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-12"
        style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(10,10,10,0) 60%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(239,68,68,0.07) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎬</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                  Griot Film Studio
                </span>
              </div>
              <h1 className="text-3xl font-black text-white leading-none">Film Production Suite</h1>
              <p className="text-sm text-gray-400 mt-1">
                Direct. Shoot. Edit. Export. — Your AI production team, always on set.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 max-w-xl">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-xl border p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-[9px] text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-8">

        {/* ── Open Editor CTA ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <Link to="/film-editor"
            className="flex items-center justify-between px-6 py-5 rounded-2xl border transition-all hover:brightness-110 group"
            style={{ background:'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(153,27,27,0.15))', borderColor:'rgba(239,68,68,0.35)' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:'rgba(239,68,68,0.2)' }}>
                ✂️
              </div>
              <div>
                <p className="text-base font-black text-white">Open Film Editor</p>
                <p className="text-xs text-gray-400">NLE timeline · Avatar suggestions · Export-ready</p>
              </div>
            </div>
            <FiChevronRight size={20} className="text-red-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* ── Tools Grid ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Studio Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOOLS.map(tool => (
              <Link key={tool.id} to={tool.path}
                className="rounded-xl border p-4 text-left transition-all hover:brightness-110 hover:scale-[1.02] group"
                style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                <span className="text-2xl mb-2 block">{tool.icon}</span>
                <p className="text-xs font-bold text-white mb-0.5">{tool.label}</p>
                <p className="text-[9px] text-gray-600 leading-snug">{tool.desc}</p>
                {tool.id !== 'film-editor' && (
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
            <button className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-bold">+ New Project</button>
          </div>
          <div className="space-y-2">
            {RECENT_PROJECTS.map(proj => (
              <motion.div key={proj.id}
                onHoverStart={() => setHoveredProject(proj.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-all cursor-pointer"
                style={{
                  background: hoveredProject === proj.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(239,68,68,0.12)', fontSize:16 }}>
                  🎬
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
                        style={{ width:`${proj.progress}%`, background:'#EF4444' }} />
                    </div>
                    <span className="text-[9px] font-mono text-gray-600">{proj.progress}%</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right hidden sm:block">
                  <p className="text-[9px] text-gray-600">{proj.clips > 0 ? `${proj.clips} clips` : 'No clips yet'}</p>
                  <p className="text-[9px] text-gray-700">{proj.updated}</p>
                </div>
                <Link to="/film-editor"
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-red-500/25 text-red-400 hover:brightness-110 transition-all">
                  Edit →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Avatar Team ─────────────────────────────────────────────── */}
        {filmSystem && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Production Team</h2>
              <span className="text-[9px] text-gray-700">{filmSystem.agents.length} agents</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filmSystem.agents.map((agent, i) => (
                <motion.div key={agent.id}
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}>
                  <AgentAvatarCard agent={agent} systemId={filmSystem.id} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Helpers ─────────────────────────────────────────────────── */}
        {filmSystem?.helpers && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">AI Helpers</h2>
            <div className="flex flex-wrap gap-2">
              {filmSystem.helpers.map(h => (
                <span key={h} className="text-[10px] px-3 py-1.5 rounded-full font-semibold border transition-all hover:border-red-500/40 hover:text-red-300 cursor-pointer"
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

/**
 * All Widgets Hub — master gallery of every system widget
 * Route: /widgets/all  (inside LibraryAppLayout)
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiGrid } from 'react-icons/fi';

// Import all widget components
import AppWidget          from '../components/Widget/AppWidget';
import GroitAppWidget     from '../components/Widget/GroitAppWidget';
import CentralAIWidget    from '../components/Widget/CentralAIWidget';
import EcosystemWidget    from '../components/Widget/EcosystemWidget';
import UniversityAppWidget from '../components/Widget/UniversityAppWidget';
import FilmStudioWidget   from '../components/Widget/FilmStudioWidget';
import MusicStudioWidget  from '../components/Widget/MusicStudioWidget';
import FHHLWidget         from '../components/Widget/FHHLWidget';
import ProjectsWidget     from '../components/Widget/ProjectsWidget';
import GriotCentralWidget from '../components/Widget/GriotCentralWidget';

const SYSTEMS = [
  {
    id: 'library',
    name: 'EOF Library',
    emoji: '📚',
    color: '#D4AF37',
    path: '/widgets',
    desc: 'Books, reading progress, streaks',
    widget: <AppWidget size="medium" />,
  },
  {
    id: 'griot',
    name: 'Griot AI',
    emoji: '🤖',
    color: '#EC4899',
    path: '/griot/widgets',
    desc: 'AI agents, story tools, Canon Keeper',
    widget: <GroitAppWidget size="medium" />,
  },
  {
    id: 'film-studio',
    name: 'Film Studio',
    emoji: '🎬',
    color: '#EF4444',
    path: '/film-studio/widgets',
    desc: 'Productions, clips, AI crew',
    widget: <FilmStudioWidget size="medium" />,
  },
  {
    id: 'music-studio',
    name: 'Music Studio',
    emoji: '🎵',
    color: '#8B5CF6',
    path: '/music-studio/widgets',
    desc: 'Sessions, tracks, BPM, mix',
    widget: <MusicStudioWidget size="medium" />,
  },
  {
    id: 'fhhl',
    name: 'FHHL',
    emoji: '🏆',
    color: '#F59E0B',
    path: '/fhhl/widgets',
    desc: 'League standings, battles, draft',
    widget: <FHHLWidget size="medium" />,
  },
  {
    id: 'projects',
    name: 'Universal Projects',
    emoji: '📋',
    color: '#3B82F6',
    path: '/projects/widgets',
    desc: 'All projects across all systems',
    widget: <ProjectsWidget size="medium" />,
  },
  {
    id: 'griot-central',
    name: 'Griot Central',
    emoji: '⚡',
    color: '#10B981',
    path: '/griot-central/widgets',
    desc: 'Ecosystem health, all systems',
    widget: <GriotCentralWidget size="medium" />,
  },
  {
    id: 'central',
    name: 'EOF Central AI',
    emoji: '🧠',
    color: '#6366F1',
    path: '/central/widgets',
    desc: 'Central AI hub overview',
    widget: <CentralAIWidget size="medium" />,
  },
  {
    id: 'streaming',
    name: 'Streaming',
    emoji: '📺',
    color: '#F97316',
    path: '/streaming/widgets',
    desc: 'Live streams and video content',
    widget: null,
  },
  {
    id: 'radio',
    name: 'Radio',
    emoji: '📻',
    color: '#14B8A6',
    path: '/radio/widgets',
    desc: 'Live radio, shows, schedules',
    widget: null,
  },
  {
    id: 'bac',
    name: 'BAC',
    emoji: '⭐',
    color: '#FBBF24',
    path: '/bac/widgets',
    desc: 'Black Achievement Certification',
    widget: null,
  },
  {
    id: 'legacy-vault',
    name: 'Legacy Vault',
    emoji: '🏛️',
    color: '#A78BFA',
    path: '/legacy-vault/widgets',
    desc: 'Archives, history, legacy content',
    widget: null,
  },
  {
    id: 'akashic',
    name: 'Akashic Records',
    emoji: '🌀',
    color: '#34D399',
    path: '/akashic/widgets',
    desc: 'Knowledge archives and records',
    widget: null,
  },
  {
    id: 'university',
    name: 'DIY University',
    emoji: '🎓',
    color: '#60A5FA',
    path: '/university/widgets',
    desc: 'Courses, schools, professors',
    widget: <UniversityAppWidget size="medium" />,
  },
  {
    id: 'ecosystem',
    name: 'EOF Ecosystem',
    emoji: '🌐',
    color: '#D4AF37',
    path: '/ecosystem',
    desc: 'Cross-system platform overview',
    widget: <EcosystemWidget size="medium" />,
  },
];

export default function AllWidgetsHub() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? SYSTEMS : SYSTEMS.filter(s => s.widget !== null);

  return (
    <div className="min-h-full px-4 md:px-6 py-8 pb-16">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(13,13,13,0.95))' }}>
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 border border-white/15 text-gray-400"
               style={{ background: 'rgba(255,255,255,0.05)' }}>
            <FiGrid size={11} /> {SYSTEMS.length} Systems · All Widgets
          </div>
          <h1 className="font-serif text-4xl text-white font-bold mb-2">Griot Widget Gallery</h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            Every system in the Griot Ecosystem has its own widget. Add any of them to your phone's home screen, desktop, or tablet in Small, Medium, or Large.
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-6 mt-5">
            {[
              { label: 'Systems', value: SYSTEMS.length, color: '#D4AF37' },
              { label: 'Widget Sizes', value: 3, color: '#10B981' },
              { label: 'Shortcuts', value: 21, color: '#8B5CF6' },
            ].map(stat => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-serif" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-2">Show:</p>
        {[{ id: 'all', label: 'All Systems' }, { id: 'live', label: 'Live Widgets' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === f.id ? 'bg-white/10 border-white/25 text-white' : 'border-white/8 text-gray-500 hover:text-gray-400'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Widget grid */}
      <div className="space-y-8">
        {filtered.map((system, i) => (
          <motion.div key={system.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            {/* System header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
                     style={{ background: `${system.color}12`, borderColor: `${system.color}25` }}>
                  {system.emoji}
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base">{system.name}</h2>
                  <p className="text-xs text-gray-500">{system.desc}</p>
                </div>
              </div>
              <Link to={system.path}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: `${system.color}30`, color: system.color }}>
                View Widgets <FiChevronRight size={12}/>
              </Link>
            </div>

            {/* Widget preview */}
            <div className="px-5 py-5">
              {system.widget ? (
                <div className="flex flex-wrap gap-5 items-end">
                  {/* Show the medium widget */}
                  <div className="flex flex-col items-center gap-2">
                    {system.widget}
                    <span className="text-[10px] text-gray-600">Medium — 329×155</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-xl border border-white/5 px-4 py-3"
                     style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <span className="text-2xl opacity-40">{system.emoji}</span>
                  <div>
                    <p className="text-sm text-gray-500">{system.name} Widget</p>
                    <p className="text-xs text-gray-600 mt-0.5">3 sizes available · Click "View Widgets" to customize</p>
                  </div>
                  <Link to={system.path}
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    Preview →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop shortcuts CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-12 rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-4 md:items-center"
        style={{ background: 'rgba(255,255,255,0.025)' }}>
        <div className="text-4xl flex-shrink-0">🖥️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">21 Desktop Shortcuts Created</h3>
          <p className="text-sm text-gray-400">
            All system shortcuts are saved to your Desktop in{' '}
            <code className="text-xs bg-black/40 border border-white/10 rounded px-2 py-0.5 text-green-400 font-mono">
              C:\Users\dhous\Desktop\Griot Ecosystem\
            </code>
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['EOF Library', 'Griot AI', 'Film Studio', 'Music Studio', 'FHHL League', 'Projects', 'Canon Keeper'].map(s => (
              <span key={s} className="text-[10px] bg-white/5 border border-white/8 rounded px-2 py-1 text-gray-400">{s}</span>
            ))}
            <span className="text-[10px] text-gray-600 self-center">+14 more</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

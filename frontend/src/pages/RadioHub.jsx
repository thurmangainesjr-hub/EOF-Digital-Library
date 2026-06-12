import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiPlay, FiArrowRight, FiMic } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const RADIO_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'radio');

const STATIONS = [
  { id: 'culture',  name: 'EOF Culture',   genre: 'Talk · Commentary',       icon: '🎙️', color: '#0891B2', isLive: true,  listeners: '2.4K' },
  { id: 'music',    name: 'EOF Music',      genre: 'Black Excellence Sounds', icon: '🎵', color: '#7C3AED', isLive: true,  listeners: '5.1K' },
  { id: 'word',     name: 'Spoken Word',    genre: 'Poetry · Storytelling',   icon: '📜', color: '#D4AF37', isLive: true,  listeners: '892'  },
  { id: 'news',     name: 'EOF News',       genre: 'News · Current Events',   icon: '📰', color: '#16A34A', isLive: true,  listeners: '1.7K' },
  { id: 'business', name: 'Power Moves',    genre: 'Business · Wealth',       icon: '💼', color: '#C0392B', isLive: false, listeners: '—'    },
  { id: 'arts',     name: 'Creative Hour',  genre: 'Arts · Culture',          icon: '🎨', color: '#EC4899', isLive: false, listeners: '—'    },
];

const SCHEDULE = [
  { time: '6:00 AM',  show: 'Morning Power',          host: 'Marcus J. Freeman',   type: 'Talk' },
  { time: '8:00 AM',  show: 'The Knowledge Hour',      host: 'Dr. Nia Washington',  type: 'Education' },
  { time: '10:00 AM', show: 'Black Business Report',   host: 'Amara Kente',         type: 'Business' },
  { time: '12:00 PM', show: 'Lunchtime Rhythms',       host: 'DJ Excellence',       type: 'Music' },
  { time: '2:00 PM',  show: 'Story Time Radio',        host: 'Zara Osei',           type: 'Storytelling' },
  { time: '4:00 PM',  show: 'The Creator\'s Session',  host: 'EOF Creator Academy', type: 'Creator' },
  { time: '6:00 PM',  show: 'Evening Edition',         host: 'EOF News Team',       type: 'News' },
  { time: '8:00 PM',  show: 'Culture Connect',         host: 'Various',             type: 'Culture' },
  { time: '10:00 PM', show: 'Late Night Vibes',        host: 'DJ Griot',            type: 'Music' },
];

const PODCASTS = [
  { title: 'Build the Empire', ep: 'Ep. 47', desc: 'How to turn your passion into a profitable business', icon: '🏗️' },
  { title: 'The Griot Sessions', ep: 'Ep. 12', desc: 'AI, storytelling, and the future of Black narrative', icon: '🌀' },
  { title: 'Masters of the Craft', ep: 'Ep. 31', desc: 'Conversations with the greatest creators of our time', icon: '🎭' },
  { title: 'Free Your Mind', ep: 'Ep. 8',  desc: 'Philosophy, consciousness, and intellectual freedom', icon: '🧠' },
];

export default function RadioHub() {
  const [activeStation, setActiveStation] = useState('culture');
  const station = STATIONS.find(s => s.id === activeStation) || STATIONS[0];
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07090c' }}>
      {/* Standalone Top Bar */}
      <header className="flex-shrink-0 sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b border-white/8"
        style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">📻</span>
          <div className="leading-none">
            <p className="text-xl font-black text-white leading-none" style={{ letterSpacing: '0.12em' }}>E.O.F</p>
            <p className="text-[8px] font-bold tracking-[0.22em] uppercase mt-0.5" style={{ color: '#22D3EE' }}>Radio</p>
          </div>
          <span className="ml-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-red-500/30 bg-red-500/10 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> ON AIR 24/7
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {STATIONS.filter(s => s.isLive).map(s => (
            <button key={s.id} onClick={() => setActiveStation(s.id)}
              className="text-[11px] px-3 py-1 rounded-full border transition-colors"
              style={activeStation === s.id
                ? { background: `${s.color}20`, borderColor: `${s.color}50`, color: s.color }
                : { borderColor: 'rgba(255,255,255,0.1)', color: '#6B7280' }}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cyan-600/30 px-6 py-10 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.15) 0%, rgba(4,78,97,0.1) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(8,145,178,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-cyan-300 mb-4 border"
              style={{ background: 'rgba(8,145,178,0.12)', borderColor: 'rgba(8,145,178,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> On Air 24/7
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">EOF Radio</h1>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              The audio heartbeat of the EOF ecosystem. Live talk shows, music, spoken word, news, podcasts, and student radio — broadcasting the voice of Black excellence around the clock.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border"
                style={{ background: 'rgba(8,145,178,0.2)', borderColor: 'rgba(8,145,178,0.4)', color: '#67E8F9' }}>
                <FiMic size={14} /> {STATIONS.filter(s => s.isLive).length} Stations Live
              </div>
              <span className="text-xs text-gray-500">
                {STATIONS.reduce((a, s) => a + (s.isLive ? parseInt(s.listeners) || 0 : 0), 0).toLocaleString()}+ listeners
              </span>
            </div>
          </div>

          {/* Now Playing card */}
          <motion.div
            key={activeStation}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-5 w-full md:w-64 flex-shrink-0"
            style={{ background: `${station.color}10`, borderColor: `${station.color}30` }}
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: station.color }}>
              {station.isLive ? '● Live Now' : 'Station'}
            </p>
            <div className="text-4xl mb-3">{station.icon}</div>
            <p className="text-base font-bold text-white mb-0.5">{station.name}</p>
            <p className="text-xs text-gray-400 mb-3">{station.genre}</p>
            {station.isLive && (
              <p className="text-xs" style={{ color: station.color }}>{station.listeners} listening</p>
            )}
            <button
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors border"
              style={{ background: `${station.color}20`, borderColor: `${station.color}40`, color: station.color }}
            >
              <FiPlay size={13} /> {station.isLive ? 'Tune In' : 'Coming Soon'}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Agent Roster ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the Radio Team</h2>
            <p className="text-sm text-gray-500">Four agents running the station 24/7. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{RADIO_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {RADIO_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="radio"
              system={RADIO_SYSTEM}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {RADIO_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* Stations */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-5">Stations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STATIONS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActiveStation(s.id)}
              className={`flex flex-col gap-2 p-4 rounded-2xl border text-left transition-all ${
                activeStation === s.id
                  ? 'border-opacity-60'
                  : 'border-white/10 bg-white/3 hover:border-white/20'
              }`}
              style={activeStation === s.id
                ? { background: `${s.color}12`, borderColor: `${s.color}50` }
                : {}}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{s.icon}</span>
                {s.isLive && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-white leading-tight">{s.name}</p>
              <p className="text-xs text-gray-500">{s.genre}</p>
              {s.isLive && <p className="text-xs" style={{ color: s.color }}>{s.listeners} listening</p>}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-5">Today's Schedule</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {SCHEDULE.map((item, i) => {
            const isNext = i === 2;
            return (
              <div key={item.time}
                className={`flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 transition-colors ${
                  isNext ? 'bg-cyan-500/8 border-l-2 border-l-cyan-500' : 'hover:bg-white/3'
                }`}
              >
                <p className="text-xs text-gray-500 w-20 flex-shrink-0 font-mono">{item.time}</p>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isNext ? 'text-white' : 'text-gray-300'}`}>{item.show}</p>
                  <p className="text-xs text-gray-600 truncate">{item.host}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border flex-shrink-0 ${
                  isNext
                    ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 font-bold'
                    : 'text-gray-500 border-white/10'
                }`}>
                  {isNext ? 'UP NEXT' : item.type}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Podcasts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Podcast Archive</h2>
          <Link to="/story-time" className="text-sm text-cyan-400 hover:underline flex items-center gap-1">
            Story Time <FiChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PODCASTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-4 hover:border-cyan-500/25 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'rgba(8,145,178,0.15)', border: '1px solid rgba(8,145,178,0.25)' }}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{p.title}</p>
                <p className="text-xs text-gray-500">{p.ep}</p>
                <p className="text-xs text-gray-600 truncate mt-0.5">{p.desc}</p>
              </div>
              <FiPlay size={14} className="text-gray-600 group-hover:text-cyan-400 flex-shrink-0 transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Creator Academy CTA */}
      <div className="rounded-2xl border border-cyan-600/25 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(8,145,178,0.06)' }}>
        <div className="text-4xl flex-shrink-0">🎙️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Host Your Own Show</h3>
          <p className="text-sm text-gray-400">EOF Creator Academy students can produce and broadcast their own radio shows on the EOF network. Learn, create, and go live.</p>
        </div>
        <Link to="/creator-academy" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm flex-shrink-0 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors">
          Creator Academy <FiArrowRight size={13} />
        </Link>
      </div>

      <EcosystemStrip currentAppId="radio" />

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="radio"
          system={RADIO_SYSTEM}
          onClose={() => setOpenAgent(null)}
        />
      )}

      </div>{/* end scrollable content */}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPlus, FiThumbsUp, FiChevronRight, FiChevronLeft,
  FiX, FiSkipForward, FiInfo, FiCheck, FiVolume2, FiSearch,
  FiBell, FiArrowRight, FiList,
} from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const STREAMING_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'streaming');

// ── Channel / Playlist data ─────────────────────────────────────────────────
const CHANNELS = [
  {
    id: 'originals', name: 'EOF Originals', icon: '📽️', color: '#6366F1', viewers: '4.2K',
    queue: [
      { title: 'The Griot Chronicles', sub: 'S1 E1 · 42 min', icon: '🎭', bg: 'from-purple-900 to-indigo-900' },
      { title: 'The Griot Chronicles', sub: 'S1 E2 · 38 min', icon: '🎭', bg: 'from-purple-900 to-indigo-900' },
      { title: 'Queens of Business',   sub: 'S2 E1 · 45 min', icon: '👑', bg: 'from-pink-900 to-rose-900' },
      { title: 'Code Black',           sub: 'S1 E1 · 40 min', icon: '💻', bg: 'from-gray-900 to-slate-900' },
    ],
  },
  {
    id: 'culture', name: 'Culture & Arts', icon: '🎨', color: '#EC4899', viewers: '1.8K',
    queue: [
      { title: 'The Art of Excellence', sub: '58 min',    icon: '🎨', bg: 'from-pink-900 to-fuchsia-900' },
      { title: 'Sound of the Diaspora', sub: '1h 02m',   icon: '🎵', bg: 'from-violet-900 to-purple-900' },
      { title: 'Masters of the Craft',  sub: '1h 15m',   icon: '🎭', bg: 'from-rose-900 to-pink-900' },
    ],
  },
  {
    id: 'business', name: 'Business', icon: '💼', color: '#16A34A', viewers: '2.1K',
    queue: [
      { title: 'Black Excellence Unlocked', sub: '2h 14m',        icon: '🔓', bg: 'from-green-900 to-emerald-900' },
      { title: 'Wall Street & Beyond',      sub: '1h 22m',        icon: '📈', bg: 'from-emerald-900 to-teal-900' },
      { title: 'Build the Empire',          sub: 'Ep. 47 · 38 min',icon: '🏗️', bg: 'from-teal-900 to-green-900' },
    ],
  },
  {
    id: 'docs', name: 'Documentaries', icon: '🔭', color: '#F97316', viewers: '892',
    queue: [
      { title: 'Afrofuture Rising',  sub: '1h 47m', icon: '🚀', bg: 'from-orange-900 to-amber-900' },
      { title: 'Diaspora',           sub: '2h 02m', icon: '🌍', bg: 'from-amber-900 to-yellow-900' },
      { title: 'The Innovation Age', sub: '1h 10m', icon: '⚡', bg: 'from-yellow-900 to-orange-900' },
    ],
  },
  {
    id: 'education', name: 'Education', icon: '🎓', color: '#D4AF37', viewers: '654',
    queue: [
      { title: 'The Knowledge Series', sub: 'S1 E1 · 28 min', icon: '📚', bg: 'from-yellow-900 to-amber-900' },
      { title: 'Financial Freedom',    sub: 'Ep. 12 · 35 min', icon: '💰', bg: 'from-amber-900 to-yellow-900' },
    ],
  },
  {
    id: 'kids', name: 'Kids & Family', icon: '👨‍👩‍👧', color: '#06B6D4', viewers: '320',
    queue: [
      { title: 'Little Leaders',        sub: 'Ep. 5 · 22 min', icon: '⭐', bg: 'from-cyan-900 to-sky-900' },
      { title: 'Story Time with Griot', sub: 'Ep. 8 · 18 min', icon: '📖', bg: 'from-sky-900 to-blue-900' },
    ],
  },
];

const FEATURED = [
  { title: 'The Griot Chronicles', type: 'SERIES', badge: 'NEW', tagline: 'Season 1 · 8 Episodes', desc: 'A sweeping narrative of Black excellence — told through the lens of an AI griot who has witnessed 400 years of history.', bg: 'from-purple-950 via-indigo-950', icon: '🎭' },
  { title: 'Black Excellence Unlocked', type: 'DOCUMENTARY', badge: 'HOT', tagline: '2h 14m', desc: 'The definitive documentary exploring the untold stories of Black achievement across every field of human endeavor.', bg: 'from-amber-950 via-orange-950', icon: '🏆' },
  { title: 'Afrofuture Rising', type: 'FILM', badge: 'EXCLUSIVE', tagline: '1h 47m', desc: "A visionary Afrofuturist film set in 2075 Lagos, where a brilliant engineer discovers her ancestry holds the key to humanity's survival.", bg: 'from-teal-950 via-green-950', icon: '🚀' },
];

const CONTENT_ROWS = [
  {
    label: 'Continue Watching',
    items: [
      { title: 'The Griot Chronicles',     sub: 'S1 E3 · 18 min left', icon: '🎭', bg: 'from-purple-900 to-indigo-800', progress: 55 },
      { title: 'Black Excellence Unlocked', sub: '42 min left',         icon: '🏆', bg: 'from-amber-900 to-orange-800', progress: 30 },
      { title: 'Afrofuture Rising',         sub: '1h 12m left',         icon: '🚀', bg: 'from-teal-900 to-cyan-800',   progress: 35 },
      { title: 'Queens of Business',        sub: 'S2 E4 · 8 min left',  icon: '👑', bg: 'from-pink-900 to-rose-800',   progress: 82 },
    ],
  },
  {
    label: 'Original Series',
    items: [
      { title: 'The Griot Chronicles', sub: 'Drama · S1',      icon: '🎭', bg: 'from-purple-900 to-indigo-800' },
      { title: 'Queens of Business',   sub: 'Reality · S2',    icon: '👑', bg: 'from-pink-900 to-rose-800' },
      { title: 'Code Black',           sub: 'Tech Drama · S1', icon: '💻', bg: 'from-gray-900 to-slate-800' },
      { title: 'The Freedom Road',     sub: 'Historical · S1', icon: '🛤️', bg: 'from-amber-900 to-yellow-800' },
      { title: 'Power Moves',          sub: 'Business · S1',   icon: '💼', bg: 'from-green-900 to-emerald-800' },
    ],
  },
  {
    label: 'Top Films',
    items: [
      { title: 'Afrofuture Rising', sub: 'Sci-Fi · 1h 47m',  icon: '🚀', bg: 'from-teal-900 to-cyan-800' },
      { title: 'Diaspora',          sub: 'Drama · 2h 02m',   icon: '🌍', bg: 'from-blue-900 to-indigo-800' },
      { title: 'The Architect',     sub: 'Thriller · 1h 55m',icon: '🏗️', bg: 'from-slate-900 to-gray-800' },
      { title: 'Legacy',            sub: 'Family · 1h 38m',  icon: '🏛️', bg: 'from-yellow-900 to-amber-800' },
      { title: 'The Kingdom',       sub: 'Action · 2h 05m',  icon: '⚔️', bg: 'from-red-900 to-rose-800' },
    ],
  },
  {
    label: 'Documentaries',
    items: [
      { title: 'Black Excellence Unlocked', sub: 'Culture · 2h 14m', icon: '🔓', bg: 'from-orange-900 to-red-800' },
      { title: 'Wall Street & Beyond',      sub: 'Finance · 1h 22m', icon: '📈', bg: 'from-green-900 to-emerald-800' },
      { title: 'Sound of the Diaspora',     sub: 'Music · 58m',      icon: '🎵', bg: 'from-violet-900 to-purple-800' },
      { title: 'The Innovation Age',        sub: 'Tech · 1h 10m',    icon: '⚡', bg: 'from-cyan-900 to-blue-800' },
    ],
  },
  {
    label: 'Live Events',
    items: [
      { title: 'Creator Showcase Live',          sub: '1.2K watching', icon: '🎙️', bg: 'from-red-900 to-pink-800', isLive: true },
      { title: 'Book Club: Freedom Blueprint',   sub: '847 watching',  icon: '📚', bg: 'from-indigo-900 to-purple-800', isLive: true },
      { title: 'EOF Awards Night',               sub: 'Tomorrow 8PM',  icon: '🏆', bg: 'from-amber-900 to-yellow-800' },
      { title: 'Business Summit 2026',           sub: 'Fri 7PM ET',    icon: '💼', bg: 'from-green-900 to-teal-800' },
    ],
  },
];

const NAV_LINKS = ['Home', 'Series', 'Films', 'Documentaries', 'Live', 'My List'];

// ── Content Card ────────────────────────────────────────────────────────────
function ContentCard({ item, onAddList, inList }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="group flex-shrink-0 cursor-pointer relative"
      style={{ width: 168 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: hovered ? 1.08 : 1, zIndex: hovered ? 20 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* Thumbnail */}
        <div className={`w-full rounded-t-xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-4xl relative overflow-hidden border border-white/10`}
          style={{ height: 100 }}>
          <span className="text-4xl">{item.icon}</span>
          {item.isLive && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white tracking-widest">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />LIVE
            </span>
          )}
          {/* Progress bar */}
          {item.progress != null && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
              <div className="h-full bg-red-500 transition-all" style={{ width: `${item.progress}%` }} />
            </div>
          )}
          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <FiPlay size={16} className="text-black ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover action bar */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 rounded-b-xl border border-t-0 border-white/15 z-30"
              style={{ background: '#1a1a2e' }}
            >
              <div className="flex items-center gap-1.5 px-2 py-2 border-b border-white/8">
                <button className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors">
                  <FiPlay size={12} className="text-black ml-0.5" />
                </button>
                <button onClick={() => onAddList?.(item.title)}
                  className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors">
                  {inList ? <FiCheck size={11} className="text-white" /> : <FiPlus size={11} className="text-white" />}
                </button>
                <button className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors">
                  <FiThumbsUp size={11} className="text-white" />
                </button>
                <button className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors ml-auto">
                  <FiInfo size={11} className="text-white" />
                </button>
              </div>
              <div className="px-2.5 py-2">
                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.sub}</p>
                {item.isLive && (
                  <p className="text-[9px] text-red-400 font-bold mt-1">{item.sub} watching</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Below-card info (non-hover) */}
      {!hovered && (
        <div className="mt-1.5 px-0.5">
          <p className="text-xs font-medium text-gray-200 truncate">{item.title}</p>
          <p className="text-[10px] text-gray-500 truncate">{item.sub}</p>
        </div>
      )}
    </motion.div>
  );
}

// ── Scrollable Row ───────────────────────────────────────────────────────────
function ContentRow({ row, myList, onToggleList }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };
  return (
    <div className="mb-10 group/row relative">
      <div className="flex items-center justify-between mb-3 px-4 md:px-6">
        <h2 className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1">
          {row.label}
          <FiChevronRight size={14} className="opacity-0 group-hover/row:opacity-100 transition-opacity" />
        </h2>
      </div>
      <div className="relative">
        <button onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 w-10 z-10 flex items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
          <FiChevronLeft size={18} className="text-white" />
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-6" style={{ scrollbarWidth: 'none' }}>
          {row.items.map((item, i) => (
            <ContentCard
              key={item.title + i}
              item={item}
              onAddList={onToggleList}
              inList={myList.includes(item.title)}
            />
          ))}
        </div>
        <button onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 w-10 z-10 flex items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
          <FiChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function StreamingHub() {
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [activeNav, setActiveNav]           = useState('Home');
  const [activeChannel, setActiveChannel]   = useState(null);
  const [queueIndex, setQueueIndex]         = useState(0);
  const [progress, setProgress]             = useState(0);
  const [myList, setMyList]                 = useState(['The Griot Chronicles']);
  const [openAgent, setOpenAgent]           = useState(null);

  // Auto-rotate hero
  useEffect(() => {
    const t = setInterval(() => setActiveFeatured(i => (i + 1) % FEATURED.length), 7000);
    return () => clearInterval(t);
  }, []);

  // Simulate channel progress
  useEffect(() => {
    if (!activeChannel) return;
    setProgress(0);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          // advance queue
          const ch = CHANNELS.find(c => c.id === activeChannel);
          if (ch) setQueueIndex(i => (i + 1) % ch.queue.length);
          return 0;
        }
        return p + 0.4;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeChannel, queueIndex]);

  const channel   = activeChannel ? CHANNELS.find(c => c.id === activeChannel) : null;
  const nowPlaying = channel?.queue[queueIndex];
  const upNext     = channel ? channel.queue[(queueIndex + 1) % channel.queue.length] : null;
  const feat       = FEATURED[activeFeatured];

  const tuneIn = (chId) => {
    setActiveChannel(chId);
    setQueueIndex(0);
    setProgress(0);
  };

  const toggleList = (title) =>
    setMyList(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);

  return (
    <div className="relative min-h-full" style={{ background: '#08080f', paddingBottom: channel ? 88 : 0 }}>

      {/* ── Side Channel Nav ──────────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center py-24 gap-1"
        style={{ width: 56, background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)' }}>
        {CHANNELS.map(ch => (
          <button
            key={ch.id}
            onClick={() => tuneIn(ch.id)}
            title={`${ch.name} — ${ch.viewers} watching`}
            className="relative group/ch w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
            style={{
              background: activeChannel === ch.id ? `${ch.color}25` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeChannel === ch.id ? ch.color + '50' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: activeChannel === ch.id ? `0 0 12px ${ch.color}40` : 'none',
            }}
          >
            <span>{ch.icon}</span>
            {activeChannel === ch.id && (
              <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full border border-black bg-red-500 animate-pulse" />
            )}
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-lg text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover/ch:opacity-100 transition-opacity pointer-events-none"
              style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {ch.name}
              <span className="ml-2 text-[9px]" style={{ color: ch.color }}>{ch.viewers}</span>
            </span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="text-[9px] font-black tracking-widest uppercase text-gray-600 rotate-90" style={{ marginBottom: 20, letterSpacing: '0.25em' }}>
          CH
        </div>
      </div>

      {/* ── Top Category Nav ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30" style={{ marginLeft: 56 }}>
        <div className="flex items-center gap-1 px-4 py-3 border-b border-white/6 overflow-x-auto"
          style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.98), rgba(8,8,8,0.85))', scrollbarWidth: 'none' }}>
          {/* Logo mark */}
          <div className="flex items-center gap-2 mr-4 flex-shrink-0">
            <span className="text-xl">📺</span>
            <div className="leading-none">
              <p className="text-xl font-black text-white leading-none" style={{ letterSpacing: '0.14em' }}>E.O.F</p>
              <p className="text-[8px] font-bold tracking-[0.22em] uppercase mt-0.5" style={{ color: '#818CF8' }}>Streaming Hub</p>
            </div>
          </div>
          {NAV_LINKS.map(link => (
            <button key={link} onClick={() => setActiveNav(link)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all ${
                activeNav === link ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={activeNav === link ? { background: 'rgba(99,102,241,0.18)', color: '#A5B4FC' } : {}}>
              {link}
            </button>
          ))}
          <div className="flex-1" />
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors flex-shrink-0">
            <FiSearch size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors flex-shrink-0">
            <FiBell size={16} />
          </button>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-indigo-600 flex-shrink-0 cursor-pointer">👤</div>
        </div>
      </div>

      <div style={{ marginLeft: 56 }}>

        {/* ── Featured Hero ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatured}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 bg-gradient-to-br ${feat.bg} to-black`}
            />
          </AnimatePresence>
          {/* Multi-layer vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 50%)' }} />

          <div className="relative z-10 px-6 md:px-10 pt-12 pb-16 flex flex-col justify-end" style={{ minHeight: 420 }}>
            <motion.div
              key={activeFeatured + 'content'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black px-2 py-0.5 rounded text-white" style={{ background: '#6366F1' }}>{feat.badge}</span>
                <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase">{feat.type}</span>
                <span className="text-xs text-gray-500">· {feat.tagline}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-3">{feat.title}</h1>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-md">{feat.desc}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-100 transition-colors">
                  <FiPlay size={16} /> Play
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition-colors">
                  <FiInfo size={14} /> More Info
                </button>
                <button onClick={() => toggleList(feat.title)}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors">
                  {myList.includes(feat.title) ? <FiCheck size={16} className="text-white" /> : <FiPlus size={16} className="text-white" />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Dot selectors */}
          <div className="absolute bottom-6 right-8 flex items-center gap-2 z-10">
            {FEATURED.map((_, i) => (
              <button key={i} onClick={() => setActiveFeatured(i)}
                className="transition-all rounded-full bg-white"
                style={{ width: i === activeFeatured ? 24 : 6, height: 6, opacity: i === activeFeatured ? 1 : 0.3 }} />
            ))}
          </div>
        </div>

        {/* ── Live Now banner ────────────────────────────────────────────── */}
        <div className="px-4 md:px-6 pt-6 mb-2 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-sm font-bold text-white">Live Now</span>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              { title: 'Creator Showcase Live', host: 'Creator Academy', viewers: '1.2K', icon: '🎙️' },
              { title: 'Book Club: Freedom Blueprint', host: 'Story Time', viewers: '847', icon: '📚' },
            ].map(l => (
              <button key={l.title}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/8 px-3 py-2 flex-shrink-0 hover:border-red-500/60 transition-colors">
                <span>{l.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-medium text-white whitespace-nowrap">{l.title}</p>
                  <p className="text-[10px] text-gray-500">{l.viewers} watching</p>
                </div>
                <FiPlay size={12} className="text-red-400 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Rows ──────────────────────────────────────────────── */}
        <div className="pt-4">
          {CONTENT_ROWS.map(row => (
            <ContentRow key={row.label} row={row} myList={myList} onToggleList={toggleList} />
          ))}
        </div>

        {/* ── AI Streaming Studio ────────────────────────────────────────── */}
        <section className="px-4 md:px-6 mb-10">
          <div className="rounded-2xl border border-indigo-600/20 p-6" style={{ background: 'rgba(99,102,241,0.05)' }}>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl text-white font-bold mb-1">AI Streaming Studio</h2>
                <p className="text-sm text-gray-500">Four agents managing the platform. Click any to open their workspace.</p>
              </div>
              <span className="text-xs text-gray-600">{STREAMING_SYSTEM?.agents.length} agents</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {STREAMING_SYSTEM?.agents.map((agent, i) => (
                <AgentAvatarCard
                  key={agent.id}
                  agent={agent}
                  systemId="streaming"
                  system={STREAMING_SYSTEM}
                  index={i}
                  onClick={() => setOpenAgent(agent)}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable:</span>
              {STREAMING_SYSTEM?.helpers.map(h => (
                <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">⚡ {h}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-indigo-600/25 p-5 flex items-center gap-4"
            style={{ background: 'rgba(99,102,241,0.06)' }}>
            <span className="text-3xl flex-shrink-0">🌟</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-0.5">Made in Creator Academy</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Produce your own series, film, or documentary.</p>
            </div>
            <Link to="/creator-academy" className="flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-500/30 text-indigo-300 text-xs hover:bg-indigo-500/10 transition-colors flex-shrink-0">
              Go <FiArrowRight size={11} />
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-4">
            <span className="text-3xl flex-shrink-0">📖</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-0.5">Story Time</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Live book readings and interactive storytelling.</p>
            </div>
            <Link to="/story-time" className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/15 text-gray-300 text-xs hover:text-white hover:border-white/30 transition-colors flex-shrink-0">
              Go <FiArrowRight size={11} />
            </Link>
          </div>
        </div>

        <div className="px-4 md:px-6">
          <EcosystemStrip currentAppId="streaming" />
        </div>
      </div>

      {/* ── Live Channel Player Bar (fixed bottom) ──────────────────────── */}
      <AnimatePresence>
        {channel && nowPlaying && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            transition={{ type: 'spring', damping: 24, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
            style={{ background: 'rgba(10,10,20,0.97)', backdropFilter: 'blur(20px)', height: 80 }}
          >
            {/* Progress bar (channel progress) */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
              <motion.div
                className="h-full"
                style={{ width: `${progress}%`, background: channel.color }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center gap-4 h-full px-4">
              {/* Channel ID */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg border"
                  style={{ background: `${channel.color}20`, borderColor: `${channel.color}40` }}>
                  {channel.icon}
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase" style={{ color: channel.color }}>
                    LIVE CHANNEL
                  </p>
                  <p className="text-[11px] font-bold text-white">{channel.name}</p>
                </div>
              </div>

              <div className="w-px self-stretch my-3 bg-white/10" />

              {/* Now Playing */}
              <div className="flex items-center gap-3 flex-shrink-0 min-w-0 flex-1 max-w-xs">
                <div className={`w-12 h-9 rounded-lg bg-gradient-to-br ${nowPlaying.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                  {nowPlaying.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Now Playing</p>
                  <p className="text-xs font-bold text-white truncate">{nowPlaying.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{nowPlaying.sub}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setQueueIndex(i => Math.max(0, i - 1))}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors">
                  <FiChevronLeft size={14} className="text-white" />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: channel.color }}>
                  <FiPlay size={14} className="text-white ml-0.5" />
                </button>
                <button onClick={() => { setQueueIndex(i => (i + 1) % channel.queue.length); setProgress(0); }}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors">
                  <FiSkipForward size={14} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors">
                  <FiVolume2 size={13} className="text-white" />
                </button>
              </div>

              <div className="w-px self-stretch my-3 bg-white/10 hidden md:block" />

              {/* Up Next */}
              {upNext && (
                <div className="hidden md:flex items-center gap-2 flex-1 min-w-0">
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest flex-shrink-0">Up Next</p>
                  <div className={`w-9 h-7 rounded flex items-center justify-center text-base flex-shrink-0 bg-gradient-to-br ${upNext.bg}`}>
                    {upNext.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-300 truncate font-medium">{upNext.title}</p>
                    <p className="text-[9px] text-gray-600 truncate">{upNext.sub}</p>
                  </div>
                </div>
              )}

              {/* Queue button */}
              <div className="hidden md:flex items-center gap-1 flex-shrink-0 ml-auto">
                <span className="text-[9px] text-gray-600">{queueIndex + 1}/{channel.queue.length}</span>
                <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <FiList size={14} />
                </button>
              </div>

              {/* Close */}
              <button onClick={() => setActiveChannel(null)}
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 transition-colors flex-shrink-0">
                <FiX size={13} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="streaming"
          system={STREAMING_SYSTEM}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

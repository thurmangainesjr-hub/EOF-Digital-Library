'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPlus, FiThumbsUp, FiCheck, FiInfo,
  FiSearch, FiBell, FiChevronLeft, FiChevronRight,
  FiX, FiVolume2, FiSkipForward, FiList,
} from 'react-icons/fi';

// ── Brand ────────────────────────────────────────────────────────────────────

function TVLogo({ size = 'md' }) {
  const scales = { sm: 0.55, md: 1, lg: 1.4 };
  const s = scales[size] ?? 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, transform: `scale(${s})`, transformOrigin: 'top center', flexShrink: 0 }}>
      {/* "The B List" text above TV */}
      <div style={{ textAlign: 'center', marginBottom: 2 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>The</span>
        <div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 18, letterSpacing: '0.04em', color: '#fff', lineHeight: 1, marginTop: -1 }}>B List</div>
      </div>
      {/* TV body */}
      <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Screen bezel */}
        <rect x="2" y="2" width="44" height="30" rx="4" fill="#1a1a2e" stroke="#C0392B" strokeWidth="2"/>
        {/* Screen glass */}
        <rect x="5" y="5" width="38" height="24" rx="2" fill="#0a0a18"/>
        {/* Scanlines */}
        <rect x="5" y="8" width="38" height="0.5" fill="rgba(192,57,43,0.15)"/>
        <rect x="5" y="12" width="38" height="0.5" fill="rgba(192,57,43,0.15)"/>
        <rect x="5" y="16" width="38" height="0.5" fill="rgba(192,57,43,0.15)"/>
        <rect x="5" y="20" width="38" height="0.5" fill="rgba(192,57,43,0.15)"/>
        {/* B on screen */}
        <text x="24" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="14" fill="#C0392B" style={{letterSpacing:'0.05em'}}>B</text>
        {/* Stand neck */}
        <rect x="21" y="32" width="6" height="4" fill="#1a1a2e"/>
        {/* Stand feet */}
        <rect x="14" y="36" width="20" height="3" rx="1.5" fill="#1a1a2e" stroke="#C0392B" strokeWidth="1.2"/>
        {/* Power dot */}
        <circle cx="40" cy="27" r="1.5" fill="#C0392B"/>
      </svg>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURED = [
  {
    id: 'griot-chronicles',
    title: 'The Griot Chronicles',
    type: 'SERIES',  badge: 'NEW',
    tagline: 'Season 1 · 8 Episodes · Drama',
    desc: 'A sweeping narrative of Black excellence — told through the lens of an AI griot who has witnessed 400 years of history. Every episode reshapes what you thought you knew.',
    icon: '🎭',
    bg: ['#0f0720', '#1e1b4b', '#312e81'],
    accentColor: '#818CF8',
    rating: 'TV-MA',
    year: 2026,
    match: '97%',
  },
  {
    id: 'black-excellence',
    title: 'Black Excellence Unlocked',
    type: 'DOCUMENTARY', badge: 'HOT',
    tagline: '2h 14m · Culture',
    desc: 'The definitive documentary exploring the untold stories of Black achievement across every field of human endeavor — business, science, art, and beyond.',
    icon: '🏆',
    bg: ['#1c0a00', '#78350f', '#92400e'],
    accentColor: '#FCD34D',
    rating: 'TV-14',
    year: 2026,
    match: '94%',
  },
  {
    id: 'afrofuture',
    title: 'Afrofuture Rising',
    type: 'FILM', badge: 'EXCLUSIVE',
    tagline: '1h 47m · Sci-Fi',
    desc: "A visionary Afrofuturist film set in 2075 Lagos, where a brilliant engineer discovers her ancestry holds the key to humanity's survival.",
    icon: '🚀',
    bg: ['#042f2e', '#134e4a', '#115e59'],
    accentColor: '#34D399',
    rating: 'TV-14',
    year: 2026,
    match: '92%',
  },
  {
    id: 'queens-of-business',
    title: 'Queens of Business',
    type: 'SERIES', badge: 'S2 NOW',
    tagline: 'Season 2 · Reality',
    desc: 'Follow six Black women entrepreneurs as they build empires from nothing, navigate boardrooms, and rewrite the rules of business.',
    icon: '👑',
    bg: ['#2d0018', '#881337', '#9f1239'],
    accentColor: '#FB7185',
    rating: 'TV-PG',
    year: 2026,
    match: '89%',
  },
];

const CHANNELS = [
  { id: 'originals', name: 'B List Originals', icon: '📽️', color: '#C0392B', viewers: '4.2K', live: true },
  { id: 'culture',   name: 'Culture & Arts',   icon: '🎨', color: '#EC4899', viewers: '1.8K', live: true },
  { id: 'business',  name: 'Business & Wealth', icon: '💼', color: '#16A34A', viewers: '2.1K', live: true },
  { id: 'docs',      name: 'Documentaries',     icon: '🔭', color: '#F97316', viewers: '892',  live: false },
  { id: 'education', name: 'Education',          icon: '🎓', color: '#D4AF37', viewers: '654',  live: false },
  { id: 'kids',      name: 'Kids & Family',      icon: '👨‍👩‍👧', color: '#06B6D4', viewers: '320',  live: false },
];

const NAV_CATEGORIES = ['Home', 'Series', 'Films', 'Documentaries', 'Live', 'Education', 'Kids', 'My List'];

const CONTENT_ROWS = [
  {
    id: 'continue',
    label: 'Continue Watching',
    items: [
      { title: 'The Griot Chronicles',      sub: 'S1 E3 · 18 min left',  icon: '🎭', bg: '#1e1b4b', progress: 55, match: '97%' },
      { title: 'Black Excellence Unlocked', sub: '42 min left',           icon: '🏆', bg: '#78350f', progress: 30, match: '94%' },
      { title: 'Afrofuture Rising',         sub: '1h 12m left',           icon: '🚀', bg: '#134e4a', progress: 35, match: '92%' },
      { title: 'Queens of Business',        sub: 'S2 E4 · 8 min left',   icon: '👑', bg: '#881337', progress: 82, match: '89%' },
      { title: 'Wall Street & Beyond',      sub: '34 min left',           icon: '📈', bg: '#064e3b', progress: 20, match: '88%' },
    ],
  },
  {
    id: 'originals',
    label: 'B List Originals',
    items: [
      { title: 'The Griot Chronicles', sub: 'Drama · S1 · 8 Ep',       icon: '🎭', bg: '#1e1b4b', badge: 'NEW' },
      { title: 'Queens of Business',   sub: 'Reality · S2 · 10 Ep',    icon: '👑', bg: '#881337', badge: 'NEW' },
      { title: 'Code Black',           sub: 'Tech Drama · S1 · 6 Ep',  icon: '💻', bg: '#1f2937' },
      { title: 'The Freedom Road',     sub: 'Historical · S1 · 8 Ep',  icon: '🛤️', bg: '#422006' },
      { title: 'Power Moves',          sub: 'Business · S1 · 12 Ep',   icon: '💼', bg: '#14532d' },
      { title: 'Midnight Cipher',      sub: 'Thriller · Coming Soon',   icon: '🔐', bg: '#0f172a', badge: 'SOON' },
    ],
  },
  {
    id: 'top-films',
    label: 'Top Films This Week',
    items: [
      { title: 'Afrofuture Rising',    sub: 'Sci-Fi · 1h 47m',         icon: '🚀', bg: '#134e4a', match: '92%' },
      { title: 'Diaspora',             sub: 'Drama · 2h 02m',          icon: '🌍', bg: '#1e3a5f' },
      { title: 'The Architect',        sub: 'Thriller · 1h 55m',       icon: '🏗️', bg: '#1f2937' },
      { title: 'Legacy',               sub: 'Family · 1h 38m',         icon: '🏛️', bg: '#422006' },
      { title: 'The Kingdom',          sub: 'Action · 2h 05m',         icon: '⚔️', bg: '#450a0a' },
    ],
  },
  {
    id: 'docs',
    label: 'Must-Watch Documentaries',
    items: [
      { title: 'Black Excellence Unlocked', sub: 'Culture · 2h 14m',   icon: '🔓', bg: '#78350f', match: '94%' },
      { title: 'Wall Street & Beyond',      sub: 'Finance · 1h 22m',   icon: '📈', bg: '#064e3b' },
      { title: 'Sound of the Diaspora',     sub: 'Music · 58m',        icon: '🎵', bg: '#3b0764' },
      { title: 'The Innovation Age',        sub: 'Tech · 1h 10m',      icon: '⚡', bg: '#0c4a6e' },
      { title: 'The Art of Excellence',     sub: 'Art · 58m',          icon: '🎨', bg: '#500724' },
    ],
  },
  {
    id: 'live',
    label: 'Live Now',
    items: [
      { title: 'Creator Showcase Live',        sub: '1.2K watching', icon: '🎙️', bg: '#450a0a', isLive: true },
      { title: 'Book Club: Freedom Blueprint', sub: '847 watching',  icon: '📚', bg: '#1e1b4b', isLive: true },
      { title: 'EOF Awards Night',             sub: 'Tomorrow 8PM',  icon: '🏆', bg: '#422006' },
      { title: 'Business Summit 2026',         sub: 'Fri 7PM ET',    icon: '💼', bg: '#14532d' },
    ],
  },
  {
    id: 'education',
    label: 'Learn Something Today',
    items: [
      { title: 'The Knowledge Series', sub: 'S1 E1 · 28 min',    icon: '📚', bg: '#422006' },
      { title: 'Financial Freedom',    sub: 'Ep 12 · 35 min',    icon: '💰', bg: '#064e3b' },
      { title: 'Masters of the Craft', sub: 'Culture · 1h 15m',  icon: '🎭', bg: '#500724' },
      { title: 'Build the Empire',     sub: 'Ep 47 · 38 min',    icon: '🏗️', bg: '#14532d' },
    ],
  },
  {
    id: 'kids',
    label: 'Kids & Family',
    items: [
      { title: 'Little Leaders',          sub: 'Ep 5 · 22 min',  icon: '⭐', bg: '#0c4a6e' },
      { title: 'Story Time with Griot',   sub: 'Ep 8 · 18 min',  icon: '📖', bg: '#1e3a5f' },
      { title: 'Young Inventors',         sub: 'Ep 3 · 24 min',  icon: '🔬', bg: '#064e3b' },
    ],
  },
];

// ── Subcomponents ─────────────────────────────────────────────────────────────

function ContentCard({ item, inList, onToggleList }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="flex-shrink-0 cursor-pointer relative"
      style={{ width: 172 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: hovered ? 1.07 : 1, zIndex: hovered ? 30 : 1 }}
        transition={{ duration: 0.18 }}
        style={{ position: 'relative', transformOrigin: 'center bottom' }}
      >
        {/* Thumbnail */}
        <div className="relative w-full rounded-t-xl overflow-hidden border border-white/8"
          style={{ height: 100, background: `linear-gradient(135deg, ${item.bg}dd, #000)` }}>
          <div className="absolute inset-0 flex items-center justify-center text-5xl" style={{ opacity: 0.7 }}>
            {item.icon}
          </div>

          {item.badge && (
            <span className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded"
              style={{ background: item.badge === 'SOON' ? '#4B5563' : '#C0392B', color: '#fff', letterSpacing: '0.05em' }}>
              {item.badge}
            </span>
          )}
          {item.isLive && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />LIVE
            </span>
          )}
          {item.match && (
            <span className="absolute top-2 right-2 text-[8px] font-black px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#4ade80' }}>{item.match} match</span>
          )}
          {item.progress != null && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
              <div className="h-full bg-red-600 transition-all" style={{ width: `${item.progress}%` }} />
            </div>
          )}

          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <FiPlay size={17} className="text-black ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover panel */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-full left-0 right-0 rounded-b-xl border border-t-0 border-white/12 z-30 shadow-2xl"
              style={{ background: '#141428' }}>
              <div className="flex items-center gap-1.5 px-2 py-2 border-b border-white/8">
                <button className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <FiPlay size={11} className="text-black ml-0.5" />
                </button>
                <button onClick={() => onToggleList?.(item.title)}
                  className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors">
                  {inList ? <FiCheck size={10} className="text-white" /> : <FiPlus size={10} className="text-white" />}
                </button>
                <button className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors">
                  <FiThumbsUp size={10} className="text-white" />
                </button>
                <button className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 hover:border-white transition-colors ml-auto">
                  <FiInfo size={10} className="text-white" />
                </button>
              </div>
              <div className="px-2.5 py-2">
                <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!hovered && (
        <div className="mt-1.5 px-0.5">
          <p className="text-[11px] font-medium text-gray-200 truncate">{item.title}</p>
          <p className="text-[9px] text-gray-500 truncate">{item.sub}</p>
        </div>
      )}
    </motion.div>
  );
}

function ContentRow({ row, myList, onToggleList }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });

  return (
    <div className="mb-10 group/row relative">
      <div className="flex items-center justify-between mb-3 px-6 md:px-10">
        <h2 className="text-sm font-bold text-white flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
          {row.label}
          <FiChevronRight size={13} className="opacity-0 group-hover/row:opacity-100 transition-opacity" />
        </h2>
      </div>
      <div className="relative">
        <button onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 w-12 z-10 flex items-center justify-center bg-gradient-to-r from-black/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
          <FiChevronLeft size={20} className="text-white" />
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto pb-12 px-6 md:px-10" style={{ scrollbarWidth: 'none' }}>
          {row.items.map((item, i) => (
            <ContentCard key={item.title + i} item={item}
              inList={myList.includes(item.title)} onToggleList={onToggleList} />
          ))}
        </div>
        <button onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 w-12 z-10 flex items-center justify-center bg-gradient-to-l from-black/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
          <FiChevronRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TheBListApp() {
  const [activeFeatured, setActiveFeatured]   = useState(0);
  const [activeNav, setActiveNav]             = useState('Home');
  const [activeChannel, setActiveChannel]     = useState(null);
  const [queueIndex, setQueueIndex]           = useState(0);
  const [channelProgress, setChannelProgress] = useState(0);
  const [myList, setMyList]                   = useState(['The Griot Chronicles', 'Afrofuture Rising']);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [scrolled, setScrolled]              = useState(false);

  // Auto-rotate hero
  useEffect(() => {
    const t = setInterval(() => setActiveFeatured(i => (i + 1) % FEATURED.length), 7000);
    return () => clearInterval(t);
  }, []);

  // Transparent nav on scroll
  useEffect(() => {
    const el = document.getElementById('blist-scroll');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 60);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Channel progress sim
  useEffect(() => {
    if (!activeChannel) return;
    setChannelProgress(0);
    const t = setInterval(() => {
      setChannelProgress(p => {
        if (p >= 100) { setQueueIndex(i => (i + 1) % 4); return 0; }
        return p + 0.3;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeChannel, queueIndex]);

  const feat    = FEATURED[activeFeatured];
  const channel = activeChannel ? CHANNELS.find(c => c.id === activeChannel) : null;

  const toggleList = (title) =>
    setMyList(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#080808', color: '#fff' }}>

      {/* ── Top Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(8,8,8,0.97)'
            : 'linear-gradient(to bottom, rgba(8,8,8,0.95) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
        <div className="flex items-center gap-0 px-6 md:px-10" style={{ height: 60 }}>

          {/* Logo */}
          <div className="flex-shrink-0 mr-8">
            <TVLogo size="sm" />
          </div>

          {/* Category Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {NAV_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveNav(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  color: activeNav === cat ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: activeNav === cat ? 'rgba(192,57,43,0.18)' : 'transparent',
                  fontWeight: activeNav === cat ? 700 : 500,
                }}>
                {cat}
              </button>
            ))}
          </nav>

          <div className="flex-1 md:flex-none" />

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setSearchOpen(v => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)', background: searchOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
              <FiSearch size={17} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <FiBell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-600" />
            </button>
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#C0392B,#7c1d0e)', boxShadow: '0 2px 8px rgba(192,57,43,0.4)' }}>
              B
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 52, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/6 px-6 md:px-10 flex items-center"
              style={{ background: 'rgba(8,8,8,0.98)' }}>
              <FiSearch size={15} className="text-gray-500 flex-shrink-0 mr-3" />
              <input autoFocus placeholder="Search The B List…"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600" />
              <button onClick={() => setSearchOpen(false)} className="p-1 text-gray-600 hover:text-white transition-colors ml-2">
                <FiX size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Scrollable Content ── */}
      <div id="blist-scroll" className="flex-1 overflow-y-auto"
        style={{ paddingBottom: activeChannel ? 88 : 0 }}>

        {/* ── Channel Rail (left, fixed over scroll) ── */}
        <div className="fixed left-0 z-40 flex flex-col items-center gap-2"
          style={{ top: 70, bottom: activeChannel ? 88 : 0, width: 52, background: 'linear-gradient(to right, rgba(0,0,0,0.85), transparent)', paddingTop: 12 }}>
          {CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setActiveChannel(v => v === ch.id ? null : ch.id)}
              title={`${ch.name} — ${ch.viewers} watching`}
              className="relative group/ch w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
              style={{
                background: activeChannel === ch.id ? `${ch.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeChannel === ch.id ? ch.color + '55' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: activeChannel === ch.id ? `0 0 14px ${ch.color}40` : 'none',
              }}>
              <span>{ch.icon}</span>
              {ch.live && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-black"
                  style={{ background: activeChannel === ch.id ? ch.color : '#EF4444' }} />
              )}
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/ch:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ background: 'rgba(14,14,28,0.97)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                {ch.name}
                <span className="ml-2 text-[9px]" style={{ color: ch.color }}>{ch.viewers}</span>
              </span>
            </button>
          ))}
          <div className="flex-1" />
          <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 7, fontWeight: 900, writingMode: 'vertical-rl', transform: 'rotate(180deg)', paddingBottom: 16, letterSpacing: '0.2em' }}>CH</div>
        </div>

        {/* Left offset for channel rail */}
        <div style={{ marginLeft: 52 }}>

          {/* ── Hero ── */}
          <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeFeatured}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${feat.bg[0]} 0%, ${feat.bg[1]} 45%, ${feat.bg[2]} 80%, #080808 100%)` }}
              />
            </AnimatePresence>

            {/* Background emoji */}
            <AnimatePresence mode="wait">
              <motion.div key={activeFeatured + 'emoji'}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.12, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute right-[5%] top-1/2 -translate-y-1/2 text-[200px] pointer-events-none select-none"
                style={{ filter: 'blur(2px)' }}>
                {feat.icon}
              </motion.div>
            </AnimatePresence>

            {/* Vignettes */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)' }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, transparent 40%)' }} />

            {/* Content */}
            <div className="relative z-10 px-6 md:px-10 flex flex-col justify-end" style={{ minHeight: 520, paddingTop: 90, paddingBottom: 60 }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeFeatured + 'content'}
                  initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-xl">

                  {/* Badge row */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded"
                      style={{ background: '#C0392B', color: '#fff' }}>
                      {feat.badge}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {feat.type}
                    </span>
                    <span style={{ color: feat.accentColor }} className="text-[10px] font-bold">
                      {feat.match} match
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif font-black text-white leading-tight mb-2"
                    style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                    {feat.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 border border-white/30 text-white/60">{feat.rating}</span>
                    <span className="text-[11px] text-white/50">{feat.year}</span>
                    <span className="text-[11px] text-white/40">·</span>
                    <span className="text-[11px] text-white/50">{feat.tagline}</span>
                  </div>

                  <p className="text-[13px] text-gray-300 leading-relaxed mb-6 max-w-md">{feat.desc}</p>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-7 py-3 rounded-lg font-black text-[13px] transition-all hover:bg-white/90"
                      style={{ background: '#fff', color: '#000' }}>
                      <FiPlay size={15} /> Play
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-[13px] transition-all hover:bg-white/15"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                      <FiInfo size={13} /> More Info
                    </button>
                    <button onClick={() => toggleList(feat.title)}
                      className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition-all hover:border-white"
                      style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {myList.includes(feat.title)
                        ? <FiCheck size={16} className="text-white" />
                        : <FiPlus size={16} className="text-white" />}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hero dot selectors */}
            <div className="absolute bottom-6 right-10 flex items-center gap-2 z-10">
              {FEATURED.map((_, i) => (
                <button key={i} onClick={() => setActiveFeatured(i)}
                  className="rounded-full bg-white transition-all"
                  style={{ width: i === activeFeatured ? 24 : 6, height: 6, opacity: i === activeFeatured ? 1 : 0.25 }} />
              ))}
            </div>
          </div>

          {/* ── Live Now Strip ── */}
          <div className="flex items-center gap-4 px-6 md:px-10 py-4 mb-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[12px] font-black text-white">Live Now</span>
            </div>
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { title: 'Creator Showcase Live', viewers: '1.2K', icon: '🎙️' },
                { title: 'Book Club: Freedom Blueprint', viewers: '847', icon: '📚' },
              ].map(l => (
                <button key={l.title}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 transition-colors hover:border-red-500/60"
                  style={{ border: '1px solid rgba(192,57,43,0.3)', background: 'rgba(192,57,43,0.07)' }}>
                  <span>{l.icon}</span>
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-white whitespace-nowrap">{l.title}</p>
                    <p className="text-[9px] text-gray-500">{l.viewers} watching</p>
                  </div>
                  <FiPlay size={11} className="text-red-400 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Content Rows ── */}
          <div className="pt-2">
            {CONTENT_ROWS.map(row => (
              <ContentRow key={row.id} row={row} myList={myList} onToggleList={toggleList} />
            ))}
          </div>

          {/* ── Footer strip ── */}
          <div className="flex items-center justify-between px-6 md:px-10 py-6 border-t border-white/5 mt-4">
            <div className="flex items-center gap-3">
              <TVLogo size="sm" />
              <div>
                <p className="text-[10px] text-gray-600">Part of the EOF Ecosystem</p>
                <p className="text-[9px] text-gray-700">© 2026 End of File, Inc.</p>
              </div>
            </div>
            <div className="flex gap-4">
              {['Terms', 'Privacy', 'Help', 'Contact'].map(l => (
                <span key={l} className="text-[10px] text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">{l}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Live Channel Player Bar ── */}
      <AnimatePresence>
        {channel && (
          <motion.div
            initial={{ y: 88 }} animate={{ y: 0 }} exit={{ y: 88 }}
            transition={{ type: 'spring', damping: 24, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8"
            style={{ background: 'rgba(8,8,16,0.98)', backdropFilter: 'blur(24px)', height: 80 }}>
            {/* Channel progress */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/8">
              <motion.div className="h-full"
                style={{ width: `${channelProgress}%`, background: channel.color }}
                transition={{ duration: 0.5 }} />
            </div>

            <div className="flex items-center gap-4 h-full px-5">
              {/* Channel ID */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
                  style={{ background: `${channel.color}18`, borderColor: `${channel.color}35` }}>
                  {channel.icon}
                </div>
                <div>
                  <p className="text-[8px] font-black tracking-widest uppercase" style={{ color: channel.color }}>LIVE CHANNEL</p>
                  <p className="text-[11px] font-bold text-white">{channel.name}</p>
                </div>
              </div>

              <div className="w-px self-stretch my-3 bg-white/8" />

              {/* Now Playing */}
              <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xs">
                <div className="w-12 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${channel.color}18`, border: `1px solid ${channel.color}30` }}>
                  {channel.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] text-gray-600 uppercase tracking-widest">Now Playing</p>
                  <p className="text-[11px] font-bold text-white truncate">{channel.name} Live</p>
                  <p className="text-[10px] text-gray-500">{channel.viewers} watching</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setQueueIndex(i => Math.max(0, i - 1))}
                  className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 transition-colors">
                  <FiChevronLeft size={14} className="text-white" />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: channel.color, boxShadow: `0 2px 10px ${channel.color}50` }}>
                  <FiPlay size={14} className="text-white ml-0.5" />
                </button>
                <button onClick={() => { setQueueIndex(i => (i + 1) % 4); setChannelProgress(0); }}
                  className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 transition-colors">
                  <FiSkipForward size={14} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 transition-colors">
                  <FiVolume2 size={13} className="text-white" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <button className="p-1.5 text-gray-600 hover:text-white transition-colors">
                  <FiList size={14} />
                </button>
                <button onClick={() => setActiveChannel(null)}
                  className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center hover:border-white/30 transition-colors">
                  <FiX size={13} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

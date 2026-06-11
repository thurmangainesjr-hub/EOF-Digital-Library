/**
 * EOFTopNav — Global top navigation bar used across all EOF Ecosystem systems.
 * Layer 1 of the 3-Layer Navigation System (EOF Ecosystem UI/UX Canon).
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiX, FiArrowRight } from 'react-icons/fi';

// ── Studios card data ─────────────────────────────────────────────────────────
const STUDIOS = [
  {
    id: 'film',
    label: 'Film Studio',
    emoji: '🎬',
    path: '/film-studio',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #1a0505 100%)',
    patternColor: 'rgba(239,68,68,0.12)',
    desc: 'Direct, edit & produce films',
    badge: 'LIVE',
  },
  {
    id: 'music',
    label: 'Music Studio',
    emoji: '🎵',
    path: '/music-studio',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #0d0416 100%)',
    patternColor: 'rgba(139,92,246,0.12)',
    desc: 'Record, mix & release tracks',
    badge: 'LIVE',
  },
  {
    id: 'university',
    label: 'DIY University',
    emoji: '🎓',
    path: '/university',
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #060e1a 100%)',
    patternColor: 'rgba(96,165,250,0.12)',
    desc: 'Learn skills & earn credentials',
    badge: 'LIVE',
  },
  {
    id: 'library',
    label: 'EOF Library',
    emoji: '📚',
    path: '/library',
    color: '#D4AF37',
    gradient: 'linear-gradient(135deg, #4a3a08 0%, #0f0b02 100%)',
    patternColor: 'rgba(212,175,55,0.12)',
    desc: 'Books, scripts & media archives',
    badge: 'LIVE',
  },
];

// ── Dropdown data ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'systems',
    label: 'Systems',
    items: [
      { label: 'Griot AI',               emoji: '🌀', path: '/griot',        color: '#7C3AED' },
      { label: 'EOF Fantasy Hip-Hop',    emoji: '🏆', path: '/fhhl',         color: '#F59E0B' },
      { label: 'DIY University',         emoji: '🎓', path: '/university',   color: '#60A5FA' },
      { label: 'EOF Library',            emoji: '📚', path: '/',             color: '#D4AF37' },
      { label: 'Film Studio',            emoji: '🎬', path: '/film-studio',  color: '#EF4444' },
      { label: 'Music Studio',           emoji: '🎵', path: '/music-studio', color: '#8B5CF6' },
      { label: 'Legacy Vault',           emoji: '🏛️', path: '/legacy-vault', color: '#A78BFA' },
      { label: 'BAC',                    emoji: '⭐', path: '/bac',          color: '#FBBF24' },
    ],
  },
  { id: 'studios', label: 'Studios' },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      { label: 'Active Projects',   emoji: '⚡', path: '/projects' },
      { label: 'Writing Projects',  emoji: '✍️', path: '/projects' },
      { label: 'Film Projects',     emoji: '🎬', path: '/film-studio' },
      { label: 'Music Projects',    emoji: '🎵', path: '/music-studio' },
      { label: 'Business Projects', emoji: '💼', path: '/projects' },
      { label: 'Archived Projects', emoji: '📦', path: '/projects' },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    items: [
      { label: 'Books',    emoji: '📖', path: '/library' },
      { label: 'Comics',   emoji: '🎨', path: '/library' },
      { label: 'Scripts',  emoji: '📝', path: '/library' },
      { label: 'Research', emoji: '🔬', path: '/library' },
      { label: 'Videos',   emoji: '🎥', path: '/library' },
      { label: 'Audio',    emoji: '🎧', path: '/library' },
      { label: 'Archives', emoji: '🗄️', path: '/akashic' },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    items: [
      { label: 'Teams',    emoji: '👥', path: '/fhhl/league' },
      { label: 'Artists',  emoji: '🎤', path: '/fhhl/league' },
      { label: 'Forums',   emoji: '💬', path: '/' },
      { label: 'Voting',   emoji: '🗳️', path: '/' },
      { label: 'Rankings', emoji: '📊', path: '/fhhl/league' },
      { label: 'Events',   emoji: '📅', path: '/' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    items: [
      { label: 'Music',      emoji: '🎵', path: '/music-studio' },
      { label: 'Film',       emoji: '🎬', path: '/film-studio' },
      { label: 'Podcasts',   emoji: '🎙️', path: '/radio' },
      { label: 'Radio',      emoji: '📻', path: '/radio' },
      { label: 'Streams',    emoji: '📺', path: '/streaming' },
      { label: 'Publishing', emoji: '📤', path: '/griot' },
    ],
  },
];

// ── Studios thumbnail dropdown ─────────────────────────────────────────────────
function StudiosDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  if (!isOpen) return null;
  return (
    <div
      className="absolute top-full left-0 mt-1 z-50 rounded-2xl border shadow-2xl overflow-hidden"
      style={{
        width: 380,
        background: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
          EOF Creative Studios
        </p>
      </div>

      {/* 2×2 card grid */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {STUDIOS.map(studio => (
          <button
            key={studio.id}
            onClick={() => { navigate(studio.path); onClose(); }}
            onMouseEnter={() => setHovered(studio.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative rounded-xl overflow-hidden text-left transition-all duration-200 group"
            style={{
              border: `1px solid ${hovered === studio.id ? studio.color + '50' : 'rgba(255,255,255,0.07)'}`,
              transform: hovered === studio.id ? 'translateY(-1px)' : 'none',
              boxShadow: hovered === studio.id ? `0 8px 24px ${studio.color}22` : 'none',
            }}
          >
            {/* Thumbnail area */}
            <div
              className="h-20 flex items-center justify-center relative overflow-hidden"
              style={{ background: studio.gradient }}
            >
              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, ${studio.patternColor} 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
              {/* Glow orb */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${studio.color}33, transparent 70%)`,
                }}
              />
              {/* Emoji logo */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-3xl" style={{ filter: `drop-shadow(0 0 12px ${studio.color}88)` }}>
                  {studio.emoji}
                </span>
              </div>
              {/* LIVE badge */}
              <div
                className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider"
                style={{ background: `${studio.color}22`, color: studio.color, border: `1px solid ${studio.color}44` }}
              >
                {studio.badge}
              </div>
            </div>

            {/* Info row */}
            <div
              className="px-2.5 py-2 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{studio.label}</p>
                <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {studio.desc}
                </p>
              </div>
              <FiArrowRight
                size={12}
                className="flex-shrink-0 ml-1 transition-transform duration-200"
                style={{
                  color: hovered === studio.id ? studio.color : 'rgba(255,255,255,0.2)',
                  transform: hovered === studio.id ? 'translateX(2px)' : 'none',
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => { navigate('/'); onClose(); }}
          className="text-[10px] transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          View all apps →
        </button>
      </div>
    </div>
  );
}

// ── Standard dropdown ──────────────────────────────────────────────────────────
function Dropdown({ nav, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] rounded-xl border overflow-hidden shadow-2xl"
         style={{ background: '#111', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
      {nav.id === 'systems' && (
        <div className="p-1">
          {nav.items.map(item => (
            <button key={item.path + item.label} onClick={() => { navigate(item.path); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-white/6 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                   style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                {item.emoji}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      )}
      {nav.id !== 'systems' && (
        <div className="py-1">
          {nav.items.map(item => (
            <button key={item.path + item.label} onClick={() => { navigate(item.path); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/6 group">
              <span className="text-base w-5 text-center">{item.emoji}</span>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Search overlay ─────────────────────────────────────────────────────────────
function SearchOverlay({ onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
         onClick={onClose}>
      <div className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
             style={{ background: '#111', borderColor: 'rgba(255,255,255,0.12)' }}>
          <FiSearch size={18} className="text-gray-500 flex-shrink-0"/>
          <input ref={ref} placeholder="Search systems, pages, projects…"
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-gray-600"
            onKeyDown={e => e.key === 'Escape' && onClose()}/>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
            <FiX size={16}/>
          </button>
        </div>
        <p className="text-center text-xs text-gray-700 mt-3">Press Esc to close</p>
      </div>
    </div>
  );
}

// ── EOFTopNav ─────────────────────────────────────────────────────────────────
export default function EOFTopNav({ accentColor = '#D4AF37', systemName, systemEmoji }) {
  const [openMenu, setOpenMenu]   = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggle(id) { setOpenMenu(prev => prev === id ? null : id); }

  return (
    <>
      <nav ref={navRef}
        className="h-12 flex-shrink-0 flex items-center px-4 gap-0 z-40 border-b"
        style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,0.07)' }}>

        {/* Logo / Home */}
        <Link to="/" className="flex items-center gap-2 mr-4 flex-shrink-0 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm text-white"
               style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
            E
          </div>
          <span className="text-xs font-bold hidden sm:block" style={{ color: accentColor }}>EOF</span>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-white/8 mr-4 flex-shrink-0"/>

        {/* System indicator (optional) */}
        {systemName && (
          <>
            <div className="flex items-center gap-1.5 mr-4 flex-shrink-0">
              {systemEmoji && <span className="text-sm">{systemEmoji}</span>}
              <span className="text-xs font-semibold text-gray-400">{systemName}</span>
            </div>
            <div className="w-px h-4 bg-white/8 mr-4 flex-shrink-0 hidden sm:block"/>
          </>
        )}

        {/* Nav items with dropdowns */}
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(nav => (
            <div key={nav.id} className="relative flex-shrink-0">
              <button onClick={() => toggle(nav.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  openMenu === nav.id ? 'text-white bg-white/8' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}>
                {nav.label}
                <FiChevronDown size={11} className={`transition-transform ${openMenu === nav.id ? 'rotate-180' : ''}`}/>
              </button>

              {nav.id === 'studios'
                ? <StudiosDropdown isOpen={openMenu === 'studios'} onClose={() => setOpenMenu(null)}/>
                : <Dropdown nav={nav} isOpen={openMenu === nav.id} onClose={() => setOpenMenu(null)}/>
              }
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button onClick={() => setShowSearch(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all">
            <FiSearch size={15}/>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all relative">
            <FiBell size={15}/>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accentColor }}/>
          </button>
          <Link to="/membership"
            className="w-8 h-8 flex items-center justify-center rounded-full border transition-all hover:border-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <FiUser size={13} className="text-gray-400"/>
          </Link>
        </div>
      </nav>

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)}/>}
    </>
  );
}

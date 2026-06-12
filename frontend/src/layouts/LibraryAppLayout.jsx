import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiHome, FiBook, FiFolder, FiPlay, FiGlobe,
  FiCommand, FiGrid, FiArrowLeft, FiUser, FiChevronRight,
  FiEdit3, FiStar
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';

const LIBRARY_NAV = [
  { path: '/',               icon: FiHome,    label: 'Dashboard',      end: true },
  { path: '/library',        icon: FiBook,    label: 'Library'         },
  { path: '/bookshelves',    icon: FiFolder,  label: 'My Bookshelves'  },
  { path: '/story-time',     icon: FiPlay,    label: 'Story Time'      },
  { path: '/gutenberg',      icon: FiGlobe,   label: 'Gutenberg'       },
  { path: '/command-center', icon: FiCommand, label: 'Command Center'  },
];

const ACCOUNT_NAV = [
  { path: '/creator',    icon: FiEdit3, label: 'Creator Studio' },
  { path: '/membership', icon: FiStar,  label: 'Membership'     },
];

// ── Library logo ──────────────────────────────────────────────────────────────
function LibraryLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="w-full h-full rounded-xl flex items-center justify-center font-serif font-bold text-eof-dark text-lg"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #A8892A)', boxShadow: '0 0 12px rgba(212,175,55,0.3)' }}>
          E
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-eof-crimson border-2"
          style={{ borderColor: '#0a0a0a' }} />
      </div>
      <div className="leading-none">
        <p className="font-serif text-base text-eof-gold font-bold tracking-wide">EOF Library</p>
        <p className="text-[10px] tracking-widest uppercase mt-0.5 text-gray-500">Digital Library</p>
      </div>
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────────────
function NavItem({ item, onClose }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-xl mx-2 transition-all text-sm ${
          isActive
            ? 'text-eof-gold font-medium'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
      style={({ isActive }) => isActive ? {
        background: 'rgba(212,175,55,0.10)',
        border: '1px solid rgba(212,175,55,0.20)',
      } : {}}
    >
      <item.icon size={15} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
function DesktopSidebar() {
  return (
    <aside className="w-60 flex-shrink-0 hidden lg:flex flex-col h-full overflow-y-auto"
      style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="p-4 border-b border-white/6">
        <LibraryLogo />
      </div>

      <div className="flex-1 py-3 space-y-0.5">
        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-600 px-5 mb-2 pt-1">
          Library
        </p>
        {LIBRARY_NAV.map(item => (
          <NavItem key={item.path} item={item} onClose={() => {}} />
        ))}

        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-600 px-5 mb-2 pt-4">
          Create
        </p>
        {ACCOUNT_NAV.map(item => (
          <NavItem key={item.path} item={item} onClose={() => {}} />
        ))}
      </div>

      <div className="p-3 border-t border-white/6 space-y-1">
        <NavLink to="/widgets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
              isActive ? 'text-eof-gold bg-eof-gold/8' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`
          }>
          <FiGrid size={13} /> Widget Gallery
        </NavLink>
        <Link to="/ecosystem"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors">
          <FiArrowLeft size={13} /> EOF Platform
        </Link>
      </div>
    </aside>
  );
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose} />
          <motion.aside key="drawer"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full z-50 w-72 flex flex-col overflow-y-auto"
            style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)' }}>

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <LibraryLogo />
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8">
                <FiX size={18} />
              </button>
            </div>

            <nav className="flex-1 py-3">
              <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 px-5 mb-2">Library</p>
              {LIBRARY_NAV.map(item => (
                <NavItem key={item.path} item={item} onClose={onClose} />
              ))}
              <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 px-5 mb-2 mt-4">Create</p>
              {ACCOUNT_NAV.map(item => (
                <NavItem key={item.path} item={item} onClose={onClose} />
              ))}
            </nav>

            <div className="p-3 border-t border-white/6 space-y-1">
              <NavLink to="/widgets" onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                <FiGrid size={13} /> Widget Gallery
              </NavLink>
              <Link to="/ecosystem" onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors">
                <FiArrowLeft size={13} /> EOF Platform
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────
function TopBar({ onMenu }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const crumb = segments.length > 0
    ? segments[segments.length - 1].replace(/-/g, ' ')
    : null;

  return (
    <header className="h-14 flex-shrink-0 flex items-center px-4 md:px-6 gap-3 z-30 border-b border-white/6"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>

      <button onClick={onMenu}
        className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all">
        <FiMenu size={20} />
      </button>

      <LibraryLogo />

      {crumb && (
        <div className="hidden md:flex items-center gap-2 text-gray-600">
          <FiChevronRight size={13} />
          <span className="text-sm text-gray-400 capitalize truncate max-w-[200px]">{crumb}</span>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-eof-gold transition-colors relative">
          <FiBell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-eof-crimson" />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 border border-white/15 hover:border-eof-gold/40 transition-colors cursor-pointer"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(192,57,43,0.15))' }}>
          <FiUser size={14} />
        </div>
      </div>
    </header>
  );
}

// ── Root layout ───────────────────────────────────────────────────────────────
export default function LibraryAppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      <EOFTopNav accentColor="#D4AF37" systemName="EOF Library" systemEmoji="📚"/>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex flex-1 min-h-0">
        {/* Mobile menu button */}
        <button onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-6 left-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
          style={{ background: '#111', borderColor: 'rgba(212,175,55,0.28)', color: '#D4AF37' }}>
          <FiMenu size={18}/>
        </button>
        <DesktopSidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

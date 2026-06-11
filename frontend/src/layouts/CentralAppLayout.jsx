import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGrid, FiArrowLeft, FiBell, FiUser, FiChevronRight, FiShield, FiLock } from 'react-icons/fi';
import { AGENT_SYSTEMS } from '../data/agentData';

const NAV_SYSTEMS = AGENT_SYSTEMS.filter(s => s.id !== 'central').slice(0, 8);

function CentralLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="w-full h-full rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #A8892A)', boxShadow: '0 0 12px rgba(212,175,55,0.35)' }}>
          🏛️
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: '#D4AF37', borderColor: '#0a0a0a' }} />
      </div>
      <div className="leading-none">
        <p className="font-serif text-base text-white font-bold tracking-wide">EOF Central</p>
        <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: '#D4AF37' }}>
          AI Hub
        </p>
      </div>
    </div>
  );
}

function DesktopSidebar() {
  return (
    <aside className="w-60 flex-shrink-0 hidden lg:flex flex-col h-full overflow-y-auto"
      style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="p-4 border-b border-white/6">
        <CentralLogo />
      </div>

      {/* Main nav */}
      <div className="p-3 border-b border-white/6">
        <NavLink to="/central" end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-2xl border transition-all ${
              isActive ? '' : 'border-transparent hover:bg-white/5 hover:border-white/10'
            }`
          }
          style={({ isActive }) => isActive ? {
            background: 'rgba(212,175,55,0.10)',
            borderColor: 'rgba(212,175,55,0.28)',
          } : {}}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
            🏛️
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white">Dashboard</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#D4AF37' }}>Master Coordinator</p>
          </div>
        </NavLink>
      </div>

      {/* Systems directory */}
      <div className="flex-1 py-3 overflow-y-auto">
        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-600 px-5 mb-2">
          Systems
        </p>
        <div className="space-y-0.5">
          {NAV_SYSTEMS.map(sys => (
            <Link key={sys.id} to={sys.path}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl mx-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="text-base w-5 text-center flex-shrink-0">{sys.emoji}</span>
              <span className="truncate text-xs">{sys.shortName}</span>
              <span className="ml-auto text-[9px] text-gray-600">{sys.agents.length}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom links */}
      <div className="p-3 border-t border-white/6 space-y-1">
        <NavLink to="/central/widgets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
              isActive
                ? 'bg-amber-900/20 border border-amber-500/30'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`
          }
          style={({ isActive }) => ({ color: isActive ? '#D4AF37' : '' })}
        >
          <FiGrid size={13} /> Widget Gallery
        </NavLink>
        <Link to="/membership"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <FiLock size={13} /> Membership
        </Link>
        <Link to="/ecosystem"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 transition-colors">
          <FiArrowLeft size={13} /> EOF Platform
        </Link>
      </div>
    </aside>
  );
}

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
              <CentralLogo />
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-3 border-b border-white/6">
              <NavLink to="/central" end onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  🏛️
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Dashboard</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#D4AF37' }}>Master Coordinator</p>
                </div>
              </NavLink>
            </div>

            <nav className="flex-1 py-3 overflow-y-auto">
              <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 px-5 mb-2">Systems</p>
              {NAV_SYSTEMS.map(sys => (
                <Link key={sys.id} to={sys.path} onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl mx-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <span className="text-base w-5 text-center flex-shrink-0">{sys.emoji}</span>
                  <span className="truncate text-xs">{sys.shortName}</span>
                  <span className="ml-auto text-[9px] text-gray-600">{sys.agents.length}</span>
                </Link>
              ))}
            </nav>

            <div className="p-3 border-t border-white/6 space-y-1">
              <NavLink to="/central/widgets" onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                <FiGrid size={13} /> Widget Gallery
              </NavLink>
              <Link to="/membership" onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                <FiLock size={13} /> Membership
              </Link>
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

function TopBar({ onMenu }) {
  const location = useLocation();
  const segments = location.pathname.replace('/central', '').split('/').filter(Boolean);
  const crumb = segments.length > 0 ? segments[segments.length - 1].replace(/-/g, ' ') : null;

  return (
    <header className="h-14 flex-shrink-0 flex items-center px-4 md:px-6 gap-3 z-30 border-b border-white/6"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>

      <button onClick={onMenu}
        className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all">
        <FiMenu size={20} />
      </button>

      <CentralLogo />

      {crumb && (
        <div className="hidden md:flex items-center gap-2 text-gray-600">
          <FiChevronRight size={13} />
          <span className="text-sm text-gray-400 capitalize truncate max-w-[200px]">{crumb}</span>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 transition-colors relative"
          onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
          onMouseLeave={e => e.currentTarget.style.color = ''}
        >
          <FiBell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 border border-white/15 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,134,11,0.15))' }}>
          <FiUser size={14} />
        </div>
      </div>
    </header>
  );
}

export default function CentralAppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      <TopBar onMenu={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex flex-1 min-h-0">
        <DesktopSidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

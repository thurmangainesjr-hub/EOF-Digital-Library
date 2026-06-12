/**
 * Film Studio Layout — 3-Layer Navigation (EOF Ecosystem UI/UX Canon)
 */
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronDown, FiChevronLeft,
  FiGrid, FiFilm, FiFolder, FiImage, FiSend, FiSettings, FiEdit3,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';

const ACCENT        = '#EF4444';
const ACCENT_SOFT   = 'rgba(239,68,68,0.10)';
const ACCENT_BORDER = 'rgba(239,68,68,0.28)';

const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid,   path: '/film-studio', exact: true },
  {
    id: 'projects', label: 'Projects', icon: FiFilm,
    children: [
      { label: 'All Projects',   path: '/film-studio',         icon: '🎬' },
      { label: 'Active',         path: '/film-studio',         icon: '▶️' },
      { label: 'In Development', path: '/film-studio',         icon: '✏️' },
      { label: 'Completed',      path: '/film-studio',         icon: '✅' },
    ],
  },
  {
    id: 'editor', label: 'Editor', icon: FiEdit3,
    children: [
      { label: 'Film Editor',    path: '/film-editor',         icon: '🎞️' },
      { label: 'Script Editor',  path: '/film-studio',         icon: '📝' },
      { label: 'Storyboard',     path: '/film-studio',         icon: '🖼️' },
      { label: 'Timeline',       path: '/film-studio',         icon: '📅' },
    ],
  },
  {
    id: 'assets', label: 'Assets', icon: FiFolder,
    children: [
      { label: 'Media Library',  path: '/film-studio',         icon: '📁' },
      { label: 'Audio',          path: '/film-studio',         icon: '🎵' },
      { label: 'Images',         path: '/film-studio',         icon: '🖼️' },
      { label: 'Stock Footage',  path: '/film-studio',         icon: '🎥' },
    ],
  },
  {
    id: 'distribution', label: 'Distribution', icon: FiSend,
    children: [
      { label: 'Streaming',      path: '/streaming',           icon: '📺' },
      { label: 'Download',       path: '/film-studio',         icon: '⬇️' },
      { label: 'Griot AI',       path: '/griot',               icon: '🌀' },
    ],
  },
];

function FilmLogo({ collapsed }) {
  return (
    <div className={`flex items-center gap-3 select-none ${collapsed ? 'justify-center' : ''}`}>
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="w-full h-full rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #EF4444, #7F1D1D)', boxShadow: '0 0 12px rgba(239,68,68,0.3)' }}>
          🎬
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: '#10B981', borderColor: '#0a0a0a' }} />
      </div>
      {!collapsed && (
        <div className="leading-none min-w-0">
          <p className="font-serif text-sm text-white font-bold tracking-wide">Film Studio</p>
          <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: ACCENT }}>by EOF</p>
        </div>
      )}
    </div>
  );
}

function NavSection({ item, collapsed, openId, setOpenId }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const isOpen    = openId === item.id;
  const hasKids   = !!item.children;
  const childActive = hasKids && item.children.some(c =>
    location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
  const selfActive  = !hasKids && (
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path));
  const isHighlighted = selfActive || childActive;

  return (
    <div>
      <button onClick={() => hasKids ? setOpenId(isOpen ? null : item.id) : navigate(item.path)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
          isHighlighted ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        }`}
        style={isHighlighted
          ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }
          : { border: '1px solid transparent' }}>
        <item.icon size={15} className="flex-shrink-0" style={{ color: isHighlighted ? ACCENT : undefined }}/>
        {!collapsed && (
          <>
            <span className="text-xs font-medium flex-1 truncate">{item.label}</span>
            {hasKids && <FiChevronDown size={11} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: isHighlighted ? ACCENT : '#4B5563' }}/>}
          </>
        )}
      </button>
      {hasKids && !collapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden pl-3 mt-0.5">
              <div className="border-l ml-4 pl-3 py-1 space-y-0.5" style={{ borderColor: `${ACCENT}30` }}>
                {item.children.map(child => {
                  const active = location.pathname === child.path;
                  return (
                    <button key={child.label} onClick={() => navigate(child.path)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                        active ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
                      }`}>
                      <span className="text-xs w-4 text-center">{child.icon}</span>
                      <span className="text-xs truncate">{child.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function DesktopSidebar({ collapsed, setCollapsed }) {
  const [openId, setOpenId] = useState('projects');
  return (
    <aside className={`flex-shrink-0 hidden lg:flex flex-col h-full overflow-hidden transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
      style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className={`flex items-center border-b border-white/6 h-12 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-3 gap-2'}`}>
        <FilmLogo collapsed={collapsed}/>
        {!collapsed && <div className="flex-1"/>}
        <button onClick={() => setCollapsed(c => !c)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all flex-shrink-0">
          <FiChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}/>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {SIDEBAR_NAV.map(item => (
          <NavSection key={item.id} item={item} collapsed={collapsed} openId={openId} setOpenId={setOpenId}/>
        ))}
      </nav>
      <div className="px-2 pb-3 pt-2 border-t border-white/6 space-y-0.5">
        <NavLink to="/film-studio/widgets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${collapsed ? 'justify-center' : ''} ${
              isActive ? 'text-red-300 bg-red-900/20' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
            }`
          } title={collapsed ? 'Widgets' : undefined}>
          <FiGrid size={13}/>{!collapsed && <span>Widgets</span>}
        </NavLink>
        <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-700 hover:text-gray-500 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Settings' : undefined}>
          <FiSettings size={13}/>{!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

function MobileDrawer({ open, onClose }) {
  const [openId, setOpenId] = useState('projects');
  const location = useLocation();
  useEffect(() => { if (!open) return; const h = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [open, onClose]);
  useEffect(() => { onClose(); }, [location.pathname]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
          <motion.aside key="drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full z-50 w-64 flex flex-col overflow-y-auto"
            style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-4 h-12 border-b border-white/8 flex-shrink-0">
              <FilmLogo collapsed={false}/>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8"><FiX size={16}/></button>
            </div>
            <nav className="flex-1 py-3 space-y-0.5 px-2">
              {SIDEBAR_NAV.map(item => <NavSection key={item.id} item={item} collapsed={false} openId={openId} setOpenId={setOpenId}/>)}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function FilmStudioAppLayout() {
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      <EOFTopNav accentColor={ACCENT} systemName="Film Studio" systemEmoji="🎬"/>
      <div className="flex flex-1 min-h-0">
        <button onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-6 left-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
          style={{ background: '#111', borderColor: ACCENT_BORDER, color: ACCENT }}>
          <FiMenu size={18}/>
        </button>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>
        <main className="flex-1 overflow-y-auto min-w-0"><Outlet/></main>
      </div>
    </div>
  );
}

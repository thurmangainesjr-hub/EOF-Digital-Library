/**
 * EOF Central AI Hub Layout — Command Center Shell
 * Gold (#D4AF37) accent · Collapsible sidebar · Full ecosystem nav
 */
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronDown, FiChevronLeft,
  FiGrid, FiZap, FiUsers, FiActivity, FiSettings,
  FiLock, FiGlobe, FiStar,
} from 'react-icons/fi';
import { AGENT_SYSTEMS, SYSTEM_META } from '../data/agentData';
import CentralIntro, { hasSeenCentralIntro } from '../components/CentralIntro';

const ACCENT        = '#D4AF37';
const ACCENT_SOFT   = 'rgba(212,175,55,0.10)';
const ACCENT_BORDER = 'rgba(212,175,55,0.28)';

const ALL_SYSTEMS = AGENT_SYSTEMS.filter(s => s.id !== 'central');

const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Command Center', icon: FiGrid, path: '/central', exact: true },
  {
    id: 'systems', label: 'Ecosystem', icon: FiGlobe,
    children: ALL_SYSTEMS.map(s => ({
      label: s.shortName,
      path: s.path,
      icon: s.emoji,
      appUrl: SYSTEM_META[s.id]?.appUrl || null,
    })),
  },
  {
    id: 'agents', label: 'Core Agents', icon: FiUsers,
    children: [
      { label: 'Agent Roster',      path: '/central/roster',             icon: '⚡' },
      { label: 'EOF Orchestrator',  path: '/central/agent/eof-orchestrator', icon: '🏛️' },
      { label: 'Mission Planner',   path: '/central/agent/mission-planner',  icon: '🗺️' },
      { label: 'Knowledge Weaver',  path: '/central/agent/knowledge-weaver', icon: '🕸️' },
    ],
  },
  {
    id: 'tools', label: 'Tools', icon: FiZap,
    children: [
      { label: 'Skills Hub',        path: '/central/skills', icon: '⚡' },
      { label: 'Agent Spawner',     path: '/central', icon: '🤖' },
      { label: 'System Monitor',    path: '/central', icon: '📡' },
      { label: 'Membership',        path: '/membership', icon: '🔑' },
      { label: 'Full Ecosystem',    path: '/ecosystem', icon: '🌐' },
    ],
  },
];

// ── Logo ──────────────────────────────────────────────────────────────────────
function CentralLogo({ collapsed }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${collapsed ? 'justify-center' : ''}`}>
      {/* Logo mark — hexagonal hub */}
      <div className="relative flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F0CC5A" />
              <stop offset="100%" stopColor="#A8892A" />
            </linearGradient>
          </defs>
          {/* Hexagon */}
          <polygon points="17,2 31,9.5 31,24.5 17,32 3,24.5 3,9.5"
            fill="url(#cg)" opacity="0.15" />
          <polygon points="17,2 31,9.5 31,24.5 17,32 3,24.5 3,9.5"
            fill="none" stroke="url(#cg)" strokeWidth="1.2" />
          {/* Hub spokes */}
          <circle cx="17" cy="17" r="3.5" fill="url(#cg)" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = deg * Math.PI / 180;
            const x2 = 17 + Math.cos(r) * 9;
            const y2 = 17 + Math.sin(r) * 9;
            return <line key={i} x1="17" y1="17" x2={x2} y2={y2}
              stroke="url(#cg)" strokeWidth="0.8" opacity="0.6" />;
          })}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = deg * Math.PI / 180;
            const x = 17 + Math.cos(r) * 9;
            const y = 17 + Math.sin(r) * 9;
            return <circle key={i} cx={x} cy={y} r="1.8" fill="url(#cg)" opacity="0.7" />;
          })}
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 animate-pulse"
          style={{ background: ACCENT, borderColor: '#0a0a0a' }} />
      </div>
      {!collapsed && (
        <div className="leading-none min-w-0">
          <p className="font-bold text-sm text-white tracking-wide">E.O.F Central</p>
          <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: ACCENT }}>AI Hub</p>
        </div>
      )}
    </div>
  );
}

// ── Nav item ─────────────────────────────────────────────────────────────────
function NavSection({ item, collapsed, openId, setOpenId }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const isOpen    = openId === item.id;
  const hasKids   = !!item.children;
  const childActive = hasKids && item.children.some(c =>
    location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
  const selfActive  = !hasKids && (item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path));
  const highlighted = selfActive || childActive;

  return (
    <div>
      <button
        onClick={() => hasKids ? setOpenId(isOpen ? null : item.id) : navigate(item.path)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left group ${
          highlighted ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        }`}
        style={highlighted
          ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }
          : { border: '1px solid transparent' }}
      >
        <item.icon size={15} className="flex-shrink-0" style={{ color: highlighted ? ACCENT : undefined }} />
        {!collapsed && (
          <>
            <span className="text-xs font-medium flex-1 truncate">{item.label}</span>
            {hasKids && (
              <FiChevronDown size={11} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: highlighted ? ACCENT : '#4B5563' }} />
            )}
          </>
        )}
      </button>

      {hasKids && !collapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
              className="overflow-hidden pl-3 mt-0.5">
              <div className="border-l ml-4 pl-3 py-1 space-y-0.5"
                style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                {item.children.map(child => {
                  const active = location.pathname === child.path;
                  const handleClick = () => {
                    if (child.appUrl) window.open(child.appUrl, '_blank');
                    else navigate(child.path);
                  };
                  return (
                    <button key={child.label} onClick={handleClick}
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

// ── Desktop sidebar ────────────────────────────────────────────────────────────
function DesktopSidebar({ collapsed, setCollapsed }) {
  const [openId, setOpenId] = useState('systems');

  return (
    <aside
      className={`flex-shrink-0 hidden lg:flex flex-col h-full overflow-hidden transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}
      style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo + collapse */}
      <div className={`flex items-center border-b border-white/6 h-14 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-4 gap-2'}`}>
        <CentralLogo collapsed={collapsed} />
        {!collapsed && <div className="flex-1" />}
        <button onClick={() => setCollapsed(c => !c)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all flex-shrink-0">
          <FiChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {SIDEBAR_NAV.map(item => (
          <NavSection key={item.id} item={item} collapsed={collapsed} openId={openId} setOpenId={setOpenId} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 pt-2 border-t border-white/6 space-y-0.5">
        <NavLink to="/central/widgets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${collapsed ? 'justify-center' : ''} ${
              isActive ? 'text-amber-300 bg-amber-900/20' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
            }`
          }
          title={collapsed ? 'Widgets' : undefined}
          style={({ isActive }) => isActive ? { border: `1px solid rgba(212,175,55,0.3)` } : {}}
        >
          <FiGrid size={13} />
          {!collapsed && <span>Widgets</span>}
        </NavLink>
        <NavLink to="/central"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-700 hover:text-gray-500 hover:bg-white/5 transition-all"
          title={collapsed ? 'Settings' : undefined}
        >
          <FiSettings size={13} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}

// ── Mobile drawer ──────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose }) {
  const [openId, setOpenId] = useState('systems');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  useEffect(() => { onClose(); }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.aside key="drawer"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full z-50 w-64 flex flex-col overflow-y-auto"
            style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/8 flex-shrink-0">
              <CentralLogo collapsed={false} />
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8">
                <FiX size={16} />
              </button>
            </div>
            <nav className="flex-1 py-3 space-y-0.5 px-2">
              {SIDEBAR_NAV.map(item => (
                <NavSection key={item.id} item={item} collapsed={false} openId={openId} setOpenId={setOpenId} />
              ))}
            </nav>
            <div className="px-2 pb-4 pt-2 border-t border-white/6 space-y-0.5">
              <NavLink to="/central/widgets" onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive ? 'text-amber-300 bg-amber-900/20' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                  }`
                }>
                <FiGrid size={13} /> Widgets
              </NavLink>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Root layout ────────────────────────────────────────────────────────────────
export default function CentralAppLayout() {
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [introSeen, setIntroSeen] = useState(() => hasSeenCentralIntro());

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      {!introSeen && <CentralIntro onDone={() => setIntroSeen(true)} />}
      <button onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
        style={{ background: '#111', borderColor: ACCENT_BORDER, color: ACCENT }}>
        <FiMenu size={18} />
      </button>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

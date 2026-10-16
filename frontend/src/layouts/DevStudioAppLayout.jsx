/**
 * EOF Development Studios Layout
 * Electric Cyan · Deep Navy · 3-layer nav: EOFTopNav | Sidebar | Workspace
 */
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronDown, FiChevronLeft,
  FiMonitor, FiBriefcase, FiCode, FiCpu, FiCheckSquare,
  FiShield, FiCloud, FiUsers, FiPackage, FiBook,
  FiActivity, FiGrid, FiSettings, FiZap,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import DevStudioIntro, { hasSeenDevStudioIntro } from '../components/DevStudioIntro';

const CYAN        = '#06B6D4';
const CYAN_SOFT   = 'rgba(6,182,212,0.10)';
const CYAN_BORDER = 'rgba(6,182,212,0.28)';
const BG          = '#020918';
const SIDEBAR_BG  = '#030D1C';

const SIDEBAR_NAV = [
  { id: 'command',    label: 'Command Center',   icon: FiMonitor,    path: '/dev-studio',             exact: true },
  { id: 'team',       label: 'Dev Team',         icon: FiUsers,      path: '/dev-studio/team' },
  {
    id: 'leadership', label: 'Executive Suite',  icon: FiBriefcase,
    children: [
      { label: 'CEO AI',   path: '/dev-studio/executive/ceo',   icon: '🏛️' },
      { label: 'CTO AI',   path: '/dev-studio/executive/cto',   icon: '⚙️' },
      { label: 'COO AI',   path: '/dev-studio/executive/coo',   icon: '📊' },
      { label: 'CFO AI',   path: '/dev-studio/executive/cfo',   icon: '💰' },
    ],
  },
  {
    id: 'engineering', label: 'Engineering',     icon: FiCode,
    children: [
      { label: 'System Architect',  path: '/dev-studio/engineering', icon: '🏗️' },
      { label: 'Full Stack',        path: '/dev-studio/engineering', icon: '⚡' },
      { label: 'Frontend',          path: '/dev-studio/engineering', icon: '🎨' },
      { label: 'Backend',           path: '/dev-studio/engineering', icon: '🔧' },
      { label: 'Database',          path: '/dev-studio/engineering', icon: '🗄️' },
      { label: 'Mobile',            path: '/dev-studio/engineering', icon: '📱' },
    ],
  },
  {
    id: 'ai-division', label: 'AI Division',     icon: FiCpu,
    children: [
      { label: 'AI Engineer',       path: '/dev-studio/ai-division', icon: '🤖' },
      { label: 'Agent Architect',   path: '/dev-studio/ai-division', icon: '🧠' },
      { label: 'Prompt Engineer',   path: '/dev-studio/ai-division', icon: '💬' },
      { label: 'Agent Orchestrator',path: '/dev-studio/ai-division', icon: '🕸️' },
      { label: 'Knowledge Engineer',path: '/dev-studio/ai-division', icon: '📚' },
    ],
  },
  {
    id: 'qa',          label: 'Quality Assurance',icon: FiCheckSquare,
    children: [
      { label: 'QA Director',       path: '/dev-studio/qa', icon: '✅' },
      { label: 'Auto Testing',      path: '/dev-studio/qa', icon: '🔁' },
      { label: 'Debug Specialist',  path: '/dev-studio/qa', icon: '🐛' },
      { label: 'UX Tester',         path: '/dev-studio/qa', icon: '👤' },
    ],
  },
  {
    id: 'security',    label: 'Security',         icon: FiShield,
    children: [
      { label: 'Security Director', path: '/dev-studio/security', icon: '🛡️' },
      { label: 'Pen Testing',       path: '/dev-studio/security', icon: '🔓' },
      { label: 'Compliance',        path: '/dev-studio/security', icon: '📋' },
      { label: 'Identity Mgmt',     path: '/dev-studio/security', icon: '🔑' },
    ],
  },
  {
    id: 'cloud',       label: 'Cloud Operations', icon: FiCloud,
    children: [
      { label: 'DevOps',            path: '/dev-studio/cloud', icon: '☁️' },
      { label: 'Deployment',        path: '/dev-studio/cloud', icon: '🚀' },
      { label: 'Monitoring',        path: '/dev-studio/cloud', icon: '📡' },
      { label: 'Disaster Recovery', path: '/dev-studio/cloud', icon: '🔄' },
    ],
  },
  {
    id: 'clients',     label: 'Client Services',  icon: FiUsers,
    children: [
      { label: 'Business Analyst',  path: '/dev-studio/clients', icon: '📊' },
      { label: 'Product Manager',   path: '/dev-studio/clients', icon: '🗺️' },
      { label: 'Project Manager',   path: '/dev-studio/clients', icon: '📌' },
      { label: 'Client Success',    path: '/dev-studio/clients', icon: '🤝' },
    ],
  },
  {
    id: 'factories',   label: 'Dev Factories',    icon: FiPackage,
    children: [
      { label: 'SaaS Factory',      path: '/dev-studio/factories', icon: '⚡' },
      { label: 'Website Factory',   path: '/dev-studio/factories', icon: '🌐' },
      { label: 'AI Factory',        path: '/dev-studio/factories', icon: '🤖' },
      { label: 'Mobile Factory',    path: '/dev-studio/factories', icon: '📱' },
      { label: 'Automation Factory',path: '/dev-studio/factories', icon: '🔁' },
      { label: 'Game Factory',      path: '/dev-studio/factories', icon: '🎮' },
    ],
  },
  {
    id: 'knowledge',   label: 'Knowledge Center', icon: FiBook,
    children: [
      { label: 'Documentation',     path: '/dev-studio/knowledge', icon: '📄' },
      { label: 'Standards',         path: '/dev-studio/knowledge', icon: '📐' },
      { label: 'Templates',         path: '/dev-studio/knowledge', icon: '🗂️' },
      { label: 'Previous Projects', path: '/dev-studio/knowledge', icon: '🗃️' },
    ],
  },
  {
    id: 'rnd',         label: 'R&D Lab',          icon: FiActivity,
    children: [
      { label: 'AI Research',       path: '/dev-studio/rnd', icon: '🧬' },
      { label: 'XR / Robotics',     path: '/dev-studio/rnd', icon: '🥽' },
      { label: 'Cybersecurity',     path: '/dev-studio/rnd', icon: '🔐' },
      { label: 'Game Tech',         path: '/dev-studio/rnd', icon: '🎮' },
    ],
  },
];

/* ── Logo ──────────────────────────────────────────────────────────────────── */
function DevLogo({ collapsed }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${collapsed ? 'justify-center' : ''}`}>
      <div className="relative flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <defs>
            <linearGradient id="dg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE"/>
              <stop offset="100%" stopColor="#0284C7"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="30" height="30" rx="6" fill="url(#dg)" opacity="0.12"/>
          <rect x="2" y="2" width="30" height="30" rx="6" fill="none" stroke="url(#dg)" strokeWidth="1.2"/>
          {/* Circuit board pattern */}
          <circle cx="17" cy="17" r="4" fill="none" stroke="url(#dg)" strokeWidth="1.2"/>
          <circle cx="17" cy="17" r="1.8" fill="url(#dg)"/>
          <line x1="17" y1="6"  x2="17" y2="13" stroke="url(#dg)" strokeWidth="1" opacity="0.7"/>
          <line x1="17" y1="21" x2="17" y2="28" stroke="url(#dg)" strokeWidth="1" opacity="0.7"/>
          <line x1="6"  y1="17" x2="13" y2="17" stroke="url(#dg)" strokeWidth="1" opacity="0.7"/>
          <line x1="21" y1="17" x2="28" y2="17" stroke="url(#dg)" strokeWidth="1" opacity="0.7"/>
          <circle cx="17" cy="6"  r="1.2" fill="url(#dg)" opacity="0.8"/>
          <circle cx="17" cy="28" r="1.2" fill="url(#dg)" opacity="0.8"/>
          <circle cx="6"  cy="17" r="1.2" fill="url(#dg)" opacity="0.8"/>
          <circle cx="28" cy="17" r="1.2" fill="url(#dg)" opacity="0.8"/>
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
          style={{ background: CYAN, borderColor: BG }}/>
      </div>
      {!collapsed && (
        <div className="leading-none min-w-0">
          <p className="font-bold text-xs text-white tracking-wide">EOF Dev Studios</p>
          <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: CYAN }}>Build · Deploy · Scale</p>
        </div>
      )}
    </div>
  );
}

/* ── Nav section ─────────────────────────────────────────────────────────── */
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
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
          highlighted ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        }`}
        style={highlighted
          ? { background: CYAN_SOFT, border: `1px solid ${CYAN_BORDER}` }
          : { border: '1px solid transparent' }}>
        <item.icon size={14} className="flex-shrink-0" style={{ color: highlighted ? CYAN : undefined }}/>
        {!collapsed && (
          <>
            <span className="text-xs font-medium flex-1 truncate">{item.label}</span>
            {hasKids && (
              <FiChevronDown size={11} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: highlighted ? CYAN : '#4B5563' }}/>
            )}
          </>
        )}
      </button>

      {hasKids && !collapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }}
              className="overflow-hidden pl-3 mt-0.5">
              <div className="border-l ml-4 pl-3 py-1 space-y-0.5"
                style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
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

/* ── Desktop sidebar ─────────────────────────────────────────────────────── */
function DesktopSidebar({ collapsed, setCollapsed }) {
  const [openId, setOpenId] = useState('command');
  return (
    <aside className={`flex-shrink-0 hidden lg:flex flex-col h-full overflow-hidden transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}
      style={{ background: SIDEBAR_BG, borderRight: '1px solid rgba(6,182,212,0.08)' }}>

      <div className={`flex items-center border-b h-12 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-3 gap-2'}`}
        style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
        <DevLogo collapsed={collapsed}/>
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

      <div className="px-2 pb-3 pt-2 space-y-0.5" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
        <NavLink to="/dev-studio/widgets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${collapsed ? 'justify-center' : ''} ${
              isActive ? 'text-cyan-300 bg-cyan-900/20' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
            }`
          }
          title={collapsed ? 'Widgets' : undefined}>
          <FiGrid size={13}/>{!collapsed && <span>Widgets</span>}
        </NavLink>
        <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-700 hover:text-gray-500 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <FiSettings size={13}/>{!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── Mobile drawer ───────────────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const [openId, setOpenId] = useState('command');
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
            style={{ background: SIDEBAR_BG, borderRight: '1px solid rgba(6,182,212,0.1)' }}>
            <div className="flex items-center justify-between px-4 h-12 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
              <DevLogo collapsed={false}/>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8">
                <FiX size={16}/>
              </button>
            </div>
            <nav className="flex-1 py-3 space-y-0.5 px-2">
              {SIDEBAR_NAV.map(item => (
                <NavSection key={item.id} item={item} collapsed={false} openId={openId} setOpenId={setOpenId}/>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Root layout ─────────────────────────────────────────────────────────── */
export default function DevStudioAppLayout() {
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [introSeen, setIntroSeen] = useState(() => hasSeenDevStudioIntro());

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: BG }}>
      {!introSeen && <DevStudioIntro onDone={() => setIntroSeen(true)} />}
      <EOFTopNav accentColor={CYAN} systemName="Dev Studios" systemEmoji="⚡"/>

      <div className="flex flex-1 min-h-0">
        <button onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-6 left-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
          style={{ background: '#040E1F', borderColor: CYAN_BORDER, color: CYAN }}>
          <FiMenu size={18}/>
        </button>

        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>

        <main className="flex-1 overflow-y-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

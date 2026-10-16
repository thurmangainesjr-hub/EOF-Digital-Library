/**
 * EOF Growth Intelligence Suite Layout
 * Emerald + Teal · 3-layer nav: EOFTopNav | Sidebar | Workspace
 */
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronDown, FiChevronLeft,
  FiTrendingUp, FiSearch, FiSpeaker, FiFileText,
  FiDollarSign, FiUsers, FiBarChart2, FiGrid,
  FiSettings, FiZap, FiGlobe, FiRadio,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import GrowthIntro, { hasSeenGrowthIntro } from '../components/GrowthIntro';

const EMERALD        = '#10B981';
const EMERALD_SOFT   = 'rgba(16,185,129,0.10)';
const EMERALD_BORDER = 'rgba(16,185,129,0.28)';
const BG             = '#020C07';
const SIDEBAR_BG     = '#030E09';

const SIDEBAR_NAV = [
  { id: 'dashboard',  label: 'Growth Command',     icon: FiTrendingUp, path: '/growth',        exact: true },
  {
    id: 'seo',        label: 'SEO Operations',     icon: FiSearch,
    children: [
      { label: 'SEO Director',         path: '/growth/seo', icon: '🎯' },
      { label: 'Keyword Intelligence', path: '/growth/seo', icon: '🔍' },
      { label: 'Technical SEO',        path: '/growth/seo', icon: '⚙️' },
      { label: 'Local SEO',            path: '/growth/seo', icon: '📍' },
      { label: 'GEO Agent',            path: '/growth/seo', icon: '🌐' },
      { label: 'Backlink Intelligence',path: '/growth/seo', icon: '🔗' },
      { label: 'SEO Reporting',        path: '/growth/seo', icon: '📊' },
    ],
  },
  {
    id: 'marketing',  label: 'Marketing Command',  icon: FiSpeaker,
    children: [
      { label: 'Marketing Director',   path: '/growth/marketing', icon: '📣' },
      { label: 'Market Research',      path: '/growth/marketing', icon: '🔬' },
      { label: 'Audience Intelligence',path: '/growth/marketing', icon: '🎯' },
      { label: 'Funnel Architect',     path: '/growth/marketing', icon: '⬇️' },
      { label: 'Campaign Manager',     path: '/growth/marketing', icon: '🚀' },
      { label: 'Retention Specialist', path: '/growth/marketing', icon: '♻️' },
    ],
  },
  {
    id: 'content',    label: 'Content Empire',     icon: FiFileText,
    children: [
      { label: 'Content Director',     path: '/growth/content', icon: '👑' },
      { label: 'Copywriter',           path: '/growth/content', icon: '✍️' },
      { label: 'Storytelling Specialist',path: '/growth/content', icon: '📖' },
      { label: 'Social Media Manager', path: '/growth/content', icon: '📱' },
      { label: 'Video Strategist',     path: '/growth/content', icon: '🎬' },
      { label: 'Podcast Producer',     path: '/growth/content', icon: '🎙️' },
    ],
  },
  {
    id: 'advertising',label: 'Advertising Agency', icon: FiRadio,
    children: [
      { label: 'Advertising Director', path: '/growth/advertising', icon: '📺' },
      { label: 'Meta Ads Specialist',  path: '/growth/advertising', icon: '👥' },
      { label: 'Search Ads Specialist',path: '/growth/advertising', icon: '🔍' },
      { label: 'Creative Testing',     path: '/growth/advertising', icon: '🧪' },
      { label: 'Conversion Analyst',   path: '/growth/advertising', icon: '📈' },
    ],
  },
  {
    id: 'clients',    label: 'Client Success',     icon: FiUsers,
    children: [
      { label: 'Account Manager',      path: '/growth/clients', icon: '🤝' },
      { label: 'Client Success Mgr',   path: '/growth/clients', icon: '⭐' },
      { label: 'Onboarding Specialist',path: '/growth/clients', icon: '🚀' },
      { label: 'ROI Analyst',          path: '/growth/clients', icon: '💰' },
    ],
  },
  { id: 'analytics', label: 'Analytics',           icon: FiBarChart2, path: '/growth/analytics' },
  { id: 'clients-portal', label: 'Client Portal',  icon: FiGlobe,     path: '/growth/portal'    },
  {
    id: 'team', label: 'Team Roster', icon: FiUsers,
    children: [
      { label: 'All Agents',   path: '/growth/roster',              icon: '📊' },
      { label: 'SEO Team',     path: '/growth/roster',              icon: '🔍' },
      { label: 'Marketing',    path: '/growth/roster',              icon: '📣' },
      { label: 'Content',      path: '/growth/roster',              icon: '✍️' },
    ],
  },
];

/* ── Logo ──────────────────────────────────────────────────────────────── */
function GrowthLogo({ collapsed }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${collapsed ? 'justify-center' : ''}`}>
      <div className="relative flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <defs>
            <linearGradient id="gg" x1="0" y1="34" x2="34" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669"/>
              <stop offset="100%" stopColor="#34D399"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="30" height="30" rx="8" fill="url(#gg)" opacity="0.12"/>
          <rect x="2" y="2" width="30" height="30" rx="8" fill="none" stroke="url(#gg)" strokeWidth="1.2"/>
          {/* Growth chart bars */}
          <rect x="7"  y="20" width="4" height="8"  rx="1" fill="url(#gg)" opacity="0.5"/>
          <rect x="13" y="15" width="4" height="13" rx="1" fill="url(#gg)" opacity="0.7"/>
          <rect x="19" y="10" width="4" height="18" rx="1" fill="url(#gg)" opacity="0.85"/>
          <rect x="25" y="6"  width="4" height="22" rx="1" fill="url(#gg)"/>
          {/* Trend line */}
          <polyline points="9,19 15,13 21,8 27,5" fill="none" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          <circle cx="27" cy="5" r="1.5" fill="#34D399"/>
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
          style={{ background: EMERALD, borderColor: BG }}/>
      </div>
      {!collapsed && (
        <div className="leading-none min-w-0">
          <p className="font-bold text-xs text-white tracking-wide">Growth Intelligence</p>
          <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: EMERALD }}>Find · Grow · Dominate</p>
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
  const selfActive = !hasKids && (item.exact
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
          ? { background: EMERALD_SOFT, border: `1px solid ${EMERALD_BORDER}` }
          : { border: '1px solid transparent' }}>
        <item.icon size={14} className="flex-shrink-0" style={{ color: highlighted ? EMERALD : undefined }}/>
        {!collapsed && (
          <>
            <span className="text-xs font-medium flex-1 truncate">{item.label}</span>
            {hasKids && (
              <FiChevronDown size={11} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: highlighted ? EMERALD : '#4B5563' }}/>
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
                style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
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
  const [openId, setOpenId] = useState('seo');
  return (
    <aside className={`flex-shrink-0 hidden lg:flex flex-col h-full overflow-hidden transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}
      style={{ background: SIDEBAR_BG, borderRight: '1px solid rgba(16,185,129,0.08)' }}>
      <div className={`flex items-center border-b h-12 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-3 gap-2'}`}
        style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
        <GrowthLogo collapsed={collapsed}/>
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
      <div className="px-2 pb-3 pt-2 space-y-0.5" style={{ borderTop: '1px solid rgba(16,185,129,0.08)' }}>
        <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-700 hover:text-gray-500 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <FiSettings size={13}/>{!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── Mobile drawer ───────────────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const [openId, setOpenId] = useState('seo');
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
            style={{ background: SIDEBAR_BG, borderRight: '1px solid rgba(16,185,129,0.1)' }}>
            <div className="flex items-center justify-between px-4 h-12 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
              <GrowthLogo collapsed={false}/>
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
export default function GrowthStudioAppLayout() {
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [introSeen, setIntroSeen] = useState(() => hasSeenGrowthIntro());
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: BG }}>
      {!introSeen && <GrowthIntro onDone={() => setIntroSeen(true)} />}
      <EOFTopNav accentColor={EMERALD} systemName="Growth Intelligence" systemEmoji="📈"/>
      <div className="flex flex-1 min-h-0">
        <button onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-6 left-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border"
          style={{ background: '#030E09', borderColor: EMERALD_BORDER, color: EMERALD }}>
          <FiMenu size={18}/>
        </button>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>
        <main className="flex-1 overflow-y-auto"><Outlet/></main>
      </div>
    </div>
  );
}

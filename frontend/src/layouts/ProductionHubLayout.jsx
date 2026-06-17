/**
 * EOF Production Hub Layout
 * Orange · Master control center · 3-layer nav: EOFTopNav | Sidebar | Workspace
 */
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronLeft,
  FiGrid, FiZap, FiUsers, FiActivity, FiSettings,
  FiFilm, FiMusic, FiBook, FiStar, FiTrendingUp,
  FiCode, FiFeather, FiAward,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import ProductionIntro, { hasSeenProductionIntro } from '../components/ProductionIntro';

const ORANGE        = '#F97316';
const ORANGE_SOFT   = 'rgba(249,115,22,0.10)';
const ORANGE_BORDER = 'rgba(249,115,22,0.28)';
const BG            = '#0C0702';
const SIDEBAR_BG    = '#100904';

const SIDEBAR_NAV = [
  { id: 'hub',       label: 'Production Hub',     icon: FiGrid,      path: '/production',         exact: true },
  { id: 'library',   label: 'EOF Library',         icon: FiBook,      path: '/'                    },
  { id: 'university',label: 'DIY University',      icon: FiStar,      path: '/university'          },
  { id: 'central',   label: 'Central AI Hub',      icon: FiZap,       path: '/central'             },
  { id: 'griot',     label: 'Griot AI',            icon: FiFeather,   path: '/griot'               },
  { id: 'film',      label: 'Film Studio',         icon: FiFilm,      path: '/film-studio/hub'     },
  { id: 'music',     label: 'Music Studio',        icon: FiMusic,     path: '/music-studio/hub'    },
  { id: 'fhhl',      label: 'FHHL',                icon: FiAward,     path: '/fhhl'                },
  { id: 'bac',       label: 'BAC',                 icon: FiStar,      path: '/bac'                 },
  { id: 'legacy',    label: 'Legacy Vault',        icon: FiBook,      path: '/legacy-vault'        },
  { id: 'dev',       label: 'Dev Studios',         icon: FiCode,      path: '/dev-studio'          },
  { id: 'growth',    label: 'Growth Intelligence', icon: FiTrendingUp,path: '/growth'              },
  { id: 'roster',    label: 'Agent Roster',        icon: FiUsers,     path: '/production/roster'   },
  { id: 'settings',  label: 'Settings',            icon: FiSettings,  path: '/production/settings' },
];

/* ── Logo ───────────────────────────────────────────────────────────────── */
function ProdLogo({ collapsed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none', justifyContent: collapsed ? 'center' : 'flex-start' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <defs>
            <linearGradient id="pg" x1="0" y1="34" x2="34" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EA580C"/>
              <stop offset="100%" stopColor="#FED7AA"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="30" height="30" rx="8" fill="url(#pg)" opacity="0.12"/>
          <rect x="2" y="2" width="30" height="30" rx="8" fill="none" stroke="url(#pg)" strokeWidth="1.2"/>
          {/* Play triangle */}
          <polygon points="12,9 26,17 12,25" fill="url(#pg)" opacity="0.9"/>
          {/* Record dot */}
          <circle cx="26" cy="9" r="3" fill="#EF4444" opacity="0.85"/>
        </svg>
        <span style={{
          position: 'absolute', bottom: -2, right: -2, width: 10, height: 10,
          borderRadius: '50%', background: ORANGE, border: `2px solid ${BG}`,
          animation: 'pulse 2s infinite',
        }}/>
      </div>
      {!collapsed && (
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: 'white', letterSpacing: '0.03em' }}>Production Hub</div>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: ORANGE, marginTop: 2 }}>
            Create · Launch · Dominate
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Nav item ───────────────────────────────────────────────────────────── */
function NavItem({ item, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path) && item.path !== '/';

  return (
    <button onClick={() => navigate(item.path)} title={collapsed ? item.label : undefined}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '8px 0' : '7px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 10, border: active ? `1px solid ${ORANGE_BORDER}` : '1px solid transparent',
        background: active ? ORANGE_SOFT : 'transparent',
        color: active ? 'white' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400,
        transition: 'all 0.13s',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; } }}>
      <item.icon size={14} style={{ color: active ? ORANGE : undefined, flexShrink: 0 }}/>
      {!collapsed && <span style={{ truncate: true }}>{item.label}</span>}
    </button>
  );
}

/* ── Desktop sidebar ────────────────────────────────────────────────────── */
function DesktopSidebar({ collapsed, setCollapsed }) {
  return (
    <aside style={{
      width: collapsed ? 56 : 220, flexShrink: 0,
      background: SIDEBAR_BG, borderRight: `1px solid rgba(249,115,22,0.08)`,
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
      transition: 'width 0.2s',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', height: 48, flexShrink: 0,
        padding: collapsed ? '0 8px' : '0 12px',
        borderBottom: `1px solid rgba(249,115,22,0.1)`,
        gap: 8,
      }}>
        <ProdLogo collapsed={collapsed}/>
        {!collapsed && <div style={{ flex: 1 }}/>}
        <button onClick={() => setCollapsed(c => !c)}
          style={{
            width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', flexShrink: 0,
          }}>
          <FiChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SIDEBAR_NAV.filter(n => n.id !== 'settings').map(item => (
          <NavItem key={item.id} item={item} collapsed={collapsed}/>
        ))}
      </nav>

      <div style={{ padding: '8px', borderTop: `1px solid rgba(249,115,22,0.08)` }}>
        <NavItem item={SIDEBAR_NAV.find(n => n.id === 'settings')} collapsed={collapsed}/>
      </div>
    </aside>
  );
}

/* ── Mobile drawer ──────────────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const location = useLocation();
  useEffect(() => { onClose(); }, [location.pathname]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.7)' }} onClick={onClose}/>
          <motion.aside key="drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: 240, zIndex: 50, background: SIDEBAR_BG, borderRight: `1px solid ${ORANGE_BORDER}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', height: 48, borderBottom: `1px solid rgba(249,115,22,0.1)` }}>
              <ProdLogo collapsed={false}/>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><FiX size={16}/></button>
            </div>
            <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SIDEBAR_NAV.map(item => <NavItem key={item.id} item={item} collapsed={false}/>)}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Root layout ────────────────────────────────────────────────────────── */
export default function ProductionHubLayout() {
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [introSeen,        setIntroSeen]        = useState(() => hasSeenProductionIntro());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG }}>
      {!introSeen && <ProductionIntro onDone={() => setIntroSeen(true)} />}
      <EOFTopNav accentColor={ORANGE} systemName="Production Hub" systemEmoji="🎬"/>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <button onClick={() => setDrawerOpen(true)}
          className="lg:hidden"
          style={{ position: 'fixed', bottom: 24, left: 16, zIndex: 30, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: SIDEBAR_BG, border: `1px solid ${ORANGE_BORDER}`, color: ORANGE, cursor: 'pointer' }}>
          <FiMenu size={18}/>
        </button>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>
        <main style={{ flex: 1, overflowY: 'auto' }}><Outlet/></main>
      </div>
    </div>
  );
}

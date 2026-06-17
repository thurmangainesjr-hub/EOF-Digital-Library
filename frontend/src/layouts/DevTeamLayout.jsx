/**
 * EOF Dev Team — Unified App Shell
 * Combines Dev Studios + Growth Intelligence + Production Hub in one layout.
 * Single sidebar, single intro, single URL tree at /dev-team/*
 */
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronLeft, FiChevronDown,
  FiGrid, FiZap, FiUsers, FiActivity, FiSettings,
  FiCode, FiCpu, FiCheckSquare, FiShield, FiCloud,
  FiPackage, FiBook, FiSearch, FiTrendingUp,
  FiFileText, FiRadio, FiMonitor, FiStar, FiLayers,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import DTEIntro, { hasSeenDTEIntro } from '../components/DTEIntro';

const ORANGE  = '#F97316';
const CYAN    = '#06B6D4';
const EMERALD = '#10B981';
const SOFT    = 'rgba(249,115,22,0.08)';
const BORDER  = 'rgba(249,115,22,0.22)';
const BG      = '#080604';
const SIDE_BG = '#0C0805';

/* ── Sidebar nav definition ─────────────────────────────────────────────── */
const NAV = [
  {
    section: null,
    items: [
      { id: 'hub',      label: 'DTE Command',  icon: FiGrid,   path: '/dev-team',         exact: true },
      { id: 'roster',   label: 'Agent Roster', icon: FiUsers,  path: '/dev-team/roster'               },
      { id: 'factions', label: 'Dev Factions', icon: FiStar,   path: '/dev-team/factions'             },
      { id: 'studios',  label: 'Dev Studios',  icon: FiLayers, path: '/dev-team/studios'              },
    ],
  },
  {
    section: 'DEV STUDIOS',
    color: CYAN,
    items: [
      { id: 'dev-home',    label: 'Command Center',  icon: FiMonitor,   path: '/dev-team/dev'            },
      { id: 'dev-team',    label: 'Dev Team',        icon: FiUsers,     path: '/dev-team/dev/team'       },
      {
        id: 'dev-eng', label: 'Engineering', icon: FiCode, color: CYAN,
        children: [
          { label: 'System Architect',    path: '/dev-team/dev/engineering', icon: '🏗️' },
          { label: 'Full Stack',          path: '/dev-team/dev/engineering', icon: '⚡' },
          { label: 'Frontend',            path: '/dev-team/dev/engineering', icon: '🎨' },
          { label: 'Backend',             path: '/dev-team/dev/engineering', icon: '🔧' },
          { label: 'Database',            path: '/dev-team/dev/engineering', icon: '🗄️' },
          { label: 'Mobile',              path: '/dev-team/dev/engineering', icon: '📱' },
        ],
      },
      {
        id: 'dev-ai', label: 'AI Division', icon: FiCpu, color: CYAN,
        children: [
          { label: 'AI Engineer',         path: '/dev-team/dev/ai-division', icon: '🤖' },
          { label: 'Agent Architect',     path: '/dev-team/dev/ai-division', icon: '🧠' },
          { label: 'Prompt Engineer',     path: '/dev-team/dev/ai-division', icon: '✍️' },
          { label: 'Agent Orchestrator',  path: '/dev-team/dev/ai-division', icon: '🕸️' },
          { label: 'Knowledge Engineer',  path: '/dev-team/dev/ai-division', icon: '📚' },
        ],
      },
      { id: 'dev-qa',       label: 'QA',              icon: FiCheckSquare, path: '/dev-team/dev/qa'           },
      { id: 'dev-security', label: 'Security',        icon: FiShield,      path: '/dev-team/dev/security'     },
      { id: 'dev-cloud',    label: 'Cloud Ops',       icon: FiCloud,       path: '/dev-team/dev/cloud'        },
      { id: 'dev-clients',  label: 'Client Services', icon: FiUsers,       path: '/dev-team/dev/clients'      },
      { id: 'dev-factory',  label: 'Dev Factories',   icon: FiPackage,     path: '/dev-team/dev/factories'    },
      { id: 'dev-know',     label: 'Knowledge',       icon: FiBook,        path: '/dev-team/dev/knowledge'    },
      { id: 'dev-rnd',      label: 'R&D Lab',         icon: FiActivity,    path: '/dev-team/dev/rnd'          },
    ],
  },
  {
    section: 'GROWTH INTELLIGENCE',
    color: EMERALD,
    items: [
      { id: 'growth-home', label: 'Growth Command',   icon: FiTrendingUp, path: '/dev-team/growth'             },
      { id: 'growth-seo',  label: 'SEO Operations',  icon: FiSearch,     path: '/dev-team/growth/seo'         },
      { id: 'growth-mkt',  label: 'Marketing',        icon: FiZap,        path: '/dev-team/growth/marketing'   },
      { id: 'growth-con',  label: 'Content Empire',   icon: FiFileText,   path: '/dev-team/growth/content'     },
      { id: 'growth-ads',  label: 'Advertising',      icon: FiRadio,      path: '/dev-team/growth/advertising' },
      { id: 'growth-cli',  label: 'Client Success',   icon: FiUsers,      path: '/dev-team/growth/clients'     },
      { id: 'growth-ana',  label: 'Analytics',        icon: FiActivity,   path: '/dev-team/growth/analytics'   },
    ],
  },
  {
    section: 'PRODUCTION',
    color: ORANGE,
    items: [
      { id: 'production', label: 'Production Hub', icon: FiGrid, path: '/dev-team/production' },
    ],
  },
];

/* ── Logo ───────────────────────────────────────────────────────────────── */
function DevTeamLogo({ collapsed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none', justifyContent: collapsed ? 'center' : 'flex-start' }}>
      {/* Badge icon */}
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="dteg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#06B6D4"/>
            <stop offset="50%"  stopColor="#A78BFA"/>
            <stop offset="100%" stopColor={ORANGE}/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="30" height="30" rx="8" fill="url(#dteg)" opacity="0.10"/>
        <rect x="2" y="2" width="30" height="30" rx="8" fill="none" stroke="url(#dteg)" strokeWidth="1.2"/>
        <text x="17" y="22" textAnchor="middle" fontSize="11" fontWeight="900"
          fill="url(#dteg)" fontFamily="system-ui,sans-serif" letterSpacing="1">DTE</text>
      </svg>

      {!collapsed && (
        <div style={{ lineHeight: 1 }}>
          {/* D.T.E — gradient text */}
          <div style={{
            fontWeight: 900, fontSize: 17, letterSpacing: '0.18em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #06B6D4, #A78BFA, #F97316)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            D.T.E
          </div>
          {/* Powered by tagline */}
          <div style={{
            fontSize: 7, letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.32)', marginTop: 3,
            fontWeight: 400, lineHeight: 1,
          }}>
            Powered by Expression of Freedom
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Single nav item ────────────────────────────────────────────────────── */
function NavItem({ item, collapsed, sectionColor }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children;
  const color = item.color || sectionColor || ORANGE;

  const active = item.exact
    ? location.pathname === item.path
    : !hasChildren && location.pathname === item.path;
  const childActive = hasChildren && item.children.some(c => location.pathname === c.path);
  const highlighted = active || childActive;

  return (
    <div>
      <button
        onClick={() => hasChildren ? setOpen(o => !o) : navigate(item.path)}
        title={collapsed ? item.label : undefined}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 8, justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '7px 0' : '6px 10px', borderRadius: 9,
          border: highlighted ? `1px solid ${color}40` : '1px solid transparent',
          background: highlighted ? color + '12' : 'transparent',
          color: highlighted ? 'white' : 'rgba(255,255,255,0.38)',
          cursor: 'pointer', fontSize: 11, fontWeight: highlighted ? 600 : 400,
          transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!highlighted) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}}
        onMouseLeave={e => { if (!highlighted) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}}
      >
        <item.icon size={13} style={{ color: highlighted ? color : undefined, flexShrink: 0 }}/>
        {!collapsed && <>
          <span style={{ flex: 1, textAlign: 'left', truncate: true }}>{item.label}</span>
          {hasChildren && <FiChevronDown size={10} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: color, opacity: 0.6 }}/>}
        </>}
      </button>

      {hasChildren && !collapsed && (
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}
              style={{ overflow: 'hidden', paddingLeft: 12, marginTop: 2 }}>
              <div style={{ borderLeft: `1px solid ${color}25`, paddingLeft: 10, paddingTop: 2, paddingBottom: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {item.children.map(c => {
                  const ca = location.pathname === c.path;
                  return (
                    <button key={c.label} onClick={() => navigate(c.path)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
                        borderRadius: 7, border: 'none', background: ca ? color + '12' : 'transparent',
                        color: ca ? 'white' : 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 10, textAlign: 'left', width: '100%',
                      }}>
                      <span style={{ fontSize: 11, width: 14, textAlign: 'center' }}>{c.icon}</span>
                      <span>{c.label}</span>
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

/* ── Desktop sidebar ────────────────────────────────────────────────────── */
function DesktopSidebar({ collapsed, setCollapsed }) {
  return (
    <aside style={{
      width: collapsed ? 52 : 224, flexShrink: 0, transition: 'width 0.2s',
      background: SIDE_BG, borderRight: `1px solid rgba(249,115,22,0.1)`,
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Logo row */}
      <div style={{
        display: 'flex', alignItems: 'center', height: 48, flexShrink: 0,
        padding: collapsed ? '0 9px' : '0 12px', gap: 8,
        borderBottom: `1px solid rgba(249,115,22,0.1)`,
      }}>
        <DevTeamLogo collapsed={collapsed}/>
        {!collapsed && <div style={{ flex: 1 }}/>}
        <button onClick={() => setCollapsed(c => !c)} style={{
          width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0,
        }}>
          <FiChevronLeft size={13} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {NAV.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 8 }}>
            {group.section && !collapsed && (
              <div style={{
                fontSize: 9, fontWeight: 700, color: group.color || 'rgba(255,255,255,0.25)',
                letterSpacing: '0.1em', padding: '8px 10px 4px',
                borderTop: gi > 0 ? `1px solid rgba(255,255,255,0.05)` : 'none',
                marginTop: gi > 0 ? 4 : 0,
              }}>{group.section}</div>
            )}
            {group.section && !collapsed && gi > 0 && (
              <div style={{ height: 0 }}/>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map(item => (
                <NavItem key={item.id} item={item} collapsed={collapsed} sectionColor={group.color}/>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div style={{ padding: '6px', borderTop: `1px solid rgba(249,115,22,0.08)` }}>
        <button onClick={() => {}} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '7px 0' : '6px 10px', borderRadius: 8,
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 11,
        }}>
          <FiSettings size={13}/>{!collapsed && <span>Settings</span>}
        </button>
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
          <motion.aside key="dr" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: 240, zIndex: 50, background: SIDE_BG, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', height: 48, borderBottom: `1px solid rgba(249,115,22,0.1)`, flexShrink: 0 }}>
              <DevTeamLogo collapsed={false}/>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><FiX size={16}/></button>
            </div>
            <nav style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {NAV.map((group, gi) => (
                <div key={gi} style={{ marginBottom: 6 }}>
                  {group.section && (
                    <div style={{ fontSize: 9, fontWeight: 700, color: group.color || 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', padding: '8px 10px 4px', borderTop: gi > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      {group.section}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {group.items.map(item => <NavItem key={item.id} item={item} collapsed={false} sectionColor={group.color}/>)}
                  </div>
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */
export default function DevTeamLayout() {
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [introSeen,   setIntroSeen]   = useState(() => hasSeenDTEIntro());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG }}>
      {!introSeen && (
        <DTEIntro onDone={() => setIntroSeen(true)} />
      )}
      <EOFTopNav accentColor={ORANGE} systemName="Dev Team Elite" systemEmoji="⚡"/>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <button onClick={() => setDrawerOpen(true)} className="lg:hidden"
          style={{ position: 'fixed', bottom: 24, left: 16, zIndex: 30, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: SIDE_BG, border: `1px solid ${BORDER}`, color: ORANGE, cursor: 'pointer' }}>
          <FiMenu size={18}/>
        </button>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <main style={{ flex: 1, overflowY: 'auto' }}><Outlet/></main>
      </div>
    </div>
  );
}

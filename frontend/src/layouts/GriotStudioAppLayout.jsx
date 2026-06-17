import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronLeft, FiChevronDown, FiSettings,
  FiGrid, FiBook, FiUsers, FiLayers, FiBox, FiCpu,
  FiShield, FiFilm, FiMusic, FiWifi, FiCheckSquare,
  FiSend, FiGlobe, FiStar,
} from 'react-icons/fi';
import EOFTopNav from '../components/EOFTopNav';
import GISIntro, { hasSeenGISIntro } from '../components/GISIntro';
import { DEPARTMENTS, GIS_PRIMARY, GIS_SIDE, GIS_BG } from '../data/griotStudioData';

const ACCENT  = GIS_PRIMARY;
const BORDER  = 'rgba(124,58,237,0.2)';

const DEPT_ICONS = {
  'game-direction':  FiGrid,
  'narrative':       FiBook,
  'characters':      FiUsers,
  'world-building':  FiGlobe,
  'assets':          FiBox,
  'unreal':          FiCpu,
  'combat':          FiShield,
  'cinematics':      FiFilm,
  'audio':           FiMusic,
  'multiplayer':     FiWifi,
  'qa':              FiCheckSquare,
  'publishing':      FiSend,
};

const NAV = [
  {
    section: null,
    items: [
      { id: 'hub',     label: 'GIS Hub',      icon: FiStar,   path: '/griot-studio',         exact: true },
      { id: 'widgets', label: 'Widget Page',   icon: FiLayers, path: '/griot-studio/widgets'             },
    ],
  },
  {
    section: 'TEAM',
    color: ACCENT,
    items: [
      { id: 'roster', label: 'Team Roster', icon: FiUsers, path: '/griot-studio/roster', color: '#7C3AED' },
    ],
  },
  {
    section: 'DEPARTMENTS',
    color: ACCENT,
    items: DEPARTMENTS.map(d => ({
      id:    d.id,
      label: d.name,
      icon:  DEPT_ICONS[d.id] || FiGrid,
      path:  d.path,
      color: d.color,
    })),
  },
];

/* ── Logo ─────────────────────────────────────────────────────── */
function GISLogo({ collapsed }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none', justifyContent: collapsed ? 'center' : 'flex-start' }}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink:0 }}>
        <defs>
          <linearGradient id="gisg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7C3AED"/>
            <stop offset="50%"  stopColor="#34D399"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="30" height="30" rx="8" fill="url(#gisg)" opacity="0.1"/>
        <rect x="2" y="2" width="30" height="30" rx="8" fill="none" stroke="url(#gisg)" strokeWidth="1.2"/>
        <text x="17" y="22" textAnchor="middle" fontSize="11" fontWeight="900"
          fill="url(#gisg)" fontFamily="system-ui,sans-serif" letterSpacing="0.5">GIS</text>
      </svg>
      {!collapsed && (
        <div style={{ lineHeight:1 }}>
          <div style={{
            fontWeight:900, fontSize:12, letterSpacing:'0.03em',
            background:'linear-gradient(135deg,#7C3AED,#34D399)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            Griot Interactive
          </div>
          <div style={{ fontSize:7, color:'rgba(255,255,255,0.32)', marginTop:2, letterSpacing:'0.06em' }}>
            Build the World. Play the Story.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Nav item ─────────────────────────────────────────────────── */
function NavItem({ item, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const color = item.color || ACCENT;
  const active = item.exact
    ? location.pathname === item.path
    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  return (
    <button
      onClick={() => navigate(item.path)}
      title={collapsed ? item.label : undefined}
      style={{
        width:'100%', display:'flex', alignItems:'center',
        gap: collapsed ? 0 : 8, justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '7px 0' : '6px 10px', borderRadius:9,
        border: active ? `1px solid ${color}40` : '1px solid transparent',
        background: active ? color + '12' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.38)',
        cursor:'pointer', fontSize:11, fontWeight: active ? 600 : 400,
        transition:'all 0.12s', textAlign:'left',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.38)'; }}}
    >
      <item.icon size={13} style={{ color: active ? color : undefined, flexShrink:0 }}/>
      {!collapsed && <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</span>}
      {!collapsed && active && (
        <span style={{ width:4, height:4, borderRadius:'50%', background:color, flexShrink:0 }}/>
      )}
    </button>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────── */
function DesktopSidebar({ collapsed, setCollapsed }) {
  return (
    <aside style={{
      width: collapsed ? 52 : 220, flexShrink:0, transition:'width 0.2s',
      background: GIS_SIDE, borderRight:`1px solid ${BORDER}`,
      display:'flex', flexDirection:'column', height:'100%', overflow:'hidden',
    }}>
      <div style={{
        display:'flex', alignItems:'center', height:48, flexShrink:0,
        padding: collapsed ? '0 9px' : '0 12px', gap:8,
        borderBottom:`1px solid ${BORDER}`,
      }}>
        <GISLogo collapsed={collapsed}/>
        {!collapsed && <div style={{ flex:1 }}/>}
        <button onClick={() => setCollapsed(c => !c)} style={{
          width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center',
          background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', flexShrink:0,
        }}>
          <FiChevronLeft size={13} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}/>
        </button>
      </div>

      <nav style={{ flex:1, overflowY:'auto', padding:'8px 6px', display:'flex', flexDirection:'column', gap:0 }}>
        {NAV.map((group, gi) => (
          <div key={gi} style={{ marginBottom:6 }}>
            {group.section && !collapsed && (
              <div style={{
                fontSize:9, fontWeight:700, color: group.color || 'rgba(255,255,255,0.25)',
                letterSpacing:'0.1em', padding:'8px 10px 4px',
                borderTop: gi > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                marginTop: gi > 0 ? 4 : 0,
              }}>{group.section}</div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
              {group.items.map(item => <NavItem key={item.id} item={item} collapsed={collapsed}/>)}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ padding:'6px', borderTop:`1px solid ${BORDER}` }}>
        <button style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '7px 0' : '6px 10px', borderRadius:8,
          background:'transparent', border:'none', color:'rgba(255,255,255,0.28)', cursor:'pointer', fontSize:11,
        }}>
          <FiSettings size={13}/>{!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── Mobile drawer ────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  const location = useLocation();
  useEffect(() => { onClose(); }, [location.pathname]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.7)' }} onClick={onClose}/>
          <motion.aside key="dr" initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
            transition={{ type:'tween', duration:0.22 }}
            style={{ position:'fixed', left:0, top:0, height:'100%', width:240, zIndex:50,
              background: GIS_SIDE, borderRight:`1px solid ${BORDER}`,
              display:'flex', flexDirection:'column', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'0 14px', height:48, borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
              <GISLogo collapsed={false}/>
              <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>
                <FiX size={16}/>
              </button>
            </div>
            <nav style={{ flex:1, padding:'8px 6px', display:'flex', flexDirection:'column', gap:0 }}>
              {NAV.map((group, gi) => (
                <div key={gi} style={{ marginBottom:6 }}>
                  {group.section && (
                    <div style={{ fontSize:9, fontWeight:700, color: group.color || 'rgba(255,255,255,0.25)',
                      letterSpacing:'0.1em', padding:'8px 10px 4px',
                      borderTop: gi > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      {group.section}
                    </div>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                    {group.items.map(item => <NavItem key={item.id} item={item} collapsed={false}/>)}
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

/* ── Root ─────────────────────────────────────────────────────── */
export default function GriotStudioAppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);
  const [introSeen,  setIntroSeen]  = useState(() => hasSeenGISIntro());

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background: GIS_BG }}>
      {!introSeen && <GISIntro onDone={() => setIntroSeen(true)} />}
      <EOFTopNav accentColor={GIS_PRIMARY} systemName="Griot Interactive Studios" systemEmoji="🎮"/>
      <div style={{ display:'flex', flex:1, minHeight:0 }}>
        <button onClick={() => setDrawerOpen(true)}
          style={{ position:'fixed', bottom:24, left:16, zIndex:30, width:44, height:44, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            background: GIS_SIDE, border:`1px solid ${BORDER}`, color: ACCENT, cursor:'pointer' }}>
          <FiMenu size={18}/>
        </button>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <main style={{ flex:1, overflowY:'auto' }}><Outlet/></main>
      </div>
    </div>
  );
}

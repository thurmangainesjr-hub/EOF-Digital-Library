/**
 * EOF Dev Team Elite (DTE) — Widget Page
 * Logo · Mini Dashboard · Launch + Shortcuts
 * Route: /dev-team/widgets
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiExternalLink, FiCode, FiTrendingUp, FiGrid,
  FiUsers, FiZap, FiActivity, FiShield,
  FiSearch, FiPackage, FiArrowRight, FiCpu,
} from 'react-icons/fi';
import { DEPARTMENTS } from '../data/devStudioTeam';

const ORANGE  = '#F97316';
const CYAN    = '#06B6D4';
const EMERALD = '#10B981';
const BG      = '#080604';
const SOFT    = 'rgba(249,115,22,0.07)';
const BORDER  = 'rgba(249,115,22,0.18)';

const totalDevAgents = DEPARTMENTS.reduce((n, d) => n + d.agents.length, 0);

const STATS = [
  { label: 'Dev Agents',     value: String(totalDevAgents), color: CYAN,    icon: FiCode      },
  { label: 'Growth Agents',  value: '28',                   color: EMERALD, icon: FiTrendingUp},
  { label: 'Apps Live',      value: '12',                   color: ORANGE,  icon: FiGrid      },
  { label: 'Active Clients', value: '24',                   color: '#FBBF24',icon: FiUsers    },
  { label: 'Campaigns',      value: '18',                   color: EMERALD, icon: FiActivity  },
  { label: 'Health',         value: '99.8%',                color: CYAN,    icon: FiZap       },
];

const SHORTCUTS = [
  { label: 'DTE Command',      path: '/dev-team',                    icon: FiGrid,       color: ORANGE  },
  { label: 'Dev Studios',      path: '/dev-team/dev',                icon: FiCode,       color: CYAN    },
  { label: 'Dev Team Roster',  path: '/dev-team/dev/team',           icon: FiUsers,      color: CYAN    },
  { label: 'AI Division',      path: '/dev-team/dev/ai-division',    icon: FiCpu,        color: '#A78BFA'},
  { label: 'Engineering',      path: '/dev-team/dev/engineering',    icon: FiActivity,   color: CYAN    },
  { label: 'Security',         path: '/dev-team/dev/security',       icon: FiShield,     color: '#F87171'},
  { label: 'Growth Command',   path: '/dev-team/growth',             icon: FiTrendingUp, color: EMERALD },
  { label: 'SEO Operations',   path: '/dev-team/growth/seo',         icon: FiSearch,     color: '#0D9488'},
  { label: 'Dev Factories',    path: '/dev-team/dev/factories',      icon: FiPackage,    color: '#FBBF24'},
  { label: 'Production Hub',   path: '/dev-team/production',         icon: FiGrid,       color: ORANGE  },
];

export default function DevTeamWidgetPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100%', background: BG,
      fontFamily: 'system-ui,-apple-system,sans-serif',
      padding: '24px 20px',
    }}>

      {/* Logo / Header */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', marginBottom: 20,
        padding: '24px 20px 20px',
        background: SOFT, border: `1px solid ${BORDER}`,
        borderRadius: 16, position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,${CYAN},${ORANGE},${EMERALD})`,
        }}/>

        {/* DTE Logo */}
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none" style={{ marginBottom: 12 }}>
          <defs>
            <linearGradient id="dte-logo" x1="0" y1="0" x2="62" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={CYAN}/>
              <stop offset="50%"  stopColor={ORANGE}/>
              <stop offset="100%" stopColor={EMERALD}/>
            </linearGradient>
            <linearGradient id="dte-glow" x1="0" y1="62" x2="62" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={EMERALD} stopOpacity="0.3"/>
              <stop offset="50%"  stopColor={ORANGE}  stopOpacity="0.15"/>
              <stop offset="100%" stopColor={CYAN}    stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          {/* Outer glow ring */}
          <rect x="1" y="1" width="60" height="60" rx="15" fill="url(#dte-glow)"/>
          <rect x="1" y="1" width="60" height="60" rx="15" fill="none" stroke="url(#dte-logo)" strokeWidth="1.5"/>
          {/* Inner subtle fill */}
          <rect x="6" y="6" width="50" height="50" rx="11" fill="url(#dte-logo)" opacity="0.06"/>
          {/* DT text */}
          <text x="7" y="44" fontSize="30" fontWeight="900" fill="url(#dte-logo)"
            fontFamily="system-ui,-apple-system,sans-serif" letterSpacing="-1">DT</text>
          {/* Star pip for "Elite" */}
          <circle cx="52" cy="13" r="5" fill={ORANGE} opacity="0.9"/>
          <text x="52" y="17" fontSize="7" textAnchor="middle" fill="white" fontWeight="800">E</text>
        </svg>

        <div style={{ fontSize: 17, fontWeight: 800, color: 'white', letterSpacing: '0.04em' }}>
          Dev Team Elite
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
          <span style={{ color: CYAN }}>Build</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 5px' }}>·</span>
          <span style={{ color: ORANGE }}>Grow</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 5px' }}>·</span>
          <span style={{ color: EMERALD }}>Launch</span>
        </div>

        {/* Live status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10,
          fontSize: 10, color: ORANGE, background: ORANGE + '12', border: `1px solid ${ORANGE}30`,
          padding: '3px 12px', borderRadius: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }}/>
          DTE · All Systems Operational
        </div>
      </div>

      {/* Mini Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 18 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: s.color + '0A', border: `1px solid ${s.color}20`,
            borderRadius: 10, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <s.icon size={11} style={{ color: s.color, flexShrink: 0 }}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Launch Button */}
      <button onClick={() => navigate('/dev-team')}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px', borderRadius: 12, marginBottom: 18, cursor: 'pointer',
          background: `linear-gradient(135deg,${CYAN},${ORANGE},${EMERALD})`,
          backgroundSize: '200% 200%',
          border: 'none', color: 'white', fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
          boxShadow: `0 4px 20px ${ORANGE}25`,
        }}>
        <FiExternalLink size={15}/> Launch Dev Team Elite
      </button>

      {/* Shortcuts */}
      <div>
        <div style={{
          fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 8,
        }}>Quick Access</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SHORTCUTS.map(s => (
            <button key={s.label} onClick={() => navigate(s.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 11px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer', fontSize: 12, textAlign: 'left', width: '100%',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = s.color + '10';
                e.currentTarget.style.borderColor = s.color + '35';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              }}>
              <s.icon size={12} style={{ color: s.color, flexShrink: 0 }}/>
              <span style={{ flex: 1 }}>{s.label}</span>
              <FiArrowRight size={10} style={{ opacity: 0.35 }}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * EOF Dev Studios — Widget Page
 * Logo · Mini Dashboard · Launch + Shortcuts
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiExternalLink, FiMonitor, FiCpu, FiCheckSquare,
  FiShield, FiCloud, FiUsers, FiPackage, FiArrowRight,
  FiActivity, FiZap,
} from 'react-icons/fi';

const CYAN   = '#06B6D4';
const SOFT   = 'rgba(6,182,212,0.08)';
const BORDER = 'rgba(6,182,212,0.2)';
const BG     = '#020918';

const STATS = [
  { label: 'Active Projects', value: '12', icon: FiMonitor  },
  { label: 'AI Agents',       value: '31', icon: FiCpu      },
  { label: 'Deployments',     value: '8',  icon: FiActivity },
  { label: 'Health',          value: '99.8%', icon: FiZap   },
];

const SHORTCUTS = [
  { label: 'Command Center',  path: '/dev-studio',           icon: FiMonitor   },
  { label: 'Engineering',     path: '/dev-studio/engineering',icon: FiCpu      },
  { label: 'AI Division',     path: '/dev-studio/ai-division',icon: FiZap      },
  { label: 'Dev Factories',   path: '/dev-studio/factories',  icon: FiPackage  },
  { label: 'Client Services', path: '/dev-studio/clients',    icon: FiUsers    },
  { label: 'Security',        path: '/dev-studio/security',   icon: FiShield   },
  { label: 'QA',              path: '/dev-studio/qa',         icon: FiCheckSquare },
  { label: 'Cloud Ops',       path: '/dev-studio/cloud',      icon: FiCloud    },
];

export default function DevStudioWidgetPage() {
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
        textAlign: 'center', marginBottom: 24,
        padding: '24px 20px 20px',
        background: SOFT, border: `1px solid ${BORDER}`,
        borderRadius: 16, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,transparent,${CYAN},transparent)`,
        }}/>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 12 }}>
          <defs>
            <linearGradient id="wdg-cyan" x1="0" y1="56" x2="56" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0891B2"/>
              <stop offset="100%" stopColor="#67E8F9"/>
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="50" height="50" rx="12" fill="url(#wdg-cyan)" opacity="0.12"/>
          <rect x="3" y="3" width="50" height="50" rx="12" fill="none" stroke="url(#wdg-cyan)" strokeWidth="1.5"/>
          {/* CPU grid */}
          <rect x="16" y="16" width="24" height="24" rx="4" fill="none" stroke={CYAN} strokeWidth="1.2"/>
          <rect x="20" y="20" width="16" height="16" rx="2" fill={CYAN} opacity="0.15"/>
          <rect x="22" y="22" width="12" height="12" rx="1.5" fill={CYAN} opacity="0.25"/>
          {/* Pins */}
          {[20,26,32].map(y => <line key={y} x1="13" y1={y} x2="16" y2={y} stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>)}
          {[20,26,32].map(y => <line key={y} x1="40" y1={y} x2="43" y2={y} stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>)}
          {[20,26,32].map(x => <line key={x} x1={x} y1="13" x2={x} y2="16" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>)}
          {[20,26,32].map(x => <line key={x} x1={x} y1="40" x2={x} y2="43" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>)}
        </svg>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '0.03em' }}>Dev Studios</div>
        <div style={{ fontSize: 10, color: CYAN, marginTop: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          AI-Powered Software Company
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8,
          fontSize: 10, color: CYAN, background: CYAN + '15', border: `1px solid ${CYAN}30`,
          padding: '2px 10px', borderRadius: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: CYAN, animation: 'pulse 2s infinite' }}/>
          31 Agents Online
        </div>
      </div>

      {/* Mini Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: SOFT, border: `1px solid ${BORDER}`,
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <s.icon size={14} style={{ color: CYAN, flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Launch Button */}
      <button onClick={() => navigate('/dev-studio')}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px', borderRadius: 12, marginBottom: 20, cursor: 'pointer',
          background: `linear-gradient(135deg,${CYAN},#0891B2)`,
          border: 'none', color: 'white', fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
          boxShadow: `0 4px 20px ${CYAN}30`,
        }}>
        <FiExternalLink size={15}/> Launch Dev Studios
      </button>

      {/* Shortcuts */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          Quick Access
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {SHORTCUTS.map(s => (
            <button key={s.label} onClick={() => navigate(s.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, border: `1px solid rgba(255,255,255,0.06)`,
                background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', fontSize: 12, textAlign: 'left', width: '100%',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = SOFT; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = BORDER; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
              <s.icon size={13} style={{ color: CYAN, flexShrink: 0 }}/>
              <span style={{ flex: 1 }}>{s.label}</span>
              <FiArrowRight size={11} style={{ opacity: 0.4 }}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

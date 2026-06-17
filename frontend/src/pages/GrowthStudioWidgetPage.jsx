/**
 * EOF Growth Intelligence Suite — Widget Page
 * Logo · Mini Dashboard · Launch + Shortcuts
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiExternalLink, FiTrendingUp, FiSearch, FiUsers,
  FiDollarSign, FiFileText, FiRadio, FiArrowRight,
  FiActivity, FiZap,
} from 'react-icons/fi';

const EMERALD = '#10B981';
const SOFT    = 'rgba(16,185,129,0.08)';
const BORDER  = 'rgba(16,185,129,0.2)';
const BG      = '#020C07';

const STATS = [
  { label: 'Active Clients',   value: '24',     icon: FiUsers      },
  { label: 'Campaigns',        value: '18',     icon: FiActivity   },
  { label: 'Leads / Month',    value: '1,284',  icon: FiTrendingUp },
  { label: 'Revenue',          value: '$48.2K', icon: FiDollarSign },
];

const SHORTCUTS = [
  { label: 'Growth Command',    path: '/growth',             icon: FiTrendingUp },
  { label: 'SEO Operations',    path: '/growth/seo',         icon: FiSearch     },
  { label: 'Marketing Command', path: '/growth/marketing',   icon: FiZap        },
  { label: 'Content Empire',    path: '/growth/content',     icon: FiFileText   },
  { label: 'Advertising Agency',path: '/growth/advertising', icon: FiRadio      },
  { label: 'Client Success',    path: '/growth/clients',     icon: FiUsers      },
  { label: 'Analytics',         path: '/growth/analytics',   icon: FiActivity   },
  { label: 'Client Portal',     path: '/growth/portal',      icon: FiExternalLink },
];

export default function GrowthStudioWidgetPage() {
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
          background: `linear-gradient(90deg,transparent,${EMERALD},transparent)`,
        }}/>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 12 }}>
          <defs>
            <linearGradient id="wdg-em" x1="0" y1="56" x2="56" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669"/>
              <stop offset="100%" stopColor="#34D399"/>
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="50" height="50" rx="12" fill="url(#wdg-em)" opacity="0.12"/>
          <rect x="3" y="3" width="50" height="50" rx="12" fill="none" stroke="url(#wdg-em)" strokeWidth="1.5"/>
          {/* Growth bars */}
          <rect x="11" y="33" width="7"  height="12" rx="2" fill="url(#wdg-em)" opacity="0.45"/>
          <rect x="21" y="25" width="7"  height="20" rx="2" fill="url(#wdg-em)" opacity="0.65"/>
          <rect x="31" y="17" width="7"  height="28" rx="2" fill="url(#wdg-em)" opacity="0.82"/>
          <rect x="41" y="10" width="6"  height="35" rx="2" fill="url(#wdg-em)"/>
          {/* Trend line */}
          <polyline points="14,32 24,23 34,15 44,9" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          <circle cx="44" cy="9" r="2.5" fill="#34D399"/>
        </svg>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '0.03em' }}>Growth Intelligence</div>
        <div style={{ fontSize: 10, color: EMERALD, marginTop: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Find · Grow · Dominate
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8,
          fontSize: 10, color: EMERALD, background: EMERALD + '15', border: `1px solid ${EMERALD}30`,
          padding: '2px 10px', borderRadius: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: EMERALD }}/>
          28 Agents Online
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
            <s.icon size={14} style={{ color: EMERALD, flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Launch Button */}
      <button onClick={() => navigate('/growth')}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px', borderRadius: 12, marginBottom: 20, cursor: 'pointer',
          background: `linear-gradient(135deg,${EMERALD},#059669)`,
          border: 'none', color: 'white', fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
          boxShadow: `0 4px 20px ${EMERALD}30`,
        }}>
        <FiExternalLink size={15}/> Launch Growth Intelligence
      </button>

      {/* Shortcuts */}
      <div>
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
              <s.icon size={13} style={{ color: EMERALD, flexShrink: 0 }}/>
              <span style={{ flex: 1 }}>{s.label}</span>
              <FiArrowRight size={11} style={{ opacity: 0.4 }}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

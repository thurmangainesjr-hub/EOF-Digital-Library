/**
 * EOF Production Hub — Master Command Dashboard
 * App launcher + creator stats + cross-app activity + quick workflows.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiZap, FiGrid, FiActivity, FiTrendingUp, FiArrowRight,
  FiFilm, FiMusic, FiBook, FiStar, FiCode, FiFeather,
  FiAward, FiUsers, FiClock, FiCheckCircle, FiPlay,
  FiExternalLink,
} from 'react-icons/fi';

const ORANGE  = '#F97316';
const SOFT    = 'rgba(249,115,22,0.08)';
const BORDER  = 'rgba(249,115,22,0.2)';
const GREEN   = '#10B981';
const CYAN    = '#06B6D4';
const PURPLE  = '#8B5CF6';
const GOLD    = '#D4AF37';

/* ── All EOF Apps ───────────────────────────────────────────────────────── */
const APPS = [
  {
    id: 'library',    name: 'EOF Library',         emoji: '📚', icon: FiBook,
    color: GOLD,      path: '/',
    tagline: 'Books · Creator Studio · Gutenberg',
    stats: [{ k: 'Books', v: '2,840' }, { k: 'Creators', v: '14' }],
    status: 'live',
  },
  {
    id: 'university', name: 'DIY University',       emoji: '🎓', icon: FiStar,
    color: '#6366F1',  path: '/university',
    tagline: 'Learn · Build · Master Any Skill',
    stats: [{ k: 'Schools', v: '12' }, { k: 'Professors', v: '48' }],
    status: 'live',
  },
  {
    id: 'griot',      name: 'Griot AI',             emoji: '✨', icon: FiFeather,
    color: '#7C3AED',  path: '/griot',
    tagline: 'Story Engine · Canon Keeper',
    stats: [{ k: 'Stories', v: '38' }, { k: 'Characters', v: '124' }],
    status: 'live',
  },
  {
    id: 'film',       name: 'Film Studio',          emoji: '🎬', icon: FiFilm,
    color: '#EF4444',  path: '/film-studio/hub',
    tagline: 'Edit · Score · Distribute',
    stats: [{ k: 'Projects', v: '6' }, { k: 'Clips', v: '214' }],
    status: 'live',
  },
  {
    id: 'music',      name: 'Music Studio',         emoji: '🎵', icon: FiMusic,
    color: PURPLE,     path: '/music-studio/hub',
    tagline: 'Record · Mix · Publish',
    stats: [{ k: 'Tracks', v: '42' }, { k: 'Projects', v: '8' }],
    status: 'live',
  },
  {
    id: 'central',    name: 'EOF Central AI',       emoji: '⚡', icon: FiZap,
    color: GOLD,       path: '/central',
    tagline: 'Agent Hub · Skills · Orchestration',
    stats: [{ k: 'Agents', v: '25' }, { k: 'Skills', v: '29' }],
    status: 'live',
  },
  {
    id: 'fhhl',       name: 'FHHL',                 emoji: '🏆', icon: FiAward,
    color: '#F59E0B',  path: '/fhhl',
    tagline: 'Fantasy League · Draft · Stats',
    stats: [{ k: 'Teams', v: '12' }, { k: 'Players', v: '320' }],
    status: 'live',
  },
  {
    id: 'bac',        name: 'BAC',                  emoji: '⭐', icon: FiStar,
    color: '#FBBF24',  path: '/bac',
    tagline: 'Black Artists Collective',
    stats: [{ k: 'Artists', v: '84' }, { k: 'Works', v: '246' }],
    status: 'live',
  },
  {
    id: 'legacy',     name: 'Legacy Vault',         emoji: '🏛️', icon: FiBook,
    color: '#A78BFA',  path: '/legacy-vault',
    tagline: 'Preserve · Archive · Pass Down',
    stats: [{ k: 'Memories', v: '68' }, { k: 'Families', v: '9' }],
    status: 'live',
  },
  {
    id: 'dev',        name: 'Dev Studios',          emoji: '💻', icon: FiCode,
    color: CYAN,       path: '/dev-team/dev',
    tagline: 'AI Software Company · 31 Agents',
    stats: [{ k: 'Projects', v: '12' }, { k: 'Agents', v: '31' }],
    status: 'live',
  },
  {
    id: 'growth',     name: 'Growth Intelligence',  emoji: '📈', icon: FiTrendingUp,
    color: GREEN,      path: '/dev-team/growth',
    tagline: 'SEO · Marketing · Advertising',
    stats: [{ k: 'Clients', v: '24' }, { k: 'Campaigns', v: '18' }],
    status: 'live',
  },
  {
    id: 'streaming',  name: 'Streaming Hub',        emoji: '📺', icon: FiPlay,
    color: '#EC4899',  path: '/streaming',
    tagline: 'Netflix-Style Content Platform',
    stats: [{ k: 'Shows', v: '28' }, { k: 'Episodes', v: '142' }],
    status: 'live',
  },
];

const CREATOR_STATS = [
  { label: 'Apps Live',       value: '12',     icon: FiGrid,       color: ORANGE  },
  { label: 'AI Agents',       value: '80+',    icon: FiZap,        color: CYAN    },
  { label: 'Active Projects', value: '34',     icon: FiActivity,   color: GREEN   },
  { label: 'Content Created', value: '1,200+', icon: FiTrendingUp, color: PURPLE  },
];

const ACTIVITY = [
  { msg: 'Dev Studios deployed Growth Intelligence v1.0',    time: '2m ago',  app: 'Dev Studios',         emoji: '💻', type: 'deploy'  },
  { msg: 'Griot AI completed story arc for Chapter 12',      time: '15m ago', app: 'Griot AI',            emoji: '✨', type: 'success' },
  { msg: 'Film Studio exported 4K master — Project Alpha',   time: '32m ago', app: 'Film Studio',         emoji: '🎬', type: 'export'  },
  { msg: 'Growth Intelligence: 3 new leads this morning',    time: '1h ago',  app: 'Growth Intelligence', emoji: '📈', type: 'lead'    },
  { msg: 'Music Studio: Track "Ascension" mixdown complete', time: '2h ago',  app: 'Music Studio',        emoji: '🎵', type: 'success' },
  { msg: 'DIY University: New professor agent published',    time: '3h ago',  app: 'DIY University',      emoji: '🎓', type: 'success' },
  { msg: 'EOF Central: Skills Hub now live at /central/skills',time:'4h ago', app: 'EOF Central',         emoji: '⚡', type: 'launch'  },
  { msg: 'Legacy Vault: 3 new memory collections saved',     time: '5h ago',  app: 'Legacy Vault',        emoji: '🏛️', type: 'success' },
];

const QUICK_WORKFLOWS = [
  { label: 'Write a Story',      emoji: '✍️', path: '/griot',             desc: 'Open Griot AI story engine' },
  { label: 'Record a Track',     emoji: '🎵', path: '/music-studio',      desc: 'Open Music Studio DAW'       },
  { label: 'Edit a Video',       emoji: '🎬', path: '/film-studio',       desc: 'Open Film Studio editor'     },
  { label: 'Launch a Campaign',  emoji: '📣', path: '/dev-team/growth/marketing',  desc: 'Growth Intelligence'         },
  { label: 'Build Software',     emoji: '⚡', path: '/dev-team/dev',              desc: 'Dev Studios Command Center'  },
  { label: 'Start a Course',     emoji: '🎓', path: '/university',        desc: 'DIY University'              },
];

/* ── App card ───────────────────────────────────────────────────────────── */
function AppCard({ app, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? app.color + '0E' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? app.color + '50' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '16px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
      }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,${app.color},transparent)`,
        opacity: hov ? 1 : 0.35, transition: 'opacity 0.15s',
      }}/>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 26 }}>{app.emoji}</span>
        <span style={{
          fontSize: 8, fontWeight: 700, color: GREEN, background: GREEN + '15',
          border: `1px solid ${GREEN}30`, padding: '2px 7px', borderRadius: 10,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Live</span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 3 }}>{app.name}</div>
      <div style={{ fontSize: 10, color: app.color, marginBottom: 10, opacity: 0.75 }}>{app.tagline}</div>

      <div style={{ display: 'flex', gap: 10, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 9 }}>
        {app.stats.map(s => (
          <div key={s.k} style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: app.color }}>{s.v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.k}</div>
          </div>
        ))}
      </div>

      {hov && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: app.color, fontSize: 10 }}>
          <FiExternalLink size={10}/> Open App
        </div>
      )}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function ProductionHub() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0C0702', minHeight: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(234,88,12,0.04),transparent)',
        borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '24px 32px 22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                🎬 EOF Production Hub
              </span>
              <span style={{ fontSize: 10, color: GREEN, background: GREEN + '15', border: `1px solid ${GREEN}30`, padding: '1px 8px', borderRadius: 10 }}>
                All Systems Live
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Master Control</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              The full Expression of Freedom ecosystem · {APPS.length} apps · 80+ AI agents
            </p>
          </div>
          <button onClick={() => navigate('/central')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
              borderRadius: 10, cursor: 'pointer', border: 'none',
              background: `linear-gradient(135deg,${ORANGE},#EA580C)`,
              color: 'white', fontSize: 13, fontWeight: 700,
              boxShadow: `0 4px 20px ${ORANGE}30`,
            }}>
            <FiZap size={14}/> Launch All Systems
          </button>
        </div>

        {/* Creator stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {CREATOR_STATS.map(s => (
            <div key={s.label} style={{
              background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: s.color + '18', border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={16} style={{ color: s.color }}/>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.color, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', gap: 24 }}>

        {/* LEFT (main) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 26 }}>

          {/* App Launcher */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FiGrid size={14} style={{ color: ORANGE }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>EOF Ecosystem</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                {APPS.length} apps · all live
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {APPS.map(app => (
                <AppCard key={app.id} app={app} onClick={() => navigate(app.path)}/>
              ))}
            </div>
          </div>

          {/* Quick Workflows */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiZap size={14} style={{ color: ORANGE }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Quick Start</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {QUICK_WORKFLOWS.map(w => (
                <button key={w.label} onClick={() => navigate(w.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)', cursor: 'pointer',
                    transition: 'all 0.13s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = SOFT; e.currentTarget.style.borderColor = BORDER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{w.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{w.label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{w.desc}</div>
                  </div>
                  <FiArrowRight size={12} style={{ color: ORANGE, marginLeft: 'auto', flexShrink: 0 }}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT (sidebar) */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* System Status */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiActivity size={13} style={{ color: ORANGE }}/> System Status
            </div>
            {[
              { label: 'EOF Library',          color: GREEN  },
              { label: 'Griot AI (Story Engine)',color: GREEN },
              { label: 'Dev Studios',           color: GREEN  },
              { label: 'Growth Intelligence',   color: GREEN  },
              { label: 'Film Studio',           color: GREEN  },
              { label: 'Music Studio',          color: GREEN  },
              { label: 'DIY University',        color: GREEN  },
              { label: 'EOF Central AI Hub',    color: GREEN  },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                <span style={{ fontSize: 10, color: s.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }}/>
                  Operational
                </span>
              </div>
            ))}
          </div>

          {/* Cross-App Activity */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiZap size={13} style={{ color: ORANGE }}/> Live Activity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{a.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{a.msg}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FiClock size={8}/> {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EOF Stats */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiUsers size={13} style={{ color: ORANGE }}/> EOF at a Glance
            </div>
            {[
              { label: 'Total AI Agents',   value: '80+',     color: CYAN    },
              { label: 'Divisions',          value: '5',       color: ORANGE  },
              { label: 'Revenue Streams',   value: '3',       color: GREEN   },
              { label: 'Content Pieces',    value: '1,200+',  color: PURPLE  },
              { label: 'Apps Live',         value: '12',      color: GOLD    },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

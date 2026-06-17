/**
 * EOF Dev Team — Combined Command Dashboard
 * Shows Dev Studios + Growth Intelligence + Production Hub in one view.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCode, FiTrendingUp, FiGrid, FiUsers, FiZap, FiActivity,
  FiArrowRight, FiCheckCircle, FiClock, FiStar,
  FiSearch, FiFileText, FiRadio,
} from 'react-icons/fi';
import { DEPARTMENTS as TEAM, STATUS_STYLE, BRANCH_COLOR } from '../data/devStudioTeam';

const ORANGE  = '#F97316';
const CYAN    = '#06B6D4';
const EMERALD = '#10B981';
const PURPLE  = '#8B5CF6';
const AMBER   = '#F59E0B';
const SOFT    = 'rgba(249,115,22,0.08)';
const BORDER  = 'rgba(249,115,22,0.2)';
const BG      = '#080604';

const totalDevAgents    = TEAM.reduce((n, d) => n + d.agents.length, 0);
const totalGrowthAgents = 28;

/* ── Master stats ───────────────────────────────────────────────────────── */
const MASTER_STATS = [
  { label: 'Dev Agents',        value: String(totalDevAgents), color: CYAN,    icon: FiCode        },
  { label: 'Growth Agents',     value: String(totalGrowthAgents), color: EMERALD, icon: FiTrendingUp },
  { label: 'Active Projects',   value: '20',    color: ORANGE,  icon: FiActivity    },
  { label: 'Apps Live',         value: '12',    color: PURPLE,  icon: FiGrid        },
  { label: 'Active Clients',    value: '24',    color: EMERALD, icon: FiUsers       },
  { label: 'Revenue',           value: '$48.2K',color: AMBER,   icon: FiStar        },
];

/* ── Dev Studio quick stats ─────────────────────────────────────────────── */
const DEV_STATS = [
  { k: 'Active Projects', v: '12' }, { k: 'Deployments', v: '8' },
  { k: 'Tests Passing',   v: '97%'},{ k: 'Health',       v: '99.8%' },
];

/* ── Growth quick stats ─────────────────────────────────────────────────── */
const GROWTH_STATS = [
  { k: 'Clients',     v: '24' },   { k: 'Campaigns',  v: '18' },
  { k: 'Leads/Month', v: '1,284' },{ k: 'Revenue',    v: '$48.2K' },
];

/* ── Cross-team activity ────────────────────────────────────────────────── */
const ACTIVITY = [
  { msg: 'AI Factory deployed agent framework v2.3',           emoji:'💻', time:'2m ago',  team:'Dev'    },
  { msg: 'SEO Director completed audit for Grace Church',      emoji:'📈', time:'18m ago', team:'Growth' },
  { msg: 'Griot AI story arc completed — Chapter 12',          emoji:'✨', time:'35m ago', team:'Prod'   },
  { msg: 'Meta campaign launched — $800/day budget',           emoji:'📣', time:'1h ago',  team:'Growth' },
  { msg: 'QA Director cleared 3 issues in Client Portal',      emoji:'✅', time:'2h ago',  team:'Dev'    },
  { msg: 'Content Empire published 3 blog posts',              emoji:'✍️', time:'3h ago',  team:'Growth' },
  { msg: 'DevOps completed pipeline deployment',               emoji:'☁️', time:'4h ago',  team:'Dev'    },
  { msg: 'Film Studio exported 4K master — Project Alpha',     emoji:'🎬', time:'5h ago',  team:'Prod'   },
];

const TEAM_COLOR = { Dev: CYAN, Growth: EMERALD, Prod: ORANGE };

/* ── Growth divisions (mini cards) ─────────────────────────────────────── */
const GROWTH_DIVS = [
  { id: 'seo',         label: 'SEO Operations',    icon: '🔍', color: '#0D9488', agents: 7,  path: '/dev-team/growth/seo'         },
  { id: 'marketing',   label: 'Marketing Command', icon: '📣', color: EMERALD,   agents: 6,  path: '/dev-team/growth/marketing'   },
  { id: 'content',     label: 'Content Empire',    icon: '✍️', color: '#A78BFA', agents: 6,  path: '/dev-team/growth/content'     },
  { id: 'advertising', label: 'Advertising',       icon: '📺', color: AMBER,     agents: 5,  path: '/dev-team/growth/advertising' },
  { id: 'clients',     label: 'Client Success',    icon: '🤝', color: '#F97316', agents: 4,  path: '/dev-team/growth/clients'     },
];

/* ── EOF apps launcher (compact) ────────────────────────────────────────── */
const APPS = [
  { name:'EOF Library',    emoji:'📚', path:'/',                    color:'#D4AF37' },
  { name:'DIY University', emoji:'🎓', path:'/university',          color:'#6366F1' },
  { name:'Griot AI',       emoji:'✨', path:'/griot',               color:'#7C3AED' },
  { name:'Film Studio',    emoji:'🎬', path:'/film-studio/hub',     color:'#EF4444' },
  { name:'Music Studio',   emoji:'🎵', path:'/music-studio/hub',    color:'#8B5CF6' },
  { name:'EOF Central',    emoji:'⚡', path:'/central',             color:'#D4AF37' },
  { name:'FHHL',           emoji:'🏆', path:'/fhhl',               color:'#F59E0B' },
  { name:'BAC',            emoji:'⭐', path:'/bac',                color:'#FBBF24' },
  { name:'Legacy Vault',   emoji:'🏛️', path:'/legacy-vault',       color:'#A78BFA' },
  { name:'Streaming',      emoji:'📺', path:'/streaming',           color:'#EC4899' },
  { name:'Radio Hub',      emoji:'📻', path:'/radio',              color:'#14B8A6' },
  { name:'Akashic',        emoji:'🔮', path:'/akashic',            color:'#8B5CF6' },
];

export default function DevTeamHub() {
  const navigate = useNavigate();

  return (
    <div style={{ background: BG, minHeight: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(6,182,212,0.04),rgba(16,185,129,0.04),transparent)',
        borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '22px 28px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚡ EOF Dev Team Elite (DTE)</span>
              <span style={{ fontSize: 10, color: '#10B981', background: '#10B98115', border: '1px solid #10B98130', padding: '1px 8px', borderRadius: 10 }}>All Systems Live</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0 }}>Dev Team Elite</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', margin: '4px 0 0' }}>
              DTE Command · Dev Studios · Growth Intelligence · Production Hub
            </p>
          </div>
          <button onClick={() => navigate('/dev-team/production')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10,
              background: `linear-gradient(135deg,${ORANGE},#EA580C)`, border: 'none',
              color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
            <FiGrid size={13}/> Production Hub
          </button>
        </div>

        {/* Master stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
          {MASTER_STATS.map(s => (
            <div key={s.label} style={{
              background: s.color + '0C', border: `1px solid ${s.color}22`,
              borderRadius: 10, padding: '11px 14px',
            }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: 9, color: s.color, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '22px 28px', display: 'flex', gap: 22 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Dev Studios section */}
          <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.14)', borderRadius: 14, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCode size={14} style={{ color: CYAN }}/>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Dev Studios</span>
                <span style={{ fontSize: 10, color: CYAN, background: CYAN + '15', border: `1px solid ${CYAN}30`, padding: '1px 8px', borderRadius: 10 }}>{totalDevAgents} agents</span>
              </div>
              <button onClick={() => navigate('/dev-team/dev')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: CYAN, background: 'none', border: 'none', cursor: 'pointer' }}>
                Open <FiArrowRight size={11}/>
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {DEV_STATS.map(s => (
                <div key={s.k} style={{ background: CYAN + '0A', border: `1px solid ${CYAN}18`, borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.k}</div>
                </div>
              ))}
            </div>

            {/* Dept quick-nav */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
              {TEAM.filter(d => !['executive','knowledge','rnd'].includes(d.id)).map(d => (
                <button key={d.id} onClick={() => navigate(`/dev-team/dev/${d.id}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 6px',
                    borderRadius: 9, border: `1px solid ${d.color}22`, background: d.color + '0A',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = d.color + '18'; e.currentTarget.style.borderColor = d.color + '45'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = d.color + '0A'; e.currentTarget.style.borderColor = d.color + '22'; }}>
                  <span style={{ fontSize: 18 }}>{d.icon}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.3 }}>{d.label}</span>
                  <span style={{ fontSize: 9, color: d.color }}>{d.agents.length} agents</span>
                </button>
              ))}
            </div>
          </div>

          {/* Growth Intelligence section */}
          <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.14)', borderRadius: 14, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTrendingUp size={14} style={{ color: EMERALD }}/>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Growth Intelligence</span>
                <span style={{ fontSize: 10, color: EMERALD, background: EMERALD + '15', border: `1px solid ${EMERALD}30`, padding: '1px 8px', borderRadius: 10 }}>{totalGrowthAgents} agents</span>
              </div>
              <button onClick={() => navigate('/dev-team/growth')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: EMERALD, background: 'none', border: 'none', cursor: 'pointer' }}>
                Open <FiArrowRight size={11}/>
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {GROWTH_STATS.map(s => (
                <div key={s.k} style={{ background: EMERALD + '0A', border: `1px solid ${EMERALD}18`, borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.k}</div>
                </div>
              ))}
            </div>

            {/* Division quick-nav */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
              {GROWTH_DIVS.map(d => (
                <button key={d.id} onClick={() => navigate(d.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 6px',
                    borderRadius: 9, border: `1px solid ${d.color}22`, background: d.color + '0A',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = d.color + '18'; e.currentTarget.style.borderColor = d.color + '45'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = d.color + '0A'; e.currentTarget.style.borderColor = d.color + '22'; }}>
                  <span style={{ fontSize: 18 }}>{d.icon}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.3 }}>{d.label}</span>
                  <span style={{ fontSize: 9, color: d.color }}>{d.agents} agents</span>
                </button>
              ))}
            </div>
          </div>

          {/* EOF App Launcher */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FiGrid size={13} style={{ color: ORANGE }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>EOF Ecosystem</span>
              <button onClick={() => navigate('/dev-team/production')} style={{ marginLeft: 'auto', fontSize: 10, color: ORANGE, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                Full Hub <FiArrowRight size={10}/>
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
              {APPS.map(a => (
                <button key={a.name} onClick={() => navigate(a.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '12px 8px',
                    borderRadius: 10, border: `1px solid ${a.color}20`, background: a.color + '08',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color + '18'; e.currentTarget.style.borderColor = a.color + '45'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = a.color + '08'; e.currentTarget.style.borderColor = a.color + '20'; }}>
                  <span style={{ fontSize: 20 }}>{a.emoji}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.3 }}>{a.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Live activity */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiZap size={13} style={{ color: ORANGE }}/> Live Activity
            </div>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{a.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FiClock size={8}/> {a.time}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: TEAM_COLOR[a.team], background: TEAM_COLOR[a.team] + '15', padding: '1px 6px', borderRadius: 6 }}>{a.team}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick nav */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12 }}>Quick Access</div>
            {[
              { label: 'Dev Team Roster',     path: '/dev-team/dev/team',       color: CYAN,    emoji: '👥' },
              { label: 'Growth Command',       path: '/dev-team/growth',         color: EMERALD, emoji: '📈' },
              { label: 'Production Hub',       path: '/dev-team/production',     color: ORANGE,  emoji: '🎬' },
              { label: 'AI Division',          path: '/dev-team/dev/ai-division',color: PURPLE,  emoji: '🤖' },
              { label: 'Client Success',       path: '/dev-team/growth/clients', color: '#F97316',emoji: '🤝' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
                  borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 11, marginBottom: 5, textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = a.color + '12'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = a.color + '35'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <span>{a.emoji}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                <FiArrowRight size={10} style={{ opacity: 0.4 }}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

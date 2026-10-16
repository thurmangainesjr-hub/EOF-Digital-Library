/**
 * EOF Growth Intelligence Suite — Growth Command Hub
 * Main dashboard: KPIs, 5 divisions, campaigns, agent roster, activity feed.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp, FiSearch, FiUsers, FiDollarSign,
  FiArrowRight, FiArrowUp, FiActivity, FiTarget,
  FiCheckCircle, FiClock, FiStar, FiZap,
} from 'react-icons/fi';

const EMERALD = '#10B981';
const TEAL    = '#0D9488';
const LIME    = '#34D399';
const AMBER   = '#F59E0B';
const SOFT    = 'rgba(16,185,129,0.08)';
const BORDER  = 'rgba(16,185,129,0.2)';

/* ── Data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Active Clients',    value: '24',     delta: '+3 this month',  icon: FiUsers,       color: EMERALD },
  { label: 'Campaigns Running', value: '18',     delta: '6 launching soon',icon: FiTarget,     color: TEAL    },
  { label: 'Leads Generated',   value: '1,284',  delta: '+22% vs last mo', icon: FiTrendingUp,  color: LIME    },
  { label: 'Monthly Revenue',   value: '$48.2K', delta: '+$6.1K MoM',     icon: FiDollarSign,  color: EMERALD },
];

const DIVISIONS = [
  {
    id: 'seo', label: 'SEO Operations', icon: '🔍', color: TEAL,
    agents: 7, campaigns: 8, tagline: 'Visibility · Rankings · Authority',
    path: '/dev-team/growth/seo',
    metrics: [{ k: 'Keywords', v: '2,841' }, { k: 'Avg Rank', v: '#4.2' }, { k: 'Audits', v: '12' }],
  },
  {
    id: 'marketing', label: 'Marketing Command', icon: '📣', color: EMERALD,
    agents: 6, campaigns: 5, tagline: 'Acquire · Convert · Retain',
    path: '/dev-team/growth/marketing',
    metrics: [{ k: 'Funnels', v: '9' }, { k: 'Conv Rate', v: '3.8%' }, { k: 'Segments', v: '14' }],
  },
  {
    id: 'content', label: 'Content Empire', icon: '✍️', color: '#A78BFA',
    agents: 6, campaigns: 12, tagline: 'Blog · Social · Video · Podcast',
    path: '/dev-team/growth/content',
    metrics: [{ k: 'Articles', v: '48' }, { k: 'Posts/wk', v: '21' }, { k: 'Reach', v: '82K' }],
  },
  {
    id: 'advertising', label: 'Advertising Agency', icon: '📺', color: AMBER,
    agents: 5, campaigns: 6, tagline: 'Meta · Google · Search · Display',
    path: '/dev-team/growth/advertising',
    metrics: [{ k: 'Ad Spend', v: '$12K' }, { k: 'ROAS', v: '4.2x' }, { k: 'A/B Tests', v: '8' }],
  },
  {
    id: 'clients', label: 'Client Success', icon: '🤝', color: '#F97316',
    agents: 4, campaigns: 0, tagline: 'CRM · Reporting · Onboarding · ROI',
    path: '/dev-team/growth/clients',
    metrics: [{ k: 'NPS', v: '72' }, { k: 'Retention', v: '94%' }, { k: 'Open Cases', v: '3' }],
  },
];

const CAMPAIGNS = [
  { name: 'Church Growth SEO Package',      client: 'Grace Community Church',   type: 'SEO',         status: 'active',    progress: 74 },
  { name: 'Restaurant Local Listings',       client: "Marco's Kitchen",          type: 'Local SEO',   status: 'active',    progress: 62 },
  { name: 'Podcast Launch Strategy',         client: 'The Creator Economy Show', type: 'Content',     status: 'launching', progress: 88 },
  { name: 'Meta Ads — Black Friday',         client: 'Indie Clothing Brand',     type: 'Ads',         status: 'building',  progress: 41 },
  { name: 'Author Platform Build',           client: 'T. Williams Publishing',   type: 'Marketing',   status: 'active',    progress: 55 },
  { name: 'Nonprofit Awareness Campaign',    client: 'Urban Hope Foundation',    type: 'Content',     status: 'active',    progress: 68 },
  { name: 'Music Artist Growth Strategy',    client: 'DJ Meridian',              type: 'SEO + Social',status: 'building',  progress: 29 },
];

const AGENTS = [
  { name: 'SEO Director',          division: 'SEO',         icon: '🎯', status: 'active', task: 'Running competitor gap analysis' },
  { name: 'Keyword Intelligence',  division: 'SEO',         icon: '🔍', status: 'active', task: 'Processing 2,841 keyword clusters' },
  { name: 'Marketing Director',    division: 'Marketing',   icon: '📣', status: 'active', task: 'Reviewing funnel conversion data' },
  { name: 'Funnel Architect',      division: 'Marketing',   icon: '⬇️', status: 'active', task: 'Building lead magnet sequence' },
  { name: 'Content Director',      division: 'Content',     icon: '👑', status: 'active', task: 'Planning Q4 content calendar' },
  { name: 'Copywriter',            division: 'Content',     icon: '✍️', status: 'active', task: 'Writing 6 blog posts' },
  { name: 'Advertising Director',  division: 'Advertising', icon: '📺', status: 'active', task: 'Optimizing Meta campaigns' },
  { name: 'Conversion Analyst',    division: 'Advertising', icon: '📈', status: 'active', task: 'A/B testing ad creatives' },
  { name: 'Account Manager',       division: 'Client Success',icon:'🤝', status: 'active', task: 'Preparing 3 client reports' },
];

const ACTIVITY = [
  { msg: 'SEO Director completed audit for Grace Community Church',  time: '4m ago',  type: 'success' },
  { msg: 'Meta campaign launched for Indie Clothing — $800 daily',   time: '18m ago', type: 'launch'  },
  { msg: 'Content Empire published 3 blog posts this morning',        time: '1h ago',  type: 'success' },
  { msg: 'New client inquiry — Real Estate agency (Chicago)',         time: '2h ago',  type: 'lead'    },
  { msg: 'Keyword Intelligence found 124 new ranking opportunities',  time: '3h ago',  type: 'insight' },
  { msg: 'Client Success sent monthly ROI report to 8 clients',      time: '5h ago',  type: 'success' },
  { msg: 'Funnel Architect completed lead magnet for Author Platform',time: '6h ago',  type: 'success' },
];

const STATUS_COLOR = { active: EMERALD, launching: TEAL, building: AMBER };
const ACT_ICON = {
  success: <FiCheckCircle size={12} color={EMERALD}/>,
  launch:  <FiZap         size={12} color={TEAL}/>,
  lead:    <FiStar        size={12} color={AMBER}/>,
  insight: <FiTrendingUp  size={12} color="#A78BFA"/>,
};

/* ── Sub-components ─────────────────────────────────────────────────────── */
function StatCard({ s }) {
  return (
    <div style={{
      background: SOFT, border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: s.color + '18', border: `1px solid ${s.color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <s.icon size={18} style={{ color: s.color }}/>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
        <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.label}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          <FiArrowUp size={9} color={LIME}/> {s.delta}
        </div>
      </div>
    </div>
  );
}

function DivisionCard({ div, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? div.color + '0C' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? div.color + '45' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '18px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,${div.color},transparent)`,
        opacity: hov ? 1 : 0.4, transition: 'opacity 0.15s',
      }}/>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 26 }}>{div.icon}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, color: EMERALD, textTransform: 'uppercase',
          background: EMERALD + '15', border: `1px solid ${EMERALD}30`,
          padding: '2px 7px', borderRadius: 10, letterSpacing: '0.05em',
        }}>
          {div.agents} agents
        </span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{div.label}</div>
      <div style={{ fontSize: 10, color: div.color, marginBottom: 12, opacity: 0.8 }}>{div.tagline}</div>

      <div style={{ display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
        {div.metrics.map(m => (
          <div key={m.k} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: div.color }}>{m.v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: div.color, fontSize: 11 }}>
        <span>Open division</span><FiArrowRight size={11}/>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function GrowthStudioHub() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#020C07', minHeight: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(16,185,129,0.07),rgba(13,148,136,0.04),transparent)',
        borderBottom: '1px solid rgba(16,185,129,0.1)', padding: '24px 32px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                📈 EOF Growth Intelligence Suite
              </span>
              <span style={{ fontSize: 10, color: EMERALD, background: EMERALD + '15', border: `1px solid ${EMERALD}30`, padding: '1px 8px', borderRadius: 10 }}>
                24 Active Clients
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Growth Command</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              AI-powered growth services · 28 agents across 5 divisions · Find. Grow. Dominate.
            </p>
          </div>
          <button onClick={() => navigate('/dev-team/growth/clients')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
              background: `linear-gradient(135deg,${EMERALD},${TEAL})`,
              border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
            }}>
            <FiZap size={14}/> New Client
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {STATS.map(s => <StatCard key={s.label} s={s}/>)}
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', gap: 24 }}>

        {/* LEFT (65%) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 5 Divisions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiTarget size={14} style={{ color: EMERALD }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Growth Divisions</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>28 agents · All operational</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {DIVISIONS.map(d => <DivisionCard key={d.id} div={d} onClick={() => navigate(d.path)}/>)}
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiActivity size={14} style={{ color: EMERALD }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Active Campaigns</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{CAMPAIGNS.length} campaigns</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '4px 16px' }}>
              {CAMPAIGNS.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{c.client} · {c.type}</div>
                  </div>
                  <div style={{ width: 90, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 3, textAlign: 'right' }}>{c.progress}%</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <div style={{ height: '100%', borderRadius: 2, width: `${c.progress}%`, background: STATUS_COLOR[c.status] || EMERALD }}/>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, flexShrink: 0,
                    color: STATUS_COLOR[c.status], background: (STATUS_COLOR[c.status] || EMERALD) + '18',
                    border: `1px solid ${STATUS_COLOR[c.status] || EMERALD}30`,
                    padding: '2px 9px', borderRadius: 10, textTransform: 'capitalize',
                  }}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Roster */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiUsers size={14} style={{ color: EMERALD }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Agent Roster</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{AGENTS.length} shown · 28 total</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {AGENTS.map(a => (
                <div key={a.name} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: EMERALD }}/>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 2 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: EMERALD, marginBottom: 4, opacity: 0.8 }}>{a.division}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{a.task}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT (35%) */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Division Health */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiActivity size={13} style={{ color: EMERALD }}/> Division Health
            </div>
            {DIVISIONS.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{d.icon}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 11, color: EMERALD, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: EMERALD, display: 'inline-block' }}/>
                  {d.campaigns > 0 ? `${d.campaigns} campaigns` : 'Active'}
                </span>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiZap size={13} style={{ color: EMERALD }}/> Live Activity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>{ACT_ICON[a.type] || ACT_ICON.success}</div>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FiClock size={9}/> {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launch */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12 }}>Quick Launch</div>
            {[
              { label: 'Run SEO Audit',         icon: '🔍', path: '/dev-team/growth/seo'         },
              { label: 'Build Campaign',         icon: '🚀', path: '/dev-team/growth/marketing'   },
              { label: 'Create Content Plan',   icon: '✍️', path: '/dev-team/growth/content'     },
              { label: 'Launch Ad Campaign',    icon: '📺', path: '/dev-team/growth/advertising' },
              { label: 'Onboard New Client',    icon: '🤝', path: '/dev-team/growth/clients'     },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
                  background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
                  fontSize: 12, marginBottom: 6, textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = SOFT; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = BORDER; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <span>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                <FiArrowRight size={12}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * EOF Development Studios — Command Center
 * The executive digital headquarters. First screen users see.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCode, FiCpu, FiShield, FiCloud, FiUsers, FiPackage,
  FiCheckSquare, FiBriefcase, FiActivity, FiZap, FiArrowRight,
  FiGitBranch, FiServer, FiAlertCircle, FiCheckCircle, FiClock,
  FiSearch,
} from 'react-icons/fi';
import { DEPARTMENTS as TEAM_DEPTS, STATUS_STYLE } from '../data/devStudioTeam';

const CYAN        = '#06B6D4';
const CYAN_SOFT   = 'rgba(6,182,212,0.08)';
const CYAN_BORDER = 'rgba(6,182,212,0.2)';
const GREEN       = '#10B981';
const AMBER       = '#F59E0B';

/* ── Data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Active Projects',  value: '12',   sub: '3 deploying',      icon: FiGitBranch, color: CYAN  },
  { label: 'AI Agents Online', value: '31',   sub: 'All departments',  icon: FiCpu,       color: GREEN },
  { label: 'Deployments',      value: '8',    sub: 'This month',       icon: FiServer,    color: '#A78BFA' },
  { label: 'System Health',    value: '99.8%',sub: 'All systems go',   icon: FiActivity,  color: GREEN },
];

const DEPARTMENTS = [
  { id: 'engineering', label: 'Engineering',      icon: FiCode,         color: CYAN,     agents: 6,  tasks: 14, status: 'active', path: '/dev-studio/engineering' },
  { id: 'ai-division', label: 'AI Division',      icon: FiCpu,          color: '#A78BFA',agents: 5,  tasks: 9,  status: 'active', path: '/dev-studio/ai-division' },
  { id: 'qa',          label: 'Quality Assurance',icon: FiCheckSquare,  color: GREEN,    agents: 4,  tasks: 7,  status: 'active', path: '/dev-studio/qa' },
  { id: 'security',    label: 'Security',         icon: FiShield,       color: '#EF4444',agents: 4,  tasks: 3,  status: 'active', path: '/dev-studio/security' },
  { id: 'cloud',       label: 'Cloud Operations', icon: FiCloud,        color: '#38BDF8',agents: 4,  tasks: 11, status: 'active', path: '/dev-studio/cloud' },
  { id: 'clients',     label: 'Client Services',  icon: FiUsers,        color: '#F97316',agents: 4,  tasks: 6,  status: 'active', path: '/dev-studio/clients' },
];

const PROJECTS = [
  { name: 'EOF Growth Intelligence Suite', type: 'SaaS',    progress: 68, status: 'building', dept: 'Engineering', priority: 'high'   },
  { name: 'Client Portal v2.0',            type: 'Web App', progress: 45, status: 'building', dept: 'Full Stack',  priority: 'high'   },
  { name: 'AI Agent Framework',            type: 'AI',      progress: 82, status: 'testing',  dept: 'AI Division', priority: 'medium' },
  { name: 'Mobile App — iOS',              type: 'Mobile',  progress: 31, status: 'building', dept: 'Mobile',      priority: 'medium' },
  { name: 'Automation Pipeline',           type: 'Auto',    progress: 91, status: 'deploying',dept: 'DevOps',      priority: 'high'   },
  { name: 'Game Engine Prototype',         type: 'Game',    progress: 18, status: 'planning', dept: 'R&D Lab',     priority: 'low'    },
];

const FACTORIES = [
  { name: 'SaaS Factory',      icon: '⚡', color: CYAN,     active: 2, description: 'Full SaaS platforms with admin panels, APIs, and deployment packages' },
  { name: 'Website Factory',   icon: '🌐', color: '#38BDF8', active: 3, description: 'Business websites, e-commerce, creator platforms, landing pages' },
  { name: 'AI Factory',        icon: '🤖', color: '#A78BFA', active: 1, description: 'AI agents, agent teams, multi-agent systems, business automation' },
  { name: 'Mobile Factory',    icon: '📱', color: '#10B981', active: 1, description: 'Android, iOS, Progressive Web Apps, hybrid applications' },
  { name: 'Automation Factory',icon: '🔁', color: '#F59E0B', active: 2, description: 'Workflow, CRM, marketing, sales, and content automation systems' },
  { name: 'Game Factory',      icon: '🎮', color: '#EC4899', active: 1, description: 'Indie, mobile, educational games — Unreal and Unity projects' },
];

const EXECUTIVES = [
  { role: 'CEO AI',  name: 'Chief Executive',     avatar: '🏛️', focus: 'Company vision & growth strategy',     status: 'active' },
  { role: 'CTO AI',  name: 'Chief Technology',    avatar: '⚙️', focus: 'Engineering architecture & direction', status: 'active' },
  { role: 'COO AI',  name: 'Chief Operations',    avatar: '📊', focus: 'Workflow optimization & allocation',   status: 'active' },
  { role: 'CFO AI',  name: 'Chief Financial',     avatar: '💰', focus: 'Revenue forecasting & profitability',  status: 'active' },
];

const ACTIVITY = [
  { msg: 'AI Factory completed agent framework v2.3',          time: '2m ago',  type: 'success' },
  { msg: 'SaaS Factory deployed Growth Suite to staging',      time: '14m ago', type: 'deploy'  },
  { msg: 'QA Director flagged 3 issues in Client Portal',      time: '28m ago', type: 'warning' },
  { msg: 'DevOps completed Automation Pipeline deployment',     time: '1h ago',  type: 'success' },
  { msg: 'Security audit passed — all systems clear',          time: '2h ago',  type: 'success' },
  { msg: 'New client project submitted via Client Portal',      time: '3h ago',  type: 'info'    },
  { msg: 'Mobile Factory started iOS build pipeline',          time: '4h ago',  type: 'info'    },
  { msg: 'CTO AI approved System Architecture v4.1',           time: '5h ago',  type: 'success' },
];

const STATUS_COLOR  = { building: CYAN, testing: AMBER, deploying: GREEN, planning: '#6B7280' };
const STATUS_LABEL  = { building: 'Building', testing: 'Testing', deploying: 'Deploying', planning: 'Planning' };
const PRIORITY_COLOR= { high: '#EF4444', medium: AMBER, low: '#6B7280' };
const ACTIVITY_ICON = { success: <FiCheckCircle size={12} color={GREEN}/>, warning: <FiAlertCircle size={12} color={AMBER}/>, deploy: <FiServer size={12} color={CYAN}/>, info: <FiZap size={12} color="#6B7280"/> };

/* ── Sub-components ─────────────────────────────────────────────────────── */
function StatCard({ stat }) {
  return (
    <div style={{
      background: CYAN_SOFT, border: `1px solid ${CYAN_BORDER}`,
      borderRadius: 12, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: stat.color + '18', border: `1px solid ${stat.color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <stat.icon size={18} style={{ color: stat.color }}/>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1 }}>{stat.value}</div>
        <div style={{ fontSize: 11, color: stat.color, marginTop: 2 }}>{stat.label}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{stat.sub}</div>
      </div>
    </div>
  );
}

function DeptCard({ dept, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? dept.color + '10' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? dept.color + '45' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: dept.color + '18', border: `1px solid ${dept.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <dept.icon size={15} style={{ color: dept.color }}/>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 600, color: GREEN, textTransform: 'uppercase',
          background: GREEN + '15', border: `1px solid ${GREEN}30`,
          padding: '2px 7px', borderRadius: 10, letterSpacing: '0.05em',
        }}>Online</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 6 }}>{dept.label}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ color: dept.color, fontWeight: 600 }}>{dept.agents}</span> agents
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ color: 'white', fontWeight: 600 }}>{dept.tasks}</span> tasks
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'white', truncate: true }}>{project.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{project.dept} · {project.type}</div>
      </div>
      {/* Progress */}
      <div style={{ width: 100, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{project.progress}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div style={{ height: '100%', borderRadius: 2, width: `${project.progress}%`, background: STATUS_COLOR[project.status] }}/>
        </div>
      </div>
      {/* Status */}
      <span style={{
        fontSize: 10, fontWeight: 600, flexShrink: 0,
        color: STATUS_COLOR[project.status],
        background: STATUS_COLOR[project.status] + '18',
        border: `1px solid ${STATUS_COLOR[project.status]}30`,
        padding: '2px 9px', borderRadius: 10,
      }}>{STATUS_LABEL[project.status]}</span>
      {/* Priority */}
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[project.priority], flexShrink: 0 }}/>
    </div>
  );
}

function FactoryCard({ factory }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? factory.color + '08' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? factory.color + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12, padding: '16px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative',
      }}>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <span style={{ fontSize: 9, color: GREEN, background: GREEN + '15', border: `1px solid ${GREEN}30`, padding: '1px 7px', borderRadius: 10 }}>
          {factory.active} active
        </span>
      </div>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{factory.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{factory.name}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{factory.description}</div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function DevStudioHub() {
  const navigate   = useNavigate();
  const [teamFilter, setTeamFilter] = useState('all');
  const [teamSearch, setTeamSearch] = useState('');
  const totalAgents = TEAM_DEPTS.reduce((n, d) => n + d.agents.length, 0);

  return (
    <div style={{ background: '#020918', minHeight: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Top banner ── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(6,182,212,0.06) 0%,rgba(14,165,233,0.03) 50%,transparent)',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
        padding: '24px 32px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: CYAN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ⚡ EOF Development Studios
              </span>
              <span style={{ fontSize: 10, color: GREEN, background: GREEN + '15', border: `1px solid ${GREEN}30`, padding: '1px 8px', borderRadius: 10 }}>
                All Systems Operational
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Command Center</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              AI-powered software development company · 31 agents active across 7 departments
            </p>
          </div>
          <button
            onClick={() => navigate('/dev-studio/factories')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
              background: `linear-gradient(135deg,${CYAN},#0284C7)`,
              border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
            }}>
            <FiZap size={14}/> New Build
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STATS.map(s => <StatCard key={s.label} stat={s}/>)}
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', gap: 24 }}>

        {/* ── LEFT COLUMN (65%) ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Executive Suite */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiBriefcase size={14} style={{ color: CYAN }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Executive Suite</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {EXECUTIVES.map(ex => (
                <div key={ex.role} onClick={() => navigate('/dev-studio/executive/ceo')}
                  style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(6,182,212,0.12)',
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = CYAN_BORDER}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.12)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{ex.avatar}</span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, flexShrink: 0 }}/>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: CYAN }}>{ex.role}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3, lineHeight: 1.4 }}>{ex.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiUsers size={14} style={{ color: CYAN }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Departments</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>7 departments · All online</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {DEPARTMENTS.map(dept => (
                <DeptCard key={dept.id} dept={dept} onClick={() => navigate(dept.path)}/>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiGitBranch size={14} style={{ color: CYAN }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Active Projects</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>12 total · Priority: red = high</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '4px 16px' }}>
              {PROJECTS.map(p => <ProjectRow key={p.name} project={p}/>)}
            </div>
          </div>

          {/* Dev Factories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiPackage size={14} style={{ color: CYAN }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Development Factories</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {FACTORIES.map(f => <FactoryCard key={f.name} factory={f}/>)}
            </div>
          </div>

          {/* ── DEV TEAM ── */}
          <div>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FiUsers size={14} style={{ color: CYAN }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Dev Team Elite</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: CYAN, background: CYAN + '15', border: `1px solid ${CYAN}30`, padding: '1px 7px', borderRadius: 8 }}>DTE</span>
              <span style={{
                fontSize: 10, color: CYAN, background: CYAN + '15', border: `1px solid ${CYAN}30`,
                padding: '1px 8px', borderRadius: 10,
              }}>{totalAgents} agents</span>
              <button onClick={() => navigate('/dev-studio/team')}
                style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${CYAN_BORDER}`,
                  color: CYAN, fontSize: 11,
                }}>
                Full Directory <FiArrowRight size={10}/>
              </button>
            </div>

            {/* Search + dept filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '6px 11px', flex: '0 0 180px',
              }}>
                <FiSearch size={12} style={{ color: 'rgba(255,255,255,0.3)' }}/>
                <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)}
                  placeholder="Search agents…"
                  style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 12, width: '100%' }}/>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[{ id: 'all', label: 'All' }, ...TEAM_DEPTS.map(d => ({ id: d.id, label: d.label }))].map(f => (
                  <button key={f.id} onClick={() => setTeamFilter(f.id)}
                    style={{
                      padding: '4px 10px', borderRadius: 7, fontSize: 10, cursor: 'pointer',
                      fontWeight: teamFilter === f.id ? 700 : 400,
                      background: teamFilter === f.id ? CYAN + '18' : 'transparent',
                      border: `1px solid ${teamFilter === f.id ? CYAN + '50' : 'rgba(255,255,255,0.08)'}`,
                      color: teamFilter === f.id ? CYAN : 'rgba(255,255,255,0.4)',
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent cards by dept */}
            {TEAM_DEPTS
              .filter(d => teamFilter === 'all' || d.id === teamFilter)
              .map(dept => {
                const searchLow = teamSearch.toLowerCase();
                const agents = searchLow
                  ? dept.agents.filter(a => a.name.toLowerCase().includes(searchLow) || a.focus.toLowerCase().includes(searchLow))
                  : dept.agents;
                if (!agents.length) return null;
                return (
                  <div key={dept.id} style={{ marginBottom: 20 }}>
                    {/* Dept label row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: 7, fontSize: 14,
                        background: dept.color + '14', border: `1px solid ${dept.color}28`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>{dept.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{dept.label}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{agents.length} agents</span>
                      <button onClick={() => navigate(dept.path)}
                        style={{
                          marginLeft: 'auto', fontSize: 10, color: dept.color,
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}>
                        Open <FiArrowRight size={9}/>
                      </button>
                    </div>

                    {/* Agent grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {agents.map(a => {
                        const ss = STATUS_STYLE[a.status] || STATUS_STYLE.idle;
                        return (
                          <div key={a.name} style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderLeft: `3px solid ${dept.color}38`,
                            borderRadius: 10, padding: '12px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <span style={{ fontSize: 18 }}>{a.icon}</span>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{a.name}</div>
                                  <div style={{ fontSize: 9, color: dept.color, opacity: 0.75 }}>{a.focus}</div>
                                </div>
                              </div>
                              <span style={{
                                fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
                                color: ss.color, background: ss.color + '18',
                                border: `1px solid ${ss.color}28`, padding: '2px 6px', borderRadius: 8, flexShrink: 0,
                              }}>{ss.label}</span>
                            </div>
                            <div style={{
                              fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4,
                              borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 7,
                              display: 'flex', alignItems: 'flex-start', gap: 5,
                            }}>
                              <FiZap size={9} style={{ color: dept.color, flexShrink: 0, marginTop: 1 }}/>
                              {a.task}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* ── RIGHT COLUMN (35%) ── */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* System Health */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiServer size={13} style={{ color: CYAN }}/> System Health
            </div>
            {[
              { label: 'Production',  status: 'Operational', up: true  },
              { label: 'Staging',     status: 'Operational', up: true  },
              { label: 'CI/CD',       status: 'Operational', up: true  },
              { label: 'Database',    status: 'Operational', up: true  },
              { label: 'AI Services', status: 'Operational', up: true  },
              { label: 'Security',    status: 'Monitoring',  up: true  },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
                <span style={{ fontSize: 11, color: s.up ? GREEN : '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.up ? GREEN : '#EF4444', display: 'inline-block' }}/>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiActivity size={13} style={{ color: CYAN }}/> Activity Feed
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>{ACTIVITY_ICON[a.type]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FiClock size={9}/> {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12 }}>Quick Actions</div>
            {[
              { label: 'Launch SaaS Factory',  icon: '⚡', path: '/dev-studio/factories' },
              { label: 'New Client Project',   icon: '🤝', path: '/dev-studio/clients'   },
              { label: 'Deploy to Production', icon: '🚀', path: '/dev-studio/cloud'      },
              { label: 'Run Security Audit',   icon: '🛡️', path: '/dev-studio/security'  },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  fontSize: 12, marginBottom: 6, textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = CYAN_SOFT; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = CYAN_BORDER; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
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

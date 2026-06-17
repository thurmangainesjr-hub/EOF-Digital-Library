/**
 * EOF Dev Studios — Department Hub
 * Real agent roster + dept dashboard (no longer Coming Soon).
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiZap, FiArrowRight, FiActivity } from 'react-icons/fi';
import { DEPARTMENTS, STATUS_STYLE, BRANCH_COLOR } from '../data/devStudioTeam';

const CYAN   = '#06B6D4';
const SOFT   = 'rgba(6,182,212,0.07)';
const BORDER = 'rgba(6,182,212,0.18)';

function getDept(pathname) {
  // Match by last path segment so this works for both /dev-studio/X and /dev-team/dev/X
  const lastSeg = pathname.split('/').filter(Boolean).pop();
  return DEPARTMENTS.find(d => d.path.endsWith('/' + lastSeg))
      || DEPARTMENTS.find(d => pathname.startsWith(d.path));
}

/* ── Dept-specific mini stats ──────────────────────────────────────────── */
const DEPT_STATS = {
  executive:   [{ k: 'Active Projects',  v: '12' }, { k: 'Open Decisions', v: '4'  }, { k: 'Sprints Active', v: '3'   }, { k: 'Agents Reporting', v: '31' }],
  engineering: [{ k: 'PRs Open',         v: '8'  }, { k: 'Commits Today',  v: '24' }, { k: 'Tests Passing',  v: '97%' }, { k: 'Sprint Velocity', v: '42'  }],
  'ai-division':[{ k: 'Active Agents',   v: '5'  }, { k: 'Prompts Tuned',  v: '18' }, { k: 'Workflows Live', v: '7'  }, { k: 'Accuracy',        v: '94%' }],
  qa:          [{ k: 'Tests Written',    v: '284' }, { k: 'Bugs Found',     v: '12' }, { k: 'Coverage',       v: '88%'}, { k: 'Open Issues',     v: '7'   }],
  security:    [{ k: 'Audits Run',       v: '6'  }, { k: 'Vulns Closed',   v: '21' }, { k: 'Compliance',     v: '96%'}, { k: 'Alerts',          v: '2'   }],
  cloud:       [{ k: 'Uptime',           v: '99.8%'},{ k: 'Deployments',   v: '8'  }, { k: 'Pipelines',      v: '14' }, { k: 'Incidents',       v: '0'   }],
  clients:     [{ k: 'Active Clients',   v: '12' }, { k: 'Open Projects',  v: '8'  }, { k: 'On Schedule',    v: '10' }, { k: 'NPS Score',       v: '74'  }],
  factories:   [{ k: 'In Production',    v: '6'  }, { k: 'In Development', v: '4'  }, { k: 'Shipped (90d)',  v: '11' }, { k: 'Factory Types',   v: '6'   }],
  knowledge:   [{ k: 'Docs Created',     v: '38' }, { k: 'Templates',      v: '12' }, { k: 'Standards',      v: '24' }, { k: 'Projects Logged', v: '47'  }],
  rnd:         [{ k: 'Experiments',      v: '9'  }, { k: 'Papers Read',    v: '54' }, { k: 'Prototypes',     v: '3'  }, { k: 'Tech Evaluated',  v: '16'  }],
};

export default function DevStudioDept() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const dept       = getDept(location.pathname);
  const inDevTeam  = location.pathname.startsWith('/dev-team');
  const backPath   = inDevTeam ? '/dev-team/dev'        : '/dev-studio';
  const teamPath   = inDevTeam ? '/dev-team/dev/team'   : '/dev-studio/team';

  if (!dept) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', background: '#020918' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Department not found.</div>
      </div>
    );
  }

  const stats  = DEPT_STATS[dept.id] || [];

  return (
    <div style={{ background: '#020918', minHeight: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg,${dept.color}08,transparent)`,
        borderBottom: `1px solid ${dept.color}18`, padding: '22px 30px 18px',
      }}>
        <button onClick={() => navigate(backPath)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 12, marginBottom: 14, padding: 0,
          }}>
          <FiArrowLeft size={12}/> Dev Studios
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 13, flexShrink: 0, fontSize: 24,
              background: dept.color + '15', border: `1px solid ${dept.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{dept.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{dept.label}</div>
              <div style={{ fontSize: 12, color: dept.color, opacity: 0.8, marginTop: 2 }}>{dept.tagline}</div>
            </div>
          </div>
          <button onClick={() => navigate(teamPath)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9, cursor: 'pointer',
              background: SOFT, border: `1px solid ${BORDER}`,
              color: CYAN, fontSize: 12, fontWeight: 600,
            }}>
            <FiUsers size={13}/> Full Team Directory
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: '14px 0 0', maxWidth: 560, lineHeight: 1.6 }}>
          {dept.description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 16 }}>
            {stats.map(s => (
              <div key={s.k} style={{
                background: SOFT, border: `1px solid ${BORDER}`,
                borderRadius: 10, padding: '12px 16px',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.k}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent Roster */}
      <div style={{ padding: '24px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FiActivity size={14} style={{ color: CYAN }}/>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Agent Roster</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
            {dept.agents.length} agents · {dept.agents.filter(a => a.status !== 'idle').length} active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {dept.agents.map(a => {
            const ss = STATUS_STYLE[a.status] || STATUS_STYLE.idle;
            return (
              <div key={a.name} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '18px',
                borderLeft: `3px solid ${dept.color}40`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 26, width: 44, height: 44, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: dept.color + '12', borderRadius: 10,
                    }}>{a.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: dept.color, opacity: 0.75, marginTop: 1 }}>{a.focus}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: ss.color, background: ss.color + '18',
                      border: `1px solid ${ss.color}30`, padding: '3px 9px', borderRadius: 10,
                    }}>{ss.label}</span>
                    {a.branch && (
                      <span style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
                        color: BRANCH_COLOR[a.branch] || '#888',
                        background: (BRANCH_COLOR[a.branch] || '#888') + '18',
                        border: `1px solid ${(BRANCH_COLOR[a.branch] || '#888')}35`,
                        padding: '2px 7px', borderRadius: 8,
                      }}>{a.branch}</span>
                    )}
                  </div>
                </div>

                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'flex-start', gap: 7,
                }}>
                  <FiZap size={11} style={{ color: dept.color, flexShrink: 0, marginTop: 1 }}/>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{a.task}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back nav */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10 }}>
          <button onClick={() => navigate(backPath)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
              borderRadius: 9, background: SOFT, border: `1px solid ${BORDER}`,
              color: CYAN, cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}>
            <FiArrowLeft size={12}/> Command Center
          </button>
          <button onClick={() => navigate(teamPath)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
              borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12,
            }}>
            <FiUsers size={12}/> View All Agents <FiArrowRight size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * EOF Dev Studios — Full Team Directory
 * All 40+ AI agents, filterable by department.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiArrowRight, FiZap } from 'react-icons/fi';
import { DEPARTMENTS, STATUS_STYLE, BRANCH_COLOR } from '../data/devStudioTeam';

const CYAN   = '#06B6D4';
const SOFT   = 'rgba(6,182,212,0.07)';
const BORDER = 'rgba(6,182,212,0.18)';

const totalAgents = DEPARTMENTS.reduce((n, d) => n + d.agents.length, 0);

export default function DevStudioTeamPage() {
  const navigate = useNavigate();
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');

  const filtered = DEPARTMENTS.filter(d => filter === 'all' || d.id === filter);
  const searchLower = search.toLowerCase();

  return (
    <div style={{ background: '#020918', minHeight: '100%', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(6,182,212,0.07),transparent)',
        borderBottom: '1px solid rgba(6,182,212,0.1)', padding: '24px 32px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: CYAN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ⚡ EOF Dev Team Elite (DTE)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0 }}>Dev Team Elite</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              {totalAgents} AI agents across {DEPARTMENTS.length} departments — all operational
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center', background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: CYAN }}>{totalAgents}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Total Agents</div>
            </div>
            <div style={{ textAlign: 'center', background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#34D399' }}>{totalAgents - 2}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Active Now</div>
            </div>
            <div style={{ textAlign: 'center', background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{DEPARTMENTS.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Departments</div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9, padding: '7px 12px', flex: '0 0 220px',
          }}>
            <FiSearch size={13} style={{ color: 'rgba(255,255,255,0.3)' }}/>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search agents…"
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'white', fontSize: 12, width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[{ id: 'all', label: 'All' }, ...DEPARTMENTS.map(d => ({ id: d.id, label: d.label }))].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                  fontWeight: filter === f.id ? 700 : 400,
                  background: filter === f.id ? CYAN + '18' : 'transparent',
                  border: `1px solid ${filter === f.id ? CYAN + '50' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === f.id ? CYAN : 'rgba(255,255,255,0.4)',
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dept Sections */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {filtered.map(dept => {
          const agents = searchLower
            ? dept.agents.filter(a => a.name.toLowerCase().includes(searchLower) || a.focus.toLowerCase().includes(searchLower))
            : dept.agents;
          if (!agents.length) return null;
          return (
            <div key={dept.id}>
              {/* Dept header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: dept.color + '15', border: `1px solid ${dept.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {dept.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{dept.label}</div>
                  <div style={{ fontSize: 11, color: dept.color, opacity: 0.8 }}>{dept.tagline}</div>
                </div>
                <button onClick={() => navigate(dept.path)}
                  style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    background: dept.color + '12', border: `1px solid ${dept.color}30`,
                    color: dept.color, fontSize: 11, fontWeight: 600,
                  }}>
                  Open Dept <FiArrowRight size={11}/>
                </button>
              </div>

              {/* Agent cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {agents.map(a => {
                  const ss = STATUS_STYLE[a.status] || STATUS_STYLE.idle;
                  return (
                    <div key={a.name} style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, padding: '14px',
                      display: 'flex', flexDirection: 'column', gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 22, width: 36, height: 36, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: dept.color + '10', borderRadius: 8, flexShrink: 0,
                          }}>{a.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{a.name}</div>
                            <div style={{ fontSize: 10, color: dept.color, opacity: 0.75 }}>{a.focus}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                            color: ss.color, background: ss.color + '18',
                            border: `1px solid ${ss.color}30`, padding: '2px 8px', borderRadius: 10,
                          }}>{ss.label}</span>
                          {a.branch && (
                            <span style={{
                              fontSize: 8, fontWeight: 700, letterSpacing: '0.05em',
                              color: BRANCH_COLOR[a.branch] || '#888',
                              background: (BRANCH_COLOR[a.branch] || '#888') + '18',
                              border: `1px solid ${(BRANCH_COLOR[a.branch] || '#888')}35`,
                              padding: '1px 6px', borderRadius: 7,
                            }}>{a.branch}</span>
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4,
                        borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8,
                        display: 'flex', alignItems: 'flex-start', gap: 6,
                      }}>
                        <FiZap size={10} style={{ color: dept.color, flexShrink: 0, marginTop: 1 }}/>
                        {a.task}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

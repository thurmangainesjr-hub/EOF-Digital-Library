import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUniversityAgent, getUniversityDept, getUniversityStatusMeta, getUniversityRankTitle, UNIVERSITY_AGENTS } from '../data/universityAgentData';

const TABS = ['Overview', 'Tools', 'Responsibilities', 'Spawn Agents'];

export default function UniversityAgentProfile() {
  const { agentId } = useParams();
  const navigate    = useNavigate();
  const [tab, setTab] = useState('Overview');
  const agent = getUniversityAgent(agentId);

  if (!agent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a12', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Faculty Not Found</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>No faculty member with ID "{agentId}" in the directory.</p>
        <button onClick={() => navigate('/university/roster')} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.35)', color: '#60A5FA', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>← Back to Faculty</button>
      </div>
    );
  }

  const dept   = getUniversityDept(agent.department);
  const status = getUniversityStatusMeta(agent.status);
  const rank   = getUniversityRankTitle(agent.rank);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 400, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${dept.color}15 0%, transparent 100%)`, zIndex: 0 }}/>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 12, color: '#4B5563' }}>
          <button onClick={() => navigate('/university')} style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', padding: 0, fontSize: 12 }}>DIY University</button>
          <span>›</span>
          <button onClick={() => navigate('/university/roster')} style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', padding: 0, fontSize: 12 }}>Faculty</button>
          <span>›</span>
          <span style={{ color: '#9CA3AF' }}>{agent.name}</span>
        </div>
        <button onClick={() => navigate('/university/roster')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', color: '#9CA3AF', cursor: 'pointer', fontSize: 11, fontWeight: 600, marginBottom: 24 }}>← Back</button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}22`, borderRadius: 20, padding: '28px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${dept.color}, transparent)` }}/>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `${dept.color}12`, border: `2px solid ${dept.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>{agent.icon}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}>{status.label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: `${dept.color}15`, color: dept.color, border: `1px solid ${dept.color}30` }}>{dept.icon} {dept.label}</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>{agent.name}</h1>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: dept.color, margin: '0 0 8px', textTransform: 'uppercase' }}>{agent.codename}</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>{agent.specialty}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', textAlign: 'center', minWidth: 90 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{agent.rank}</div>
                <div style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level</div>
                <div style={{ fontSize: 9, color: dept.color, fontWeight: 600, marginTop: 2 }}>{rank}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: dept.color }}>{agent.powerLevel}%</div>
                <div style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Power</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: '#4B5563', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Power Level</span>
              <span style={{ fontSize: 9, color: dept.color, fontWeight: 700 }}>{agent.powerLevel} / 100</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${agent.powerLevel}%` }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${dept.color}, #93C5FD)`, borderRadius: 999 }}/>
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic', marginTop: 8 }}>Badge: <span style={{ color: dept.color, fontWeight: 600 }}>{agent.badge}</span></div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.15s', background: tab === t ? `${dept.color}20` : 'transparent', color: tab === t ? dept.color : '#6B7280', borderBottom: tab === t ? `2px solid ${dept.color}` : '2px solid transparent' }}>
              {t === 'Overview' ? '🧠' : t === 'Tools' ? '🔧' : t === 'Responsibilities' ? '📋' : '⚡'} {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}15`, borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 10, color: '#4B5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>About</h3>
                <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.7, margin: 0 }}>{agent.definition}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {[
                  { label: 'School',  value: `${dept.icon} ${dept.label}`,    color: dept.color  },
                  { label: 'Rank',    value: `Level ${agent.rank} — ${rank}`, color: '#FDE68A'   },
                  { label: 'Status',  value: status.label,                     color: status.color},
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, color: '#4B5563', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Tools' && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}15`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 10, color: '#4B5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>Toolkit ({agent.tools.length} tools)</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {agent.tools.map((t, i) => (
                  <motion.div key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    style={{ padding: '8px 14px', borderRadius: 10, background: `${dept.color}10`, border: `1px solid ${dept.color}22`, fontSize: 12, fontWeight: 600, color: '#93C5FD' }}>
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Responsibilities' && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}15`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 10, color: '#4B5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>Teaching Responsibilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {agent.responsibilities.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 8, background: `${dept.color}15`, border: `1px solid ${dept.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: dept.color, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.6, margin: 0 }}>{r}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Spawn Agents' && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}15`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 10, color: '#4B5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>Faculty Network</h3>
              {agent.spawnAgents.length === 0 ? (
                <p style={{ fontSize: 13, color: '#4B5563', fontStyle: 'italic' }}>This faculty member operates independently within their school.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {agent.spawnAgents.map((sid, i) => {
                    const sub = getUniversityAgent(sid);
                    if (!sub) return null;
                    const sdept = getUniversityDept(sub.department);
                    return (
                      <motion.button key={sid} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        onClick={() => navigate(`/university/agent/${sub.id}`)}
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${sdept.color}20`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${sdept.color}10`; e.currentTarget.style.borderColor = `${sdept.color}40`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = `${sdept.color}20`; }}>
                        <div style={{ fontSize: 28 }}>{sub.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{sub.name}</div>
                          <div style={{ fontSize: 10, color: sdept.color, fontWeight: 600 }}>Lv.{sub.rank} · {sdept.label}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

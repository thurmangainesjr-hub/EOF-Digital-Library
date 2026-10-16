import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PROD_AGENTS, getProdAgent, getProdDept, getProdStatusMeta, getProdRankTitle } from '../data/productionAgentData';

const TABS = ['Overview', 'Tools', 'Responsibilities', 'Spawn Agents'];

export default function ProductionAgentProfile() {
  const { agentId } = useParams();
  const navigate    = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [barAnim, setBarAnim] = useState(false);
  React.useEffect(() => { setTimeout(() => setBarAnim(true), 300); }, []);

  const agent = getProdAgent(agentId);
  if (!agent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0702', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🎬</div>
        <h2 style={{ margin: 0 }}>Agent Not Found</h2>
        <button onClick={() => navigate('/production/roster')} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#F97316', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>← Back to Roster</button>
      </div>
    );
  }

  const dept   = getProdDept(agent.department);
  const status = getProdStatusMeta(agent.status);
  const rank   = getProdRankTitle(agent.rank);
  const ACCENT = dept.color;
  const spawnTargets = PROD_AGENTS.filter(a => a.id !== agent.id && a.department === agent.department).slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', background: '#0C0702', color: '#fff', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 400, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${ACCENT}0D 0%, transparent 100%)`, zIndex: 0 }}/>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '24px 20px 80px' }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 12, color: '#4B5563' }}>
          <button onClick={() => navigate('/production')} style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: 12, padding: 0 }}>Production Hub</button>
          <span>›</span>
          <button onClick={() => navigate('/production/roster')} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 12, padding: 0 }}>Team</button>
          <span>›</span>
          <span style={{ color: ACCENT, fontWeight: 600 }}>{agent.name}</span>
          <button onClick={() => navigate('/production/roster')} style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>← Roster</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}20`, borderRadius: 20, padding: '28px 28px 24px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}/>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0 }}>{agent.icon}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}>{status.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>{dept.icon} {dept.label}</span>
              </div>
              <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, color: '#fff' }}>{agent.name}</h1>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{agent.codename}</p>
              <p style={{ margin: '0 0 10px', fontSize: 10, color: '#6B7280', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase' }}>{agent.badge}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, maxWidth: 560 }}>{agent.specialty}</p>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: '#4B5563', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>POWER LEVEL · Lv.{agent.rank} {rank}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT }}>{agent.powerLevel}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: barAnim ? `${agent.powerLevel}%` : 0 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #FED7AA)`, borderRadius: 999, boxShadow: `0 0 12px ${ACCENT}60` }}/>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', gap: 3, marginBottom: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: tab === t ? `${ACCENT}18` : 'transparent', color: tab === t ? ACCENT : '#4B5563', transition: 'all 0.15s' }}>{t}</button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {tab === 'Overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}14`, borderRadius: 16, padding: 20 }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Core Stats</h3>
                  {[{ label: 'Rank', value: `Lv.${agent.rank} — ${rank}` }, { label: 'Department', value: `${dept.icon} ${dept.label}` }, { label: 'Status', value: status.label }, { label: 'Power', value: `${agent.powerLevel}%` }].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                      <span style={{ color: '#6B7280' }}>{r.label}</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}14`, borderRadius: 16, padding: 20 }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Primary Capabilities</h3>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>{agent.specialty}</p>
                </div>
              </div>
            )}
            {tab === 'Tools' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}14`, borderRadius: 16, padding: 22 }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Tools & Platforms ({agent.tools.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {agent.tools.map((t, i) => (
                    <motion.span key={t} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ padding: '8px 14px', borderRadius: 10, background: `${ACCENT}10`, color: '#FED7AA', border: `1px solid ${ACCENT}25`, fontSize: 12, fontWeight: 600 }}>{t}</motion.span>
                  ))}
                </div>
              </div>
            )}
            {tab === 'Responsibilities' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}14`, borderRadius: 16, padding: 22 }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Core Responsibilities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(agent.responsibilities || [`Lead ${dept.label} operations`, `Drive production strategy and execution`, `Coordinate cross-division projects`, `Deliver excellence across the EOF ecosystem`]).map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.015)', border: `1px solid ${ACCENT}0D` }}>
                      <span style={{ color: ACCENT, fontSize: 14, flexShrink: 0, marginTop: 1 }}>🎬</span>
                      <span style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.55 }}>{r}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'Spawn Agents' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT}14`, borderRadius: 16, padding: 22 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Collaboration Network</h3>
                <p style={{ margin: '0 0 18px', fontSize: 12, color: '#6B7280' }}>Agents in the same department that work alongside {agent.name}.</p>
                {spawnTargets.length === 0 ? (
                  <p style={{ color: '#4B5563', fontSize: 13 }}>No collaborators available in this department.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {spawnTargets.map((a, i) => {
                      const d = getProdDept(a.department);
                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                          onClick={() => navigate(`/production/agent/${a.id}`)}
                          style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.015)', border: `1px solid ${d.color}20`, cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${d.color}08`; e.currentTarget.style.borderColor = `${d.color}35`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; e.currentTarget.style.borderColor = `${d.color}20`; }}>
                          <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{a.name}</div>
                          <div style={{ fontSize: 10, color: d.color, fontWeight: 600 }}>Lv.{a.rank} · {d.label}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

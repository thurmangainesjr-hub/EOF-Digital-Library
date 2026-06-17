import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiZap, FiUsers, FiTool, FiBookOpen, FiChevronRight } from 'react-icons/fi';
import { MUSIC_AGENTS, getMusicDept, getMusicStatusMeta, getMusicRankTitle } from '../data/musicAgentData';

const TABS = [
  { id: 'overview',         label: 'Overview',        icon: FiBookOpen },
  { id: 'tools',            label: 'Tools',           icon: FiTool },
  { id: 'responsibilities', label: 'Responsibilities', icon: FiZap },
  { id: 'spawn',            label: 'Spawn Agents',    icon: FiUsers },
];

export default function MusicAgentProfile() {
  const { agentId } = useParams();
  const navigate    = useNavigate();
  const [tab, setTab] = useState('overview');

  const agent = MUSIC_AGENTS.find(a => a.id === agentId);

  if (!agent) {
    return (
      <div style={{ minHeight: '100vh', background: '#07060A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🎵</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Agent Not Found</h2>
        <p style={{ color: '#6B7280', margin: 0 }}>This producer is not in the session.</p>
        <button onClick={() => navigate('/music-studio/hub/roster')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 10, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#FDE68A', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          ← Back to Roster
        </button>
      </div>
    );
  }

  const dept   = getMusicDept(agent.department);
  const status = getMusicStatusMeta(agent.status);
  const rank   = getMusicRankTitle(agent.rank);

  return (
    <div style={{ minHeight: '100vh', background: '#07060A', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${dept.color}16 0%, transparent 70%)` }}/>

      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,6,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', color: '#9CA3AF', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
          <FiArrowLeft size={13}/> Back
        </button>
        <div style={{ fontSize: 12, color: '#4B5563', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#6B7280' }}>Music Studio</span><FiChevronRight size={11}/>
          <span style={{ color: '#6B7280' }}>Team</span><FiChevronRight size={11}/>
          <span style={{ color: '#FDE68A' }}>{agent.name}</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 20, padding: 28, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 0%, ${dept.color} 30%, rgba(212,175,55,0.8) 70%, transparent 100%)` }}/>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, flexShrink: 0, background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '2px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: `0 0 40px ${dept.color}28` }}>{agent.icon}</div>

            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <div style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase', background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}>{status.label}</div>
                <div style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: `${dept.color}18`, color: dept.color, border: `1px solid ${dept.color}40` }}>{dept.icon} {dept.label}</div>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>{agent.name}</h1>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: dept.color, textTransform: 'uppercase', marginBottom: 10 }}>{agent.codename}</div>
              <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>{agent.specialty}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 120 }}>
              <div style={{ textAlign: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{agent.rank}</div>
                <div style={{ fontSize: 9, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Level</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{rank}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 16px', borderRadius: 12, background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: dept.color }}>{agent.powerLevel}%</div>
                <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Power</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Power Level</span>
              <span style={{ fontSize: 10, color: dept.color, fontWeight: 700 }}>{agent.powerLevel} / 100</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${agent.powerLevel}%` }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${dept.color}, #D4AF37)`, borderRadius: 999, boxShadow: `0 0 8px ${dept.color}80` }}/>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>BADGE:</span>
            <span style={{ fontSize: 11, color: '#FDE68A', fontWeight: 600, fontStyle: 'italic' }}>{agent.badge}</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              background: tab === t.id ? 'rgba(212,175,55,0.18)' : 'transparent',
              color: tab === t.id ? '#FDE68A' : '#6B7280',
              borderBottom: tab === t.id ? '1px solid rgba(212,175,55,0.4)' : '1px solid transparent',
            }}><t.icon size={12}/> {t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>

            {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.14)', borderRadius: 16, padding: 22 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#6B7280', textTransform: 'uppercase', margin: '0 0 14px' }}>Definition</h3>
                  <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.75, margin: 0 }}>{agent.definition}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  {[
                    { label: 'Department', value: dept.label,                      accent: dept.color,   icon: dept.icon },
                    { label: 'Rank',       value: `Level ${agent.rank} — ${rank}`, accent: '#FDE68A',    icon: '🎵' },
                    { label: 'Status',     value: status.label,                    accent: status.color, icon: '⚡' },
                    { label: 'Power',      value: `${agent.powerLevel} / 100`,     accent: dept.color,   icon: '💫' },
                    { label: 'Tools',      value: `${agent.tools.length} active`,  accent: '#38BDF8',    icon: '🔧' },
                    { label: 'Spawn',      value: `${agent.spawnAgents.length} agents`, accent: '#34D399', icon: '👥' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `${s.accent}18`, border: `1px solid ${s.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 9, color: '#4B5563', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'tools' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {agent.tools.map((tool, i) => (
                  <motion.div key={tool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔧</div>
                    <span style={{ fontSize: 12, color: '#FDE68A', fontWeight: 600 }}>{tool}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'responsibilities' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {agent.responsibilities.map((resp, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#FDE68A' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.6, margin: 0, flex: 1 }}>{resp}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'spawn' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 8px', lineHeight: 1.6 }}>
                  {agent.name} can spawn the following specialized sub-agents on demand.
                </p>
                {agent.spawnAgents.map((name, i) => (
                  <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.14)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎵</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Sub-agent · Music Studio</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 9, padding: '3px 9px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 700 }}>SPAWN-READY</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

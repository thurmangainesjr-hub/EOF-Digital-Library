import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRadioAgent, getRadioDept, getRadioRankTitle, getRadioStatusMeta } from '../data/radioAgentData';

const ACCENT = '#22D3EE';
const BG = '#010A0C';
const TABS = ['Overview', 'Tools', 'Responsibilities', 'Spawn Agents'];

export default function RadioAgentProfile() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [barWidth, setBarWidth] = useState(0);

  const agent = getRadioAgent(agentId);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(agent?.powerLevel || 0), 400);
    return () => clearTimeout(t);
  }, [agent]);

  if (!agent) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📻</div>
          <h2 style={{ color: '#fff', marginBottom: 8 }}>Agent Not Found</h2>
          <button onClick={() => navigate('/radio/roster')} style={{ background: ACCENT, border: 'none', color: '#000', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>← Back to Roster</button>
        </div>
      </div>
    );
  }

  const dept = getRadioDept(agent.department);
  const statusMeta = getRadioStatusMeta(agent.status);

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#040E10', borderBottom: '1px solid rgba(34,211,238,0.15)', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/radio/roster')} style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)', color: '#67E8F9', borderRadius: 7, padding: '7px 13px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>← Roster</button>
        <span style={{ color: '#334155', fontSize: 13 }}>EOF Radio</span>
        <span style={{ color: '#334155' }}>›</span>
        <span style={{ color: '#334155', fontSize: 13 }}>Team</span>
        <span style={{ color: '#334155' }}>›</span>
        <span style={{ color: ACCENT, fontSize: 13, fontWeight: 600 }}>{agent.name}</span>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#040E10', border: `1px solid rgba(34,211,238,0.25)`, borderRadius: 18, padding: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${dept.color}, #67E8F9)` }} />

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 88, height: 88, borderRadius: 18, background: 'rgba(34,211,238,0.10)', border: `2px solid rgba(34,211,238,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0 }}>{agent.icon}</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#fff' }}>{agent.name}</h1>
                <span style={{ color: statusMeta.color, background: statusMeta.bg, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{statusMeta.label}</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>CODENAME: <span style={{ color: ACCENT, fontWeight: 700 }}>{agent.codename}</span></div>
              <div style={{ color: dept.color, fontWeight: 700, fontSize: 13, background: 'rgba(34,211,238,0.08)', display: 'inline-block', padding: '3px 10px', borderRadius: 20, border: `1px solid ${dept.color}44`, marginBottom: 10 }}>{agent.badge}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ color: '#64748B', fontSize: 12 }}>Dept: <span style={{ color: dept.color, fontWeight: 600 }}>{dept.icon} {dept.label}</span></span>
                <span style={{ color: '#64748B', fontSize: 12 }}>Rank {agent.rank}: <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{getRadioRankTitle(agent.rank)}</span></span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748B', fontSize: 12, fontWeight: 600 }}>POWER LEVEL</span>
              <span style={{ color: ACCENT, fontSize: 14, fontWeight: 900 }}>{agent.powerLevel} / 100</span>
            </div>
            <div style={{ height: 8, background: 'rgba(34,211,238,0.12)', borderRadius: 99 }}>
              <motion.div style={{ height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #67E8F9)`, borderRadius: 99 }} initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#040E10', borderRadius: 10, padding: 4, border: '1px solid rgba(34,211,238,0.15)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '9px 8px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', background: activeTab === tab ? ACCENT : 'transparent', color: activeTab === tab ? '#000' : '#64748B', transition: 'all 0.2s' }}>{tab}</button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} style={{ background: '#040E10', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 14, padding: 28 }}>
          {activeTab === 'Overview' && (
            <div>
              <h3 style={{ color: ACCENT, fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 0, marginBottom: 12 }}>Specialty</h3>
              <p style={{ color: '#CBD5E1', lineHeight: 1.7, fontSize: 14, margin: 0, marginBottom: 24 }}>{agent.specialty}</p>
              <div style={{ background: 'rgba(34,211,238,0.05)', borderRadius: 10, padding: 16, border: '1px solid rgba(34,211,238,0.12)' }}>
                <h4 style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Department</h4>
                <div style={{ color: dept.color, fontWeight: 700, fontSize: 15 }}>{dept.icon} {dept.label}</div>
                <div style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>{dept.desc}</div>
              </div>
            </div>
          )}
          {activeTab === 'Tools' && (
            <div>
              <h3 style={{ color: ACCENT, fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 0, marginBottom: 16 }}>Equipped Tools ({agent.tools.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {agent.tools.map((tool, i) => (
                  <div key={tool} style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.18)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: ACCENT, fontSize: 12, fontWeight: 800, minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 600 }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Responsibilities' && (
            <div>
              <h3 style={{ color: ACCENT, fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 0, marginBottom: 16 }}>Core Responsibilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {agent.responsibilities.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'rgba(34,211,238,0.04)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(34,211,238,0.10)' }}>
                    <span style={{ color: ACCENT, fontWeight: 900, fontSize: 16, marginTop: -1 }}>›</span>
                    <span style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.55 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Spawn Agents' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📻</div>
              <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>Spawn {agent.name}</h3>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Deploy this agent to assist with your radio operations. Agent spawning is available through the EOF Central AI interface.</p>
              <button onClick={() => navigate('/central')} style={{ background: ACCENT, border: 'none', color: '#000', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}>Go to EOF Central AI →</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

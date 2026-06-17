import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniversityDept, getUniversityStatusMeta, getUniversityRankTitle } from '../data/universityAgentData';

const ACCENT = '#2563EB';

export default function UniversityAgentCard({ agent, compact = false }) {
  const navigate = useNavigate();
  const dept   = getUniversityDept(agent.department);
  const status = getUniversityStatusMeta(agent.status);
  const rank   = getUniversityRankTitle(agent.rank);

  if (compact) {
    return (
      <button
        onClick={() => navigate(`/university/agent/${agent.id}`)}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(37,99,235,0.14)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.14)'; }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `${dept.color}15`, border: `1px solid ${dept.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
          <div style={{ fontSize: 10, color: dept.color, marginTop: 1, fontWeight: 600 }}>{dept.label}</div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40`, flexShrink: 0 }}>{status.label}</div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/university/agent/${agent.id}`)}
      style={{ background: '#0d0d14', border: `1px solid ${dept.color}18`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left', width: '100%', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${dept.color}09`; e.currentTarget.style.borderColor = `${dept.color}38`; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${dept.color}12`; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#0d0d14'; e.currentTarget.style.borderColor = `${dept.color}18`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${dept.color}, transparent)`, opacity: 0.6 }}/>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: `${dept.color}12`, border: `1px solid ${dept.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{agent.name}</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: dept.color, textTransform: 'uppercase', marginBottom: 4 }}>{agent.codename}</div>
          <div style={{ display: 'inline-flex', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}>{status.label}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Lv.{agent.rank}</div>
          <div style={{ fontSize: 9, color: '#6B7280' }}>{rank}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>{dept.icon}</span>
          <span style={{ fontSize: 11, color: dept.color, fontWeight: 600 }}>{dept.label}</span>
        </div>
        <span style={{ fontSize: 10, color: '#4B5563', fontStyle: 'italic' }}>{agent.badge}</span>
      </div>

      <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.5, margin: 0 }}>{agent.specialty}</p>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#6B7280', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Power Level</span>
          <span style={{ fontSize: 9, color: dept.color, fontWeight: 700 }}>{agent.powerLevel}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${agent.powerLevel}%`, background: `linear-gradient(90deg, ${dept.color}, #93C5FD)`, borderRadius: 999 }}/>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {agent.tools.slice(0, 3).map(t => (
          <span key={t} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 999, background: `${dept.color}10`, border: `1px solid ${dept.color}22`, color: '#93C5FD', fontWeight: 600 }}>{t}</span>
        ))}
        {agent.tools.length > 3 && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', color: '#6B7280' }}>+{agent.tools.length - 3} more</span>}
      </div>

      <div style={{ fontSize: 10, color: ACCENT, fontWeight: 600, marginTop: 2 }}>View Full Profile →</div>
    </button>
  );
}

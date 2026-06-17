import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCentralDept, getCentralStatusMeta, getCentralRankTitle } from '../data/centralAgentData';

export default function CentralAgentCard({ agent, compact = false }) {
  const navigate = useNavigate();
  const dept   = getCentralDept(agent.department);
  const status = getCentralStatusMeta(agent.status);
  const rank   = getCentralRankTitle(agent.rank);

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/central/agent/${agent.id}`)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${dept.color}15`, border: `1px solid ${dept.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{agent.name}</div>
          <div style={{ fontSize: 10, color: dept.color, fontWeight: 600 }}>Lv.{agent.rank} · {dept.label}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40`, flexShrink: 0 }}>{status.label}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/central/agent/${agent.id}`)}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${dept.color}18`, borderRadius: 16, padding: 18, cursor: 'pointer', transition: 'all 0.18s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${dept.color}07`; e.currentTarget.style.borderColor = `${dept.color}35`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = `${dept.color}18`; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${dept.color}, transparent)` }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${dept.color}15`, border: `1px solid ${dept.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{agent.icon}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}>{status.label}</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: `${dept.color}15`, color: dept.color, border: `1px solid ${dept.color}30` }}>{dept.icon} {dept.label}</span>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 3px' }}>{agent.name}</h3>
        <p style={{ fontSize: 9, color: dept.color, fontWeight: 700, letterSpacing: '0.12em', margin: '0 0 6px', textTransform: 'uppercase' }}>{agent.codename}</p>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{agent.specialty}</p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#4B5563', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Lv.{agent.rank} · {rank}</span>
          <span style={{ fontSize: 9, color: dept.color, fontWeight: 700 }}>{agent.powerLevel}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${agent.powerLevel}%`, background: `linear-gradient(90deg, ${dept.color}, #FDE68A)`, borderRadius: 999 }}/>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {agent.tools.slice(0, 3).map(t => (
          <span key={t} style={{ fontSize: 9, padding: '3px 7px', borderRadius: 6, background: `${dept.color}10`, color: '#FDE68A', border: `1px solid ${dept.color}20`, fontWeight: 600 }}>{t}</span>
        ))}
        {agent.tools.length > 3 && (
          <span style={{ fontSize: 9, padding: '3px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: '#4B5563', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 }}>+{agent.tools.length - 3}</span>
        )}
      </div>

      <div style={{ fontSize: 10, color: dept.color, fontWeight: 700, letterSpacing: '0.06em' }}>View Full Profile →</div>
    </div>
  );
}

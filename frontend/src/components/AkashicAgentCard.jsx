import { useNavigate } from 'react-router-dom';
import { getAkashicDept, getAkashicRankTitle, getAkashicStatusMeta } from '../data/akashicAgentData';

const ACCENT = '#2DD4BF';

export default function AkashicAgentCard({ agent, compact = false }) {
  const navigate = useNavigate();
  const dept = getAkashicDept(agent.department);
  const statusMeta = getAkashicStatusMeta(agent.status);

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/akashic/agent/${agent.id}`)}
        style={{
          background: '#030F0E',
          border: '1px solid rgba(45,212,191,0.20)',
          borderRadius: 10,
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.55)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.20)'}
      >
        <span style={{ fontSize: 24 }}>{agent.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
          <div style={{ color: dept.color, fontSize: 11, fontWeight: 600 }}>{agent.badge}</div>
        </div>
        <div style={{ fontSize: 11, color: statusMeta.color, fontWeight: 700, background: statusMeta.bg, padding: '2px 8px', borderRadius: 20 }}>{statusMeta.label}</div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/akashic/agent/${agent.id}`)}
      style={{
        background: '#030F0E',
        border: `1px solid rgba(45,212,191,0.22)`,
        borderRadius: 14,
        padding: 20,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'border-color 0.2s, transform 0.15s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(45,212,191,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: dept.color, borderRadius: '14px 14px 0 0' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(45,212,191,0.10)`, border: `1px solid rgba(45,212,191,0.28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{agent.name}</div>
          <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 600, marginTop: 2 }}>CODENAME: <span style={{ color: ACCENT }}>{agent.codename}</span></div>
          <div style={{ color: dept.color, fontSize: 11, fontWeight: 700, marginTop: 3, background: `rgba(45,212,191,0.08)`, display: 'inline-block', padding: '2px 8px', borderRadius: 20, border: `1px solid ${dept.color}33` }}>{agent.badge}</div>
        </div>
        <div style={{ fontSize: 11, color: statusMeta.color, fontWeight: 700, background: statusMeta.bg, padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>{statusMeta.label}</div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: '#64748B', fontSize: 10, fontWeight: 600 }}>POWER LEVEL</span>
          <span style={{ color: ACCENT, fontSize: 10, fontWeight: 800 }}>{agent.powerLevel}/100</span>
        </div>
        <div style={{ height: 5, background: 'rgba(45,212,191,0.12)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${agent.powerLevel}%`, background: `linear-gradient(90deg, #0D9488, ${ACCENT})`, borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '7px 10px' }}>
          <div style={{ color: '#475569', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>RANK</div>
          <div style={{ color: '#CBD5E1', fontSize: 12, fontWeight: 700 }}>{getAkashicRankTitle(agent.rank)}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '7px 10px' }}>
          <div style={{ color: '#475569', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>DEPT</div>
          <div style={{ color: dept.color, fontSize: 12, fontWeight: 700 }}>{dept.icon} {dept.label}</div>
        </div>
      </div>

      <p style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
        {agent.specialty.length > 140 ? agent.specialty.slice(0, 140) + '…' : agent.specialty}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {agent.tools.slice(0, 4).map(t => (
          <span key={t} style={{ fontSize: 10, color: '#5EEAD4', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.22)', borderRadius: 6, padding: '3px 8px', fontWeight: 600 }}>{t}</span>
        ))}
        {agent.tools.length > 4 && <span style={{ fontSize: 10, color: '#64748B', padding: '3px 8px' }}>+{agent.tools.length - 4} more</span>}
      </div>

      <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, textAlign: 'right', marginTop: -4 }}>View Full Profile →</div>
    </div>
  );
}

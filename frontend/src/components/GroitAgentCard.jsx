import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDivisionMeta, getStatusMeta, getRankTitle } from '../data/griotAgentData';

export default function GroitAgentCard({ agent, compact = false }) {
  const navigate = useNavigate();
  const div = getDivisionMeta(agent.division);
  const status = getStatusMeta(agent.status);
  const rank = getRankTitle(agent.rank);

  if (compact) {
    return (
      <button
        onClick={() => navigate(`/griot/agent/${agent.id}`)}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid rgba(124,58,237,0.14)`,
          borderRadius: 12,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'all 0.15s',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = `rgba(124,58,237,0.08)`;
          e.currentTarget.style.borderColor = `rgba(124,58,237,0.3)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          e.currentTarget.style.borderColor = `rgba(124,58,237,0.14)`;
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `rgba(124,58,237,0.12)`,
          border: `1px solid rgba(124,58,237,0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 10, color: div.color, marginTop: 1, fontWeight: 600, letterSpacing: '0.04em' }}>
            {div.label}
          </div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
          background: status.bg, color: status.color, border: `1px solid ${status.color}40`,
          flexShrink: 0,
        }}>
          {status.label}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/griot/agent/${agent.id}`)}
      style={{
        background: '#0e0e14',
        border: `1px solid rgba(124,58,237,0.15)`,
        borderRadius: 16,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.18s',
        textAlign: 'left',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `rgba(124,58,237,0.07)`;
        e.currentTarget.style.borderColor = `rgba(124,58,237,0.35)`;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(124,58,237,0.14)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#0e0e14';
        e.currentTarget.style.borderColor = `rgba(124,58,237,0.15)`;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Glow strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${div.color}, transparent)`,
        opacity: 0.6,
      }}/>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `rgba(124,58,237,0.1)`,
          border: `1px solid rgba(124,58,237,0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>{agent.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{agent.name}</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: div.color, textTransform: 'uppercase', marginBottom: 4 }}>
            {agent.codename}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
            background: status.bg, color: status.color, border: `1px solid ${status.color}40`,
          }}>
            {status.label}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Lv.{agent.rank}</div>
          <div style={{ fontSize: 9, color: '#6B7280' }}>{rank}</div>
        </div>
      </div>

      {/* Division + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>{div.icon}</span>
          <span style={{ fontSize: 11, color: div.color, fontWeight: 600 }}>{div.label}</span>
        </div>
        <span style={{ fontSize: 10, color: '#4B5563', fontStyle: 'italic' }}>{agent.badge}</span>
      </div>

      {/* Specialty */}
      <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.5, margin: 0 }}>
        {agent.specialty}
      </p>

      {/* Power bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#6B7280', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Power Level</span>
          <span style={{ fontSize: 9, color: div.color, fontWeight: 700 }}>{agent.powerLevel}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${agent.powerLevel}%`,
            background: `linear-gradient(90deg, ${div.color}, rgba(124,58,237,0.6))`,
            borderRadius: 999,
          }}/>
        </div>
      </div>

      {/* Tools preview */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {agent.tools.slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 999,
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            color: '#A78BFA', fontWeight: 600,
          }}>{t}</span>
        ))}
        {agent.tools.length > 3 && (
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', color: '#6B7280',
          }}>+{agent.tools.length - 3} more</span>
        )}
      </div>

      {/* View profile hint */}
      <div style={{
        fontSize: 10, color: '#7C3AED', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 4, marginTop: 2,
      }}>
        View Full Profile →
      </div>
    </button>
  );
}

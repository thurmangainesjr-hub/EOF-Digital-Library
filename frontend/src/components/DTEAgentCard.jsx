import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankTitle, getDivMeta, getStatusMeta } from '../data/dteAgents';

const BRANCH_COLOR = {
  'Army':        '#4B9E4B',
  'Navy':        '#1B3B8F',
  'Marine Corps':'#8B1A1A',
  'Air Force':   '#1A6DB5',
  'Space Force': '#1A1A3E',
  'Coast Guard': '#E8A020',
};

export default function DTEAgentCard({ agent, compact = false }) {
  const navigate = useNavigate();
  const div  = getDivMeta(agent.division);
  const sm   = getStatusMeta(agent.status);
  const bc   = BRANCH_COLOR[agent.branch] || '#888';
  const rank = getRankTitle(agent.rank);

  return (
    <div
      onClick={() => navigate(`/dev-team/agent/${agent.id}`)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${div.color}28`,
        borderRadius: 12,
        padding: compact ? '10px 12px' : '14px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = div.color + '10';
        e.currentTarget.style.borderColor = div.color + '55';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 20px ${div.color}18`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = div.color + '28';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* top accent line */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${div.color},transparent)` }} />

      {/* header row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
        {/* avatar */}
        <div style={{
          width: compact ? 36 : 44, height: compact ? 36 : 44, borderRadius: 10,
          background: `linear-gradient(135deg, ${div.color}25, ${div.color}10)`,
          border: `1.5px solid ${div.color}40`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: compact ? 17 : 22, flexShrink: 0,
        }}>
          {agent.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 6 }}>
            <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: '#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {agent.name}
            </span>
            {/* status dot */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap: 3,
              fontSize: 8, fontWeight: 700, color: sm.color,
              background: sm.color + '18', border: `1px solid ${sm.color}40`,
              padding: '2px 6px', borderRadius: 20, flexShrink: 0,
            }}>
              <span style={{ width:4, height:4, borderRadius:'50%', background:sm.color, display:'inline-block' }} />
              {sm.label}
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{agent.codename}</div>
        </div>
      </div>

      {/* division badge + rank */}
      <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
        <span style={{
          fontSize: 8, fontWeight: 700, color: div.color,
          background: div.color + '15', border: `1px solid ${div.color}30`,
          padding: '2px 7px', borderRadius: 20,
        }}>
          {div.icon} {div.badge}
        </span>
        <span style={{
          fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 20,
        }}>
          Rank {agent.rank} · {rank}
        </span>
        {agent.branch && (
          <span style={{
            fontSize: 8, fontWeight: 700, color: bc,
            background: bc + '18', border: `1px solid ${bc}30`,
            padding: '2px 7px', borderRadius: 20,
          }}>
            {agent.branch}
          </span>
        )}
      </div>

      {/* specialty */}
      {!compact && (
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
          {agent.specialty}
        </div>
      )}

      {/* power level bar */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>Power Level</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: div.color }}>{agent.powerLevel}</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${agent.powerLevel}%`,
            background: `linear-gradient(90deg, ${div.color}88, ${div.color})`,
          }} />
        </div>
      </div>
    </div>
  );
}

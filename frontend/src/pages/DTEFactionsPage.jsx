import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FACTIONS, getAgent, getDivMeta } from '../data/dteAgents';

export default function DTEFactionsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const selected = active ? FACTIONS.find(f => f.id === active) : null;

  return (
    <div style={{ background: '#080604', minHeight: '100vh', color: '#fff' }}>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 60%)' }} />

      <div style={{ position:'relative', zIndex:1, padding:'24px 24px 60px', maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:'0.12em',
              color:'#F97316', background:'rgba(249,115,22,0.1)',
              border:'1px solid rgba(249,115,22,0.25)', padding:'3px 10px', borderRadius:20,
            }}>
              DEV TEAM ELITE
            </span>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>ELITE FACTIONS</span>
          </div>
          <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:'-0.02em', marginBottom:6 }}>
            ⚔️ Dev Factions
          </h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            6 elite squads · {FACTIONS.reduce((s,f)=>s+f.agentIds.length,0)} agents · Click a faction to see its roster
          </p>
        </div>

        {/* Faction grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16, marginBottom:32 }}>
          {FACTIONS.map(f => (
            <FactionCard key={f.id} faction={f} isActive={active===f.id} onClick={() => setActive(active===f.id ? null : f.id)} />
          ))}
        </div>

        {/* Expanded faction detail */}
        {selected && (
          <FactionDetail faction={selected} navigate={navigate} />
        )}

      </div>
    </div>
  );
}

function FactionCard({ faction: f, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? f.color+'12' : 'rgba(255,255,255,0.03)',
        border:`1.5px solid ${isActive ? f.color+'60' : f.color+'22'}`,
        borderRadius:14, padding:'20px', cursor:'pointer',
        transition:'all 0.18s', position:'relative', overflow:'hidden',
        boxShadow: isActive ? `0 8px 32px ${f.color}18` : 'none',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = f.color+'0C';
          e.currentTarget.style.borderColor = f.color+'40';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = f.color+'22';
        }
      }}
    >
      {/* Accent bar */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${f.color},transparent)` }} />

      {/* Icon + name */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
        <div style={{
          width:52, height:52, borderRadius:13, flexShrink:0,
          background:`${f.color}15`, border:`1.5px solid ${f.color}35`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
        }}>
          {f.icon}
        </div>
        <div>
          <h3 style={{ fontSize:17, fontWeight:800, marginBottom:3, color:'#fff' }}>{f.name}</h3>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>{f.codename}</div>
          <span style={{
            display:'inline-block', marginTop:5,
            fontSize:8, fontWeight:700, color:f.color,
            background:f.color+'18', border:`1px solid ${f.color}30`,
            padding:'2px 8px', borderRadius:20,
          }}>
            {f.rank}
          </span>
        </div>
      </div>

      {/* Mission */}
      <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6, marginBottom:14 }}>
        {f.mission}
      </p>

      {/* Mini stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
        {Object.entries(f.stats).map(([k,v]) => (
          <div key={k} style={{
            background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'8px 10px',
          }}>
            <div style={{ fontSize:16, fontWeight:800, color:f.color }}>{v}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textTransform:'capitalize' }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Expand indicator */}
      <div style={{ marginTop:12, textAlign:'right', fontSize:11, color:f.color, fontWeight:700 }}>
        {isActive ? 'Collapse ▲' : 'View Roster ▼'}
      </div>
    </div>
  );
}

function FactionDetail({ faction: f, navigate }) {
  const agents = f.agentIds.map(getAgent).filter(Boolean);

  return (
    <div style={{
      background:`${f.color}08`, border:`1px solid ${f.color}30`,
      borderRadius:16, padding:'24px', marginTop:8,
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <span style={{ fontSize:28 }}>{f.icon}</span>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:2 }}>{f.name} Roster</h2>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{agents.length} agents deployed to this faction</div>
        </div>
        <div style={{
          marginLeft:'auto', fontSize:9, fontWeight:700, color:f.color,
          background:f.color+'15', border:`1px solid ${f.color}30`,
          padding:'4px 12px', borderRadius:20,
        }}>
          {f.badge}
        </div>
      </div>

      {/* Agent grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
        {agents.map(a => {
          const dm = getDivMeta(a.division);
          return (
            <div
              key={a.id}
              onClick={() => navigate(`/dev-team/agent/${a.id}`)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderRadius:10,
                background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.07)`,
                cursor:'pointer', transition:'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background=dm.color+'12'; e.currentTarget.style.borderColor=dm.color+'35'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}
            >
              <span style={{
                width:36, height:36, borderRadius:9, fontSize:18,
                background:dm.color+'18', border:`1px solid ${dm.color}30`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                {a.icon}
              </span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>{a.codename}</div>
              </div>
              <span style={{
                marginLeft:'auto', fontSize:8, fontWeight:700, color:dm.color,
                background:dm.color+'18', padding:'2px 6px', borderRadius:20, flexShrink:0,
              }}>
                Lvl {a.rank}
              </span>
            </div>
          );
        })}
      </div>

      {/* Divisions note */}
      <div style={{ marginTop:16, fontSize:11, color:'rgba(255,255,255,0.25)' }}>
        Covers divisions: {f.divisions.join(' · ')}
      </div>
    </div>
  );
}

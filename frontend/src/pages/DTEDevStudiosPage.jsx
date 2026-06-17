import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STUDIOS, getAgent } from '../data/dteAgents';

export default function DTEDevStudiosPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const selected = active ? STUDIOS.find(s => s.id === active) : null;

  return (
    <div style={{ background:'#080604', minHeight:'100vh', color:'#fff' }}>

      {/* Background */}
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)' }} />

      <div style={{ position:'relative',zIndex:1,padding:'24px 24px 60px',maxWidth:1200,margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
            <span style={{ fontSize:9,fontWeight:700,letterSpacing:'0.12em',color:'#06B6D4',
              background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.25)',
              padding:'3px 10px',borderRadius:20 }}>
              DEV TEAM ELITE
            </span>
            <span style={{ fontSize:9,color:'rgba(255,255,255,0.25)' }}>DEV STUDIOS</span>
          </div>
          <h1 style={{ fontSize:30,fontWeight:800,letterSpacing:'-0.02em',marginBottom:6 }}>
            🏭 Dev Studios
          </h1>
          <p style={{ fontSize:13,color:'rgba(255,255,255,0.4)' }}>
            6 specialized studios · Each studio has a dedicated team and proven delivery pipeline
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28 }}>
          {[
            { label:'Total Studios',    val: 6,    color:'#06B6D4' },
            { label:'Active Projects',  val: STUDIOS.reduce((s,st)=>s+st.activeProjects,0), color:'#F97316' },
            { label:'Products Shipped', val: STUDIOS.reduce((s,st)=>s+st.shipped,0),        color:'#34D399' },
            { label:'Avg Timeline',     val: '6w',  color:'#FBBF24' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.03)',border:`1px solid ${s.color}20`,borderRadius:10,padding:'14px 16px' }}>
              <div style={{ fontSize:24,fontWeight:800,color:s.color,lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.35)',marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Studio cards */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16,marginBottom:32 }}>
          {STUDIOS.map(studio => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isActive={active===studio.id}
              onClick={() => setActive(active===studio.id ? null : studio.id)}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Selected studio detail */}
        {selected && (
          <StudioDetail studio={selected} navigate={navigate} />
        )}

        {/* How it works */}
        <div style={{ marginTop:32,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'24px 24px' }}>
          <h3 style={{ fontSize:16,fontWeight:700,marginBottom:16,color:'rgba(255,255,255,0.8)' }}>How DTE Studios Work</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12 }}>
            {[
              { step:'01',title:'Discovery Call',desc:'We scope the project, define deliverables, and assign the right studio.' },
              { step:'02',title:'Sprint Plan',desc:'A dedicated team is assembled. Milestones are set. Work begins within 48h.' },
              { step:'03',title:'Rapid Builds',desc:'Agile 2-week sprints with client demos and feedback loops built in.' },
              { step:'04',title:'QA & Deploy',desc:'Security audit, QA testing, and zero-downtime production deployment.' },
              { step:'05',title:'Ongoing Support',desc:'30-day post-launch support, monitoring, and growth intelligence.' },
            ].map(s => (
              <div key={s.step} style={{ background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px' }}>
                <div style={{ fontSize:20,fontWeight:900,color:'rgba(249,115,22,0.3)',marginBottom:6 }}>{s.step}</div>
                <div style={{ fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.8)',marginBottom:4 }}>{s.title}</div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.4)',lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StudioCard({ studio: s, isActive, onClick, navigate }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? s.color+'10' : 'rgba(255,255,255,0.03)',
        border:`1.5px solid ${isActive ? s.color+'55' : s.color+'20'}`,
        borderRadius:14,padding:'20px',cursor:'pointer',
        transition:'all 0.18s',position:'relative',overflow:'hidden',
        boxShadow: isActive ? `0 8px 32px ${s.color}15` : 'none',
      }}
      onMouseEnter={e => { if(!isActive){ e.currentTarget.style.background=s.color+'0A'; e.currentTarget.style.borderColor=s.color+'38'; }}}
      onMouseLeave={e => { if(!isActive){ e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor=s.color+'20'; }}}
    >
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${s.color},transparent)` }} />

      <div style={{ display:'flex',alignItems:'flex-start',gap:14,marginBottom:14 }}>
        <div style={{
          width:52,height:52,borderRadius:13,flexShrink:0,
          background:`${s.color}15`,border:`1.5px solid ${s.color}35`,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,
        }}>
          {s.icon}
        </div>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:17,fontWeight:800,marginBottom:2,color:'#fff' }}>{s.name}</h3>
          <div style={{ fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:6 }}>{s.tagline}</div>
          <span style={{
            fontSize:9,fontWeight:700,color:s.color,background:s.color+'18',
            border:`1px solid ${s.color}30`,padding:'2px 8px',borderRadius:20,
          }}>
            {s.avgTimeline}
          </span>
        </div>
      </div>

      <p style={{ fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.6,marginBottom:14 }}>{s.description}</p>

      {/* Deliverables */}
      <div style={{ display:'flex',flexWrap:'wrap',gap:5,marginBottom:14 }}>
        {s.deliverables.map((d,i) => (
          <span key={i} style={{
            fontSize:9,fontWeight:600,color:s.color,background:s.color+'10',
            border:`1px solid ${s.color}22`,padding:'3px 8px',borderRadius:6,
          }}>{d}</span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
        <div style={{ background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 10px' }}>
          <div style={{ fontSize:18,fontWeight:800,color:s.color }}>{s.activeProjects}</div>
          <div style={{ fontSize:9,color:'rgba(255,255,255,0.3)' }}>Active Projects</div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 10px' }}>
          <div style={{ fontSize:18,fontWeight:800,color:'#34D399' }}>{s.shipped}</div>
          <div style={{ fontSize:9,color:'rgba(255,255,255,0.3)' }}>Products Shipped</div>
        </div>
      </div>

      <div style={{ marginTop:12,textAlign:'right',fontSize:11,color:s.color,fontWeight:700 }}>
        {isActive ? 'Collapse ▲' : 'View Studio ▼'}
      </div>
    </div>
  );
}

function StudioDetail({ studio: s, navigate }) {
  const lead = getAgent(s.agentLead);

  return (
    <div style={{
      background:`${s.color}07`,border:`1px solid ${s.color}28`,
      borderRadius:16,padding:'24px',
    }}>
      <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:20,flexWrap:'wrap' }}>
        <span style={{ fontSize:28 }}>{s.icon}</span>
        <div>
          <h2 style={{ fontSize:20,fontWeight:800,color:'#fff',marginBottom:2 }}>{s.name}</h2>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)' }}>{s.description}</div>
        </div>
        <button
          onClick={() => navigate('/dev-team/dev/team')}
          style={{
            marginLeft:'auto',padding:'9px 20px',borderRadius:10,border:'none',
            background:`linear-gradient(135deg,${s.color},#F97316)`,
            color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',
          }}
        >
          View Full Team →
        </button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        {/* Studio lead */}
        {lead && (
          <div style={{ background:'rgba(255,255,255,0.04)',border:`1px solid ${s.color}20`,borderRadius:12,padding:'16px' }}>
            <div style={{ fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',marginBottom:10 }}>STUDIO LEAD</div>
            <div
              onClick={() => navigate(`/dev-team/agent/${lead.id}`)}
              style={{
                display:'flex',alignItems:'center',gap:10,cursor:'pointer',
                padding:'10px 12px',borderRadius:10,
                background:s.color+'10',border:`1px solid ${s.color}25`,
              }}
            >
              <span style={{ fontSize:22 }}>{lead.icon}</span>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:'#fff' }}>{lead.name}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,0.4)' }}>{lead.codename}</div>
              </div>
              <span style={{ marginLeft:'auto',fontSize:9,fontWeight:700,color:s.color }}>View Profile →</span>
            </div>
          </div>
        )}

        {/* Deliverables list */}
        <div style={{ background:'rgba(255,255,255,0.04)',border:`1px solid ${s.color}20`,borderRadius:12,padding:'16px' }}>
          <div style={{ fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',marginBottom:10 }}>WHAT WE DELIVER</div>
          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {s.deliverables.map((d,i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,0.65)' }}>
                <span style={{ color:s.color }}>✓</span> {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

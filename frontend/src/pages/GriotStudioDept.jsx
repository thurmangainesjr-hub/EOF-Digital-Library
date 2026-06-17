import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEPARTMENTS, ECOSYSTEM_INTEGRATIONS, getDept, GIS_PRIMARY, GIS_EMERALD } from '../data/griotStudioData';

export default function GriotStudioDept() {
  const location = useLocation();
  const navigate = useNavigate();
  const dept     = getDept(location.pathname);

  if (!dept) {
    return (
      <div style={{ minHeight:'100vh', background:'#07050F', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🎮</div>
          <h2 style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Department not found</h2>
          <button onClick={() => navigate('/griot-studio')} style={{
            padding:'10px 24px', borderRadius:10, background: GIS_PRIMARY,
            color:'#fff', border:'none', fontWeight:700, cursor:'pointer',
          }}>Back to Hub</button>
        </div>
      </div>
    );
  }

  const integration = dept.integration
    ? ECOSYSTEM_INTEGRATIONS.find(i => i.name === dept.integration || i.name.includes(dept.integration.split(' ')[0]))
    : null;

  return (
    <div style={{ background:'#07050F', minHeight:'100vh', color:'#fff' }}>

      {/* Ambient glow */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 65% 35% at 50% 0%, ${dept.color}07 0%, transparent 60%)` }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto', padding:'24px 28px 60px' }}>

        {/* Back */}
        <button onClick={() => navigate('/griot-studio')} style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'7px 16px', borderRadius:8,
          border:'1px solid rgba(255,255,255,0.1)',
          background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.55)',
          fontSize:12, fontWeight:600, cursor:'pointer', marginBottom:28,
        }}>
          ← GIS Hub
        </button>

        {/* ── HERO HEADER ──────────────────────────────────────────── */}
        <div style={{
          background:'rgba(255,255,255,0.02)', border:`1px solid ${dept.color}28`,
          borderRadius:16, padding:'24px', marginBottom:20, position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${dept.color},transparent)` }}/>

          <div style={{ display:'flex', alignItems:'flex-start', gap:18, flexWrap:'wrap' }}>
            {/* Icon */}
            <div style={{
              width:72, height:72, borderRadius:16, flexShrink:0,
              background:`${dept.color}18`, border:`2px solid ${dept.color}40`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:36,
              boxShadow:`0 0 30px ${dept.color}15`,
            }}>{dept.icon}</div>

            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:dept.color, marginBottom:6 }}>
                {dept.fullName.toUpperCase()} · GRIOT INTERACTIVE STUDIOS
              </div>
              <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.01em', color:'#fff', marginBottom:4 }}>
                {dept.lead}
              </h1>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.45)', fontStyle:'italic', marginBottom:12 }}>
                "{dept.tagline}"
              </div>

              {/* Quick badges */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:9, fontWeight:700, color:dept.color, background:dept.color+'15', border:`1px solid ${dept.color}30`, padding:'3px 10px', borderRadius:20 }}>
                  Lead Agent
                </span>
                <span style={{ fontSize:9, fontWeight:700, color:GIS_EMERALD, background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.25)', padding:'3px 10px', borderRadius:20 }}>
                  {dept.spawnAgents.length} Spawn Classes
                </span>
                {dept.integration && (
                  <span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.07)', padding:'3px 10px', borderRadius:20 }}>
                    ↗ {dept.integration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>

          {/* Responsibilities */}
          <Section title="Responsibilities" icon="📋" color={dept.color}>
            <ol style={{ paddingLeft:18, margin:0 }}>
              {dept.responsibilities.map((r, i) => (
                <li key={i} style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.65, marginBottom:7 }}>{r}</li>
              ))}
            </ol>
          </Section>

          {/* Spawn Agents */}
          <Section title="Spawn-able Agents" icon="⚡" color={dept.color}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:12, lineHeight:1.5 }}>
              {dept.lead} can create any of these specialist agents when the project demands it.
              Agents may collaborate across departments.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {dept.spawnAgents.map((a, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 12px', borderRadius:9,
                  background:`${dept.color}08`, border:`1px solid ${dept.color}18`,
                }}>
                  <span style={{
                    width:32, height:32, borderRadius:8, fontSize:16,
                    background:dept.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>{a.name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.38)' }}>{a.role}</div>
                  </div>
                  <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, color:dept.color, background:dept.color+'18', padding:'2px 8px', borderRadius:20 }}>
                    Spawn
                  </span>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* ── INTEGRATION CALLOUT ──────────────────────────────────── */}
        {dept.integration && (
          <div style={{
            background:`${integration?.color || dept.color}06`,
            border:`1px solid ${integration?.color || dept.color}22`,
            borderRadius:14, padding:'20px 24px', marginBottom:20,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <span style={{ fontSize:24 }}>{dept.integrationIcon}</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color: integration?.color || dept.color, letterSpacing:'0.08em', marginBottom:2 }}>
                  DIRECT INTEGRATION
                </div>
                <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{dept.integration}</div>
              </div>
            </div>

            {integration && (
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.65, margin:'0 0 14px' }}>
                {integration.desc}
              </p>
            )}

            {dept.integrationExtra && dept.integrationExtra.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {dept.integrationExtra.map((e, i) => (
                  <span key={i} style={{
                    fontSize:10, fontWeight:600,
                    color: integration?.color || dept.color,
                    background:(integration?.color || dept.color)+'12',
                    border:`1px solid ${integration?.color || dept.color}25`,
                    padding:'4px 10px', borderRadius:8,
                  }}>{e}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── OTHER DEPARTMENTS ─────────────────────────────────────── */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px 20px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:'0.08em', marginBottom:14 }}>
            OTHER DEPARTMENTS
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {DEPARTMENTS.filter(d => d.id !== dept.id).map(d => (
              <button key={d.id} onClick={() => navigate(d.path)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 12px', borderRadius:9,
                background:`${d.color}08`, border:`1px solid ${d.color}20`,
                color:'rgba(255,255,255,0.55)', fontSize:11, fontWeight:600, cursor:'pointer',
                transition:'all 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background=d.color+'18'; e.currentTarget.style.color='#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background=d.color+'08'; e.currentTarget.style.color='rgba(255,255,255,0.55)'; }}
              >
                <span>{d.icon}</span> {d.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ title, icon, color, children }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${color}20`, borderRadius:12, overflow:'hidden' }}>
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${color}15`, background:color+'07', display:'flex', alignItems:'center', gap:8 }}>
        <span>{icon}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>{title}</span>
      </div>
      <div style={{ padding:'16px' }}>{children}</div>
    </div>
  );
}

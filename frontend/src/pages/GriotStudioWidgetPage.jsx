import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, GIS_PRIMARY, GIS_EMERALD, GIS_CYAN } from '../data/griotStudioData';

export default function GriotStudioWidgetPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background:'#07050F', minHeight:'100vh', color:'#fff', padding:'28px 28px 60px', maxWidth:1200, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', color: GIS_PRIMARY,
          background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)',
          padding:'3px 12px', borderRadius:20, display:'inline-block', marginBottom:10 }}>
          WIDGET PAGE · GRIOT INTERACTIVE STUDIOS
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>🎮 GIS Widgets</h1>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>All Griot Interactive Studios components and quick-launch cards</p>
      </div>

      {/* Big launch card */}
      <div style={{
        background:`linear-gradient(135deg,rgba(124,58,237,0.12),rgba(52,211,153,0.06))`,
        border:'1px solid rgba(124,58,237,0.3)', borderRadius:16,
        padding:'28px', marginBottom:28, position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${GIS_PRIMARY},${GIS_EMERALD},${GIS_CYAN})` }}/>

        <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          <div style={{
            width:72, height:72, borderRadius:18, fontSize:36,
            background:'rgba(124,58,237,0.18)', border:'2px solid rgba(124,58,237,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>🎮</div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Griot Interactive Studios</h2>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:12 }}>
              Unreal Engine Development Division · Expression of Freedom Ecosystem
            </div>
            <div style={{ fontSize:11, fontStyle:'italic', color:'rgba(124,58,237,0.9)', fontWeight:600 }}>
              "Build the World. Play the Story."
            </div>
          </div>
          <button onClick={() => navigate('/griot-studio')} style={{
            padding:'12px 28px', borderRadius:12, border:'none',
            background:`linear-gradient(135deg,${GIS_PRIMARY},${GIS_EMERALD})`,
            color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
          }}>
            Open GIS →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        {[
          { label:'Departments',  val:12, color: GIS_PRIMARY  },
          { label:'Lead Agents',  val:12, color:'#A78BFA'     },
          { label:'Spawn Classes',val:50, color: GIS_EMERALD  },
          { label:'Integrations', val:10, color: GIS_CYAN     },
        ].map(s => (
          <div key={s.label} style={{
            background:`${s.color}0A`, border:`1px solid ${s.color}20`, borderRadius:10, padding:'14px 16px',
          }}>
            <div style={{ fontSize:26, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Department quick-launch grid */}
      <div style={{ marginBottom:10, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em' }}>
        QUICK ACCESS — ALL DEPARTMENTS
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
        {DEPARTMENTS.map(d => (
          <button key={d.id} onClick={() => navigate(d.path)} style={{
            display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
            borderRadius:10, border:`1px solid ${d.color}22`,
            background:`${d.color}07`, cursor:'pointer', textAlign:'left',
            transition:'all 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background=d.color+'14'; e.currentTarget.style.borderColor=d.color+'45'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=d.color+'07'; e.currentTarget.style.borderColor=d.color+'22'; e.currentTarget.style.transform='none'; }}
          >
            <span style={{
              width:32, height:32, borderRadius:8, fontSize:16,
              background:d.color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>{d.icon}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)' }}>{d.lead}</div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}

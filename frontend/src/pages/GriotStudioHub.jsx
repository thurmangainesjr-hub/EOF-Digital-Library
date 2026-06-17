import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEPARTMENTS, ECOSYSTEM_INTEGRATIONS, GIS_STATS,
  GIS_PRIMARY, GIS_EMERALD, GIS_CYAN,
} from '../data/griotStudioData';

export default function GriotStudioHub() {
  const navigate = useNavigate();
  const [hoveredDept, setHoveredDept] = useState(null);

  return (
    <div style={{ background:'#07050F', minHeight:'100vh', color:'#fff' }}>

      {/* Background ambient */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:`
          radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 50% 30% at 80% 80%, rgba(52,211,153,0.04) 0%, transparent 60%)
        ` }} />

      <div style={{ position:'relative', zIndex:1, padding:'28px 28px 60px', maxWidth:1400, margin:'0 auto' }}>

        {/* ── HERO ───────────────────────────────────────────────── */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:10 }}>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:'0.14em',
              color: GIS_PRIMARY, background:'rgba(124,58,237,0.1)',
              border:'1px solid rgba(124,58,237,0.3)', padding:'3px 12px', borderRadius:20,
            }}>
              GRIOT INTERACTIVE STUDIOS
            </span>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em' }}>
              UNREAL ENGINE DEVELOPMENT DIVISION · EOF ECOSYSTEM
            </span>
          </div>
          <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.02em', marginBottom:6, lineHeight:1.1 }}>
            🎮 Build the World.{' '}
            <span style={{
              background:`linear-gradient(135deg,${GIS_PRIMARY},${GIS_EMERALD})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              Play the Story.
            </span>
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', maxWidth:640, lineHeight:1.6 }}>
            A story can become a game. A game can become a film. A film can become a course.
            Every creation remains connected through the Expression of Freedom ecosystem.
          </p>
        </div>

        {/* ── STATS ──────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:32 }}>
          {GIS_STATS.map(s => (
            <div key={s.label} style={{
              background:`${s.color}0A`, border:`1px solid ${s.color}20`,
              borderRadius:10, padding:'12px 14px',
            }}>
              <div style={{ fontSize:24, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', marginTop:4, letterSpacing:'0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── TWO-COL: DEPARTMENTS + ECOSYSTEM ───────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, marginBottom:28 }}>

          {/* Departments grid */}
          <div>
            <SectionHeader title="12 Core Departments" sub="Click any department to open it" color={GIS_PRIMARY}/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
              {DEPARTMENTS.map(d => (
                <DeptCard
                  key={d.id}
                  dept={d}
                  hovered={hoveredDept === d.id}
                  onHover={setHoveredDept}
                  onClick={() => navigate(d.path)}
                />
              ))}
            </div>
          </div>

          {/* Ecosystem integrations */}
          <div>
            <SectionHeader title="Ecosystem Integrations" sub="All systems connected" color={GIS_EMERALD}/>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {ECOSYSTEM_INTEGRATIONS.map(int => (
                <div key={int.name} style={{
                  display:'flex', alignItems:'flex-start', gap:10,
                  padding:'10px 12px', borderRadius:10,
                  background:`${int.color}08`, border:`1px solid ${int.color}20`,
                  transition:'all 0.12s', cursor:'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background=int.color+'12'; e.currentTarget.style.borderColor=int.color+'35'; }}
                  onMouseLeave={e => { e.currentTarget.style.background=int.color+'08'; e.currentTarget.style.borderColor=int.color+'20'; }}
                >
                  <span style={{
                    width:30, height:30, borderRadius:8, fontSize:14,
                    background:int.color+'18', border:`1px solid ${int.color}30`,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>{int.icon}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', marginBottom:2 }}>{int.name}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.38)', lineHeight:1.4 }}>{int.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AGENT SPAWNING FRAMEWORK ────────────────────────────── */}
        <div style={{
          background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.18)',
          borderRadius:16, padding:'24px 28px', marginBottom:24,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <span style={{ fontSize:24 }}>⚡</span>
            <div>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:2 }}>Agent Spawning Framework</h2>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
                Every Director Agent can create unlimited specialist sub-agents on demand
              </div>
            </div>
            <span style={{
              marginLeft:'auto', fontSize:9, fontWeight:700, color: GIS_PRIMARY,
              background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)',
              padding:'4px 12px', borderRadius:20,
            }}>GLOBAL RULE</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {[
              {
                director: 'Game Director', icon: '🎮', color: '#7C3AED',
                spawns: ['Quest Designer','Economy Designer','Mission Designer','Balance Specialist','Progression Designer','Puzzle Designer'],
              },
              {
                director: 'Technical Director', icon: '⚙️', color: '#06B6D4',
                spawns: ['Blueprint Engineer','C++ Engineer','UI Engineer','Networking Engineer','Optimization Engineer'],
              },
              {
                director: 'World Architect', icon: '🌍', color: '#10B981',
                spawns: ['City Builder','Dungeon Builder','Landscape Designer','Weather Designer','Biome Designer'],
              },
            ].map(ex => (
              <div key={ex.director} style={{
                background:`${ex.color}08`, border:`1px solid ${ex.color}20`, borderRadius:12, padding:'14px 16px',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <span style={{
                    width:32, height:32, borderRadius:8, fontSize:16,
                    background:ex.color+'18', display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{ex.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{ex.director}</div>
                    <div style={{ fontSize:9, color: ex.color, fontWeight:600 }}>Director Agent</div>
                  </div>
                </div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginBottom:8, fontWeight:600, letterSpacing:'0.08em' }}>
                  SPAWNS ↓
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {ex.spawns.map(s => (
                    <span key={s} style={{
                      fontSize:9, fontWeight:600, color: ex.color,
                      background:ex.color+'12', border:`1px solid ${ex.color}25`,
                      padding:'3px 8px', borderRadius:6,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>
            Agents may collaborate across departments · Agents may request support from other systems ·
            Agents may create temporary project-specific specialists
          </div>
        </div>

        {/* ── VISION ─────────────────────────────────────────────── */}
        <div style={{
          background:'rgba(52,211,153,0.04)', border:'1px solid rgba(52,211,153,0.15)',
          borderRadius:14, padding:'20px 24px',
        }}>
          <div style={{ fontSize:12, fontWeight:700, color: GIS_EMERALD, letterSpacing:'0.1em', marginBottom:12 }}>
            LONG-TERM OBJECTIVE
          </div>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.75, margin:0, maxWidth:860 }}>
            Create a fully integrated creator-owned entertainment ecosystem where every EOF application can
            contribute to the development of games, films, music, education, simulations, virtual worlds, and
            future interactive experiences.{' '}
            <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Every system contributes. Every agent collaborates.
            Every department can expand. Every director can spawn specialists. Every creation remains connected
            through the Expression of Freedom ecosystem.</span>
          </p>
        </div>

      </div>
    </div>
  );
}

/* ── Helper components ──────────────────────────────────────────── */
function SectionHeader({ title, sub, color }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <h2 style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>{title}</h2>
        <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${color}30,transparent)` }}/>
      </div>
      {sub && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function DeptCard({ dept: d, hovered, onHover, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onHover(d.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        background: hovered ? d.color+'10' : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hovered ? d.color+'45' : d.color+'20'}`,
        borderRadius:12, padding:'14px', cursor:'pointer',
        transition:'all 0.15s', position:'relative', overflow:'hidden',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 6px 20px ${d.color}18` : 'none',
      }}
    >
      {/* accent bar */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${d.color},transparent)` }}/>

      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
        <div style={{
          width:36, height:36, borderRadius:9, fontSize:18, flexShrink:0,
          background:d.color+'18', border:`1px solid ${d.color}30`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>{d.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#fff', marginBottom:1 }}>{d.name}</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)' }}>{d.lead}</div>
        </div>
      </div>

      <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:10, lineHeight:1.4 }}>
        {d.tagline}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:8, fontWeight:700, color:d.color, background:d.color+'12', padding:'2px 8px', borderRadius:20 }}>
          {d.spawnAgents.length} spawn classes
        </span>
        {d.integration && (
          <span style={{ fontSize:8, color:'rgba(255,255,255,0.3)' }}>↗ {d.integration}</span>
        )}
      </div>
    </div>
  );
}

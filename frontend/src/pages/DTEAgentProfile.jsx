import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgent, getDivMeta, getStatusMeta, getRankTitle, RANKS } from '../data/dteAgents';

const BRANCH_COLOR = {
  'Army':        '#4B9E4B',
  'Navy':        '#1B3B8F',
  'Marine Corps':'#8B1A1A',
  'Air Force':   '#1A6DB5',
  'Space Force': '#2A2A5E',
  'Coast Guard': '#E8A020',
};

export default function DTEAgentProfile() {
  const { agentId } = useParams();
  const navigate    = useNavigate();
  const agent       = getAgent(agentId);

  if (!agent) {
    return (
      <div style={{ minHeight:'100vh', background:'#080604', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <h2 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Agent Not Found</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Agent ID "{agentId}" does not exist in the DTE roster.</p>
          <button
            onClick={() => navigate('/dev-team/dev/team')}
            style={{ padding:'10px 24px', borderRadius:10, background:'#F97316', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontSize:13 }}
          >
            Back to Roster
          </button>
        </div>
      </div>
    );
  }

  const div    = getDivMeta(agent.division);
  const sm     = getStatusMeta(agent.status);
  const bc     = BRANCH_COLOR[agent.branch] || '#888';
  const rank   = getRankTitle(agent.rank);

  return (
    <div style={{ background:'#080604', minHeight:'100vh', color:'#fff' }}>

      {/* Background glow */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 70% 40% at 50% 0%, ${div.color}08 0%, transparent 70%)`,
      }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:960, margin:'0 auto', padding:'24px 24px 60px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'7px 16px', borderRadius:8,
            border:'1px solid rgba(255,255,255,0.1)',
            background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)',
            fontSize:12, fontWeight:600, cursor:'pointer', marginBottom:28,
          }}
        >
          ← Back
        </button>

        {/* ── HERO IDENTITY CARD ─────────────────── */}
        <div style={{
          background:'rgba(255,255,255,0.03)',
          border:`1px solid ${div.color}30`,
          borderRadius:16, padding:'28px 24px',
          marginBottom:20, position:'relative', overflow:'hidden',
        }}>
          {/* accent bar */}
          <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${div.color},#F97316,transparent)` }} />

          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {/* Avatar */}
            <div style={{
              width:90, height:90, borderRadius:18, flexShrink:0,
              background:`linear-gradient(135deg,${div.color}28,${div.color}10)`,
              border:`2px solid ${div.color}50`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:44,
              boxShadow:`0 0 30px ${div.color}20`,
            }}>
              {agent.icon}
            </div>

            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.01em', color:'#fff' }}>
                  {agent.name}
                </h1>
                <span style={{
                  fontSize:9, fontWeight:700, color:sm.color,
                  background:sm.color+'18', border:`1px solid ${sm.color}40`,
                  padding:'3px 9px', borderRadius:20,
                  display:'inline-flex', alignItems:'center', gap:4,
                }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:sm.color, display:'inline-block' }} />
                  {sm.label}
                </span>
              </div>

              <div style={{ fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>{agent.codename}</div>

              {/* Badges row */}
              <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                <span style={{ fontSize:9, fontWeight:700, color:div.color, background:div.color+'15', border:`1px solid ${div.color}30`, padding:'3px 10px', borderRadius:20 }}>
                  {div.icon} {div.label}
                </span>
                <span style={{ fontSize:9, fontWeight:700, color:div.color, background:div.color+'10', border:`1px solid ${div.color}25`, padding:'3px 10px', borderRadius:20 }}>
                  🏅 {div.badge}
                </span>
                <span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.55)', background:'rgba(255,255,255,0.07)', padding:'3px 10px', borderRadius:20 }}>
                  Rank {agent.rank} · {rank}
                </span>
                {agent.branch && (
                  <span style={{ fontSize:9, fontWeight:700, color:bc, background:bc+'18', border:`1px solid ${bc}30`, padding:'3px 10px', borderRadius:20 }}>
                    {agent.branch}
                  </span>
                )}
              </div>
            </div>

            {/* Power score */}
            <div style={{
              background:'rgba(255,255,255,0.04)', border:`1px solid ${div.color}20`,
              borderRadius:12, padding:'16px 20px', textAlign:'center', minWidth:120, flexShrink:0,
            }}>
              <div style={{ fontSize:38, fontWeight:900, color:div.color, lineHeight:1 }}>{agent.powerLevel}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', marginTop:4 }}>POWER LEVEL</div>
              <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2, marginTop:10 }}>
                <div style={{ height:'100%', borderRadius:2, width:`${agent.powerLevel}%`, background:`linear-gradient(90deg,${div.color}88,${div.color})` }} />
              </div>
            </div>
          </div>

          {/* Specialty + current task */}
          <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', marginBottom:5 }}>SPECIALTY</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>{agent.specialty}</div>
            </div>
            {agent.task && (
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', marginBottom:5 }}>CURRENT TASK</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>{agent.task}</div>
              </div>
            )}
          </div>
        </div>

        {/* ── TWO COLUMN ──────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* LEFT: Definition + Responsibilities */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Agent Definition */}
            <Section title="Agent Definition" color={div.color} icon="🧬">
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.7 }}>{agent.definition}</p>
            </Section>

            {/* Responsibilities */}
            <Section title="Responsibilities" color={div.color} icon="📋">
              <ol style={{ paddingLeft:18, margin:0 }}>
                {(agent.responsibilities || []).map((r, i) => (
                  <li key={i} style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:6 }}>
                    {r}
                  </li>
                ))}
              </ol>
            </Section>

          </div>

          {/* RIGHT: Tools + Spawn + Rank */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Tools */}
            <Section title="Tools & Systems" color={div.color} icon="🛠️">
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {(agent.tools || []).map((t, i) => (
                  <span key={i} style={{
                    fontSize:11, fontWeight:600, color:div.color,
                    background:div.color+'12', border:`1px solid ${div.color}28`,
                    padding:'5px 10px', borderRadius:8,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            {/* Spawn Ability */}
            {agent.spawnAgents && agent.spawnAgents.length > 0 && (
              <Section title="Spawn Ability" color="#F97316" icon="⚡">
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:10 }}>
                  {agent.name} can spin up sub-agents to handle parallel tasks:
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {agent.spawnAgents.map((sa, i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'8px 12px', borderRadius:8,
                      background:'rgba(249,115,22,0.06)',
                      border:'1px solid rgba(249,115,22,0.15)',
                    }}>
                      <span style={{ fontSize:10 }}>🤖</span>
                      <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{sa}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Rank progression */}
            <Section title="Rank System" color="#FBBF24" icon="🎖️">
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {RANKS.slice(1).map((r, i) => {
                  const lvl = i + 1;
                  const isCurrent = lvl === agent.rank;
                  const isPast    = lvl < agent.rank;
                  return (
                    <div key={lvl} style={{
                      display:'flex', alignItems:'center', gap:9,
                      padding:'5px 9px', borderRadius:7,
                      background: isCurrent ? 'rgba(251,191,36,0.12)' : 'transparent',
                      border: isCurrent ? '1px solid rgba(251,191,36,0.3)' : '1px solid transparent',
                    }}>
                      <span style={{ fontSize:9, fontWeight:800, minWidth:16, textAlign:'right',
                        color: isCurrent ? '#FBBF24' : isPast ? '#34D399' : 'rgba(255,255,255,0.2)' }}>
                        {lvl}
                      </span>
                      <span style={{ fontSize:11, fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? '#FBBF24' : isPast ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)' }}>
                        {r}
                      </span>
                      {isCurrent && <span style={{ fontSize:9, marginLeft:'auto', color:'#FBBF24' }}>● CURRENT</span>}
                      {isPast    && <span style={{ fontSize:9, marginLeft:'auto', color:'#34D399' }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </Section>

          </div>
        </div>

        {/* Bottom CTA bar */}
        <div style={{
          marginTop:24, padding:'16px 20px',
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12,
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12,
        }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
            {div.icon} {div.label} · {div.badge} · {agent.branch}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => navigate('/dev-team/dev/team')}
              style={{ padding:'8px 18px', borderRadius:9, border:'1px solid rgba(255,255,255,0.12)',
                background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:600, cursor:'pointer' }}
            >
              Full Roster
            </button>
            <button
              onClick={() => navigate('/dev-team/factions')}
              style={{ padding:'8px 18px', borderRadius:9, border:'none',
                background:`linear-gradient(135deg,${div.color},#F97316)`,
                color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}
            >
              View Factions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, icon, children }) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.03)', border:`1px solid ${color}22`,
      borderRadius:12, overflow:'hidden',
    }}>
      <div style={{
        padding:'12px 16px', borderBottom:`1px solid ${color}18`,
        background:color+'08', display:'flex', alignItems:'center', gap:8,
      }}>
        <span>{icon}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)', letterSpacing:'0.03em' }}>{title}</span>
      </div>
      <div style={{ padding:'14px 16px' }}>{children}</div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENTS, DIVISIONS_META, getDivMeta, getStatusMeta, getRankTitle } from '../data/dteAgents';
import DTEAgentCard from '../components/DTEAgentCard';

const DIVISIONS = [
  { key: 'all',          label: 'All Agents' },
  { key: 'engineering',  label: 'Engineering' },
  { key: 'ai-division',  label: 'AI Division' },
  { key: 'security',     label: 'Security' },
  { key: 'qa',           label: 'QA' },
  { key: 'cloud',        label: 'Cloud Ops' },
  { key: 'clients',      label: 'Client Services' },
  { key: 'factories',    label: 'Dev Factories' },
  { key: 'knowledge',    label: 'Knowledge' },
  { key: 'rnd',          label: 'R&D' },
  { key: 'seo',          label: 'SEO Ops' },
  { key: 'marketing',    label: 'Marketing' },
  { key: 'content',      label: 'Content' },
  { key: 'advertising',  label: 'Advertising' },
  { key: 'growth-clients',label: 'Growth Clients' },
  { key: 'analytics',    label: 'Analytics' },
  { key: 'executive',    label: 'Executive' },
];

const STATUSES = ['all', 'active', 'building', 'testing', 'deploying', 'standby', 'training', 'locked'];

export default function DTEAgentRoster() {
  const navigate = useNavigate();
  const [divFilter,    setDivFilter]    = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search,       setSearch]       = useState('');

  const filtered = useMemo(() => {
    return AGENTS.filter(a => {
      if (divFilter    !== 'all' && a.division !== divFilter)   return false;
      if (statusFilter !== 'all' && a.status   !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q)
          || a.codename.toLowerCase().includes(q)
          || a.specialty.toLowerCase().includes(q)
          || (a.branch || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [divFilter, statusFilter, search]);

  /* stats */
  const active   = AGENTS.filter(a => a.status === 'active').length;
  const building = AGENTS.filter(a => a.status === 'building' || a.status === 'deploying' || a.status === 'testing').length;
  const avgPower = Math.round(AGENTS.reduce((s, a) => s + a.powerLevel, 0) / AGENTS.length);

  return (
    <div style={{ background: '#080604', minHeight: '100vh', color: '#fff' }}>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)' }} />

      <div style={{ position:'relative', zIndex:1, padding:'24px 24px 60px', maxWidth:1400, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:'0.12em',
              color:'#06B6D4', background:'rgba(6,182,212,0.1)',
              border:'1px solid rgba(6,182,212,0.25)', padding:'3px 10px', borderRadius:20,
            }}>
              DEV TEAM ELITE
            </span>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>AGENT ROSTER</span>
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.02em', marginBottom:4 }}>
            ⚡ DTE Agent Roster
          </h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            {AGENTS.length} agents · {filtered.length} shown · Click any agent for full profile
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
          {[
            { label:'Total Agents',  val: AGENTS.length, color:'#06B6D4' },
            { label:'Active Now',    val: active,        color:'#34D399' },
            { label:'In Progress',   val: building,      color:'#FBBF24' },
            { label:'Avg Power Lvl', val: avgPower,      color:'#F97316' },
          ].map(s => (
            <div key={s.label} style={{
              background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}20`,
              borderRadius:10, padding:'14px 16px',
            }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:16, marginBottom:24 }}>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agents by name, role, specialty, or branch..."
            style={{
              width:'100%', padding:'10px 14px', borderRadius:9,
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
              color:'#fff', fontSize:13, outline:'none', marginBottom:14,
              boxSizing:'border-box',
            }}
          />

          {/* Division filter pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {DIVISIONS.map(d => {
              const meta = d.key === 'all' ? null : getDivMeta(d.key);
              const active = divFilter === d.key;
              const col = meta ? meta.color : '#F97316';
              return (
                <button key={d.key} onClick={() => setDivFilter(d.key)} style={{
                  padding:'5px 12px', borderRadius:20, border:`1px solid ${active ? col : 'rgba(255,255,255,0.1)'}`,
                  background: active ? col+'20' : 'rgba(255,255,255,0.03)',
                  color: active ? col : 'rgba(255,255,255,0.45)',
                  fontSize:11, fontWeight:600, cursor:'pointer',
                }}>
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {STATUSES.map(s => {
              const meta = getStatusMeta(s);
              const active = statusFilter === s;
              const col = s === 'all' ? '#F97316' : meta.color;
              return (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding:'4px 11px', borderRadius:20, border:`1px solid ${active ? col : 'rgba(255,255,255,0.08)'}`,
                  background: active ? col+'18' : 'rgba(255,255,255,0.02)',
                  color: active ? col : 'rgba(255,255,255,0.35)',
                  fontSize:10, fontWeight:700, cursor:'pointer', textTransform:'capitalize',
                }}>
                  {s === 'all' ? 'All Statuses' : meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15, fontWeight:600 }}>No agents match your filters</div>
            <div style={{ fontSize:12, marginTop:6 }}>Try clearing the search or changing division</div>
          </div>
        ) : (
          <>
            {/* Group by division when showing all */}
            {divFilter === 'all' ? (
              Object.keys(DIVISIONS_META).map(divKey => {
                const agents = filtered.filter(a => a.division === divKey);
                if (!agents.length) return null;
                const meta = DIVISIONS_META[divKey];
                return (
                  <div key={divKey} style={{ marginBottom:28 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                      <span style={{ fontSize:16 }}>{meta.icon}</span>
                      <h2 style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>{meta.label}</h2>
                      <span style={{
                        fontSize:9, fontWeight:700, color:meta.color,
                        background:meta.color+'12', padding:'2px 8px', borderRadius:20,
                      }}>
                        {agents.length} agents
                      </span>
                      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${meta.color}30,transparent)` }} />
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                      {agents.map(a => <DTEAgentCard key={a.id} agent={a} />)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                {filtered.map(a => <DTEAgentCard key={a.id} agent={a} />)}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

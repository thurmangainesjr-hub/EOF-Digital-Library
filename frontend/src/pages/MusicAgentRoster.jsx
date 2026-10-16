import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { MUSIC_AGENTS, MUSIC_DEPARTMENTS, getMusicDept, getMusicStatusMeta } from '../data/musicAgentData';
import MusicAgentCard from '../components/MusicAgentCard';

const STATUS_OPTS = ['all', 'active', 'standby', 'training', 'locked'];

export default function MusicAgentRoster() {
  const [query, setQuery]       = useState('');
  const [deptFilter, setDept]   = useState('all');
  const [statusFilter, setStat] = useState('all');
  const [view, setView]         = useState('grid');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MUSIC_AGENTS.filter(a => {
      if (deptFilter !== 'all' && a.department !== deptFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.codename.toLowerCase().includes(q) &&
          !a.specialty.toLowerCase().includes(q) && !a.badge.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, deptFilter, statusFilter]);

  const grouped = useMemo(() => {
    if (deptFilter !== 'all') return null;
    const g = {};
    filtered.forEach(a => {
      if (!g[a.department]) g[a.department] = [];
      g[a.department].push(a);
    });
    return g;
  }, [filtered, deptFilter]);

  const stats = useMemo(() => ({
    total:   MUSIC_AGENTS.length,
    active:  MUSIC_AGENTS.filter(a => a.status === 'active').length,
    standby: MUSIC_AGENTS.filter(a => a.status === 'standby').length,
    depts:   Object.keys(MUSIC_DEPARTMENTS).length,
  }), []);

  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 };
  const listStyle = { display: 'flex', flexDirection: 'column', gap: 8 };

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#07060A', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 300, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 100%)', zIndex: 0 }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎵</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>Music Studio Team</h1>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>Griot Music Studio · {MUSIC_AGENTS.length} producers · {stats.depts} departments</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Producers',   value: stats.total,   color: '#FDE68A', icon: '🎵' },
            { label: 'In Session',  value: stats.active,  color: '#10B981', icon: '⚡' },
            { label: 'Standby',     value: stats.standby, color: '#38BDF8', icon: '🎚️' },
            { label: 'Departments', value: stats.depts,   color: '#D4AF37', icon: '🏛️' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <FiSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search producers, skills..."
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}/>
          </div>
          <select value={deptFilter} onChange={e => setDept(e.target.value)} style={{ padding: '9px 12px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', outline: 'none', cursor: 'pointer' }}>
            <option value="all">All Departments</option>
            {Object.entries(MUSIC_DEPARTMENTS).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStat(e.target.value)} style={{ padding: '9px 12px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', outline: 'none', cursor: 'pointer' }}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
            {[{ id: 'grid', icon: FiGrid }, { id: 'list', icon: FiList }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === v.id ? 'rgba(212,175,55,0.2)' : 'transparent', color: view === v.id ? '#FDE68A' : '#6B7280', display: 'flex', alignItems: 'center' }}>
                <v.icon size={13}/>
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#4B5563', flexShrink: 0 }}>{filtered.length} producers</span>
        </motion.div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#4B5563' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎵</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>No producers match that search.</p>
          </div>
        ) : deptFilter !== 'all' || query ? (
          <div style={view === 'grid' ? gridStyle : listStyle}>
            {filtered.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <MusicAgentCard agent={a} compact={view === 'list'}/>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {Object.entries(grouped).map(([deptKey, agents], gi) => {
              const meta = getMusicDept(deptKey);
              return (
                <motion.div key={deptKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${meta.color}22` }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${meta.color}15`, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{meta.icon}</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>{meta.label}</h2>
                      <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>{meta.desc}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                      {agents.length} producers
                    </div>
                  </div>
                  <div style={view === 'grid' ? gridStyle : listStyle}>
                    {agents.map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <MusicAgentCard agent={a} compact={view === 'list'}/>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

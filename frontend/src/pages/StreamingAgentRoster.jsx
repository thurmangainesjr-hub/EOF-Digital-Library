import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { STREAM_AGENTS, STREAM_DEPARTMENTS, getStreamStatusMeta } from '../data/streamingAgentData';
import StreamingAgentCard from '../components/StreamingAgentCard';

const ACCENT = '#6366F1';
const BG = '#05050F';

export default function StreamingAgentRoster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = useMemo(() => {
    return STREAM_AGENTS.filter(a => {
      const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.badge.toLowerCase().includes(search.toLowerCase()) || a.codename.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'all' || a.department === deptFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, deptFilter, statusFilter]);

  const grouped = useMemo(() => {
    if (search || deptFilter !== 'all' || statusFilter !== 'all') return null;
    const groups = {};
    STREAM_AGENTS.forEach(a => {
      if (!groups[a.department]) groups[a.department] = [];
      groups[a.department].push(a);
    });
    return groups;
  }, [search, deptFilter, statusFilter]);

  const statuses = [...new Set(STREAM_AGENTS.map(a => a.status))];

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#080810', borderBottom: '1px solid rgba(99,102,241,0.15)', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/streaming')} style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)', color: '#A5B4FC', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>← Streaming Hub</button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>📺 Agent Roster</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', marginTop: 2 }}>EOF Streaming Hub · {STREAM_AGENTS.length} Agents</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['grid', 'list'].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ background: viewMode === m ? ACCENT : 'rgba(99,102,241,0.08)', border: `1px solid ${viewMode === m ? ACCENT : 'rgba(99,102,241,0.20)'}`, color: viewMode === m ? '#fff' : '#94A3B8', borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#080810', borderBottom: '1px solid rgba(99,102,241,0.10)', padding: '12px 32px', display: 'flex', gap: 24 }}>
        {Object.entries(STREAM_DEPARTMENTS).map(([key, dept]) => {
          const count = STREAM_AGENTS.filter(a => a.department === key).length;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{dept.icon}</span>
              <span style={{ color: dept.color, fontWeight: 700, fontSize: 12 }}>{dept.label}</span>
              <span style={{ color: '#475569', fontSize: 12 }}>({count})</span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search agents, badges, codenames…"
            style={{ flex: '1 1 240px', minWidth: 200, background: '#0D0D1C', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ background: '#0D0D1C', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            <option value="all">All Departments</option>
            {Object.entries(STREAM_DEPARTMENTS).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: '#0D0D1C', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            <option value="all">All Statuses</option>
            {statuses.map(s => { const m = getStreamStatusMeta(s); return <option key={s} value={s}>{m.label}</option>; })}
          </select>
        </div>

        {/* Results count */}
        {(search || deptFilter !== 'all' || statusFilter !== 'all') && (
          <div style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>{filtered.length} agent{filtered.length !== 1 ? 's' : ''} found</div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {grouped ? (
            <div key="grouped">
              {Object.entries(grouped).map(([deptKey, agents]) => {
                const dept = STREAM_DEPARTMENTS[deptKey];
                return (
                  <motion.div key={deptKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${dept.color}33` }}>
                      <span style={{ fontSize: 20 }}>{dept.icon}</span>
                      <span style={{ color: dept.color, fontWeight: 800, fontSize: 15 }}>{dept.label}</span>
                      <span style={{ color: '#475569', fontSize: 13 }}>({agents.length})</span>
                      <span style={{ color: '#334155', fontSize: 12, marginLeft: 8 }}>{dept.desc}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                      {agents.map(a => <StreamingAgentCard key={a.id} agent={a} />)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filtered.map(a => <StreamingAgentCard key={a.id} agent={a} />)}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(a => <StreamingAgentCard key={a.id} agent={a} compact />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

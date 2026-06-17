import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiUsers } from 'react-icons/fi';
import { AGENTS, DIVISIONS, getDivisionMeta, getStatusMeta, getRankTitle } from '../data/griotAgentData';
import GroitAgentCard from '../components/GroitAgentCard';

const ACCENT = '#7C3AED';

const STATUS_OPTS = ['all', 'active', 'standby', 'training', 'locked'];
const DIV_OPTS    = ['all', ...Object.keys(DIVISIONS)];

export default function GroitAgentRoster() {
  const navigate = useNavigate();
  const [query, setQuery]       = useState('');
  const [divFilter, setDiv]     = useState('all');
  const [statusFilter, setStat] = useState('all');
  const [view, setView]         = useState('grid');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return AGENTS.filter(a => {
      if (divFilter !== 'all' && a.division !== divFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.codename.toLowerCase().includes(q) &&
          !a.specialty.toLowerCase().includes(q) && !a.badge.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, divFilter, statusFilter]);

  const divisionGroups = useMemo(() => {
    if (divFilter !== 'all') return null;
    const groups = {};
    filtered.forEach(a => {
      if (!groups[a.division]) groups[a.division] = [];
      groups[a.division].push(a);
    });
    return groups;
  }, [filtered, divFilter]);

  const stats = useMemo(() => ({
    total:   AGENTS.length,
    active:  AGENTS.filter(a => a.status === 'active').length,
    standby: AGENTS.filter(a => a.status === 'standby').length,
    divCount: Object.keys(DIVISIONS).length,
  }), []);

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#07050F', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 300, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 100%)',
        zIndex: 0,
      }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>🌀</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>Story Engine Agents</h1>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>Griot AI · Agent Roster · {AGENTS.length} agents across {stats.divCount} divisions</p>
            </div>
          </div>
        </motion.div>

        {/* Stat bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Agents',  value: stats.total,    color: '#A78BFA', icon: '🌀' },
            { label: 'Active',        value: stats.active,   color: '#10B981', icon: '⚡' },
            { label: 'Standby',       value: stats.standby,  color: '#38BDF8', icon: '💤' },
            { label: 'Divisions',     value: stats.divCount, color: '#F59E0B', icon: '🏛️' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
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

          {/* Search */}
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <FiSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }}/>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search agents, codenames, skills..."
              style={{
                width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, fontSize: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', outline: 'none',
              }}
            />
          </div>

          {/* Division filter */}
          <select value={divFilter} onChange={e => setDiv(e.target.value)} style={{
            padding: '9px 12px', borderRadius: 10, fontSize: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#9CA3AF', outline: 'none', cursor: 'pointer',
          }}>
            <option value="all">All Divisions</option>
            {Object.entries(DIVISIONS).map(([key, d]) => (
              <option key={key} value={key}>{d.icon} {d.label}</option>
            ))}
          </select>

          {/* Status filter */}
          <select value={statusFilter} onChange={e => setStat(e.target.value)} style={{
            padding: '9px 12px', borderRadius: 10, fontSize: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#9CA3AF', outline: 'none', cursor: 'pointer',
          }}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
            {[{ id: 'grid', icon: FiGrid }, { id: 'list', icon: FiList }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} style={{
                padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: view === v.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: view === v.id ? '#A78BFA' : '#6B7280',
                display: 'flex', alignItems: 'center',
              }}>
                <v.icon size={13}/>
              </button>
            ))}
          </div>

          <span style={{ fontSize: 11, color: '#4B5563', flexShrink: 0 }}>{filtered.length} agents</span>
        </motion.div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#4B5563' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌀</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>No agents match that search.</p>
          </div>
        ) : divFilter !== 'all' || query ? (
          /* Flat filtered view */
          <motion.div
            style={{ display: view === 'grid' ? 'grid' : 'flex', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined, flexDirection: 'column', gap: 14 }}>
            {filtered.map((agent, i) => (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {view === 'grid'
                  ? <GroitAgentCard agent={agent}/>
                  : <GroitAgentCard agent={agent} compact/>
                }
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Grouped by division */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {Object.entries(divisionGroups).map(([divKey, agents], gi) => {
              const meta = getDivisionMeta(divKey);
              return (
                <motion.div key={divKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
                  {/* Division header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${meta.color}22` }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${meta.color}15`, border: `1px solid ${meta.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                    }}>{meta.icon}</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>{meta.label}</h2>
                      <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>{meta.desc}</p>
                    </div>
                    <div style={{
                      marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                      background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30`,
                    }}>
                      {agents.length} agents
                    </div>
                  </div>
                  <div style={{ display: view === 'grid' ? 'grid' : 'flex', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined, flexDirection: 'column', gap: 12 }}>
                    {agents.map((agent, i) => (
                      <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        {view === 'grid'
                          ? <GroitAgentCard agent={agent}/>
                          : <GroitAgentCard agent={agent} compact/>
                        }
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

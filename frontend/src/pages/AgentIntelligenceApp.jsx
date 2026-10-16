import React, { useState, useMemo } from 'react';
import {
  AGENT_SYSTEMS, KNOWLEDGE_LEVELS, SYSTEM_HEALTH,
  GLOBAL_ACTIVITY_FEED, AGENT_EVOLUTION, SYSTEM_META,
} from '../data/agentData';

const ACCENT   = '#A855F7';
const BG       = '#07070F';
const SURFACE  = '#0E0E1C';
const SURFACE2 = '#13132A';
const BORDER   = 'rgba(168,85,247,0.12)';

function evo(id) {
  return AGENT_EVOLUTION[id] || { level: 'Beginner', knowledgeScore: 52, researchScore: 48, performanceRating: 54, learningVault: [] };
}

function levelCfg(name) {
  return KNOWLEDGE_LEVELS.find(k => k.label === name) || KNOWLEDGE_LEVELS[0];
}

function ScoreRing({ value, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="white">{value}</text>
    </svg>
  );
}

function LevelBadge({ level }) {
  const cfg = levelCfg(level);
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase"
      style={{ background: cfg.color + '18', color: cfg.color, border: `1px solid ${cfg.color}40` }}>
      {level}
    </span>
  );
}

function StatusDot({ status }) {
  const colors = { active: '#10B981', live: '#22D3EE', idle: '#F59E0B', coming_soon: '#6B7280' };
  return <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[status] || '#6B7280' }} />;
}

export default function AgentIntelligenceApp() {
  const [selectedAgent, setSelectedAgent]     = useState(null);
  const [selectedDiv,   setSelectedDiv]       = useState('central');
  const [expandedDivs,  setExpandedDivs]      = useState({ central: true });
  const [search,        setSearch]            = useState('');
  const [filterLevel,   setFilterLevel]       = useState('all');
  const [viewMode,      setViewMode]          = useState('profile'); // 'profile' | 'vault' | 'tasks'

  // flatten all agents
  const allAgents = useMemo(() =>
    AGENT_SYSTEMS.flatMap(sys =>
      sys.agents.map(a => ({ ...a, divisionId: sys.id, divisionName: sys.name, divisionColor: sys.color, divisionEmoji: sys.emoji }))
    ), []);

  const filteredAgents = useMemo(() => {
    const q = search.toLowerCase();
    return allAgents.filter(a => {
      const e = evo(a.id);
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.divisionName.toLowerCase().includes(q);
      const matchLevel  = filterLevel === 'all' || e.level === filterLevel;
      return matchSearch && matchLevel;
    });
  }, [allAgents, search, filterLevel]);

  const currentAgent = selectedAgent
    ? allAgents.find(a => a.id === selectedAgent)
    : allAgents.find(a => a.divisionId === selectedDiv) || allAgents[0];

  const agentEvo = currentAgent ? evo(currentAgent.id) : null;
  const agentLvl = agentEvo ? levelCfg(agentEvo.level) : null;

  function toggleDiv(divId) {
    setExpandedDivs(p => ({ ...p, [divId]: !p[divId] }));
  }

  // counts
  const totalAgents  = allAgents.length;
  const totalMaster  = allAgents.filter(a => ['Master','Elite','Legendary'].includes(evo(a.id).level)).length;
  const avgPerf      = Math.round(allAgents.reduce((s, a) => s + evo(a.id).performanceRating, 0) / totalAgents);
  const activeCount  = SYSTEM_HEALTH.filter(s => s.status === 'active' || s.status === 'live').length;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: BG, fontFamily: 'system-ui, sans-serif', color: 'white' }}>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center px-5 gap-4" style={{ height: 52, background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #6D28D9)` }}>
            ⚡
          </div>
          <div>
            <p className="text-[13px] font-black text-white leading-none">Agent Intelligence</p>
            <p className="text-[9px] text-purple-400 leading-none mt-0.5">EOF ECOSYSTEM — COMMAND LAYER</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mx-2" style={{ width: 1, height: 28, background: BORDER }} />

        {/* quick stats */}
        {[
          { label: 'Total Agents', value: totalAgents, color: ACCENT },
          { label: 'Master+',      value: totalMaster, color: '#D4AF37' },
          { label: 'Avg Performance', value: `${avgPerf}%`, color: '#10B981' },
          { label: 'Active Systems', value: `${activeCount}/15`, color: '#22D3EE' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: SURFACE2 }}>
            <span className="text-[15px] font-black" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[9px] text-gray-600 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10B981' }} />
          <span className="text-[10px] text-gray-500">All systems nominal</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL — Agent Roster ────────────────────── */}
        <aside className="flex-shrink-0 flex flex-col overflow-hidden" style={{ width: 220, background: SURFACE, borderRight: `1px solid ${BORDER}` }}>
          {/* Search + filter */}
          <div className="px-3 py-3 flex-shrink-0 space-y-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-600 outline-none"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
            />
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: filterLevel === 'all' ? '#9CA3AF' : agentLvl?.color || 'white' }}>
              <option value="all">All levels</option>
              {KNOWLEDGE_LEVELS.map(k => <option key={k.id} value={k.label}>{k.label}</option>)}
            </select>
          </div>

          {/* Division list */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {(search || filterLevel !== 'all')
              ? /* filtered flat list */
                <div className="py-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-700 px-4 mb-2">{filteredAgents.length} agents</p>
                  {filteredAgents.map(a => {
                    const e = evo(a.id);
                    const lv = levelCfg(e.level);
                    return (
                      <button key={a.id}
                        onClick={() => { setSelectedAgent(a.id); setViewMode('profile'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
                        style={{
                          background: currentAgent?.id === a.id ? `${ACCENT}10` : 'transparent',
                          borderLeft: currentAgent?.id === a.id ? `2px solid ${ACCENT}` : '2px solid transparent',
                        }}>
                        <span className="text-base flex-shrink-0">{a.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-white truncate">{a.name}</p>
                          <p className="text-[9px] text-gray-600 truncate">{a.divisionName}</p>
                        </div>
                        <span className="text-[8px] font-black flex-shrink-0" style={{ color: lv.color }}>{e.level.slice(0,3).toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              : /* grouped by division */
                AGENT_SYSTEMS.map(sys => {
                  const meta   = SYSTEM_META[sys.id];
                  const isOpen = expandedDivs[sys.id];
                  return (
                    <div key={sys.id}>
                      <button
                        onClick={() => { toggleDiv(sys.id); setSelectedDiv(sys.id); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 transition-all"
                        style={{
                          background: selectedDiv === sys.id && !selectedAgent ? `${sys.color}10` : 'transparent',
                          borderBottom: `1px solid ${BORDER}`,
                        }}>
                        <span className="text-sm flex-shrink-0">{sys.emoji}</span>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[11px] font-semibold text-white truncate">{sys.name}</p>
                          <p className="text-[9px] text-gray-600 truncate">{meta?.divisionLabel}</p>
                        </div>
                        <StatusDot status={meta?.status || 'active'} />
                        <span className="text-[9px] text-gray-700 ml-1">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && sys.agents.map(a => {
                        const e  = evo(a.id);
                        const lv = levelCfg(e.level);
                        const isSelected = currentAgent?.id === a.id;
                        return (
                          <button key={a.id}
                            onClick={() => { setSelectedAgent(a.id); setViewMode('profile'); }}
                            className="w-full flex items-center gap-2.5 px-5 py-2 transition-all"
                            style={{
                              background: isSelected ? `${ACCENT}12` : 'transparent',
                              borderLeft: isSelected ? `2px solid ${ACCENT}` : '2px solid transparent',
                            }}>
                            <span className="text-sm flex-shrink-0">{a.avatar}</span>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-[11px] font-medium text-white truncate">{a.name}</p>
                              <p className="text-[9px] text-gray-600 truncate">{a.title}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[9px] font-black" style={{ color: lv.color }}>{e.level.slice(0,3).toUpperCase()}</p>
                              <p className="text-[8px] text-gray-700">{e.knowledgeScore}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
            }
          </div>
        </aside>

        {/* ── CENTER PANEL — Agent Profile ─────────────────── */}
        <main className="flex-1 min-w-0 overflow-y-auto" style={{ background: BG, scrollbarWidth: 'none' }}>
          {currentAgent && agentEvo ? (
            <div className="p-5 max-w-2xl">

              {/* Agent header card */}
              <div className="rounded-2xl overflow-hidden mb-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <div className="px-6 py-4 flex items-center gap-4"
                  style={{ background: `linear-gradient(135deg, ${currentAgent.divisionColor}10, transparent)`, borderBottom: `1px solid ${BORDER}` }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${currentAgent.divisionColor}18`, border: `1px solid ${currentAgent.divisionColor}30` }}>
                    {currentAgent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl font-black text-white">{currentAgent.name}</h1>
                      <LevelBadge level={agentEvo.level} />
                    </div>
                    <p className="text-sm text-gray-400">{currentAgent.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs flex-shrink-0" style={{ color: currentAgent.divisionColor }}>{currentAgent.divisionEmoji} {currentAgent.divisionName}</span>
                      <span className="text-gray-700">·</span>
                      <StatusDot status={SYSTEM_META[currentAgent.divisionId]?.status || 'active'} />
                      <span className="text-[10px] text-gray-600 capitalize">{SYSTEM_META[currentAgent.divisionId]?.status || 'active'}</span>
                    </div>
                  </div>

                  {/* Level progress bar */}
                  <div className="flex-shrink-0 text-right">
                    <ScoreRing value={agentEvo.performanceRating} color={agentLvl.color} size={64} />
                    <p className="text-[9px] text-gray-600 mt-1">Performance</p>
                  </div>
                </div>

                {/* Sub-nav tabs */}
                <div className="flex items-center px-6 gap-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {[['profile','Profile'], ['vault','Learning Vault'], ['tasks','Capabilities']].map(([id, label]) => (
                    <button key={id} onClick={() => setViewMode(id)}
                      className="px-4 py-3 text-xs font-semibold transition-all"
                      style={{
                        color: viewMode === id ? ACCENT : 'rgba(255,255,255,0.4)',
                        borderBottom: viewMode === id ? `2px solid ${ACCENT}` : '2px solid transparent',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Profile view ── */}
              {viewMode === 'profile' && (
                <>
                  {/* 4 metric cards */}
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Knowledge Score', value: agentEvo.knowledgeScore, color: ACCENT, icon: '🧠' },
                      { label: 'Research Score',  value: agentEvo.researchScore,  color: '#22D3EE', icon: '🔬' },
                      { label: 'Performance',     value: agentEvo.performanceRating, color: '#10B981', icon: '⚡' },
                      { label: 'Vault Entries',   value: agentEvo.learningVault.length, color: '#D4AF37', icon: '📚' },
                    ].map(m => (
                      <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                        <p className="text-2xl mb-1">{m.icon}</p>
                        <p className="text-2xl font-black" style={{ color: m.color }}>{m.value}{m.label !== 'Vault Entries' ? '' : ''}</p>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Score bars */}
                  <div className="rounded-xl p-5 mb-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Intelligence Metrics</p>
                    {[
                      { label: 'Knowledge Score',  val: agentEvo.knowledgeScore,   color: ACCENT },
                      { label: 'Research Score',   val: agentEvo.researchScore,    color: '#22D3EE' },
                      { label: 'Performance',      val: agentEvo.performanceRating, color: '#10B981' },
                    ].map(bar => (
                      <div key={bar.label} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-gray-500">{bar.label}</span>
                          <span className="font-bold" style={{ color: bar.color }}>{bar.val}/100</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${bar.val}%`, background: `linear-gradient(90deg, ${bar.color}99, ${bar.color})` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Evolution level progress */}
                  <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Evolution Tier</p>
                    <div className="flex items-center gap-3 mb-4">
                      {KNOWLEDGE_LEVELS.map((lv, i) => {
                        const isActive = lv.label === agentEvo.level;
                        const isPast   = KNOWLEDGE_LEVELS.findIndex(k => k.label === agentEvo.level) > i;
                        return (
                          <React.Fragment key={lv.id}>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all"
                                style={{
                                  background: isActive ? lv.color + '30' : isPast ? lv.color + '18' : 'rgba(255,255,255,0.04)',
                                  borderColor: isActive || isPast ? lv.color : 'rgba(255,255,255,0.1)',
                                  color: isActive || isPast ? lv.color : 'rgba(255,255,255,0.2)',
                                }}>
                                {isPast ? '✓' : isActive ? '★' : i + 1}
                              </div>
                              <span className="text-[8px] font-semibold" style={{ color: isActive ? lv.color : 'rgba(255,255,255,0.25)' }}>
                                {lv.label}
                              </span>
                            </div>
                            {i < KNOWLEDGE_LEVELS.length - 1 && (
                              <div className="flex-1 h-0.5 rounded-full"
                                style={{ background: isPast ? agentLvl.color + '40' : 'rgba(255,255,255,0.06)' }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: agentLvl.color + '10', border: `1px solid ${agentLvl.color}25` }}>
                      <span className="text-xs font-black" style={{ color: agentLvl.color }}>Current: {agentEvo.level}</span>
                      {agentEvo.level !== 'Legendary' && (
                        <span className="text-[10px] text-gray-600 ml-auto">Next tier: {KNOWLEDGE_LEVELS[KNOWLEDGE_LEVELS.findIndex(k => k.label === agentEvo.level) + 1]?.label}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Learning Vault ── */}
              {viewMode === 'vault' && (
                <div className="rounded-xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Learning Vault — {agentEvo.learningVault.length} entries</p>
                    <span className="text-[9px] px-2 py-1 rounded-full" style={{ background: ACCENT + '15', color: ACCENT, border: `1px solid ${ACCENT}30` }}>
                      Active Memory
                    </span>
                  </div>
                  {agentEvo.learningVault.length === 0
                    ? <p className="text-xs text-gray-600 px-5 py-6 text-center">No vault entries yet — this agent is still learning.</p>
                    : agentEvo.learningVault.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5" style={{ borderBottom: i < agentEvo.learningVault.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                          style={{ background: ACCENT + '15', color: ACCENT, border: `1px solid ${ACCENT}25` }}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm text-white leading-relaxed">{entry}</p>
                          <p className="text-[9px] text-gray-700 mt-0.5">Integrated into knowledge base</p>
                        </div>
                        <span className="ml-auto text-emerald-400 text-xs flex-shrink-0">✓</span>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* ── Capabilities ── */}
              {viewMode === 'tasks' && (
                <div className="space-y-4">
                  <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Core Capabilities</p>
                    <div className="space-y-2">
                      {(currentAgent.capabilities || []).map((cap, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                          style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentAgent.divisionColor }} />
                          <span className="text-xs text-gray-300">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentAgent.quickActions?.length > 0 && (
                    <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Quick Actions</p>
                      <div className="grid grid-cols-3 gap-2">
                        {currentAgent.quickActions.map((qa, i) => (
                          <div key={i} className="px-3 py-2.5 rounded-xl text-center"
                            style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                            <p className="text-[11px] font-semibold text-white">{qa.label}</p>
                            <p className="text-[9px] text-gray-600 mt-0.5 capitalize">{qa.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-700 text-sm">Select an agent from the roster</div>
          )}
        </main>

        {/* ── RIGHT PANEL — Intelligence Feed ──────────────── */}
        <aside className="flex-shrink-0 flex flex-col overflow-hidden" style={{ width: 260, background: SURFACE, borderLeft: `1px solid ${BORDER}` }}>

          {/* System Health */}
          <div className="flex-shrink-0 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">System Health</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SYSTEM_HEALTH.map(sys => (
                <div key={sys.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                  <span className="text-sm">{sys.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-white truncate">{sys.name}</p>
                    <p className="text-[8px] text-gray-700">{sys.agents} agents · {sys.tasks} tasks</p>
                  </div>
                  <StatusDot status={sys.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: 'none' }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">Live Activity</p>
            <div className="space-y-2">
              {GLOBAL_ACTIVITY_FEED.map((item, i) => {
                const typeIcon = { create: '✨', schedule: '📅', alert: '⚠️' }[item.type] || '→';
                return (
                  <div key={i} className="px-3 py-2.5 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.agent}</span>
                      <span className="text-[8px] text-gray-700">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{typeIcon} {item.action}</p>
                    <p className="text-[8px] text-gray-700 mt-0.5">{item.system}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Distribution */}
          <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">Level Distribution</p>
            <div className="space-y-1.5">
              {KNOWLEDGE_LEVELS.slice().reverse().map(lv => {
                const count = allAgents.filter(a => evo(a.id).level === lv.label).length;
                const pct = Math.round((count / totalAgents) * 100);
                return (
                  <div key={lv.id} className="flex items-center gap-2">
                    <span className="text-[9px] w-16 font-semibold flex-shrink-0" style={{ color: lv.color }}>{lv.label}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: lv.color + '70' }} />
                    </div>
                    <span className="text-[9px] text-gray-700 w-5 text-right flex-shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

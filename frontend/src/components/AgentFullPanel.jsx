import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiMessageCircle, FiClipboard, FiFolder, FiBook, FiZap,
  FiChevronRight, FiExternalLink, FiClock, FiCpu, FiCheck, FiShield
} from 'react-icons/fi';
import { AgentAvatarFace } from './AgentAvatarCard';
import AgentChatModal from './AgentChatModal';
import AutonomyPanel from './AutonomyPanel';
import { AGENT_BRAINS, GROWTH_PIPELINE } from '../data/agentData';

const TIER_CONFIG = {
  free:       { label: 'Free',       color: '#9CA3AF' },
  standard:   { label: 'Standard',   color: '#60A5FA' },
  premium:    { label: 'Premium',    color: '#D4AF37' },
  enterprise: { label: 'Enterprise', color: '#A78BFA' },
};

// Recent activity — mock data per agent type
function getMockActivity(agentId) {
  const ACTIVITY = {
    'eof-central-agent':     ['Routed 3 tasks to Griot AI', 'Coordinated cross-system sync', 'Granted Standard access to user'],
    'knowledge-manager':     ['Indexed 14 new library entries', 'Resolved 2 duplicate topics', 'Connected Griot canon to Library'],
    'asset-manager':         ['Stored 6 new media files', 'Linked assets to Project #47', 'Organized Radio audio archive'],
    'security-governance':   ['Audited 12 agent actions', 'Blocked 1 unauthorized request', 'Updated tier permissions'],
    'griot-central':         ['Started screenplay project', 'Spawned Fight Scene helper', 'Synced canon with Library'],
    'story-architect':       ['Wrote Chapter 4 of "Afrofuture Rising"', 'Generated 3 episode outlines', 'Drafted Act II dialogue'],
    'canon-keeper':          ['Flagged timeline inconsistency in Ep. 3', 'Updated character roster', 'Verified lore accuracy'],
    'world-builder':         ['Created 2 new factions', 'Designed the city of Kalahari Prime', 'Added 5 character backstories'],
    'production-studio':     ['Generated 12 image prompts', 'Created storyboard for Scene 7', 'Prepared shot list for Episode 2'],
    'chancellor':            ['Enrolled 3 new students', 'Updated Film School curriculum', 'Approved 2 certifications'],
    'professor':             ['Completed 4 lesson sessions', 'Reviewed student assignments', 'Adapted teaching for visual learner'],
    'league-commissioner':   ['Opened Season 3 draft', 'Published power rankings', 'Resolved trade dispute'],
    'bac-coach':             ['Completed 2 business plans', 'Reviewed pitch deck', 'Advised on LLC formation'],
    'jarvis':                ['Logged 3 family memories', 'Set 2 reminders', 'Captured life reflection session'],
  };
  return ACTIVITY[agentId] || ['Completed assigned tasks', 'Standing by for new requests', 'All systems operational'];
}

// Connected data by agent
function getConnectedData(agentId, system) {
  const BASE = [
    { icon: '🗂️', label: `${system?.shortName || 'System'} Knowledge Base` },
    { icon: '📋', label: 'Task Queue' },
  ];
  const EXTRAS = {
    'eof-central-agent':    [{ icon: '🌐', label: 'All 10 Systems' }, { icon: '👥', label: '4 Core Agents' }],
    'knowledge-manager':    [{ icon: '📚', label: 'EOF Library Index' }, { icon: '🔗', label: 'Cross-System Topics' }],
    'asset-manager':        [{ icon: '🖼️', label: 'Media Archive' }, { icon: '🎵', label: 'Audio Library' }],
    'security-governance':  [{ icon: '🔒', label: 'Permission Registry' }, { icon: '📊', label: 'Audit Log' }],
    'story-architect':      [{ icon: '📖', label: 'Story Bible' }, { icon: '🎬', label: 'Script Archive' }],
    'canon-keeper':         [{ icon: '📅', label: 'Story Timeline' }, { icon: '👤', label: 'Character Registry' }],
    'world-builder':        [{ icon: '🗺️', label: 'World Map' }, { icon: '⚔️', label: 'Factions & Powers' }],
    'production-studio':    [{ icon: '🎞️', label: 'Shot Library' }, { icon: '🎨', label: 'Visual Prompts' }],
    'professor':            [{ icon: '📐', label: 'Curriculum' }, { icon: '📝', label: 'Student Records' }],
    'league-commissioner':  [{ icon: '🏆', label: 'League Seasons' }, { icon: '📊', label: 'Team Rosters' }],
    'bac-coach':            [{ icon: '📈', label: 'Business Plans' }, { icon: '💰', label: 'Financial Models' }],
    'jarvis':               [{ icon: '📸', label: 'Memory Archive' }, { icon: '👨‍👩‍👧‍👦', label: 'Family Records' }],
  };
  return [...BASE, ...(EXTRAS[agentId] || [])];
}

export default function AgentFullPanel({ agent, systemId, system, minTier = 'standard', onClose }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const tier = TIER_CONFIG[minTier] || TIER_CONFIG.standard;
  const activity = getMockActivity(agent.id);
  const connected = getConnectedData(agent.id, system);
  const brain = AGENT_BRAINS[agent.id];

  const ACTIONS = [
    { icon: <FiMessageCircle size={14} />, label: 'Chat with Agent', primary: true, action: () => setChatOpen(true) },
    { icon: <FiClipboard size={14} />,    label: 'Assign Task',      primary: false, action: () => {} },
    { icon: <FiFolder size={14} />,       label: 'View Files',       primary: false, action: () => {} },
    { icon: <FiBook size={14} />,         label: 'View Canon',       primary: false, action: () => {} },
    { icon: <FiZap size={14} />,          label: 'Spawn Helper',     primary: false, action: () => {} },
  ];

  return (
    <>
      <AnimatePresence>
        {!chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative h-full w-full max-w-md overflow-y-auto flex flex-col"
              style={{ background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <FiX size={16} />
              </button>

              {/* ── Hero ───────────────────────────────────────────────────── */}
              <div
                className="px-6 pt-8 pb-6 flex-shrink-0"
                style={{
                  background: `linear-gradient(180deg, ${agent.colorFrom}14 0%, transparent 100%)`,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-start gap-4">
                  <AgentAvatarFace agent={agent} size="lg" />
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                      <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">Online</span>
                    </div>
                    <h2 className="font-serif text-xl text-white font-bold leading-tight">{agent.name}</h2>
                    <p className="text-sm mt-0.5 font-medium" style={{ color: agent.colorFrom }}>{agent.title}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {system && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border"
                          style={{
                            color: system.color,
                            borderColor: `${system.color}35`,
                            background: `${system.color}10`,
                          }}>
                          {system.emoji} {system.shortName}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full border"
                        style={{ color: tier.color, borderColor: `${tier.color}35`, background: `${tier.color}10` }}>
                        {tier.label}+
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent greeting snippet */}
                <div className="mt-4 rounded-xl p-3 text-xs text-gray-400 leading-relaxed italic"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${agent.colorFrom}18` }}>
                  "{agent.greeting.split('.')[0]}."
                </div>
              </div>

              {/* ── Tabs ────────────────────────────────────────────────────── */}
              <div className="flex border-b border-white/8 flex-shrink-0">
                {[
                  { id: 'overview',  label: 'Overview' },
                  { id: 'activity',  label: 'Activity' },
                  { id: 'files',     label: 'Files' },
                  { id: 'autonomy',  label: '⚡ Autonomy' },
                  ...(brain ? [{ id: 'brain', label: '🧠 Brain' }] : []),
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-current'
                        : 'border-transparent text-gray-600 hover:text-gray-400'
                    }`}
                    style={activeTab === tab.id ? { color: agent.colorFrom } : {}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Tab content ─────────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 space-y-5"
                    >
                      {/* What I Do */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          What I Do
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.map((cap, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
                              style={{
                                color: i === 0 ? agent.colorFrom : '#9CA3AF',
                                borderColor: i === 0 ? `${agent.colorFrom}35` : 'rgba(255,255,255,0.08)',
                                background: i === 0 ? `${agent.colorFrom}10` : 'rgba(255,255,255,0.03)',
                              }}
                            >
                              <FiChevronRight size={10} />
                              {cap}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Quick actions */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Actions
                        </p>
                        <div className="space-y-2">
                          {ACTIONS.map((action, i) => (
                            <button
                              key={i}
                              onClick={action.action}
                              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:brightness-110 text-left"
                              style={action.primary ? {
                                background: `linear-gradient(135deg, ${agent.colorFrom}22, ${agent.colorTo}18)`,
                                borderColor: `${agent.colorFrom}45`,
                                color: agent.colorFrom,
                              } : {
                                background: 'rgba(255,255,255,0.03)',
                                borderColor: 'rgba(255,255,255,0.08)',
                                color: '#9CA3AF',
                              }}
                            >
                              <span className={action.primary ? '' : 'text-gray-600'}>{action.icon}</span>
                              {action.label}
                              {action.primary && <FiChevronRight size={13} className="ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Quick prompts */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Quick Prompts
                        </p>
                        <div className="space-y-1.5">
                          {agent.quickActions.map((qa, i) => (
                            <button
                              key={i}
                              onClick={() => setChatOpen(true)}
                              className="w-full text-left text-xs px-3 py-2 rounded-lg border border-white/6 text-gray-500 hover:text-white hover:border-white/15 hover:bg-white/4 transition-all"
                            >
                              <FiZap size={10} className="inline mr-1.5 mb-0.5" style={{ color: agent.colorFrom }} />
                              {qa.label}
                            </button>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {activeTab === 'activity' && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 space-y-5"
                    >
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Recent Activity
                        </p>
                        <div className="space-y-2">
                          {activity.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-xl border border-white/6 bg-white/2"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${agent.colorFrom}15`, border: `1px solid ${agent.colorFrom}25` }}
                              >
                                <FiClock size={12} style={{ color: agent.colorFrom }} />
                              </div>
                              <div>
                                <p className="text-xs text-white leading-snug">{item}</p>
                                <p className="text-[10px] text-gray-600 mt-0.5">
                                  {['Just now', '2m ago', '14m ago', '1h ago'][i] || '—'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Task status */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Status
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Active',    value: '3',  color: '#10B981' },
                            { label: 'Queued',    value: '7',  color: '#F59E0B' },
                            { label: 'Complete',  value: '24', color: agent.colorFrom },
                          ].map(s => (
                            <div
                              key={s.label}
                              className="text-center py-3 rounded-xl border border-white/6 bg-white/2"
                            >
                              <p className="text-lg font-bold font-serif leading-none" style={{ color: s.color }}>
                                {s.value}
                              </p>
                              <p className="text-[9px] text-gray-600 mt-1">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {activeTab === 'files' && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 space-y-5"
                    >
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Connected Data
                        </p>
                        <div className="space-y-2">
                          {connected.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4 transition-all cursor-pointer"
                            >
                              <span className="text-lg flex-shrink-0">{item.icon}</span>
                              <p className="flex-1 text-xs text-gray-300">{item.label}</p>
                              <FiExternalLink size={12} className="text-gray-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Spawn helpers */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-3">
                          Spawnable Helpers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(system?.helpers || []).map(helper => (
                            <span
                              key={helper}
                              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border border-white/8 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/4 transition-all cursor-pointer"
                            >
                              <FiZap size={9} style={{ color: agent.colorFrom }} />
                              {helper}
                            </span>
                          ))}
                          {(!system?.helpers || system.helpers.length === 0) && (
                            <p className="text-xs text-gray-600">No helpers available for this agent</p>
                          )}
                        </div>
                      </section>
                    </motion.div>
                  )}
                  {activeTab === 'autonomy' && (
                    <motion.div
                      key="autonomy"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <AutonomyPanel agent={agent} />
                    </motion.div>
                  )}

                  {activeTab === 'brain' && brain && (
                    <motion.div
                      key="brain"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 space-y-5"
                    >
                      {/* Role Identity */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Role Identity
                        </p>
                        <div className="rounded-xl p-3 text-xs text-gray-300 leading-relaxed italic"
                          style={{ background: `${agent.colorFrom}10`, border: `1px solid ${agent.colorFrom}20` }}>
                          "{brain.roleIdentity}"
                        </div>
                      </section>

                      {/* Expert Domains */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Expert Knowledge Base — 10 Domains
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {brain.expertDomains.map((d, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 rounded-lg border"
                              style={{
                                color: i < 3 ? agent.colorFrom : '#6B7280',
                                borderColor: i < 3 ? `${agent.colorFrom}30` : 'rgba(255,255,255,0.07)',
                                background: i < 3 ? `${agent.colorFrom}08` : 'rgba(255,255,255,0.02)',
                              }}>
                              {d}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Top Minds */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Benchmarked Against Top 10 Minds
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {brain.topMinds.map((mind, i) => (
                            <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/6 bg-white/2">
                              <span className="text-[10px] font-bold w-4 text-center" style={{ color: agent.colorFrom }}>
                                {i + 1}
                              </span>
                              <span className="text-[10px] text-gray-400 truncate">{mind}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Metacognition Engine */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Metacognition Engine — Pre-Response Checks
                        </p>
                        <div className="space-y-1.5">
                          {brain.metacognitionChecks.map((check, i) => (
                            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg border border-white/6 bg-white/2">
                              <FiCheck size={10} className="flex-shrink-0 mt-0.5" style={{ color: agent.colorFrom }} />
                              <span className="text-[10px] text-gray-400 leading-tight">{check}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Spawnable Sub-Agents */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Spawning Engine — Sub-Agents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {brain.spawnableSubAgents.map((sub, i) => (
                            <span key={i} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border border-white/8 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/4 transition-all cursor-pointer">
                              <FiZap size={9} style={{ color: agent.colorFrom }} />
                              {sub}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Growth Pipeline */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Learning Pipeline
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                          {GROWTH_PIPELINE.map((step, i) => (
                            <React.Fragment key={step}>
                              <span className="text-[10px] px-2 py-0.5 rounded-md"
                                style={{ color: agent.colorFrom, background: `${agent.colorFrom}12`, border: `1px solid ${agent.colorFrom}20` }}>
                                {step}
                              </span>
                              {i < GROWTH_PIPELINE.length - 1 && (
                                <span className="text-[9px] text-gray-700">›</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </section>

                      {/* Memory Tracking */}
                      <section>
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-gray-600 mb-2">
                          Memory System — Tracks
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {brain.memoryTracking.map((item, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md border border-white/6 text-gray-500">
                              💾 {item}
                            </span>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* ── Sticky footer — primary CTA ─────────────────────────────── */}
              <div
                className="p-4 flex-shrink-0 border-t border-white/8"
                style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(8px)' }}
              >
                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-115"
                  style={{
                    background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})`,
                    color: '#fff',
                    boxShadow: `0 4px 16px ${agent.colorFrom}35`,
                  }}
                >
                  <FiMessageCircle size={15} />
                  Chat with {agent.name}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat opens on top of the panel */}
      {chatOpen && (
        <AgentChatModal
          agent={agent}
          systemId={systemId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}

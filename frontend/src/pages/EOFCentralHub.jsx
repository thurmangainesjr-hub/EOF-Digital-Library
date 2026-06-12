import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronRight, FiZap, FiLock } from 'react-icons/fi';
import { AGENT_SYSTEMS, MEMBERSHIP_TIERS } from '../data/agentData';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import EcosystemStrip from '../components/EcosystemStrip';

const CENTRAL = AGENT_SYSTEMS.find(s => s.id === 'central');
const TIER_ICONS = { free: '○', standard: '◑', premium: '●', enterprise: '◆' };

// ── System directory card ─────────────────────────────────────────────────────
function SystemCard({ system, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={system.path}
        className={`group flex items-center gap-3 rounded-xl bg-gradient-to-br ${system.gradient} border ${system.border} p-4 hover:scale-[1.01] transition-all`}
      >
        <span className="text-2xl flex-shrink-0">{system.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">{system.shortName}</p>
          <p className="text-[10px] mt-0.5 truncate" style={{ color: system.color }}>{system.tagline}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] text-gray-500">{system.agents.length} agents</span>
          <FiArrowRight size={12} className="text-gray-600 group-hover:text-white transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Membership tier card ──────────────────────────────────────────────────────
function TierCard({ tier, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`rounded-2xl border ${tier.border} bg-gradient-to-br ${tier.gradient} p-5`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg" style={{ color: tier.color }}>{TIER_ICONS[tier.id]}</span>
        <h3 className="font-bold text-white text-sm">{tier.name}</h3>
      </div>
      <p className="text-xs font-medium mb-3" style={{ color: tier.color }}>{tier.agentAccess}</p>
      <ul className="space-y-1.5">
        {tier.perks.map(perk => (
          <li key={perk} className="flex items-start gap-2 text-xs text-gray-400">
            <span className="mt-0.5 flex-shrink-0" style={{ color: tier.color }}>›</span>
            {perk}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EOFCentralHub() {
  const [activeSection, setActiveSection] = useState('agents');
  const [openAgent, setOpenAgent] = useState(null); // { agent, system }

  const allSystems = AGENT_SYSTEMS.filter(s => s.id !== 'central');
  const totalAgents = AGENT_SYSTEMS.reduce((sum, s) => sum + s.agents.length, 0);
  const totalHelpers = AGENT_SYSTEMS.reduce((sum, s) => sum + s.helpers.length, 0);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <span className="text-eof-gold">EOF Central AI Hub</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-eof-gold/20 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(124,58,237,0.06) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-eof-gold/10 border border-eof-gold/25 rounded-full px-3 py-1 text-xs text-eof-gold mb-4">
            <span>🏛️</span> Master Coordination Layer
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            EOF Central AI Hub
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            One intelligence core. Ten systems. Every agent you need to create, learn, build, broadcast, and preserve — coordinated from a single hub.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/ecosystem"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.35)', color: '#D4AF37' }}>
              <span>🌐</span> Full Ecosystem
            </Link>
            <Link to="/membership"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all">
              Upgrade Access <FiArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-3 items-end">
          {[
            [String(AGENT_SYSTEMS.length), 'Systems'],
            [String(totalAgents), 'Core Agents'],
            [`${totalHelpers}+`, 'Helper Types'],
          ].map(([v, l]) => (
            <div key={l} className="text-right">
              <p className="text-xl font-bold text-white leading-none">{v}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10">
        {[
          { id: 'agents',     label: 'Agent Roster', icon: '🤖' },
          { id: 'systems',    label: 'All Systems',  icon: '🌐' },
          { id: 'membership', label: 'Membership',   icon: '🔑' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeSection === tab.id
                ? 'border-eof-gold text-eof-gold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Agent Roster ───────────────────────────────────────────────── */}
        {activeSection === 'agents' && (
          <motion.div
            key="agents"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mb-5">
              <h2 className="font-serif text-2xl text-white font-bold mb-1">EOF Central Core Agents</h2>
              <p className="text-sm text-gray-500">Four agents that serve the entire ecosystem. Click any card to open their workspace.</p>
            </div>

            {/* Agent roster grid — Netflix tile style */}
            <div className="flex flex-wrap gap-4 mb-10">
              {CENTRAL.agents.map((agent, i) => (
                <AgentAvatarCard
                  key={agent.id}
                  agent={agent}
                  systemId="central"
                  system={CENTRAL}
                  minTier={CENTRAL.minTier}
                  index={i}
                  onClick={() => setOpenAgent({ agent, system: CENTRAL })}
                />
              ))}
            </div>

            {/* Spawning explainer */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-eof-gold/10 border border-eof-gold/25 flex items-center justify-center flex-shrink-0">
                  <FiZap className="text-eof-gold" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">How Agent Spawning Works</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Main agents are permanent. When a task needs extra help, a main agent spawns a temporary helper. It completes the work, reports back, and closes.
                  </p>
                  <div className="rounded-xl border border-white/8 bg-black/20 p-4 text-xs text-gray-400 leading-relaxed font-mono">
                    <p className="text-eof-gold mb-2">// Live spawning example</p>
                    <p>User → Griot Central: <span className="text-white">"Build a battle scene, keep it canon"</span></p>
                    <p className="mt-2 text-gray-500">Griot Central activates:</p>
                    <p className="ml-3 text-purple-300">↳ Story Architect · Canon Keeper · World Builder</p>
                    <p className="mt-2 text-gray-500">Spawns helpers:</p>
                    <p className="ml-3 text-pink-300">⚡ Fight Scene Assistant (temp) · Continuity Checker (temp)</p>
                    <p className="mt-2 text-gray-500">Task done → helpers close.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All helper types */}
            <div>
              <h3 className="font-serif text-lg text-white font-bold mb-4">All Spawnable Helper Types</h3>
              <div className="flex flex-wrap gap-2">
                {AGENT_SYSTEMS.flatMap(s => s.helpers).map(helper => (
                  <span key={helper} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/8 text-gray-400">
                    ⚡ {helper}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── All Systems ────────────────────────────────────────────────── */}
        {activeSection === 'systems' && (
          <motion.div
            key="systems"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-white font-bold mb-1">All 10 Systems</h2>
              <p className="text-sm text-gray-500">Each system has its own core agents and spawnable helpers. Click to enter.</p>
            </div>

            {/* EOF Central highlight */}
            <div className="rounded-2xl border border-eof-gold/25 bg-eof-gold/5 p-5 mb-5 flex items-center gap-4">
              <span className="text-3xl">🏛️</span>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">EOF Central — You Are Here</p>
                <p className="text-xs text-gray-400 mt-0.5">Master coordinator. 4 core agents. Ecosystem-wide access.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full border font-medium"
                style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)' }}>
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {allSystems.map((system, i) => (
                <SystemCard key={system.id} system={system} index={i} />
              ))}
            </div>

            {/* Agent count table */}
            <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <h3 className="font-bold text-white text-sm">Agent Count by System</h3>
              </div>
              <div className="divide-y divide-white/5">
                {AGENT_SYSTEMS.map(system => (
                  <div key={system.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-lg flex-shrink-0">{system.emoji}</span>
                    <p className="text-sm text-gray-300 flex-1">{system.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-eof-gold" />
                        {system.agents.length} core
                      </span>
                      <span className="flex items-center gap-1">
                        <FiZap size={10} className="text-purple-400" />
                        {system.helpers.length} helpers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Membership ─────────────────────────────────────────────────── */}
        {activeSection === 'membership' && (
          <motion.div
            key="membership"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-white font-bold mb-1">Membership Access Model</h2>
              <p className="text-sm text-gray-500">Agent access is controlled by membership level. Upgrade to unlock more agents, memory, and spawning power.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {MEMBERSHIP_TIERS.map((tier, i) => (
                <TierCard key={tier.id} tier={tier} index={i} />
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                to="/membership"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:brightness-110 border"
                style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.35)', color: '#D4AF37' }}
              >
                <FiLock size={14} /> View Membership Plans
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EcosystemStrip currentAppId={null} />

      {/* Full agent panel — slides in from right */}
      {openAgent && (
        <AgentFullPanel
          agent={openAgent.agent}
          systemId="central"
          system={openAgent.system}
          minTier={CENTRAL.minTier}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

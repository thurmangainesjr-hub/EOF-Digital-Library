import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiZap, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const FHHL_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'fhhl');

const SCORING_CATEGORIES = [
  { icon: '🎵', label: 'Song Release',    pts: '+15 pts', desc: 'Per single or album dropped' },
  { icon: '📊', label: 'Chart Position',  pts: '+10 pts', desc: 'Billboard/streaming chart entry' },
  { icon: '🔥', label: 'Viral Moment',    pts: '+25 pts', desc: 'Trending social media event' },
  { icon: '🎤', label: 'Live Performance',pts: '+8 pts',  desc: 'Concert, show, or festival' },
  { icon: '🏆', label: 'Award Win',       pts: '+30 pts', desc: 'Grammy, BET, or major award' },
  { icon: '🤝', label: 'Collaboration',   pts: '+12 pts', desc: 'Feature on another artist\'s track' },
];

const POWER_RANKINGS = [
  { rank: 1,  change: '+2', team: 'Trap Dynasty FC',    record: '8–2',  pts: 342, lead: 'Kendrick Lamar' },
  { rank: 2,  change: '–',  team: 'Golden Era United',  record: '7–3',  pts: 318, lead: 'J. Cole' },
  { rank: 3,  change: '+1', team: 'Culture Shock SC',   record: '7–3',  pts: 311, lead: 'Tyler, the Creator' },
  { rank: 4,  change: '–1', team: 'New Wave Athletics', record: '6–4',  pts: 289, lead: 'Drake' },
  { rank: 5,  change: '–',  team: 'Underground Kings',  record: '5–5',  pts: 264, lead: 'Lil Baby' },
];

const RECENT_MOVES = [
  { type: 'DRAFT', color: '#F97316', team: 'Trap Dynasty FC',    action: 'drafted', artist: 'GloRilla',    pts: '+42 pts this week' },
  { type: 'DROP',  color: '#EF4444', team: 'New Wave Athletics', action: 'dropped', artist: 'Gunna',       pts: '-12 pts last week' },
  { type: 'TRADE', color: '#A855F7', team: 'Culture Shock SC',   action: 'traded',  artist: 'Latto',       pts: '2-for-1 deal' },
  { type: 'SIGN',  color: '#10B981', team: 'Golden Era United',  action: 'signed',  artist: 'Doechii',     pts: '+38 pts this week' },
];

export default function FHHLHub() {
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#F97316' }}>Fantasy Hip-Hop League</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-orange-600/30 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(194,65,12,0.10) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 40%, rgba(249,115,22,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-orange-300 mb-4 border"
            style={{ background: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.3)' }}>
            <span>🏆</span> Sports-Style Music Competition
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            Fantasy Hip-Hop League
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Draft real hip-hop artists. Earn points from their real-world releases, chart moves, and cultural moments. Compete across seasons — the culture is your sport.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(249,115,22,0.2)', borderColor: 'rgba(249,115,22,0.4)', color: '#FB923C' }}>
              <span>🏆</span> Join the League
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all">
              How It Works <FiArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-3 items-end">
          {[['Season 3', 'Active'], ['12', 'Teams'], ['480+', 'Artists']].map(([v, l]) => (
            <div key={l} className="text-right">
              <p className="text-xl font-bold text-white leading-none">{v}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Agent Roster ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the FHHL Team</h2>
            <p className="text-sm text-gray-500">Five permanent agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{FHHL_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {FHHL_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="fhhl"
              system={FHHL_SYSTEM}
              minTier={FHHL_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>

        {/* Spawnable helpers */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {FHHL_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* Power Rankings */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Power Rankings</h2>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <FiTrendingUp size={11} /> Week 10
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 divide-y divide-white/5">
            {POWER_RANKINGS.map((row, i) => (
              <motion.div
                key={row.rank}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="contents"
              >
                {/* Rank */}
                <div className="flex items-center gap-2 px-4 py-3.5 bg-white/2">
                  <span className="text-lg font-black text-white w-5 text-center">{row.rank}</span>
                  <span className={`text-[10px] font-bold w-6 ${
                    row.change.startsWith('+') ? 'text-green-400' :
                    row.change === '–' ? 'text-gray-600' : 'text-red-400'
                  }`}>{row.change}</span>
                </div>
                {/* Team */}
                <div className="flex flex-col justify-center px-4 py-3.5">
                  <p className="text-sm font-bold text-white">{row.team}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Lead: {row.lead}</p>
                </div>
                {/* Record */}
                <div className="flex items-center justify-end px-4 py-3.5">
                  <span className="text-xs text-gray-400 font-mono">{row.record}</span>
                </div>
                {/* Points */}
                <div className="flex items-center justify-end px-4 py-3.5">
                  <span className="text-sm font-black" style={{ color: '#F97316' }}>{row.pts}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">How You Score Points</h2>
        <p className="text-sm text-gray-500 mb-6">Real-world activity from your drafted artists earns your team points every week</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SCORING_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/3 p-4 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-black rounded-full px-2 py-0.5 border"
                  style={{ color: '#F97316', borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)' }}>
                  {cat.pts}
                </span>
              </div>
              <p className="text-sm font-bold text-white">{cat.label}</p>
              <p className="text-[11px] text-gray-500 leading-tight">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Moves */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-5">Recent League Moves</h2>
        <div className="space-y-3">
          {RECENT_MOVES.map((move, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-4 hover:border-orange-500/20 transition-colors"
            >
              <span
                className="text-[10px] font-black px-2 py-1 rounded flex-shrink-0"
                style={{ color: move.color, background: move.color + '18', border: `1px solid ${move.color}30` }}
              >
                {move.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-bold">{move.team}</span>
                  <span className="text-gray-400"> {move.action} </span>
                  <span className="font-bold">{move.artist}</span>
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">{move.pts}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-orange-600/30 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(249,115,22,0.08)' }}>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Ready to Compete?</h3>
          <p className="text-sm text-gray-400">Draft your roster, activate your agents, and let the Commissioner manage your season. The draft room is open.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 transition-all hover:brightness-110 border"
          style={{ background: 'rgba(249,115,22,0.2)', borderColor: 'rgba(249,115,22,0.4)', color: '#FB923C' }}>
          <FiZap size={15} /> Enter Draft Room
        </button>
      </div>

      <EcosystemStrip currentAppId="fhhl" />

      {/* Agent full panel */}
      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="fhhl"
          system={FHHL_SYSTEM}
          minTier={FHHL_SYSTEM?.minTier || 'standard'}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

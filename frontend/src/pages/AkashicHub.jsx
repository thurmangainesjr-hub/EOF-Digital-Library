import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiZap, FiArrowRight, FiLock } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const AKASHIC_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'akashic');

const RESEARCH_TYPES = [
  { icon: '🌍', label: 'African Diaspora',    desc: 'Trace lineage across the Atlantic, Caribbean, and Americas with historical context.' },
  { icon: '📜', label: 'Slave Trade Records', desc: 'Research historical manifests, plantation records, and freedmen\'s bureau documents.' },
  { icon: '🗺️', label: 'Migration Patterns',  desc: 'Map family movements across regions, decades, and generations.' },
  { icon: '🏛️', label: 'Cultural Heritage',   desc: 'Connect your family to specific ethnic groups, languages, and traditions.' },
  { icon: '🧬', label: 'DNA Connections',      desc: 'Interpret genetic ancestry results and connect them to documented family history.' },
  { icon: '📰', label: 'Newspaper Archives',   desc: 'Surface historical articles, obituaries, and announcements that mention your family.' },
];

const TIMELINE_EVENTS = [
  { year: '1619', label: 'First Africans in Colonial America',         color: '#0D9488' },
  { year: '1808', label: 'End of Atlantic Slave Trade (official)',     color: '#14B8A6' },
  { year: '1865', label: 'Emancipation & Freedmen\'s Bureau Records', color: '#2DD4BF' },
  { year: '1915', label: 'Great Migration North begins',              color: '#0D9488' },
  { year: '1965', label: 'Civil Rights Era — New Migrations',         color: '#14B8A6' },
  { year: 'Now',  label: 'Your family\'s story continues',            color: '#2DD4BF' },
];

const DISCOVERY_EXAMPLES = [
  { emoji: '🌍', name: 'Kwame & Asha Mensah', origin: 'Traced to Akan people — Ghana, West Africa', depth: '7 generations', type: 'Lineage' },
  { emoji: '📍', name: 'The Harrington Line',  origin: 'Mississippi → Chicago → Detroit migration', depth: '4 branches',    type: 'Migration' },
  { emoji: '🏛️', name: 'Freeman Family Oral History', origin: 'Freedmen\'s Bureau records, 1867',  depth: '6 documents',  type: 'Archive' },
];

export default function AkashicHub() {
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#0D9488' }}>Akashic Records</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-teal-600/30 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15) 0%, rgba(19,78,74,0.10) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 40%, rgba(13,148,136,0.10) 0%, transparent 60%)' }} />

        {/* Star field effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-teal-300"
              style={{
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                top: `${(i * 17 + 7) % 90}%`,
                left: `${(i * 23 + 11) % 95}%`,
                opacity: 0.4 + (i % 5) * 0.12,
              }} />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-teal-300 mb-4 border"
            style={{ background: 'rgba(13,148,136,0.12)', borderColor: 'rgba(13,148,136,0.3)' }}>
            <span>🌌</span> Advanced Generational Knowledge — Premium
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            Akashic Records
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Deep family history research, genealogy, and generational knowledge preservation across branches and centuries. Trace your lineage to its source — and connect your family story to the full arc of history.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(13,148,136,0.2)', borderColor: 'rgba(13,148,136,0.4)', color: '#2DD4BF' }}>
              <span>🌌</span> Begin Research
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all">
              View Sample Tree <FiArrowRight size={13} />
            </button>
          </div>

          {/* Premium badge */}
          <div className="mt-5 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
            style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}>
            <FiLock size={11} /> Premium feature — included with Premium & Enterprise membership
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-3 items-end">
          {[['400yrs', 'History Covered'], ['6', 'Research Layers'], ['∞', 'Generations']].map(([v, l]) => (
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
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the Akashic Team</h2>
            <p className="text-sm text-gray-500">Three permanent agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{AKASHIC_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {AKASHIC_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="akashic"
              system={AKASHIC_SYSTEM}
              minTier={AKASHIC_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {AKASHIC_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* Research types */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Research Capabilities</h2>
        <p className="text-sm text-gray-500 mb-6">Six research layers — from DNA to documented history</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {RESEARCH_TYPES.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 p-5 hover:border-teal-600/30 transition-colors"
            >
              <span className="text-3xl">{r.icon}</span>
              <p className="text-sm font-bold text-white">{r.label}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historical timeline */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Historical Context Layer</h2>
        <p className="text-sm text-gray-500 mb-6">The Akashic system places your family story inside world history</p>
        <div className="rounded-2xl border border-white/10 bg-white/2 overflow-hidden">
          {TIMELINE_EVENTS.map((e, i) => (
            <motion.div
              key={e.year}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-5 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
            >
              <span className="text-xs font-black w-12 flex-shrink-0 text-right" style={{ color: e.color }}>{e.year}</span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <p className="text-sm text-gray-300">{e.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discovery examples */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-5">Sample Discoveries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DISCOVERY_EXAMPLES.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-teal-600/20 p-5"
              style={{ background: 'rgba(13,148,136,0.05)' }}
            >
              <div className="text-3xl mb-3">{d.emoji}</div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#0D9488' }}>{d.type}</p>
              <p className="text-sm font-bold text-white mb-2">{d.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{d.origin}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                style={{ color: '#2DD4BF', borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.08)' }}>
                {d.depth}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-teal-600/30 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(13,148,136,0.08)' }}>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Begin Your Deep Research</h3>
          <p className="text-sm text-gray-400">The Akashic Archivist is ready to start building your generational record. The deeper you go, the more you find.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 transition-all hover:brightness-110 border"
          style={{ background: 'rgba(13,148,136,0.2)', borderColor: 'rgba(13,148,136,0.4)', color: '#2DD4BF' }}>
          <FiZap size={15} /> Start Research
        </button>
      </div>

      <EcosystemStrip currentAppId="akashic" />

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="akashic"
          system={AKASHIC_SYSTEM}
          minTier={AKASHIC_SYSTEM?.minTier || 'premium'}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

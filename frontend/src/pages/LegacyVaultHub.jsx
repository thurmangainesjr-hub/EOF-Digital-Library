import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiZap, FiArrowRight } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const LEGACY_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'legacy-vault');

const VAULT_FEATURES = [
  { icon: '🎙️', label: 'Voice Interviews',    desc: 'Guided question prompts to capture life stories, wisdom, and memories in your own words.' },
  { icon: '📸', label: 'Photo Archives',       desc: 'Upload and organize family photos, label people, dates, and locations for future generations.' },
  { icon: '📜', label: 'Life Letters',         desc: 'Write lasting messages — birthday letters, wisdom notes, and messages to be opened in the future.' },
  { icon: '🌳', label: 'Family Timeline',      desc: 'Build a visual timeline of births, milestones, migrations, and defining family moments.' },
  { icon: '🔒', label: 'Secure Vault',         desc: 'All memories are encrypted and accessible only by people you invite into your legacy circle.' },
  { icon: '📦', label: 'Legacy Packages',      desc: 'Export your complete legacy as a digital package — shareable with family forever.' },
];

const CAPTURE_TYPES = [
  { emoji: '🗣️', label: 'Life Story',       color: '#6366F1' },
  { emoji: '💡', label: 'Wisdom',           color: '#818CF8' },
  { emoji: '👨‍👩‍👧‍👦', label: 'Family History', color: '#A5B4FC' },
  { emoji: '🏡', label: 'Childhood Home',   color: '#6366F1' },
  { emoji: '💼', label: 'Career Journey',   color: '#818CF8' },
  { emoji: '✝️', label: 'Faith & Values',   color: '#A5B4FC' },
  { emoji: '💔', label: 'Struggles Won',    color: '#6366F1' },
  { emoji: '🎉', label: 'Greatest Moments', color: '#818CF8' },
];

const RECENT_CAPTURES = [
  { type: 'Interview', icon: '🎙️', title: 'Grandma Rose\'s Migration Story',      date: '2 days ago',    words: '1,240 words' },
  { type: 'Photo',     icon: '📸', title: '1978 Family Reunion — Detroit',          date: 'Last week',     words: '34 photos' },
  { type: 'Letter',    icon: '📜', title: 'Letter to My Grandchildren',             date: '3 weeks ago',   words: '620 words' },
  { type: 'Memory',    icon: '💭', title: 'Dad\'s First Business — The Barber Shop', date: '1 month ago',   words: '890 words' },
];

export default function LegacyVaultHub() {
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#6366F1' }}>Legacy Vault</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-indigo-600/30 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(55,48,163,0.10) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 40%, rgba(99,102,241,0.10) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-indigo-300 mb-4 border"
            style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <span>🏺</span> Personal & Family Preservation
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            Legacy Vault
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Every family has stories that must not be forgotten. Legacy Vault preserves your life, your family history, and your wisdom — so the generations that follow you will always know where they came from.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#A5B4FC' }}>
              <span>🎙️</span> Start Capturing
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all">
              Meet Jarvis <FiArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-3 items-end">
          {[['10K+', 'Stories Preserved'], ['∞', 'Generations'], ['100%', 'Encrypted']].map(([v, l]) => (
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
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the Legacy Vault Team</h2>
            <p className="text-sm text-gray-500">Four permanent agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{LEGACY_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {LEGACY_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="legacy-vault"
              system={LEGACY_SYSTEM}
              minTier={LEGACY_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {LEGACY_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* What to capture */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">What Can You Preserve?</h2>
        <p className="text-sm text-gray-500 mb-6">Legacy Vault captures every dimension of a life worth remembering</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CAPTURE_TYPES.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/3 p-4 text-center hover:border-indigo-500/30 transition-colors cursor-default"
            >
              <span className="text-3xl">{t.emoji}</span>
              <p className="text-xs font-bold text-white">{t.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vault features */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Inside the Vault</h2>
        <p className="text-sm text-gray-500 mb-6">Every tool built for preservation, not just storage</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {VAULT_FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 p-5 hover:border-indigo-500/25 transition-colors"
            >
              <span className="text-3xl">{f.icon}</span>
              <p className="text-sm font-bold text-white">{f.label}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent captures */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Recent Captures</h2>
          <span className="text-xs text-gray-600">Sample vault activity</span>
        </div>
        <div className="space-y-3">
          {RECENT_CAPTURES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-4 hover:border-indigo-500/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{c.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.type}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-gray-500">{c.date}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                  style={{ color: '#A5B4FC', borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)' }}>
                  {c.words}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-indigo-600/30 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(99,102,241,0.08)' }}>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Start Preserving Today</h3>
          <p className="text-sm text-gray-400">Every day that passes is a story that could be lost. Jarvis is ready to guide you through your first capture — it only takes 10 minutes.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 transition-all hover:brightness-110 border"
          style={{ background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#A5B4FC' }}>
          <FiZap size={15} /> Talk to Jarvis
        </button>
      </div>

      <EcosystemStrip currentAppId="legacy-vault" />

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="legacy-vault"
          system={LEGACY_SYSTEM}
          minTier={LEGACY_SYSTEM?.minTier || 'standard'}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

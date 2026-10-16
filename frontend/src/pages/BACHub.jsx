import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiZap, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const BAC_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'bac');

const BAC_SERVICES = [
  { icon: '💼', label: 'Business Planning',    desc: 'LLC/Corp setup, business plans, pitch decks, and launch strategy from day one.' },
  { icon: '💰', label: 'Financial Literacy',   desc: 'Budgeting, saving, debt education, and building strong financial habits.' },
  { icon: '📈', label: 'Credit Education',     desc: 'Credit repair guidance, score improvement, and credit readiness for funding.' },
  { icon: '🎯', label: 'Grant Writing',        desc: 'Research, outline, and draft grant proposals to secure real funding.' },
  { icon: '🏘️', label: 'Community Dev',        desc: 'Nonprofit planning, program design, and outreach strategy for your community.' },
  { icon: '🚀', label: 'Growth Strategy',      desc: 'Scaling your business with systems, team building, and revenue expansion.' },
];

const MILESTONES = [
  { step: '01', icon: '💡', label: 'Idea & Plan',     desc: 'Business concept + structure decision', color: '#16A34A' },
  { step: '02', icon: '📋', label: 'Legal Setup',     desc: 'LLC/Corp formation + EIN', color: '#22C55E' },
  { step: '03', icon: '📈', label: 'Credit Ready',    desc: 'Personal + business credit building', color: '#4ADE80' },
  { step: '04', icon: '🎯', label: 'Funding',         desc: 'Grants, loans, and investors secured', color: '#86EFAC' },
  { step: '05', icon: '🚀', label: 'Launch & Scale',  desc: 'Revenue, systems, and team growth', color: '#16A34A' },
];

const STATS = [
  { value: '500+', label: 'Business Plans Built' },
  { value: '$2M+', label: 'Grants Identified' },
  { value: '1,200+', label: 'Credit Wins' },
  { value: '85+', label: 'Nonprofits Launched' },
];

export default function BACHub() {
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#16A34A' }}>BAC</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-green-600/30 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(20,83,45,0.10) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 40%, rgba(22,163,74,0.10) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-green-300 mb-4 border"
            style={{ background: 'rgba(22,163,74,0.12)', borderColor: 'rgba(22,163,74,0.3)' }}>
            <span>💼</span> Business · Finance · Community
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            BAC
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Your complete business, financial literacy, and community development system. Build your business, master your money, repair your credit, write your grants, and grow your community — all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(22,163,74,0.2)', borderColor: 'rgba(22,163,74,0.4)', color: '#4ADE80' }}>
              <span>💼</span> Start Your Business
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all">
              Find Grants <FiArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-3 items-end">
          {STATS.slice(0, 3).map(({ value, label }) => (
            <div key={label} className="text-right">
              <p className="text-xl font-bold text-white leading-none">{value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Agent Roster ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the BAC Team</h2>
            <p className="text-sm text-gray-500">Five permanent agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{BAC_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {BAC_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="bac"
              system={BAC_SYSTEM}
              minTier={BAC_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {BAC_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* Business Roadmap */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Your Business Roadmap</h2>
        <p className="text-sm text-gray-500 mb-6">Five milestones from idea to thriving enterprise</p>
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 rounded-2xl overflow-hidden border border-white/10">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex-1 flex flex-col items-center gap-2 p-5 text-center relative"
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                borderRight: i < MILESTONES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <span className="text-[10px] font-black tracking-widest" style={{ color: m.color }}>{m.step}</span>
              <span className="text-2xl">{m.icon}</span>
              <p className="text-sm font-bold text-white">{m.label}</p>
              <p className="text-[11px] text-gray-500 leading-tight">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">What BAC Covers</h2>
        <p className="text-sm text-gray-500 mb-6">Every tool you need to build, fund, and grow</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BAC_SERVICES.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 p-5 hover:border-green-600/30 transition-colors"
            >
              <span className="text-3xl">{s.icon}</span>
              <p className="text-sm font-bold text-white">{s.label}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-green-600/20 p-5 text-center"
              style={{ background: 'rgba(22,163,74,0.05)' }}
            >
              <p className="text-2xl font-black text-white mb-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-green-600/30 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(22,163,74,0.08)' }}>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Ready to Build?</h3>
          <p className="text-sm text-gray-400">Your BAC agents are standing by. Start with a business plan, a grant search, or a credit review — wherever you are in your journey.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 transition-all hover:brightness-110 border"
          style={{ background: 'rgba(22,163,74,0.2)', borderColor: 'rgba(22,163,74,0.4)', color: '#4ADE80' }}>
          <FiZap size={15} /> Talk to Business Coach
        </button>
      </div>

      <EcosystemStrip currentAppId="bac" />

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="bac"
          system={BAC_SYSTEM}
          minTier={BAC_SYSTEM?.minTier || 'standard'}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

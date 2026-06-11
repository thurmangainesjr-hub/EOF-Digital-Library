import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiArrowRight, FiAward, FiUsers, FiBook, FiZap } from 'react-icons/fi';
import { SCHOOLS, CHANCELLOR, ECOSYSTEM_FLOW } from '../data/universityData';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';

const UNIVERSITY_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'university');

// ── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(37,99,235,0.15)' }}>
        <Icon size={16} style={{ color: '#60A5FA' }} />
      </div>
      <div>
        <p className="text-lg font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── School card ──────────────────────────────────────────────────────────────
function SchoolCard({ school, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/university/${school.id}`}
        className={`group block rounded-2xl bg-gradient-to-br ${school.gradient} border ${school.border} p-5 hover:scale-[1.02] transition-transform duration-200`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{school.icon}</div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
            {school.professors.length} Professors
          </span>
        </div>
        <h3 className="font-serif text-lg text-white font-bold leading-tight mb-1">
          {school.shortName === 'Creator Academy' ? 'EOF Creator Academy' : school.shortName}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {school.mission}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {school.professors.slice(0, 2).map(p => (
            <span key={p.id} className="text-xs bg-black/30 rounded-full px-2.5 py-1 text-gray-300 border border-white/10">
              {p.name.replace('Professor ', 'Prof. ')}
            </span>
          ))}
          {school.professors.length > 2 && (
            <span className="text-xs text-gray-500">+{school.professors.length - 2} more</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-4 text-xs font-medium group-hover:gap-2.5 transition-all"
          style={{ color: school.accent }}>
          Explore School <FiChevronRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Ecosystem flow ───────────────────────────────────────────────────────────
function EcosystemFlow() {
  return (
    <div className="rounded-2xl bg-white/3 border border-white/10 p-6">
      <h2 className="font-serif text-xl text-white font-bold mb-1">Official Ecosystem Flow</h2>
      <p className="text-sm text-gray-400 mb-6">Your complete journey from student to legacy builder</p>
      <div className="flex flex-wrap items-center gap-3">
        {ECOSYSTEM_FLOW.map((item, i) => (
          <React.Fragment key={item.step}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 min-w-[80px]"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors cursor-default"
                style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,99,235,0.1)'}>
                {item.icon}
              </div>
              <p className="text-xs font-bold" style={{ color: '#60A5FA' }}>{item.step}</p>
              <p className="text-[10px] text-gray-500 text-center leading-tight">{item.desc}</p>
            </motion.div>
            {i < ECOSYSTEM_FLOW.length - 1 && (
              <FiArrowRight size={16} className="text-blue-500/40 flex-shrink-0 mb-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Chancellor card ──────────────────────────────────────────────────────────
function ChancellorCard() {
  return (
    <Link to="/university/chancellor" className="group block rounded-2xl p-5 transition-all"
      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(99,102,241,0.08))', border: '1px solid rgba(59,130,246,0.3)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.35)' }}>
          🏛️
        </div>
        <div>
          <h3 className="font-serif text-base text-white font-bold">Chancellor AI</h3>
          <p className="text-xs" style={{ color: '#60A5FA' }}>Supreme Academic Intelligence</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
        {CHANCELLOR.bio}
      </p>
      <div className="flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all" style={{ color: '#60A5FA' }}>
        Consult Chancellor <FiChevronRight size={14} />
      </div>
    </Link>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeSchool, onSelect }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-2">
      <ChancellorCard />

      <div className="rounded-2xl bg-white/3 border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">Schools</p>
        </div>
        <nav className="py-2">
          {SCHOOLS.map(school => (
            <Link
              key={school.id}
              to={`/university/${school.id}`}
              onClick={() => onSelect(school.id)}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all text-sm ${
                activeSchool === school.id
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base w-6 text-center flex-shrink-0">{school.icon}</span>
              <span className="font-medium truncate">{school.shortName}</span>
              {activeSchool === school.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function University() {
  const [activeSchool, setActiveSchool] = useState(null);
  const [openAgent, setOpenAgent] = useState(null);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-blue-400">DIY University</span>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/20 via-blue-800/10 to-transparent border border-blue-600/20 px-6 py-8 md:py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/8 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4"
              style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA' }}>
              <span>🎓</span> The Greatest Collection of Digital Professors
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
              DIY University
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              Learn from AI professors modeled after history's greatest minds. Each professor teaches,
              mentors, coaches, critiques, and helps you create real work — powered by a Metacognition Engine.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/university/chancellor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: '#2563EB' }}>
                <span>🏛️</span> Meet Chancellor AI
              </Link>
              <Link to="/university/writing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: '#1D4ED8' }}>
                Browse Schools <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <Stat icon={FiBook} value="8" label="Flagship Schools" />
        <Stat icon={FiUsers} value="24+" label="AI Professors" />
        <Stat icon={FiAward} value="24" label="Capstone Projects" />
        <Stat icon={FiZap} value="5" label="Agent Systems" />
      </motion.div>

      {/* ── University AI Team ───────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold mb-1">Meet the University Team</h2>
            <p className="text-sm text-gray-500">Five permanent agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">{UNIVERSITY_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {UNIVERSITY_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="university"
              system={UNIVERSITY_SYSTEM}
              minTier={UNIVERSITY_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {UNIVERSITY_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* Desktop layout: sidebar + content */}
      <div className="flex gap-6">
        <Sidebar activeSchool={activeSchool} onSelect={setActiveSchool} />

        <div className="flex-1 min-w-0 space-y-8">
          {/* Schools grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-white font-bold">Choose Your School</h2>
              <span className="text-sm text-gray-500">{SCHOOLS.length} schools</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {SCHOOLS.map((school, i) => (
                <SchoolCard key={school.id} school={school} index={i} />
              ))}
            </div>
          </section>

          {/* Ecosystem flow */}
          <EcosystemFlow />

          {/* Professor framework callout */}
          <div className="rounded-2xl bg-gradient-to-r from-eof-purple/15 to-transparent border border-eof-purple/25 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="font-serif text-xl text-white font-bold mb-2">Professor Agent Framework</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Every professor contains five core systems: <span className="text-white">Teaching Engine</span>, <span className="text-white">Coaching Engine</span>, <span className="text-white">Critique Engine</span>, <span className="text-white">Creation Engine</span>, and a <span className="text-blue-400">Metacognition Engine</span> — giving each professor the ability to think about thinking and continuously improve its recommendations for you.
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {['Teaching', 'Coaching', 'Critique', 'Creation', 'Metacognition'].map((engine, i) => (
                  <div key={engine} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                    engine === 'Metacognition'
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 font-medium'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}>
                    <span>{['📖', '🎯', '🔍', '🛠️', '🧠'][i]}</span>
                    {engine} Engine
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="university"
          system={UNIVERSITY_SYSTEM}
          minTier={UNIVERSITY_SYSTEM?.minTier || 'standard'}
          onClose={() => setOpenAgent(null)}
        />
      )}
    </div>
  );
}

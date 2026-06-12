import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiArrowRight, FiAward, FiPlay, FiUsers } from 'react-icons/fi';
import EcosystemStrip from '../components/EcosystemStrip';
import { SCHOOLS } from '../data/universityData';

const TRACKS = [
  { id: 'film',     icon: '🎬', label: 'Film & Series',   desc: 'Produce original films, series, and documentaries for EOF Streaming.', output: 'EOF Streaming' },
  { id: 'radio',    icon: '📻', label: 'Radio & Podcast', desc: 'Host your own show on EOF Radio or launch a podcast series.', output: 'EOF Radio' },
  { id: 'writing',  icon: '✍️', label: 'Books & Writing', desc: 'Write, publish, and distribute books through the EOF Library.', output: 'EOF Library' },
  { id: 'music',    icon: '🎵', label: 'Music & Audio',   desc: 'Release music, EPs, and audio projects on the EOF platform.', output: 'EOF Streaming' },
  { id: 'design',   icon: '🎨', label: 'Design & Brand',  desc: 'Create visual identities, assets, and campaigns for real clients.', output: 'EOF Library' },
  { id: 'tech',     icon: '💻', label: 'Tech & AI',       desc: 'Build apps, AI tools, and automation systems on the EOF stack.', output: 'EOF Platform' },
];

const FEATURED_PROJECTS = [
  { title: 'The Griot Chronicles', creator: 'Marcus J. Freeman', type: 'Web Series', icon: '🎭', status: 'Live on Streaming', badge: 'streaming' },
  { title: 'Build the Empire Podcast', creator: 'Amara Kente', type: 'Podcast', icon: '🎙️', status: 'Live on Radio', badge: 'radio' },
  { title: 'Afrofuture Rising', creator: 'Zara Osei', type: 'Short Film', icon: '🚀', status: 'Live on Streaming', badge: 'streaming' },
  { title: 'Black Excellence Guide', creator: 'Dr. Nia Washington', type: 'Book', icon: '📚', status: 'In the Library', badge: 'library' },
  { title: 'EOF Culture App', creator: 'Kofi Mensah', type: 'Mobile App', icon: '📱', status: 'Deployed', badge: 'tech' },
  { title: 'Legacy Soundscapes', creator: 'Aisha Diallo', type: 'EP', icon: '🎵', status: 'Live on Streaming', badge: 'streaming' },
];

const BADGE_COLORS = {
  streaming: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/25' },
  radio:     { bg: 'bg-cyan-500/15',   text: 'text-cyan-300',   border: 'border-cyan-500/25' },
  library:   { bg: 'bg-amber-500/15',  text: 'text-amber-300',  border: 'border-amber-500/25' },
  tech:      { bg: 'bg-green-500/15',  text: 'text-green-300',  border: 'border-green-500/25' },
};

const PROCESS_STEPS = [
  { num: '01', label: 'Enroll',   desc: 'Choose a track at DIY University and start learning with your professor.',     icon: '🎓', link: '/university' },
  { num: '02', label: 'Learn',    desc: 'Complete courses, workshops, and coaching sessions with AI professors.',        icon: '📚', link: '/university' },
  { num: '03', label: 'Build',    desc: 'Work with professors in the Creation Engine to produce your capstone project.', icon: '🔨', link: null },
  { num: '04', label: 'Publish',  desc: 'Submit your work for distribution on EOF Streaming, Radio, or Library.',       icon: '🚀', link: null },
  { num: '05', label: 'Earn',     desc: 'Monetize your work. Build your audience. Get paid for your creations.',        icon: '💰', link: null },
  { num: '06', label: 'Legacy',   desc: 'Your body of work lives permanently in the EOF ecosystem.',                    icon: '🏛️', link: '/ecosystem' },
];

export default function CreatorAcademyHub() {
  const [activeTrack, setActiveTrack] = useState('film');
  const track = TRACKS.find(t => t.id === activeTrack);

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/ecosystem" className="hover:text-eof-gold transition-colors">Ecosystem</Link>
        <FiChevronRight size={12} />
        <span style={{ color: '#C0392B' }}>Creator Academy</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-red-600/30 px-6 py-10 md:py-14 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(192,57,43,0.15) 0%, rgba(146,43,33,0.1) 50%, rgba(13,13,13,0.95) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(192,57,43,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-red-300 mb-4 border"
            style={{ background: 'rgba(192,57,43,0.12)', borderColor: 'rgba(192,57,43,0.3)' }}>
            <span>🌟</span> The Real-World Laboratory of DIY University
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-3">
            EOF Creator Academy
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Where learning becomes creation. Students apply everything they've learned at DIY University to produce real content — films, books, radio shows, music, apps — and distribute it across the EOF ecosystem.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/university" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border hover:brightness-110"
              style={{ background: 'rgba(192,57,43,0.2)', borderColor: 'rgba(192,57,43,0.4)', color: '#FC8181' }}>
              <span>🎓</span> Start at DIY University
            </Link>
            <a href="#tracks" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-white text-sm transition-colors">
              See Tracks <FiArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-8 right-6 hidden md:flex flex-col gap-3 items-end">
          {[['6', 'Tracks'], ['24+', 'Professors'], ['100+', 'Projects Live']].map(([v, l]) => (
            <div key={l} className="text-right">
              <p className="text-xl font-bold text-white leading-none">{v}</p>
              <p className="text-[10px] text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tracks */}
      <section id="tracks" className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Choose Your Track</h2>
        <p className="text-sm text-gray-500 mb-6">Each track connects directly to a DIY University school and a distribution channel</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {TRACKS.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActiveTrack(t.id)}
              className={`flex flex-col gap-2.5 p-4 rounded-2xl border text-left transition-all ${
                activeTrack === t.id
                  ? 'border-red-500/50 bg-red-900/20'
                  : 'border-white/10 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <p className={`text-sm font-bold ${activeTrack === t.id ? 'text-red-300' : 'text-white'}`}>{t.label}</p>
            </motion.button>
          ))}
        </div>
        {track && (
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/25 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: 'rgba(192,57,43,0.08)' }}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-2xl mr-2">{track.icon}</span>
                <strong className="text-white">{track.label}:</strong> {track.desc}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500">Distributes to</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">{track.output}</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* Process */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-6">The Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/10 bg-white/3 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="text-xs font-mono text-gray-600">{step.num}</p>
                  <p className="text-base font-bold text-white leading-none">{step.label}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">{step.desc}</p>
              {step.link && (
                <Link to={step.link} className="text-xs text-red-400 hover:underline flex items-center gap-1">
                  Go <FiArrowRight size={11} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured student projects */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Student Projects</h2>
          <span className="text-xs text-gray-500">Published on EOF</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_PROJECTS.map((p, i) => {
            const bc = BADGE_COLORS[p.badge] || BADGE_COLORS.library;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/3 p-4 hover:border-red-500/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.25)' }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.creator}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{p.type}</p>
                  </div>
                </div>
                <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full border font-medium ${bc.bg} ${bc.text} ${bc.border}`}>
                  {p.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* University professors CTA */}
      <div className="rounded-2xl border border-red-600/25 p-6 flex flex-col md:flex-row md:items-center gap-4 mb-4"
        style={{ background: 'rgba(192,57,43,0.06)' }}>
        <div className="flex-shrink-0 flex gap-1">
          {SCHOOLS.slice(0, 4).map(s => (
            <div key={s.id} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-lg">
              {s.icon}
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">24+ Professors Are Waiting for You</h3>
          <p className="text-sm text-gray-400">Every DIY University professor feeds directly into Creator Academy. Start learning to start creating.</p>
        </div>
        <Link to="/university" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm flex-shrink-0 border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors">
          <FiAward size={14} /> DIY University <FiArrowRight size={13} />
        </Link>
      </div>

      <EcosystemStrip currentAppId="creator-academy" />
    </div>
  );
}

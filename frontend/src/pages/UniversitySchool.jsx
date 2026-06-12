import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiAward, FiMessageSquare } from 'react-icons/fi';
import { SCHOOLS, CHANCELLOR } from '../data/universityData';

// ── Professor card ───────────────────────────────────────────────────────────
function ProfessorCard({ prof, school, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl bg-gradient-to-br ${school.gradient} border ${school.border} p-5 flex flex-col gap-4`}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border"
          style={{ background: `${school.accent}15`, borderColor: `${school.accent}30` }}
        >
          {prof.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-white font-bold leading-tight">{prof.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: school.accent }}>{prof.title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{prof.bio}</p>
      <div className="flex flex-wrap gap-1.5">
        {prof.specialty.map(s => (
          <span key={s} className="text-xs bg-black/30 rounded-full px-2.5 py-1 text-gray-300 border border-white/10">
            {s}
          </span>
        ))}
      </div>
      <Link
        to={`/university/${school.id}/${prof.id}`}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:brightness-110"
        style={{ background: '#2563EB' }}
      >
        <FiMessageSquare size={15} />
        Start Session with {prof.name.replace('Professor ', 'Prof. ')}
      </Link>
    </motion.div>
  );
}

// ── Chancellor school page ────────────────────────────────────────────────────
function ChancellorPage() {
  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <Link to="/university" className="hover:text-eof-gold transition-colors">University</Link>
          <FiChevronRight size={12} />
          <span className="text-eof-gold">Chancellor AI</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-eof-gold/15 to-eof-purple/10 border border-eof-gold/30 p-8 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-eof-gold/20 flex items-center justify-center text-5xl border border-eof-gold/30">
              🏛️
            </div>
            <div>
              <h1 className="font-serif text-3xl text-white font-bold">Chancellor AI</h1>
              <p className="text-eof-gold text-sm mt-1">Supreme Academic Intelligence — DIY University</p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-base mb-6">{CHANCELLOR.bio}</p>
          <Link
            to="/university/chancellor/chat"
            className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3"
          >
            <FiMessageSquare size={15} />
            Consult Chancellor AI
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHANCELLOR.responsibilities.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
            >
              <span className="text-eof-gold text-base">✓</span>
              <span className="text-sm text-gray-300">{r}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── School page ──────────────────────────────────────────────────────────────
export default function UniversitySchool() {
  const { schoolId } = useParams();

  if (schoolId === 'chancellor') return <ChancellorPage />;

  const school = SCHOOLS.find(s => s.id === schoolId);
  if (!school) {
    return (
      <div className="min-h-screen bg-eof-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white font-serif text-2xl mb-2">School Not Found</p>
          <Link to="/university" className="text-eof-gold text-sm hover:underline">← Back to University</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <Link to="/university" className="hover:text-eof-gold transition-colors">University</Link>
          <FiChevronRight size={12} />
          <span style={{ color: school.accent }}>{school.shortName}</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-gradient-to-br ${school.gradient} border ${school.border} p-6 md:p-8 mb-8`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{school.icon}</div>
            <div className="flex-1">
              <h1 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">
                {school.name}
              </h1>
              <p className="text-sm mt-2 text-gray-300 leading-relaxed">{school.mission}</p>
            </div>
          </div>

          {/* Capstones */}
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: school.accent }}>
              Capstone Projects
            </p>
            <div className="flex flex-wrap gap-2">
              {school.capstones.map(c => (
                <div key={c} className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5 border border-white/10">
                  <FiAward size={12} style={{ color: school.accent }} />
                  <span className="text-xs text-gray-300">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Professors */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-white font-bold">Faculty</h2>
            <span className="text-xs text-gray-500">{school.professors.length} Professors</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {school.professors.map((prof, i) => (
              <ProfessorCard key={prof.id} prof={prof} school={school} index={i} />
            ))}
          </div>
        </section>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <Link to="/university" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            ← All Schools
          </Link>
          <div className="flex gap-3">
            {SCHOOLS.filter(s => s.id !== schoolId).slice(0, 2).map(s => (
              <Link
                key={s.id}
                to={`/university/${s.id}`}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {s.icon} {s.shortName} <FiChevronRight size={11} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

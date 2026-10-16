import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { SCHOOLS, CHANCELLOR } from '../../data/universityData';

// ── Compact school row ───────────────────────────────────────────────────────
function SchoolRow({ school }) {
  return (
    <Link
      to={`/university/${school.id}`}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <span className="text-base w-6 text-center flex-shrink-0">{school.icon}</span>
      <span className="text-xs text-gray-300 group-hover:text-white transition-colors flex-1 truncate font-medium">
        {school.shortName}
      </span>
      <FiChevronRight size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

// ── Floating trigger button ──────────────────────────────────────────────────
function WidgetTrigger({ onClick, pulse }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-eof-gold to-eof-gold/70 shadow-gold-md flex items-center justify-center text-eof-dark font-serif text-2xl font-bold border border-eof-gold/50"
    >
      🎓
      {pulse && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-eof-crimson border-2 border-eof-dark flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">!</span>
        </span>
      )}
    </motion.button>
  );
}

// ── Expanded widget panel ────────────────────────────────────────────────────
function WidgetPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('schools');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: '#111111' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-eof-gold/15 to-eof-purple/10 border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-eof-gold/20 flex items-center justify-center text-lg border border-eof-gold/30 flex-shrink-0">
          🎓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-none">DIY University</p>
          <p className="text-[10px] text-eof-gold mt-0.5">8 Schools · 24+ Professors</p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to="/university"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Open full view"
          >
            <FiMaximize2 size={13} />
          </Link>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'schools', label: 'Schools' },
          { id: 'chancellor', label: 'Chancellor' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-eof-gold border-b-2 border-eof-gold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-2">
        <AnimatePresence mode="wait">
          {activeTab === 'schools' && (
            <motion.div
              key="schools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-h-72 overflow-y-auto space-y-0.5">
                {SCHOOLS.map(school => (
                  <SchoolRow key={school.id} school={school} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chancellor' && (
            <motion.div
              key="chancellor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-2"
            >
              <div className="rounded-xl bg-gradient-to-br from-eof-gold/10 to-eof-purple/5 border border-eof-gold/20 p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🏛️</div>
                  <div>
                    <p className="text-sm font-bold text-white">Chancellor AI</p>
                    <p className="text-[10px] text-eof-gold">Supreme Academic Intelligence</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {CHANCELLOR.bio}
                </p>
              </div>
              <div className="space-y-1.5 mb-3">
                {CHANCELLOR.responsibilities.slice(0, 3).map(r => (
                  <div key={r} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-eof-gold text-xs">✓</span>
                    {r}
                  </div>
                ))}
              </div>
              <Link
                to="/university/chancellor/chat"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-eof-gold/15 border border-eof-gold/30 text-eof-gold text-xs font-medium hover:bg-eof-gold/25 transition-colors"
              >
                Consult Chancellor AI
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-600">Learn → Create → Publish → Earn</p>
        <Link
          to="/university"
          onClick={onClose}
          className="text-[10px] text-eof-gold hover:underline font-medium"
        >
          Open University →
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main widget export ───────────────────────────────────────────────────────
export default function UniversityWidget({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && <WidgetPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
      <WidgetTrigger onClick={() => setOpen(o => !o)} pulse={!open} />
    </div>
  );
}

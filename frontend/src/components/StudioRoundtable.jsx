import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiStar, FiUsers } from 'react-icons/fi';
import { ROUNDTABLE_TEMPLATES } from '../data/agentData';

function scoreColor(score) {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#D4AF37';
  if (score >= 70) return '#F97316';
  return '#EF4444';
}

function scoreLabel(score) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Solid';
  return 'Needs Work';
}

export default function StudioRoundtable({
  template = 'music',
  projectName = 'Current Project',
  onClose,
}) {
  const rt = ROUNDTABLE_TEMPLATES[template] || ROUNDTABLE_TEMPLATES.music;
  const overall = Math.round(rt.dimensions.reduce((s, d) => s + d.score, 0) / rt.dimensions.length);
  const [decided, setDecided] = useState(false);
  const [decision, setDecision] = useState(null);
  const [visibleRecs, setVisibleRecs] = useState(rt.recommendations.map((_, i) => i));

  function dismissRec(i) {
    setVisibleRecs(p => p.filter(r => r !== i));
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.25)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-white/8 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(13,13,13,0.98))' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <FiX size={14} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <FiUsers size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
              Studio Roundtable
            </span>
          </div>
          <h2 className="font-serif text-xl text-white font-bold leading-tight">{rt.label}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{projectName}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Score dimensions */}
          <div className="space-y-2.5">
            {rt.dimensions.map((dim, i) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09 }}
                className="rounded-xl border p-3.5"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${scoreColor(dim.score)}20` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{dim.label}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">reviewed by {dim.agentTitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold font-serif leading-none" style={{ color: scoreColor(dim.score) }}>
                      {dim.score}
                    </p>
                    <p className="text-[9px] font-semibold mt-0.5" style={{ color: scoreColor(dim.score) }}>
                      {scoreLabel(dim.score)}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/8 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ delay: i * 0.09 + 0.25, duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${scoreColor(dim.score)}aa, ${scoreColor(dim.score)})` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 italic leading-snug">{dim.notes}</p>
              </motion.div>
            ))}
          </div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border p-5 text-center"
            style={{
              background: `${scoreColor(overall)}08`,
              borderColor: `${scoreColor(overall)}35`,
              boxShadow: `0 0 40px ${scoreColor(overall)}12`,
            }}
          >
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-500 mb-2">Overall Score</p>
            <div className="flex items-end justify-center gap-1">
              <p className="text-5xl font-bold font-serif leading-none" style={{ color: scoreColor(overall) }}>
                {overall}
              </p>
              <p className="text-xl font-serif text-gray-600 mb-1">/100</p>
            </div>
            <p className="text-xs font-semibold mt-1.5" style={{ color: scoreColor(overall) }}>
              {scoreLabel(overall)}
            </p>
          </motion.div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-600 mb-2">
              Recommendations
            </p>
            <div className="space-y-1.5">
              <AnimatePresence>
                {visibleRecs.map(i => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-lg border border-white/8 bg-white/2"
                  >
                    <span className="text-amber-400 flex-shrink-0 mt-0.5 text-xs">•</span>
                    <span className="flex-1 text-[10px] text-gray-400 leading-snug">{rt.recommendations[i]}</span>
                    <button
                      onClick={() => dismissRec(i)}
                      className="text-gray-700 hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors"
                    >
                      <FiX size={10} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {visibleRecs.length === 0 && (
                <p className="text-[10px] text-gray-600 italic px-1">All recommendations addressed.</p>
              )}
            </div>
          </motion.div>

          {/* Decision */}
          {!decided ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3"
            >
              <button
                onClick={() => { setDecision('approved'); setDecided(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all hover:brightness-110"
                style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.35)', color: '#10B981' }}
              >
                <FiCheck size={14} /> Approve Changes
              </button>
              <button
                onClick={() => { setDecision('declined'); setDecided(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all hover:brightness-110"
                style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.28)', color: '#EF4444' }}
              >
                <FiX size={14} /> Keep Original
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 rounded-xl border"
              style={decision === 'approved'
                ? { background: 'rgba(16,185,129,0.1)',  borderColor: 'rgba(16,185,129,0.3)' }
                : { background: 'rgba(239,68,68,0.08)',  borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <p className="text-sm font-bold leading-snug"
                style={{ color: decision === 'approved' ? '#10B981' : '#EF4444' }}>
                {decision === 'approved'
                  ? '✓ Recommendations approved — agents will begin revisions'
                  : '✕ Original preserved — no changes applied'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

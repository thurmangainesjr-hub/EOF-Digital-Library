import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiDownload, FiRefreshCw, FiCheck, FiStar, FiArrowRight } from 'react-icons/fi';
import { THUMBNAIL_TYPES } from '../data/formatSystem';

const ACCENT  = '#10B981';
const A_SOFT  = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const THUMB_CONCEPTS = [
  {
    id: 'concept_a',
    label: 'The Question',
    layout: 'Split — bold question left, face right',
    textLine1: 'WHEN DID',
    textLine2: 'HIP-HOP BECOME',
    textLine3: 'YOUR FIRST LOVE?',
    textColor: '#FFFFFF',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    accent: '#D4AF37',
    mood: 'Dramatic · High contrast',
    ctr: 'High',
    emoji: '❤️',
  },
  {
    id: 'concept_b',
    label: 'The Statement',
    layout: 'Centered — bold claim over cinematic still',
    textLine1: 'HIP-HOP\'S',
    textLine2: 'UNTOLD ORIGIN',
    textLine3: 'STORY',
    textColor: '#FFFFFF',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #0a1a0a 100%)',
    accent: '#10B981',
    mood: 'Cinematic · Documentary',
    ctr: 'Medium-High',
    emoji: '🎤',
  },
  {
    id: 'concept_c',
    label: 'The Number',
    layout: 'Left-aligned — number + context text',
    textLine1: '50 YEARS',
    textLine2: 'ONE QUESTION',
    textLine3: 'CHANGED EVERYTHING',
    textColor: '#F59E0B',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a1a 100%)',
    accent: '#F59E0B',
    mood: 'Bold · Punchy',
    ctr: 'Highest',
    emoji: '🔥',
  },
];

function ThumbnailPreview({ concept, typeId, active, onClick }) {
  const type = THUMBNAIL_TYPES.find(t => t.id === typeId) || THUMBNAIL_TYPES[0];
  const isVertical = type.h > type.w;

  // Normalized preview dimensions
  const maxW = isVertical ? 80 : 160;
  const maxH = isVertical ? 142 : 90;
  const scale = isVertical ? maxH / type.h : maxW / type.w;
  const pw = Math.round(type.w * scale);
  const ph = Math.round(type.h * scale);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative rounded-xl overflow-hidden border-2 transition-all flex-shrink-0"
      style={{
        width: pw, height: ph,
        borderColor: active ? ACCENT : 'rgba(255,255,255,0.10)',
        background: concept.bg,
      }}>

      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: concept.accent }} />

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <div className="text-[6px] font-black leading-tight" style={{ color: concept.textColor }}>
          {concept.textLine1}
        </div>
        <div className="text-[7px] font-black leading-tight mt-0.5" style={{ color: concept.accent }}>
          {concept.textLine2}
        </div>
        {!isVertical && (
          <div className="text-[5px] font-bold leading-tight mt-0.5 text-gray-400">
            {concept.textLine3}
          </div>
        )}
        <div className="text-[10px] mt-1">{concept.emoji}</div>
      </div>

      {/* Active indicator */}
      {active && (
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ background: ACCENT }}>
          <FiCheck size={6} color="#000" />
        </div>
      )}
    </motion.button>
  );
}

function ConceptCard({ concept, selected, onSelect }) {
  return (
    <motion.div
      layout
      className="p-4 rounded-2xl border cursor-pointer transition-all"
      onClick={onSelect}
      style={selected
        ? { background: A_SOFT, borderColor: A_BORDER }
        : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>

      <div className="flex items-start gap-4">
        {/* YouTube preview */}
        <ThumbnailPreview concept={concept} typeId="youtube" active={selected} onClick={() => {}} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-white">{concept.label}</p>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: concept.ctr === 'Highest' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                color: concept.ctr === 'Highest' ? '#10B981' : '#6B7280',
              }}>
              CTR: {concept.ctr}
            </span>
          </div>
          <p className="text-[10px] text-gray-600 leading-snug mb-2">{concept.layout}</p>
          <p className="text-[9px] text-gray-700">{concept.mood}</p>

          {/* Text lines preview */}
          <div className="mt-2 space-y-0.5">
            {[concept.textLine1, concept.textLine2, concept.textLine3].map((line, i) => (
              <p key={i} className="text-[9px] font-black leading-tight truncate"
                style={{ color: i === 1 ? concept.accent : concept.textColor, opacity: i === 2 ? 0.6 : 1 }}>
                {line}
              </p>
            ))}
          </div>

          {selected && (
            <div className="flex items-center gap-1 mt-2 text-[9px]" style={{ color: ACCENT }}>
              <FiCheck size={9}/> Selected
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ThumbnailStudio({ script, format, onContinue }) {
  const [selectedConcept, setSelectedConcept] = useState('concept_a');
  const [activeType, setActiveType] = useState('youtube');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [customText, setCustomText] = useState({ line1: '', line2: '', line3: '' });
  const [showCustom, setShowCustom] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  }

  const concept = THUMB_CONCEPTS.find(c => c.id === selectedConcept) || THUMB_CONCEPTS[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Thumbnail Studio</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">
            AI analyzes your script and video to suggest thumbnail concepts
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: ACCENT, color: '#000' }}>
          {generating ? <><FiRefreshCw size={10} className="animate-spin"/> Analyzing…</> : <><FiZap size={10}/> Generate Concepts</>}
        </button>
      </div>

      {/* Platform tabs */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Preview Format</p>
        <div className="flex gap-1.5 flex-wrap">
          {THUMBNAIL_TYPES.map(t => (
            <button key={t.id} onClick={() => setActiveType(t.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold border transition-all"
              style={activeType === t.id
                ? { background: A_SOFT, borderColor: A_BORDER, color: '#6EE7B7' }
                : { borderColor: 'rgba(255,255,255,0.10)', color: '#6B7280' }}>
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected concept multi-format preview */}
      {concept && (
        <div className="p-4 rounded-2xl border border-white/8 bg-white/2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3">
            All Sizes — {concept.label}
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            {THUMBNAIL_TYPES.map(t => (
              <div key={t.id} className="text-center">
                <ThumbnailPreview concept={concept} typeId={t.id} active={false} onClick={() => {}} />
                <p className="text-[7px] text-gray-700 mt-1">{t.name}</p>
                <p className="text-[7px] text-gray-700 font-mono">{t.w}×{t.h}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concept grid */}
      <div className="space-y-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">AI Concepts</p>
        {THUMB_CONCEPTS.map(c => (
          <ConceptCard
            key={c.id}
            concept={c}
            selected={selectedConcept === c.id}
            onSelect={() => setSelectedConcept(c.id)}
          />
        ))}
      </div>

      {/* Custom text */}
      <div>
        <button
          onClick={() => setShowCustom(p => !p)}
          className="text-[10px] font-semibold text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
          ✏️ Edit thumbnail text manually
        </button>
        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3 space-y-2">
              {['line1', 'line2', 'line3'].map((key, i) => (
                <div key={key}>
                  <label className="text-[8px] text-gray-700 font-bold uppercase tracking-widest block mb-1">
                    Line {i + 1}
                  </label>
                  <input
                    value={customText[key]}
                    onChange={e => setCustomText(d => ({ ...d, [key]: e.target.value }))}
                    placeholder={[concept.textLine1, concept.textLine2, concept.textLine3][i]}
                    className="w-full text-sm font-black text-white bg-white/4 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-emerald-500/40"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export row */}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-all">
          <FiDownload size={11}/> Export All Sizes
        </button>
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-amber-400 transition-all">
          <FiStar size={11}/> Save to Brand Kit
        </button>
        <button
          onClick={() => onContinue(concept)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          Continue to Export <FiArrowRight size={12}/>
        </button>
      </div>
    </div>
  );
}

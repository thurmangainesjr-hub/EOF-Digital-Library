import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiDownload, FiCheck, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SOCIAL_CONTENT_TYPES, PLATFORM_EXPORTS } from '../data/formatSystem';

const ACCENT   = '#10B981';
const A_SOFT   = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const PLATFORM_COLORS = {
  youtube: '#FF0000', tiktok: '#69C9D0', instagram: '#E1306C',
  facebook: '#1877F2', twitter: '#1DA1F2', linkedin: '#0A66C2',
};

const STATUS_CYCLE = { idle: 'generating', generating: 'ready', ready: 'idle' };

function ContentTypeCard({ type, checked, onToggle, status, onGenerate }) {
  const platformColor = PLATFORM_COLORS[type.platform] || ACCENT;
  const isGenerating = status === 'generating';
  const isReady      = status === 'ready';

  return (
    <motion.div
      layout
      className="p-3 rounded-xl border transition-all"
      style={checked
        ? { background: A_SOFT, borderColor: A_BORDER }
        : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>

      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
          style={checked
            ? { background: ACCENT, borderColor: ACCENT }
            : { borderColor: 'rgba(255,255,255,0.20)' }}>
          {checked && <FiCheck size={10} color="#000" strokeWidth={3} />}
        </button>

        {/* Icon */}
        <span className="text-base">{type.icon}</span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white leading-tight">{type.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: `${platformColor}18`, color: platformColor }}>
              {type.platform}
            </span>
            {type.auto && (
              <span className="text-[8px] text-gray-700">auto</span>
            )}
          </div>
        </div>

        {/* Status / Generate */}
        {checked && (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition-all hover:brightness-110 disabled:opacity-50"
            style={isReady
              ? { background: 'rgba(16,185,129,0.15)', color: ACCENT }
              : { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}>
            {isGenerating
              ? <><FiRefreshCw size={8} className="animate-spin"/> …</>
              : isReady
                ? <><FiCheck size={8}/> Ready</>
                : <><FiZap size={8}/> Make</>
            }
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ExportPlatformBadge({ platform }) {
  const p = PLATFORM_EXPORTS.find(x => x.id === platform);
  if (!p) return null;
  return (
    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold border"
      style={{ borderColor: `${p.color}30`, color: p.color, background: `${p.color}10` }}>
      {p.emoji} {p.name}
    </span>
  );
}

export default function SocialEngine({ script, onContinue }) {
  const [selected, setSelected] = useState(() => {
    const defaults = SOCIAL_CONTENT_TYPES.filter(t => t.auto).map(t => t.id);
    return new Set(defaults);
  });
  const [statuses, setStatuses] = useState({});
  const [generatingAll, setGeneratingAll] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function setStatus(id, status) {
    setStatuses(p => ({ ...p, [id]: status }));
  }

  function generateOne(id) {
    setStatus(id, 'generating');
    setTimeout(() => setStatus(id, 'ready'), 1800 + Math.random() * 800);
  }

  function generateAll() {
    setGeneratingAll(true);
    const ids = [...selected];
    ids.forEach((id, i) => {
      setTimeout(() => setStatus(id, 'generating'), i * 120);
      setTimeout(() => setStatus(id, 'ready'), i * 120 + 1800 + Math.random() * 600);
    });
    setTimeout(() => setGeneratingAll(false), ids.length * 120 + 2600);
  }

  const readyCount = [...selected].filter(id => statuses[id] === 'ready').length;
  const selectedArr = SOCIAL_CONTENT_TYPES.filter(t => selected.has(t.id));

  // Unique platforms across selected types
  const platforms = [...new Set(selectedArr.map(t => t.platform))];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Social Content Engine</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">
            1 video → {SOCIAL_CONTENT_TYPES.length} content pieces, auto-generated
          </p>
        </div>
        <button
          onClick={generateAll}
          disabled={generatingAll || selected.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: ACCENT, color: '#000' }}>
          {generatingAll
            ? <><FiRefreshCw size={10} className="animate-spin"/> Generating…</>
            : <><FiZap size={10}/> Generate All ({selected.size})</>
          }
        </button>
      </div>

      {/* Progress bar */}
      {selected.size > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] text-gray-700">
              {readyCount} / {selected.size} ready
            </p>
            <p className="text-[9px]" style={{ color: ACCENT }}>
              {Math.round((readyCount / selected.size) * 100)}%
            </p>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: ACCENT }}
              animate={{ width: `${(readyCount / selected.size) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Select all / none */}
      <div className="flex items-center gap-3">
        <button onClick={() => setSelected(new Set(SOCIAL_CONTENT_TYPES.map(t => t.id)))}
          className="text-[9px] font-semibold text-gray-600 hover:text-gray-300 transition-colors">
          Select all ({SOCIAL_CONTENT_TYPES.length})
        </button>
        <span className="text-gray-800">·</span>
        <button onClick={() => setSelected(new Set())}
          className="text-[9px] font-semibold text-gray-600 hover:text-gray-300 transition-colors">
          Clear
        </button>
        <span className="text-gray-800">·</span>
        <button onClick={() => setSelected(new Set(SOCIAL_CONTENT_TYPES.filter(t => t.auto).map(t => t.id)))}
          className="text-[9px] font-semibold text-gray-600 hover:text-gray-300 transition-colors">
          Auto only
        </button>
      </div>

      {/* Content type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SOCIAL_CONTENT_TYPES.map(type => (
          <ContentTypeCard
            key={type.id}
            type={type}
            checked={selected.has(type.id)}
            onToggle={() => toggle(type.id)}
            status={statuses[type.id] || 'idle'}
            onGenerate={() => generateOne(type.id)}
          />
        ))}
      </div>

      {/* Platform coverage */}
      {platforms.length > 0 && (
        <div>
          <button
            onClick={() => setShowPlatforms(p => !p)}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-300 transition-colors">
            Platform Coverage ({platforms.length})
            {showPlatforms ? <FiChevronUp size={10}/> : <FiChevronDown size={10}/>}
          </button>
          <AnimatePresence>
            {showPlatforms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2">
                <div className="flex gap-1.5 flex-wrap">
                  {platforms.map(p => <ExportPlatformBadge key={p} platform={p === 'tiktok' ? 'tiktok' : p === 'instagram' ? 'ig_reels' : p === 'youtube' ? 'youtube' : p} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Export / Continue row */}
      <div className="flex gap-2 pt-2 border-t border-white/5">
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-40"
          disabled={readyCount === 0}>
          <FiDownload size={11}/> Export {readyCount > 0 ? `(${readyCount})` : 'All Ready'}
        </button>
        <button
          onClick={() => onContinue && onContinue({ selectedTypes: [...selected], statuses })}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          Done — Finish Project
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { FORMATS, getRatioCss } from '../data/formatSystem';

const ACCENT  = '#10B981';
const A_SOFT  = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const FORMAT_GROUPS = [
  {
    label: 'YouTube',
    formats: ['youtube', 'youtube_4k'],
  },
  {
    label: 'Short-Form',
    formats: ['shorts'],
  },
  {
    label: 'Social',
    formats: ['square', 'portrait'],
  },
  {
    label: 'Cinematic',
    formats: ['cinematic_235', 'cinematic_239'],
  },
  {
    label: 'Custom',
    formats: ['custom'],
  },
];

function AspectRatioPreview({ format, active }) {
  const card = getPreviewSize(format);
  return (
    <div
      className="rounded-lg border-2 transition-all flex items-center justify-center relative overflow-hidden"
      style={{
        width: card.w,
        height: card.h,
        borderColor: active ? ACCENT : 'rgba(255,255,255,0.12)',
        background: active ? A_SOFT : 'rgba(255,255,255,0.03)',
        flexShrink: 0,
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '33.33% 33.33%',
        }}
      />
      {/* Center crosshair */}
      <div className="absolute w-3 h-px bg-white/40" />
      <div className="absolute h-3 w-px bg-white/40" />
      {/* Ratio label */}
      <span className="text-[8px] font-black absolute bottom-1 left-0 right-0 text-center"
        style={{ color: active ? ACCENT : '#4B5563' }}>
        {format.ratio || 'custom'}
      </span>
    </div>
  );
}

function getPreviewSize(format) {
  const orientation = format.orientation;
  if (orientation === 'portrait') return { w: 42, h: 60 };
  if (orientation === 'ultrawide') return { w: 90, h: 38 };
  if (orientation === 'square') return { w: 54, h: 54 };
  return { w: 76, h: 44 }; // landscape default
}

function CustomDimensionsForm({ onConfirm }) {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);

  return (
    <div className="mt-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-gray-600 font-bold uppercase tracking-widest block mb-1">Width</label>
          <input type="number" value={w} onChange={e => setW(+e.target.value)} min={100} max={7680}
            className="w-full text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 outline-none focus:border-emerald-500/40" />
        </div>
        <div>
          <label className="text-[9px] text-gray-600 font-bold uppercase tracking-widest block mb-1">Height</label>
          <input type="number" value={h} onChange={e => setH(+e.target.value)} min={100} max={7680}
            className="w-full text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 outline-none focus:border-emerald-500/40" />
        </div>
      </div>
      <p className="text-[9px] text-gray-700">
        Ratio: {w && h ? `${(w/h).toFixed(2)}:1` : '—'} &nbsp;·&nbsp; {w}×{h}px
      </p>
      <button onClick={() => onConfirm({ ...FORMATS.custom, w, h, ratio: `${w}:${h}` })}
        className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        Use {w}×{h}
      </button>
    </div>
  );
}

export default function FormatPicker({ onSelect }) {
  const [selected, setSelected] = useState('youtube');
  const [showCustom, setShowCustom] = useState(false);

  function handleSelect(id) {
    setSelected(id);
    if (id === 'custom') { setShowCustom(true); }
    else { setShowCustom(false); }
  }

  function handleConfirm() {
    if (selected === 'custom') return; // wait for custom form
    onSelect(FORMATS[selected]);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Choose Your Format</h1>
        <p className="text-sm text-gray-500">
          Every image, storyboard, animation, subtitle, and export will automatically
          adapt to the format you choose.
        </p>
      </div>

      <div className="space-y-4">
        {FORMAT_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">
              {group.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.formats.map(id => {
                const fmt = FORMATS[id];
                const active = selected === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => handleSelect(id)}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all"
                    style={active
                      ? { background: A_SOFT, borderColor: A_BORDER }
                      : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <AspectRatioPreview format={fmt} active={active} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">{fmt.icon}</span>
                        <span className="text-xs font-bold text-white">{fmt.name}</span>
                        {active && <FiCheck size={10} style={{ color: ACCENT }} />}
                      </div>
                      <p className="text-[10px] text-gray-600">{fmt.desc}</p>
                      {fmt.w && (
                        <p className="text-[9px] text-gray-700 mt-0.5 font-mono">{fmt.w}×{fmt.h}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showCustom && (
        <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/2">
          <CustomDimensionsForm onConfirm={(fmt) => onSelect(fmt)} />
        </div>
      )}

      {!showCustom && (
        <motion.button
          onClick={handleConfirm}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          Continue with {FORMATS[selected]?.name} <FiChevronRight size={16}/>
        </motion.button>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiCamera, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { CAMERA_ANGLES, getCardDimensions } from '../data/formatSystem';

const ACCENT  = '#10B981';
const A_SOFT  = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const MOOD_COLORS = {
  cinematic:  '#3B82F6',
  dramatic:   '#EF4444',
  uplifting:  '#F59E0B',
  reflective: '#8B5CF6',
  tense:      '#EC4899',
};

// Seed storyboard scenes for My First Love documentary
const SEED_SCENES = [
  {
    id: 1, num: 1, title: 'Opening Hook',
    narration: 'Hip-hop has 50 years of untold stories. This is one of them.',
    cameraAngle: 'wide_est', mood: 'cinematic', duration: 15,
    visualNote: 'Aerial city skyline, golden hour, late 70s New York',
    imagePrompt: 'Cinematic aerial view of 1970s New York City skyline at golden hour, film grain, 16mm aesthetic, moody atmosphere',
    status: 'ready',
  },
  {
    id: 2, num: 2, title: 'The Question',
    narration: 'When did hip-hop become your first love? Every person who answers has a different story.',
    cameraAngle: 'med_int', mood: 'reflective', duration: 20,
    visualNote: 'Street corner in the Bronx, people gathering, authentic',
    imagePrompt: 'Authentic documentary shot of Bronx street corner, diverse group of people, warm lighting, 1980s aesthetic, film grain',
    status: 'ready',
  },
  {
    id: 3, num: 3, title: 'The Era Begins',
    narration: 'It started in the parks. Before the labels, before the tours, before the stadiums.',
    cameraAngle: 'slow_push', mood: 'dramatic', duration: 25,
    visualNote: 'Outdoor block party, turntables, crowds dancing',
    imagePrompt: 'Cinematic shot of outdoor block party in 1970s Bronx, DJ turntables, crowd dancing, dramatic lighting, documentary style',
    status: 'generating',
  },
  {
    id: 4, num: 4, title: 'The Sound',
    narration: 'The breakbeat changed everything. Two turntables and a microphone.',
    cameraAngle: 'arch_zoom', mood: 'uplifting', duration: 22,
    visualNote: 'Close-up of vinyl records, DJ hands, speaker stacks',
    imagePrompt: 'Extreme close-up of vinyl record spinning on turntable, DJ hands, dramatic lighting, high contrast, documentary aesthetic',
    status: 'pending',
  },
  {
    id: 5, num: 5, title: 'The Spread',
    narration: 'From the Bronx to Brooklyn. From the streets to the radio.',
    cameraAngle: 'cutaway', mood: 'cinematic', duration: 18,
    visualNote: 'Map of New York boroughs, radio tower, aerial shots',
    imagePrompt: 'Cinematic montage of New York boroughs at night, radio tower glowing, city lights, atmospheric fog, film grain',
    status: 'pending',
  },
  {
    id: 6, num: 6, title: 'Your First Love',
    narration: 'What was yours? The first song that made you stop and listen?',
    cameraAngle: 'handheld', mood: 'reflective', duration: 20,
    visualNote: 'Candid street interviews, real people, authentic emotion',
    imagePrompt: 'Candid documentary portrait of person listening to music on headphones, emotional expression, urban background, warm light',
    status: 'pending',
  },
  {
    id: 7, num: 7, title: 'The Call to Action',
    narration: 'Tell us your story. Subscribe and share the moment hip-hop became your first love.',
    cameraAngle: 'slow_push', mood: 'uplifting', duration: 15,
    visualNote: 'Subscribe button animation, community graphics',
    imagePrompt: 'Dynamic graphic design with hip-hop inspired typography, emerald green and gold color palette, geometric patterns',
    status: 'pending',
  },
];

function StoryboardFrame({ scene, cardDims, active, onClick }) {
  const statusColors = { ready: '#10B981', generating: '#F59E0B', pending: '#4B5563' };
  const statusLabels = { ready: 'Ready', generating: 'Generating…', pending: 'Pending' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className="flex-shrink-0 cursor-pointer group"
      style={{ width: cardDims.w + 16 }}>

      {/* Scene number */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">
          {String(scene.num).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px bg-white/6" />
        <span className="text-[7px] font-bold px-1 py-0.5 rounded"
          style={{ background: `${statusColors[scene.status]}18`, color: statusColors[scene.status] }}>
          {statusLabels[scene.status]}
        </span>
      </div>

      {/* Format-adaptive frame */}
      <div
        className="rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all group-hover:brightness-110"
        style={{
          width: cardDims.w,
          height: cardDims.h,
          borderColor: active ? ACCENT : 'rgba(255,255,255,0.10)',
          background: active ? A_SOFT :
            scene.status === 'generating'
              ? 'rgba(245,158,11,0.08)'
              : 'rgba(255,255,255,0.03)',
        }}>

        {/* Grid lines for cinematography framing */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '33.33% 33.33%',
        }} />

        {/* Mood color accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: MOOD_COLORS[scene.mood] || ACCENT }} />

        {/* Generating shimmer */}
        {scene.status === 'generating' && (
          <div className="absolute inset-0 animate-pulse"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.08), transparent)' }} />
        )}

        {/* Scene icon */}
        <div className="text-center">
          <div className="text-2xl mb-1 opacity-50">
            {scene.status === 'ready' ? '🎬' : scene.status === 'generating' ? '⏳' : '🖼️'}
          </div>
          {cardDims.h > 80 && (
            <p className="text-[8px] text-gray-700 px-2 leading-tight text-center line-clamp-2">
              {scene.visualNote}
            </p>
          )}
        </div>

        {/* Duration badge */}
        <span className="absolute bottom-1 right-1.5 text-[7px] font-mono text-gray-700">
          {scene.duration}s
        </span>
      </div>

      {/* Title */}
      <p className="text-[9px] font-bold text-gray-400 mt-1.5 truncate">{scene.title}</p>
    </motion.div>
  );
}

function SceneEditor({ scene, format, onUpdate, onClose }) {
  const [data, setData] = useState({ ...scene });
  const angles = CAMERA_ANGLES[format?.cameraMode || 'documentary'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="p-4 rounded-2xl border space-y-4"
      style={{ background: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)' }}>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white">Scene {scene.num} — {scene.title}</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xs">✕ Close</button>
      </div>

      {/* Narration */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-1.5">
          Narration
        </label>
        <textarea
          value={data.narration}
          onChange={e => setData(d => ({ ...d, narration: e.target.value }))}
          rows={3}
          className="w-full text-xs text-gray-300 bg-white/4 border border-white/10 rounded-xl p-3 resize-none outline-none focus:border-emerald-500/40 leading-relaxed"
        />
      </div>

      {/* Visual note */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-1.5">
          Visual Description
        </label>
        <input
          value={data.visualNote}
          onChange={e => setData(d => ({ ...d, visualNote: e.target.value }))}
          className="w-full text-xs text-gray-400 bg-white/4 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-emerald-500/40"
        />
      </div>

      {/* Camera angle */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-2">
          Camera Angle
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {angles.map(angle => (
            <button
              key={angle.id}
              onClick={() => setData(d => ({ ...d, cameraAngle: angle.id }))}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all"
              style={data.cameraAngle === angle.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor: 'rgba(255,255,255,0.08)' }}>
              <span className="text-sm">{angle.icon}</span>
              <span className="text-[8px] font-bold text-gray-400 leading-tight">{angle.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-2">
          Mood
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(MOOD_COLORS).map(([mood, color]) => (
            <button
              key={mood}
              onClick={() => setData(d => ({ ...d, mood }))}
              className="px-2.5 py-1 rounded-lg text-[9px] font-bold capitalize border transition-all"
              style={data.mood === mood
                ? { background: `${color}20`, color, borderColor: `${color}50` }
                : { borderColor: 'rgba(255,255,255,0.10)', color: '#6B7280' }}>
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-1.5">
          Duration: {data.duration}s
        </label>
        <input type="range" min={8} max={60} value={data.duration}
          onChange={e => setData(d => ({ ...d, duration: +e.target.value }))}
          className="w-full accent-emerald-500" />
      </div>

      {/* Image prompt */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-700 block mb-1.5">
          Image Prompt
        </label>
        <textarea
          value={data.imagePrompt}
          onChange={e => setData(d => ({ ...d, imagePrompt: e.target.value }))}
          rows={2}
          className="w-full text-[10px] text-gray-500 bg-white/3 border border-white/8 rounded-xl p-2.5 resize-none outline-none focus:border-emerald-500/40 font-mono leading-relaxed"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUpdate(data)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          Save Scene
        </button>
        <button
          onClick={() => setData(d => ({ ...d, status: 'generating' }))}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-1.5">
          <FiZap size={11}/> Generate Image
        </button>
      </div>
    </motion.div>
  );
}

export default function Storyboard({ format, script, onContinue }) {
  const [scenes, setScenes] = useState(script?.scenes?.length > 0
    ? script.scenes.map((s, i) => ({
        id: i + 1,
        num: i + 1,
        title: `Scene ${i + 1}`,
        narration: s.narration || '',
        cameraAngle: s.cameraAngle || 'wide_est',
        mood: s.mood || 'cinematic',
        duration: s.duration_seconds || 20,
        visualNote: s.visual_description || '',
        imagePrompt: s.image_prompt || '',
        status: 'pending',
      }))
    : SEED_SCENES
  );

  const [activeScene, setActiveScene] = useState(null);
  const [generating, setGenerating] = useState(false);

  const cardDims = getCardDimensions(format);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const readyCount = scenes.filter(s => s.status === 'ready').length;

  const angles = CAMERA_ANGLES[format?.cameraMode || 'documentary'];

  function addScene() {
    const nextNum = scenes.length + 1;
    setScenes(prev => [...prev, {
      id: Date.now(),
      num: nextNum,
      title: `Scene ${nextNum}`,
      narration: '',
      cameraAngle: angles[0]?.id || 'wide_est',
      mood: 'cinematic',
      duration: 20,
      visualNote: '',
      imagePrompt: '',
      status: 'pending',
    }]);
  }

  function removeScene(id) {
    setScenes(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })));
    if (activeScene?.id === id) setActiveScene(null);
  }

  function updateScene(updated) {
    setScenes(prev => prev.map(s => s.id === updated.id ? updated : s));
    setActiveScene(updated);
  }

  function generateAll() {
    setGenerating(true);
    setScenes(prev => prev.map(s => s.status === 'pending' ? { ...s, status: 'generating' } : s));
    // Simulate sequential generation
    let delay = 0;
    scenes.forEach((scene, i) => {
      if (scene.status === 'pending') {
        delay += 800;
        setTimeout(() => {
          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'ready' } : s));
        }, delay);
      }
    });
    setTimeout(() => setGenerating(false), delay + 200);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">AI Storyboard</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">
            {scenes.length} scenes · {Math.round(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')} total ·{' '}
            <span style={{ color: ACCENT }}>{format?.name || 'YouTube'}</span> format
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[9px] font-bold px-2 py-1 rounded-full border"
            style={{ background: A_SOFT, borderColor: A_BORDER, color: '#6EE7B7' }}>
            {format?.ratio} · {format?.w}×{format?.h}
          </div>
          <button
            onClick={generateAll}
            disabled={generating || readyCount === scenes.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: ACCENT, color: '#000' }}>
            {generating ? <><FiRefreshCw size={10} className="animate-spin"/> Generating…</> : <><FiZap size={10}/> Generate All Images</>}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-[9px] text-gray-600 mb-1">
          <span>{readyCount}/{scenes.length} images ready</span>
          <span>{Math.round((readyCount / scenes.length) * 100)}%</span>
        </div>
        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: ACCENT }}
            animate={{ width: `${(readyCount / scenes.length) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Format info banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/2">
        <div className="text-lg">{format?.icon || '▶️'}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-0.5">Camera Style for {format?.name}</p>
          <div className="flex gap-1.5 flex-wrap">
            {(angles || []).slice(0, 4).map(a => (
              <span key={a.id} className="text-[8px] px-1.5 py-0.5 rounded border border-white/8 text-gray-600">
                {a.icon} {a.name}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[9px] font-bold text-gray-500">{format?.orientation}</p>
          <p className="text-[8px] text-gray-700">{format?.ratio}</p>
        </div>
      </div>

      {/* Storyboard scroll */}
      <div className="overflow-x-auto pb-3">
        <div className="flex gap-3 items-start" style={{ minWidth: 'max-content' }}>
          {scenes.map(scene => (
            <div key={scene.id} className="relative group/card">
              <StoryboardFrame
                scene={scene}
                cardDims={cardDims}
                active={activeScene?.id === scene.id}
                onClick={() => setActiveScene(activeScene?.id === scene.id ? null : scene)}
              />
              {/* Delete button */}
              <button
                onClick={e => { e.stopPropagation(); removeScene(scene.id); }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500/80 text-white items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hidden group-hover/card:flex"
                style={{ fontSize: 8 }}>
                ✕
              </button>
            </div>
          ))}

          {/* Add scene button */}
          <button onClick={addScene}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 transition-all text-gray-700 hover:text-emerald-500"
            style={{ width: cardDims.w, height: cardDims.h + 28 }}>
            <FiPlus size={16} />
            <span className="text-[8px] font-bold">Add Scene</span>
          </button>
        </div>
      </div>

      {/* Scene editor */}
      <AnimatePresence mode="wait">
        {activeScene && (
          <SceneEditor
            key={activeScene.id}
            scene={activeScene}
            format={format}
            onUpdate={updateScene}
            onClose={() => setActiveScene(null)}
          />
        )}
      </AnimatePresence>

      {/* Continue button */}
      <button
        onClick={() => onContinue(scenes)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        Continue to Image Generation <FiArrowRight size={15}/>
      </button>
    </div>
  );
}

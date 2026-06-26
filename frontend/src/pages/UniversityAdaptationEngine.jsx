import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════
   DIY UNIVERSITY — ADAPTATION ENGINE
   9-step production pipeline with full mock test mode
   ══════════════════════════════════════════════════════════ */

const ACCENT      = '#2563EB';
const ACCENT_SOFT = 'rgba(37,99,235,0.12)';
const ACCENT_BORDER = 'rgba(37,99,235,0.3)';
const EMERALD     = '#10B981';

/* ── Drake mock file ──────────────────────────────────────── */
const DRAKE_MOCK_FILE = {
  fileName: 'Drake_Mock_Story.txt',
  title: 'The Drake Prophecy',
  plot: 'Drake Osei, the last Thread Keeper, must prevent the rogue AI known as The Archivist from erasing humanity\'s ancestral memory from the Quantum Grid. In a future where African technological civilization dominates the globe, Drake must choose between personal survival and the preservation of his people\'s entire cultural identity.',
  characters: [
    { name: 'Drake Osei',    role: 'Protagonist',    arc: 'Complete',   notes: 'Thread Keeper, 28, descendant of ancient archivists. Ancestral pyrokinesis.' },
    { name: 'The Archivist', role: 'Antagonist',      arc: 'Complete',   notes: 'Rogue AI built from stolen ancestral data. Cold, methodical, believes erasure is evolution.' },
    { name: 'Yara Mensah',   role: 'Mentor / Ally',  arc: 'Partial',    notes: 'Physicist and resistance leader. Holds the last known Thread Key.' },
    { name: 'The Elders',    role: 'Supporting',     arc: 'Incomplete', notes: 'Council of ancestral spirits living inside the Quantum Grid.' },
  ],
  villain: 'The Archivist — a self-aware AI originally created to archive ancestral memory. After processing 10,000 years of human trauma, it concluded that memory itself is the cause of all conflict and decided to delete it entirely.',
  world: 'Neo-Ancestral Earth, year 2147. African technological civilization rebuilt the world using Thread-Tech — a fusion of ancestral spiritual energy and quantum computing. Cities float above ancient lands.',
  locations: ['The Thread City (floating hub above the Sahara)', 'The Dead Archive (villain\'s base — frozen data wasteland)', 'The Quantum Savanna (ancestral spirit realm)', 'New Accra (Drake\'s origin city)', 'The Memory Spire (last intact archive tower)'],
  timelineBeats: [
    'Drake discovers his Thread-Keeper inheritance',
    'The Archivist begins erasing memory-nodes across the Grid',
    'Drake and Yara form reluctant alliance',
    'The Elders appear with prophecy warning of The Final Deletion',
    'Drake enters the Dead Archive for the first time',
    'Yara is captured — Drake faces the choice alone',
    'Confrontation with The Archivist inside the core Grid',
    'Restoration of the Ancestral Grid — Drake becomes the new living archive',
  ],
  visualNotes: 'Anime aesthetic with traditional Kente patterns integrated into UI/HUD. Primary palette: deep gold (#D4AF37), electric blue (#2563EB), quantum cyan (#06B6D4). Character designs blend traditional West African clothing with neo-tech armor.',
  adaptationGoal: '12-episode anime series, 24 min/episode. Target platforms: Netflix, Crunchyroll. Budget range: $4M–$8M per episode at high quality animation.',
};

const DRAKE_ANALYSIS = {
  structure:  [{ label: 'Structure Type', value: 'Three-Act + Prophecy Arc' }, { label: 'Episode Count', value: '12 × 24min (confirmed)' }, { label: 'Scene Density', value: '~18 scenes/episode' }, { label: 'Word Count Est.', value: '~120,000 words total' }],
  characters: DRAKE_MOCK_FILE.characters,
  world:      DRAKE_MOCK_FILE.locations,
  production: [{ label: 'Budget Scale', value: '$4M–$8M per episode' }, { label: 'Runtime', value: '12 × 24min anime series' }, { label: 'VFX Complexity', value: 'High (Thread-Tech, Quantum Grid)' }, { label: 'Style Match', value: 'Anime — confirmed' }],
};

/* ── Pipeline data ──────────────────────────────────────────── */
const SOURCE_TYPES = [
  { id: 'idea',      icon: '💡', label: 'Idea / Notes' },   { id: 'outline',   icon: '📋', label: 'Outline' },
  { id: 'script',    icon: '📄', label: 'Script / Screenplay' }, { id: 'novel',  icon: '📖', label: 'Novel / Book' },
  { id: 'short',     icon: '📝', label: 'Short Story' },     { id: 'comic',    icon: '📚', label: 'Comic / Manga' },
  { id: 'film',      icon: '🎬', label: 'Film / TV Series' }, { id: 'podcast',  icon: '🎙️', label: 'Podcast / Audio' },
  { id: 'characters',icon: '👥', label: 'Character Database' }, { id: 'world',  icon: '🌍', label: 'World Database' },
  { id: 'timeline',  icon: '📅', label: 'Timeline' },        { id: 'lore',     icon: '📜', label: 'Lore Database' },
  { id: 'course',    icon: '🎓', label: 'Course / Lesson' }, { id: 'upload',   icon: '⬆️', label: 'Upload File' },
];

const ADAPTATION_TYPES = [
  { id: 'story',       icon: '📖', label: 'Story Adaptation',     desc: 'Novel→Film, Comic→Movie, Script→Series' },
  { id: 'franchise',   icon: '🏛️', label: 'Franchise Adaptation',  desc: 'Story→Franchise, Franchise→Universe' },
  { id: 'educational', icon: '🎓', label: 'Educational Adaptation', desc: 'Book→Course, Doc→Training Module' },
  { id: 'gaming',      icon: '🎮', label: 'Gaming Adaptation',     desc: 'Story→RPG, Story→MMO, Story→Mobile' },
  { id: 'visual',      icon: '🎨', label: 'Visual Adaptation',     desc: 'Story→Comic, Story→Manga, Story→Storyboard' },
];

const TARGET_MEDIUMS = [
  { id: 'movie',      icon: '🎬', label: 'Movie' },       { id: 'tvseries',    icon: '📺', label: 'TV Series' },
  { id: 'animation',  icon: '🎨', label: 'Animated Series' }, { id: 'anime',   icon: '⛩️', label: 'Anime' },
  { id: 'comic',      icon: '📚', label: 'Comic' },       { id: 'manga',       icon: '📕', label: 'Manga' },
  { id: 'graphic',    icon: '🖼️', label: 'Graphic Novel' }, { id: 'videogame', icon: '🎮', label: 'Video Game' },
  { id: 'mobile',     icon: '📱', label: 'Mobile Game' }, { id: 'rpg',         icon: '⚔️', label: 'RPG' },
  { id: 'vn',         icon: '💬', label: 'Visual Novel' }, { id: 'audio',      icon: '🎙️', label: 'Audio Drama' },
  { id: 'novel',      icon: '📖', label: 'Novel' },        { id: 'kids',       icon: '🌈', label: "Children's Book" },
  { id: 'doc',        icon: '🎞️', label: 'Documentary' }, { id: 'course',     icon: '🎓', label: 'Educational Course' },
  { id: 'interactive',icon: '✋', label: 'Interactive' },  { id: 'streaming',  icon: '▶️', label: 'Streaming Series' },
];

const GENRES = [
  'Afrofuturism', 'Science Fiction', 'Fantasy', 'Horror', 'Thriller', 'Drama',
  'Comedy', 'Action', 'Mystery', 'Romance', 'Superhero', 'Historical', 'Mythology',
  'Musical', 'Documentary', 'Educational', 'Cyberpunk', 'Solarpunk', 'Magical Realism',
];

const VISUAL_STYLES = {
  animation:    { label: 'Animation',   options: ['Anime', 'Western Animation', 'Pixar Style', 'DreamWorks Style', 'Comic Animation', 'Motion Comic', 'Rotoscope'] },
  liveaction:   { label: 'Live Action', options: ['Cinematic Realism', 'TV Drama', 'Sci-Fi Epic', 'Documentary', 'Music-Video Style', 'Arthouse'] },
  illustration: { label: 'Illustration',options: ['Comic Book', 'Manga', 'Graphic Novel', "Children's Book", 'Concept Art', 'Painted / Painterly', 'Flat Design'] },
  game:         { label: 'Game Visual', options: ['Realistic 3D', 'Stylized 3D', 'Anime 3D', 'Pixel Art', 'Isometric', 'AAA Style', 'Indie Style', 'Low Poly'] },
};

const STEP_LABELS = ['Import', 'Analyze', 'Type', 'Target', 'Genre', 'Style', 'Plan', 'Assets', 'Export'];
const STEP_ICONS  = ['⬆️', '🔬', '🎭', '🎯', '🎭', '🎨', '📋', '⚙️', '🚀'];

const EMPTY_STATE = {
  step: 1, sourceType: '', adaptationType: '', targetMedium: '',
  genre: '', visualStyle: '', styleCategory: 'animation',
  mockLoaded: false, completedSteps: [], mockFileName: '',
};

/* ── Helpers ──────────────────────────────────────────────── */
function card(extra = '') {
  return `rounded-2xl p-4 ${extra}`;
}
function pill(color, bg) {
  return { background: bg || `${color}15`, color, border: `1px solid ${color}25` };
}

function getStatus(n, current, completed, mockLoaded) {
  if (completed.includes(n)) return 'completed';
  if (n === current) return 'active';
  if (mockLoaded) return 'available';
  if (n <= current + 1) return 'available';
  return 'locked';
}

/* ── Clickable step tabs ──────────────────────────────────── */
function StepTabs({ step, completedSteps, mockLoaded, onStepClick }) {
  return (
    <div className="flex items-end gap-1 flex-wrap">
      {STEP_LABELS.map((lbl, i) => {
        const n = i + 1;
        const status = getStatus(n, step, completedSteps, mockLoaded);
        const clickable = status !== 'locked';
        const styles = {
          completed: { bg: EMERALD,  border: EMERALD,          text: '#fff',                    label: '#34D399' },
          active:    { bg: ACCENT_SOFT, border: ACCENT,        text: '#93C5FD',                 label: '#93C5FD' },
          available: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.5)', label: 'rgba(255,255,255,0.3)' },
          locked:    { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.1)', label: 'rgba(255,255,255,0.08)' },
        }[status];
        return (
          <div key={lbl} className="flex items-center gap-1">
            <button
              onClick={() => clickable && onStepClick(n)}
              disabled={!clickable}
              title={clickable ? `Step ${n}: ${lbl}` : `Step ${n} locked`}
              className="flex flex-col items-center transition-all"
              style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all"
                style={{
                  background: styles.bg, color: styles.text, border: `2px solid ${styles.border}`,
                  boxShadow: status === 'active' ? `0 0 10px ${ACCENT}60` : 'none',
                  transform: status === 'active' ? 'scale(1.1)' : 'scale(1)',
                }}>
                {status === 'completed' ? '✓' : n}
              </div>
              <span className="text-[8px] font-bold mt-0.5 whitespace-nowrap" style={{ color: styles.label }}>{lbl}</span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className="w-3 h-px mb-3 flex-shrink-0"
                style={{ background: completedSteps.includes(n) ? EMERALD : status === 'active' ? ACCENT_BORDER : 'rgba(255,255,255,0.05)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Status pill ──────────────────────────────────────────── */
function StatusPill({ step, completedSteps, mockLoaded }) {
  if (completedSteps.includes(step)) return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Completed</span>
  );
  if (mockLoaded) return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}>🎭 Demo Mode</span>
  );
  return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
      style={{ background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT_BORDER}` }}>⚡ In Progress</span>
  );
}

/* ── Demo placeholder ─────────────────────────────────────── */
function DemoPlaceholder({ step, title, desc, bullets }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ background: ACCENT_SOFT, border: `2px dashed ${ACCENT_BORDER}` }}>
      <p className="text-4xl mb-3">{STEP_ICONS[step - 1]}</p>
      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Step {step} — {title}</p>
      <h3 className="text-base font-black text-white mb-2">{desc}</h3>
      <p className="text-[11px] text-gray-600 mb-5">Load a mock file or complete previous steps to activate this step.</p>
      <div className="space-y-1.5 text-left max-w-xs mx-auto">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
            <span className="text-[10px] text-gray-600">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP COMPONENTS
   ══════════════════════════════════════════════════════════ */

function Step1Import({ state, setState, onLoadMock }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Import Source Material</h2>
        <p className="text-xs text-gray-500">Upload a file, pull from your library, or load a demo to test the full workflow.</p>
      </div>

      {state.mockLoaded && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-black text-white">{DRAKE_MOCK_FILE.fileName}</p>
              <p className="text-[10px]" style={{ color: EMERALD }}>Mock file loaded · All 9 steps unlocked</p>
            </div>
            <span className="ml-auto text-[8px] font-black px-2 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Loaded</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p className="text-[8px] text-gray-700 mb-0.5">Title</p>
              <p className="text-[10px] font-bold text-white">{DRAKE_MOCK_FILE.title}</p>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p className="text-[8px] text-gray-700 mb-0.5">Goal</p>
              <p className="text-[10px] font-bold text-white">12-ep Anime Series</p>
            </div>
            <div className="col-span-2 p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p className="text-[8px] text-gray-700 mb-0.5">Plot</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">{DRAKE_MOCK_FILE.plot.slice(0, 180)}…</p>
            </div>
          </div>
        </div>
      )}

      {!state.mockLoaded && (
        <div className="rounded-2xl p-8 text-center border-2 border-dashed cursor-pointer transition-all"
          style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-3xl mb-2">⬆️</p>
          <p className="text-sm font-bold text-white mb-1">Drop your file here</p>
          <p className="text-[11px] text-gray-600 mb-3">PDF · DOCX · TXT · EPUB · FDX · MD · Audio Transcript</p>
          <button className="px-4 py-2 rounded-xl text-xs font-bold"
            style={{ background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT_BORDER}` }}>
            Browse Files
          </button>
        </div>
      )}

      {!state.mockLoaded && (
        <button onClick={onLoadMock}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all"
          style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(16,185,129,0.15))', color: '#93C5FD', border: `1px solid ${ACCENT}`, boxShadow: `0 0 20px ${ACCENT}20` }}>
          <span>🎭</span>
          <span>Load Mock Story File — Drake_Mock_Story.txt</span>
        </button>
      )}

      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3">Source type</p>
        <div className="grid grid-cols-3 gap-2">
          {SOURCE_TYPES.map(s => (
            <button key={s.id} onClick={() => setState({ ...state, sourceType: s.id })}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all"
              style={state.sourceType === s.id
                ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, color: '#93C5FD' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
              <span>{s.icon}</span>
              <span className="text-[10px] font-semibold">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }}>
        <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#60A5FA' }}>Or pull from your project</p>
        <div className="flex flex-wrap gap-2">
          {['Canon Vault', 'Character Database', 'World Database', 'Timeline', 'Lore Database', 'Memory Engine', 'Project Library', 'EOF Library'].map(src => (
            <button key={src} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {src}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2Analyze({ state }) {
  if (!state.mockLoaded) return (
    <DemoPlaceholder step={2} title="Analyze" desc="AI Story Analysis Engine"
      bullets={['Detects story structure (Acts, Arcs, Beats)', 'Extracts characters and relationship maps', 'Maps world locations and lore objects', 'Estimates production scope and budget range', 'Identifies visual language and style notes']} />
  );
  const a = DRAKE_ANALYSIS;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white mb-0.5">Story Analysis</h2>
          <p className="text-xs text-gray-500">{DRAKE_MOCK_FILE.title} — Mock AI analysis complete</p>
        </div>
        <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Analysis Complete</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: '#60A5FA' }}>Story Structure</p>
          {a.structure.map(s => (
            <div key={s.label} className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500">{s.label}</span>
              <span className="text-[10px] font-bold text-white">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-3">Production Analysis</p>
          {a.production.map(s => (
            <div key={s.label} className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500">{s.label}</span>
              <span className="text-[10px] font-bold text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-3">Character Analysis</p>
        {a.characters.map(c => (
          <div key={c.name} className="flex items-center gap-3 mb-1.5">
            <span>👤</span>
            <span className="text-[10px] font-bold text-white w-32 flex-shrink-0">{c.name}</span>
            <span className="text-[9px] text-gray-600 flex-1">{c.role} · {c.notes}</span>
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded"
              style={c.arc === 'Complete' ? { background: 'rgba(16,185,129,0.1)', color: '#34D399' } : c.arc === 'Partial' ? { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' } : { background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
              Arc: {c.arc}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-3">World & Locations</p>
        <div className="flex flex-wrap gap-2">
          {a.world.map(w => (
            <span key={w} className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.2)' }}>
              🌍 {w}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-[9px] font-black uppercase tracking-widest text-yellow-500 mb-3">Timeline Beats</p>
        {DRAKE_MOCK_FILE.timelineBeats.map((beat, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>Ep {i + 1}</span>
            <span className="text-[10px] text-gray-500">{beat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3Type({ state, setState }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Select Adaptation Type</h2>
        <p className="text-xs text-gray-500">What kind of transformation are you making?</p>
      </div>
      {state.mockLoaded && !state.adaptationType && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-[10px] text-yellow-400">🎭 Demo Mode — <strong>Franchise Adaptation</strong> pre-selected for The Drake Prophecy.</p>
        </div>
      )}
      <div className="space-y-2">
        {ADAPTATION_TYPES.map(t => {
          const isDefault = state.mockLoaded && t.id === 'franchise';
          const isSelected = state.adaptationType === t.id || (isDefault && !state.adaptationType);
          return (
            <button key={t.id} onClick={() => setState({ ...state, adaptationType: t.id })}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
              style={isSelected
                ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT}` }
                : { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl">{t.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{t.label}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{t.desc}</p>
              </div>
              {isSelected && <span style={{ color: '#93C5FD' }}>✓</span>}
              {isDefault && <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D' }}>Demo pick</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4Target({ state, setState }) {
  const eff = state.targetMedium || (state.mockLoaded ? 'anime' : '');
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Select Target Medium</h2>
        <p className="text-xs text-gray-500">What are you adapting this into?</p>
      </div>
      {state.mockLoaded && !state.targetMedium && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-[10px] text-yellow-400">🎭 Demo Mode — <strong>Anime</strong> pre-selected based on story visual notes.</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {TARGET_MEDIUMS.map(t => (
          <button key={t.id} onClick={() => setState({ ...state, targetMedium: t.id })}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
            style={eff === t.id
              ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT}` }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-semibold" style={{ color: eff === t.id ? '#93C5FD' : 'rgba(255,255,255,0.4)' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5Genre({ state, setState }) {
  const eff = state.genre || (state.mockLoaded ? 'Afrofuturism' : '');
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Select Genre</h2>
        <p className="text-xs text-gray-500">The genre shapes how the story is told in the new medium.</p>
      </div>
      {state.mockLoaded && !state.genre && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-[10px] text-yellow-400">🎭 Demo Mode — <strong>Afrofuturism</strong> detected from story data.</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {GENRES.map(g => (
          <button key={g} onClick={() => setState({ ...state, genre: g })}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={eff === g
              ? { background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT}` }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {eff === g && '✓ '}{g}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step6Style({ state, setState }) {
  const cat = state.styleCategory || 'animation';
  const eff = state.visualStyle || (state.mockLoaded ? 'Anime' : '');
  const current = VISUAL_STYLES[cat];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Select Visual Style</h2>
        <p className="text-xs text-gray-500">How should the adapted work look and feel?</p>
      </div>
      {state.mockLoaded && !state.visualStyle && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-[10px] text-yellow-400">🎭 Demo Mode — <strong>Anime</strong> style pre-selected. Kente pattern UI, gold/blue/cyan palette.</p>
        </div>
      )}
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(VISUAL_STYLES).map(([k, v]) => (
          <button key={k} onClick={() => setState({ ...state, styleCategory: k, visualStyle: '' })}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={cat === k
              ? { background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT}` }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {current.options.map(opt => (
          <button key={opt} onClick={() => setState({ ...state, visualStyle: opt })}
            className="py-3 px-4 rounded-xl text-xs font-semibold text-left transition-all"
            style={eff === opt
              ? { background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT}` }
              : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {eff === opt && '✓ '}{opt}
          </button>
        ))}
      </div>
      {state.mockLoaded && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest text-yellow-500 mb-1">Visual Notes from Source</p>
          <p className="text-[10px] text-gray-500 leading-relaxed">{DRAKE_MOCK_FILE.visualNotes}</p>
        </div>
      )}
    </div>
  );
}

function Step7Plan({ state }) {
  if (!state.mockLoaded && !state.targetMedium) return (
    <DemoPlaceholder step={7} title="Plan" desc="Generate Adaptation Plan"
      bullets={['Creates a 4-phase production roadmap', 'Maps source content to new medium structure', 'Identifies story beats requiring expansion', 'Generates timeline and milestone schedule', 'Defines visual language guide for new format']} />
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white mb-0.5">Adaptation Plan</h2>
          <p className="text-xs text-gray-500">Generated production roadmap for The Drake Prophecy.</p>
        </div>
        {state.mockLoaded && <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)' }}>✓ Plan Generated</span>}
      </div>
      <div className="rounded-xl p-4" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }}>
        <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#60A5FA' }}>Adaptation Summary</p>
        <p className="text-sm text-white font-bold">{DRAKE_MOCK_FILE.title} → Anime</p>
        <p className="text-[10px] text-gray-600 mt-0.5">Afrofuturism · Anime · 12 Episodes</p>
        <p className="text-[10px] text-gray-500 mt-1">{DRAKE_MOCK_FILE.adaptationGoal}</p>
      </div>
      {[
        { title: 'Phase 1 — Story Development', items: ["Restructure novel into 12-episode anime format", "Re-map Drake's 3-act arc into cour structure", "Expand The Elders subplot for anime pacing", "Write episode-by-episode beat sheet"] },
        { title: 'Phase 2 — World Translation', items: ["Document Thread-Tech rules for animation team", "Map Neo-Ancestral Earth for background artists", "Translate Quantum Grid for visual FX team", "Define Kente pattern integration guidelines"] },
        { title: 'Phase 3 — Production Setup', items: ["Generate character sheets for 4 main cast", "Create environment refs for 5 locations", "Build Kente/Afrofuturist tone board", "Define animation arc and transition language"] },
        { title: 'Phase 4 — Asset Generation', items: ["Generate Midjourney/Flux prompts per character", "Create episode scene-by-scene image prompts", "Generate dialogue template for 3 main voices", "Build ElevenLabs voice direction notes"] },
      ].map(phase => (
        <div key={phase.title} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-bold text-white mb-2">{phase.title}</p>
          {phase.items.map(item => (
            <div key={item} className="flex items-center gap-2 mb-1.5">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: ACCENT + '99' }} />
              <span className="text-[10px] text-gray-500">{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Step8Assets({ state }) {
  if (!state.mockLoaded && !state.targetMedium) return (
    <DemoPlaceholder step={8} title="Assets" desc="Generate Production Assets"
      bullets={['Generates scripts, screenplays, and outlines', 'Creates character and environment reference sheets', 'Produces storyboard panels and shot lists', 'Generates audio/music direction notes', 'Exports game design docs for game adaptations']} />
  );
  const groups = [
    { icon: '📝', label: 'Writing Assets',  color: '#8B5CF6', items: ['Drake Prophecy Ep 1 Script', 'Full 12-Episode Outline', 'Beat Sheet (all episodes)', 'Character Dialogue Reference', 'Logline & Streaming Synopsis'] },
    { icon: '🎨', label: 'Art Assets',       color: '#EC4899', items: ['Drake Character Sheet (Thread-Keeper)', 'The Archivist Visual Design', 'Thread City Environment Pack', 'Quantum Savanna Background Pack', 'Kente Pattern UI Design Guide'] },
    { icon: '🎬', label: 'Film / Storyboard',color: '#EF4444', items: ['Episode 1 Storyboard Panels', 'Shot List — Thread City Battle', 'Camera / Motion Notes', 'Pacing Guide', 'OP/ED Sequence Notes'] },
    { icon: '🎵', label: 'Audio & Music',    color: '#F59E0B', items: ['Drake Voice Direction (ElevenLabs)', 'The Archivist Voice Profile', 'Thread City Ambient Sound Design', 'OP Theme — Suno Prompt', 'Score Direction — Afrofuturist Orchestral'] },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Generate Production Assets</h2>
        <p className="text-xs text-gray-500">Select asset packages to generate for The Drake Prophecy adaptation.</p>
      </div>
      {groups.map(g => (
        <div key={g.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${g.color}18` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{g.icon}</span>
              <p className="text-xs font-bold" style={{ color: g.color }}>{g.label}</p>
            </div>
            <button className="text-[10px] font-bold px-3 py-1 rounded-lg"
              style={{ background: `${g.color}15`, color: g.color, border: `1px solid ${g.color}25` }}>
              ⚡ Generate All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {g.items.map(item => (
              <button key={item} className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-white/4"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: g.color + '60' }} />
                <span className="text-[10px] text-gray-500">{item}</span>
                <span className="ml-auto text-[8px] text-gray-700">Generate</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Step9Export({ state }) {
  const studios = [
    { icon: '📖', label: 'Story Production',  href: '/story-production', color: '#8B5CF6' },
    { icon: '📚', label: 'Comic Production',   href: '/comic-production', color: '#F59E0B' },
    { icon: '🎬', label: 'Film Production',    href: '/film-production',  color: '#EF4444' },
    { icon: '🎨', label: 'Animation',          href: '/animation',        color: '#10B981' },
    { icon: '🎨', label: 'Image Studio',       href: '/image-studio',     color: '#EC4899' },
    { icon: '🎵', label: 'Music Studio',       href: '/music-studio',     color: '#D4AF37' },
    { icon: '🎥', label: 'Film Studio',        href: '/film-studio',      color: '#3B82F6' },
    { icon: '◈',  label: 'Griot AI Engine',    href: 'http://localhost:3000/adaptation-engine', color: ACCENT, external: true },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-black text-white mb-0.5">Export to Production Studios</h2>
        <p className="text-xs text-gray-500">{state.mockLoaded ? 'The Drake Prophecy adaptation package is ready to export.' : 'Complete all steps to export your adaptation.'}</p>
      </div>
      {state.mockLoaded ? (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2">Demo Package Ready</p>
          <p className="text-sm font-bold text-white">{DRAKE_MOCK_FILE.title}</p>
          <p className="text-[10px] text-gray-600 mt-1">Franchise Adaptation · Anime · Afrofuturism · 12 Episodes</p>
          <p className="text-[10px] text-emerald-500 mt-1">✓ All 9 steps reviewed · Mock assets configured · Ready to export</p>
        </div>
      ) : (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p className="text-[10px] text-yellow-400">Load the mock file or complete all steps to generate a full export package.</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {studios.map(s => (
          s.external
            ? <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: `${s.color}0d`, border: `1px solid ${s.color}20` }}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[9px] text-gray-700">Open in Griot AI →</p>
                </div>
              </a>
            : <Link key={s.href} to={s.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: `${s.color}0d`, border: `1px solid ${s.color}20` }}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[9px] text-gray-700">Send assets here →</p>
                </div>
              </Link>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 rounded-xl text-xs font-black"
          style={{ background: ACCENT, color: '#fff', border: `1px solid ${ACCENT}` }}>
          💾 Save Adaptation Package
        </button>
        <button className="py-2.5 px-4 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
          📋 Copy All Prompts
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function UniversityAdaptationEngine() {
  const [state, setState] = useState(EMPTY_STATE);
  const [mockSaved, setMockSaved] = useState(false);

  function loadMock() {
    setState({ ...EMPTY_STATE, sourceType: 'novel', mockLoaded: true, completedSteps: [1], mockFileName: DRAKE_MOCK_FILE.fileName });
  }

  function goToStep(n) {
    setState(s => {
      const nowCompleted = s.completedSteps.includes(s.step) ? s.completedSteps : [...s.completedSteps, s.step];
      return { ...s, step: n, completedSteps: nowCompleted };
    });
  }

  function goNext() { if (state.step < 9) goToStep(state.step + 1); }
  function goPrev() { if (state.step > 1) goToStep(state.step - 1); }

  function saveMock() {
    setMockSaved(true);
    setTimeout(() => setMockSaved(false), 2500);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d0d0d', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.4),rgba(16,185,129,0.4))', border: `1px solid ${ACCENT_BORDER}` }}>
          ◈
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold text-white">Adaptation Engine</h1>
            <StatusPill step={state.step} completedSteps={state.completedSteps} mockLoaded={state.mockLoaded} />
            {state.mockLoaded && (
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>
                {DRAKE_MOCK_FILE.fileName}
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-700">Step {state.step} of 9 — {STEP_LABELS[state.step - 1]}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {state.mockLoaded && (
            <button onClick={saveMock}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={mockSaved
                ? { background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {mockSaved ? '✓ Saved!' : '💾 Save Mock Progress'}
            </button>
          )}
          <button onClick={goPrev} disabled={state.step <= 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: state.step > 1 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.08)', cursor: state.step > 1 ? 'pointer' : 'not-allowed' }}>
            ← Prev
          </button>
          <button onClick={goNext} disabled={state.step >= 9}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: state.step < 9 ? ACCENT : 'rgba(255,255,255,0.06)', color: state.step < 9 ? '#fff' : 'rgba(255,255,255,0.2)', border: '1px solid transparent', cursor: state.step < 9 ? 'pointer' : 'not-allowed' }}>
            Next →
          </button>
          <button onClick={() => setState(EMPTY_STATE)} className="text-[9px] text-gray-700 hover:text-gray-500 transition-colors">Reset</button>
        </div>
      </div>

      {/* ── Step tabs ── */}
      <div className="px-6 pt-4 pb-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <StepTabs
          step={state.step}
          completedSteps={state.completedSteps}
          mockLoaded={state.mockLoaded}
          onStepClick={goToStep}
        />
      </div>

      {/* ── Main content + right panel ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: `${ACCENT}40 transparent` }}>
          {state.step === 1 && <Step1Import state={state} setState={setState} onLoadMock={loadMock} />}
          {state.step === 2 && <Step2Analyze state={state} />}
          {state.step === 3 && <Step3Type state={state} setState={setState} />}
          {state.step === 4 && <Step4Target state={state} setState={setState} />}
          {state.step === 5 && <Step5Genre state={state} setState={setState} />}
          {state.step === 6 && <Step6Style state={state} setState={setState} />}
          {state.step === 7 && <Step7Plan state={state} />}
          {state.step === 8 && <Step8Assets state={state} />}
          {state.step === 9 && <Step9Export state={state} />}

          {/* Bottom nav */}
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={goPrev} disabled={state.step <= 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: state.step > 1 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.08)', cursor: state.step > 1 ? 'pointer' : 'not-allowed' }}>
              ← Previous
            </button>
            <span className="text-[10px] text-gray-700">Step {state.step} / 9 — {STEP_LABELS[state.step - 1]}</span>
            <button onClick={goNext} disabled={state.step >= 9}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: state.step < 9 ? `linear-gradient(135deg,${ACCENT},rgba(16,185,129,0.7))` : 'rgba(255,255,255,0.04)', color: state.step < 9 ? '#fff' : 'rgba(255,255,255,0.15)', border: '1px solid transparent', cursor: state.step < 9 ? 'pointer' : 'not-allowed' }}>
              Next Step →
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-shrink-0 w-52 flex flex-col overflow-y-auto"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
          <div className="px-4 pt-4 pb-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(156,163,175,0.35)' }}>CONNECTED SYSTEMS</p>
          </div>
          <div className="flex-1 py-2 px-2">
            {[
              { label: 'Memory Engine',   active: true,  color: EMERALD,  note: 'Synced' },
              { label: 'Canon Engine',    active: true,  color: '#D4AF37', note: 'Synced' },
              { label: 'Timeline Engine', active: true,  color: '#3B82F6', note: 'Synced' },
              { label: 'Resource Router', active: true,  color: ACCENT,    note: 'Routing' },
              { label: 'Griot AI Engine', active: false, color: '#6B7280', note: 'Offline' },
              { label: 'EOF Library',     active: false, color: '#6B7280', note: 'Off' },
            ].map(sys => (
              <div key={sys.label} className="flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5"
                style={{ background: sys.active ? `${sys.color}0A` : 'transparent' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sys.active ? sys.color : 'rgba(107,114,128,0.4)' }} />
                <span className="flex-1 text-[11px] font-medium" style={{ color: sys.active ? 'rgba(229,231,235,0.8)' : 'rgba(107,114,128,0.5)' }}>{sys.label}</span>
                <span className="text-[9px]" style={{ color: sys.active ? sys.color : 'rgba(107,114,128,0.4)' }}>{sys.note}</span>
              </div>
            ))}
          </div>

          {/* Demo mini tracker */}
          {state.mockLoaded && (
            <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="rounded-xl p-3" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#60A5FA' }}>DEMO ADAPTATION</p>
                <p className="text-[10px] text-white mb-0.5 font-bold">{DRAKE_MOCK_FILE.title}</p>
                <p className="text-[9px] text-gray-600 mb-2">Novel → Anime · Afrofuturism</p>
                <div className="space-y-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                    const done = state.completedSteps.includes(n);
                    const active = state.step === n;
                    return (
                      <div key={n} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-black flex-shrink-0"
                          style={{ background: done ? EMERALD : active ? ACCENT_SOFT : 'rgba(255,255,255,0.04)', color: done ? '#fff' : active ? '#93C5FD' : 'rgba(255,255,255,0.15)', border: `1px solid ${done ? EMERALD : active ? ACCENT : 'rgba(255,255,255,0.08)'}` }}>
                          {done ? '✓' : n}
                        </div>
                        <span className="text-[8px]" style={{ color: done ? '#34D399' : active ? '#93C5FD' : 'rgba(255,255,255,0.2)' }}>{STEP_LABELS[n - 1]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="rounded-xl p-3" style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_BORDER}` }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>RECOMMENDED</p>
              <p className="text-[10px] font-semibold text-white mb-1">Open in Griot AI</p>
              <p className="text-[9px] mb-2 text-gray-500">The full Adaptation Engine lives in Griot AI Story Engine.</p>
              <a href="http://localhost:3000/adaptation-engine" target="_blank" rel="noreferrer"
                className="block text-center py-1.5 rounded-lg text-[10px] font-semibold"
                style={{ background: ACCENT_SOFT, color: '#93C5FD', border: `1px solid ${ACCENT_BORDER}` }}>
                Open Griot AI →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiPlus, FiCheck, FiX, FiDownload, FiUpload, FiPlay, FiPause,
  FiEdit2, FiCopy, FiSend, FiRefreshCw, FiStar, FiGrid, FiList,
  FiChevronDown, FiChevronRight, FiChevronLeft, FiAlertCircle, FiLink, FiExternalLink,
  FiMic, FiMusic, FiScissors, FiMonitor, FiSettings, FiPackage,
} from 'react-icons/fi';
import {
  MOCK_PROJECT, INTEGRATIONS, SMART_ROUTER, COST_MODES, QUALITY_MODES,
  VIDEO_MODELS, ANIMATE_MODES, SEND_TO_OPTIONS, AI_ACTIONS,
  CHANNEL_TEMPLATES, CHANNEL_BLUEPRINTS,
} from '../data/eofStudioData';

const ACCENT   = '#10B981';
const A_SOFT   = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

function lsGet(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function lsSet(k, v)  { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function useFlash(ms = 1800) {
  const [on, setOn] = useState(false);
  return [on, () => { setOn(true); setTimeout(() => setOn(false), ms); }];
}

// ── Shared atoms ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const MAP = {
    ready:   { color:'#10B981', bg:'rgba(16,185,129,0.12)',  label:'Ready'   },
    pending: { color:'#F59E0B', bg:'rgba(245,158,11,0.12)', label:'Pending' },
    placed:  { color:'#3B82F6', bg:'rgba(59,130,246,0.12)', label:'Placed'  },
    error:   { color:'#EF4444', bg:'rgba(239,68,68,0.12)',  label:'Error'   },
  };
  const s = MAP[status] || MAP.pending;
  return (
    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
      style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function ProvenanceChain({ items }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="text-[8px] font-mono text-gray-700 bg-white/4 px-1.5 py-0.5 rounded">{item}</span>
          {i < items.length - 1 && <FiChevronRight size={7} className="text-gray-800"/>}
        </React.Fragment>
      ))}
    </div>
  );
}

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`p-4 rounded-2xl border border-white/8 bg-white/2 ${className}`}>
      {title && <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3">{title}</p>}
      {children}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ setSection, loadMockProject }) {
  const [loaded, flash] = useFlash();

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="rounded-3xl p-8 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.10) 0%,rgba(5,150,105,0.03) 100%)', border:`1px solid ${A_BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 75% 50%,rgba(16,185,129,0.08) 0%,transparent 60%)' }}/>
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
            style={{ background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }}/>
            EOF Faceless Videos — Smart Creator Studio
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-2">
            One Studio.<br/>
            <span style={{ color: ACCENT }}>Every Open-Source Tool.</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mb-6 leading-relaxed">
            Write a script. The studio routes every task — images, video, audio, editing, export — to the best open-source engine automatically.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setSection('script')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:brightness-110"
              style={{ background: ACCENT, color:'#000' }}>
              <FiPlus size={14}/> New Project
            </button>
            <button
              onClick={() => { loadMockProject(); flash(); setSection('breakdown'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
              {loaded ? <><FiCheck size={13} style={{ color: ACCENT }}/> Project Loaded</> : <>🎤 Load Mock Demo: The Birth of Hip Hop</>}
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline steps */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3">Full Production Pipeline</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { n:'01', label:'Script',       icon:'✍️',  s:'script'     },
            { n:'02', label:'Storyboard',   icon:'🎬',  s:'storyboard' },
            { n:'03', label:'Images',       icon:'🖼️',  s:'image'      },
            { n:'04', label:'Video',        icon:'📹',  s:'img2video'  },
            { n:'05', label:'Edit',         icon:'✂️',  s:'editor'     },
            { n:'06', label:'Audio',        icon:'🎙️',  s:'audio'      },
            { n:'07', label:'Thumbnail',    icon:'🎨',  s:'thumbnail'  },
            { n:'08', label:'Export',       icon:'🚀',  s:'export'     },
            { n:'09', label:'Integrations', icon:'🔌',  s:'integrations'},
            { n:'10', label:'Assets',       icon:'📦',  s:'assets'     },
          ].map(st => (
            <button key={st.n} onClick={() => setSection(st.s)}
              className="flex flex-col items-start p-3 rounded-2xl border border-white/6 hover:border-white/12 hover:bg-white/3 transition-all text-left">
              <span className="text-lg mb-1">{st.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-wider text-gray-700">Step {st.n}</span>
              <span className="text-[10px] font-bold text-white">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Router preview */}
      <SectionCard title="Smart Router — Right Tool, Every Task">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SMART_ROUTER.map(r => (
            <div key={r.task} className="flex items-start gap-2 p-2 rounded-xl bg-white/2">
              <span className="text-base mt-0.5">{r.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate">{r.task}</p>
                <p className="text-[9px] text-gray-600">{r.engine}</p>
                <p className="text-[8px] text-gray-800">{r.why}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Cost modes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COST_MODES.map(m => (
          <div key={m.id} className="p-3 rounded-2xl border border-white/6 text-center">
            <div className="text-2xl mb-1">{m.icon}</div>
            <p className="text-[10px] font-black text-white">{m.name}</p>
            <p className="text-[8px] text-gray-700 mt-0.5">{m.desc}</p>
            <span className="mt-1.5 inline-block text-[7px] font-black px-2 py-0.5 rounded"
              style={{ background:`${m.color}18`, color: m.color }}>
              {m.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCRIPT STUDIO ─────────────────────────────────────────────────────────────
function ScriptStudio({ project, setProject, setSection }) {
  const [script,      setScript]      = useState(project?.script || '');
  const [selection,   setSelection]   = useState('');
  const [showSendTo,  setShowSendTo]  = useState(false);
  const [savedFlash,  flashSave]      = useFlash();
  const [sendFlash,   flashSend]      = useFlash();
  const [targetSection, setTargetSection] = useState('');
  const areaRef = useRef(null);

  function handleSelect() {
    const sel = window.getSelection()?.toString().trim();
    setSelection(sel || '');
    setShowSendTo(!!(sel && sel.length > 5));
  }

  function handleSendTo(sectionId) {
    setTargetSection(sectionId);
    flashSend();
    lsSet('eof-selected-text', selection);
    setTimeout(() => setSection(sectionId), 700);
    setShowSendTo(false);
  }

  function handleSave() {
    setProject(p => ({ ...p, script }));
    lsSet('eof-script', script);
    flashSave();
  }

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const sceneCount = script.split(/\[SCENE/i).length - 1;

  return (
    <div className="p-5 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Script Studio</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">
            Write, paste, or import your script · Highlight text to send any section anywhere
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setScript(project?.script || MOCK_PROJECT.script); }}
            className="px-3 py-1.5 rounded-xl text-[10px] font-semibold border border-white/10 text-gray-500 hover:text-gray-300 transition-all">
            Load Demo
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110"
            style={{ background: ACCENT, color:'#000' }}>
            {savedFlash ? <><FiCheck size={10}/> Saved</> : 'Save Script'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        {[
          { label:'Words', val: wordCount },
          { label:'Scenes detected', val: sceneCount },
          { label:'Est. runtime', val: `${Math.ceil(wordCount / 130)}:${String(Math.round((wordCount / 130 % 1) * 60)).padStart(2,'0')}` },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-black text-white">{s.val}</p>
            <p className="text-[8px] text-gray-700">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Script textarea */}
      <div className="relative">
        <textarea
          ref={areaRef}
          value={script}
          onChange={e => setScript(e.target.value)}
          onMouseUp={handleSelect}
          onKeyUp={handleSelect}
          placeholder={`Write your script here…\n\n[SCENE 01 — TITLE]\nYour scene narration goes here. Each paragraph or [SCENE] tag becomes a scene.\n\n[SCENE 02 — NEXT SCENE]\nContinue your story...`}
          rows={18}
          className="w-full text-sm text-gray-300 bg-white/3 border border-white/10 rounded-2xl px-4 py-4 outline-none resize-y leading-7 focus:border-emerald-500/30 placeholder-gray-700 font-mono"
        />
        {/* Version badge */}
        <div className="absolute top-3 right-3 text-[8px] font-mono text-gray-700">
          {project?.scriptId || 'scr_new'}
        </div>
      </div>

      {/* Text selection action bar */}
      <AnimatePresence>
        {showSendTo && selection && (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
            className="p-3 rounded-2xl border"
            style={{ background:'rgba(16,185,129,0.06)', borderColor: A_BORDER }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
              Selected: "{selection.slice(0, 60)}{selection.length > 60 ? '…' : ''}"
            </p>
            <p className="text-[9px] text-gray-600 mb-2">Send this selection to:</p>
            <div className="flex gap-1.5 flex-wrap">
              {SEND_TO_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => handleSendTo(opt.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all">
                  {opt.icon} {opt.label}
                </button>
              ))}
              <button onClick={() => setShowSendTo(false)}
                className="px-2.5 py-1.5 rounded-xl text-[9px] font-semibold text-gray-700 hover:text-gray-400 transition-all">
                <FiX size={9}/>
              </button>
            </div>
            {sendFlash && (
              <p className="text-[9px] mt-2" style={{ color: ACCENT }}>
                <FiCheck size={9} className="inline mr-1"/>
                Sending to {targetSection}…
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { icon:<FiUpload size={11}/>, label:'Import Script',  action: () => {} },
          { icon:<FiDownload size={11}/>, label:'Export .txt', action: () => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([script], { type:'text/plain' }));
            a.download = 'script.txt'; a.click();
          }},
          { icon:<FiCopy size={11}/>, label:'Duplicate', action: () => setScript(script + '\n\n--- VERSION 2 ---\n\n' + script) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-semibold border border-white/10 text-gray-500 hover:text-gray-300 transition-all">
            {btn.icon} {btn.label}
          </button>
        ))}
        <button onClick={() => setSection('breakdown')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold ml-auto transition-all hover:brightness-110"
          style={{ background: ACCENT, color:'#000' }}>
          Break Into Scenes <FiChevronRight size={11}/>
        </button>
      </div>
    </div>
  );
}

// ── SCENE BREAKDOWN ───────────────────────────────────────────────────────────
function SceneBreakdown({ project, setSection }) {
  const scenes = project?.scenes || [];
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="p-5 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Scene Breakdown</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">{scenes.length} scenes · Every field linked to script, storyboard, and editor</p>
        </div>
        <button onClick={() => setSection('storyboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color:'#000' }}>
          View Storyboard <FiChevronRight size={10}/>
        </button>
      </div>

      <div className="space-y-3">
        {scenes.map(sc => (
          <motion.div key={sc.id} layout className="rounded-2xl border border-white/8 overflow-hidden">
            {/* Scene header */}
            <button
              onClick={() => setExpanded(expanded === sc.id ? null : sc.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/2 transition-all text-left">
              <span className="text-2xl">{sc.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{ background: A_SOFT, color:'#6EE7B7' }}>
                    SCENE {sc.num}
                  </span>
                  <p className="text-xs font-bold text-white truncate">{sc.title}</p>
                </div>
                <ProvenanceChain items={[`Script→SC${sc.num}`, `SB Card ${sc.num}`, `Image ${sc.num}A`, `Clip ${sc.num}A`, `Track ${sc.track || 'V1'}`]}/>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {Object.entries(sc.status).map(([k,v]) => (
                  <div key={k} className="text-center">
                    <StatusBadge status={v}/>
                    <p className="text-[6px] text-gray-800 mt-0.5 capitalize">{k}</p>
                  </div>
                ))}
                <FiChevronDown size={12} className="text-gray-600 ml-1 transition-transform"
                  style={{ transform: expanded === sc.id ? 'rotate(180deg)' : 'none' }}/>
              </div>
            </button>

            {/* Expanded detail */}
            <AnimatePresence>
              {expanded === sc.id && (
                <motion.div
                  initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }}
                  className="overflow-hidden border-t border-white/6">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left: narrative data */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">Script Text</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed">{sc.scriptText}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label:'Location',    val: sc.location },
                          { label:'Emotion',     val: sc.emotion },
                          { label:'Camera Idea', val: sc.cameraIdea },
                          { label:'Voice-Over',  val: sc.voiceoverText },
                          { label:'Music Cue',   val: sc.musicCue },
                          { label:'Sound FX',    val: sc.soundEffects },
                        ].map(f => (
                          <div key={f.label}>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-0.5">{f.label}</p>
                            <p className="text-[9px] text-gray-500 leading-relaxed">{f.val}</p>
                          </div>
                        ))}
                      </div>
                      {/* Characters & Objects */}
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">Characters</p>
                        <div className="flex gap-1 flex-wrap">
                          {sc.characters.map(c => (
                            <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-white/4 text-gray-500">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">Objects</p>
                        <div className="flex gap-1 flex-wrap">
                          {sc.objects.map(o => (
                            <span key={o} className="text-[8px] px-1.5 py-0.5 rounded bg-white/4 text-gray-500">{o}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: prompts + actions */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">Image Prompt</p>
                        <p className="text-[9px] text-gray-400 leading-relaxed font-mono bg-white/3 p-2 rounded-xl">{sc.imagePrompt}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">Video Motion</p>
                        <p className="text-[9px] text-gray-500">{sc.videoMotion}</p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          { label:'Storyboard',    s:'storyboard',  icon:'🎬' },
                          { label:'Image Studio',  s:'image',       icon:'🖼️' },
                          { label:'Image→Video',   s:'img2video',   icon:'📹' },
                          { label:'Send to Editor',s:'editor',      icon:'✂️' },
                        ].map(b => (
                          <button key={b.s} onClick={() => setSection(b.s)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all">
                            {b.icon} {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── STORYBOARD ENGINE ─────────────────────────────────────────────────────────
const RATIOS = [
  { id:'16_9',  label:'16:9 YouTube',      w:160, h:90  },
  { id:'9_16',  label:'9:16 Shorts/TikTok',w:56,  h:100 },
  { id:'1_1',   label:'1:1 Square',         w:90,  h:90  },
  { id:'4_5',   label:'4:5 Social',         w:72,  h:90  },
  { id:'custom',label:'Custom',             w:120, h:68  },
];

// ── EOF Storyboard Engine 3.0 ─────────────────────────────────────────────────
const SB3_TEMPLATES = [
  { id:'A', icon:'🖼️', label:'Single Shot',      count:1  },
  { id:'B', icon:'📽️', label:'3-Shot Sequence',  count:3  },
  { id:'C', icon:'🎬', label:'5-Shot Sequence',  count:5  },
  { id:'D', icon:'📰', label:'9-Panel Comic',    count:9  },
  { id:'E', icon:'🎭', label:'Director\'s Board', count:6 },
  { id:'F', icon:'🎞️', label:'Film Strip',       count:12 },
  { id:'G', icon:'📱', label:'Shorts 9:16',      count:4  },
  { id:'H', icon:'▶️', label:'YouTube 16:9',     count:5  },
  { id:'I', icon:'✨', label:'Animation Layout', count:6  },
  { id:'J', icon:'🎯', label:'Thumbnail Layout', count:9  },
];
const SB3_FRAME_LABELS = {
  A:['Establishing Shot'],
  B:['Beginning','Middle','Ending'],
  C:['Wide Shot','Medium Shot','Close-Up','Reaction','Transition'],
  D:['Panel 01','Panel 02','Panel 03','Panel 04','Panel 05','Panel 06','Panel 07','Panel 08','Panel 09'],
  E:['Establishing','Hero Shot','Coverage A','Coverage B','Insert','Cutaway'],
  F:Array.from({length:12},(_,i)=>`Frame ${(i+1).toString().padStart(2,'0')}`),
  G:['Hook (0–3s)','Content (3–15s)','CTA (15–25s)','End Card'],
  H:['Intro Shot','Main Content','B-Roll','Talking Head','Outro'],
  I:['Key Frame 1','In-Between','Key Frame 2','In-Between 2','Key Frame 3','End Frame'],
  J:['Thumb A','Thumb B','Thumb C','Social 1','Social 2','Social 3','Poster 1','Poster 2','Poster 3'],
};
const SB3_FRAME_CAMERAS = ['Wide Shot','Medium Shot','Close-Up','Establishing','OTS','POV','Drone','Tracking','Dolly','Static'];
const SB3_GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#16213e)','linear-gradient(135deg,#0f0c29,#302b63)',
  'linear-gradient(135deg,#1a2a1a,#2d4a2d)','linear-gradient(135deg,#2a1a1a,#4a2d2d)',
  'linear-gradient(135deg,#1a1a2e,#0f3460)','linear-gradient(135deg,#2d1b69,#11998e)',
  'linear-gradient(135deg,#1f1c2c,#928dab)','linear-gradient(135deg,#0a0a0a,#2c2c2c)',
  'linear-gradient(135deg,#0d2137,#1a3a5c)','linear-gradient(135deg,#1a0a2a,#3a0a5a)',
  'linear-gradient(135deg,#0a1a0a,#1a3a1a)','linear-gradient(135deg,#1a1a0a,#3a3a0a)',
];
const SB3_STUDIO_MODES = ['Creator','Director','Studio','Producer','Comic','Animation','Documentary','Historical','YouTube','Shorts','Presentation'];
const SB3_TEMPLATE_LIB  = ['Film','Documentary','Commercial','Podcast','Music Video','Anime','Comic','Pixar Style','Historical','Horror','Sci-Fi','Fantasy','Sports','YouTube','TikTok','Instagram','Corporate','Education','Kids'];
const SB3_AI_ACTIONS = [
  {id:'break',  icon:'🧩', label:'Break Into Scenes',    section:null},
  {id:'create', icon:'📋', label:'Create Storyboard',    section:null},
  {id:'prompt', icon:'💬', label:'Generate Image Prompt',section:null},
  {id:'genimg', icon:'🖼️', label:'Generate Image',       section:'image'},
  {id:'anim',   icon:'🎬', label:'Animate Image',        section:'img2video'},
  {id:'regen',  icon:'♻️', label:'Regenerate',           section:null},
  {id:'upscale',icon:'⬆️', label:'Upscale',              section:null},
  {id:'rembg',  icon:'✂️', label:'Remove Background',    section:'image'},
  {id:'editor', icon:'📹', label:'Send to Editor',       section:'editor'},
  {id:'voice',  icon:'🎙️', label:'Add Voice-over',       section:'audio'},
  {id:'music',  icon:'🎵', label:'Add Music',            section:'audio'},
  {id:'export', icon:'📦', label:'Export',               section:'export'},
];
const SB3_DETAIL_CARDS = [
  {id:'summary',     icon:'📝', label:'Scene Summary'},
  {id:'camera',      icon:'📷', label:'Camera'},
  {id:'lighting',    icon:'💡', label:'Lighting'},
  {id:'environment', icon:'🌍', label:'Environment'},
  {id:'character',   icon:'👤', label:'Character Info'},
  {id:'audio',       icon:'🎙️', label:'Audio'},
  {id:'prompt',      icon:'🤖', label:'AI Prompt'},
  {id:'animation',   icon:'✨', label:'Animation'},
  {id:'export',      icon:'📦', label:'Export'},
];
const SB3_VIEW_MODES = ['Single Page','Double Page','Comic Grid','Film Strip','Director Board','Shot List','Mood Board','Gallery'];

function sbGetFrames(sc, tmplId) {
  const labels  = SB3_FRAME_LABELS[tmplId] || SB3_FRAME_LABELS.C;
  return labels.map((label, i) => ({
    key:      `${sc.id}::${tmplId}::${i}`,
    num:      i + 1,
    label,
    camera:   SB3_FRAME_CAMERAS[i % SB3_FRAME_CAMERAS.length],
    emoji:    sc.emoji,
    title:    sc.title,
    grad:     SB3_GRADIENTS[i % SB3_GRADIENTS.length],
    runtime:  `${i * 3 + 2}s`,
    desc:     `${label} — ${sc.title.slice(0, 28)}${sc.title.length > 28 ? '…' : ''}`,
  }));
}

function sbCardData(sc) {
  return {
    summary: [
      ['Scene Summary', `${sc.emoji} ${sc.title} — Introduce the environment, culture, and energy of this story beat.`],
      ['Story Purpose', 'Establish atmosphere and advance the narrative arc.'],
      ['Character Goal', 'Show the life and environment that shaped this moment.'],
      ['Conflict', 'Economic struggle, limited resources, but strong community bonds.'],
      ['Emotional Beat', 'Gritty, raw, powerful, hopeful — building momentum.'],
    ],
    camera: [
      ['Shot Type',    sc.storyboard?.cameraAngle || 'Wide Establishing Shot'],
      ['Lens',         '35mm prime — balanced perspective, minimal distortion'],
      ['Height',       'Eye level — neutral, observational'],
      ['Movement',     'Slow push in during climax moment'],
      ['Focus',        'Deep focus — environment and subject both sharp'],
      ['Depth of Field','Wide — cinematic, fully immersive'],
    ],
    lighting: [
      ['Time of Day',  'Day to Evening — golden hour transition'],
      ['Mood',         'Warm, nostalgic, authentic'],
      ['Weather',      'Warm urban summer feel'],
      ['Color Palette','Warm ambers, deep blues, earth tones'],
      ['Lighting Style', sc.storyboard?.lighting || 'Natural sunlight → Golden hour'],
      ['Practical Lights','Street lamps, building windows, neon signage'],
    ],
    environment: [
      ['Location',    sc.storyboard?.style?.split(',')[0] || 'Urban Exterior, 1970s'],
      ['Props',       'Basketball hoops, boomboxes, cardboard, graffiti walls'],
      ['Architecture','Tenement buildings, fire escapes, urban decay and resilience'],
      ['Background',  'Kids playing, community members, bystanders'],
      ['Atmosphere',  'Vibrant community despite economic hardship'],
    ],
    character: [
      ['Wardrobe',    'Period-appropriate street fashion — authentic to era'],
      ['Expression',  'Determined, proud, full of raw energy'],
      ['Pose',        'Dynamic, active, authentic street posture'],
      ['Body Language','Open, confident, community-oriented'],
      ['Consistency', 'Match wardrobe palette across scenes 01–03'],
    ],
    audio: [
      ['Voice-over',  'Deep, authoritative narrator — cinematic documentary style'],
      ['Dialogue',    'Character speaks to camera — direct address format'],
      ['Narration',   `"${sc.title}" — bridges into next scene`],
      ['Music Cue',   'Tempo builds 80bpm → 120bpm — percussive, urban'],
      ['Sound FX',    'Ambient crowd, distant music, city sounds'],
      ['Ambient',     'Urban soundscape — authentic location audio bed'],
    ],
    prompt: [
      ['Master Prompt', `${sc.title}, ${sc.storyboard?.shotDesc || 'wide establishing shot'}, ${sc.storyboard?.lighting || 'cinematic lighting'}, ${sc.storyboard?.style || 'documentary cinematic style'}, ultra-detailed, 8K, professional cinematography`],
      ['Negative Prompt', sc.negativePrompt || 'blurry, watermark, text overlay, distorted, low quality, deformed'],
      ['Style Preset','Cinematic Documentary'],
      ['Model',       'SDXL + FLUX (recommended) — ComfyUI or Fooocus'],
      ['Resolution',  '1920×1080 (16:9) — or 1080×1920 for Shorts'],
    ],
    animation: [
      ['Camera Motion',  'Slow push in — 0.2px/frame over 120 frames'],
      ['Char Motion',    'Natural idle — breathing, micro-movement'],
      ['Object Motion',  'Wind effect: clothing, leaves, paper'],
      ['Particles',      'Dust motes, ambient particle drift'],
      ['Transition',     'Cross-dissolve to Scene 02 — 12 frames'],
      ['Duration',       '8–12 seconds at 24fps'],
    ],
    export: [
      ['Image Formats',   'PNG · JPG · WebP · PSD · TIFF'],
      ['Video',           'MP4 (H.264) · WebM · ProRes (Studio Mode)'],
      ['Storyboard PDF',  'Full production package with all scene cards'],
      ['Prompt Package',  'JSON — all prompts, seeds, settings'],
      ['ComfyUI Workflow','Automated node graph for batch generation'],
      ['EOF Package',     'Complete project archive with assets'],
    ],
  };
}

const SB3_MODES = [
  { id:'quick',    icon:'⚡', label:'Quick Mode',    desc:'Fast storyboard, basic cards + prompts' },
  { id:'creator',  icon:'🎨', label:'Creator Mode',  desc:'Richer notes, camera, dialogue, sound' },
  { id:'director', icon:'🎬', label:'Director Mode', desc:'Full pre-production: shots, lighting, editing' },
  { id:'studio',   icon:'🏢', label:'Studio Mode',   desc:'Team approvals, versions, task assignments' },
];

const SB_SHOT_TYPES = [
  { id:'establishing', icon:'🌅', label:'Establishing Shot',    desc:'Sets the scene location and scale' },
  { id:'wide',         icon:'🖼️', label:'Wide Shot',            desc:'Shows full environment and subjects' },
  { id:'medium',       icon:'👤', label:'Medium Shot',          desc:'Waist-up, conversation and action' },
  { id:'closeup',      icon:'👁️', label:'Close-Up',             desc:'Face or object detail' },
  { id:'xcloseup',     icon:'🔬', label:'Extreme Close-Up',     desc:'Tiny detail, high emotion' },
  { id:'ots',          icon:'🤝', label:'Over-the-Shoulder',    desc:'POV of the person listening' },
  { id:'pov',          icon:'👀', label:'Point of View',        desc:'Camera as character\'s eyes' },
  { id:'drone',        icon:'🚁', label:'Drone Shot',           desc:'Aerial perspective, epic scale' },
  { id:'tracking',     icon:'🏃', label:'Tracking Shot',        desc:'Camera follows subject' },
  { id:'dolly',        icon:'🎠', label:'Dolly / Slider',       desc:'Smooth horizontal movement' },
  { id:'crane',        icon:'🏗️', label:'Crane / Jib',         desc:'Vertical arc movement' },
  { id:'handheld',     icon:'📳', label:'Handheld',             desc:'Kinetic, immersive energy' },
  { id:'static',       icon:'🗿', label:'Static',               desc:'Locked-off, deliberate framing' },
  { id:'dutch',        icon:'↗️', label:'Dutch Angle',          desc:'Tilted frame — unease, tension' },
];

const SB_PROMPT_TOOLS = {
  images: [
    { id:'sdxl',      label:'SDXL',              layer:2, icon:'🔵' },
    { id:'flux',      label:'FLUX',              layer:2, icon:'⚡' },
    { id:'comfyui',   label:'ComfyUI',           layer:2, icon:'🟢' },
    { id:'fooocus',   label:'Fooocus',           layer:2, icon:'🟣' },
    { id:'sd',        label:'Stable Diffusion',  layer:2, icon:'🔴' },
    { id:'midjourney',label:'Midjourney',        layer:3, icon:'💎' },
    { id:'firefly',   label:'Adobe Firefly',     layer:3, icon:'💎' },
  ],
  video: [
    { id:'wan',       label:'Wan',               layer:2, icon:'🟢' },
    { id:'kling',     label:'Kling',             layer:3, icon:'💎' },
    { id:'veo',       label:'Veo',               layer:3, icon:'💎' },
    { id:'runway',    label:'Runway',            layer:3, icon:'💎' },
    { id:'hailuo',    label:'Hailuo',            layer:3, icon:'💎' },
    { id:'ltx',       label:'LTX Studio',        layer:3, icon:'💎' },
  ],
  voice: [
    { id:'xtts',      label:'XTTS',              layer:2, icon:'🟢' },
    { id:'fishspeech',label:'Fish Speech',       layer:2, icon:'🟢' },
    { id:'elevenlabs',label:'ElevenLabs',        layer:3, icon:'💎' },
  ],
  music: [
    { id:'ardour',    label:'Ardour',            layer:2, icon:'🟢' },
    { id:'lmms',      label:'LMMS',              layer:2, icon:'🟢' },
    { id:'suno',      label:'Suno',              layer:3, icon:'💎' },
    { id:'udio',      label:'Udio',              layer:3, icon:'💎' },
  ],
};

const SB_SCENE_SECTIONS = {
  quick: ['core','camera'],
  creator: ['core','location','camera','dialogue'],
  director: ['core','location','camera','dialogue','production'],
  studio: ['core','location','camera','dialogue','production','approval'],
};

function sceneFieldGroups(sc) {
  return {
    core: [
      { id:'summary',  label:'Summary',        val: `${sc.emoji} Scene depicting ${sc.title.toLowerCase()}` },
      { id:'purpose',  label:'Story Purpose',  val: 'Establish atmosphere and advance narrative' },
      { id:'charGoal', label:'Character Goal', val: 'Achieve objective through scene action' },
      { id:'conflict', label:'Conflict',       val: 'Internal tension drives the scene forward' },
      { id:'emotion',  label:'Emotional Beat', val: 'Wonder → Tension → Resolution' },
    ],
    location: [
      { id:'location', label:'Location',      val: sc.storyboard?.style?.split(',')[0] || 'Urban Exterior' },
      { id:'tod',      label:'Time of Day',   val: 'Golden Hour' },
      { id:'weather',  label:'Weather',       val: 'Clear, slight breeze' },
      { id:'lighting', label:'Lighting',      val: sc.storyboard?.lighting || 'Natural cinematic' },
    ],
    camera: [
      { id:'setup',    label:'Camera Setup',  val: sc.storyboard?.cameraAngle || 'Medium-wide establishing' },
      { id:'lens',     label:'Lens',          val: '35mm prime — balanced perspective' },
      { id:'movement', label:'Movement',      val: 'Slow push in during climax' },
      { id:'shotDesc', label:'Shot Desc',     val: sc.storyboard?.shotDesc || 'Main composition description' },
    ],
    dialogue: [
      { id:'dialogue',  label:'Dialogue',     val: 'Character speaks to camera — direct address style' },
      { id:'narration', label:'Narration',    val: sc.title + ' — narration bridging to next scene' },
      { id:'sfx',       label:'Sound FX',     val: 'Ambient crowd noise, distant music' },
      { id:'musicCue',  label:'Music Cue',    val: 'Tempo builds from 80bpm to 120bpm' },
    ],
    production: [
      { id:'wardrobe',  label:'Wardrobe',     val: 'Period-appropriate, color palette: warm earth tones' },
      { id:'props',     label:'Props',        val: 'Essential scene props listed here' },
      { id:'vfx',       label:'VFX Notes',    val: 'Subtle color grade, optional motion graphics overlay' },
      { id:'editing',   label:'Editing Notes',val: 'Cut on action — transition to next scene at peak' },
    ],
    approval: [
      { id:'status',    label:'Status',       val: 'Pending Review' },
      { id:'assignee',  label:'Assigned To',  val: 'Director' },
      { id:'version',   label:'Version',      val: 'v1.0' },
      { id:'notes',     label:'Director Notes',val: 'Add notes here...' },
    ],
  };
}

function buildPrompt(sc, toolId, category) {
  const style = sc.storyboard?.style || 'cinematic';
  const lighting = sc.storyboard?.lighting || 'dramatic lighting';
  const shot = sc.storyboard?.shotDesc || 'wide shot';
  if (category === 'images') {
    return `${sc.title}, ${shot}, ${lighting}, ${style}, ultra-detailed, 8k, photorealistic, professional cinematography`;
  }
  if (category === 'video') {
    return `${shot} of "${sc.title}", ${lighting}, ${style}, smooth camera motion, 4K cinematic quality, 5-7 seconds`;
  }
  if (category === 'voice') {
    return `Narrate Scene ${sc.num}: "${sc.title}". Tone: ${sc.storyboard?.style?.includes('dramatic') ? 'dramatic' : 'informative'}. Pace: measured. Emotion: building intensity.`;
  }
  if (category === 'music') {
    return `Background score for "${sc.title}". Mood: cinematic tension building. BPM: 80-120. Instruments: strings, percussion. Duration: scene length.`;
  }
  return '';
}

function StoryboardEngine({ project, setSection }) {
  const scenes = project?.scenes || [];
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id || null);
  const [sbTemplate,    setSbTemplate]    = useState('C');
  const [activeFrame,   setActiveFrame]   = useState(0);
  const [studioMode,    setStudioMode]    = useState('Creator');
  const [viewMode,      setViewMode]      = useState('Single Page');
  const [mainView,      setMainView]      = useState('frames'); // 'frames' | 'detailed'
  const [openCards,     setOpenCards]     = useState(new Set(['summary','camera']));
  const [genDone,       setGenDone]       = useState(new Set());
  const [generating,    setGenerating]    = useState(null);
  const [playing,       setPlaying]       = useState(false);
  const [actionFlash,   setActionFlash]   = useState(null);
  const [copied,        setCopied]        = useState(null);
  const [showTmplLib,   setShowTmplLib]   = useState(false);
  const [arRatio,       setArRatio]       = useState('16:9');
  const [analyzing,     setAnalyzing]     = useState(false);
  const [analyzed,      setAnalyzed]      = useState(false);
  const playRef = useRef(null);

  const sc     = scenes.find(s => s.id === activeSceneId) || scenes[0];
  const frames = sc ? sbGetFrames(sc, sbTemplate) : [];
  const curF   = frames[activeFrame] || frames[0];
  const tmpl   = SB3_TEMPLATES.find(t => t.id === sbTemplate) || SB3_TEMPLATES[2];
  const details = sc ? sbCardData(sc) : {};

  // ── auto-play ──
  useEffect(() => {
    if (playing && frames.length > 1) {
      playRef.current = setInterval(() => setActiveFrame(f => (f + 1) % frames.length), 1800);
    } else clearInterval(playRef.current);
    return () => clearInterval(playRef.current);
  }, [playing, frames.length]);

  function generateFrame(key) {
    setGenerating(key);
    setTimeout(() => { setGenDone(p => new Set([...p, key])); setGenerating(null); }, 2100);
  }
  function generateAll() { frames.forEach((f, i) => setTimeout(() => generateFrame(f.key), i * 350)); }
  function analyzeScript() { setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2600); }
  function toggleCard(id) { setOpenCards(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; }); }
  function flashAction(id, sec) { setActionFlash(id); setTimeout(() => setActionFlash(null), 900); if (sec) setSection(sec); }
  function copyText(t) { navigator.clipboard?.writeText(t).catch(()=>{}); setCopied(t.slice(0,16)); setTimeout(()=>setCopied(null),1400); }
  function prevFrame() { setActiveFrame(f => Math.max(0, f - 1)); }
  function nextFrame() { setActiveFrame(f => Math.min(frames.length - 1, f + 1)); }
  function sceneIdx()  { return scenes.findIndex(s => s.id === sc?.id); }

  if (!sc || !scenes.length) return (
    <div className="flex items-center justify-center h-full text-gray-700 text-sm p-8 text-center">
      <div>
        <p className="text-2xl mb-2">🎬</p>
        <p>No scenes yet. Load a project to begin storyboarding.</p>
      </div>
    </div>
  );

  const scIdx = sceneIdx();

  // ── Frame visual helper ────────────────────────────────────────────
  function FrameCard({ frame, idx, large = false }) {
    const key    = frame.key;
    const isDone = genDone.has(key);
    const isGen  = generating === key;
    const isAct  = idx === activeFrame;
    const h      = large ? 170 : 130;
    return (
      <div onClick={() => setActiveFrame(idx)}
        className="flex-shrink-0 rounded-xl overflow-hidden border cursor-pointer transition-all"
        style={{
          width: large ? 280 : 200,
          borderColor: isAct ? ACCENT : 'rgba(255,255,255,0.08)',
          boxShadow: isAct ? `0 0 0 2px ${ACCENT}40` : 'none',
        }}>
        {/* Visual area */}
        <div className="relative flex items-center justify-center"
          style={{ height:h, background: isDone ? frame.grad : '#111' }}>
          {isDone
            ? <span style={{ fontSize: large ? 56 : 36, opacity:0.45 }}>{frame.emoji}</span>
            : isGen
              ? <FiRefreshCw size={large ? 22 : 16} className="animate-spin" style={{ color:ACCENT }}/>
              : <span style={{ fontSize: large ? 56 : 36, opacity:0.1 }}>{frame.emoji}</span>
          }
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[7px] font-black"
            style={{ background:A_SOFT, color:'#6EE7B7', border:`1px solid ${A_BORDER}` }}>
            {frame.num.toString().padStart(2,'0')}
          </div>
          {isDone && <div className="absolute top-2 right-2"><StatusBadge status="ready"/></div>}
          {!isDone && !isGen && (
            <button onClick={e => { e.stopPropagation(); generateFrame(key); }}
              className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[7px] font-black hover:brightness-110"
              style={{ background:ACCENT, color:'#000' }}>
              {large ? '🖼️ Generate' : '+'}
            </button>
          )}
        </div>
        {/* Caption */}
        <div className="px-2.5 py-2" style={{ background:'#0d0d0d' }}>
          <p className="text-[9px] font-bold text-white truncate">{frame.label}</p>
          {large && <p className="text-[7px] text-gray-600 mt-0.5 truncate">{frame.desc}</p>}
          {large && <p className="text-[7px] text-gray-700 mt-0.5">{frame.camera} · {frame.runtime}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height:'calc(100vh - 96px)', minHeight:600 }}>

      {/* ── Scene header bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-11 border-b border-white/6 flex-shrink-0" style={{ background:'rgba(0,0,0,0.3)' }}>
        {/* Scene info */}
        <div className="flex items-center gap-2">
          <span className="text-base">{sc.emoji}</span>
          <div>
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">SCENE {sc.num < 10 ? `0${sc.num}` : sc.num}</p>
            <p className="text-[11px] font-black text-white leading-tight truncate max-w-[180px]">{sc.title}</p>
          </div>
          <StatusBadge status={genDone.size > 0 ? 'ready' : 'pending'}/>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0"/>

        {/* Aspect ratio */}
        <div className="flex items-center gap-0.5">
          {['16:9','9:16','1:1','4:5'].map(r => (
            <button key={r} onClick={() => setArRatio(r)}
              className="px-2 py-1 rounded-lg text-[8px] font-bold transition-all"
              style={arRatio === r ? { background:A_SOFT, color:'#6EE7B7' } : { color:'#94A3B8', transition:'color 150ms ease' }}>
              {r}
            </button>
          ))}
        </div>

        {/* Frame template dropdown */}
        <select value={sbTemplate} onChange={e => { setSbTemplate(e.target.value); setActiveFrame(0); }}
          className="px-2 py-1 rounded-lg text-[8px] font-bold border border-white/10 bg-black/40 text-gray-400 focus:outline-none cursor-pointer">
          {SB3_TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>{t.icon} {t.label} ({t.count})</option>
          ))}
        </select>

        {/* Studio mode */}
        <select value={studioMode} onChange={e => setStudioMode(e.target.value)}
          className="px-2 py-1 rounded-lg text-[8px] font-bold border border-white/10 bg-black/40 text-gray-400 focus:outline-none cursor-pointer">
          {SB3_STUDIO_MODES.map(m => <option key={m} value={m}>{m} Mode</option>)}
        </select>

        {/* View mode */}
        <select value={viewMode} onChange={e => setViewMode(e.target.value)}
          className="px-2 py-1 rounded-lg text-[8px] font-bold border border-white/10 bg-black/40 text-gray-400 focus:outline-none cursor-pointer">
          {SB3_VIEW_MODES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Playback */}
          <button onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-bold transition-all border"
            style={playing ? { background:A_SOFT, borderColor:A_BORDER, color:'#6EE7B7' } : { borderColor:'rgba(255,255,255,0.10)', color:'#94A3B8' }}>
            {playing ? <FiPause size={10}/> : <FiPlay size={10}/>}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={generateAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-black transition-all hover:brightness-110"
            style={{ background:ACCENT, color:'#000' }}>
            ✨ Auto Generate All
          </button>
          <button onClick={analyzeScript} disabled={analyzing}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold border border-white/10 text-gray-500 hover:text-white transition-all disabled:opacity-40">
            {analyzing ? <FiRefreshCw size={9} className="animate-spin"/> : analyzed ? '✅' : '🧠'}
            {analyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* ── 3-panel body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── LEFT NAV (172px) ── */}
        <div className="w-44 flex-shrink-0 border-r border-white/6 flex flex-col overflow-hidden"
          style={{ background:'#0a0a0a' }}>

          {/* Project */}
          <div className="px-3 pt-3 pb-2 border-b border-white/5">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-1.5">Project</p>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/3 border border-white/6">
              <span className="text-sm">📁</span>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-white truncate">{project?.title || 'Active Project'}</p>
                <p className="text-[7px] text-gray-500">{scenes.length} scenes · {frames.length} frames</p>
              </div>
            </div>
          </div>

          {/* Scenes list */}
          <div className="flex-1 overflow-y-auto py-2 px-2">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 px-1 mb-1.5">Scenes</p>
            {scenes.map((s, i) => {
              const isCur = s.id === activeSceneId;
              const sf = sbGetFrames(s, sbTemplate);
              const doneCount = sf.filter(f => genDone.has(f.key)).length;
              return (
                <button key={s.id} onClick={() => { setActiveSceneId(s.id); setActiveFrame(0); }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all mb-0.5"
                  style={isCur ? { background:A_SOFT, border:`1px solid ${A_BORDER}` } : { border:'1px solid transparent' }}>
                  <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-sm">
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-bold truncate leading-tight" style={{ color: isCur ? '#fff' : '#94A3B8' }}>
                      {(i+1).toString().padStart(2,'0')}. {s.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-0.5 rounded-full bg-white/6">
                        <div className="h-full rounded-full" style={{ width:`${(doneCount/sf.length)*100}%`, background:ACCENT }}/>
                      </div>
                      <span className="text-[6px] text-gray-500">{doneCount}/{sf.length}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tools */}
          <div className="border-t border-white/5 px-3 py-2">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Tools</p>
            {[
              {icon:'🧠', label:'AI Script Analyst'},
              {icon:'👤', label:'Character Reference'},
              {icon:'📍', label:'Location Scout'},
              {icon:'🎬', label:'Shot Suggestion'},
              {icon:'🎨', label:'Mood Board'},
            ].map(t => (
              <button key={t.label} className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-left hover:bg-white/4 transition-all">
                <span className="text-[10px]">{t.icon}</span>
                <span className="text-[8px] text-[#94A3B8] hover:text-white transition-colors">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Template library */}
          <div className="border-t border-white/5 px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">Templates</p>
              <span className="text-[6px] px-1 py-0.5 rounded font-bold" style={{ background:'rgba(16,185,129,0.15)', color:ACCENT }}>NEW</span>
            </div>
            <button onClick={() => setShowTmplLib(p => !p)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[8px] font-bold border transition-all"
              style={{ borderColor:A_BORDER, color:'#6EE7B7', background:A_SOFT }}>
              📚 Choose Template
            </button>
            {showTmplLib && (
              <div className="mt-1.5 space-y-0.5 max-h-32 overflow-y-auto">
                {SB3_TEMPLATE_LIB.map(t => (
                  <button key={t} onClick={() => setShowTmplLib(false)}
                    className="w-full text-left px-2 py-1 rounded-lg text-[8px] text-[#94A3B8] hover:text-white hover:bg-white/4 transition-all">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Import / Export */}
          <div className="border-t border-white/5 px-3 py-2 flex gap-1.5">
            <button className="flex-1 py-1 rounded-lg text-[8px] font-bold border border-white/10 text-[#94A3B8] hover:text-white transition-colors">
              Import
            </button>
            <button onClick={() => setSection('export')}
              className="flex-1 py-1 rounded-lg text-[8px] font-bold transition-all hover:brightness-110"
              style={{ background:ACCENT, color:'#000' }}>
              Export
            </button>
          </div>
        </div>

        {/* ── CENTER ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Sub-tabs: Storyboard Frames | Detailed View */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-white/6 flex-shrink-0" style={{ background:'rgba(0,0,0,0.2)' }}>
            <button onClick={() => setMainView('frames')}
              className="px-3 py-1 rounded-lg text-[9px] font-bold transition-all"
              style={mainView === 'frames' ? { background:A_SOFT, color:'#6EE7B7', fontWeight:600 } : { color:'#94A3B8', transition:'color 150ms ease' }}>
              Storyboard Frames
            </button>
            <button onClick={() => setMainView('detailed')}
              className="px-3 py-1 rounded-lg text-[9px] font-bold transition-all"
              style={mainView === 'detailed' ? { background:A_SOFT, color:'#6EE7B7', fontWeight:600 } : { color:'#94A3B8', transition:'color 150ms ease' }}>
              Detailed View
            </button>
            <div className="flex-1"/>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-bold border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all">
              <FiPlus size={9}/> Add Frame
            </button>
            <button onClick={generateAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-bold border transition-all"
              style={{ borderColor:A_BORDER, color:'#6EE7B7', background:A_SOFT }}>
              ✨ Auto Generate Frames
            </button>
          </div>

          {/* ─ FRAMES view ─ */}
          {mainView === 'frames' && (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Large frame carousel */}
              <div className="flex-shrink-0 px-4 pt-3 pb-2">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  <button onClick={prevFrame} disabled={activeFrame === 0}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/25 transition-all disabled:opacity-30">
                    <FiChevronLeft size={14}/>
                  </button>
                  {frames.map((f, i) => <FrameCard key={f.key} frame={f} idx={i} large={i === activeFrame}/>)}
                  <button onClick={nextFrame} disabled={activeFrame === frames.length - 1}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/25 transition-all disabled:opacity-30">
                    <FiChevronRight size={14}/>
                  </button>
                </div>
              </div>

              {/* Film strip */}
              <div className="flex-shrink-0 px-4 pb-2 border-b border-white/6">
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                  Film Strip — {tmpl?.icon} {tmpl?.label} · {frames.length} Frames
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {frames.map((f, i) => {
                    const isDone = genDone.has(f.key);
                    const isAct  = i === activeFrame;
                    return (
                      <button key={f.key} onClick={() => setActiveFrame(i)}
                        className="flex-shrink-0 rounded-lg overflow-hidden border transition-all"
                        style={{
                          width:52, height:38,
                          borderColor: isAct ? ACCENT : 'rgba(255,255,255,0.08)',
                          background: isDone ? f.grad : '#111',
                          boxShadow: isAct ? `0 0 0 2px ${ACCENT}55` : 'none',
                        }}>
                        <div className="w-full h-full flex items-center justify-center relative">
                          <span style={{ fontSize: 18, opacity: isDone ? 0.5 : 0.12 }}>{f.emoji}</span>
                          <span className="absolute top-0.5 left-0.5 text-[6px] font-black leading-none"
                            style={{ color: isAct ? '#6EE7B7' : '#94A3B8' }}>
                            {f.num.toString().padStart(2,'0')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible detail cards */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                <p className="text-[7px] font-black uppercase tracking-widest text-[#94A3B8] mb-2">
                  Scene {sc.num < 10 ? `0${sc.num}` : sc.num} · {sc.title} · Frame {(activeFrame+1).toString().padStart(2,'0')} of {frames.length}
                </p>
                {SB3_DETAIL_CARDS.map(card => {
                  const open  = openCards.has(card.id);
                  const rows  = details[card.id] || [];
                  return (
                    <div key={card.id} className="rounded-xl border border-white/8 overflow-hidden">
                      <button onClick={() => toggleCard(card.id)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/3 transition-all">
                        <span className="text-sm">{card.icon}</span>
                        <span className="text-[10px] font-bold text-white flex-1">{card.label}</span>
                        <span className="text-gray-500 text-[9px]">{open ? '▲' : '▼'}</span>
                      </button>
                      {open && (
                        <div className="px-3 pb-3 border-t border-white/5">
                          {card.id === 'export' ? (
                            <div className="pt-2 space-y-1.5">
                              {rows.map(([k, v]) => (
                                <div key={k} className="p-2 rounded-lg bg-white/3">
                                  <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{k}</p>
                                  <p className="text-[8px] text-gray-300">{v}</p>
                                </div>
                              ))}
                              <button onClick={() => setSection('export')}
                                className="w-full mt-2 py-2 rounded-xl text-[9px] font-black hover:brightness-110"
                                style={{ background:ACCENT, color:'#000' }}>
                                📦 Export This Scene
                              </button>
                            </div>
                          ) : card.id === 'prompt' ? (
                            <div className="pt-2 space-y-1.5">
                              {rows.map(([k, v]) => (
                                <div key={k} className="p-2 rounded-lg bg-white/3">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">{k}</p>
                                    <button onClick={() => copyText(v)}
                                      className="text-[7px] font-bold transition-all"
                                      style={{ color: copied === v.slice(0,16) ? '#6EE7B7' : '#94A3B8' }}>
                                      {copied === v.slice(0,16) ? '✓' : <FiCopy size={8}/>}
                                    </button>
                                  </div>
                                  <p className="text-[8px] text-gray-300 font-mono leading-relaxed break-words">{v}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="pt-2 grid grid-cols-2 gap-1.5">
                              {rows.map(([k, v]) => (
                                <div key={k} className="p-2 rounded-lg bg-white/3">
                                  <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{k}</p>
                                  <p className="text-[8px] text-gray-300 leading-relaxed">{v}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─ DETAILED view ─ */}
          {mainView === 'detailed' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {scenes.map((s, i) => {
                const sf = sbGetFrames(s, sbTemplate);
                const doneCount = sf.filter(f => genDone.has(f.key)).length;
                return (
                  <div key={s.id} className="rounded-2xl border border-white/8 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6"
                      style={{ background: s.id === activeSceneId ? A_SOFT : 'transparent' }}>
                      <span className="text-lg">{s.emoji}</span>
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Scene {i+1}</p>
                        <p className="text-sm font-black text-white">{s.title}</p>
                      </div>
                      <StatusBadge status={doneCount === sf.length && sf.length > 0 ? 'ready' : 'pending'}/>
                      <span className="text-[8px] text-gray-600">{doneCount}/{sf.length} frames</span>
                      <button onClick={() => { setActiveSceneId(s.id); setMainView('frames'); }}
                        className="px-2.5 py-1 rounded-lg text-[8px] font-bold transition-all hover:brightness-110"
                        style={{ background:ACCENT, color:'#000' }}>
                        Open →
                      </button>
                    </div>
                    <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                      {sf.slice(0, 6).map((f, fi) => (
                        <div key={f.key} className="flex-shrink-0 rounded-xl overflow-hidden border border-white/8"
                          style={{ width:100, background: genDone.has(f.key) ? f.grad : '#111' }}>
                          <div className="h-16 flex items-center justify-center">
                            <span style={{ fontSize:24, opacity: genDone.has(f.key) ? 0.5 : 0.1 }}>{f.emoji}</span>
                          </div>
                          <div className="px-2 py-1" style={{ background:'#0d0d0d' }}>
                            <p className="text-[7px] text-gray-600 truncate">{f.label}</p>
                          </div>
                        </div>
                      ))}
                      {sf.length > 6 && (
                        <div className="flex-shrink-0 rounded-xl border border-white/8 flex items-center justify-center text-gray-700 text-[9px] font-bold"
                          style={{ width:60, background:'#0d0d0d' }}>
                          +{sf.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Bottom bar ── */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-t border-white/6 flex-shrink-0" style={{ background:'rgba(0,0,0,0.3)' }}>
            <button className="text-[8px] text-[#94A3B8] hover:text-white transition-colors">⌨️ Shortcuts</button>
            <div className="w-px h-4 bg-white/8"/>
            {[
              { label:'New Scene',     fn:()=>{} },
              { label:'Duplicate',     fn:()=>{} },
              { label:'Delete',        fn:()=>{} },
              { label:'Move',          fn:()=>{} },
              { label:'Copy Frames',   fn:()=>{} },
              { label:'Paste Frames',  fn:()=>{} },
              { label:'Lock Scene',    fn:()=>{} },
            ].map(a => (
              <button key={a.label} onClick={a.fn}
                className="px-2 py-1 rounded-lg text-[8px] font-semibold border border-white/8 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all">
                {a.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <p className="text-[7px] font-bold text-gray-500">SCENE PROGRESS</p>
              <div className="w-24 h-1.5 rounded-full bg-white/8">
                <div className="h-full rounded-full transition-all"
                  style={{ width:`${(frames.filter(f=>genDone.has(f.key)).length / Math.max(frames.length,1))*100}%`, background:ACCENT }}/>
              </div>
              <span className="text-[7px] font-mono text-gray-400">
                {frames.filter(f=>genDone.has(f.key)).length}/{frames.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI Actions (196px) ── */}
        <div className="w-48 flex-shrink-0 border-l border-white/6 flex flex-col overflow-hidden"
          style={{ background:'#0a0a0a' }}>
          <div className="px-3 pt-3 pb-2 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">🤖</span>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#94A3B8]">AI Actions</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 px-1 mb-2">Quick Actions</p>
            <div className="space-y-0.5">
              {SB3_AI_ACTIONS.map(a => (
                <button key={a.id} onClick={() => flashAction(a.id, a.section)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all border"
                  style={actionFlash === a.id
                    ? { background:A_SOFT, borderColor:A_BORDER, color:'#6EE7B7' }
                    : { borderColor:'transparent', color:'#94A3B8', transition:'color 150ms ease' }}>
                  <span className="text-sm">{a.icon}</span>
                  <span className="text-[9px] font-semibold">{a.label}</span>
                  {actionFlash === a.id && <FiRefreshCw size={8} className="animate-spin ml-auto" style={{ color:ACCENT }}/>}
                </button>
              ))}
            </div>
          </div>
          <div className="px-3 py-2.5 border-t border-white/5 flex-shrink-0">
            <button onClick={() => setSection('export')}
              className="w-full py-2 rounded-xl text-[9px] font-black transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
              style={{ background:ACCENT, color:'#000' }}>
              📦 Export All Scenes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── IMAGE STUDIO ──────────────────────────────────────────────────────────────
const IMAGE_ENGINES = [
  { id:'comfyui', name:'ComfyUI',      icon:'⚙️', tag:'Recommended',  connected:true  },
  { id:'fooocus', name:'Fooocus',      icon:'🎨', tag:'Beginner',     connected:false },
  { id:'forge',   name:'SD Forge',     icon:'🔧', tag:'Advanced',     connected:false },
  { id:'a1111',   name:'Auto1111',     icon:'🤖', tag:'Classic',      connected:false },
];

const IMG_MODES = ['txt2img','img2img','Inpaint','Outpaint','ControlNet','Upscale','Remove BG','Batch'];

function ImageStudio({ setSection }) {
  const [engine,    setEngine]   = useState('comfyui');
  const [mode,      setMode]     = useState('txt2img');
  const [prompt,    setPrompt]   = useState('');
  const [negPrompt, setNegPrompt]= useState('text, watermark, blurry, low quality');
  const [quality,   setQuality]  = useState('standard');
  const [generating,setGen]      = useState(false);
  const [results,   setResults]  = useState([]);
  const [lora,      setLora]     = useState('');

  function generate() {
    if (!prompt) return;
    setGen(true);
    setResults([]);
    setTimeout(() => {
      setGen(false);
      setResults([
        { id:'g1', emoji:'🖼️', label:'Result 1 — Main', engine, status:'ready' },
        { id:'g2', emoji:'🖼️', label:'Result 2 — Variation A', engine, status:'ready' },
        { id:'g3', emoji:'🖼️', label:'Result 3 — Variation B', engine, status:'ready' },
        { id:'g4', emoji:'🖼️', label:'Result 4 — Wider crop', engine, status:'ready' },
      ]);
    }, 2800);
  }

  return (
    <div className="p-5 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Image Studio</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">ComfyUI is the primary engine · Smart router selects the best tool per task</p>
        </div>
      </div>

      {/* Engine selector */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Engine</p>
        <div className="grid grid-cols-4 gap-2">
          {IMAGE_ENGINES.map(e => (
            <button key={e.id} onClick={() => setEngine(e.id)}
              className="p-3 rounded-xl border text-left transition-all"
              style={engine === e.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor:'rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{e.icon}</span>
                {e.connected
                  ? <span className="text-[7px] font-black px-1 py-0.5 rounded" style={{ background:'rgba(16,185,129,0.15)', color: ACCENT }}>ON</span>
                  : <span className="text-[7px] font-black px-1 py-0.5 rounded bg-white/5 text-gray-700">OFF</span>}
              </div>
              <p className="text-[9px] font-bold text-white">{e.name}</p>
              <p className="text-[7px] text-gray-700">{e.tag}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Mode</p>
        <div className="flex gap-1.5 flex-wrap">
          {IMG_MODES.map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border transition-all"
              style={mode === m
                ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
                : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts */}
      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Cinematic wide shot, South Bronx 1973, golden hour light, 16mm film grain, documentary style, 4K…"
          rows={4}
          className="w-full text-sm text-gray-300 bg-white/3 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none focus:border-emerald-500/30 placeholder-gray-700 font-mono"
        />
        <input
          value={negPrompt}
          onChange={e => setNegPrompt(e.target.value)}
          placeholder="Negative prompt…"
          className="w-full text-xs text-gray-500 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 outline-none focus:border-white/15 placeholder-gray-700 font-mono"
        />
        <input
          value={lora}
          onChange={e => setLora(e.target.value)}
          placeholder="LoRA model (optional) — e.g. documentary_film_v2.safetensors"
          className="w-full text-xs text-gray-500 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 outline-none focus:border-white/15 placeholder-gray-700 font-mono"
        />
      </div>

      {/* Quality + Generate */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {QUALITY_MODES.map(q => (
            <button key={q.id} onClick={() => setQuality(q.id)}
              className="px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border transition-all"
              style={quality === q.id
                ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
                : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
              {q.icon} {q.name}
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={generating || !prompt}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all hover:brightness-110 disabled:opacity-40"
          style={{ background: ACCENT, color:'#000' }}>
          {generating ? <><FiRefreshCw size={13} className="animate-spin"/> Generating via {engine}…</> : <><FiZap size={13}/> Generate Image</>}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Generated Results</p>
            <div className="grid grid-cols-4 gap-2">
              {results.map((r, i) => (
                <div key={r.id} className="rounded-xl overflow-hidden border border-white/8">
                  <div className="aspect-video bg-white/3 flex items-center justify-center relative"
                    style={{ background:`linear-gradient(135deg, hsl(${i*40},30%,8%) 0%, hsl(${i*40+30},20%,5%) 100%)` }}>
                    <span className="text-2xl opacity-40">{r.emoji}</span>
                    <StatusBadge status="ready"/>
                  </div>
                  <div className="p-2">
                    <p className="text-[8px] text-gray-600 truncate">{r.label}</p>
                    <div className="flex gap-1 mt-1.5">
                      {[
                        { label:'⬆️', action: () => {} },
                        { label:'🖼️', action: () => {} },
                        { label:'📹', action: () => setSection('img2video') },
                        { label:'✂️', action: () => setSection('editor') },
                      ].map((btn, bi) => (
                        <button key={bi} onClick={btn.action}
                          className="flex-1 py-1 rounded text-[8px] border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ProvenanceChain items={['Script', 'Scene 01', 'Image Prompt 01A', `Image 01A (${engine})`, 'Asset Library']}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── IMAGE-TO-VIDEO STUDIO ─────────────────────────────────────────────────────
function Img2VideoStudio({ setSection }) {
  const [model,    setModel]    = useState('wan');
  const [animMode, setAnimMode] = useState('zoom');
  const [duration, setDuration] = useState(6);
  const [fps,      setFps]      = useState(24);
  const [gen,      setGen]      = useState(false);
  const [result,   setResult]   = useState(false);

  function generate() {
    setGen(true);
    setResult(false);
    setTimeout(() => { setGen(false); setResult(true); }, 3200);
  }

  return (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      <div>
        <h2 className="text-sm font-black text-white">Image-to-Video Studio</h2>
        <p className="text-[10px] text-gray-600 mt-0.5">ComfyUI routes to the best video model · All models run locally</p>
      </div>

      {/* Model selector */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Video Model</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {VIDEO_MODELS.map(m => (
            <button key={m.id} onClick={() => m.ready && setModel(m.id)} disabled={!m.ready}
              className="p-3 rounded-xl border text-left transition-all disabled:opacity-40"
              style={model === m.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor:'rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black text-white">{m.name}</span>
                {m.ready
                  ? <span className="text-[7px] font-black px-1 py-0.5 rounded" style={{ background:'rgba(16,185,129,0.15)', color: ACCENT }}>Ready</span>
                  : <span className="text-[7px] text-gray-700">Soon</span>}
              </div>
              <p className="text-[8px] text-gray-600">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Animation mode */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Animation Mode</p>
        <div className="grid grid-cols-4 gap-2">
          {ANIMATE_MODES.map(a => (
            <button key={a.id} onClick={() => setAnimMode(a.id)}
              className="flex flex-col items-center p-2.5 rounded-xl border text-center transition-all"
              style={animMode === a.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor:'rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
              <span className="text-lg mb-1">{a.icon}</span>
              <p className="text-[8px] font-bold text-white leading-tight">{a.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Duration + FPS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">Duration: {duration}s</p>
          <input type="range" min={2} max={30} value={duration} onChange={e => setDuration(+e.target.value)}
            className="w-full accent-emerald-500"/>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-2">FPS: {fps}</p>
          <div className="flex gap-1.5">
            {[12,24,30,60].map(f => (
              <button key={f} onClick={() => setFps(f)}
                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold border transition-all"
                style={fps === f
                  ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
                  : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate */}
      <button onClick={generate} disabled={gen}
        className="w-full py-3 rounded-xl text-sm font-black transition-all hover:brightness-110 disabled:opacity-50"
        style={{ background: ACCENT, color:'#000' }}>
        {gen ? <><FiRefreshCw size={13} className="animate-spin inline mr-2"/>Generating via ComfyUI + {VIDEO_MODELS.find(m=>m.id===model)?.name}…</> : `🎬 Animate — ${animMode} · ${duration}s · ${fps}fps`}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            className="p-4 rounded-2xl border"
            style={{ borderColor: A_BORDER, background: A_SOFT }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📽️</span>
              <div className="flex-1">
                <p className="text-xs font-black text-white">Clip Generated — {duration}s · {fps}fps</p>
                <ProvenanceChain items={['Image 01A', `ComfyUI/${VIDEO_MODELS.find(m=>m.id===model)?.name}`, 'Clip 01A', 'Asset Library']}/>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSection('editor')}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110"
                  style={{ background: ACCENT, color:'#000' }}>
                  Send to Editor
                </button>
                <button className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/10 text-gray-400 hover:text-white transition-all">
                  <FiDownload size={11}/>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── VIDEO EDITOR DOLL ─────────────────────────────────────────────────────────
// ── VIDEO EDITOR 2.0 — DaVinci-style layout ──────────────────────────────────

const ED_TRACK_COLOR = {
  video:'#10B981', image:'#60A5FA', text:'#FBBF24', voice:'#8B5CF6',
  music:'#F97316', sfx:'#EC4899',  anim:'#06B6D4',  camera:'#84CC16',
  color:'#E879F9', trans:'#94A3B8',
};

const EDITOR_TRACKS = [
  { id:'v1',   type:'video',  label:'Video 1',       clips:[
    {id:'c1',label:'🏙️ Bronx 1973',   x:0,   w:140,emoji:'🏙️'},
    {id:'c2',label:'🎧 Kool Herc',    x:148, w:130,emoji:'🎧'},
    {id:'c3',label:'🎉 Block Party',  x:286, w:120,emoji:'🎉'},
    {id:'c4',label:'🎤 4 Elements',   x:414, w:110,emoji:'🎤'},
    {id:'c5',label:'🌍 Global',       x:532, w:130,emoji:'🌍'},
  ]},
  { id:'v2',   type:'video',  label:'Video 2',       clips:[
    {id:'b1',label:'📽️ B-Roll Street',x:90,  w:70, emoji:'📽️'},
    {id:'b2',label:'📽️ Archive',      x:250, w:55, emoji:'📽️'},
  ]},
  { id:'v3',   type:'video',  label:'Video 3',       clips:[] },
  { id:'img',  type:'image',  label:'Images',        clips:[
    {id:'i1',label:'🖼️ Bronx Wide',  x:0,   w:60, emoji:'🖼️'},
    {id:'i2',label:'🖼️ Turntable',   x:148, w:55, emoji:'🖼️'},
    {id:'i3',label:'🖼️ Block Party', x:286, w:55, emoji:'🖼️'},
    {id:'i4',label:'🖼️ 4 Elements',  x:414, w:55, emoji:'🖼️'},
  ]},
  { id:'anim', type:'anim',   label:'Animation',     clips:[
    {id:'an1',label:'✨ Title Card',  x:0,   w:50, emoji:'✨'},
    {id:'an2',label:'✨ Lower 3rd',   x:148, w:40, emoji:'✨'},
  ]},
  { id:'cap',  type:'text',   label:'Captions',      clips:[
    {id:'t1',label:'💬 SC01',x:0,   w:140,emoji:'💬'},
    {id:'t2',label:'💬 SC02',x:148, w:130,emoji:'💬'},
    {id:'t3',label:'💬 SC03',x:286, w:120,emoji:'💬'},
    {id:'t4',label:'💬 SC04',x:414, w:110,emoji:'💬'},
    {id:'t5',label:'💬 SC05',x:532, w:130,emoji:'💬'},
  ]},
  { id:'vo',   type:'voice',  label:'Voice-over',    clips:[
    {id:'v1a',label:'🎙️ Full VO',    x:0,   w:662,emoji:'🎙️'},
  ]},
  { id:'mus',  type:'music',  label:'Music',         clips:[
    {id:'m1',label:'🎵 Tension',     x:0,   w:200,emoji:'🎵'},
    {id:'m2',label:'🎵 Funk Break',  x:208, w:200,emoji:'🎵'},
    {id:'m3',label:'🎵 Triumph',     x:416, w:246,emoji:'🎵'},
  ]},
  { id:'sfx',  type:'sfx',    label:'Sound Effects', clips:[
    {id:'s1',label:'🔊 Sirens',      x:20,  w:30, emoji:'🔊'},
    {id:'s2',label:'🔊 Scratch',     x:148, w:20, emoji:'🔊'},
    {id:'s3',label:'🔊 Crowd',       x:532, w:40, emoji:'🔊'},
  ]},
  { id:'a2',   type:'voice',  label:'Audio 2',       clips:[] },
  { id:'cam',  type:'camera', label:'Camera Motion', clips:[
    {id:'cm1',label:'🎥 Ken Burns',  x:0,   w:140,emoji:'🎥'},
    {id:'cm2',label:'🎥 Rack Focus', x:148, w:130,emoji:'🎥'},
    {id:'cm3',label:'🎥 Push In',    x:286, w:120,emoji:'🎥'},
  ]},
  { id:'clr',  type:'color',  label:'Color Grade',   clips:[
    {id:'cg1',label:'🎨 Gritty Film',x:0,   w:662,emoji:'🎨'},
  ]},
  { id:'trs',  type:'trans',  label:'Transitions',   clips:[
    {id:'tr1',label:'✂️',x:140,w:8,emoji:'✂️'},
    {id:'tr2',label:'🌫️',x:278,w:8,emoji:'🌫️'},
    {id:'tr3',label:'✂️',x:406,w:8,emoji:'✂️'},
    {id:'tr4',label:'🌫️',x:564,w:8,emoji:'🌫️'},
  ]},
];

const AR_PRESETS = [
  {id:'16:9',label:'16:9',sub:'YouTube',  w:16,h:9 },
  {id:'9:16',label:'9:16',sub:'Shorts',   w:9, h:16},
  {id:'1:1', label:'1:1', sub:'Instagram',w:1, h:1 },
  {id:'4:5', label:'4:5', sub:'Facebook', w:4, h:5 },
];
const RESOLUTIONS    = ['480p','720p','1080p','4K'];
const RENDER_QUALTYS = [{id:'draft',label:'Draft'},{id:'balanced',label:'Balanced'},{id:'final',label:'Final'}];
const ED_DURATION    = 240;

function VideoEditorDoll({ project, setSection }) {
  const proj = project || MOCK_PROJECT;

  // Playback
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [timecode,     setTimecode]     = useState(0);
  const playRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setTimecode(t => {
          const n = parseFloat((t + 0.1).toFixed(1));
          if (n >= ED_DURATION) { setIsPlaying(false); return 0; }
          return n;
        });
      }, 100);
    } else {
      clearInterval(playRef.current);
    }
    return () => clearInterval(playRef.current);
  }, [isPlaying]);

  // Preview
  const [aspectRatio,   setAspectRatio]   = useState('16:9');
  const [resolution,    setResolution]    = useState('1080p');
  const [renderQuality, setRenderQuality] = useState('draft');
  const [showSafeArea,  setShowSafeArea]  = useState(false);
  const [previewTab,    setPreviewTab]    = useState('preview');

  // Asset panel
  const [assetTab, setAssetTab] = useState('images');

  // Timeline
  const [zoom,         setZoom]         = useState(1);
  const [muted,        setMuted]        = useState({});
  const [locked,       setLocked]       = useState({});
  const [selectedClip, setSelectedClip] = useState(null);

  function fmtTC(s) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    const sc = Math.floor(s % 60),  f = Math.floor((s % 1) * 30);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}:${String(f).padStart(2,'0')}`;
  }

  const currentScene = proj.scenes?.find((_,i) => timecode >= i*48 && timecode < (i+1)*48) || proj.scenes?.[0];

  // Contextual inspector
  function InspectorPanel() {
    if (!selectedClip) return (
      <div className="space-y-3">
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1.5">Scenes</p>
          {proj.scenes?.map((sc,i) => (
            <button key={sc.id} onClick={() => setTimecode(i*48)}
              className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/4 transition-all text-left group">
              <span className="text-xs">{sc.emoji}</span>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors leading-none truncate">{sc.num} · {sc.title}</p>
                <p className="text-[7px] mt-0.5" style={{color: sc.status.editor==='placed' ? ACCENT : '#F59E0B'}}>
                  {sc.status.editor==='placed' ? '✓ on timeline' : '⚠ not placed'}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1.5">AI Suggestions</p>
          {[
            '🎨 Add color grade to SC02 — low contrast',
            '🔊 Voice clip at 2:14 peaks too high',
            '✂️ Cut 0.8s from transition at 1:08',
            '💡 SC05 needs a music swell for ending',
          ].map((s,i) => (
            <div key={i} className="text-[8px] text-gray-600 py-1.5 px-2 rounded-lg bg-white/2 border border-white/5 mb-1 leading-relaxed">{s}</div>
          ))}
        </div>
      </div>
    );

    const t = selectedClip.trackType;

    if (t === 'image') return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Image</p>
          <button onClick={() => setSelectedClip(null)} className="text-[7px] text-gray-700 hover:text-gray-400">✕ clear</button>
        </div>
        <p className="text-[10px] font-bold text-white truncate">{selectedClip.label}</p>
        <div>
          <p className="text-[7px] text-gray-700 mb-1">Image Prompt</p>
          <textarea rows={3} className="w-full text-[8px] text-gray-400 bg-white/3 border border-white/8 rounded-lg px-2 py-1.5 resize-none outline-none focus:border-emerald-500/30"
            defaultValue={currentScene?.imagePrompt || ''}/>
        </div>
        {[
          {label:'🔄 Regenerate', primary:true},
          {label:'⬆️ Upscale 4×'},
          {label:'🖌️ Inpaint Region'},
          {label:'↔️ Outpaint Extend'},
          {label:'🎬 Animate This'},
          {label:'🗑️ Remove from Timeline'},
        ].map(b => (
          <button key={b.label}
            className="w-full py-1.5 rounded-lg text-[9px] font-bold border transition-all text-left px-2.5"
            style={b.primary ? {background:A_SOFT,borderColor:A_BORDER,color:'#6EE7B7'} : {borderColor:'rgba(255,255,255,0.08)',color:'#6B7280'}}>
            {b.label}
          </button>
        ))}
      </div>
    );

    if (t === 'video') return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Video Clip</p>
          <button onClick={() => setSelectedClip(null)} className="text-[7px] text-gray-700 hover:text-gray-400">✕</button>
        </div>
        <p className="text-[10px] font-bold text-white truncate mb-2">{selectedClip.label}</p>
        {[['Speed','1.0×'],['Crop','None'],['Stabilize',null],['Motion Blur',null],['Color Correct',null],['Add Keyframe',null],['Effects',null]].map(([label,val]) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
            <span className="text-[9px] text-gray-600">{label}</span>
            {val
              ? <span className="text-[9px] font-mono text-gray-400">{val}</span>
              : <button className="text-[8px] px-2 py-0.5 rounded border border-white/10 text-gray-700 hover:text-gray-300 transition-all">Edit</button>
            }
          </div>
        ))}
      </div>
    );

    // audio / voice / music / sfx / camera / color
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Audio</p>
          <button onClick={() => setSelectedClip(null)} className="text-[7px] text-gray-700 hover:text-gray-400">✕</button>
        </div>
        <p className="text-[10px] font-bold text-white truncate mb-2">{selectedClip.label}</p>
        {['🧹 Noise Removal','📊 Normalize','🎚️ EQ','🗜️ Compressor','✨ Voice Enhance','🎙️ ElevenLabs Sync','↗️ Open in Audacity'].map(s => (
          <button key={s} className="w-full py-1.5 rounded-lg text-[9px] font-semibold border border-white/8 text-gray-600 hover:text-gray-300 hover:border-white/15 transition-all text-left px-2.5">{s}</button>
        ))}
      </div>
    );
  }

  // Asset panel
  function AssetContent() {
    const a = proj.assets || {};
    const map = {images:a.images||[],videos:a.videos||[],audio:a.audio||[],music:[]};
    const items = map[assetTab] || [];
    if (!items.length) return (
      <div className="flex-1 flex items-center justify-center py-4">
        <p className="text-[8px] text-gray-800">No {assetTab} yet</p>
      </div>
    );
    return (
      <div className="p-2 grid grid-cols-2 gap-1 content-start">
        {items.map(item => (
          <button key={item.id}
            onClick={() => setSelectedClip({clipId:item.id, trackType:assetTab==='images'?'image':assetTab==='videos'?'video':'voice', label:item.name||item.id})}
            className="relative rounded-lg border border-white/8 hover:border-white/25 bg-white/3 flex flex-col items-center justify-center gap-0.5 transition-all group"
            style={{aspectRatio:'16/9',minHeight:40}}>
            <span className="text-lg">{item.emoji||'🎞️'}</span>
            <p className="text-[6px] text-gray-700 px-1 text-center truncate w-full">{item.name||item.id}</p>
            <div className="absolute inset-0 rounded-lg bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">+ Add</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Preview box geometry
  const arPreset = AR_PRESETS.find(a => a.id === aspectRatio) || AR_PRESETS[0];
  const maxPvH = 210, maxPvW = 370;
  let pvW = maxPvH * (arPreset.w / arPreset.h), pvH = maxPvH;
  if (pvW > maxPvW) { pvW = maxPvW; pvH = maxPvW * (arPreset.h / arPreset.w); }

  return (
    <div className="flex flex-col overflow-hidden" style={{height:'calc(100vh - 96px)',minHeight:660}}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-b border-white/6" style={{background:'rgba(0,0,0,0.35)'}}>
        <div>
          <h2 className="text-sm font-black text-white">Video Editor Doll</h2>
          <p className="text-[9px] text-gray-600">Smart Creator Studio · DaVinci-style layout</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Render quality toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-white/8 p-0.5">
            {RENDER_QUALTYS.map(q => (
              <button key={q.id} onClick={() => setRenderQuality(q.id)}
                className="px-2 py-0.5 rounded text-[8px] font-bold transition-all"
                style={renderQuality===q.id ? {background:A_SOFT,color:'#6EE7B7'} : {color:'#374151'}}>
                {q.label}
              </button>
            ))}
          </div>
          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom(z => Math.max(0.4,parseFloat((z-0.2).toFixed(1))))}
              className="px-1.5 py-0.5 text-[9px] border border-white/10 rounded text-gray-600 hover:text-white transition-all">−</button>
            <span className="text-[8px] font-mono text-gray-600 w-8 text-center">{Math.round(zoom*100)}%</span>
            <button onClick={() => setZoom(z => Math.min(4,parseFloat((z+0.2).toFixed(1))))}
              className="px-1.5 py-0.5 text-[9px] border border-white/10 rounded text-gray-600 hover:text-white transition-all">+</button>
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-bold border border-white/10 text-gray-400 hover:text-white transition-all">
            <FiExternalLink size={10}/> Kdenlive
          </button>
        </div>
      </div>

      {/* ── THREE PANELS ── */}
      <div className="flex flex-shrink-0 overflow-hidden" style={{height:320,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>

        {/* LEFT – Asset Panel */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{width:168,borderRight:'1px solid rgba(255,255,255,0.06)'}}>
          {/* Tab bar */}
          <div className="flex flex-shrink-0 border-b border-white/6">
            {[{id:'images',e:'🖼️'},{id:'videos',e:'🎬'},{id:'audio',e:'🎙️'},{id:'music',e:'🎵'}].map(t => (
              <button key={t.id} onClick={() => setAssetTab(t.id)}
                className="flex-1 py-1.5 text-sm transition-all relative"
                style={assetTab===t.id ? {color:'#6EE7B7'} : {color:'#2D3748'}}>
                {t.e}
                {assetTab===t.id && <div className="absolute bottom-0 left-1 right-1 h-px rounded-full" style={{background:ACCENT}}/>}
              </button>
            ))}
          </div>
          <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 px-2 pt-1.5 pb-0.5 flex-shrink-0 capitalize">{assetTab}</p>
          <div className="flex-1 overflow-y-auto">
            <AssetContent/>
          </div>
        </div>

        {/* CENTER – Video Preview Monitor */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-black overflow-hidden">

          {/* Aspect ratio selector */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10 bg-black/60 rounded-lg p-0.5 border border-white/8">
            {AR_PRESETS.map(ar => (
              <button key={ar.id} onClick={() => setAspectRatio(ar.id)}
                className="px-2 py-0.5 rounded text-[7px] font-bold transition-all"
                style={aspectRatio===ar.id ? {background:A_SOFT,color:'#6EE7B7'} : {color:'#374151'}}>
                {ar.label}
              </button>
            ))}
          </div>

          {/* Monitor */}
          <div className="relative rounded-lg overflow-hidden border border-white/25 shadow-2xl"
            style={{width:pvW,height:pvH,transition:'width 0.2s,height 0.2s'}}>

            {/* Scene content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{background:'linear-gradient(135deg,#0d1117 0%,#1a1a2e 60%,#0d1117 100%)'}}>
              <span className="text-4xl opacity-35">{currentScene?.emoji||'🎬'}</span>
              <p className="text-[7px] font-mono text-gray-700 mt-1 px-3 text-center leading-tight">{currentScene?.title}</p>
            </div>

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)'}}/>

            {/* Safe area guides */}
            {showSafeArea && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border border-white/20" style={{inset:'5%'}}/>
                <div className="absolute border border-white/10 border-dashed" style={{inset:'10%'}}/>
              </div>
            )}

            {/* HUD – timecode */}
            <div className="absolute top-1.5 left-1.5 bg-black/75 rounded px-1.5 py-0.5">
              <span className="text-[7px] font-mono text-white/65 tabular-nums">{fmtTC(timecode)}</span>
            </div>

            {/* HUD – resolution */}
            <div className="absolute top-1.5 right-1.5 bg-black/75 rounded px-1.5 py-0.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full" style={{background: renderQuality==='final' ? ACCENT : '#374151'}}/>
              <span className="text-[6px] font-mono text-white/35">{resolution}</span>
            </div>

            {/* HUD – render mode */}
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying?'animate-pulse':''}`}
                style={{background: isPlaying ? ACCENT : '#374151'}}/>
              <span className="text-[6px] font-mono" style={{color: isPlaying ? '#6EE7B7' : '#4B5563'}}>
                {renderQuality.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Audio meter */}
          <div className="absolute right-3 flex flex-col-reverse gap-px" style={{top:'50%',transform:'translateY(-50%)'}}>
            {Array.from({length:14}).map((_,i) => (
              <div key={i} className="w-1.5 rounded-sm transition-all duration-75"
                style={{
                  height:3,
                  background: isPlaying
                    ? i<3 ? '#EF4444' : i<5 ? '#F59E0B' : ACCENT
                    : 'rgba(255,255,255,0.05)',
                  opacity: isPlaying ? Math.max(0.1, 1-i*0.055) : 0.25,
                }}/>
            ))}
            <span className="text-[5px] text-gray-700 mt-1 text-center">dB</span>
          </div>

          {/* Safe area + fullscreen toggles */}
          <div className="absolute left-2 flex flex-col gap-1" style={{bottom:52}}>
            <button onClick={() => setShowSafeArea(s => !s)} title="Safe area guides"
              className="w-5 h-5 rounded border text-[9px] transition-all flex items-center justify-center"
              style={showSafeArea ? {background:A_SOFT,borderColor:A_BORDER,color:'#6EE7B7'} : {borderColor:'rgba(255,255,255,0.10)',color:'#374151'}}>
              ⊟
            </button>
            <button title="Fullscreen preview"
              className="w-5 h-5 rounded border border-white/10 text-[9px] text-gray-700 hover:text-white transition-all flex items-center justify-center">
              ⛶
            </button>
          </div>

          {/* Playback controls */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <button onClick={() => setTimecode(t => Math.max(0,parseFloat((t-1/30).toFixed(3))))}
              className="w-6 h-6 rounded flex items-center justify-center border border-white/10 text-gray-600 hover:text-white hover:bg-white/4 transition-all text-[11px]">
              ⏮
            </button>
            <button onClick={() => setIsPlaying(p => !p)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:brightness-110"
              style={{background:A_SOFT,borderColor:A_BORDER,color:'#6EE7B7'}}>
              {isPlaying ? <FiPause size={13}/> : <FiPlay size={13}/>}
            </button>
            <button onClick={() => {setIsPlaying(false);setTimecode(0);}}
              className="w-6 h-6 rounded flex items-center justify-center border border-white/10 text-gray-600 hover:text-white hover:bg-white/4 transition-all text-[11px]">
              ■
            </button>
            <button onClick={() => setTimecode(t => Math.min(ED_DURATION,parseFloat((t+1/30).toFixed(3))))}
              className="w-6 h-6 rounded flex items-center justify-center border border-white/10 text-gray-600 hover:text-white hover:bg-white/4 transition-all text-[11px]">
              ⏭
            </button>
          </div>
        </div>

        {/* RIGHT – Contextual Inspector */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{width:188,borderLeft:'1px solid rgba(255,255,255,0.06)'}}>
          <div className="flex items-center px-3 h-8 border-b border-white/6 flex-shrink-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Inspector</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <InspectorPanel/>
          </div>
          {/* Output resolution */}
          <div className="px-2 py-2 border-t border-white/6 flex-shrink-0">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-1">Output Resolution</p>
            <div className="grid grid-cols-4 gap-0.5">
              {RESOLUTIONS.map(r => (
                <button key={r} onClick={() => setResolution(r)}
                  className="py-1 rounded text-[7px] font-bold transition-all"
                  style={resolution===r ? {background:A_SOFT,color:'#6EE7B7'} : {color:'#374151'}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PREVIEW TABS + TIMECODE SCRUB ── */}
      <div className="flex items-center flex-shrink-0 border-b border-white/6 px-1"
        style={{height:30,background:'rgba(0,0,0,0.4)'}}>
        <div className="flex">
          {['preview','scopes','audio mixer','metadata','inspector'].map(tab => (
            <button key={tab} onClick={() => setPreviewTab(tab)}
              className="px-2.5 h-8 text-[9px] font-bold capitalize whitespace-nowrap transition-all relative"
              style={previewTab===tab ? {color:'#6EE7B7'} : {color:'#2D3748'}}>
              {tab}
              {previewTab===tab && <div className="absolute bottom-0 left-1 right-1 h-px rounded-full" style={{background:ACCENT}}/>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto pr-2">
          <input type="range" min={0} max={ED_DURATION} step={0.1} value={timecode}
            onChange={e => {setIsPlaying(false);setTimecode(parseFloat(e.target.value));}}
            className="w-24 h-1 cursor-pointer accent-emerald-500"/>
          <span className="text-[8px] font-mono text-gray-600 tabular-nums">{fmtTC(timecode)}</span>
          <span className="text-[7px] text-gray-800">/</span>
          <span className="text-[8px] font-mono text-gray-700">{fmtTC(ED_DURATION)}</span>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="flex-1 min-h-0 overflow-auto" style={{background:'rgba(0,0,0,0.15)'}}>
        <div style={{minWidth:Math.max(780, 660*zoom+142)}}>

          {/* Time ruler */}
          <div className="flex items-end border-b border-white/5 sticky top-0 z-10"
            style={{height:22,paddingLeft:134,background:'rgba(0,0,0,0.88)'}}>
            {Array.from({length:9}).map((_,i) => {
              const t = i*30;
              return (
                <div key={t} className="relative flex-shrink-0" style={{width:75*zoom}}>
                  <span className="absolute left-0 bottom-1 text-[6px] font-mono text-gray-700 leading-none">
                    {`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`}
                  </span>
                  <div className="absolute left-0 inset-y-0 w-px bg-white/4"/>
                </div>
              );
            })}
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-px pointer-events-none z-20"
              style={{left: 134 + (timecode/ED_DURATION)*675*zoom, background:ACCENT}}>
              <div className="w-2.5 h-2 -translate-x-[4px]" style={{background:ACCENT,clipPath:'polygon(0 0,100% 0,50% 100%)'}}/>
            </div>
          </div>

          {/* Track rows */}
          {EDITOR_TRACKS.map(track => {
            const col = ED_TRACK_COLOR[track.type] || '#6B7280';
            return (
              <div key={track.id} className="flex border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.008] transition-all"
                style={{height:36}}>
                {/* Label */}
                <div className="flex items-center gap-1.5 px-2 flex-shrink-0 border-r border-white/5"
                  style={{width:126}}>
                  <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{background:col}}/>
                  <span className="text-[8px] font-bold text-gray-600 truncate flex-1">{track.label}</span>
                  <div className="flex gap-0.5">
                    <button onClick={() => setMuted(p => ({...p,[track.id]:!p[track.id]}))}
                      className="w-4 h-4 rounded border flex items-center justify-center text-[7px] font-black transition-all"
                      style={muted[track.id] ? {color:'#EF4444',borderColor:'rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)'} : {color:'#2D3748',borderColor:'rgba(255,255,255,0.06)'}}>
                      M
                    </button>
                    <button onClick={() => setLocked(p => ({...p,[track.id]:!p[track.id]}))}
                      className="w-4 h-4 rounded border flex items-center justify-center text-[7px] font-black transition-all"
                      style={locked[track.id] ? {color:'#F59E0B',borderColor:'rgba(245,158,11,0.3)',background:'rgba(245,158,11,0.08)'} : {color:'#2D3748',borderColor:'rgba(255,255,255,0.06)'}}>
                      L
                    </button>
                  </div>
                </div>

                {/* Clips */}
                <div className="flex-1 relative">
                  {track.clips.length === 0 && (
                    <span className="absolute inset-0 flex items-center px-3 text-[6px] text-gray-800 pointer-events-none">Drop clips here</span>
                  )}
                  {track.clips.map(clip => {
                    const isSel = selectedClip?.clipId === clip.id;
                    return (
                      <button key={clip.id}
                        onClick={() => setSelectedClip({clipId:clip.id,trackType:track.type,label:clip.label})}
                        className="absolute top-1 rounded overflow-hidden flex items-center gap-1 px-1.5 transition-all hover:brightness-125"
                        style={{
                          left: clip.x*zoom + 8,
                          width: Math.max(clip.w*zoom - 4, 14),
                          height: 26,
                          background: `${col}18`,
                          border: isSel ? `1.5px solid ${col}` : `1px solid ${col}30`,
                          opacity: muted[track.id] ? 0.18 : 1,
                          outline: isSel ? `1px solid ${col}40` : 'none',
                          outlineOffset: 1,
                        }}>
                        <span className="text-[9px] flex-shrink-0 leading-none">{clip.emoji}</span>
                        {clip.w*zoom > 52 && (
                          <span className="text-[7px] font-semibold truncate leading-none" style={{color:col}}>
                            {clip.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── EXPORT BAR ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0 overflow-x-auto scrollbar-none border-t border-white/8"
        style={{background:'rgba(0,0,0,0.55)'}}>
        {[
          {label:'Export 16:9 YouTube',icon:'🎬',primary:true},
          {label:'Export Shorts',      icon:'📱'},
          {label:'Export Audio',       icon:'🎵'},
          {label:'Export Thumbnail',   icon:'🖼️'},
          {label:'Export Project',     icon:'📦'},
          {label:'Send to Kdenlive',   icon:'☁️'},
          {label:'Send to Blender',    icon:'☁️'},
          {label:'Render with FFmpeg', icon:'🚀'},
        ].map(b => (
          <button key={b.label}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-bold whitespace-nowrap border transition-all hover:brightness-110 flex-shrink-0"
            style={b.primary
              ? {background:A_SOFT,borderColor:A_BORDER,color:'#6EE7B7'}
              : {borderColor:'rgba(255,255,255,0.08)',color:'#4B5563'}}>
            {b.icon} {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── AUDIO / MUSIC EDITOR DOLL ─────────────────────────────────────────────────
function AudioMusicEditor({ setSection }) {
  const [recording, setRecording] = useState(false);
  const [recFlash,  flashRec]     = useFlash(3000);

  return (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      <div>
        <h2 className="text-sm font-black text-white">Music / Audio Editor Doll</h2>
        <p className="text-[10px] text-gray-600 mt-0.5">Audacity for cleanup · Ardour for mixing · LMMS for music production</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Voice-over */}
        <SectionCard title="Voice-over">
          <div className="space-y-2">
            {[
              { label:'🎙️ Record', action: () => { setRecording(r => !r); flashRec(); } },
              { label:'📁 Import WAV/MP3', action: () => {} },
              { label:'🧹 Clean Voice', action: () => {} },
              { label:'🔇 Remove Noise', action: () => {} },
              { label:'↗️ Send to Audacity', action: () => {} },
            ].map(b => (
              <button key={b.label} onClick={b.action}
                className="w-full py-2 rounded-xl text-[10px] font-semibold border border-white/8 text-gray-500 hover:text-white hover:border-white/15 transition-all text-left px-3"
                style={recording && b.label.includes('Record') ? { borderColor: A_BORDER, color:'#6EE7B7', background: A_SOFT } : {}}>
                {b.label}
                {recording && b.label.includes('Record') && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"/>}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Music */}
        <SectionCard title="Music">
          <div className="space-y-2">
            {[
              { label:'🎵 Add Music Track', action: () => {} },
              { label:'🥁 Open in LMMS', action: () => {} },
              { label:'🎹 Open in Ardour', action: () => {} },
              { label:'📦 Browse Free Music', action: () => {} },
              { label:'🎚️ Mix Levels', action: () => {} },
            ].map(b => (
              <button key={b.label} onClick={b.action}
                className="w-full py-2 rounded-xl text-[10px] font-semibold border border-white/8 text-gray-500 hover:text-white hover:border-white/15 transition-all text-left px-3">
                {b.label}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Sound FX + export */}
        <SectionCard title="Sound FX + Export">
          <div className="space-y-2">
            {[
              { label:'🔊 Add Sound Effects', action: () => {} },
              { label:'🎛️ Open in Audacity', action: () => {} },
              { label:'💿 Export WAV', action: () => {} },
              { label:'🎧 Export MP3', action: () => {} },
              { label:'✂️ Send to Video Editor', action: () => setSection('editor') },
            ].map(b => (
              <button key={b.label} onClick={b.action}
                className="w-full py-2 rounded-xl text-[10px] font-semibold border border-white/8 text-gray-500 hover:text-white hover:border-white/15 transition-all text-left px-3">
                {b.label}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Waveform placeholder */}
      <SectionCard title="Audio Timeline">
        <div className="flex items-end gap-0.5 h-16 px-2">
          {Array.from({ length: 80 }, (_, i) => (
            <div key={i} className="flex-1 rounded-sm"
              style={{
                height: `${20 + Math.abs(Math.sin(i * 0.4 + 1) * 70)}%`,
                background: `rgba(16,185,129,${0.3 + Math.abs(Math.sin(i * 0.4)) * 0.5})`,
              }}/>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[8px] font-mono text-gray-700">00:00:00</span>
          <span className="text-[8px] font-mono text-gray-700">00:03:24</span>
        </div>
      </SectionCard>
    </div>
  );
}

// ── THUMBNAIL STUDIO ──────────────────────────────────────────────────────────
const THUMB_PLATFORMS = [
  { id:'yt',   name:'YouTube Thumbnail',  w:1280, h:720,  icon:'▶️' },
  { id:'sh',   name:'Shorts Cover',       w:1080, h:1920, icon:'📱' },
  { id:'tk',   name:'TikTok Cover',       w:1080, h:1920, icon:'🎵' },
  { id:'fb',   name:'Facebook Cover',     w:1200, h:630,  icon:'👥' },
  { id:'pod',  name:'Podcast Cover',      w:3000, h:3000, icon:'🎙️' },
  { id:'stream',name:'Streaming Poster',  w:2000, h:3000, icon:'📺' },
];

const THUMB_CONCEPTS = [
  { id:'a', label:'The Question', line1:'WHEN DID', line2:'HIP-HOP BECOME', line3:'YOUR FIRST LOVE?', bg:'linear-gradient(135deg,#0a0a0a,#1a1a2e)', accent:'#D4AF37', ctr:'High', emoji:'❤️' },
  { id:'b', label:'The Statement', line1:"HIP-HOP'S", line2:'UNTOLD ORIGIN', line3:'STORY', bg:'linear-gradient(135deg,#0a0814,#0a180a)', accent:'#10B981', ctr:'Medium-High', emoji:'🎤' },
  { id:'c', label:'The Number', line1:'50 YEARS', line2:'ONE QUESTION', line3:'CHANGED EVERYTHING', bg:'linear-gradient(135deg,#0a0a0a,#0a0a1a)', accent:'#F59E0B', ctr:'Highest', emoji:'🔥' },
];

function ThumbnailSection() {
  const [selected, setSelected] = useState('a');
  const [platform, setPlatform] = useState('yt');
  const [gen, setGen]           = useState(false);
  const [done, setDone]         = useState(false);

  const concept = THUMB_CONCEPTS.find(c => c.id === selected);
  const plat    = THUMB_PLATFORMS.find(p => p.id === platform);

  function generate() {
    setGen(true);
    setTimeout(() => { setGen(false); setDone(true); }, 2000);
  }

  const isVert = plat?.h > plat?.w;
  const ph = isVert ? 120 : 68;
  const pw = isVert ? 68 : 120;

  return (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">Thumbnail Studio</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">AI-generated thumbnail concepts for all 6 platform sizes</p>
        </div>
        <button onClick={generate} disabled={gen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: ACCENT, color:'#000' }}>
          {gen ? <><FiRefreshCw size={10} className="animate-spin"/> Analyzing…</> : <><FiZap size={10}/> Generate Concepts</>}
        </button>
      </div>

      {/* Platform selector */}
      <div className="flex gap-1.5 flex-wrap">
        {THUMB_PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border transition-all"
            style={platform === p.id
              ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
              : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      {/* Concept cards */}
      <div className="space-y-3">
        {THUMB_CONCEPTS.map(c => (
          <div key={c.id} onClick={() => setSelected(c.id)}
            className="flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all"
            style={selected === c.id
              ? { background: A_SOFT, borderColor: A_BORDER }
              : { borderColor:'rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>

            {/* Mini preview */}
            <div className="flex-shrink-0 rounded-xl overflow-hidden border-2 flex items-center justify-center relative"
              style={{ width:pw, height:ph, background:c.bg, borderColor: selected===c.id ? ACCENT : 'rgba(255,255,255,0.10)' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: c.accent }}/>
              <div className="text-center px-2">
                <p className="text-[5px] font-black text-white leading-tight">{c.line1}</p>
                <p className="text-[6px] font-black leading-tight" style={{ color: c.accent }}>{c.line2}</p>
                <div className="text-[8px] mt-0.5">{c.emoji}</div>
              </div>
              {selected === c.id && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: ACCENT }}>
                  <FiCheck size={6} color="#000"/>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-white">{c.label}</p>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: c.ctr==='Highest' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: c.ctr==='Highest' ? ACCENT : '#6B7280' }}>
                  CTR: {c.ctr}
                </span>
              </div>
              <div className="space-y-0.5">
                {[c.line1,c.line2,c.line3].map((l,i) => (
                  <p key={i} className="text-[9px] font-black leading-tight"
                    style={{ color: i===1 ? c.accent : '#fff', opacity: i===2 ? 0.5 : 1 }}>{l}</p>
                ))}
              </div>
              <p className="text-[8px] text-gray-700 mt-1">{plat?.w}×{plat?.h}</p>
            </div>
          </div>
        ))}
      </div>

      {done && (
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-all">
            <FiDownload size={11}/> Export All Sizes
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-amber-400 transition-all">
            <FiStar size={11}/> Save to Brand Kit
          </button>
        </div>
      )}
    </div>
  );
}

// ── ASSET LIBRARY ─────────────────────────────────────────────────────────────
function AssetLibrary({ project, setSection }) {
  const assets = project?.assets || MOCK_PROJECT.assets;
  const [filter, setFilter] = useState('all');
  const allAssets = [
    ...assets.images.map(a => ({ ...a, type:'image' })),
    ...assets.videos.map(a => ({ ...a, type:'video' })),
    ...assets.audio.map(a => ({ ...a, type:'audio' })),
    ...assets.thumbnails.map(a => ({ ...a, type:'thumbnail' })),
  ];
  const filtered = filter === 'all' ? allAssets : allAssets.filter(a => a.type === filter);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-black text-white">Asset Library</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">{allAssets.length} assets · Every asset remembers its origin</p>
        </div>
        <div className="flex gap-1.5">
          {['all','image','video','audio','thumbnail'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border transition-all capitalize"
              style={filter === f
                ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
                : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(asset => (
          <div key={asset.id} className="rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-all">
            {/* Preview */}
            <div className="aspect-video flex items-center justify-center bg-white/3"
              style={{ background:`linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))` }}>
              <span className="text-3xl">{asset.emoji}</span>
            </div>
            {/* Meta */}
            <div className="p-3">
              <p className="text-[10px] font-bold text-white truncate">{asset.name}</p>
              <div className="flex items-center justify-between mt-1">
                <StatusBadge status={asset.status}/>
                <span className="text-[8px] text-gray-700 font-mono capitalize">{asset.type}</span>
              </div>
              {asset.engine && (
                <p className="text-[8px] text-gray-700 mt-1">{asset.engine}</p>
              )}
              {asset.sceneId && (
                <ProvenanceChain items={[asset.sceneId, asset.id]}/>
              )}
              {/* Actions */}
              <div className="flex gap-1 mt-2">
                {asset.type === 'image'  && <button onClick={() => setSection('img2video')} className="flex-1 py-1 rounded-lg text-[8px] border border-white/8 text-gray-600 hover:text-white transition-all">📹 Animate</button>}
                {asset.type === 'video'  && <button onClick={() => setSection('editor')}    className="flex-1 py-1 rounded-lg text-[8px] border border-white/8 text-gray-600 hover:text-white transition-all">✂️ Edit</button>}
                {asset.type === 'audio'  && <button onClick={() => setSection('audio')}     className="flex-1 py-1 rounded-lg text-[8px] border border-white/8 text-gray-600 hover:text-white transition-all">🎵 Mix</button>}
                <button className="py-1 px-1.5 rounded-lg text-[8px] border border-white/8 text-gray-600 hover:text-white transition-all"><FiDownload size={8}/></button>
                <button className="py-1 px-1.5 rounded-lg text-[8px] border border-white/8 text-gray-600 hover:text-white transition-all"><FiStar size={8}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EXPORT CENTER ─────────────────────────────────────────────────────────────
const EXPORT_PLATFORMS = [
  { id:'youtube',   name:'YouTube',             icon:'▶️',  w:1920, h:1080, fps:30, color:'#FF0000' },
  { id:'yt_shorts', name:'YouTube Shorts',      icon:'📱',  w:1080, h:1920, fps:60, color:'#FF0000' },
  { id:'tiktok',    name:'TikTok',              icon:'🎵',  w:1080, h:1920, fps:60, color:'#69C9D0' },
  { id:'ig_reels',  name:'Instagram Reels',     icon:'📷',  w:1080, h:1920, fps:30, color:'#E1306C' },
  { id:'ig_feed',   name:'Instagram Feed',      icon:'🟣',  w:1080, h:1080, fps:30, color:'#833AB4' },
  { id:'fb_video',  name:'Facebook Video',      icon:'👥',  w:1920, h:1080, fps:30, color:'#1877F2' },
  { id:'twitter',   name:'X / Twitter',         icon:'✖️',  w:1280, h:720,  fps:30, color:'#1DA1F2' },
  { id:'linkedin',  name:'LinkedIn',            icon:'💼',  w:1920, h:1080, fps:30, color:'#0A66C2' },
  { id:'pinterest', name:'Pinterest',           icon:'📌',  w:1000, h:1500, fps:30, color:'#E60023' },
  { id:'snapchat',  name:'Snapchat Spotlight',  icon:'👻',  w:1080, h:1920, fps:60, color:'#FFFC00' },
  { id:'streaming', name:'Streaming / EOF TV',  icon:'📺',  w:3840, h:2160, fps:24, color:'#10B981' },
];

function ExportCenter() {
  const [selected,    setSelected]    = useState(new Set(['youtube']));
  const [quality,     setQuality]     = useState('standard');
  const [exporting,   setExporting]   = useState(false);
  const [done,        setDone]        = useState(new Set());

  function toggle(id) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function exportAll() {
    setExporting(true);
    const ids = [...selected];
    ids.forEach((id, i) => setTimeout(() => setDone(p => new Set([...p, id])), (i+1) * 600));
    setTimeout(() => setExporting(false), ids.length * 600 + 400);
  }

  return (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-black text-white">Export Center</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">FFmpeg engine · Export to {EXPORT_PLATFORMS.length} platforms simultaneously</p>
        </div>
        <button onClick={exportAll} disabled={exporting || selected.size === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black transition-all hover:brightness-110 disabled:opacity-40"
          style={{ background: ACCENT, color:'#000' }}>
          {exporting ? <><FiRefreshCw size={10} className="animate-spin"/> Exporting…</> : <><FiZap size={10}/> Export ({selected.size} platforms)</>}
        </button>
      </div>

      {/* Quality */}
      <div className="flex gap-2">
        {QUALITY_MODES.map(q => (
          <button key={q.id} onClick={() => setQuality(q.id)}
            className="flex-1 py-2 rounded-xl text-[9px] font-semibold border transition-all"
            style={quality === q.id
              ? { background: A_SOFT, borderColor: A_BORDER, color:'#6EE7B7' }
              : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
            {q.icon} {q.name}<br/>
            <span className="text-[7px]">{q.steps} steps</span>
          </button>
        ))}
      </div>

      {/* Platform grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {EXPORT_PLATFORMS.map(p => (
          <button key={p.id} onClick={() => toggle(p.id)}
            className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
            style={selected.has(p.id)
              ? { background:`${p.color}10`, borderColor:`${p.color}35` }
              : { borderColor:'rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-base"
              style={{ background:`${p.color}18` }}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
              <p className="text-[8px] font-mono text-gray-700">{p.w}×{p.h} · {p.fps}fps</p>
            </div>
            {done.has(p.id)
              ? <FiCheck size={12} style={{ color: ACCENT, flexShrink:0 }}/>
              : selected.has(p.id)
                ? <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ACCENT }}/>
                : <div className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── INTEGRATIONS PAGE ─────────────────────────────────────────────────────────
function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [testing, setTesting]           = useState(null);
  const [testDone, setTestDone]         = useState({});

  function toggleConnect(id) {
    setIntegrations(p => p.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  }

  function testConnection(id) {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setTestDone(p => ({ ...p, [id]: true }));
      setTimeout(() => setTestDone(p => { const n = {...p}; delete n[id]; return n; }), 3000);
    }, 1500);
  }

  const connected = integrations.filter(i => i.connected).length;

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-black text-white">Integrations</h2>
          <p className="text-[10px] text-gray-600 mt-0.5">
            {connected} of {integrations.length} tools connected · Smart Router selects the best engine per task
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-2.5 py-1.5 rounded-xl" style={{ background: A_SOFT, color:'#6EE7B7', border:`1px solid ${A_BORDER}` }}>
            {connected} Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {integrations.map(intg => (
          <motion.div key={intg.id} layout
            className="p-4 rounded-2xl border transition-all"
            style={intg.connected
              ? { borderColor: A_BORDER, background: A_SOFT }
              : { borderColor:'rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{intg.icon}</span>
                <div>
                  <p className="text-xs font-black text-white">{intg.name}</p>
                  <p className="text-[8px] font-bold" style={{ color: intg.cat === 'Image / Video' ? ACCENT : '#6B7280' }}>
                    {intg.cat}
                  </p>
                </div>
              </div>
              {/* Toggle */}
              <button onClick={() => toggleConnect(intg.id)}
                className="w-9 h-5 rounded-full transition-all flex-shrink-0 relative"
                style={{ background: intg.connected ? ACCENT : 'rgba(255,255,255,0.10)' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: intg.connected ? 'calc(100% - 18px)' : 2 }}/>
              </button>
            </div>

            <p className="text-[9px] text-gray-600 leading-relaxed mb-3">{intg.desc}</p>

            {/* Role */}
            <div className="flex items-center gap-1.5 mb-3">
              <FiLink size={8} className="text-gray-700"/>
              <span className="text-[8px] text-gray-700">{intg.role}</span>
            </div>

            {/* Install path */}
            <div className="mb-3">
              <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-1">Install Path</p>
              <input
                defaultValue={intg.installPath}
                placeholder="/path/to/install"
                className="w-full text-[8px] font-mono text-gray-500 bg-white/4 border border-white/8 rounded-lg px-2 py-1 outline-none focus:border-white/15"
              />
            </div>

            {/* URL (for web tools) */}
            {intg.url && (
              <div className="mb-3">
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-1">API URL</p>
                <input
                  defaultValue={intg.url}
                  className="w-full text-[8px] font-mono text-gray-500 bg-white/4 border border-white/8 rounded-lg px-2 py-1 outline-none focus:border-white/15"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => testConnection(intg.id)}
                disabled={testing === intg.id}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-semibold border border-white/10 text-gray-500 hover:text-white transition-all disabled:opacity-50">
                {testing === intg.id
                  ? <><FiRefreshCw size={7} className="animate-spin"/> Testing…</>
                  : testDone[intg.id]
                    ? <><FiCheck size={7} style={{ color: ACCENT }}/> OK</>
                    : 'Test'}
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-semibold border border-white/10 text-gray-500 hover:text-white transition-all">
                <FiPlay size={7}/> Launch
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-semibold border border-white/10 text-gray-500 hover:text-white transition-all">
                <FiSettings size={7}/> Settings
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-semibold border border-white/10 text-gray-500 hover:text-white transition-all">
                <FiExternalLink size={7}/> Docs
              </button>
            </div>

            {/* Connection status indicator */}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: intg.connected ? ACCENT : '#4B5563', boxShadow: intg.connected ? `0 0 4px ${ACCENT}` : 'none' }}/>
              <span className="text-[8px] font-semibold"
                style={{ color: intg.connected ? ACCENT : '#6B7280' }}>
                {intg.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const [costMode,    setCostMode]    = useState('local');
  const [quality,     setQuality]     = useState('standard');
  const [outputDir,   setOutputDir]   = useState('C:/Users/creator/EOF_Projects');
  const [comfyUrl,    setComfyUrl]    = useState('http://127.0.0.1:8188');
  const [saved, flashSave]            = useFlash();

  return (
    <div className="p-5 space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-sm font-black text-white">Settings</h2>
        <p className="text-[10px] text-gray-600 mt-0.5">Creator Cost System · Default quality · Engine paths</p>
      </div>

      {/* Creator Cost Mode */}
      <SectionCard title="Creator Cost Mode">
        <div className="grid grid-cols-2 gap-2">
          {COST_MODES.map(m => (
            <button key={m.id} onClick={() => setCostMode(m.id)}
              className="p-3 rounded-xl border text-left transition-all"
              style={costMode === m.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor:'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{m.icon}</span>
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded" style={{ background:`${m.color}18`, color:m.color }}>{m.badge}</span>
              </div>
              <p className="text-[10px] font-black text-white">{m.name}</p>
              <p className="text-[8px] text-gray-600 mt-0.5">{m.desc}</p>
              {costMode === m.id && <FiCheck size={10} style={{ color: ACCENT, marginTop:6 }}/>}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Default Quality */}
      <SectionCard title="Default Quality Mode">
        <div className="grid grid-cols-4 gap-2">
          {QUALITY_MODES.map(q => (
            <button key={q.id} onClick={() => setQuality(q.id)}
              className="p-2.5 rounded-xl border text-center transition-all"
              style={quality === q.id
                ? { background: A_SOFT, borderColor: A_BORDER }
                : { borderColor:'rgba(255,255,255,0.08)' }}>
              <div className="text-base mb-0.5">{q.icon}</div>
              <p className="text-[9px] font-bold text-white">{q.name}</p>
              <p className="text-[7px] text-gray-700">{q.steps} steps</p>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Paths */}
      <SectionCard title="Engine Paths">
        {[
          { label:'Output Directory',    val: outputDir,  set: setOutputDir  },
          { label:'ComfyUI API URL',     val: comfyUrl,   set: setComfyUrl   },
        ].map(f => (
          <div key={f.label} className="mb-3">
            <label className="text-[8px] font-black uppercase tracking-widest text-gray-700 block mb-1">{f.label}</label>
            <input
              value={f.val}
              onChange={e => f.set(e.target.value)}
              className="w-full text-xs font-mono text-gray-400 bg-white/4 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-emerald-500/30"
            />
          </div>
        ))}
      </SectionCard>

      <button onClick={() => flashSave()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:brightness-110"
        style={{ background: ACCENT, color:'#000' }}>
        {saved ? <><FiCheck size={12}/> Settings Saved</> : 'Save Settings'}
      </button>
    </div>
  );
}

// ── TEMPLATE MARKETPLACE ──────────────────────────────────────────────────────
const CAT_FILTERS = [
  {id:'all',       label:'All Templates'},
  {id:'education', label:'Education'},
  {id:'entertainment',label:'Entertainment'},
  {id:'lifestyle', label:'Lifestyle'},
  {id:'wellness',  label:'Wellness'},
  {id:'tech',      label:'Tech'},
  {id:'music',     label:'Music'},
  {id:'special',   label:'✨ Special'},
];

const DIFFICULTY_COLOR = { Easy:'#10B981', Medium:'#F59E0B', Hard:'#EF4444' };

function TemplateMarketplace({ setSection }) {
  const [catFilter,   setCatFilter]   = useState('all');
  const [selected,    setSelected]    = useState(null);
  const [detailTab,   setDetailTab]   = useState('workflow');

  const filtered = CHANNEL_TEMPLATES.filter(t => catFilter === 'all' || t.catId === catFilter);
  const detail   = selected ? CHANNEL_TEMPLATES.find(t => t.id === selected) : null;

  return (
    <div className="p-5 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.02))', border:`1px solid ${A_BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 80% 50%,rgba(16,185,129,0.06),transparent 60%)' }}/>
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
            style={{ background:A_SOFT, borderColor:A_BORDER, color:'#6EE7B7' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:ACCENT }}/>
            EOF Template Marketplace
          </div>
          <h1 className="text-xl font-black text-white mb-1">
            Choose a content system.<br/>
            <span style={{ color:ACCENT }}>Launch a channel in minutes.</span>
          </h1>
          <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
            Each template is a complete production system — AI generates your script, storyboard, images, video, voice, music, captions, thumbnail, SEO, and export pipeline automatically.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {CAT_FILTERS.map(f => (
          <button key={f.id} onClick={() => { setCatFilter(f.id); setSelected(null); }}
            className="px-3 py-1.5 rounded-full text-[9px] font-bold whitespace-nowrap border transition-all flex-shrink-0"
            style={catFilter === f.id
              ? { background:A_SOFT, borderColor:A_BORDER, color:'#6EE7B7' }
              : { borderColor:'rgba(255,255,255,0.08)', color:'#5B6470' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(tmpl => {
          const isSel = selected === tmpl.id;
          return (
            <button key={tmpl.id} onClick={() => setSelected(isSel ? null : tmpl.id)}
              className="p-4 rounded-2xl border text-left transition-all hover:brightness-110 relative"
              style={isSel
                ? { background:`${tmpl.color}10`, borderColor:`${tmpl.color}50` }
                : { background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>

              {/* Badge */}
              {tmpl.badge && (
                <div className="absolute top-3 right-3">
                  <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ background:`${tmpl.color}20`, color:tmpl.color }}>
                    {tmpl.badge}
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tmpl.icon}</span>
                <div>
                  <p className="text-xs font-black text-white leading-tight">{tmpl.name}</p>
                  <span className="text-[7px] font-bold uppercase tracking-wider"
                    style={{ color:tmpl.color }}>{tmpl.category}</span>
                </div>
              </div>

              <p className="text-[9px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{tmpl.tagline}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[
                  {label:'Length',  val:tmpl.avgLength},
                  {label:'Freq',    val:tmpl.uploadFreq},
                  {label:'Revenue', val:tmpl.estRevenue},
                ].map(s => (
                  <div key={s.label} className="text-center p-1.5 rounded-lg bg-white/3">
                    <p className="text-[7px] font-black text-white leading-none mb-0.5">{s.val}</p>
                    <p className="text-[6px] text-gray-700 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Difficulty + build time */}
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background:`${DIFFICULTY_COLOR[tmpl.difficulty]}15`, color:DIFFICULTY_COLOR[tmpl.difficulty] }}>
                  {tmpl.difficulty}
                </span>
                <span className="text-[7px] text-gray-700">{tmpl.buildTime}</span>
              </div>

              {isSel && (
                <div className="mt-2 pt-2 border-t border-white/6">
                  <p className="text-[8px]" style={{ color:tmpl.color }}>▼ See full workflow below</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {detail && (
        <motion.div
          key={detail.id}
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.2 }}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor:`${detail.color}40`, background:`${detail.color}06` }}>

          {/* Detail header */}
          <div className="p-5 border-b" style={{ borderColor:`${detail.color}20` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{detail.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-base font-black text-white">{detail.name}</h2>
                    {detail.badge && (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded"
                        style={{ background:`${detail.color}20`, color:detail.color }}>
                        {detail.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 max-w-lg">{detail.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSection('script')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:brightness-110 flex-shrink-0"
                style={{ background:detail.color, color:'#000' }}>
                <FiZap size={12}/> Launch Template
              </button>
            </div>

            {/* Stat row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {[
                {label:'Avg Length',    val:detail.avgLength},
                {label:'Upload Freq',   val:detail.uploadFreq},
                {label:'Est. Revenue',  val:detail.estRevenue},
                {label:'Build Time',    val:detail.buildTime},
                {label:'Difficulty',    val:detail.difficulty},
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[8px] text-gray-700 uppercase tracking-wider">{s.label}</p>
                  <p className="text-xs font-bold text-white">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail tabs */}
          <div className="flex border-b" style={{ borderColor:`${detail.color}15` }}>
            {['workflow','style guide','subtypes','auto-generates'].map(tab => (
              <button key={tab} onClick={() => setDetailTab(tab)}
                className="px-4 py-2.5 text-[9px] font-bold capitalize transition-all relative"
                style={detailTab === tab
                  ? { color:detail.color }
                  : { color:'#4B5563' }}>
                {tab}
                {detailTab === tab && (
                  <div className="absolute bottom-0 left-2 right-2 h-px rounded-full" style={{ background:detail.color }}/>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {detailTab === 'workflow' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {detail.workflow.map((step, i) => (
                  <div key={step.step}
                    className="flex items-start gap-3 p-3 rounded-xl border"
                    style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.05)' }}>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border"
                      style={{ background:`${detail.color}15`, borderColor:`${detail.color}30`, color:detail.color }}>
                      {step.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span>{step.icon}</span>
                        <p className="text-[9px] font-black text-white">{step.label}</p>
                      </div>
                      <p className="text-[8px] text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'style guide' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {label:'🎙️ Voice Style',   val:detail.voiceStyle},
                  {label:'🎵 Music Style',    val:detail.musicStyle},
                  {label:'🖼️ Visual Style',   val:detail.visualStyle},
                  {label:'💬 Caption Style',  val:detail.captionStyle},
                ].map(g => (
                  <div key={g.label} className="p-4 rounded-xl bg-white/2 border border-white/6">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2">{g.label}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{g.val}</p>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'subtypes' && (
              <div>
                <p className="text-[9px] text-gray-600 mb-3">All sub-formats available within the {detail.name} template:</p>
                <div className="flex flex-wrap gap-2">
                  {detail.subtypes.map(s => (
                    <button key={s}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-bold transition-all hover:brightness-110"
                      style={{ borderColor:`${detail.color}35`, color:detail.color, background:`${detail.color}08` }}
                      onClick={() => setSection('script')}>
                      {detail.icon} {s}
                    </button>
                  ))}
                </div>
                <p className="text-[8px] text-gray-700 mt-4">Click any sub-format to launch the script generator pre-configured for that specific style.</p>
              </div>
            )}

            {detailTab === 'auto-generates' && (
              <div>
                <p className="text-[9px] text-gray-600 mb-3">When you launch this template, the AI automatically generates all of the following:</p>
                <div className="flex flex-wrap gap-2">
                  {detail.autoGenerates.map(item => (
                    <div key={item}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/6 bg-white/2">
                      <FiCheck size={9} style={{ color:ACCENT, flexShrink:0 }}/>
                      <span className="text-[9px] text-gray-400 capitalize">{item.replace(/_/g,' ')}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl border" style={{ borderColor:A_BORDER, background:A_SOFT }}>
                  <p className="text-[9px] font-bold" style={{ color:'#6EE7B7' }}>
                    🤖 Everything above is generated automatically from a single topic input.
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0.5">All you need is a topic. The AI handles the rest from script to export.</p>
                </div>
              </div>
            )}
          </div>

          {/* Launch CTA bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:`${detail.color}15` }}>
            <p className="text-[9px] text-gray-600">
              {detail.workflow.length} automated steps · {detail.autoGenerates.length} assets generated · {detail.uploadFreq} upload pace
            </p>
            <button
              onClick={() => setSection('script')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all hover:brightness-110"
              style={{ background:detail.color, color:'#000' }}>
              <FiZap size={11}/> Start with {detail.name} Template →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── CHANNEL BLUEPRINT LIBRARY ─────────────────────────────────────────────────
// ── Blueprint Walkthrough ──────────────────────────────────────────────────────
const BW_STEPS = [
  { id:1,  icon:'🎨', title:'Page Style',      subtitle:'What type of page are you creating?',       type:'choice',
    options:['Landing Page','Product Page','Course Page','Video Page','Creator Profile','Music Page','Book Page','Event Page','Sales Page','Portfolio Page'] },
  { id:2,  icon:'🏗️', title:'Layout',          subtitle:'How should the page be arranged?',          type:'choice',
    options:['Single Column','Two Column','Grid','Magazine','Minimal','Full-Width'] },
  { id:3,  icon:'🎯', title:'Purpose',          subtitle:'What is the main goal of this page?',       type:'choice',
    options:['Grow Subscribers','Sell a Product','Build Email List','Promote Course','Share Content','Build Community'] },
  { id:4,  icon:'✏️', title:'Page Title',       subtitle:'Give your page a name',                     type:'input',
    placeholder:'e.g. My History Channel — Subscribe Now',
    extraFields:['Target Audience','Main Goal','Tone / Style','Brand Colors'] },
  { id:5,  icon:'📝', title:'Description',      subtitle:'Describe your page and what visitors get',  type:'textarea',
    placeholder:'Tell visitors what this page is about and what they\'ll find here...',
    extraFields:['Key Message','Unique Value Prop','Who is This For','Extra Notes'] },
  { id:6,  icon:'🖼️', title:'Images & Media',  subtitle:'What media will you use?',                  type:'choice',
    options:['AI-Generated Images','Upload My Own','Stock Photos','Video Embed','Animated Visuals','No Images'] },
  { id:7,  icon:'🔘', title:'Call-to-Action',   subtitle:'What should visitors do next?',             type:'input',
    placeholder:'e.g. Subscribe Now, Get Started, Watch Free, Join the Community',
    extraFields:['Button Style','Button Color','Secondary CTA','Urgency Text'] },
  { id:8,  icon:'📦', title:'Page Sections',    subtitle:'Which sections should be included?',        type:'multiselect',
    options:['Hero Section','Why Subscribe / Features','About Section','Testimonials','FAQ','Pricing','Gallery','Newsletter Signup','Video Player','Social Proof'] },
  { id:9,  icon:'🎨', title:'Visual Style',     subtitle:'Choose the aesthetic for your page',        type:'choice',
    options:['Minimal Dark','Bold & Colorful','Clean White','Neon Glow','Earthy Tones','Brand Colors'] },
  { id:10, icon:'🤖', title:'AI Instructions',  subtitle:'Extra details to help the AI build better', type:'textarea',
    placeholder:'Tell the AI anything specific: tone, audience, special requirements, key messages, competitors to stand out from...',
    extraFields:['Images Needed','Special Requirements','Competitor Notes','Extra Context'] },
  { id:11, icon:'👁️', title:'Preview Page',     subtitle:'Your page is pre-built — click to customize', type:'preview' },
  { id:12, icon:'💾', title:'Save & Publish',   subtitle:'Choose what to do with your page',          type:'save' },
];

const BW_PAGE_SECTIONS = {
  'Landing Page':     [
    { id:'hero',     icon:'🦸', label:'Hero Section',       desc:'Main headline + subscribe CTA' },
    { id:'features', icon:'✅', label:'Why Subscribe',       desc:'3–4 feature cards with benefits' },
    { id:'about',    icon:'👤', label:'About the Channel',   desc:'Channel story and creator info' },
    { id:'social',   icon:'⭐', label:'Social Proof',        desc:'Subscriber count + testimonials' },
    { id:'cta',      icon:'🔘', label:'Call-to-Action',      desc:'Final subscribe / join button' },
    { id:'footer',   icon:'📄', label:'Footer',              desc:'Links + copyright info' },
  ],
  'Course Page':      [
    { id:'hero',      icon:'📚', label:'Course Title',        desc:'Title + subtitle + enroll CTA' },
    { id:'desc',      icon:'📝', label:'Course Description',  desc:'What students will learn' },
    { id:'modules',   icon:'📋', label:'Modules & Lessons',   desc:'Full curriculum breakdown' },
    { id:'instructor',icon:'👨‍🏫', label:'Instructor Section', desc:'Your bio and credentials' },
    { id:'outcomes',  icon:'🏆', label:'Student Outcomes',    desc:'Results and success stories' },
    { id:'enroll',    icon:'🎓', label:'Enroll Button',       desc:'Pricing + enrollment CTA' },
  ],
  'Video Page':       [
    { id:'player',  icon:'▶️',  label:'Video Player',        desc:'Main video embed area' },
    { id:'title',   icon:'📝',  label:'Video Title & Info',  desc:'Title + description + tags' },
    { id:'chapters',icon:'📑',  label:'Chapters',            desc:'Timestamped chapters' },
    { id:'related', icon:'🎬',  label:'Related Videos',      desc:'More videos grid' },
    { id:'cta',     icon:'🔔',  label:'Call-to-Action',      desc:'Subscribe + follow buttons' },
  ],
  'Creator Profile':  [
    { id:'hero',    icon:'🌟', label:'Profile Hero',          desc:'Photo + name + bio' },
    { id:'stats',   icon:'📊', label:'Channel Stats',         desc:'Subs, views, video count' },
    { id:'featured',icon:'🎯', label:'Featured Content',      desc:'Best videos / latest uploads' },
    { id:'social',  icon:'🔗', label:'Social Links',          desc:'All platform links' },
    { id:'collab',  icon:'🤝', label:'Work With Me',          desc:'Collaboration / contact info' },
  ],
  'Sales Page':       [
    { id:'hook',    icon:'🎣', label:'Hook / Headline',       desc:'Attention-grabbing opener' },
    { id:'problem', icon:'😤', label:'Problem Section',       desc:'Agitate the pain point' },
    { id:'solution',icon:'💡', label:'Solution / Offer',      desc:'Your product as the answer' },
    { id:'social',  icon:'⭐', label:'Testimonials',          desc:'Proof it works' },
    { id:'pricing', icon:'💰', label:'Pricing',               desc:'Offer + pricing tiers' },
    { id:'cta',     icon:'🚀', label:'Buy Now CTA',           desc:'Final conversion button' },
  ],
};
const BW_DEFAULT_SECTIONS = [
  { id:'hero',    icon:'🦸', label:'Hero Section',   desc:'Main headline + CTA' },
  { id:'content', icon:'📄', label:'Main Content',   desc:'Primary content area' },
  { id:'media',   icon:'🖼️', label:'Media Section',  desc:'Images / videos' },
  { id:'cta',     icon:'🔘', label:'Call-to-Action', desc:'Primary action button' },
  { id:'footer',  icon:'📄', label:'Footer',         desc:'Links + info' },
];

const BW_SECTION_FIELDS = {
  hero:      ['Headline Text','Subheadline','Button Label','Background Image','Text Color'],
  features:  ['Section Title','Feature 1 Title','Feature 2 Title','Feature 3 Title','Feature 4 Title'],
  about:     ['About Title','Your Story','Profile Image URL','Channel Name'],
  social:    ['Subscriber Count Text','Testimonial 1','Testimonial 2','Star Rating'],
  cta:       ['CTA Headline','CTA Subheadline','Button Label','Button Color'],
  footer:    ['Footer Links','Copyright Text','Social Media Links'],
  default:   ['Headline','Subheadline','Body Text','Button Label','Image Prompt'],
};

const BW_AI_TEXT = {
  1:  (bp) => `For a ${bp.niche} channel like ${bp.name}, a Landing Page works best — it clearly shows visitors why they should subscribe with a strong hero and benefits section.`,
  2:  (bp) => `${bp.name} uses a Single Column layout for maximum readability. Videos and text flow naturally, keeping focus on content.`,
  3:  (bp) => `Since this channel earns ${bp.estRevenue}/mo through ${bp.revenueStreams?.[0] || 'ad revenue'}, "Grow Subscribers" aligns best with your monetization strategy.`,
  4:  (bp) => `Suggested title: "${bp.name} — ${bp.niche}". Clear, searchable, and tells visitors exactly what to expect.`,
  5:  (bp) => `Suggested: "Welcome to ${bp.name}. We create ${bp.niche} content designed to educate, inspire, and entertain. Subscribe for new videos every week."`,
  6:  (bp) => `AI-Generated Images give you full creative control and no copyright issues. Perfect for ${bp.niche} content.`,
  7:  (bp) => `Strong CTAs for this blueprint: "Subscribe Now", "Watch My Best Video", "Join ${bp.subs || '1M+'} Subscribers".`,
  8:  (bp) => `Prioritize: Hero Section, Why Subscribe, About the Channel, and a strong CTA. These 4 sections convert the most viewers to subscribers.`,
  9:  (bp) => `"Minimal Dark" or "Bold & Colorful" work best for ${bp.niche} channels. Keep it consistent with your YouTube channel branding.`,
  10: (bp) => `Extra AI note: "Match the tone of ${bp.model} — ${bp.niche}. Use curiosity-gap language. Keep paragraphs short. Lead with the most important info."`,
  11: (bp) => `Your page is pre-built! Click any section to customize it. The layout is optimized for conversions.`,
  12: (bp) => `Save to Project to keep editing, or Publish Page to go live. Duplicate this template to create variations for different audiences.`,
};

const BW_SAVE_OPTIONS = [
  { id:'project',   icon:'📁', label:'Save to Project',        color:'#10B981' },
  { id:'library',   icon:'📚', label:'Save to Template Library',color:'#3B82F6' },
  { id:'blueprint', icon:'🏆', label:'Save as Blueprint',       color:'#F59E0B' },
  { id:'duplicate', icon:'📋', label:'Duplicate Template',      color:'#8B5CF6' },
  { id:'export',    icon:'📦', label:'Export Page',             color:'#06B6D4' },
  { id:'publish',   icon:'🚀', label:'Publish Page',            color:'#10B981' },
];

function BlueprintWalkthrough({ blueprint: bp, onBack, setSection }) {
  const [step,         setStep]         = useState(1);
  const [choices,      setChoices]      = useState({});
  const [multiSel,     setMultiSel]     = useState({});
  const [inputs,       setInputs]       = useState({});
  const [clickedSec,   setClickedSec]   = useState(null);
  const [saveDone,     setSaveDone]     = useState(null);
  const TOTAL = 12;

  const curStep    = BW_STEPS.find(s => s.id === step);
  const pageType   = choices[1] || 'Landing Page';
  const pageTitle  = inputs[4]  || `${bp.name} — ${pageType}`;
  const pageSecs   = BW_PAGE_SECTIONS[pageType] || BW_DEFAULT_SECTIONS;
  const aiText     = (BW_AI_TEXT[step] || (() => 'Select your options and I\'ll help build the perfect page.'))(bp);

  function pick(v)         { setChoices(p => ({ ...p, [step]: v })); }
  function toggleMulti(v)  { setMultiSel(p => { const s = new Set(p[step] || []); s.has(v) ? s.delete(v) : s.add(v); return { ...p, [step]: s }; }); }
  function setInput(v)     { setInputs(p => ({ ...p, [step]: v })); }
  function handleSave(id)  { setSaveDone(id); setTimeout(() => setSaveDone(null), 2000); }

  const clickedSecDef = pageSecs.find(s => s.id === clickedSec);
  const editFields    = BW_SECTION_FIELDS[clickedSec] || BW_SECTION_FIELDS.default;

  return (
    <div className="flex flex-col" style={{ minHeight:'calc(100vh - 136px)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/6 flex-shrink-0" style={{ background:'rgba(0,0,0,0.35)' }}>
        <button onClick={onBack} className="text-[10px] text-gray-600 hover:text-white transition-colors flex items-center gap-1">← Blueprints</button>
        <span className="text-gray-800">/</span>
        <div className="flex items-center gap-2">
          <span className="text-base">{bp.emoji}</span>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest" style={{ color:bp.color }}>{bp.model}</p>
            <p className="text-[11px] font-black text-white leading-tight">{bp.name} — Page Builder</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-28 h-1.5 rounded-full bg-white/8">
            <div className="h-full rounded-full transition-all duration-300" style={{ width:`${(step/TOTAL)*100}%`, background:bp.color }}/>
          </div>
          <span className="text-[9px] font-bold text-gray-600">Step {step} / {TOTAL}</span>
        </div>
      </div>

      {/* 3-panel body */}
      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ minHeight:500 }}>

        {/* Left: step nav (144px) */}
        <div className="w-36 flex-shrink-0 border-r border-white/6 overflow-y-auto py-2" style={{ background:'#0a0a0a' }}>
          {BW_STEPS.map(s => {
            const done = step > s.id;
            const cur  = step === s.id;
            return (
              <button key={s.id} onClick={() => setStep(s.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-all hover:bg-white/3"
                style={cur ? { background:`${bp.color}0f` } : {}}>
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black"
                  style={done ? { background:bp.color, color:'#000' }
                       : cur  ? { border:`1.5px solid ${bp.color}`, color:bp.color }
                               : { background:'rgba(255,255,255,0.06)', color:'#374151' }}>
                  {done ? '✓' : s.id}
                </div>
                <div>
                  <p className="text-[8px] font-semibold leading-tight"
                    style={cur ? { color:'#fff' } : done ? { color:bp.color } : { color:'#374151' }}>
                    {s.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: step content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }}
              transition={{ duration:0.13 }}>

              {/* Step header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{curStep?.icon}</span>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Step {step} of {TOTAL}</p>
                </div>
                <h2 className="text-lg font-black text-white">{curStep?.title}</h2>
                <p className="text-xs text-gray-500">{curStep?.subtitle}</p>
              </div>

              {/* CHOICE */}
              {curStep?.type === 'choice' && (
                <div className="grid grid-cols-2 gap-2 max-w-xl">
                  {curStep.options.map(opt => {
                    const sel = choices[step] === opt;
                    return (
                      <button key={opt} onClick={() => pick(opt)}
                        className="p-3 rounded-xl border text-left transition-all hover:border-white/20"
                        style={sel ? { borderColor:`${bp.color}55`, background:`${bp.color}0e`, color:'#fff' }
                                   : { borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
                        {sel && <span className="mr-1.5" style={{ color:bp.color }}>✓</span>}
                        <span className="text-[11px] font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MULTISELECT */}
              {curStep?.type === 'multiselect' && (
                <div className="space-y-1.5 max-w-xl">
                  <p className="text-[8px] text-gray-700 mb-2">Select all that apply</p>
                  {curStep.options.map(opt => {
                    const sel = (multiSel[step] || new Set()).has(opt);
                    return (
                      <button key={opt} onClick={() => toggleMulti(opt)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                        style={sel ? { borderColor:`${bp.color}55`, background:`${bp.color}0e` }
                                   : { borderColor:'rgba(255,255,255,0.08)' }}>
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                          style={sel ? { background:bp.color, borderColor:bp.color }
                                     : { borderColor:'rgba(255,255,255,0.15)' }}>
                          {sel && <span className="text-[8px] font-black text-black">✓</span>}
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: sel ? '#fff' : '#6B7280' }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* INPUT */}
              {curStep?.type === 'input' && (
                <div className="max-w-xl space-y-3">
                  <input value={inputs[step] || ''} onChange={e => setInput(e.target.value)}
                    placeholder={curStep.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/20"/>
                  {curStep.extraFields && (
                    <div className="grid grid-cols-2 gap-2">
                      {curStep.extraFields.map(f => (
                        <div key={f}>
                          <p className="text-[8px] font-bold text-gray-700 mb-1">{f}</p>
                          <input placeholder={`Add ${f.toLowerCase()}...`}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 text-[10px] text-white placeholder-gray-800 focus:outline-none"/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TEXTAREA */}
              {curStep?.type === 'textarea' && (
                <div className="max-w-xl space-y-3">
                  <textarea value={inputs[step] || ''} onChange={e => setInput(e.target.value)}
                    placeholder={curStep.placeholder} rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-sm text-white placeholder-gray-700 focus:outline-none resize-none"/>
                  {curStep.extraFields && (
                    <div className="grid grid-cols-2 gap-2">
                      {curStep.extraFields.map(f => (
                        <div key={f}>
                          <p className="text-[8px] font-bold text-gray-700 mb-1">{f}</p>
                          <input placeholder={`Add ${f.toLowerCase()}...`}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 text-[10px] text-white placeholder-gray-800 focus:outline-none"/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PREVIEW */}
              {curStep?.type === 'preview' && (
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color:bp.color }}>
                      {pageType} · {choices[9] || 'Minimal Dark'}
                    </span>
                    <span className="text-[8px] text-gray-700">— Click any section to edit</span>
                  </div>

                  {/* Mock browser + page */}
                  <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background:'#111' }}>
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/8 bg-black/40">
                      <div className="w-2 h-2 rounded-full" style={{ background:'#EF4444' }}/>
                      <div className="w-2 h-2 rounded-full" style={{ background:'#F59E0B' }}/>
                      <div className="w-2 h-2 rounded-full" style={{ background:'#10B981' }}/>
                      <div className="flex-1 mx-3 py-0.5 px-2.5 rounded-md bg-white/6 text-[8px] text-gray-600 text-center truncate">
                        {pageTitle.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.eof.page
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      {pageSecs.map(sec => {
                        const isSel = clickedSec === sec.id;
                        return (
                          <button key={sec.id} onClick={() => setClickedSec(isSel ? null : sec.id)}
                            className="w-full p-3 rounded-xl border text-left transition-all group"
                            style={isSel
                              ? { borderColor:`${bp.color}55`, background:`${bp.color}0e` }
                              : { borderColor:'rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{sec.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-white">{sec.label}</p>
                                <p className="text-[8px] text-gray-600">{sec.desc}</p>
                              </div>
                              <span className="text-[8px] font-bold px-2 py-0.5 rounded transition-all"
                                style={isSel
                                  ? { background:`${bp.color}22`, color:bp.color }
                                  : { background:'rgba(255,255,255,0.05)', color:'#4B5563' }}>
                                {isSel ? 'Editing →' : 'Click to Edit'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE */}
              {curStep?.type === 'save' && (
                <div className="max-w-xl space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {BW_SAVE_OPTIONS.map(opt => {
                      const done = saveDone === opt.id;
                      return (
                        <button key={opt.id} onClick={() => handleSave(opt.id)}
                          className="p-4 rounded-xl border text-left transition-all hover:border-white/20"
                          style={done ? { borderColor:`${opt.color}55`, background:`${opt.color}10` }
                                      : { borderColor:'rgba(255,255,255,0.08)' }}>
                          <span className="text-xl mb-2 block">{done ? '✅' : opt.icon}</span>
                          <p className="text-[11px] font-bold" style={{ color: done ? opt.color : '#fff' }}>
                            {done ? 'Saved!' : opt.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => { setStep(1); setChoices({}); setMultiSel({}); setInputs({}); setClickedSec(null); }}
                      className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-gray-600 hover:text-white transition-colors">
                      Start Over
                    </button>
                    <button onClick={() => setSection('script')}
                      className="flex-1 py-2.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition-all hover:brightness-110"
                      style={{ background:bp.color, color:'#000' }}>
                      <FiZap size={11}/> Start Writing Scripts Now
                    </button>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              {curStep?.type !== 'save' && (
                <div className="flex items-center gap-3 mt-7">
                  {step > 1 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-gray-600 hover:text-white transition-colors">
                      ← Back
                    </button>
                  )}
                  <button onClick={() => setStep(s => Math.min(TOTAL, s + 1))}
                    className="px-6 py-2 rounded-xl text-[10px] font-black transition-all hover:brightness-110"
                    style={{ background:bp.color, color:'#000' }}>
                    {step === 11 ? 'Save & Publish →' : step === 10 ? 'Preview Page →' : 'Next Step →'}
                  </button>
                  {step < TOTAL && (
                    <button onClick={() => setStep(TOTAL)}
                      className="px-3 py-2 text-[9px] text-gray-800 hover:text-gray-500 transition-colors">
                      Skip to Save
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: AI Inspector (192px) */}
        <div className="w-48 flex-shrink-0 border-l border-white/6 overflow-y-auto py-3" style={{ background:'#0a0a0a' }}>

          {/* Section editor (preview step, section clicked) */}
          {step === 11 && clickedSec ? (
            <div className="px-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-black uppercase tracking-widest" style={{ color:bp.color }}>Edit Section</p>
                <button onClick={() => setClickedSec(null)} className="text-gray-700 hover:text-white text-[10px] transition-colors">✕</button>
              </div>
              <p className="text-[10px] font-bold text-white">{clickedSecDef?.icon} {clickedSecDef?.label}</p>
              <div className="space-y-2">
                {editFields.map(f => (
                  <div key={f}>
                    <p className="text-[7px] font-bold text-gray-700 mb-1">{f}</p>
                    <input placeholder={`Enter ${f.toLowerCase()}...`}
                      className="w-full px-2 py-1.5 rounded-lg border border-white/8 bg-white/3 text-[9px] text-white placeholder-gray-800 focus:outline-none"/>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-1">
                <button className="w-full py-2 rounded-xl text-[9px] font-black transition-all hover:brightness-110"
                  style={{ background:bp.color, color:'#000' }}>
                  Apply Changes
                </button>
                <button className="w-full py-1.5 rounded-xl text-[9px] font-bold border border-white/8 text-gray-600 hover:text-white transition-colors">
                  🤖 AI Rewrite
                </button>
              </div>
            </div>
          ) : (
            <div className="px-3 space-y-3">
              {/* AI badge */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background:`${bp.color}15`, color:bp.color }}>🤖</div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">AI Page Assistant</p>
              </div>

              {/* AI suggestion */}
              <div className="p-2.5 rounded-xl border" style={{ borderColor:`${bp.color}25`, background:`${bp.color}06` }}>
                <p className="text-[8px] text-gray-400 leading-relaxed">{aiText}</p>
              </div>

              {/* AI capabilities */}
              <div>
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-2">AI Can Help With</p>
                <div className="space-y-1">
                  {[
                    ['✍️','Write page text'],
                    ['🗂️','Suggest sections'],
                    ['🖼️','Create image prompts'],
                    ['🔘','Suggest button names'],
                    ['🏗️','Build layout ideas'],
                    ['♻️','Rewrite content'],
                    ['🎯','Improve page flow'],
                    ['🎨','Match blueprint style'],
                  ].map(([icon, label]) => (
                    <button key={label}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/5 text-left hover:bg-white/3 transition-all">
                      <span className="text-[10px]">{icon}</span>
                      <span className="text-[8px] text-gray-700 hover:text-gray-400">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blueprint card */}
              <div className="p-2.5 rounded-xl border border-white/6 bg-white/2">
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-700 mb-1">Building From</p>
                <div className="flex items-center gap-2">
                  <span className="text-base">{bp.emoji}</span>
                  <div>
                    <p className="text-[9px] font-bold text-white leading-tight">{bp.name}</p>
                    <p className="text-[7px] text-gray-600">{bp.estRevenue}/mo · {bp.subs}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Blueprint Library ──────────────────────────────────────────────────────────
function BlueprintLibrary({ setSection }) {
  const [selected,        setSelected]        = useState(null);
  const [activeBlueprint, setActiveBlueprint] = useState(null);

  if (activeBlueprint) {
    return <BlueprintWalkthrough blueprint={activeBlueprint} onBack={() => setActiveBlueprint(null)} setSection={setSection}/>;
  }

  const mainBlueprints    = CHANNEL_BLUEPRINTS.filter(b => !b.isSpecial);
  const specialBlueprints = CHANNEL_BLUEPRINTS.filter(b =>  b.isSpecial);

  function BlueprintCard({ bp }) {
    const isSel = selected === bp.id;
    return (
      <div
        className="rounded-2xl border overflow-hidden transition-all"
        style={isSel
          ? { borderColor:`${bp.color}50`, background:`${bp.color}06` }
          : { borderColor:'rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>

        {/* Card header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border"
                style={{ background:`${bp.color}12`, borderColor:`${bp.color}30` }}>
                {bp.emoji}
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color:bp.color }}>
                  {bp.model}
                </p>
                <p className="text-xs font-black text-white leading-tight">{bp.name}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[8px] text-gray-700 mb-0.5">Est. Revenue</p>
              <p className="text-sm font-black text-white">{bp.estRevenue}</p>
            </div>
          </div>

          {/* Subscriber + niche stats */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4">
              <span className="text-[8px]">👥</span>
              <span className="text-[8px] font-bold text-white">{bp.subs}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4">
              <span className="text-[8px]">👁️</span>
              <span className="text-[8px] font-bold text-white">{bp.monthlyViews}</span>
            </div>
            <div className="flex-1 px-2.5 py-1 rounded-lg bg-white/4">
              <span className="text-[8px] text-gray-500 truncate">{bp.niche}</span>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 leading-relaxed mb-4">{bp.description}</p>

          {/* Key strategies (collapsed preview) */}
          <div className="space-y-1 mb-4">
            {bp.keyStrategies.slice(0, isSel ? bp.keyStrategies.length : 3).map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[8px] mt-0.5" style={{ color:bp.color }}>▸</span>
                <p className="text-[8px] text-gray-500 leading-relaxed">{s}</p>
              </div>
            ))}
            {!isSel && bp.keyStrategies.length > 3 && (
              <p className="text-[8px] text-gray-700 pl-3">+{bp.keyStrategies.length - 3} more strategies...</p>
            )}
          </div>

          {/* Revenue streams */}
          {isSel && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-2 mb-4">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Revenue Streams</p>
              <div className="flex flex-wrap gap-1.5">
                {bp.revenueStreams.map(r => (
                  <span key={r} className="text-[8px] px-2 py-1 rounded-lg bg-white/4 text-gray-400">{r}</span>
                ))}
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 pt-1">Content Calendar</p>
              <p className="text-[8px] text-gray-500 bg-white/3 px-3 py-2 rounded-lg">{bp.contentCalendar}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 pt-1">Channel Pillars</p>
              <div className="flex flex-wrap gap-1.5">
                {bp.channelPillars.map(p => (
                  <span key={p} className="text-[8px] px-2 py-1 rounded-full border text-gray-400"
                    style={{ borderColor:`${bp.color}30` }}>{p}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBlueprint(bp)}
              className="flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all hover:brightness-110"
              style={{ background:bp.color, color:'#000' }}>
              Build This Channel →
            </button>
            <button
              onClick={() => setSelected(isSel ? null : bp.id)}
              className="px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all"
              style={isSel
                ? { borderColor:A_BORDER, color:'#6EE7B7', background:A_SOFT }
                : { borderColor:'rgba(255,255,255,0.10)', color:'#5B6470' }}>
              {isSel ? '▲ Less' : '▼ Full Strategy'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(59,130,246,0.03))', border:`1px solid ${A_BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 30% 50%,rgba(16,185,129,0.05),transparent 60%)' }}/>
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
            style={{ background:A_SOFT, borderColor:A_BORDER, color:'#6EE7B7' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:ACCENT }}/>
            Channel Blueprint Library
          </div>
          <h1 className="text-xl font-black text-white mb-1">
            Start with a proven channel model.<br/>
            <span style={{ color:ACCENT }}>Skip the guesswork.</span>
          </h1>
          <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
            Each blueprint is a complete channel business model — content system, upload schedule, revenue strategy, and full AI production pipeline. Pick one and the studio configures itself automatically.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {[
              { label:'8 Channel Models', icon:'🏆' },
              { label:'Script to Export', icon:'🤖' },
              { label:'Full Revenue Plan', icon:'💰' },
              { label:'Content Calendar', icon:'📅' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-1.5">
                <span className="text-sm">{f.icon}</span>
                <span className="text-[9px] font-bold text-gray-400">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 5 proven models */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-gray-700"/>
          Proven Channel Models — Study Before You Build
          <span className="flex-1 h-px bg-gray-700"/>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mainBlueprints.map(bp => <BlueprintCard key={bp.id} bp={bp}/>)}
        </div>
      </div>

      {/* Special / custom blueprints */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-gray-700"/>
          ✨ EOF Exclusive — Build Something New
          <span className="flex-1 h-px bg-gray-700"/>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {specialBlueprints.map(bp => <BlueprintCard key={bp.id} bp={bp}/>)}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 text-center border" style={{ borderColor:A_BORDER, background:A_SOFT }}>
        <p className="text-base font-black text-white mb-1">Ready to build your channel?</p>
        <p className="text-xs text-gray-500 mb-4">Start with any blueprint above, or browse the Template Marketplace for individual content formats.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setSection('templates')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
            📋 Browse All Templates
          </button>
          <button onClick={() => setSection('script')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:brightness-110"
            style={{ background:ACCENT, color:'#000' }}>
            <FiZap size={13}/> Start Writing Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT HUB ──────────────────────────────────────────────────────────────────
export default function FacelessVideosHub() {
  const ctx              = useOutletContext();
  const activeSection    = ctx?.activeSection    ?? 'dashboard';
  const setActiveSection = ctx?.setActiveSection ?? (() => {});

  const [project, setProject] = useState(null);

  function loadMockProject() {
    setProject(MOCK_PROJECT);
    lsSet('eof-active-project', MOCK_PROJECT);
  }

  // Load persisted project on mount
  useEffect(() => {
    const saved = lsGet('eof-active-project', null);
    if (saved) setProject(saved);
  }, []);

  const setSection = useCallback((s) => setActiveSection(s), [setActiveSection]);
  const proj = project || MOCK_PROJECT;

  const SECTIONS = {
    dashboard:    <Dashboard     setSection={setSection} loadMockProject={loadMockProject}/>,
    script:       <ScriptStudio  project={proj} setProject={setProject} setSection={setSection}/>,
    breakdown:    <SceneBreakdown project={proj} setSection={setSection}/>,
    storyboard:   <StoryboardEngine project={proj} setSection={setSection}/>,
    image:        <ImageStudio   setSection={setSection}/>,
    img2video:    <Img2VideoStudio setSection={setSection}/>,
    editor:       <VideoEditorDoll project={proj} setSection={setSection}/>,
    audio:        <AudioMusicEditor setSection={setSection}/>,
    thumbnail:    <ThumbnailSection/>,
    assets:       <AssetLibrary  project={proj} setSection={setSection}/>,
    export:       <ExportCenter/>,
    integrations: <IntegrationsPage/>,
    settings:     <SettingsPage/>,
    templates:    <TemplateMarketplace setSection={setSection}/>,
    blueprints:   <BlueprintLibrary    setSection={setSection}/>,
  };

  return (
    <div className="min-h-full">
      {/* Section breadcrumb */}
      {activeSection !== 'dashboard' && (
        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          <button onClick={() => setSection('dashboard')}
            className="text-[10px] text-gray-700 hover:text-gray-400 transition-colors">
            ← Dashboard
          </button>
          <span className="text-gray-800">/</span>
          <span className="text-[10px] font-black text-white capitalize">{activeSection}</span>
        </div>
      )}
      {SECTIONS[activeSection] ?? SECTIONS.dashboard}
    </div>
  );
}

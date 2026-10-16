import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiChevronRight, FiX, FiAlertCircle } from 'react-icons/fi';
import { WORKFLOW_STEPS, FORMATS } from '../data/formatSystem';
import FormatPicker from './FormatPicker';
import Storyboard from './Storyboard';
import ThumbnailStudio from './ThumbnailStudio';
import SocialEngine from './SocialEngine';

const ACCENT   = '#10B981';
const A_SOFT   = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

// ── Step index helpers ──────────────────────────────────────────────────────────
const STEP_IDS = WORKFLOW_STEPS.map(s => s.id);
function stepIndex(id) { return STEP_IDS.indexOf(id); }

// ── Script Studio (inline, minimal) ────────────────────────────────────────────
function ScriptStudio({ script, onChange, onContinue }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black text-white mb-1">Script</h2>
        <p className="text-[10px] text-gray-600">Write, paste, or generate your script. Each paragraph becomes a scene.</p>
      </div>

      <textarea
        value={script}
        onChange={e => onChange(e.target.value)}
        placeholder="Write your script here…&#10;&#10;Each paragraph will become a storyboard scene.&#10;&#10;Example:&#10;Hip-hop was born in the Bronx in 1973 — but the real story began before the music did."
        rows={12}
        className="w-full text-sm text-gray-300 bg-white/3 border border-white/10 rounded-2xl px-4 py-3 outline-none resize-none leading-relaxed focus:border-emerald-500/30 placeholder-gray-700 font-mono"
      />

      <div className="flex items-center justify-between">
        <p className="text-[9px] text-gray-700">
          {script.trim().split(/\n\n+/).filter(Boolean).length} scenes · {script.trim().split(/\s+/).filter(Boolean).length} words
        </p>
        <button
          onClick={() => onContinue(script)}
          disabled={script.trim().length < 20}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110 disabled:opacity-40"
          style={{ background: ACCENT, color: '#000' }}>
          Build Storyboard <FiChevronRight size={12}/>
        </button>
      </div>
    </div>
  );
}

// ── Images step (placeholder — links to Storyboard generate) ───────────────────
function ImagesStep({ format, script, onContinue }) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black text-white mb-1">Generate Images</h2>
        <p className="text-[10px] text-gray-600">AI creates visuals for each scene based on your storyboard prompts.</p>
      </div>
      <div className="p-4 rounded-2xl border border-white/8 bg-white/2 text-center space-y-3">
        <p className="text-2xl">🖼️</p>
        <p className="text-xs text-gray-500">
          Image generation uses ComfyUI (local) or Pexels (free stock).<br/>
          Make sure your backend is running at <span className="font-mono text-gray-400">localhost:8765</span>.
        </p>
        <button
          onClick={() => { setDone(true); setTimeout(() => onContinue(), 400); }}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          {done ? '✅ Images Ready' : 'Generate All Scene Images'}
        </button>
      </div>
    </div>
  );
}

// ── Animate step ───────────────────────────────────────────────────────────────
function AnimateStep({ format, onContinue }) {
  const [effect, setEffect] = useState('ken_burns');
  const EFFECTS = [
    { id: 'ken_burns', name: 'Ken Burns', desc: 'Slow zoom + pan — documentary classic', icon: '🎥' },
    { id: 'parallax',  name: 'Parallax',  desc: 'Depth layers move at different speeds', icon: '📐' },
    { id: 'zoom_in',   name: 'Zoom In',   desc: 'Simple push toward subject',            icon: '🔭' },
    { id: 'static',    name: 'Static',    desc: 'No movement — cut-only transitions',    icon: '⬜' },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black text-white mb-1">Animate Images</h2>
        <p className="text-[10px] text-gray-600">Choose how your still images come to life in the video.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {EFFECTS.map(e => (
          <button key={e.id} onClick={() => setEffect(e.id)}
            className="p-3 rounded-xl border text-left transition-all"
            style={effect === e.id
              ? { background: A_SOFT, borderColor: A_BORDER }
              : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="text-lg mb-1">{e.icon}</div>
            <p className="text-xs font-bold text-white">{e.name}</p>
            <p className="text-[9px] text-gray-600 mt-0.5">{e.desc}</p>
            {effect === e.id && <FiCheck size={10} style={{ color: ACCENT, marginTop: 4 }}/>}
          </button>
        ))}
      </div>
      <button
        onClick={() => onContinue({ effect })}
        className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        Apply {EFFECTS.find(e => e.id === effect)?.name} & Continue
      </button>
    </div>
  );
}

// ── Edit step ──────────────────────────────────────────────────────────────────
function EditStep({ onContinue }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black text-white mb-1">Edit Video</h2>
        <p className="text-[10px] text-gray-600">Fine-tune your timeline, add music, effects, and captions.</p>
      </div>
      <div className="p-4 rounded-2xl border border-white/8 bg-white/2 space-y-2">
        <p className="text-xs text-gray-500 text-center">
          The full timeline editor is in the <strong className="text-gray-400">Video Editing Dock</strong> below.<br/>
          Come back here when you're happy with your edit.
        </p>
      </div>
      <button
        onClick={() => onContinue()}
        className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        Edit Complete — Make Thumbnail
      </button>
    </div>
  );
}

// ── Export step ────────────────────────────────────────────────────────────────
function ExportStep({ format, onFinish }) {
  const [exported, setExported] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black text-white mb-1">Export & Publish</h2>
        <p className="text-[10px] text-gray-600">Send your video to every platform simultaneously.</p>
      </div>
      <SocialEngine onContinue={() => { setExported(true); onFinish && onFinish(); }} />
    </div>
  );
}

// ── Step Progress Bar ──────────────────────────────────────────────────────────
function StepBar({ currentStep, completedSteps }) {
  return (
    <div className="flex items-center gap-0">
      {WORKFLOW_STEPS.map((step, i) => {
        const isActive    = step.id === currentStep;
        const isCompleted = completedSteps.has(step.id);
        const isLast      = i === WORKFLOW_STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all"
                style={isCompleted
                  ? { background: ACCENT, borderColor: ACCENT, color: '#000' }
                  : isActive
                    ? { background: A_SOFT, borderColor: A_BORDER, color: '#6EE7B7' }
                    : { background: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: '#4B5563' }}>
                {isCompleted ? <FiCheck size={11} strokeWidth={3}/> : step.icon}
              </div>
              <p className="text-[7px] mt-1 text-center w-12 leading-tight"
                style={{ color: isActive ? '#6EE7B7' : isCompleted ? ACCENT : '#4B5563' }}>
                {step.label}
              </p>
            </div>
            {!isLast && (
              <div className="flex-1 h-px mb-3 mx-1 transition-all"
                style={{ background: isCompleted ? `${ACCENT}60` : 'rgba(255,255,255,0.08)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Main ProjectWorkflow ────────────────────────────────────────────────────────
export default function ProjectWorkflow({ onClose }) {
  const [phase, setPhase]         = useState('format');   // 'format' | 'workflow'
  const [format, setFormat]       = useState(null);
  const [currentStep, setStep]    = useState('script');
  const [completedSteps, setCompleted] = useState(new Set());
  const [script, setScript]       = useState('');
  const [workflowData, setData]   = useState({});
  const [finished, setFinished]   = useState(false);

  function complete(stepId, data = {}) {
    setCompleted(prev => new Set([...prev, stepId]));
    setData(prev => ({ ...prev, [stepId]: data }));
    const nextIndex = stepIndex(stepId) + 1;
    if (nextIndex < WORKFLOW_STEPS.length) {
      setStep(WORKFLOW_STEPS[nextIndex].id);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-black text-white">Project Complete!</h2>
        <p className="text-sm text-gray-500">Your video and all social content have been generated.</p>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110"
          style={{ background: ACCENT, color: '#000' }}>
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  if (phase === 'format') {
    return (
      <div className="relative">
        {onClose && (
          <button onClick={onClose}
            className="absolute top-0 right-0 p-1.5 rounded-lg text-gray-600 hover:text-gray-300 transition-colors">
            <FiX size={16}/>
          </button>
        )}
        <FormatPicker onSelect={fmt => { setFormat(fmt); setPhase('workflow'); }} />
      </div>
    );
  }

  // ── Workflow phase ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{format?.icon}</span>
            <p className="text-xs font-bold text-white">{format?.name}</p>
            <span className="text-[9px] px-2 py-0.5 rounded font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7280' }}>
              {format?.w}×{format?.h}
            </span>
          </div>
          <button
            onClick={() => { setPhase('format'); setStep('script'); setCompleted(new Set()); }}
            className="text-[9px] text-gray-700 hover:text-gray-400 transition-colors">
            ← Change format
          </button>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 transition-colors">
            <FiX size={14}/>
          </button>
        )}
      </div>

      {/* Step progress */}
      <StepBar currentStep={currentStep} completedSteps={completedSteps} />

      {/* Active step panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
          className="p-5 rounded-2xl border border-white/8 bg-white/2">
          {currentStep === 'script' && (
            <ScriptStudio
              script={script}
              onChange={setScript}
              onContinue={s => { setScript(s); complete('script', { script: s }); }}
            />
          )}
          {currentStep === 'storyboard' && (
            <Storyboard
              format={format}
              script={script}
              onContinue={data => complete('storyboard', data)}
            />
          )}
          {currentStep === 'images' && (
            <ImagesStep
              format={format}
              script={script}
              onContinue={() => complete('images')}
            />
          )}
          {currentStep === 'animate' && (
            <AnimateStep
              format={format}
              onContinue={data => complete('animate', data)}
            />
          )}
          {currentStep === 'edit' && (
            <EditStep onContinue={() => complete('edit')} />
          )}
          {currentStep === 'thumbnail' && (
            <ThumbnailStudio
              script={script}
              format={format}
              onContinue={data => complete('thumbnail', data)}
            />
          )}
          {currentStep === 'export' && (
            <ExportStep
              format={format}
              onFinish={() => setFinished(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Jump to any completed step */}
      {completedSteps.size > 0 && (
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-800 mb-2">
            Jump to completed step
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {WORKFLOW_STEPS.filter(s => completedSteps.has(s.id)).map(s => (
              <button key={s.id} onClick={() => setStep(s.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold border border-white/10 text-gray-500 hover:text-gray-300 transition-all">
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

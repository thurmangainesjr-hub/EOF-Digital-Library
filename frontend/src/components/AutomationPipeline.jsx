import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiCheck, FiX, FiPlay, FiRefreshCw, FiDownload,
  FiEdit2, FiImage, FiMic, FiFilm, FiChevronRight,
  FiAlertTriangle, FiLoader, FiStar, FiTrash2, FiPlus,
} from 'react-icons/fi';

const API = 'http://localhost:8765';
const ACCENT = '#10B981';
const A_SOFT = 'rgba(16,185,129,0.10)';
const A_BORDER = 'rgba(16,185,129,0.28)';

const STEP_ORDER = ['script', 'images', 'voice', 'assembly', 'export'];

const STATUS_META = {
  pending:                  { label: 'Pending',               color: '#6B7280', pulse: false },
  scripting:                { label: 'Writing Script…',       color: '#3B82F6', pulse: true  },
  awaiting_script_approval: { label: 'Review Script',         color: '#D4AF37', pulse: false },
  generating_images:        { label: 'Generating Images…',    color: '#3B82F6', pulse: true  },
  awaiting_image_approval:  { label: 'Review Images',         color: '#D4AF37', pulse: false },
  generating_voice:         { label: 'Generating Voice…',     color: '#8B5CF6', pulse: true  },
  awaiting_voice_approval:  { label: 'Review Voice',          color: '#D4AF37', pulse: false },
  assembling:               { label: 'Assembling Video…',     color: '#F59E0B', pulse: true  },
  awaiting_draft_approval:  { label: 'Review Draft',          color: '#D4AF37', pulse: false },
  done:                     { label: 'Complete',              color: '#10B981', pulse: false },
  error:                    { label: 'Error',                 color: '#EF4444', pulse: false },
};

function ProgressBar({ progress, status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {meta.pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: meta.color }} />}
          <span className="text-[10px] font-bold" style={{ color: meta.color }}>{meta.label}</span>
        </div>
        <span className="text-[10px] font-mono text-gray-600">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
        <motion.div className="h-full rounded-full"
          style={{ background: meta.color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }} />
      </div>
    </div>
  );
}

function StepBadge({ label, status }) {
  const colors = {
    pending: '#374151', running: '#3B82F6', done: '#10B981', error: '#EF4444',
  };
  const icons = { pending: '○', running: '⏳', done: '✓', error: '✗' };
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold"
      style={{ background: `${colors[status]}18`, color: colors[status], border: `1px solid ${colors[status]}30` }}>
      {icons[status]} {label}
    </div>
  );
}

// ── Script Review Panel ────────────────────────────────────────────────────────
function ScriptReview({ script, onApprove, onRegenerate }) {
  const [editing, setEditing] = useState(false);
  const [edits, setEdits] = useState({ title: script.title, scenes: script.scenes });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white">Script Ready</h3>
        <div className="flex gap-2">
          <button onClick={() => setEditing(e => !e)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-white/10 text-gray-400 hover:text-white transition-all">
            <FiEdit2 size={9}/> {editing ? 'Preview' : 'Edit'}
          </button>
          <button onClick={onRegenerate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-white/10 text-gray-400 hover:text-amber-400 transition-all">
            <FiRefreshCw size={9}/> Regenerate
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Title</p>
        {editing
          ? <input value={edits.title} onChange={e => setEdits(d => ({ ...d, title: e.target.value }))}
              className="w-full text-sm font-bold text-white bg-transparent outline-none border-b border-white/20 pb-1" />
          : <p className="text-sm font-bold text-white">{edits.title}</p>
        }
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {edits.scenes.map((scene, i) => (
          <div key={i} className="p-3 rounded-xl border border-white/8 bg-white/2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-emerald-400">Scene {scene.scene_num}</span>
              <span className="text-[9px] text-gray-600">{scene.duration_seconds}s · {scene.mood}</span>
            </div>
            {editing
              ? <textarea value={scene.narration}
                  onChange={e => setEdits(d => ({
                    ...d,
                    scenes: d.scenes.map((s, j) => j === i ? { ...s, narration: e.target.value } : s)
                  }))}
                  rows={3}
                  className="w-full text-[10px] text-gray-300 bg-transparent resize-none outline-none border border-white/10 rounded-lg p-2 leading-relaxed" />
              : <p className="text-[10px] text-gray-400 leading-relaxed">{scene.narration}</p>
            }
          </div>
        ))}
      </div>

      <button
        onClick={() => onApprove(editing ? edits : {})}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        <FiCheck size={13}/> Approve Script — Generate Images
      </button>
    </div>
  );
}

// ── Image Review Panel ─────────────────────────────────────────────────────────
function ImageReview({ images, scenes, onApprove }) {
  const [overrides, setOverrides] = useState({});

  const sceneMap = {};
  scenes.forEach(s => { sceneMap[s.scene_num] = s; });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white">{images.length} Scene Images</h3>
        <p className="text-[10px] text-gray-600">Review each image · swap if needed</p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
        {images.map(img => (
          <div key={img.scene_num} className="rounded-xl border border-white/8 overflow-hidden bg-white/2">
            <div className="aspect-video bg-black/50 flex items-center justify-center text-2xl">
              {img.source === 'placeholder' ? '🖼️' : '🎬'}
            </div>
            <div className="p-2">
              <p className="text-[9px] font-bold text-emerald-400">Scene {img.scene_num}</p>
              <p className="text-[9px] text-gray-600 truncate">{sceneMap[img.scene_num]?.mood}</p>
              <p className="text-[8px] text-gray-700 mt-0.5">Source: {img.source}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onApprove(overrides)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        <FiCheck size={13}/> Approve Images — Generate Voice
      </button>
    </div>
  );
}

// ── Voice Review Panel ─────────────────────────────────────────────────────────
function VoiceReview({ voice, onApprove }) {
  const successCount = voice.filter(v => v.status === 'ok').length;
  const engines = [...new Set(voice.map(v => v.engine).filter(Boolean))];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black text-white">Voice Generated</h3>
      <div className="p-3 rounded-xl border border-white/8 bg-white/2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Scenes generated</span>
          <span className="text-[10px] font-bold text-emerald-400">{successCount} / {voice.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Engine</span>
          <span className="text-[10px] font-bold text-gray-300">{engines.join(', ') || 'unknown'}</span>
        </div>
      </div>
      <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-400">
        🎙️ Preview playback coming soon. Approve to continue to video assembly.
      </div>
      <button
        onClick={() => onApprove({})}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        <FiCheck size={13}/> Approve Voice — Assemble Video
      </button>
    </div>
  );
}

// ── Draft Review Panel ─────────────────────────────────────────────────────────
function DraftReview({ assembly, jobId, onApprove, onExport }) {
  const [exporting, setExporting] = useState('');

  async function handleExport(platform) {
    setExporting(platform);
    await fetch(`${API}/api/pipeline/${jobId}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform }),
    });
    onExport(platform);
    setExporting('');
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black text-white">Draft Video Ready</h3>
      <div className="aspect-video rounded-xl border border-white/10 bg-black/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🎬</div>
          <p className="text-xs text-gray-500">{assembly.clip_count} scenes assembled</p>
          <p className="text-[10px] text-gray-700 mt-1">{assembly.draft_path?.split('\\').pop()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['youtube', 'youtube_shorts', 'tiktok', 'instagram'].map(p => (
          <button key={p} onClick={() => handleExport(p)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
            <FiDownload size={10}/>
            {exporting === p ? 'Exporting…' : p.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={() => onApprove({})}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110"
        style={{ background: ACCENT, color: '#000' }}>
        <FiCheck size={13}/> Mark Complete
      </button>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, onSelect, selected }) {
  const meta = STATUS_META[job.status] || STATUS_META.pending;
  return (
    <button onClick={() => onSelect(job.id)}
      className="w-full text-left p-3 rounded-xl border transition-all"
      style={selected
        ? { background: A_SOFT, borderColor: A_BORDER }
        : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-white truncate">{job.topic}</span>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0"
          style={{ background: `${meta.color}18`, color: meta.color }}>
          {meta.label}
        </span>
      </div>
      <p className="text-[9px] text-gray-600">{job.series} · EP{job.episode_num}</p>
      <div className="mt-2">
        <div className="h-1 rounded-full bg-white/6">
          <div className="h-full rounded-full transition-all" style={{ width: `${job.progress}%`, background: meta.color }} />
        </div>
      </div>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AutomationPipeline() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [creating, setCreating] = useState(false);
  const [health, setHealth] = useState(null);
  const [newTopic, setNewTopic] = useState('');
  const [newSeries, setNewSeries] = useState('My First Love');
  const [newEpisode, setNewEpisode] = useState(1);
  const [voicePreset, setVoicePreset] = useState('deep_male_narrator');
  const pollRef = useRef(null);

  // Check server health
  useEffect(() => {
    fetch(`${API}/api/health`)
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  // Load jobs list
  const loadJobs = async () => {
    try {
      const r = await fetch(`${API}/api/pipeline`);
      const data = await r.json();
      setJobs(data);
    } catch {}
  };

  useEffect(() => { loadJobs(); }, []);

  // Poll selected job
  useEffect(() => {
    if (!selectedJobId) return;

    const poll = async () => {
      try {
        const r = await fetch(`${API}/api/pipeline/${selectedJobId}`);
        const data = await r.json();
        setSelectedJob(data);
        // Refresh job list to update progress bars
        loadJobs();
      } catch {}
    };

    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollRef.current);
  }, [selectedJobId]);

  async function handleStart() {
    if (!newTopic.trim()) return;
    setCreating(true);
    try {
      const r = await fetch(`${API}/api/pipeline/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newTopic,
          series: newSeries,
          episode_num: newEpisode,
          voice_preset: voicePreset,
        }),
      });
      const data = await r.json();
      await loadJobs();
      setSelectedJobId(data.job_id);
      setNewTopic('');
    } catch (e) {
      alert('Could not reach automation server. Is it running on port 8765?');
    }
    setCreating(false);
  }

  async function handleApprove(step, edits = {}) {
    if (!selectedJobId) return;
    await fetch(`${API}/api/pipeline/${selectedJobId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, edits }),
    });
  }

  async function handleDelete(jobId) {
    await fetch(`${API}/api/pipeline/${jobId}`, { method: 'DELETE' });
    if (selectedJobId === jobId) { setSelectedJobId(null); setSelectedJob(null); }
    loadJobs();
  }

  const serverOnline = health !== null;
  const status = selectedJob?.status;
  const stepData = selectedJob?.steps || {};

  return (
    <div className="flex gap-4 min-h-0" style={{ height: 'calc(100vh - 140px)' }}>

      {/* ── Left: Job queue ── */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-3">
        {/* Server status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={serverOnline
            ? { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }
            : { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}/>
          <span className="text-[9px] font-bold" style={{ color: serverOnline ? '#10B981' : '#EF4444' }}>
            {serverOnline ? 'Pipeline Server Online' : 'Server Offline — run start_pipeline.bat'}
          </span>
        </div>

        {serverOnline && health && (
          <div className="px-3 py-2 rounded-xl border border-white/6 bg-white/2 space-y-1">
            {[
              ['Claude API', health.anthropic_key],
              ['ElevenLabs', health.elevenlabs_key],
              ['Pexels',     health.pexels_key],
            ].map(([name, active]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-[9px] text-gray-600">{name}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${active ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-600 bg-white/5'}`}>
                  {active ? 'Connected' : 'No Key'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {jobs.length === 0 && (
            <p className="text-[10px] text-gray-700 text-center py-6 italic">No jobs yet</p>
          )}
          {jobs.map(j => (
            <div key={j.id} className="relative group">
              <JobCard job={j} onSelect={setSelectedJobId} selected={selectedJobId === j.id} />
              <button onClick={() => handleDelete(j.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 transition-all">
                <FiTrash2 size={10}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Center: Active job / new job form ── */}
      <div className="flex-1 overflow-y-auto">
        {/* New job form */}
        <div className="p-4 rounded-2xl border border-white/8 bg-white/2 mb-4">
          <h3 className="text-xs font-black text-white mb-3 flex items-center gap-2">
            <FiZap size={12} style={{ color: ACCENT }}/> Start New Automated Video
          </h3>
          <div className="space-y-2">
            <input
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="Topic: e.g. 'When did hip-hop become your first love?'"
              className="w-full text-sm text-gray-300 bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500/40"
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
            <div className="grid grid-cols-3 gap-2">
              <input value={newSeries} onChange={e => setNewSeries(e.target.value)}
                placeholder="Series name"
                className="text-[11px] text-gray-400 bg-white/4 border border-white/10 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-500/40" />
              <input type="number" value={newEpisode} onChange={e => setNewEpisode(+e.target.value)}
                min={1} placeholder="EP#"
                className="text-[11px] text-gray-400 bg-white/4 border border-white/10 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-500/40" />
              <select value={voicePreset} onChange={e => setVoicePreset(e.target.value)}
                className="text-[11px] text-gray-400 bg-white/4 border border-white/10 rounded-xl px-2.5 py-2 outline-none">
                <option value="deep_male_narrator">Deep Male</option>
                <option value="warm_female_host">Warm Female</option>
                <option value="neutral_narrator">Neutral AI</option>
              </select>
            </div>
            <button onClick={handleStart} disabled={creating || !newTopic.trim() || !serverOnline}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110 disabled:opacity-40"
              style={{ background: ACCENT, color: '#000' }}>
              {creating ? <><FiLoader size={12} className="animate-spin"/> Starting…</> : <><FiZap size={12}/> Generate Full Video</>}
            </button>
          </div>
        </div>

        {/* Active job detail */}
        {selectedJob && (
          <div className="p-4 rounded-2xl border border-white/8 bg-white/2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">{selectedJob.topic}</h3>
                <p className="text-[10px] text-gray-600 mt-0.5">{selectedJob.series} · EP{selectedJob.episode_num} · Job {selectedJob.id}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {STEP_ORDER.map(s => (
                  <StepBadge key={s} label={s} status={stepData[s]?.status || 'pending'} />
                ))}
              </div>
            </div>

            <ProgressBar progress={selectedJob.progress} status={status} />

            {/* Step-specific review panels */}
            <AnimatePresence mode="wait">
              {status === 'awaiting_script_approval' && stepData.script?.data && (
                <motion.div key="script" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ScriptReview
                    script={stepData.script.data}
                    onApprove={(edits) => handleApprove('script', edits)}
                    onRegenerate={() => alert('Regenerate: coming in next update')}
                  />
                </motion.div>
              )}

              {status === 'awaiting_image_approval' && stepData.images?.data && (
                <motion.div key="images" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ImageReview
                    images={stepData.images.data}
                    scenes={stepData.script.data.scenes}
                    onApprove={(edits) => handleApprove('images', edits)}
                  />
                </motion.div>
              )}

              {status === 'awaiting_voice_approval' && stepData.voice?.data && (
                <motion.div key="voice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <VoiceReview
                    voice={stepData.voice.data}
                    onApprove={(edits) => handleApprove('voice', edits)}
                  />
                </motion.div>
              )}

              {status === 'awaiting_draft_approval' && stepData.assembly?.data && (
                <motion.div key="draft" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <DraftReview
                    assembly={stepData.assembly.data}
                    jobId={selectedJob.id}
                    onApprove={(edits) => handleApprove('draft', edits)}
                    onExport={(platform) => console.log('Exported:', platform)}
                  />
                </motion.div>
              )}

              {(status === 'scripting' || status === 'generating_images' || status === 'generating_voice' || status === 'assembling') && (
                <motion.div key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  <p className="text-xs text-gray-500">{STATUS_META[status]?.label}</p>
                </motion.div>
              )}

              {status === 'done' && (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: A_SOFT, border: `1px solid ${A_BORDER}` }}>
                    <FiCheck size={22} style={{ color: ACCENT }} />
                  </div>
                  <p className="text-sm font-bold text-white">Video Complete</p>
                  <p className="text-[10px] text-gray-600">Check outputs/videos/ folder</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border border-red-500/25 bg-red-500/8 text-center">
                  <FiAlertTriangle size={18} className="mx-auto mb-2 text-red-400" />
                  <p className="text-xs font-bold text-red-400">Pipeline Error</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {Object.values(selectedJob.steps).find(s => s.status === 'error')?.error || 'Unknown error'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight, FiPlus, FiZap, FiPlay, FiX,
  FiFilm, FiUsers, FiArchive, FiSend, FiCheck,
} from 'react-icons/fi';

const ACCENT      = '#D97706';
const ACCENT_SOFT = 'rgba(217,119,6,0.10)';
const A_BORDER    = 'rgba(217,119,6,0.28)';

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTIONS = [
  {
    id: 'my-first-love',
    title: 'My First Love',
    subtitle: 'A Documentary Series',
    type: 'Relationship Documentary',
    episodes: 12,
    episodesComplete: 0,
    status: 'In Development',
    progress: 8,
    theme: 'First love stories across cultures, generations, and circumstances — told by the people who lived them.',
    color: '#EC4899',
    icon: '❤️',
    tags: ['Relationships', 'Culture', 'Human Experience', 'Community Stories'],
    currentStep: 'Project Setup',
    stepIndex: 1,
  },
];

const PIPELINE = [
  { id: 1,  label: 'Project Setup',         emoji: '🎬', desc: 'Series title, episode info, audience, runtime, and central theme' },
  { id: 2,  label: 'Research Brief',         emoji: '🔬', desc: 'Deep research package and fact-check checklist for every claim' },
  { id: 3,  label: 'Story Arc & Outline',    emoji: '📐', desc: 'Full documentary structure — acts, beats, emotional arc, and pacing map' },
  { id: 4,  label: 'Interview Questions',    emoji: '🎙️', desc: 'Subject-specific question banks by role, angle, and perspective' },
  { id: 5,  label: 'Community Collection',   emoji: '📹', desc: 'Prompt system for collecting and curating submitted community videos' },
  { id: 6,  label: 'Historical Assets',      emoji: '🗄️', desc: 'Gather archive footage, photographs, documents, and historical records' },
  { id: 7,  label: 'Narration Script',       emoji: '✍️', desc: 'Full narration written in the series voice, tone, and style' },
  { id: 8,  label: 'AI Visual Prompts',      emoji: '🎨', desc: 'Image and video generation prompts for every scene and sequence' },
  { id: 9,  label: 'Music & Transitions',    emoji: '🎵', desc: 'Score selections, cue markers, transition plan, and mood mapping' },
  { id: 10, label: 'Rights & Permissions',   emoji: '⚖️', desc: 'Licensing checklist for all audio, video, image, and archive assets' },
  { id: 11, label: 'Editing Timeline',       emoji: '✂️', desc: 'Shot-by-shot editing sequence with timestamps and transition notes' },
  { id: 12, label: 'Master Episode',         emoji: '🎞️', desc: 'Final assembled master episode — full broadcast cut' },
  { id: 13, label: 'VOD Extended Cut',       emoji: '📺', desc: 'Extended version with bonus interviews for EOF streaming platform' },
  { id: 14, label: 'Social Clips',           emoji: '📱', desc: 'Short-form cuts packaged for Reels, TikTok, and YouTube Shorts' },
  { id: 15, label: 'Podcast Version',        emoji: '🎧', desc: 'Audio-only edit with intro/outro, formatted for podcast distribution' },
  { id: 16, label: 'Thumbnail & Titles',     emoji: '🖼️', desc: 'Platform-optimized thumbnails, title variants, and metadata' },
  { id: 17, label: 'Distribution',           emoji: '🚀', desc: 'Publish across EOF Streaming, YouTube, podcast platforms, and social' },
];

const AGENTS = [
  { name: 'Executive Producer',        icon: '🎬', color: '#D97706', status: 'active',  desc: 'Oversees entire production from concept to distribution' },
  { name: 'Documentary Researcher',    icon: '🔬', color: '#60A5FA', status: 'active',  desc: 'Finds sources, builds research briefs, and fact-checks all claims' },
  { name: 'Fact Checker',             icon: '✅', color: '#10B981', status: 'active',  desc: 'Verifies every claim, date, statistic, and attribution' },
  { name: 'Script Writer',            icon: '✍️', color: '#A78BFA', status: 'active',  desc: 'Writes narration, treatments, and full episode scripts' },
  { name: 'Story Editor',             icon: '📐', color: '#F59E0B', status: 'standby', desc: 'Shapes story arc, pacing, and emotional structure of each episode' },
  { name: 'Interview Producer',       icon: '🎙️', color: '#EC4899', status: 'standby', desc: 'Develops interview questions and prepares subject briefings' },
  { name: 'Visual Director',          icon: '👁️', color: '#8B5CF6', status: 'standby', desc: 'Art direction, shot selection, and overall visual language' },
  { name: 'Motion Graphics Director', icon: '🎨', color: '#EF4444', status: 'idle',    desc: 'Lower thirds, title cards, infographics, and motion design' },
  { name: 'Music Supervisor',         icon: '🎵', color: '#06B6D4', status: 'idle',    desc: 'Score selection, licensing briefs, cue sheets, and mood mapping' },
  { name: 'Video Editor',             icon: '✂️', color: '#D97706', status: 'idle',    desc: 'Editing timeline, pacing notes, and assembly cut direction' },
  { name: 'Social Media Producer',    icon: '📱', color: '#10B981', status: 'idle',    desc: 'Short-form clips, captions, hooks, and platform packaging' },
  { name: 'Archive Manager',          icon: '🗄️', color: '#60A5FA', status: 'standby', desc: 'Sources and organizes historical footage, photos, and records' },
  { name: 'Rights & Licensing',       icon: '⚖️', color: '#F59E0B', status: 'idle',    desc: 'Clearances, licenses, and permissions for every asset used' },
  { name: 'Distribution Manager',     icon: '🚀', color: '#A78BFA', status: 'standby', desc: 'Publishes across all platforms and tracks post-launch performance' },
];

const STATUS_COLOR = { active: '#10B981', standby: '#38BDF8', idle: '#374151' };
const STATUS_GLOW  = { active: '0 0 8px rgba(16,185,129,0.5)', standby: '', idle: '' };

const FUTURE_SERIES = [
  { title: 'First Game',         emoji: '🏈', genre: 'Sports Documentary',        color: '#EF4444' },
  { title: 'The Breakthrough',   emoji: '🚀', genre: 'Entrepreneurship Series',   color: '#F59E0B' },
  { title: 'Panel One',          emoji: '🖼️', genre: 'Comics & Creative Arts',    color: '#8B5CF6' },
  { title: 'Called',             emoji: '✝️', genre: 'Faith Documentary',         color: '#D4AF37' },
  { title: 'Lights, Camera',     emoji: '🎬', genre: 'Film Industry Profiles',    color: '#60A5FA' },
];

// ── Step Detail Modal ─────────────────────────────────────────────────────────
function StepModal({ step, onClose }) {
  if (!step) return null;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{ background: '#111', border: `1px solid ${A_BORDER}` }}
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }} transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: ACCENT_SOFT, border: `1px solid ${A_BORDER}` }}>
              {step.emoji}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-0.5">Step {step.id} of 17</p>
              <h3 className="font-bold text-white text-base">{step.label}</h3>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all">
            <FiX size={14} />
          </button>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{step.desc}</p>
        <div className="px-3 py-2.5 rounded-xl text-xs text-center text-gray-500"
          style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)' }}>
          This module generates full AI output for every episode — research, scripts, prompts, or distribution packages depending on the step.
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Production Card ───────────────────────────────────────────────────────────
function ProductionCard({ prod }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 h-full"
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${prod.color}30` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${prod.color}18`, border: `1px solid ${prod.color}30` }}>
            {prod.icon}
          </div>
          <div>
            <h3 className="font-serif text-lg text-white font-bold leading-tight">{prod.title}</h3>
            <p className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: prod.color }}>{prod.type}</p>
          </div>
        </div>
        <span className="text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(217,119,6,0.12)', color: '#FCD34D', border: '1px solid rgba(217,119,6,0.25)' }}>
          {prod.status}
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{prod.theme}</p>

      <div className="flex flex-wrap gap-1.5">
        {prod.tags.map(t => (
          <span key={t} className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ background: `${prod.color}12`, color: prod.color, border: `1px solid ${prod.color}25` }}>
            {t}
          </span>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-500">Production Progress</span>
          <span className="text-[10px] font-bold" style={{ color: prod.color }}>{prod.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/6">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${prod.progress}%`, background: prod.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/6">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-bold text-white">{prod.episodes}</p>
            <p className="text-[9px] text-gray-600">Episodes Planned</p>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div>
            <p className="text-xs font-bold text-white">{prod.episodesComplete}</p>
            <p className="text-[9px] text-gray-600">Complete</p>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div>
            <p className="text-xs font-bold" style={{ color: ACCENT }}>{prod.currentStep}</p>
            <p className="text-[9px] text-gray-600">Current Step</p>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
          style={{ background: `${prod.color}20`, color: prod.color, border: `1px solid ${prod.color}35` }}>
          <FiPlay size={11} /> Open
        </button>
      </div>
    </div>
  );
}

// ── Main Hub ──────────────────────────────────────────────────────────────────
export default function DocumentaryStudioHub() {
  const [activeStep, setActiveStep] = useState(null);
  const [agentModal, setAgentModal] = useState(null);

  return (
    <div className="min-h-screen px-4 md:px-6 py-8" style={{ background: '#0d0d0d' }}>

      {/* Step modal */}
      <AnimatePresence>
        {activeStep && <StepModal step={activeStep} onClose={() => setActiveStep(null)} />}
      </AnimatePresence>

      {/* Agent modal */}
      <AnimatePresence>
        {agentModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAgentModal(null)}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div className="relative z-10 w-full max-w-sm rounded-2xl p-6"
              style={{ background: '#111', border: `1px solid ${agentModal.color}40` }}
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }} transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${agentModal.color}18` }}>
                    {agentModal.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{agentModal.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ background: STATUS_COLOR[agentModal.status], boxShadow: STATUS_GLOW[agentModal.status] }} />
                      <span className="text-[10px] capitalize" style={{ color: STATUS_COLOR[agentModal.status] }}>
                        {agentModal.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setAgentModal(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8">
                  <FiX size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{agentModal.desc}</p>
              <div className="px-3 py-2.5 rounded-xl text-xs text-center text-gray-500"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                Full agent workspace and task assignment coming in the next production release.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-5">
        <Link to="/" className="hover:text-amber-400 transition-colors">EOF</Link>
        <FiChevronRight size={10} />
        <span className="text-amber-400">Documentary Studio</span>
      </div>

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="rounded-2xl px-6 py-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.12), rgba(146,64,14,0.06), transparent)', border: '1px solid rgba(217,119,6,0.2)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/8 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4"
              style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)', color: '#FCD34D' }}>
              <span>🎙️</span> EOF Documentary Production Network
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-3">
              Documentary Studio
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              A reusable production engine for faceless documentary series. Build once, apply to any topic — relationships, sports, entrepreneurship, faith, comics, and beyond.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition-all"
                style={{ background: ACCENT }}>
                <FiPlus size={15} /> New Production
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/8"
                style={{ border: '1px solid rgba(217,119,6,0.3)', color: '#FCD34D' }}>
                <FiZap size={15} /> Run Production Engine
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Active Productions', value: '1',  icon: FiFilm,    color: ACCENT    },
          { label: 'Pipeline Steps',     value: '17', icon: FiZap,     color: '#60A5FA' },
          { label: 'Production Agents',  value: '14', icon: FiUsers,   color: '#10B981' },
          { label: 'Future Series',      value: '5+', icon: FiArchive, color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/8 bg-white/3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}18` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Active Productions ── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl text-white font-bold">Active Productions</h2>
            <p className="text-sm text-gray-500 mt-0.5">Series currently in production pipeline</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
            style={{ background: ACCENT_SOFT, color: '#FCD34D', border: `1px solid ${A_BORDER}` }}>
            <FiPlus size={12} /> New Series
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PRODUCTIONS.map(prod => <ProductionCard key={prod.id} prod={prod} />)}

          {/* Placeholder for next series */}
          <div className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer group transition-all hover:bg-white/4"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FiPlus size={20} className="text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500">Start Next Series</p>
              <p className="text-xs text-gray-700 mt-0.5">Apply the same engine to any topic</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Production Pipeline ── */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Production Engine</h2>
          <p className="text-sm text-gray-500 mt-0.5">17-step white-label pipeline — reusable across every series. Click any step to see what it generates.</p>
        </div>

        <div className="rounded-2xl p-5 border border-white/8 bg-white/[0.02]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
            {PIPELINE.map((step, i) => {
              const isCurrent = i === 0; // My First Love is on step 1
              return (
                <motion.button
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setActiveStep(step)}
                  className="relative flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-all hover:brightness-110 group"
                  style={isCurrent
                    ? { background: ACCENT_SOFT, border: `1px solid ${A_BORDER}` }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {isCurrent && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: ACCENT, color: '#000' }}>ACTIVE</span>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">{step.emoji}</span>
                    <span className="text-[9px] font-mono text-gray-700">{String(step.id).padStart(2,'0')}</span>
                  </div>
                  <p className="text-[10px] font-semibold leading-tight"
                    style={{ color: isCurrent ? '#FCD34D' : 'rgba(255,255,255,0.7)' }}>
                    {step.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Agent Command Center ── */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="font-serif text-2xl text-white font-bold">Agent Command Center</h2>
          <p className="text-sm text-gray-500 mt-0.5">14 specialized production agents. Click any to see their role and capabilities.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {AGENTS.map((agent, i) => (
            <motion.button
              key={agent.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setAgentModal(agent)}
              className="flex items-start gap-3 p-3.5 rounded-xl text-left transition-all hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.07)` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${agent.color}18` }}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLOR[agent.status], boxShadow: STATUS_GLOW[agent.status] }} />
                  <p className="text-xs font-bold text-white truncate">{agent.name}</p>
                </div>
                <p className="text-[10px] text-gray-600 leading-snug line-clamp-2">{agent.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Future Series Pipeline ── */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="font-serif text-xl text-white font-bold">Upcoming Series</h2>
          <p className="text-sm text-gray-500 mt-0.5">Queue for the EOF Documentary Network — same engine, different topic.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {FUTURE_SERIES.map(s => (
            <div key={s.title}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}20` }}>
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="text-sm font-bold text-white">{s.title}</p>
                <p className="text-[10px] text-gray-500">{s.genre}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-2"
                style={{ background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25` }}>
                Queued
              </span>
            </div>
          ))}

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all hover:bg-white/5"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <FiPlus size={14} className="text-gray-600" />
            <span className="text-sm text-gray-600">Add Series</span>
          </button>
        </div>
      </section>

      {/* ── White-Label Callout ── */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.1), rgba(146,64,14,0.05))', border: '1px solid rgba(217,119,6,0.2)' }}>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: ACCENT }}>White-Label Production System</p>
          <h3 className="font-serif text-xl text-white font-bold mb-2">Every series uses the same 17-step engine</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Change the topic, keep the workflow. <em className="text-white not-italic">My First Love</em> is Project #1. Sports, entrepreneurship, faith, and comics follow the exact same pipeline — research through distribution — with only the subject matter changing.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col gap-2">
          {['Research → Outline', 'Narration → Visuals', 'Edit → Distribute'].map(step => (
            <div key={step} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', color: '#FCD34D' }}>
              <FiCheck size={11} style={{ color: '#10B981' }} /> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

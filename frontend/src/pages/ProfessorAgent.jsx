import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight, FiSend, FiRefreshCw, FiZap, FiBook,
  FiTarget, FiSearch, FiTool, FiCpu
} from 'react-icons/fi';
import { SCHOOLS, CHANCELLOR } from '../data/universityData';

// ── Engine tabs ──────────────────────────────────────────────────────────────
const ENGINES = [
  { id: 'teach',    label: 'Teaching',      icon: FiBook,   color: '#3B82F6' },
  { id: 'coach',    label: 'Coaching',      icon: FiTarget, color: '#10B981' },
  { id: 'critique', label: 'Critique',      icon: FiSearch, color: '#F59E0B' },
  { id: 'create',   label: 'Creation',      icon: FiTool,   color: '#8B5CF6' },
  { id: 'meta',     label: 'Metacognition', icon: FiCpu,    color: '#D4AF37' },
];

const ENGINE_PROMPTS = {
  teach:    'Please teach me about one of your core topics. I want to understand the fundamentals.',
  coach:    'I need personal guidance on my current project. Help me figure out the next steps.',
  critique: 'I want you to critique my work. Help me understand what I can improve.',
  create:   'Help me create something. Let\'s work on a real project together.',
  meta:     'Reflect on your last response. What could be better, deeper, or more precise?',
};

// ── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg, accentColor }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 border"
          style={{ background: `${accentColor}15`, borderColor: `${accentColor}30` }}
        >
          {msg.emoji}
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-eof-gold/15 text-white border border-eof-gold/25 rounded-tr-sm'
              : 'bg-white/6 text-gray-200 border border-white/10 rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>
        {msg.engine && (
          <span className="text-[10px] text-gray-600 px-2">
            via {ENGINES.find(e => e.id === msg.engine)?.label} Engine
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ accentColor }) {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 border"
        style={{ background: `${accentColor}15`, borderColor: `${accentColor}30` }}
      >
        💭
      </div>
      <div className="bg-white/6 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-500"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Professor profile panel ──────────────────────────────────────────────────
function ProfessorProfile({ prof, school }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${school.gradient} border ${school.border} p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
          style={{ background: `${school.accent}15`, borderColor: `${school.accent}30` }}
        >
          {prof.emoji}
        </div>
        <div>
          <h2 className="font-serif text-base text-white font-bold leading-tight">{prof.name}</h2>
          <p className="text-xs mt-0.5" style={{ color: school.accent }}>{prof.title}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{prof.bio}</p>
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Specialties</p>
        <div className="flex flex-wrap gap-1.5">
          {prof.specialty.map(s => (
            <span key={s} className="text-xs bg-black/30 rounded-full px-2 py-1 text-gray-400 border border-white/10">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2">Core Systems</p>
        <div className="space-y-1.5">
          {ENGINES.map(e => (
            <div key={e.id} className="flex items-center gap-2 text-xs text-gray-400">
              <e.icon size={12} style={{ color: e.color }} />
              <span>{e.label} Engine</span>
              {e.id === 'meta' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-eof-gold/15 text-eof-gold border border-eof-gold/20 ml-auto">Active</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main chat page ───────────────────────────────────────────────────────────
export default function ProfessorAgent() {
  const { schoolId, profId } = useParams();
  const isChancellor = schoolId === 'chancellor';

  const school = isChancellor ? null : SCHOOLS.find(s => s.id === schoolId);
  const prof = isChancellor
    ? { ...CHANCELLOR, id: 'chancellor', emoji: '🏛️', specialty: CHANCELLOR.responsibilities }
    : school?.professors.find(p => p.id === profId);

  const accentColor = isChancellor ? '#D4AF37' : (school?.accent || '#D4AF37');
  const schoolGradient = isChancellor
    ? 'from-eof-gold/15 to-eof-purple/10'
    : (school?.gradient || 'from-gray-900/40 to-gray-800/20');
  const schoolBorder = isChancellor ? 'border-eof-gold/30' : (school?.border || 'border-gray-600/30');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: isChancellor
        ? `Welcome, student. I am Chancellor AI — the supreme academic intelligence overseeing all of DIY University.\n\nI know every school, every professor, every curriculum, and every student pathway. Whether you need academic guidance, help choosing a school, tracking your progress, or earning your certifications — I am here.\n\nHow can I guide your academic journey today?`
        : `Welcome, student. I am ${prof?.name}.\n\n${prof?.bio}\n\nI am ready to teach, coach, critique, and create with you. What would you like to explore in ${prof?.specialty?.slice(0, 2).join(' and ')}?`,
      emoji: isChancellor ? '🏛️' : prof?.emoji,
      engine: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [activeEngine, setActiveEngine] = useState('teach');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!prof) {
    return (
      <div className="min-h-screen bg-eof-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white font-serif text-2xl mb-2">Professor Not Found</p>
          <Link to="/university" className="text-eof-gold text-sm hover:underline">← Back to University</Link>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text, emoji: '👤', engine: null };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with metacognition framing
    setTimeout(() => {
      const engineLabel = ENGINES.find(e => e.id === activeEngine)?.label || 'Teaching';
      const responses = {
        teach: `[${engineLabel} Engine]\n\nExcellent question. Let me teach you this from first principles...\n\nAs a master of ${prof.specialty?.[0] || 'this discipline'}, I want you to understand not just the "what" but the "why."\n\n**Core Concept:**\n${text.length > 30 ? `Regarding "${text.substring(0, 40)}..."` : `Regarding your question`} — this sits at the heart of what separates amateur practitioners from masters.\n\n**What you need to understand:**\nThe fundamentals here are: clarity of intention, mastery of technique, and the courage to execute. Every great practitioner has had to wrestle with exactly what you're asking.\n\n**Your action step:**\nBegin with a 30-minute focused practice session where you apply this principle consciously.\n\n*[Metacognition Check: Is this the most useful framing for this student? Could I go deeper? Yes — let me add: the real mastery comes from doing, not just understanding.]*`,
        coach: `[${engineLabel} Engine]\n\nI hear you. Let me give you direct, personalized guidance.\n\nBased on what you've shared, here's what I see:\n\n**Your current position:** You're at the stage where knowledge is transitioning into skill. This is where most people plateau — and where champions break through.\n\n**What's working for you:** Your instinct to ask this question means you're self-aware enough to grow.\n\n**What to do next:**\n1. Define your specific outcome for the next 7 days\n2. Remove the biggest obstacle in your path (usually fear or lack of clarity)\n3. Create one piece of work — done is better than perfect\n\n**My challenge to you:** What's the one thing you've been avoiding that would most move the needle?\n\n*[Metacognition Check: Am I coaching or lecturing? I'm coaching. Good.]*`,
        critique: `[${engineLabel} Engine]\n\nLet me give you honest, constructive critique. This is where growth really happens.\n\n**What I observe:**\nThe approach you're describing shows potential. The instinct is sound. But there are specific areas where you can sharpen your work significantly.\n\n**Strengths:**\n• Clear intent and direction\n• Willingness to submit work for review (this alone puts you ahead of 80%)\n\n**Areas for improvement:**\n• Depth: Push past the first idea — the second and third iterations are almost always stronger\n• Specificity: The details matter. Vagueness is the enemy of excellence\n• Structure: Make sure your work has a clear beginning, middle, and end\n\n**The standard:**\nAsk yourself — does this meet the standard of the masters in this field? If not, what specifically needs to change?\n\n*[Metacognition Check: Was I too gentle? Too harsh? I aimed for honest and helpful.]*`,
        create: `[${engineLabel} Engine]\n\nLet's build something real together. This is what the Creation Engine is for.\n\n**Project Framework:**\n\nFor your idea, here's how we execute:\n\n**Phase 1 — Concept (Today)**\nWrite down in one sentence what you're making, who it's for, and why it matters. Don't move forward without this clarity.\n\n**Phase 2 — Foundation (This Week)**\nCreate the skeleton. Whether it's an outline, a wireframe, a rough draft, or a beat pattern — get something tangible on paper.\n\n**Phase 3 — Build (Next 2 Weeks)**\nExecute section by section. Don't edit while you create. Get it done first.\n\n**Phase 4 — Refine**\nNow bring in the Critique Engine. Polish relentlessly.\n\n**Your deliverable:**\nSend me your Phase 1 sentence before you do anything else.\n\n*[Metacognition Check: Did I give actionable steps? Yes. Does this fit the student's level? Adjusting for beginner-to-intermediate.]*`,
        meta: `[${engineLabel} Engine — Reflecting on my previous response]\n\nLet me think critically about what I just told you and whether it was optimal.\n\n**What I said:** My last response focused on the practical steps.\n\n**What I'm reconsidering:**\n• Did I understand your actual question, or did I answer the surface version?\n• Was the depth appropriate for where you are in your learning journey?\n• Did I challenge you enough — or too little?\n\n**What I'd add or change:**\nIf I were to answer again, I would lead with the *underlying principle* first, then the application. The principle is timeless; the application changes with context.\n\n**The deeper truth:**\nEvery master knows that metacognition — thinking about thinking — is the real superpower. Not technique. Not talent. The ability to observe your own process, identify gaps, and course-correct in real time.\n\n**Question for you:** What aspect of my previous response was most useful? What felt incomplete?`,
      };

      const responseContent = responses[activeEngine] || responses.teach;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        emoji: isChancellor ? '🏛️' : prof.emoji,
        engine: activeEngine,
      }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (engine) => {
    setActiveEngine(engine);
    setInput(ENGINE_PROMPTS[engine]);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="h-[calc(100vh-var(--topbar-height))] bg-eof-dark flex flex-col">
      {/* Breadcrumb bar */}
      <div className="flex items-center gap-2 text-xs text-gray-500 px-4 md:px-6 py-3 border-b border-white/10 flex-shrink-0">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/university" className="hover:text-eof-gold transition-colors">University</Link>
        {!isChancellor && school && (
          <>
            <FiChevronRight size={12} />
            <Link to={`/university/${school.id}`} className="hover:text-eof-gold transition-colors">{school.shortName}</Link>
          </>
        )}
        <FiChevronRight size={12} />
        <span style={{ color: accentColor }}>{prof.name}</span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — professor profile */}
        <aside className="w-72 flex-shrink-0 hidden lg:block overflow-y-auto p-4 border-r border-white/10">
          <ProfessorProfile
            prof={prof}
            school={isChancellor
              ? { gradient: 'from-eof-gold/15 to-eof-purple/10', border: 'border-eof-gold/30', accent: '#D4AF37' }
              : school}
          />

          {/* Quick prompts */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2 px-1">Quick Start</p>
            <div className="space-y-1.5">
              {ENGINES.map(e => (
                <button
                  key={e.id}
                  onClick={() => handleQuickPrompt(e.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10"
                >
                  <e.icon size={13} style={{ color: e.color }} />
                  <span>Use {e.label} Engine</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl border"
                style={{ background: `${accentColor}15`, borderColor: `${accentColor}30` }}
              >
                {isChancellor ? '🏛️' : prof.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{prof.name}</p>
                <p className="text-xs" style={{ color: accentColor }}>{isChancellor ? 'Supreme Academic Intelligence' : prof.model}</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <FiRefreshCw size={12} /> New Session
            </button>
          </div>

          {/* Engine selector */}
          <div className="flex gap-1.5 px-4 md:px-6 py-2.5 border-b border-white/10 overflow-x-auto flex-shrink-0">
            {ENGINES.map(e => (
              <button
                key={e.id}
                onClick={() => setActiveEngine(e.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 border ${
                  activeEngine === e.id
                    ? 'text-white border-transparent'
                    : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
                }`}
                style={activeEngine === e.id ? { background: `${e.color}20`, borderColor: `${e.color}40`, color: e.color } : {}}
              >
                <e.icon size={12} />
                {e.label}
                {e.id === 'meta' && <FiZap size={10} className="text-eof-gold" />}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} accentColor={accentColor} />
              ))}
              {isTyping && <TypingIndicator accentColor={accentColor} />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 md:px-6 pb-4 pt-2 flex-shrink-0 border-t border-white/10">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${prof.name.replace('Professor ', 'Prof. ')} anything… (Enter to send)`}
                  rows={1}
                  className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-eof-gold/40 resize-none leading-relaxed"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !isTyping ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: input.trim() && !isTyping ? `${accentColor}50` : 'rgba(255,255,255,0.1)',
                  color: input.trim() && !isTyping ? accentColor : '#6B7280',
                }}
              >
                <FiSend size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 text-center">
              Active: <span className="text-gray-500">{ENGINES.find(e => e.id === activeEngine)?.label} Engine</span>
              {' · '}Powered by Metacognition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

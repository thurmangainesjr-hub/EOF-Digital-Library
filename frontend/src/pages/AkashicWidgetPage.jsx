import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiSmartphone, FiMonitor, FiDownload } from 'react-icons/fi';

const ACCENT = '#0D9488';

const MOCK_STATS = {
  generationsTraced: 7,
  branchesExplored: 14,
  yearsDocumented: 403,
  documentsFound: 89,
  researchDepth: 'Deep',
  activeResearch: 'Akan lineage — Ghana, West Africa',
  timeline: [
    { year: '1619', label: 'First Africans in Colonial America', done: true  },
    { year: '1808', label: 'End of Atlantic Slave Trade',        done: true  },
    { year: '1865', label: 'Emancipation Records',               done: true  },
    { year: '1915', label: 'Great Migration North',              done: false },
    { year: 'Now',  label: 'Your story continues',               done: false },
  ],
  discoveries: [
    { emoji: '🌍', type: 'Lineage',   name: 'Akan people — Ghana',      depth: '7 gen' },
    { emoji: '📍', type: 'Migration', name: 'Mississippi → Chicago',     depth: '4 branches' },
    { emoji: '🏛️', type: 'Archive',   name: 'Freedmen\'s Bureau, 1867',  depth: '6 docs' },
  ],
};

export function SmallAkashicWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 155, height: 155,
        background: 'linear-gradient(145deg, #001a18 0%, #0d0d0d 100%)',
        border: '1px solid rgba(13,148,136,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-teal-300"
            style={{ width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
              top: `${(i * 17 + 7) % 90}%`, left: `${(i * 23 + 11) % 95}%`, opacity: 0.5 + (i % 4) * 0.1 }} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex flex-col p-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'rgba(13,148,136,0.18)', border: '1px solid rgba(13,148,136,0.3)' }}>🌌</div>
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ACCENT }}>Akashic</span>
        </div>
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Generations</p>
          <p className="text-2xl font-black text-white leading-none">{stats.generationsTraced}</p>
          <p className="text-[10px] font-bold mt-1" style={{ color: ACCENT }}>{stats.yearsDocumented} years traced</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-600">{stats.branchesExplored} branches</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(13,148,136,0.15)', color: ACCENT }}>Premium</span>
        </div>
      </div>
    </div>
  );
}

export function MediumAkashicWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 329, height: 155,
        background: 'linear-gradient(145deg, #001a18 0%, #0d0d0d 100%)',
        border: '1px solid rgba(13,148,136,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-teal-300"
            style={{ width: 1, height: 1, top: `${(i * 17 + 7) % 90}%`, left: `${(i * 23 + 11) % 95}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex p-4 gap-4">
        <div className="flex flex-col justify-between flex-shrink-0" style={{ width: 120 }}>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🌌</span>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ACCENT }}>Akashic</span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Generations</p>
            <p className="text-xl font-black text-white">{stats.generationsTraced}</p>
            <p className="text-[9px] text-gray-500 mt-0.5">{stats.yearsDocumented} years documented</p>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">Branches:</span>
              <span className="text-[9px] font-bold" style={{ color: ACCENT }}>{stats.branchesExplored}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">Docs found:</span>
              <span className="text-[9px] font-bold text-white">{stats.documentsFound}</span>
            </div>
          </div>
        </div>
        <div className="w-px self-stretch" style={{ background: 'rgba(13,148,136,0.12)' }} />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Active Research</p>
            <p className="text-[10px] text-gray-200 leading-relaxed">{stats.activeResearch}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Discoveries</p>
            <div className="space-y-1">
              {stats.discoveries.slice(0, 2).map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="text-sm">{d.emoji}</span>
                  <span className="text-[9px] text-gray-300 flex-1 truncate">{d.name}</span>
                  <span className="text-[9px] text-gray-500">{d.depth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LargeAkashicWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 329, height: 345,
        background: 'linear-gradient(145deg, #001a18 0%, #000f0d 30%, #0d0d0d 100%)',
        border: '1px solid rgba(13,148,136,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-teal-300"
            style={{ width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
              top: `${(i * 17 + 7) % 90}%`, left: `${(i * 23 + 11) % 95}%`, opacity: 0.4 + (i % 5) * 0.1 }} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex flex-col p-4 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🌌</span>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: ACCENT }}>Akashic Records</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full border font-bold"
            style={{ color: ACCENT, borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.08)' }}>Premium</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['🌐', stats.generationsTraced, 'Generations'],['🌿', stats.branchesExplored, 'Branches'],['📄', stats.documentsFound, 'Documents']].map(([icon, val, label]) => (
            <div key={label} className="rounded-xl p-2 text-center border"
              style={{ background: 'rgba(13,148,136,0.06)', borderColor: 'rgba(13,148,136,0.15)' }}>
              <p className="text-base">{icon}</p>
              <p className="text-xs font-black text-white">{val}</p>
              <p className="text-[8px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl px-3 py-2.5 border" style={{ background: 'rgba(13,148,136,0.06)', borderColor: 'rgba(13,148,136,0.15)' }}>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Active Research</p>
          <p className="text-[10px] text-gray-200">{stats.activeResearch}</p>
          <p className="text-[9px] mt-1" style={{ color: ACCENT }}>{stats.yearsDocumented} years covered</p>
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Historical Timeline</p>
          <div className="space-y-1.5">
            {stats.timeline.map(t => (
              <div key={t.year} className="flex items-center gap-2">
                <span className="text-[9px] font-black w-8 flex-shrink-0 text-right"
                  style={{ color: t.done ? ACCENT : 'rgba(255,255,255,0.2)' }}>{t.year}</span>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: t.done ? ACCENT : 'rgba(255,255,255,0.1)' }} />
                <span className="text-[9px] text-gray-400 truncate">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-white/6">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Key Discoveries</p>
          <div className="flex gap-2">
            {stats.discoveries.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 rounded-lg px-2 py-1 flex-1"
                style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.12)' }}>
                <span className="text-sm">{d.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[8px] text-gray-300 truncate">{d.type}</p>
                  <p className="text-[8px] text-gray-500 truncate">{d.depth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AkashicAppWidget({ size = 'medium', stats = MOCK_STATS }) {
  if (size === 'small')  return <SmallAkashicWidget stats={stats} />;
  if (size === 'large')  return <LargeAkashicWidget stats={stats} />;
  return <MediumAkashicWidget stats={stats} />;
}

function PhoneFrame({ size, children }) {
  const w = size === 'large' ? 375 : 355;
  const h = size === 'large' ? 620 : 480;
  return (
    <div className="relative rounded-[44px] overflow-hidden flex-shrink-0"
      style={{ width: w, height: h, background: '#080808', border: '2px solid #222',
        boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)' }}>
      <div className="flex items-center justify-between px-6 pt-3 pb-1 relative z-10">
        <span className="text-[10px] text-white/50 font-medium">9:41</span>
        <div className="w-20 h-5 rounded-full bg-black absolute top-2 left-1/2 -translate-x-1/2 border border-white/8" />
        <span className="text-[10px] text-white/50">●●●</span>
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #001a18 0%, #0d0d0d 60%)' }} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 px-4 pt-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 self-start px-2">Today</p>
        {children}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/15" />
    </div>
  );
}

function DesktopFrame({ children }) {
  return (
    <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{ width: 460, height: 300,
        background: 'linear-gradient(135deg, #001a18 0%, #000f0d 50%, #0a0a0a 100%)',
        border: '1px solid rgba(13,148,136,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] text-white/25 mx-auto">Akashic Records</span>
      </div>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative flex items-center justify-center h-full pb-8 pt-4">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 flex items-center px-4 gap-2 border-t border-white/5">
        {['🌌', '🔭', '🌍', '📜', '🧬'].map(e => (
          <span key={e} className="text-sm opacity-50 hover:opacity-100 transition-opacity cursor-pointer">{e}</span>
        ))}
        <span className="flex-1" />
        <span className="text-[9px] text-white/25">9:41 AM</span>
      </div>
    </div>
  );
}

function InstallCard({ icon, title, steps, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
          style={{ background: `${accent}15`, borderColor: `${accent}30` }}>{icon}</div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border"
              style={{ background: `${accent}15`, borderColor: `${accent}30`, color: accent }}>{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

const SIZES = [
  { id: 'small',  label: 'Small',  dims: '155 × 155', desc: 'Generations traced + years' },
  { id: 'medium', label: 'Medium', dims: '329 × 155', desc: 'Active research + discoveries' },
  { id: 'large',  label: 'Large',  dims: '329 × 345', desc: 'Full dashboard — timeline + records' },
];

export function AkashicWidgetPage() {
  const [activeSize, setActiveSize] = useState('medium');
  const [activeView, setActiveView] = useState('phone');

  function Preview() {
    if (activeSize === 'small') return <SmallAkashicWidget />;
    if (activeSize === 'large') return <LargeAkashicWidget />;
    return <MediumAkashicWidget />;
  }

  return (
    <div className="min-h-full px-4 md:px-6 py-8 pb-16">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,13,13,0.95))', borderColor: 'rgba(13,148,136,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(13,148,136,0.08), transparent 60%)' }} />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 border"
            style={{ background: 'rgba(13,148,136,0.12)', borderColor: 'rgba(13,148,136,0.3)', color: '#2DD4BF' }}>
            <FiGrid size={11} /> Widget Gallery — 3 Sizes
          </div>
          <h1 className="font-serif text-3xl text-white font-bold mb-2">Akashic Records Widgets</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Add the Akashic Records to your home screen or desktop. Track generations traced, active lineage research, and historical discoveries — at a glance.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="lg:w-64 flex-shrink-0 space-y-5">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Size</p>
            <div className="space-y-2">
              {SIZES.map(s => (
                <button key={s.id} onClick={() => setActiveSize(s.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    activeSize === s.id ? 'text-white' : 'border-white/8 bg-white/2 text-gray-500 hover:border-white/15'
                  }`}
                  style={activeSize === s.id ? { borderColor: 'rgba(13,148,136,0.4)', background: 'rgba(13,148,136,0.08)' } : {}}>
                  <div>
                    <p className={`text-sm font-medium ${activeSize === s.id ? 'text-white' : ''}`}>{s.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{s.dims} — {s.desc}</p>
                  </div>
                  {activeSize === s.id && <span className="ml-auto w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: ACCENT }} />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Preview On</p>
            <div className="flex gap-2">
              {[{ id:'phone', icon:FiSmartphone, label:'Phone' },{ id:'desktop', icon:FiMonitor, label:'Desktop' },{ id:'bare', icon:FiGrid, label:'Bare' }].map(v => (
                <button key={v.id} onClick={() => setActiveView(v.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition-all ${
                    activeView === v.id ? 'text-teal-400' : 'border-white/8 bg-white/2 text-gray-600 hover:text-gray-400'
                  }`}
                  style={activeView === v.id ? { borderColor: 'rgba(13,148,136,0.4)', background: 'rgba(13,148,136,0.08)' } : {}}>
                  <v.icon size={14} />{v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[360px] rounded-2xl border border-white/6 bg-white/2">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeSize}-${activeView}`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2 }}>
              {activeView === 'phone'   && <PhoneFrame size={activeSize}><Preview /></PhoneFrame>}
              {activeView === 'desktop' && <DesktopFrame><Preview /></DesktopFrame>}
              {activeView === 'bare'    && <div className="p-8"><Preview /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">All Sizes</h2>
        <p className="text-sm text-gray-500 mb-6">Every widget, rendered side by side</p>
        <div className="flex flex-wrap gap-6 items-end">
          {[['small','Small — 155×155'],['medium','Medium — 329×155'],['large','Large — 329×345']].map(([size, label]) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <AkashicAppWidget size={size} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Add to Your Screen</h2>
        <p className="text-sm text-gray-500 mb-5">Install Akashic Records as a standalone app</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InstallCard icon="🍎" title="iOS — Home Screen" accent={ACCENT} steps={['Open Akashic Records in Safari','Tap the Share button','Select "Add to Home Screen"','Tap "Add" — widget appears instantly']} />
          <InstallCard icon="🤖" title="Android — Home Screen" accent={ACCENT} steps={['Open Akashic Records in Chrome','Tap the menu (three dots)','Select "Add to Home Screen"','Confirm — icon added to launcher']} />
          <InstallCard icon="🖥️" title="Windows Desktop" accent={ACCENT} steps={['Run create-akashic-shortcut.ps1 from project root','Find "Akashic Records.lnk" on your desktop','Double-click to open in app mode','Or click the install icon in Chrome\'s address bar']} />
        </div>
      </section>

      <div className="rounded-2xl border p-6 flex flex-col md:flex-row md:items-center gap-4"
        style={{ background: 'rgba(13,148,136,0.07)', borderColor: 'rgba(13,148,136,0.25)' }}>
        <div className="text-4xl flex-shrink-0">🖥️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Windows Desktop Shortcut</h3>
          <p className="text-sm text-gray-400">Opens Akashic Records in standalone Chrome app mode — deep genealogy research without browser distractions.</p>
          <code className="inline-block mt-2 text-xs bg-black/40 border border-white/10 rounded px-3 py-1.5 text-green-400 font-mono">
            powershell -ExecutionPolicy Bypass -File create-akashic-shortcut.ps1
          </code>
        </div>
        <Link to="/akashic" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium flex-shrink-0 border transition-colors"
          style={{ borderColor: 'rgba(13,148,136,0.3)', color: '#2DD4BF' }}>
          <FiDownload size={14} /> Back to Akashic
        </Link>
      </div>
    </div>
  );
}

export default AkashicWidgetPage;

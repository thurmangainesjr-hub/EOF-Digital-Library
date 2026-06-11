import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiSmartphone, FiMonitor, FiDownload } from 'react-icons/fi';

const ACCENT = '#6366F1';

const MOCK_STATS = {
  memoriesStored: 1247,
  familyMembers: 38,
  yearsSpanned: 94,
  recentCapture: 'Photo — 1962 Family Portrait',
  captureTypes: [
    { icon: '📸', label: 'Photos',    count: 412 },
    { icon: '🎤', label: 'Stories',   count: 89  },
    { icon: '📄', label: 'Documents', count: 203 },
    { icon: '🎬', label: 'Videos',    count: 27  },
  ],
  recentCaptures: [
    { type: '📸', name: '1962 Family Portrait',    who: 'Grandma Rose',  time: '2h ago'  },
    { type: '🎤', name: 'Uncle James Interview',   who: 'James Sr.',     time: '1d ago'  },
    { type: '📄', name: 'Birth Certificate — 1941',who: 'Archive Scan',  time: '3d ago'  },
    { type: '🎬', name: 'Christmas 1988',           who: 'Home Video',    time: '1wk ago' },
  ],
};

export function SmallLegacyWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 155, height: 155,
        background: 'linear-gradient(145deg, #080615 0%, #0d0d0d 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex flex-col p-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.3)' }}>🏛️</div>
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ACCENT }}>Vault</span>
        </div>
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Memories Stored</p>
          <p className="text-2xl font-black text-white leading-none">{stats.memoriesStored.toLocaleString()}</p>
          <p className="text-[10px] font-bold mt-1" style={{ color: ACCENT }}>{stats.yearsSpanned} years of history</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-600">{stats.familyMembers} members</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(99,102,241,0.15)', color: ACCENT }}>Legacy</span>
        </div>
      </div>
    </div>
  );
}

export function MediumLegacyWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 329, height: 155,
        background: 'linear-gradient(145deg, #080615 0%, #0d0d0d 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex p-4 gap-4">
        <div className="flex flex-col justify-between flex-shrink-0" style={{ width: 120 }}>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🏛️</span>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ACCENT }}>Legacy Vault</span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Preserved</p>
            <p className="text-xl font-black text-white">{stats.memoriesStored.toLocaleString()}</p>
            <p className="text-[9px] text-gray-500 mt-0.5">memories</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">Members:</span>
              <span className="text-[9px] font-bold text-white">{stats.familyMembers}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">Span:</span>
              <span className="text-[9px] font-bold" style={{ color: ACCENT }}>{stats.yearsSpanned}yrs</span>
            </div>
          </div>
        </div>
        <div className="w-px self-stretch" style={{ background: 'rgba(99,102,241,0.12)' }} />
        <div className="flex-1 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Recent Captures</p>
          <div className="flex-1 space-y-1.5">
            {stats.recentCaptures.slice(0, 3).map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="text-sm flex-shrink-0">{c.type}</span>
                <span className="text-[10px] text-gray-300 flex-1 truncate">{c.name}</span>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{c.time}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {stats.captureTypes.slice(0, 3).map(t => (
              <div key={t.label} className="text-center">
                <p className="text-sm">{t.icon}</p>
                <p className="text-[9px] font-bold text-white">{t.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LargeLegacyWidget({ stats = MOCK_STATS }) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 relative"
      style={{ width: 329, height: 345,
        background: 'linear-gradient(145deg, #080615 0%, #050310 30%, #0d0d0d 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)' }} />
      <div className="relative z-10 h-full flex flex-col p-4 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🏛️</span>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: ACCENT }}>Legacy Vault</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full border font-bold"
            style={{ color: ACCENT, borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)' }}>{stats.yearsSpanned} years</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stats.captureTypes.map(t => (
            <div key={t.label} className="rounded-xl p-2 text-center border"
              style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.15)' }}>
              <p className="text-base">{t.icon}</p>
              <p className="text-xs font-black text-white">{t.count}</p>
              <p className="text-[8px] text-gray-500 mt-0.5">{t.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-3 border" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.15)' }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Total Memories</p>
              <p className="text-2xl font-black text-white">{stats.memoriesStored.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500">Family members</p>
              <p className="text-lg font-black" style={{ color: ACCENT }}>{stats.familyMembers}</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Recent Captures</p>
          <div className="space-y-1.5">
            {stats.recentCaptures.map(c => (
              <div key={c.name} className="flex items-center gap-2 rounded-xl px-2 py-1.5"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-sm flex-shrink-0">{c.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-200 truncate">{c.name}</p>
                  <p className="text-[8px] text-gray-500">{c.who}</p>
                </div>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyVaultAppWidget({ size = 'medium', stats = MOCK_STATS }) {
  if (size === 'small')  return <SmallLegacyWidget stats={stats} />;
  if (size === 'large')  return <LargeLegacyWidget stats={stats} />;
  return <MediumLegacyWidget stats={stats} />;
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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #080615 0%, #0d0d0d 60%)' }} />
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
        background: 'linear-gradient(135deg, #080615 0%, #050310 50%, #0a0a0a 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] text-white/25 mx-auto">Legacy Vault</span>
      </div>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative flex items-center justify-center h-full pb-8 pt-4">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 flex items-center px-4 gap-2 border-t border-white/5">
        {['🤖', '👨‍👩‍👧‍👦', '🗃️', '📜'].map(e => (
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
  { id: 'small',  label: 'Small',  dims: '155 × 155', desc: 'Memory count + years spanned' },
  { id: 'medium', label: 'Medium', dims: '329 × 155', desc: 'Recent captures + type breakdown' },
  { id: 'large',  label: 'Large',  dims: '329 × 345', desc: 'Full vault — all captures + stats' },
];

export function LegacyVaultWidgetPage() {
  const [activeSize, setActiveSize] = useState('medium');
  const [activeView, setActiveView] = useState('phone');

  function Preview() {
    if (activeSize === 'small') return <SmallLegacyWidget />;
    if (activeSize === 'large') return <LargeLegacyWidget />;
    return <MediumLegacyWidget />;
  }

  return (
    <div className="min-h-full px-4 md:px-6 py-8 pb-16">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(13,13,13,0.95))', borderColor: 'rgba(99,102,241,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08), transparent 60%)' }} />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 border"
            style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.3)', color: '#A5B4FC' }}>
            <FiGrid size={11} /> Widget Gallery — 3 Sizes
          </div>
          <h1 className="font-serif text-3xl text-white font-bold mb-2">Legacy Vault Widgets</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Add the Legacy Vault to your home screen or desktop. See preserved memories, recent captures, and your family timeline — at a glance.
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
                  style={activeSize === s.id ? { borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)' } : {}}>
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
                    activeView === v.id ? 'text-indigo-400' : 'border-white/8 bg-white/2 text-gray-600 hover:text-gray-400'
                  }`}
                  style={activeView === v.id ? { borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)' } : {}}>
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
              <LegacyVaultAppWidget size={size} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Add to Your Screen</h2>
        <p className="text-sm text-gray-500 mb-5">Install Legacy Vault as a standalone app</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InstallCard icon="🍎" title="iOS — Home Screen" accent={ACCENT} steps={['Open Legacy Vault in Safari','Tap the Share button','Select "Add to Home Screen"','Tap "Add" — widget appears instantly']} />
          <InstallCard icon="🤖" title="Android — Home Screen" accent={ACCENT} steps={['Open Legacy Vault in Chrome','Tap the menu (three dots)','Select "Add to Home Screen"','Confirm — icon added to launcher']} />
          <InstallCard icon="🖥️" title="Windows Desktop" accent={ACCENT} steps={['Run create-legacy-vault-shortcut.ps1 from project root','Find "Legacy Vault.lnk" on your desktop','Double-click to open in app mode','Or click the install icon in Chrome\'s address bar']} />
        </div>
      </section>

      <div className="rounded-2xl border p-6 flex flex-col md:flex-row md:items-center gap-4"
        style={{ background: 'rgba(99,102,241,0.07)', borderColor: 'rgba(99,102,241,0.25)' }}>
        <div className="text-4xl flex-shrink-0">🖥️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Windows Desktop Shortcut</h3>
          <p className="text-sm text-gray-400">Opens Legacy Vault in standalone Chrome app mode — preserve your family's history without distractions.</p>
          <code className="inline-block mt-2 text-xs bg-black/40 border border-white/10 rounded px-3 py-1.5 text-green-400 font-mono">
            powershell -ExecutionPolicy Bypass -File create-legacy-vault-shortcut.ps1
          </code>
        </div>
        <Link to="/legacy-vault" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium flex-shrink-0 border transition-colors"
          style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#A5B4FC' }}>
          <FiDownload size={14} /> Back to Legacy Vault
        </Link>
      </div>
    </div>
  );
}

export default LegacyVaultWidgetPage;

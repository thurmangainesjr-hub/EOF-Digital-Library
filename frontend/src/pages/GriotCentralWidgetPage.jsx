import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiGrid, FiSmartphone, FiMonitor, FiZap } from 'react-icons/fi';
import GriotCentralWidget, { SmallWidget, MediumWidget, LargeWidget } from '../components/Widget/GriotCentralWidget';

const ACCENT = '#10B981';

const SIZES = [
  { id: 'small',  label: 'Small',  dims: '155 × 155', desc: 'Ecosystem health ring + active count' },
  { id: 'medium', label: 'Medium', dims: '329 × 155', desc: 'System grid + health percentages' },
  { id: 'large',  label: 'Large',  dims: '329 × 345', desc: 'Full dashboard — all systems + agents' },
];

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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #071a10 0%, #0d0d0d 40%, #0a0a0d 100%)' }} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 px-4 pt-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 self-start px-2">Central</p>
        {children}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/15" />
    </div>
  );
}

function DesktopFrame({ children }) {
  return (
    <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{ width: 460, height: 300, background: 'linear-gradient(135deg, #071a10 0%, #061510 50%, #0d0d0a 100%)',
               border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] text-white/25 mx-auto">Griot Central</span>
      </div>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative flex items-center justify-center h-full pb-8 pt-4">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 flex items-center px-4 gap-2 border-t border-white/5">
        {['⚡', '🤖', '🎬', '🎵', '🏆'].map(e => (
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

export default function GriotCentralWidgetPage() {
  const [activeSize, setActiveSize] = useState('medium');
  const [activeView, setActiveView] = useState('phone');

  function Preview() {
    if (activeSize === 'small') return <SmallWidget />;
    if (activeSize === 'large') return <LargeWidget />;
    return <MediumWidget />;
  }

  return (
    <div className="min-h-full px-4 md:px-6 py-8 pb-16">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(13,13,13,0.95))', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.07), transparent 60%)' }} />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 border"
            style={{ background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.25)', color: ACCENT }}>
            <FiGrid size={11} /> Widget Gallery — 3 Sizes
          </div>
          <h1 className="font-serif text-3xl text-white font-bold mb-2">⚡ Griot Central Widgets</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Monitor your entire ecosystem from your home screen. See all 8 systems, agent status, health scores, and active operations — at a glance.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Link to="/griot-central" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border"
              style={{ background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.25)', color: ACCENT }}>
              <FiZap size={13}/> Open Griot Central
            </Link>
            <Link to="/griot-architecture" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-gray-400 hover:text-white transition-colors">
              🗂️ Architecture Doc
            </Link>
          </div>
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
                    activeSize === s.id ? 'border-emerald-500/35 bg-emerald-500/8 text-white' : 'border-white/8 bg-white/2 text-gray-500 hover:border-white/15'
                  }`}>
                  <div>
                    <p className={`text-sm font-medium ${activeSize === s.id ? 'text-emerald-400' : ''}`}>{s.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{s.dims} — {s.desc}</p>
                  </div>
                  {activeSize === s.id && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Preview On</p>
            <div className="flex gap-2">
              {[{ id: 'phone', icon: FiSmartphone, label: 'Phone' }, { id: 'desktop', icon: FiMonitor, label: 'Desktop' }, { id: 'bare', icon: FiGrid, label: 'Bare' }].map(v => (
                <button key={v.id} onClick={() => setActiveView(v.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition-all ${
                    activeView === v.id ? 'border-emerald-500/35 bg-emerald-500/8 text-emerald-400' : 'border-white/8 bg-white/2 text-gray-600 hover:text-gray-400'
                  }`}>
                  <v.icon size={14} />{v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Owner badge */}
          <div className="rounded-xl p-3 border" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <p className="text-[9px] font-semibold tracking-widest uppercase text-emerald-400/70 mb-1">Owner Access</p>
            <p className="text-xs text-white font-semibold">Thurman Gaines Jr.</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Unrestricted · All Systems</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-[360px] rounded-2xl border border-white/6 bg-white/2">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeSize}-${activeView}`}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2 }}>
              {activeView === 'phone'   && <PhoneFrame size={activeSize}><Preview /></PhoneFrame>}
              {activeView === 'desktop' && <DesktopFrame><Preview /></DesktopFrame>}
              {activeView === 'bare'    && <div className="p-8"><Preview /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">All Sizes</h2>
        <p className="text-sm text-gray-500 mb-6">Every widget size, rendered side by side</p>
        <div className="flex flex-wrap gap-6 items-end">
          {[['small', 'Small — 155×155'], ['medium', 'Medium — 329×155'], ['large', 'Large — 329×345']].map(([size, label]) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <GriotCentralWidget size={size} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Add to Your Screen</h2>
        <p className="text-sm text-gray-500 mb-5">Monitor your entire Griot Ecosystem from anywhere</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InstallCard icon="🍎" title="iOS — Home Screen" accent={ACCENT} steps={['Open Griot Central in Safari', 'Tap Share → "Add to Home Screen"', 'Tap "Add" — icon appears instantly', 'Long-press to choose widget size']} />
          <InstallCard icon="🤖" title="Android — Home Screen" accent="#8B5CF6" steps={['Open Griot Central in Chrome', 'Tap menu (⋮) → "Add to Home Screen"', 'Confirm — icon added to launcher', 'Long-press to resize']} />
          <InstallCard icon="🖥️" title="Windows Desktop" accent="#C0392B" steps={['Use the shortcut on your Desktop', 'Double-click "Griot Central.url"', 'Opens in Chrome app mode', 'Pin to taskbar for one-click access']} />
        </div>
      </section>

      <div className="rounded-2xl border p-6 flex flex-col md:flex-row md:items-center gap-4"
        style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="text-4xl flex-shrink-0">⚡</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Griot Central Hub</h3>
          <p className="text-sm text-gray-400">Your command center for the entire Griot Ecosystem. Monitor all 8 systems, manage agents, and control everything from one place.</p>
        </div>
        <Link to="/griot-central" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium flex-shrink-0 border"
          style={{ borderColor: 'rgba(16,185,129,0.25)', color: ACCENT }}>
          <FiZap size={14}/> Griot Central <FiChevronRight size={14}/>
        </Link>
      </div>
    </div>
  );
}

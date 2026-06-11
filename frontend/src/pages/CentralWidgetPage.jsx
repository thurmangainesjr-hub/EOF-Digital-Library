import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiGrid, FiSmartphone, FiMonitor, FiDownload } from 'react-icons/fi';
import CentralAIWidget, {
  SmallCentralWidget,
  MediumCentralWidget,
  LargeCentralWidget,
} from '../components/Widget/CentralAIWidget';

const SIZES = [
  { id: 'small',  label: 'Small',  dims: '155 × 155', desc: 'Status glance — systems & agent count' },
  { id: 'medium', label: 'Medium', dims: '329 × 155', desc: 'Core agents + active system count' },
  { id: 'large',  label: 'Large',  dims: '329 × 345', desc: 'Full hub dashboard — all systems & flow' },
];

// ── Phone frame ───────────────────────────────────────────────────────────────
function PhoneFrame({ size, children }) {
  const w = size === 'large' ? 375 : 355;
  const h = size === 'large' ? 620 : 480;
  return (
    <div className="relative rounded-[44px] overflow-hidden flex-shrink-0"
      style={{
        width: w, height: h,
        background: '#080808',
        border: '2px solid #222',
        boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-center justify-between px-6 pt-3 pb-1 relative z-10">
        <span className="text-[10px] text-white/50 font-medium">9:41</span>
        <div className="w-20 h-5 rounded-full bg-black absolute top-2 left-1/2 -translate-x-1/2 border border-white/8" />
        <span className="text-[10px] text-white/50">●●●</span>
      </div>
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #1a1200 0%, #0d0d0d 40%, #0a0d0a 100%)' }} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 px-4 pt-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 self-start px-2">Today</p>
        {children}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/15" />
    </div>
  );
}

// ── Desktop frame ─────────────────────────────────────────────────────────────
function DesktopFrame({ children }) {
  return (
    <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: 520, height: 340,
        background: '#050505',
        border: '2px solid #1a1a1a',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      }}
    >
      {/* Titlebar */}
      <div className="h-8 flex items-center px-3 gap-1.5 border-b border-white/5"
        style={{ background: '#0f0f0f' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
          <div key={c} className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-gray-600 ml-2">EOF Central AI Hub</span>
      </div>
      {/* Desktop wallpaper */}
      <div className="absolute inset-8"
        style={{ background: 'linear-gradient(135deg, #1a1200 0%, #0d0d0d 60%, #0a0d1a 100%)' }} />
      <div className="relative z-10 flex items-center justify-center h-[calc(100%-2rem)]">
        {children}
      </div>
    </div>
  );
}

export default function CentralWidgetPage() {
  const [activeSize, setActiveSize] = useState('medium');
  const [platform, setPlatform] = useState('phone');

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/central" className="hover:text-eof-gold transition-colors">EOF Central</Link>
        <FiChevronRight size={12} />
        <span className="text-eof-gold">Widget Gallery</span>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-eof-gold/10 border border-eof-gold/25 rounded-full px-3 py-1 text-xs text-eof-gold mb-3">
          <FiGrid size={11} /> Home Screen Widgets
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-bold mb-2">
          EOF Central AI Hub Widgets
        </h1>
        <p className="text-sm text-gray-500 max-w-xl">
          Add the Central AI Hub to your home screen, desktop, or lock screen. Three sizes for every context.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Size picker */}
        <div className="flex gap-2">
          {SIZES.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSize(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activeSize === s.id
                  ? 'border-eof-gold/50 text-eof-gold'
                  : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
              }`}
              style={activeSize === s.id ? { background: 'rgba(212,175,55,0.10)' } : {}}
            >
              {s.label}
              <span className="ml-1.5 text-[10px] opacity-60">{s.dims}</span>
            </button>
          ))}
        </div>

        {/* Platform picker */}
        <div className="flex gap-2 ml-auto">
          {[
            { id: 'phone', icon: <FiSmartphone size={13} />, label: 'Mobile' },
            { id: 'desktop', icon: <FiMonitor size={13} />, label: 'Desktop' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                platform === p.id
                  ? 'border-eof-gold/50 text-eof-gold'
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/20'
              }`}
              style={platform === p.id ? { background: 'rgba(212,175,55,0.10)' } : {}}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size description */}
      <div className="mb-6 p-4 rounded-xl border border-white/8 bg-white/3 text-sm text-gray-400 max-w-xl">
        <span className="text-white font-medium">{SIZES.find(s => s.id === activeSize)?.label}: </span>
        {SIZES.find(s => s.id === activeSize)?.desc}
        <span className="ml-2 text-xs text-gray-600">
          ({SIZES.find(s => s.id === activeSize)?.dims}px)
        </span>
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${platform}-${activeSize}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex justify-center mb-12"
        >
          {platform === 'phone' ? (
            <PhoneFrame size={activeSize}>
              <CentralAIWidget size={activeSize} />
            </PhoneFrame>
          ) : (
            <DesktopFrame>
              <CentralAIWidget size={activeSize} />
            </DesktopFrame>
          )}
        </motion.div>
      </AnimatePresence>

      {/* All sizes reference */}
      <section className="mb-10">
        <h2 className="font-serif text-xl text-white font-bold mb-5">All Sizes</h2>
        <div className="flex flex-wrap gap-8 items-end">
          <div className="flex flex-col items-center gap-2">
            <SmallCentralWidget />
            <p className="text-xs text-gray-600">Small · 155×155</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MediumCentralWidget />
            <p className="text-xs text-gray-600">Medium · 329×155</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <LargeCentralWidget />
            <p className="text-xs text-gray-600">Large · 329×345</p>
          </div>
        </div>
      </section>

      {/* Install CTA */}
      <div className="rounded-2xl border border-eof-gold/25 p-6 flex flex-col md:flex-row md:items-center gap-4 max-w-2xl"
        style={{ background: 'rgba(212,175,55,0.05)' }}>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Add to Your Home Screen</h3>
          <p className="text-sm text-gray-400">
            On mobile: tap Share → Add to Home Screen. On desktop: run the shortcut script to open as a standalone window.
          </p>
        </div>
        <Link
          to="/central"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 transition-all hover:brightness-110 border"
          style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.35)', color: '#D4AF37' }}
        >
          <FiDownload size={14} /> Open Hub
        </Link>
      </div>
    </div>
  );
}

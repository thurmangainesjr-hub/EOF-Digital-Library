import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiDownload, FiMonitor, FiSmartphone, FiGrid } from 'react-icons/fi';
import AppWidget, { SmallWidget, MediumWidget, LargeWidget } from '../components/Widget/AppWidget';
import EcosystemWidget, {
  SmallEcosystemWidget,
  MediumEcosystemWidget,
  LargeEcosystemWidget,
} from '../components/Widget/EcosystemWidget';

const SIZES = [
  { id: 'small',  label: 'Small',  dims: '155 × 155', desc: 'Quick glance — status & progress' },
  { id: 'medium', label: 'Medium', dims: '329 × 155', desc: 'Activity summary — most popular' },
  { id: 'large',  label: 'Large',  dims: '329 × 345', desc: 'Full dashboard — all stats' },
];

const THEMES = [
  { id: 'ecosystem', label: 'EOF Ecosystem', desc: 'All 6 apps in one widget' },
  { id: 'library',   label: 'EOF Library',   desc: 'Reading progress & book list' },
];

// ── Mock phone frame ──────────────────────────────────────────────────────────
function PhoneFrame({ children, size }) {
  const frameW = size === 'large' ? 375 : size === 'medium' ? 375 : 320;
  const frameH = size === 'large' ? 620 : 520;

  return (
    <div
      className="relative rounded-[44px] overflow-hidden flex-shrink-0"
      style={{
        width: frameW,
        height: frameH,
        background: '#0a0a0a',
        border: '2px solid #2a2a2a',
        boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1">
        <span className="text-[10px] text-white/60 font-medium">9:41</span>
        <div className="w-20 h-5 rounded-full bg-black absolute top-2 left-1/2 -translate-x-1/2 border border-white/10" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/60">●●●</span>
        </div>
      </div>

      {/* Home screen bg */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #0d0d1a 40%, #0a1a0d 100%)' }}
      />

      {/* Widget centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-4 pt-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 self-start px-2">
          Today
        </p>
        {children}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20" />
    </div>
  );
}

// ── Desktop frame ─────────────────────────────────────────────────────────────
function DesktopFrame({ children }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: 480,
        height: 320,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-white/30 mx-auto">EOF Digital Library</span>
      </div>

      {/* Desktop wallpaper area */}
      <div className="relative flex items-center justify-center h-full pb-8 pt-4 px-6">
        {/* Wallpaper grid dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {children}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 backdrop-blur flex items-center px-4 gap-3 border-t border-white/5">
        {['📚', '🌀', '🎓', '📺', '📻'].map(icon => (
          <div key={icon} className="w-5 h-5 rounded flex items-center justify-center text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            {icon}
          </div>
        ))}
        <div className="flex-1" />
        <span className="text-[9px] text-white/30">9:41 AM</span>
      </div>
    </div>
  );
}

// ── Install card ──────────────────────────────────────────────────────────────
function InstallCard({ icon, title, steps, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
          style={{ background: `${accent}15`, borderColor: `${accent}30` }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border"
              style={{ background: `${accent}15`, borderColor: `${accent}30`, color: accent }}
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WidgetShowcase() {
  const [activeSize, setActiveSize]   = useState('medium');
  const [activeTheme, setActiveTheme] = useState('ecosystem');
  const [activeView, setActiveView]   = useState('phone');

  const mockStats = { booksRead: 12, streak: 7, hoursRead: 24, adaptations: 8, readingProgress: 68 };
  const mockBook  = { title: 'The Freedom Blueprint', author: 'Marcus J. Freeman' };

  function WidgetPreview() {
    if (activeTheme === 'ecosystem') {
      if (activeSize === 'small')  return <SmallEcosystemWidget />;
      if (activeSize === 'large')  return <LargeEcosystemWidget stats={mockStats} />;
      return <MediumEcosystemWidget stats={mockStats} />;
    }
    if (activeSize === 'small')  return <SmallWidget stats={mockStats} book={mockBook} />;
    if (activeSize === 'large')  return <LargeWidget stats={mockStats} book={mockBook} />;
    return <MediumWidget stats={mockStats} book={mockBook} />;
  }

  return (
    <div className="min-h-screen bg-eof-dark px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-eof-gold transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <span className="text-eof-gold">Widget Gallery</span>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-eof-gold/10 via-eof-purple/5 to-transparent border border-eof-gold/20 px-6 py-8 mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.07) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-eof-gold/10 border border-eof-gold/25 rounded-full px-3 py-1 text-xs text-eof-gold mb-4">
            <FiGrid size={11} /> Widget Gallery — 2 Themes · 3 Sizes
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
            EOF Widgets
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Add the EOF ecosystem to your home screen or desktop. Live status, reading progress, app shortcuts — at a glance.
          </p>
        </div>
      </motion.div>

      {/* Controls + Preview */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">

        {/* Controls */}
        <div className="lg:w-72 flex-shrink-0 space-y-6">
          {/* Theme picker */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Theme</p>
            <div className="space-y-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    activeTheme === t.id
                      ? 'border-eof-gold/40 bg-eof-gold/8 text-white'
                      : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{t.id === 'ecosystem' ? '🌐' : '📚'}</span>
                  <div>
                    <p className={`text-sm font-medium ${activeTheme === t.id ? 'text-white' : ''}`}>{t.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                  </div>
                  {activeTheme === t.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-eof-gold flex-shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Size</p>
            <div className="space-y-2">
              {SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSize(s.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    activeSize === s.id
                      ? 'border-eof-gold/40 bg-eof-gold/8'
                      : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${activeSize === s.id ? 'text-white' : ''}`}>{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.dims} — {s.desc}</p>
                  </div>
                  {activeSize === s.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-eof-gold flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Preview On</p>
            <div className="flex gap-2">
              {[
                { id: 'phone',   icon: FiSmartphone, label: 'Phone'   },
                { id: 'desktop', icon: FiMonitor,    label: 'Desktop' },
                { id: 'bare',    icon: FiGrid,       label: 'Bare'    },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition-all ${
                    activeView === v.id
                      ? 'border-eof-gold/40 bg-eof-gold/8 text-eof-gold'
                      : 'border-white/10 bg-white/3 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <v.icon size={15} />
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex-1 flex items-center justify-center min-h-[400px] rounded-2xl bg-white/2 border border-white/8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTheme}-${activeSize}-${activeView}`}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.25 }}
            >
              {activeView === 'phone' && (
                <PhoneFrame size={activeSize}>
                  <WidgetPreview />
                </PhoneFrame>
              )}
              {activeView === 'desktop' && (
                <DesktopFrame>
                  <WidgetPreview />
                </DesktopFrame>
              )}
              {activeView === 'bare' && (
                <div className="flex items-center justify-center p-8">
                  <WidgetPreview />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* All widgets grid */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">All Widgets</h2>
        <p className="text-sm text-gray-500 mb-6">Every size, both themes</p>

        <div className="space-y-10">
          {THEMES.map(theme => (
            <div key={theme.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{theme.id === 'ecosystem' ? '🌐' : '📚'}</span>
                <h3 className="font-bold text-white text-base">{theme.label}</h3>
                <span className="text-xs text-gray-500 ml-1">— {theme.desc}</span>
              </div>
              <div className="flex flex-wrap gap-5 items-end">
                {theme.id === 'ecosystem' ? (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <SmallEcosystemWidget />
                      <span className="text-xs text-gray-500">Small · 155×155</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <MediumEcosystemWidget stats={mockStats} />
                      <span className="text-xs text-gray-500">Medium · 329×155</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <LargeEcosystemWidget stats={mockStats} />
                      <span className="text-xs text-gray-500">Large · 329×345</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <SmallWidget stats={mockStats} book={mockBook} />
                      <span className="text-xs text-gray-500">Small · 155×155</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <MediumWidget stats={mockStats} book={mockBook} />
                      <span className="text-xs text-gray-500">Medium · 329×155</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <LargeWidget stats={mockStats} book={mockBook} />
                      <span className="text-xs text-gray-500">Large · 329×345</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Install guides */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Add to Your Screen</h2>
        <p className="text-sm text-gray-500 mb-6">Install EOF as a native app on any platform</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InstallCard
            icon="🍎"
            title="iOS — Home Screen"
            accent="#0891B2"
            steps={[
              'Open EOF in Safari',
              'Tap the Share button (□↑)',
              'Select "Add to Home Screen"',
              'Tap "Add" — widget appears instantly',
            ]}
          />
          <InstallCard
            icon="🤖"
            title="Android — Home Screen"
            accent="#10B981"
            steps={[
              'Open EOF in Chrome',
              'Tap the menu (⋮) in top right',
              'Select "Add to Home Screen"',
              'Confirm — app icon added to launcher',
            ]}
          />
          <InstallCard
            icon="🖥️"
            title="Windows / Mac — Desktop"
            accent="#D4AF37"
            steps={[
              'Open EOF in Chrome or Edge',
              'Click the install icon (⊕) in the address bar',
              'Click "Install" in the prompt',
              'EOF opens as a standalone desktop app',
            ]}
          />
        </div>
      </section>

      {/* Desktop shortcut download */}
      <div className="rounded-2xl bg-gradient-to-r from-eof-gold/10 to-transparent border border-eof-gold/25 p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="text-4xl flex-shrink-0">🖥️</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-white font-bold mb-1">Windows Desktop Shortcut</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Run the shortcut script to add a one-click EOF launcher to your Windows desktop.
            Opens the full platform in a standalone browser window.
          </p>
          <code className="inline-block mt-2 text-xs bg-black/40 border border-white/10 rounded px-3 py-1.5 text-green-400 font-mono">
            powershell -ExecutionPolicy Bypass -File create-shortcut.ps1
          </code>
        </div>
        <Link
          to="/ecosystem"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm flex-shrink-0 bg-eof-gold/15 border border-eof-gold/35 text-eof-gold hover:bg-eof-gold/25 transition-colors"
        >
          <FiDownload size={14} /> Get Started
        </Link>
      </div>
    </div>
  );
}

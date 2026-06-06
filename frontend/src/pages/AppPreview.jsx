/**
 * EOF Digital Library — App Preview & Test Lab
 * Route: /preview
 *
 * An interactive test page that shows the app inside realistic device
 * frames and provides everything needed to validate before App Store submission.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSmartphone, FiTablet, FiMonitor, FiCheckCircle, FiAlertCircle,
  FiDownload, FiShare2, FiRefreshCw, FiExternalLink, FiInfo,
  FiZap, FiShield, FiPackage, FiWifi, FiCopy, FiCheck
} from 'react-icons/fi';

// ── Constants ─────────────────────────────────────────────────────────────────
const LOCAL_IP   = '192.168.1.90';
const PORT       = 5174;
const APP_URL    = `http://localhost:${PORT}`;
const NETWORK_URL= `http://${LOCAL_IP}:${PORT}`;
const BUILD_INFO = {
  version:    '1.0.0',
  buildDate:  new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
  bundleSize: '558 kB (160 kB gzip)',
  modules:    452,
  buildTime:  '4.52s',
};

// ── Device presets ────────────────────────────────────────────────────────────
const DEVICES = [
  {
    id: 'iphone15',
    label: 'iPhone 15 Pro',
    icon: FiSmartphone,
    frameW: 320, frameH: 660,
    screenW: 290, screenH: 620,
    screenTop: 20, screenLeft: 15,
    notch: true,
    platform: 'iOS',
    color: '#1C1C1E',
  },
  {
    id: 'ipad',
    label: 'iPad Pro',
    icon: FiTablet,
    frameW: 520, frameH: 700,
    screenW: 490, screenH: 660,
    screenTop: 20, screenLeft: 15,
    notch: false,
    platform: 'iPadOS',
    color: '#1C1C1E',
  },
  {
    id: 'pixel',
    label: 'Pixel 8',
    icon: FiSmartphone,
    frameW: 320, frameH: 660,
    screenW: 292, screenH: 626,
    screenTop: 17, screenLeft: 14,
    notch: false,
    platform: 'Android',
    color: '#121212',
  },
  {
    id: 'desktop',
    label: 'Desktop',
    icon: FiMonitor,
    frameW: 860, frameH: 540,
    screenW: 840, screenH: 510,
    screenTop: 15, screenLeft: 10,
    notch: false,
    platform: 'Web',
    color: '#1C1C1E',
  },
];

// ── Build checklist items ─────────────────────────────────────────────────────
const CHECKLIST = [
  { id: 'manifest',    label: 'PWA Manifest',          desc: 'manifest.json with all metadata',      check: true  },
  { id: 'icons',       label: 'App Icons',              desc: 'All sizes via npm run icons',           check: true  },
  { id: 'favicon',     label: 'Favicon SVG',            desc: 'favicon.svg + PNG fallbacks',           check: true  },
  { id: 'splash',      label: 'Splash Screens',         desc: 'iOS launch screens in manifest',        check: true  },
  { id: 'meta',        label: 'Apple Meta Tags',        desc: 'apple-mobile-web-app-capable etc.',     check: true  },
  { id: 'ogmeta',      label: 'Open Graph Tags',        desc: 'Social preview title/image/desc',       check: true  },
  { id: 'shortcuts',   label: 'App Shortcuts',          desc: 'Library, Bookshelves, Story Time',      check: true  },
  { id: 'build',       label: 'Production Build',       desc: `${BUILD_INFO.bundleSize} · ${BUILD_INFO.buildTime}`, check: true },
  { id: 'offline',     label: 'Service Worker',         desc: 'Add vite-plugin-pwa for offline mode',  check: false },
  { id: 'screenshots', label: 'Store Screenshots',      desc: 'Add real screenshots to /screenshots/', check: false },
  { id: 'privacy',     label: 'Privacy Policy URL',     desc: 'Required for App Store review',         check: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function QRCode({ url, size = 160 }) {
  const encoded = encodeURIComponent(url);
  const src     = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}x${size}&bgcolor=141414&color=D4AF37&qzone=2&format=png`;
  return (
    <div className="rounded-xl overflow-hidden border border-eof-gold/20 bg-[#141414] p-3 inline-block">
      <img src={src} alt="QR code" width={size} height={size} className="block rounded-lg" onError={e => e.target.style.opacity=0.3}/>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };
  return (
    <button onClick={copy} className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-eof-gold transition-colors" title="Copy">
      {copied ? <FiCheck size={13} className="text-emerald-400"/> : <FiCopy size={13}/>}
    </button>
  );
}

// ── Device frame ─────────────────────────────────────────────────────────────

function DeviceFrame({ device, previewUrl, rotate }) {
  const isMobile = device.id === 'iphone15' || device.id === 'pixel';
  const isIPad   = device.id === 'ipad';
  const isDesk   = device.id === 'desktop';

  const scale    = isDesk ? 0.85 : isMobile ? 1 : 0.75;
  const angle    = rotate && isMobile ? 'rotate-90' : '';

  return (
    <div className={`relative select-none ${angle}`} style={{ width: device.frameW * scale, height: device.frameH * scale }}>

      {/* Outer shell */}
      <div
        className="absolute inset-0 rounded-[36px] shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
        style={{ background: device.color, border: '2px solid rgba(255,255,255,0.08)' }}
      />

      {/* Side buttons */}
      {isMobile && (
        <>
          {/* Volume up */}
          <div className="absolute rounded-l-sm" style={{
            left: -3, top: device.frameH * scale * 0.27,
            width: 3, height: 28 * scale,
            background: 'rgba(255,255,255,0.12)'
          }}/>
          {/* Volume down */}
          <div className="absolute rounded-l-sm" style={{
            left: -3, top: device.frameH * scale * 0.37,
            width: 3, height: 28 * scale,
            background: 'rgba(255,255,255,0.12)'
          }}/>
          {/* Power */}
          <div className="absolute rounded-r-sm" style={{
            right: -3, top: device.frameH * scale * 0.32,
            width: 3, height: 46 * scale,
            background: 'rgba(255,255,255,0.12)'
          }}/>
        </>
      )}

      {/* Desktop stand */}
      {isDesk && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -28 * scale }}>
          <div className="mx-auto rounded-b-sm" style={{
            width: 80 * scale, height: 20 * scale,
            background: 'rgba(255,255,255,0.07)'
          }}/>
          <div className="mx-auto" style={{
            width: 140 * scale, height: 6 * scale,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '0 0 4px 4px'
          }}/>
        </div>
      )}

      {/* Screen area */}
      <div
        className="absolute overflow-hidden"
        style={{
          top:    device.screenTop   * scale,
          left:   device.screenLeft  * scale,
          width:  device.screenW     * scale,
          height: device.screenH     * scale,
          borderRadius: isDesk ? 4 : isMobile ? 28 * scale : 20 * scale,
          background: '#000',
        }}
      >
        {/* Status bar (mobile) */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4"
               style={{ height: 36 * scale, fontSize: 10 * scale, color: '#fff', background: 'rgba(0,0,0,0.6)' }}>
            <span style={{ fontWeight: 600 }}>9:41</span>
            <span style={{ fontSize: 8 * scale, letterSpacing: 1 }}>● ● ●</span>
          </div>
        )}

        {/* Notch / Dynamic Island (iPhone) */}
        {device.notch && (
          <div className="absolute z-20 rounded-full bg-black" style={{
            top: 8 * scale, left: '50%', transform: 'translateX(-50%)',
            width: 90 * scale, height: 26 * scale,
          }}/>
        )}

        {/* Desktop camera */}
        {isDesk && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center"
               style={{ height: 12 * scale, background: device.color }}>
            <div className="rounded-full bg-gray-600" style={{ width: 6*scale, height: 6*scale }}/>
          </div>
        )}

        {/* The app iframe */}
        <iframe
          src={previewUrl}
          title={`${device.label} preview`}
          className="border-0 bg-eof-dark"
          style={{
            width:  device.screenW * scale,
            height: device.screenH * scale,
            transform: `scale(${1/scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'auto',
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────

function Checklist() {
  const passed  = CHECKLIST.filter(i => i.check).length;
  const total   = CHECKLIST.length;
  const pct     = Math.round((passed / total) * 100);

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-white">App Store Readiness</h3>
        <span className={`badge ${pct === 100 ? 'badge-solid-gold' : 'badge-gold'}`}>{pct}%</span>
      </div>

      {/* Overall bar */}
      <div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-eof-gold to-eof-gold-light"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{passed} of {total} items complete</p>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {CHECKLIST.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
              item.check ? 'bg-white/3' : 'bg-eof-crimson/5 border border-eof-crimson/10'
            }`}
          >
            {item.check
              ? <FiCheckCircle className="flex-shrink-0 text-emerald-400 mt-0.5" size={15}/>
              : <FiAlertCircle className="flex-shrink-0 text-eof-crimson-light mt-0.5" size={15}/>
            }
            <div className="min-w-0">
              <p className={`text-sm font-medium ${item.check ? 'text-white' : 'text-gray-300'}`}>{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AppPreview() {
  const [activeDevice,  setActiveDevice]  = useState('iphone15');
  const [activeRoute,   setActiveRoute]   = useState('/library');
  const [rotate,        setRotate]        = useState(false);
  const [activeTab,     setActiveTab]     = useState('preview'); // preview | checklist | info

  const device  = DEVICES.find(d => d.id === activeDevice);
  const previewUrl = `${APP_URL}${activeRoute}`;

  const APP_ROUTES = [
    { path: '/',               label: 'Dashboard'      },
    { path: '/library',        label: 'Library'        },
    { path: '/bookshelves',    label: 'Bookshelves'    },
    { path: '/story-time',     label: 'Story Time'     },
    { path: '/membership',     label: 'Membership'     },
    { path: '/command-center', label: 'Command Center' },
    { path: '/thermal',        label: 'Thermal Monitor'},
  ];

  return (
    <div className="min-h-screen bg-eof-dark">

      {/* ── Top header bar ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-eof-dark/95 backdrop-blur border-b border-eof-dark-border px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap">

          {/* Title */}
          <div>
            <h1 className="font-serif text-xl text-white leading-none">Test Lab</h1>
            <p className="text-xs text-gray-500 mt-0.5">v{BUILD_INFO.version} · {BUILD_INFO.buildDate}</p>
          </div>

          <div className="w-px h-8 bg-eof-dark-border hidden md:block"/>

          {/* Device selector */}
          <div className="flex items-center gap-1 bg-white/4 rounded-xl p-1">
            {DEVICES.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDevice(d.id)}
                title={d.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeDevice === d.id
                    ? 'bg-eof-gold text-eof-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <d.icon size={13}/>
                <span className="hidden sm:inline">{d.label}</span>
              </button>
            ))}
          </div>

          {/* Route picker */}
          <select
            value={activeRoute}
            onChange={e => setActiveRoute(e.target.value)}
            className="appearance-none bg-white/4 border border-white/8 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-eof-gold/50 cursor-pointer"
          >
            {APP_ROUTES.map(r => (
              <option key={r.path} value={r.path}>{r.label}</option>
            ))}
          </select>

          {/* Tabs */}
          <div className="flex items-center gap-1 ml-auto bg-white/4 rounded-xl p-1">
            {[
              { id: 'preview',   label: 'Preview'   },
              { id: 'checklist', label: 'Checklist' },
              { id: 'info',      label: 'Install'   },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === t.id ? 'bg-eof-gold text-eof-dark' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab: Preview ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-8 p-6 pt-8"
          >
            {/* Device frame */}
            <div className="flex-1 flex flex-col items-center justify-start gap-6">
              <DeviceFrame device={device} previewUrl={previewUrl} rotate={rotate}/>

              {/* Frame controls */}
              <div className="flex items-center gap-3 mt-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <FiExternalLink size={12}/> Open in new tab
                </a>
                <a
                  href={`${APP_URL}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <FiZap size={12}/> Full screen
                </a>
              </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">

              {/* Build stats */}
              <div className="card">
                <h3 className="font-serif text-base text-white mb-4 flex items-center gap-2">
                  <FiPackage size={15} className="text-eof-gold"/> Build Info
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Version',     value: BUILD_INFO.version    },
                    { label: 'Build Date',  value: BUILD_INFO.buildDate  },
                    { label: 'Bundle',      value: BUILD_INFO.bundleSize },
                    { label: 'Modules',     value: BUILD_INFO.modules    },
                    { label: 'Build Time',  value: BUILD_INFO.buildTime  },
                    { label: 'Platform',    value: device.platform       },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick readiness */}
              <div className="card">
                <h3 className="font-serif text-base text-white mb-4 flex items-center gap-2">
                  <FiShield size={15} className="text-eof-gold"/> Quick Check
                </h3>
                <div className="space-y-2">
                  {CHECKLIST.slice(0, 6).map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      {item.check
                        ? <FiCheckCircle size={13} className="text-emerald-400 flex-shrink-0"/>
                        : <FiAlertCircle size={13} className="text-eof-crimson-light flex-shrink-0"/>}
                      <span className={item.check ? 'text-gray-300' : 'text-gray-500'}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className="mt-4 text-xs text-eof-gold hover:text-eof-gold-light transition-colors"
                >
                  View full checklist →
                </button>
              </div>

              {/* Network URL */}
              <div className="card">
                <h3 className="font-serif text-base text-white mb-3 flex items-center gap-2">
                  <FiWifi size={15} className="text-eof-gold"/> Test on Device
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Connect your phone to the same Wi-Fi and open:
                </p>
                <div className="bg-black/40 rounded-lg px-3 py-2 flex items-center gap-2 mb-3 border border-white/5">
                  <span className="flex-1 text-xs font-mono text-eof-gold truncate">{NETWORK_URL}</span>
                  <CopyButton text={NETWORK_URL}/>
                </div>
                <div className="flex justify-center">
                  <QRCode url={NETWORK_URL} size={120}/>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ── Tab: Checklist ─────────────────────────────────────────── */}
        {activeTab === 'checklist' && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto p-6 pt-8"
          >
            <Checklist/>
          </motion.div>
        )}

        {/* ── Tab: Install ──────────────────────────────────────────── */}
        {activeTab === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto p-6 pt-8 space-y-6"
          >

            {/* PWA install */}
            <div className="card">
              <h3 className="font-serif text-xl text-white mb-2 flex items-center gap-2">
                <FiDownload size={18} className="text-eof-gold"/> Install as App
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                EOF Library is a PWA — install directly to your home screen without the App Store.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* iOS */}
                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiSmartphone size={16} className="text-white"/>
                    </div>
                    <span className="font-semibold text-white">iOS / iPadOS</span>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">1.</span> Open in Safari</li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">2.</span> Tap the <span className="text-white">Share</span> button <FiShare2 size={11} className="inline mx-0.5"/></li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">3.</span> Tap <span className="text-white">"Add to Home Screen"</span></li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">4.</span> Tap <span className="text-white">Add</span> — done!</li>
                  </ol>
                </div>

                {/* Android */}
                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <FiSmartphone size={16} className="text-white"/>
                    </div>
                    <span className="font-semibold text-white">Android</span>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">1.</span> Open in Chrome</li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">2.</span> Tap the <span className="text-white">⋮ menu</span></li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">3.</span> Tap <span className="text-white">"Add to Home Screen"</span></li>
                    <li className="flex gap-2"><span className="text-eof-gold font-bold">4.</span> Confirm install — done!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="card">
              <h3 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
                <FiZap size={18} className="text-eof-gold"/> Next Steps to App Store
              </h3>
              <div className="space-y-3">
                {[
                  { step: '01', title: 'Generate icons',      desc: 'Run `npm run icons` to produce all 30+ PNG sizes', done: false },
                  { step: '02', title: 'Add screenshots',     desc: 'Add 1170×2532 PNGs to /public/screenshots/', done: false },
                  { step: '03', title: 'Service worker',      desc: 'Run `npm i -D vite-plugin-pwa` for offline support', done: false },
                  { step: '04', title: 'Wrap with Capacitor', desc: 'npm i @capacitor/core @capacitor/cli && npx cap init', done: false },
                  { step: '05', title: 'Build iOS/Android',   desc: 'npx cap add ios && npx cap run ios', done: false },
                  { step: '06', title: 'TestFlight upload',   desc: 'Archive in Xcode → upload to App Store Connect', done: false },
                ].map(({ step, title, desc, done }) => (
                  <div key={step} className="flex items-start gap-4 p-3 rounded-xl bg-white/3 border border-white/5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-eof-gold/10 border border-eof-gold/20 flex items-center justify-center text-eof-gold text-xs font-bold">
                      {step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-mono">{desc}</p>
                    </div>
                    {done && <FiCheckCircle className="flex-shrink-0 text-emerald-400 mt-1" size={15}/>}
                  </div>
                ))}
              </div>
            </div>

            {/* QR section */}
            <div className="card text-center">
              <h3 className="font-serif text-xl text-white mb-2">Scan to Test on Your Phone</h3>
              <p className="text-sm text-gray-500 mb-6">Make sure your phone is on the same Wi-Fi network</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <QRCode url={NETWORK_URL} size={180}/>
                  <p className="text-xs text-gray-500 mt-2">Local network</p>
                  <p className="text-xs text-eof-gold font-mono mt-0.5">{NETWORK_URL}</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

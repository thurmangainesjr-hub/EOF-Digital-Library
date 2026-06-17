/**
 * DIY University — Cinematic Knowledge Intro (33 seconds)
 * Darkness → Matrix-of-Knowledge field → Words of Knowledge →
 * Book Showcase → Globe Network → Convergence → Logo → Tagline
 */
import { useState, useEffect, useRef, useCallback } from 'react';

/* ── Persistence (per-window) ────────────────────────────────────────────── */
const KEY      = 'diy-intro-seen';
const hasSeen  = () => typeof window !== 'undefined' && sessionStorage.getItem(KEY) === '1';
const markSeen = () => { if (typeof window !== 'undefined') sessionStorage.setItem(KEY, '1'); };

/* ── Knowledge Symbol Pool ───────────────────────────────────────────────── */
const SYMBOLS = [
  // Mathematics
  'π','Σ','∫','∂','√','∞','≈','∇','Δ','∈','∅','⊕','∮','∏','∑',
  // Greek / Physics
  'Ω','μ','α','β','γ','δ','ε','η','ν','ξ','ρ','σ','τ','χ','θ','λ','φ','ψ',
  // Formulas
  'E=','mc²','F=ma','∑F','∂φ','∇·E','pH','V=IR','dS/dt','∂²',
  // Code symbols
  '</>','{}','()','fn','⇒','::','&&','||','!=','++','--','>>',
  // Chinese
  '知','学','识','创','造','建','领','导','启','发','思','想','明','智',
  // Japanese
  'あ','い','う','え','お','学','知','識','夢','想',
  // Arabic
  'ع','ر','ب','ي','ة','م','ل','ن','ق','ف',
  // Cyrillic
  'Д','Ж','З','И','К','Л','М','Н','П','Р','С','Т',
  // Astronomy
  '☀','☽','★','✦','⊙','♃','♄','♈','♉','☿','♀',
  // Music
  '♩','♪','♫','♬','𝄞',
  // Numbers & formulas
  '1','2','3','5','7','8','9','0','e','i','∞²',
  // Biology / Chemistry
  'DNA','RNA','ATP','CO₂','H₂O','O₂','pH7','ΔG',
  // Misc educational
  '§','°','′','″','‡','¶','℃','℉','∴','∵','⊥','∥',
];

/* ── Wisdom words that flash during storm ────────────────────────────────── */
const WISDOM = ['LEARN', 'BUILD', 'CREATE', 'DISCOVER', 'INNOVATE', 'INSPIRE', 'MASTER', 'LEAD'];

/* ── Globe city data ─────────────────────────────────────────────────────── */
const CITIES = [
  { lon:-87.6,  lat:41.8,  r:'NA' }, { lon:-74.0, lat:40.7, r:'NA' },
  { lon:-118.2, lat:34.0,  r:'NA' }, { lon:-79.4, lat:43.7,  r:'NA' },
  { lon:-46.6,  lat:-23.5, r:'SA' }, { lon:-43.2, lat:-22.9, r:'SA' },
  { lon:-58.4,  lat:-34.6, r:'SA' }, { lon:-77.0, lat:-12.0, r:'SA' },
  { lon:-0.1,   lat:51.5,  r:'EU' }, { lon:2.3,   lat:48.9,  r:'EU' },
  { lon:13.4,   lat:52.5,  r:'EU' }, { lon:12.5,  lat:41.9,  r:'EU' },
  { lon:3.4,    lat:6.5,   r:'AF' }, { lon:36.8,  lat:-1.3,  r:'AF' },
  { lon:18.4,   lat:-33.9, r:'AF' }, { lon:31.2,  lat:30.1,  r:'AF' },
  { lon:77.2,   lat:28.6,  r:'AS' }, { lon:121.5, lat:31.2,  r:'AS' },
  { lon:139.7,  lat:35.7,  r:'AS' }, { lon:103.8, lat:1.3,   r:'AS' },
  { lon:55.3,   lat:25.2,  r:'AS' },
  { lon:151.2,  lat:-33.9, r:'AU' }, { lon:144.9, lat:-37.8, r:'AU' },
];
const CONNS = [
  [0,8],[1,9],[2,10],[4,12],[5,15],[8,16],[9,17],
  [12,16],[13,17],[17,21],[18,22],[0,4],[1,5],[19,21],
];
const REGION_ORDER = ['NA','SA','EU','AF','AS','AU'];
const REGION_COLOR = {
  NA:'#3b82f6', SA:'#22d3ee', EU:'#a78bfa',
  AF:'#34d399',  AS:'#fbbf24', AU:'#f472b6',
};

/* ── Audio ───────────────────────────────────────────────────────────────── */
function playAudio(ac) {
  const END = 35;
  const master = ac.createGain();
  master.gain.setValueAtTime(0, ac.currentTime);
  master.gain.linearRampToValueAtTime(0.1, ac.currentTime + 3);
  master.gain.setValueAtTime(0.1, ac.currentTime + 28);
  master.gain.linearRampToValueAtTime(0, ac.currentTime + END);
  master.connect(ac.destination);

  const osc = (type, freq, start, stop, g0 = 0.3) => {
    const o = ac.createOscillator(); const g = ac.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(g0, ac.currentTime + start);
    o.connect(g); g.connect(master);
    o.start(ac.currentTime + start);
    o.stop(ac.currentTime + stop);
    return { o, g };
  };

  // Deep atmospheric foundation — full duration
  const { o: pad } = osc('sine', 55, 0, END, 0.4);
  pad.frequency.linearRampToValueAtTime(82, ac.currentTime + 8);
  pad.frequency.linearRampToValueAtTime(110, ac.currentTime + 18);
  pad.frequency.linearRampToValueAtTime(164, ac.currentTime + 28);

  // Sub-bass pulse for storm section
  const { g: subG } = osc('sine', 40, 2, 9, 0);
  subG.gain.linearRampToValueAtTime(0.3, ac.currentTime + 3.5);
  subG.gain.setValueAtTime(0.3, ac.currentTime + 7);
  subG.gain.linearRampToValueAtTime(0, ac.currentTime + 9);

  // Mystery string swell (enters with book)
  const { g: strG } = osc('triangle', 196, 8, END, 0);
  strG.gain.linearRampToValueAtTime(0.12, ac.currentTime + 12);
  strG.gain.setValueAtTime(0.12, ac.currentTime + 20);
  strG.gain.linearRampToValueAtTime(0.28, ac.currentTime + 26);
  strG.gain.linearRampToValueAtTime(0, ac.currentTime + END);

  // Orchestral swell (globe phase)
  const { g: swG } = osc('triangle', 330, 19, END, 0);
  swG.gain.linearRampToValueAtTime(0.18, ac.currentTime + 23);
  swG.gain.setValueAtTime(0.18, ac.currentTime + 25);
  swG.gain.linearRampToValueAtTime(0.32, ac.currentTime + 27);
  swG.gain.linearRampToValueAtTime(0, ac.currentTime + END);

  // Bell tones — one per region activation
  const bells = [523.25, 659.25, 783.99, 880, 1046.5, 1174.66];
  REGION_ORDER.forEach((_, i) => {
    const t = 20 + i * 0.88;
    const { g: bg } = osc('sine', bells[i], t, t + 3, 0.1);
    bg.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 2.8);
  });

  // Logo crescendo
  const { o: rv } = osc('sine', 880, 28, END, 0);
  rv.frequency.linearRampToValueAtTime(1320, ac.currentTime + 31);
  const rvG = ac.createGain();
  rvG.gain.setValueAtTime(0, ac.currentTime + 28);
  rvG.gain.linearRampToValueAtTime(0.18, ac.currentTime + 29.5);
  rvG.gain.linearRampToValueAtTime(0, ac.currentTime + END);
  rv.disconnect(); rv.connect(rvG); rvG.connect(master);
}

/* ── Main Canvas — Knowledge Field + Globe ───────────────────────────────── */
function MainCanvas({ phaseRef, activeRef, phaseStartRef, startTimeRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Particle creation ── */
    const N = 360;
    const particles = Array.from({ length: N }, (_, i) => {
      const isStreak = i < 28;
      const isPulse  = !isStreak && i < 70;
      return {
        x:        Math.random() * window.innerWidth,
        y:        Math.random() * window.innerHeight,
        z:        Math.random() * 2 - 1,           // -1=far → 1=near
        vx:       (Math.random() - 0.5) * (isStreak ? 2.4 : 0.28),
        vy:       (Math.random() - 0.5) * (isStreak ? 1.2 : 0.22) - 0.06,
        vz:       (Math.random() - 0.5) * 0.006,
        symbol:   SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size:     Math.random() * 9 + 5,           // 5–14px base
        hue:      208 + Math.random() * 35,        // 208–243 blue-to-indigo
        alpha:    Math.random() * 0.38 + 0.08,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        pulseT:   Math.random() * Math.PI * 2,
        type:     isStreak ? 'streak' : isPulse ? 'pulse' : 'drift',
        trail:    [],
        birthMs:  Math.random() * 4800,            // stagger birth over 4.8 s
      };
    });

    let globeRot = -35;
    let t        = 0;
    let raf      = 0;

    /* ── Ortho globe projection ── */
    function proj(lon, lat, rot, cx, cy, R) {
      const φ = lat * Math.PI / 180;
      const λ = (lon - rot) * Math.PI / 180;
      return {
        x: cx + R * Math.cos(φ) * Math.sin(λ),
        y: cy - R * Math.sin(φ),
        vis: Math.cos(φ) * Math.cos(λ) > 0,
      };
    }

    /* ── Globe draw ── */
    function drawGlobe(cx, cy, R, rot, activeRegions, alpha, bgOnly = false) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Sphere background
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      const g = ctx.createRadialGradient(cx - R * .25, cy - R * .25, R * .04, cx, cy, R);
      g.addColorStop(0, '#1a4fc4');
      g.addColorStop(0.45, '#0d2370');
      g.addColorStop(1, '#020820');
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const φ = lat * Math.PI / 180;
        ctx.beginPath();
        ctx.ellipse(cx, cy - R * Math.sin(φ), R * Math.cos(φ), R * Math.cos(φ) * 0.1, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(96,165,250,0.18)'; ctx.lineWidth = 0.6; ctx.stroke();
      }
      ctx.restore();

      // Longitude lines
      for (let lon = 0; lon < 180; lon += 30) {
        const ang = ((lon - rot) % 360) * Math.PI / 180;
        const sx  = Math.abs(Math.cos(ang));
        if (sx < 0.03) continue;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * sx, R, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(96,165,250,0.14)'; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      }

      // Outer glow
      const og = ctx.createRadialGradient(cx, cy, R * .88, cx, cy, R * 1.22);
      og.addColorStop(0, 'rgba(37,99,235,0.22)');
      og.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
      ctx.fillStyle = og; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96,165,250,0.45)'; ctx.lineWidth = 1.2; ctx.stroke();

      if (!bgOnly) {
        const pts = CITIES.map(c => ({ ...proj(c.lon, c.lat, rot, cx, cy, R), region: c.r }));

        // Connection arcs
        CONNS.forEach(([a, b], idx) => {
          if (!pts[a]?.vis || !pts[b]?.vis) return;
          if (!activeRegions.includes(CITIES[a]?.r) || !activeRegions.includes(CITIES[b]?.r)) return;
          const p1 = pts[a], p2 = pts[b];
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2 - Math.abs(p1.x - p2.x) * 0.07 - R * 0.04;
          const pulse = (Math.sin(t * 1.8 + idx) + 1) / 2;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
          ctx.strokeStyle = `rgba(96,165,250,${0.1 + pulse * 0.22})`;
          ctx.lineWidth = 0.6 + pulse * 0.5; ctx.stroke();
          // Traveling dot
          const tp = ((t * .35 + idx * .13) % 1);
          const tx2 = (1 - tp) ** 2 * p1.x + 2 * (1 - tp) * tp * mx + tp ** 2 * p2.x;
          const ty2 = (1 - tp) ** 2 * p1.y + 2 * (1 - tp) * tp * my + tp ** 2 * p2.y;
          ctx.beginPath(); ctx.arc(tx2, ty2, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147,197,253,${0.6 + pulse * 0.4})`; ctx.fill();
        });

        // City dots
        pts.forEach((p, i) => {
          if (!p.vis || i >= CITIES.length) return;
          const active = activeRegions.includes(CITIES[i].r);
          const col = REGION_COLOR[CITIES[i].r] || '#60A5FA';
          const pulse = Math.sin(t * 3 + i * .7) * .3 + .7;
          if (active) {
            ctx.beginPath(); ctx.arc(p.x, p.y, 5.5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = col + '28'; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = col; ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(96,165,250,0.3)'; ctx.fill();
          }
        });
      }
      ctx.restore();
    }

    /* ── Knowledge particle draw ── */
    function drawParticles(W, H, fieldAlpha, stormI, nowMs) {
      particles.forEach(p => {
        const sinceStart = nowMs - p.birthMs;
        if (sinceStart < 0) return;

        const depth      = (p.z + 1) / 2;                             // 0=far, 1=near
        const activeA    = Math.min(1, sinceStart / 1100);             // 1.1 s fade in
        const finalAlpha = p.alpha * (0.12 + depth * 0.88) * fieldAlpha * activeA;
        if (finalAlpha < 0.012) return;

        const speed = 1 + stormI * 3.8 + (p.type === 'streak' ? 1.4 : 0);
        p.x  += p.vx * speed;
        p.y  += p.vy * speed;
        p.z  += p.vz;
        p.z   = Math.max(-1, Math.min(1, p.z));
        p.rotation += p.rotSpeed * (1 + stormI * 1.5);
        p.pulseT   += 0.022 + stormI * 0.04;

        // Wrap edges
        if (p.x < -70) p.x = W + 70;
        if (p.x > W + 70) p.x = -70;
        if (p.y < -70) p.y = H + 70;
        if (p.y > H + 70) p.y = -70;

        const size   = Math.max(4, p.size * (0.14 + depth * 0.86));
        const bright = 42 + depth * 38 + Math.sin(p.pulseT) * 10;
        const pAlpha = p.type === 'pulse'
          ? finalAlpha * (0.45 + Math.sin(p.pulseT) * 0.55)
          : finalAlpha;

        ctx.save();

        // Trail for streak particles
        if (p.type === 'streak') {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 12) p.trail.shift();
          for (let j = 1; j < p.trail.length; j++) {
            const ta = (j / p.trail.length) * finalAlpha * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
            ctx.strokeStyle = `hsla(${p.hue}, 100%, 68%, ${ta})`;
            ctx.lineWidth   = size * 0.18;
            ctx.stroke();
          }
        }

        // Glow for near particles
        if (depth > 0.58) {
          ctx.shadowColor = `hsla(${p.hue}, 100%, 72%, 0.9)`;
          ctx.shadowBlur  = size * (1.6 + stormI * 1.2);
        }

        ctx.globalAlpha = pAlpha;
        ctx.font        = `${size}px "Courier New", monospace`;
        ctx.fillStyle   = `hsl(${p.hue}, 82%, ${bright}%)`;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });
    }

    /* ── Main draw loop ── */
    function draw() {
      const phase  = phaseRef.current;
      const active = activeRef.current;
      const pStart = phaseStartRef.current;
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R  = Math.min(W, H) * 0.27;
      const subT  = pStart > 0 ? (Date.now() - pStart) / 1000 : 0;
      const nowMs = startTimeRef.current > 0 ? Date.now() - startTimeRef.current : 0;

      t        += 0.015;
      globeRot -= 0.1;

      ctx.clearRect(0, 0, W, H);

      /* ── Knowledge particle field ── */
      if (phase <= 2) {
        // fieldAlpha: 0→1 over first 2s of phase 1, then fades in phase 2
        const fieldAlpha = phase === 0 ? 0
          : phase === 1 ? Math.min(1, (nowMs - 800) / 2200)
          : Math.max(0, 1 - subT * 0.55);

        // Storm intensity: ramps during phase 1 t=1.5→5s, peaks at ~3, falls
        const stormT     = Math.max(0, (nowMs - 2200) / 1000); // 0 at 2.2s
        const stormI     = Math.max(0, Math.sin(Math.min(stormT * 0.8, Math.PI)) * 0.85);

        if (fieldAlpha > 0.01) drawParticles(W, H, fieldAlpha, stormI, nowMs);

        // Ambient blue haze during storm
        if (stormI > 0.15) {
          const haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
          haze.addColorStop(0, `rgba(29,78,216,${stormI * 0.12})`);
          haze.addColorStop(1, 'transparent');
          ctx.fillStyle = haze;
          ctx.fillRect(0, 0, W, H);
        }
      }

      /* ── Globe phase ── */
      if (phase === 3) drawGlobe(cx, cy, R, globeRot, active, Math.min(1, subT * 0.5));
      if (phase === 4) drawGlobe(cx, cy, R, globeRot, active, 1);

      /* ── Convergence ── */
      if (phase === 5) {
        const shrink = Math.max(0.1, 1 - subT * 0.22);
        const alpha  = Math.max(0, 1 - subT * 0.45);
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(shrink, shrink); ctx.translate(-cx, -cy);
        drawGlobe(cx, cy, R, globeRot, REGION_ORDER, alpha);
        ctx.restore();
        const sp = Math.min(1, subT * 0.35);
        for (let i = 0; i < 16; i++) {
          const ang  = (i / 16) * Math.PI * 2;
          const dist = Math.max(15, 220 * (1 - sp) + 20);
          const pulse = (Math.sin(t * 5 + i * 0.4) + 1) / 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist);
          ctx.lineTo(cx, cy);
          ctx.strokeStyle = `rgba(96,165,250,${(0.25 + pulse * 0.45) * sp})`;
          ctx.lineWidth   = 0.7 + pulse; ctx.stroke();
        }
        const flash = Math.max(0, Math.sin((subT - 2.5) * 2.5) * 0.7);
        if (flash > 0) {
          const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130);
          fg.addColorStop(0, `rgba(255,255,255,${flash * 0.85})`);
          fg.addColorStop(0.4, `rgba(96,165,250,${flash * 0.3})`);
          fg.addColorStop(1, 'transparent');
          ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
        }
      }

      /* ── Silhouette + rising particles ── */
      if (phase >= 6) {
        ctx.save(); ctx.globalAlpha = 0.1;
        drawGlobe(cx, cy, R * 1.08, globeRot, REGION_ORDER, 1, true);
        ctx.restore();
        const speed = 18;
        particles.slice(0, 60).forEach(p => {
          const ry = ((p.y - t * speed) % H + H) % H;
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(t * 0.6 + p.alpha * 8) * 1.5, ry, p.size * 0.25 * ((p.z + 1) / 2 + 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96,165,250,${p.alpha * 0.28})`; ctx.fill();
        });
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
    }}/>
  );
}

/* ── Book Cover SVG ──────────────────────────────────────────────────────── */
function CoverSVG() {
  const laurelDots = Array.from({ length: 30 }, (_, i) => {
    const ang = (i / 30) * Math.PI * 2 - Math.PI / 2;
    return { cx: 110 + Math.cos(ang) * 46, cy: 90 + Math.sin(ang) * 46 };
  });
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const ang = (i / 48) * Math.PI * 2;
    const r1  = 46, r2 = i % 4 === 0 ? 40 : 43;
    return {
      x1: 110 + Math.cos(ang) * r1, y1: 90 + Math.sin(ang) * r1,
      x2: 110 + Math.cos(ang) * r2, y2: 90 + Math.sin(ang) * r2,
    };
  });

  return (
    <svg viewBox="0 0 220 300" width="220" height="300" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cvBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#0b1a6a"/>
          <stop offset="40%" stopColor="#1a3a8a"/>
          <stop offset="100%" stopColor="#1e42b0"/>
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#7a5606"/>
          <stop offset="22%"  stopColor="#c8941a"/>
          <stop offset="50%"  stopColor="#f0cc4a"/>
          <stop offset="78%"  stopColor="#c8941a"/>
          <stop offset="100%" stopColor="#7a5606"/>
        </linearGradient>
        <linearGradient id="goldV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#7a5606"/>
          <stop offset="30%"  stopColor="#c8941a"/>
          <stop offset="50%"  stopColor="#f0cc4a"/>
          <stop offset="70%"  stopColor="#c8941a"/>
          <stop offset="100%" stopColor="#7a5606"/>
        </linearGradient>
        <radialGradient id="cvSheen" cx="35%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="rgba(147,197,253,0.12)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id="sfGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="220" height="300" fill="url(#cvBg)"/>
      <pattern id="diam" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M7,0 L14,7 L7,14 L0,7 Z" fill="none" stroke="rgba(255,255,255,0.022)" strokeWidth="0.5"/>
      </pattern>
      <rect width="220" height="300" fill="url(#diam)"/>
      <rect width="220" height="300" fill="url(#cvSheen)"/>

      <rect x="7"  y="7"  width="206" height="286" rx="2" fill="none" stroke="url(#gold)"            strokeWidth="2.2"/>
      <rect x="15" y="15" width="190" height="270" rx="1" fill="none" stroke="rgba(200,148,26,0.45)" strokeWidth="0.8"/>
      <rect x="20" y="20" width="180" height="260" rx="1" fill="none" stroke="rgba(200,148,26,0.2)"  strokeWidth="0.4"/>

      <path d="M7,7 L38,7 M7,7 L7,38"     stroke="url(#gold)" strokeWidth="4" strokeLinecap="square"/>
      <path d="M213,7 L182,7 M213,7 L213,38"   stroke="url(#gold)" strokeWidth="4" strokeLinecap="square"/>
      <path d="M7,293 L38,293 M7,293 L7,262"   stroke="url(#gold)" strokeWidth="4" strokeLinecap="square"/>
      <path d="M213,293 L182,293 M213,293 L213,262" stroke="url(#gold)" strokeWidth="4" strokeLinecap="square"/>
      <circle cx="7"   cy="7"   r="3" fill="#f0cc4a"/>
      <circle cx="213" cy="7"   r="3" fill="#f0cc4a"/>
      <circle cx="7"   cy="293" r="3" fill="#f0cc4a"/>
      <circle cx="213" cy="293" r="3" fill="#f0cc4a"/>

      {ticks.map((tk, i) => (
        <line key={i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
          stroke="#c8941a" strokeWidth={i % 4 === 0 ? 1.2 : 0.6} opacity={i % 4 === 0 ? 0.8 : 0.45}/>
      ))}
      {laurelDots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="1.6" fill="#c8941a" opacity="0.7"/>
      ))}

      <circle cx="110" cy="90" r="40" fill="rgba(255,255,255,0.03)" stroke="rgba(200,148,26,0.55)" strokeWidth="1.2"/>
      <circle cx="110" cy="90" r="34" fill="rgba(255,255,255,0.02)" stroke="rgba(200,148,26,0.35)" strokeWidth="0.6"/>
      <circle cx="110" cy="90" r="22" fill="none" stroke="rgba(200,148,26,0.6)"  strokeWidth="1.1"/>
      <ellipse cx="110" cy="90" rx="9"  ry="22" fill="none" stroke="rgba(200,148,26,0.55)" strokeWidth="0.8"/>
      <ellipse cx="110" cy="90" rx="16" ry="22" fill="none" stroke="rgba(200,148,26,0.35)" strokeWidth="0.5"/>
      <line x1="88" y1="90" x2="132" y2="90" stroke="rgba(200,148,26,0.6)"  strokeWidth="0.9"/>
      <line x1="91" y1="79" x2="129" y2="79" stroke="rgba(200,148,26,0.4)"  strokeWidth="0.6"/>
      <line x1="91" y1="101" x2="129" y2="101" stroke="rgba(200,148,26,0.4)" strokeWidth="0.6"/>

      <path id="arcT" d="M 68,90 A 42,42 0 0 1 152,90"/>
      <text fontSize="5.8" fill="#c8941a" opacity="0.85" letterSpacing="1.8">
        <textPath href="#arcT" startOffset="50%" textAnchor="middle">ESTABLISHED · MMXXIV</textPath>
      </text>
      <path id="arcB" d="M 68,90 A 42,42 0 0 0 152,90"/>
      <text fontSize="5.8" fill="#c8941a" opacity="0.85" letterSpacing="1.8">
        <textPath href="#arcB" startOffset="50%" textAnchor="middle">GLOBAL KNOWLEDGE</textPath>
      </text>

      <text x="25"  y="94" fontSize="10" fill="#c8941a" opacity="0.65" textAnchor="middle">✦</text>
      <text x="195" y="94" fontSize="10" fill="#c8941a" opacity="0.65" textAnchor="middle">✦</text>

      <line x1="28" y1="148" x2="192" y2="148" stroke="url(#gold)"              strokeWidth="1.2"/>
      <line x1="28" y1="152" x2="192" y2="152" stroke="rgba(200,148,26,0.3)"    strokeWidth="0.4"/>
      <path d="M107,150 L110,147 L113,150 L110,153 Z" fill="#c8941a" opacity="0.9"/>

      <text x="111" y="198" textAnchor="middle" fontSize="52" fontWeight="900"
        fontFamily="Georgia,'Times New Roman',serif" fill="#c8941a" opacity="0.28" letterSpacing="10">DIY</text>
      <text x="110" y="197" textAnchor="middle" fontSize="52" fontWeight="900"
        fontFamily="Georgia,'Times New Roman',serif" fill="white" opacity="0.98" letterSpacing="10"
        filter="url(#sfGlow)">DIY</text>

      <line x1="52" y1="210" x2="168" y2="210" stroke="url(#gold)" strokeWidth="0.9"/>
      <circle cx="110" cy="210" r="2.2" fill="#f0cc4a"/>

      <text x="110" y="228" textAnchor="middle" fontSize="12.5"
        fontFamily="Georgia,'Times New Roman',serif" fontWeight="400"
        fill="rgba(255,255,255,0.9)" letterSpacing="5">UNIVERSITY</text>
      <text x="110" y="243" textAnchor="middle" fontSize="6.5"
        fontFamily="Georgia,serif" fill="#c8941a" letterSpacing="2.5" opacity="0.72">
        BY EOF ECOSYSTEM
      </text>

      <line x1="28" y1="253" x2="192" y2="253" stroke="rgba(200,148,26,0.35)" strokeWidth="0.4"/>
      <line x1="28" y1="257" x2="192" y2="257" stroke="url(#gold)"            strokeWidth="1.2"/>

      <rect x="22" y="264" width="176" height="22" rx="1.5"
        fill="rgba(0,0,0,0.18)" stroke="rgba(200,148,26,0.6)" strokeWidth="0.9"/>
      <rect x="26" y="267" width="168" height="16" rx="1"
        fill="none" stroke="rgba(200,148,26,0.25)" strokeWidth="0.5"/>
      <text x="110" y="279" textAnchor="middle" fontSize="7.5"
        fontFamily="Georgia,serif" fill="#f0cc4a" letterSpacing="2.8" opacity="0.92">
        LEARN · BUILD · MASTER
      </text>
      <text x="110" y="296" textAnchor="middle" fontSize="8" fill="#c8941a" opacity="0.55"
        letterSpacing="4">· ✦ ·</text>
    </svg>
  );
}

/* ── Spine SVG ───────────────────────────────────────────────────────────── */
function SpineSVG() {
  return (
    <svg viewBox="0 0 36 300" width="36" height="300" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="spineBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#060e38"/>
          <stop offset="60%" stopColor="#0d1f6e"/>
          <stop offset="100%" stopColor="#162680"/>
        </linearGradient>
      </defs>
      <rect width="36" height="300" fill="url(#spineBg)"/>
      <line x1="1" y1="0" x2="1" y2="300" stroke="#7a5606" strokeWidth="1"/>
      <line x1="4" y1="8"   x2="32" y2="8"   stroke="#c8941a" strokeWidth="1.2"/>
      <line x1="4" y1="12"  x2="32" y2="12"  stroke="rgba(200,148,26,0.35)" strokeWidth="0.5"/>
      <line x1="4" y1="292" x2="32" y2="292" stroke="#c8941a" strokeWidth="1.2"/>
      <line x1="4" y1="288" x2="32" y2="288" stroke="rgba(200,148,26,0.35)" strokeWidth="0.5"/>
      <circle cx="4"  cy="8"   r="1.5" fill="#f0cc4a"/>
      <circle cx="32" cy="8"   r="1.5" fill="#f0cc4a"/>
      <circle cx="4"  cy="292" r="1.5" fill="#f0cc4a"/>
      <circle cx="32" cy="292" r="1.5" fill="#f0cc4a"/>
      <path d="M16,22 L18,19 L20,22 L18,25 Z" fill="#c8941a" opacity="0.7"/>
      <text transform="translate(18,280) rotate(-90)"
        fontSize="9" fontFamily="Georgia,serif" fill="#c8941a" opacity="0.85"
        letterSpacing="3" textAnchor="start">DIY UNIVERSITY</text>
      <path d="M16,148 L18,145 L20,148 L18,151 Z" fill="#c8941a" opacity="0.55"/>
      <path d="M16,276 L18,273 L20,276 L18,279 Z" fill="#c8941a" opacity="0.7"/>
    </svg>
  );
}

/* ── Page Stack SVG ──────────────────────────────────────────────────────── */
function PagesSVG() {
  const lines = Array.from({ length: 58 }, (_, i) => i);
  return (
    <svg viewBox="0 0 30 300" width="30" height="300" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="pagesBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#d8d2b8"/>
          <stop offset="30%"  stopColor="#ece8d6"/>
          <stop offset="100%" stopColor="#f5f2e8"/>
        </linearGradient>
        <linearGradient id="pageShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.22)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
      </defs>
      <rect width="30" height="300" fill="url(#pagesBg)"/>
      {lines.map(i => (
        <line key={i} x1="0" y1={i * 5.2 + 1} x2="30" y2={i * 5.2 + 1}
          stroke="rgba(120,90,50,0.16)" strokeWidth="0.5"/>
      ))}
      <line x1="0" y1="0"   x2="30" y2="0"   stroke="#c8941a" strokeWidth="0.8" opacity="0.5"/>
      <line x1="0" y1="299" x2="30" y2="299" stroke="#c8941a" strokeWidth="0.8" opacity="0.5"/>
      <rect x="0" y="0" width="6" height="300" fill="url(#pageShadow)"/>
    </svg>
  );
}

/* ── World Map SVG ───────────────────────────────────────────────────────── */
function WorldMap() {
  return (
    <svg viewBox="0 0 440 220" width="440" height="220" style={{ display: 'block' }}>
      {[35,70,105,140,175].map(y => (
        <line key={y} x1="0" y1={y} x2="440" y2={y} stroke="rgba(96,165,250,0.12)" strokeWidth="0.7"/>))}
      {[60,120,180,240,300,360,420].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(96,165,250,0.08)" strokeWidth="0.7"/>))}
      <line x1="0" y1="110" x2="440" y2="110" stroke="rgba(96,165,250,0.28)" strokeWidth="1"/>
      <polygon points="22,18 90,12 105,32 98,68 76,90 52,102 30,82 18,56"
        fill="rgba(59,130,246,0.22)" stroke={REGION_COLOR.NA} strokeWidth="1.4" strokeOpacity="0.75"/>
      <polygon points="74,115 104,108 120,132 114,175 97,198 73,182 60,150 63,120"
        fill="rgba(34,211,238,0.18)" stroke={REGION_COLOR.SA} strokeWidth="1.4" strokeOpacity="0.75"/>
      <polygon points="185,18 222,14 232,34 224,52 208,58 190,50 178,34"
        fill="rgba(167,139,250,0.22)" stroke={REGION_COLOR.EU} strokeWidth="1.4" strokeOpacity="0.75"/>
      <polygon points="184,70 228,63 244,92 238,145 220,184 196,188 174,162 170,120 176,82"
        fill="rgba(52,211,153,0.18)" stroke={REGION_COLOR.AF} strokeWidth="1.4" strokeOpacity="0.75"/>
      <polygon points="248,12 376,8 392,30 384,68 352,84 298,90 260,78 244,53"
        fill="rgba(251,191,36,0.18)" stroke={REGION_COLOR.AS} strokeWidth="1.4" strokeOpacity="0.75"/>
      <polygon points="324,132 384,126 398,152 380,178 338,182 314,162 316,140"
        fill="rgba(244,114,182,0.18)" stroke={REGION_COLOR.AU} strokeWidth="1.4" strokeOpacity="0.75"/>
      {[['M66,50 Q132,22 198,37','4,3'],['M214,42 Q278,24 308,47','4,3'],
        ['M202,98 Q230,58 265,62','4,3'],['M89,68 Q87,110 88,118','4,3'],
        ['M344,57 Q358,105 358,134','4,3']].map(([d, da], i) => (
        <path key={i} d={d} fill="none" stroke="rgba(96,165,250,0.38)" strokeWidth="0.9" strokeDasharray={da}/>
      ))}
      {[[63,48,'NA'],[194,34,'EU'],[302,50,'AS'],[202,94,'AF'],[88,122,'SA'],[354,146,'AU'],
        [96,30,'NA'],[214,38,'EU'],[340,44,'AS'],[218,80,'AF'],[98,132,'SA'],[366,144,'AU'],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={REGION_COLOR[r]} opacity="0.88">
          <animate attributeName="r"       values="3;5;3"         dur={`${1.4 + i * 0.18}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.88;1;0.88"  dur={`${1.4 + i * 0.18}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ── Main Splash Component ───────────────────────────────────────────────── */
export default function DIYUniversitySplash({ onDone }) {
  const [phase,       setPhase]       = useState(0);
  const [showLine,    setShowLine]    = useState(false);
  const [lineReady,   setLineReady]   = useState(false);
  const [showBook,    setShowBook]    = useState(false);
  const [bookOpen,    setBookOpen]    = useState(false);
  const [showMap,     setShowMap]     = useState(false);
  const [activeR,     setActiveR]     = useState([]);
  const [showLogo,    setShowLogo]    = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [tagStep,     setTagStep]     = useState(0);
  const [fadeOut,     setFadeOut]     = useState(false);
  const [wordIdx,     setWordIdx]     = useState(-1);

  const phaseRef      = useRef(0);
  const activeRef     = useRef([]);
  const phaseStartRef = useRef(0);
  const startTimeRef  = useRef(0);
  const audioRef      = useRef(null);

  const go = useCallback((p) => {
    setPhase(p);
    phaseRef.current      = p;
    phaseStartRef.current = Date.now();
  }, []);
  const activate = useCallback((r) => { setActiveR(r); activeRef.current = r; }, []);
  const closeAudio = useCallback(() => {
    const ac = audioRef.current;
    if (ac && ac.state !== 'closed') ac.close().catch(() => {});
    audioRef.current = null;
  }, []);
  const skip     = useCallback(() => { markSeen(); closeAudio(); onDone(); }, [onDone, closeAudio]);

  useEffect(() => {
    if (hasSeen()) { onDone(); return; }

    startTimeRef.current = Date.now();

    try {
      const ac = new AudioContext(); audioRef.current = ac;
      const tryPlay = () => ac.resume().then(() => playAudio(ac)).catch(() => {});
      if (ac.state === 'suspended') {
        document.addEventListener('click',   tryPlay, { once: true });
        document.addEventListener('keydown', tryPlay, { once: true });
        tryPlay();
      } else { playAudio(ac); }
    } catch {}

    /* ── Timeline (33 seconds total) ────────────────────────────── */
    const T = [
      // Knowledge field
      setTimeout(() => go(1),                                   800),

      // Words of Knowledge flash (2.2 – 5.1 s)
      setTimeout(() => setWordIdx(0),                          2200),  // LEARN
      setTimeout(() => setWordIdx(1),                          2780),  // BUILD
      setTimeout(() => setWordIdx(2),                          3360),  // CREATE
      setTimeout(() => setWordIdx(3),                          3940),  // DISCOVER
      setTimeout(() => setWordIdx(4),                          4520),  // INNOVATE
      setTimeout(() => setWordIdx(5),                          5000),  // INSPIRE
      setTimeout(() => setWordIdx(6),                          5480),  // MASTER
      setTimeout(() => setWordIdx(-1),                         5900),  // clear

      // Line → Book materialises
      setTimeout(() => setShowLine(true),                      6300),
      setTimeout(() => setLineReady(true),                     7000),
      setTimeout(() => setShowBook(true),                      8200),
      setTimeout(() => { setShowLine(false); go(2); },         8700),

      // Book showcase (6.5 s closed)
      setTimeout(() => setBookOpen(true),                     15200),
      setTimeout(() => setShowMap(true),                      17200),
      setTimeout(() => { go(3); setShowMap(false); setShowBook(false); }, 19200),

      // Region activations
      setTimeout(() => activate(['NA']),                      19500),
      setTimeout(() => activate(['NA','SA']),                 20380),
      setTimeout(() => activate(['NA','SA','EU']),            21260),
      setTimeout(() => activate(['NA','SA','EU','AF']),       22140),
      setTimeout(() => activate(['NA','SA','EU','AF','AS']), 23020),
      setTimeout(() => activate([...REGION_ORDER]),           23900),

      // Convergence
      setTimeout(() => go(4),                                 24500),

      // Logo
      setTimeout(() => { go(5); setShowLogo(true); },        27500),

      // Tagline
      setTimeout(() => { go(6); setShowTagline(true); setTagStep(1); }, 30500),
      setTimeout(() => setTagStep(2),                         31400),
      setTimeout(() => setTagStep(3),                         32200),

      // Fade out
      setTimeout(() => { go(7); setFadeOut(true); },         33000),
      setTimeout(() => { markSeen(); onDone(); },             35000),
    ];

    return () => { T.forEach(clearTimeout); closeAudio(); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#020818',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity:    fadeOut ? 0 : 1,
      transition: fadeOut ? 'opacity 2s ease' : 'none',
    }}>
      <MainCanvas
        phaseRef={phaseRef}
        activeRef={activeRef}
        phaseStartRef={phaseStartRef}
        startTimeRef={startTimeRef}
      />

      {/* ── Words of Knowledge ── */}
      {wordIdx >= 0 && (
        <div key={wordIdx} style={{
          position: 'absolute',
          fontFamily: '"Georgia","Times New Roman",serif',
          fontSize: 'clamp(52px, 10vw, 96px)',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '0.18em',
          textShadow: [
            '0 0 30px rgba(37,99,235,1)',
            '0 0 70px rgba(37,99,235,0.6)',
            '0 0 130px rgba(96,165,250,0.35)',
          ].join(','),
          animation: 'wordFlash 0.58s cubic-bezier(0.22,1,0.36,1) forwards',
          pointerEvents: 'none',
          zIndex: 5,
          userSelect: 'none',
        }}>
          {WISDOM[wordIdx]}
        </div>
      )}

      {/* ── Expanding line ── */}
      {showLine && (
        <div style={{
          position: 'absolute',
          height: '2px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg,transparent,white,transparent)',
          boxShadow: '0 0 20px 6px rgba(255,255,255,0.5), 0 0 50px 12px rgba(96,165,250,0.25)',
          width:      lineReady ? '340px' : '0px',
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: 'none',
        }}/>
      )}

      {/* ── 3D CSS Book ── */}
      {showBook && (
        <div style={{ position: 'absolute', perspective: '1300px', perspectiveOrigin: '50% 45%' }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: '-50px',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(30,64,175,0.38), transparent 65%)',
            pointerEvents: 'none',
            animation: 'bookAura 3s ease-in-out infinite',
          }}/>

          {/* 3D book group */}
          <div style={{
            position: 'relative', width: '220px', height: '300px',
            transformStyle: 'preserve-3d',
            animation: bookOpen ? 'none' : 'bookShowcase 7s cubic-bezier(0.2,0.6,0.4,1) forwards',
            transform: bookOpen ? 'rotateX(4deg) rotateY(22deg)' : undefined,
            filter: 'drop-shadow(0 50px 70px rgba(0,0,0,0.95)) drop-shadow(0 10px 30px rgba(37,99,235,0.3))',
          }}>
            {/* Spine */}
            <div style={{
              position: 'absolute', width: '36px', height: '300px',
              left: '-36px', top: 0,
              transformOrigin: 'right center',
              transform: 'rotateY(-90deg)',
              overflow: 'hidden',
            }}><SpineSVG/></div>

            {/* Page stack */}
            <div style={{
              position: 'absolute', width: '30px', height: '300px',
              right: '-30px', top: 0,
              transformOrigin: 'left center',
              transform: 'rotateY(90deg)',
              overflow: 'hidden',
            }}><PagesSVG/></div>

            {/* Back cover */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg,#060e38,#0d1f6e)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(200,148,26,0.2)', borderRadius: 1 }}/>
            </div>

            {/* Front cover — opens */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              borderRadius: '2px 4px 4px 2px',
              overflow: 'hidden',
              transformOrigin: 'left center',
              transform:  bookOpen ? 'rotateY(-145deg)' : 'rotateY(0deg)',
              transition: bookOpen ? 'transform 3.5s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
              boxShadow: 'inset 0 0 40px rgba(37,99,235,0.15), 2px 0 10px rgba(0,0,0,0.6)',
            }}>
              <CoverSVG/>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 35% 25%, rgba(147,197,253,0.08), transparent 55%)',
                pointerEvents: 'none',
                animation: 'coverSheen 4s ease-in-out infinite',
              }}/>
            </div>

            {/* Light when open */}
            {bookOpen && (
              <div style={{
                position: 'absolute', left: 8, top: 0, bottom: 0, width: '1px',
                background: 'linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.7) 50%,rgba(255,255,255,0))',
                boxShadow: '0 0 25px 15px rgba(96,165,250,0.2)',
                opacity: showMap ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}/>
            )}
          </div>
        </div>
      )}

      {/* ── World Map ── */}
      {showMap && (
        <div style={{
          position: 'absolute',
          border: '1px solid rgba(96,165,250,0.3)',
          borderRadius: 6, overflow: 'hidden',
          boxShadow: '0 0 60px rgba(37,99,235,0.3), 0 -10px 28px rgba(96,165,250,0.18)',
          background: 'linear-gradient(180deg,rgba(2,8,30,0.1),rgba(10,28,90,0.35))',
          opacity: 0,
          animation: 'mapRise 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards',
        }}>
          <WorldMap/>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 0%,rgba(96,165,250,0.12),transparent 55%)',
          }}/>
        </div>
      )}

      {/* ── DIY UNIVERSITY Logo ── */}
      {showLogo && (
        <div style={{
          position: 'absolute', textAlign: 'center', zIndex: 10,
          opacity: 0, transform: 'scale(0.8) translateY(14px)',
          animation: 'logoIn 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.05s forwards',
        }}>
          <div style={{
            position: 'absolute', width: 320, height: 320, borderRadius: '50%',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle,rgba(37,99,235,0.32),transparent 62%)',
            animation: 'haloPulse 3s ease-in-out infinite', pointerEvents: 'none',
          }}/>
          <div style={{
            fontFamily: '"Georgia","Times New Roman",serif',
            fontSize: 100, fontWeight: 900, lineHeight: 1,
            color: 'white', letterSpacing: '0.06em',
            WebkitTextStroke: '2.5px rgba(37,99,235,0.8)',
            textShadow: '0 0 60px rgba(37,99,235,0.95),0 0 120px rgba(37,99,235,0.4),0 0 3px rgba(255,255,255,0.8)',
          }}>DIY</div>
          <div style={{
            width: 220, height: 1.5, margin: '10px auto',
            background: 'linear-gradient(90deg,transparent,#60A5FA,transparent)',
            boxShadow: '0 0 12px rgba(96,165,250,0.6)',
          }}/>
          <div style={{
            fontFamily: '"Georgia","Times New Roman",serif',
            fontSize: 20, fontWeight: 400, letterSpacing: '0.55em',
            color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase',
            textShadow: '0 0 28px rgba(96,165,250,0.55)',
          }}>UNIVERSITY</div>
          {[[-32,-18],[32,-18]].map(([lx,ty], i) => (
            <div key={i} style={{
              position: 'absolute', top: ty, left: `calc(50% + ${lx}px)`,
              fontSize: 13, color: 'rgba(96,165,250,0.6)',
              animation: `twinkle ${1.8 + i * 0.4}s ease-in-out infinite`,
            }}>✦</div>
          ))}
        </div>
      )}

      {/* ── Tagline ── */}
      {showTagline && (
        <div style={{ position: 'absolute', bottom: '28%', textAlign: 'center', zIndex: 10, letterSpacing: '0.22em' }}>
          {['Learn.','Build.','Master.'].map((w, i) => (
            <span key={w} style={{
              display: 'inline-block', marginRight: i < 2 ? '0.6em' : 0,
              fontFamily: '"Georgia",serif', fontSize: 22,
              color: 'rgba(255,255,255,0.88)',
              textShadow: '0 0 20px rgba(96,165,250,0.45)',
              opacity:   tagStep > i ? 1 : 0,
              transform: tagStep > i ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}>{w}</span>
          ))}
        </div>
      )}

      {/* ── Skip ── */}
      {phase >= 1 && !fadeOut && (
        <button onClick={skip} style={{
          position: 'absolute', bottom: 26, right: 26, zIndex: 20,
          padding: '6px 15px', borderRadius: 6, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.36)', fontSize: 11, letterSpacing: '0.04em',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.36)'; }}>
          Skip Intro
        </button>
      )}

      <style>{`
        @keyframes wordFlash {
          0%   { opacity:0; transform:scale(0.62) translateY(6px); filter:blur(28px); }
          28%  { opacity:1; transform:scale(1.04) translateY(0);   filter:blur(0); }
          65%  { opacity:1; transform:scale(1)    translateY(0);   filter:blur(0); }
          100% { opacity:0; transform:scale(1.18);                 filter:blur(14px); }
        }
        @keyframes bookShowcase {
          0%   { transform:rotateX(5deg) rotateY(22deg) scale(0.04); opacity:0; }
          9%   { transform:rotateX(5deg) rotateY(22deg) scale(1.03); opacity:1; }
          15%  { transform:rotateX(5deg) rotateY(22deg) scale(1); }
          32%  { transform:rotateX(4deg) rotateY(40deg); }
          52%  { transform:rotateX(4deg) rotateY(26deg); }
          68%  { transform:rotateX(3deg) rotateY(34deg); }
          84%  { transform:rotateX(4deg) rotateY(24deg); }
          100% { transform:rotateX(4deg) rotateY(22deg); }
        }
        @keyframes bookAura {
          0%,100% { opacity:0.7; transform:scale(1); }
          50%     { opacity:1;   transform:scale(1.05); }
        }
        @keyframes coverSheen {
          0%,100% { opacity:0.6; }
          50%     { opacity:1; }
        }
        @keyframes mapRise {
          from { opacity:0; transform:translateY(70px) scale(0.92); }
          to   { opacity:1; transform:translateY(-45px) scale(1); }
        }
        @keyframes logoIn {
          from { opacity:0; transform:scale(0.8) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes haloPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:0.7; }
          50%     { transform:translate(-50%,-50%) scale(1.14); opacity:1;   }
        }
        @keyframes twinkle {
          0%,100% { opacity:0.35; transform:scale(0.85); }
          50%     { opacity:0.9;  transform:scale(1.25); }
        }
      `}</style>
    </div>
  );
}

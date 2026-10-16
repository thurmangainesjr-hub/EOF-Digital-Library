import React, { useEffect, useRef, useState } from 'react';

export const DTE_INTRO_KEY = 'eof-intro-dev-team';
export const hasSeenDTEIntro = () => sessionStorage.getItem(DTE_INTRO_KEY) === '1';

/* ─────────────────────────────────────────────────────────────────────────────
   WORMHOLE PHASES
   0      → 3.0s  : Wormhole travel (particles rush from center outward)
   3.0    → 5.0s  : Deceleration    (speed eases from 20x → 0)
   5.0    → 6.6s  : D.T.E logo reveals with electric arcs
   6.6    → 7.8s  : "Powered by Expression of Freedom" fades in
   7.8    → 9.0s  : Full glow pulse
   9.0    → 10.2s : Fade out → dashboard
───────────────────────────────────────────────────────────────────────────── */

export default function DTEIntro({ onDone }) {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const phaseRef   = useRef('wormhole');
  const startRef   = useRef(Date.now());

  const [phase,    setPhase]    = useState('wormhole');
  const [flash,    setFlash]    = useState(false);
  const [exiting,  setExiting]  = useState(false);

  /* ── Phase timeline ──────────────────────────────────────────────────── */
  useEffect(() => {
    const go = (ph, delay) =>
      setTimeout(() => { phaseRef.current = ph; setPhase(ph); }, delay);

    const timers = [
      go('decel',   3000),
      go('reveal',  5000),
      go('tagline', 6600),
      go('glow',    7800),
      setTimeout(() => setFlash(true),   4900),          // bright flash at reveal
      setTimeout(() => setFlash(false),  5300),
      setTimeout(() => setExiting(true), 9000),
      setTimeout(() => { sessionStorage.setItem(DTE_INTRO_KEY, '1'); onDone(); }, 10300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  /* ── Canvas wormhole ─────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fit = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    fit();
    window.addEventListener('resize', fit);

    const ctx = canvas.getContext('2d');
    const cx  = () => canvas.width  / 2;
    const cy  = () => canvas.height / 2;

    /* Particle colors */
    const COLS = ['#06B6D4','#7DD3FC','#BAE6FD','#A78BFA','#C4B5FD','#ffffff','#38BDF8','#67E8F9'];

    function mkPart(spread) {
      const a   = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      const p   = {
        x: cx(), y: cy(),
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        color: COLS[Math.floor(Math.random() * COLS.length)],
        size:  Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        streak: Math.random() > 0.3,
      };
      if (spread) {
        const d = Math.random() * Math.hypot(cx(), cy()) * 0.85;
        p.x = cx() + Math.cos(a) * d;
        p.y = cy() + Math.sin(a) * d;
      }
      return p;
    }

    const parts = Array.from({ length: 520 }, () => mkPart(true));
    const rings = [];
    let lastRing = 0, lastTs = 0;

    function tick(ts) {
      animRef.current = requestAnimationFrame(tick);
      const dt  = Math.min((ts - lastTs) / 16, 3);
      lastTs = ts;

      const elapsed = (Date.now() - startRef.current) / 1000;
      const ph = phaseRef.current;

      /* ── Speed multiplier ── */
      let sm;
      if (ph === 'wormhole') {
        sm = Math.min(elapsed * 5 + 8, 20);
      } else if (ph === 'decel') {
        const t = Math.max(0, elapsed - 3.0);
        const p = Math.min(t / 2.0, 1);
        const ep = 1 - (1 - p) * (1 - p); // ease-out quadratic
        sm = 20 * (1 - ep) + 0.2 * ep;
      } else {
        sm = 0.18;
      }

      /* ── Clear with persistence ── */
      const clearA = ph === 'wormhole' ? 0.10 : ph === 'decel' ? 0.13 : 0.20;
      ctx.fillStyle = `rgba(0,0,0,${clearA})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* ── Expanding tunnel rings ── */
      if ((ph === 'wormhole' || ph === 'decel') && ts - lastRing > 260) {
        rings.push({ r: 4, a: 0.55, baseSpd: sm });
        lastRing = ts;
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += Math.max(rg.baseSpd, sm) * 3.5 * dt;
        rg.a *= 0.965;
        if (rg.a < 0.015 || rg.r > Math.max(canvas.width, canvas.height)) {
          rings.splice(i, 1); continue;
        }
        ctx.beginPath();
        ctx.arc(cx(), cy(), rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6,182,212,${rg.a * 0.4})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      /* ── Center vanishing-point glow ── */
      if (ph === 'wormhole' || ph === 'decel') {
        const grd = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 120);
        grd.addColorStop(0,   `rgba(6,182,212,${sm > 5 ? 0.18 : 0.06})`);
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      /* ── Particles ── */
      const margin = 100;
      for (const p of parts) {
        const trailLen = sm * 0.65;
        p.x += p.vx * sm * dt;
        p.y += p.vy * sm * dt;

        if (
          p.x < -margin || p.x > canvas.width  + margin ||
          p.y < -margin || p.y > canvas.height + margin
        ) {
          Object.assign(p, mkPart(false));
        }

        const alpha = Math.round(p.alpha * 220).toString(16).padStart(2, '0');

        if (p.streak && sm > 1.2) {
          const tx = p.x - p.vx * trailLen;
          const ty = p.y - p.vy * trailLen;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color + alpha;
          ctx.lineWidth   = p.size;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(p.size * 0.55, 0.4), 0, Math.PI * 2);
          ctx.fillStyle = p.color + alpha;
          ctx.fill();
        }
      }

      /* ── Edge vignette ── */
      const vgd = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), Math.max(canvas.width, canvas.height) * 0.72);
      vgd.addColorStop(0,   'rgba(0,0,0,0)');
      vgd.addColorStop(0.65,'rgba(0,0,0,0)');
      vgd.addColorStop(1,   'rgba(0,0,0,0.75)');
      ctx.fillStyle = vgd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', fit);
    };
  }, []);

  const showLogo    = phase === 'reveal'  || phase === 'tagline' || phase === 'glow';
  const showTagline = phase === 'tagline' || phase === 'glow';
  const isGlowing   = phase === 'glow';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity:    exiting ? 0 : 1,
      transition: exiting ? 'opacity 1.3s ease' : 'none',
    }}>

      {/* ── Wormhole canvas ── */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

      {/* ── Flash burst at reveal ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.55) 0%, rgba(100,200,255,0.2) 40%, transparent 70%)',
        opacity:    flash ? 1 : 0,
        transition: flash ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* ── Ambient glow behind logo ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 55% 38% at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)',
        opacity: showLogo ? 1 : 0,
        transition: 'opacity 2s ease',
        pointerEvents: 'none',
      }} />

      {/* ── Logo layer ── */}
      <div style={{
        position: 'relative', zIndex: 3, textAlign: 'center',
        opacity:    showLogo ? 1 : 0,
        transform:  showLogo ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(16px)',
        transition: 'opacity 1.8s ease, transform 1.8s ease',
      }}>

        {/* Electric arcs */}
        <ElectricArcs active={showLogo} />

        {/* D.T.E */}
        <div style={{
          fontSize: 'clamp(68px, 13vw, 114px)',
          fontWeight: 900,
          letterSpacing: '0.22em',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #BAE6FD 0%, #06B6D4 25%, #38BDF8 50%, #A78BFA 75%, #C4B5FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: isGlowing
            ? 'drop-shadow(0 0 18px rgba(6,182,212,1)) drop-shadow(0 0 45px rgba(6,182,212,0.6)) drop-shadow(0 0 90px rgba(167,139,250,0.3))'
            : 'drop-shadow(0 0 10px rgba(6,182,212,0.7)) drop-shadow(0 0 28px rgba(6,182,212,0.35))',
          transition: 'filter 1.8s ease',
          userSelect: 'none',
        }}>
          D.T.E
        </div>

        {/* Powered by tagline */}
        <div style={{
          marginTop: 22,
          fontSize: 'clamp(9px, 1.4vw, 13px)',
          fontWeight: 300,
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.52)',
          fontFamily: 'system-ui, sans-serif',
          opacity:    showTagline ? 1 : 0,
          transform:  showTagline ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 1.6s ease, transform 1.6s ease',
          userSelect: 'none',
        }}>
          Powered by Expression of Freedom
        </div>
      </div>

    </div>
  );
}

/* ── Electric arc component ─────────────────────────────────────────────── */
function ElectricArcs({ active }) {
  const [arcs, setArcs] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!active) return;

    function spawn() {
      const id  = nextId.current++;
      const cx  = (Math.random() - 0.5) * 360;
      const cy  = (Math.random() - 0.5) * 100;
      const len = Math.random() * 80 + 10;
      const ang = Math.random() * 360 * (Math.PI / 180);
      const col = Math.random() > 0.45
        ? '#06B6D4'
        : Math.random() > 0.5 ? '#A78BFA' : '#7DD3FC';
      const arc = {
        id,
        x1: cx, y1: cy,
        x2: cx + Math.cos(ang) * len,
        y2: cy + Math.sin(ang) * len,
        color: col,
        w:  Math.random() * 1.3 + 0.15,
        op: Math.random() * 0.65 + 0.25,
      };
      setArcs(prev => [...prev.slice(-12), arc]);
      setTimeout(() => setArcs(prev => prev.filter(a => a.id !== id)), Math.random() * 130 + 40);
    }

    /* Initial burst */
    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 35);
    const iv = setInterval(spawn, 85);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <svg
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        width: 620, height: 240,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {arcs.map(a => (
        <line
          key={a.id}
          x1={310 + a.x1} y1={120 + a.y1}
          x2={310 + a.x2} y2={120 + a.y2}
          stroke={a.color}
          strokeWidth={a.w}
          opacity={a.op}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

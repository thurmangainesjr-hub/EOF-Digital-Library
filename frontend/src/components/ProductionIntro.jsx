import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'production-intro-seen';
export const hasSeenProductionIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markProductionIntroSeen = () => sessionStorage.setItem(KEY, '1');

const ORANGE  = '#F97316';
const ORANGE2 = '#FED7AA';
const RED     = '#EF4444';

export default function ProductionIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markProductionIntroSeen();
    setPhase(7);
    setTimeout(onDone, 700);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // ── FILM FRAMES (scrolling strip) ─────────────────────────────────────
    const frames = Array.from({ length: 16 }, (_, i) => ({
      x: (i / 16),
      speed: 0.0004 + Math.random() * 0.0003,
      alpha: 0.05 + Math.random() * 0.1,
      row: Math.floor(Math.random() * 3),
    }));

    // ── AUDIO WAVEFORM (animated bars at bottom) ──────────────────────────
    const waveBars = Array.from({ length: 40 }, (_, i) => ({
      phase: Math.random() * Math.PI * 2,
      speed: 3 + Math.random() * 4,
      baseH: 0.02 + Math.random() * 0.06,
    }));

    // ── ORBIT PARTICLES ───────────────────────────────────────────────────
    const orbiters = Array.from({ length: 36 }, (_, i) => ({
      angle: (Math.PI * 2 / 36) * i,
      speed: 0.008 + (i % 3) * 0.003,
      radius: 0.14 + (i % 4) * 0.04,
      size: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3,
      color: i % 3 === 0 ? ORANGE : i % 3 === 1 ? ORANGE2 : RED,
    }));

    // ── RECORD DOT (pulsing REC indicator) ────────────────────────────────
    let recAlpha = 0;

    let t = 0;
    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const minDim = Math.min(W, H);

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 700  && phase < 2) setPhase(2);
      if (elapsed > 1400 && phase < 3) setPhase(3);
      if (elapsed > 2300 && phase < 4) setPhase(4);
      if (elapsed > 3400 && phase < 5) setPhase(5);
      if (elapsed > 4600 && phase < 6) setPhase(6);
      if (elapsed > 5900) { finish(); return; }

      ctx.fillStyle = '#0C0702';
      ctx.fillRect(0, 0, W, H);

      // Orange radial glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.6);
      glow.addColorStop(0, 'rgba(249,115,22,0.12)');
      glow.addColorStop(0.5, 'rgba(234,88,12,0.05)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // ── FILM FRAMES ──────────────────────────────────────────────────────
      if (elapsed > 200) {
        const fp = Math.min((elapsed - 200) / 800, 1);
        const rowYs = [H * 0.12, H * 0.5, H * 0.88];
        frames.forEach(f => {
          f.x = (f.x + f.speed) % 1;
          const fy = rowYs[f.row];
          const fw = W * 0.055, fh = fw * 0.75;
          const fx = f.x * W - fw / 2;

          ctx.save();
          ctx.globalAlpha = f.alpha * fp;
          // Frame border
          ctx.strokeStyle = ORANGE;
          ctx.lineWidth = 0.6;
          ctx.strokeRect(fx, fy - fh / 2, fw, fh);
          // Sprocket holes
          [-0.42, 0.42].forEach(side => {
            ctx.beginPath();
            ctx.arc(fx + fw / 2 + side * fw * 0.9, fy, 2, 0, Math.PI * 2);
            ctx.strokeStyle = ORANGE;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
          ctx.restore();
        });
      }

      // ── ORBIT PARTICLES ───────────────────────────────────────────────────
      if (elapsed > 500) {
        const op = Math.min((elapsed - 500) / 800, 1);
        orbiters.forEach(orb => {
          orb.angle += orb.speed;
          const r = minDim * orb.radius * op;
          const ox = cx + Math.cos(orb.angle) * r;
          const oy = cy + Math.sin(orb.angle) * r;
          ctx.beginPath();
          ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
          ctx.fillStyle = orb.color;
          ctx.globalAlpha = orb.alpha * op;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── WAVEFORM BARS ────────────────────────────────────────────────────
      if (elapsed > 800) {
        const wp = Math.min((elapsed - 800) / 700, 1);
        const barW = W / (waveBars.length * 1.6);
        const startX = cx - (waveBars.length * barW * 1.6) / 2;
        waveBars.forEach((bar, i) => {
          const h = Math.abs(Math.sin(t * bar.speed + bar.phase)) * H * bar.baseH * wp;
          const bx = startX + i * barW * 1.6;
          const by = H * 0.82 - h / 2;
          ctx.fillStyle = i % 4 === 0 ? RED : ORANGE;
          ctx.globalAlpha = 0.25 * wp;
          ctx.fillRect(bx, by, barW * 0.7, h);
          ctx.globalAlpha = 1;
        });
      }

      // ── PLAY TRIANGLE (center icon) ───────────────────────────────────────
      if (elapsed > 1200) {
        const ip = Math.min((elapsed - 1200) / 900, 1);
        const ts2 = minDim * 0.1 * ip;
        const pulse = 1 + Math.sin(t * 2) * 0.04;

        // Glow
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, ts2 * 3.5);
        cg.addColorStop(0, `rgba(249,115,22,${0.28 * ip})`);
        cg.addColorStop(0.5, `rgba(234,88,12,${0.1 * ip})`);
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(cx, cy, ts2 * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);

        // Circle background
        ctx.beginPath();
        ctx.arc(0, 0, ts2 * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,0.10)`;
        ctx.fill();
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8 * ip;
        ctx.stroke();

        // Play triangle
        ctx.beginPath();
        ctx.moveTo(-ts2 * 0.35, -ts2 * 0.55);
        ctx.lineTo(ts2 * 0.6,    0);
        ctx.lineTo(-ts2 * 0.35,  ts2 * 0.55);
        ctx.closePath();
        ctx.fillStyle = ORANGE;
        ctx.globalAlpha = 0.85 * ip;
        ctx.fill();

        // REC dot
        recAlpha = 0.7 + Math.sin(t * 4) * 0.3;
        ctx.beginPath();
        ctx.arc(ts2 * 0.75, -ts2 * 0.8, ts2 * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = RED;
        ctx.globalAlpha = recAlpha * ip;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [finish]);

  const titleVisible = phase >= 3;
  const tagVisible   = phase >= 5;
  const exiting      = phase >= 7;

  return (
    <div onClick={finish} style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#0C0702', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: ORANGE2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Master Control
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(28px, 5.5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${ORANGE}44` }}>
          Production Hub
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}/>
      </div>

      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(12px, 1.6vw, 17px)', color: ORANGE2, margin: 0, letterSpacing: '0.28em', fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 24px ${ORANGE}44` }}>
          CREATE · LAUNCH · DOMINATE
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(249,115,22,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

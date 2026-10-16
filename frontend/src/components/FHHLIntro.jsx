import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'fhhl-intro-seen';
export const hasSeenFHHLIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markFHHLIntroSeen = () => sessionStorage.setItem(KEY, '1');

const AMBER  = '#F59E0B';
const AMBER2 = '#FCD34D';
const AMBER3 = '#B45309';

export default function FHHLIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markFHHLIntroSeen();
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

    // ── SCORE TICKER NUMBERS ──────────────────────────────────────────────
    const tickers = Array.from({ length: 30 }, () => ({
      x: Math.random(),
      y: Math.random(),
      value: '+' + (Math.floor(Math.random() * 500) + 50),
      vy: -0.0005 - Math.random() * 0.0008,
      alpha: 0.06 + Math.random() * 0.18,
      size: 10 + Math.random() * 14,
      color: Math.random() > 0.5 ? AMBER : AMBER2,
    }));

    // ── VINYL / RECORD PARTICLES ───────────────────────────────────────────
    const records = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: -0.0004 - Math.random() * 0.0004,
      size: 8 + Math.random() * 18,
      alpha: 0.06 + Math.random() * 0.14,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    }));

    // ── BRACKET LINES ─────────────────────────────────────────────────────
    // Animated tournament bracket that draws in from the sides
    const buildBracket = (W, H) => {
      const cx = W / 2, cy = H / 2;
      const bw = Math.min(W * 0.35, 260);
      const bh = Math.min(H * 0.32, 200);
      return [
        // Left side
        { x1: cx - bw, y1: cy - bh * 0.6, x2: cx - bw * 0.5, y1b: cy - bh * 0.6, delay: 800 },
        { x1: cx - bw, y1: cy + bh * 0.6, x2: cx - bw * 0.5, y1b: cy + bh * 0.6, delay: 900 },
        { x1: cx - bw * 0.5, y1: cy - bh * 0.6, x2: cx - bw * 0.5, y1b: cy + bh * 0.6, delay: 1000 },
        { x1: cx - bw * 0.5, y1: cy, x2: cx - bw * 0.1, y1b: cy, delay: 1100 },
        // Right side
        { x1: cx + bw, y1: cy - bh * 0.6, x2: cx + bw * 0.5, y1b: cy - bh * 0.6, delay: 800 },
        { x1: cx + bw, y1: cy + bh * 0.6, x2: cx + bw * 0.5, y1b: cy + bh * 0.6, delay: 900 },
        { x1: cx + bw * 0.5, y1: cy - bh * 0.6, x2: cx + bw * 0.5, y1b: cy + bh * 0.6, delay: 1000 },
        { x1: cx + bw * 0.5, y1: cy, x2: cx + bw * 0.1, y1b: cy, delay: 1100 },
      ];
    };

    // ── TROPHY ────────────────────────────────────────────────────────────
    const drawTrophy = (cx, cy, size, progress) => {
      const s = size * progress;
      ctx.save();
      ctx.globalAlpha = 0.85 * progress;

      // Cup body
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.5, cy - s * 0.6);
      ctx.bezierCurveTo(cx - s * 0.6, cy - s * 0.1, cx - s * 0.55, cy + s * 0.2, cx, cy + s * 0.35);
      ctx.bezierCurveTo(cx + s * 0.55, cy + s * 0.2, cx + s * 0.6, cy - s * 0.1, cx + s * 0.5, cy - s * 0.6);
      ctx.closePath();
      ctx.fillStyle = `rgba(245,158,11,0.12)`;
      ctx.fill();
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Handles
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.arc(cx + side * s * 0.55, cy - s * 0.2, s * 0.18, Math.PI * 0.2, Math.PI * 0.8, side === -1);
        ctx.strokeStyle = AMBER;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.35);
      ctx.lineTo(cx, cy + s * 0.6);
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Base
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.3, cy + s * 0.6, s * 0.6, s * 0.08, 4);
      ctx.fillStyle = `rgba(245,158,11,0.2)`;
      ctx.fill();
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 1.5);
      glow.addColorStop(0, `rgba(245,158,11,0.2)`);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = progress * 0.7;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let bracket = null;
    let bracketProgress = [];
    let t = 0;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2, cy = H / 2;

      if (!bracket) {
        bracket = buildBracket(W, H);
        bracketProgress = bracket.map(() => 0);
      }

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 700  && phase < 2) setPhase(2);
      if (elapsed > 1400 && phase < 3) setPhase(3);
      if (elapsed > 2200 && phase < 4) setPhase(4);
      if (elapsed > 3200 && phase < 5) setPhase(5);
      if (elapsed > 4400 && phase < 6) setPhase(6);
      if (elapsed > 5700) { finish(); return; }

      ctx.fillStyle = '#080709';
      ctx.fillRect(0, 0, W, H);

      // Amber vignette
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.65);
      vg.addColorStop(0, 'rgba(245,158,11,0.10)');
      vg.addColorStop(0.5, 'rgba(180,83,9,0.05)');
      vg.addColorStop(1, 'transparent');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ── SCORE TICKERS ──────────────────────────────────────────────────
      if (elapsed > 200) {
        const tp = Math.min((elapsed - 200) / 600, 1);
        ctx.save();
        tickers.forEach(tk => {
          tk.y += tk.vy;
          if (tk.y < -0.05) { tk.y = 1.05; tk.x = Math.random(); tk.value = '+' + (Math.floor(Math.random() * 500) + 50); }
          ctx.font = `700 ${tk.size}px 'Courier New', monospace`;
          ctx.fillStyle = tk.color;
          ctx.globalAlpha = tk.alpha * tp;
          ctx.fillText(tk.value, tk.x * W, tk.y * H);
        });
        ctx.restore();
      }

      // ── VINYL RECORDS ──────────────────────────────────────────────────
      if (elapsed > 400) {
        const rp = Math.min((elapsed - 400) / 600, 1);
        records.forEach(r => {
          r.x += r.vx; r.y += r.vy; r.rotation += r.rotSpeed;
          if (r.y < -0.05) { r.y = 1.05; r.x = Math.random(); }
          if (r.x < -0.05 || r.x > 1.05) r.vx *= -1;

          ctx.save();
          ctx.translate(r.x * W, r.y * H);
          ctx.rotate(r.rotation);
          ctx.globalAlpha = r.alpha * rp;

          // Outer ring
          ctx.beginPath();
          ctx.arc(0, 0, r.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245,158,11,0.08)';
          ctx.fill();
          ctx.strokeStyle = AMBER;
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // Inner groove rings
          [0.65, 0.45].forEach(f => {
            ctx.beginPath();
            ctx.arc(0, 0, r.size * f, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(245,158,11,0.3)`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          });

          // Center hole
          ctx.beginPath();
          ctx.arc(0, 0, r.size * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = AMBER + '40';
          ctx.fill();

          ctx.restore();
        });
      }

      // ── BRACKET ────────────────────────────────────────────────────────
      if (elapsed > 800 && bracket) {
        bracket.forEach((seg, i) => {
          if (elapsed < seg.delay) return;
          bracketProgress[i] = Math.min(bracketProgress[i] + 0.05, 1);
          const p = bracketProgress[i];
          const tx = seg.x1 + (seg.x2 - seg.x1) * p;
          const ty = seg.y1 + (seg.y1b - seg.y1) * p;

          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          if (seg.y1 === seg.y1b) {
            ctx.lineTo(seg.x1 + (seg.x2 - seg.x1) * p, seg.y1);
          } else {
            ctx.lineTo(seg.x2, seg.y1 + (seg.y1b - seg.y1) * p);
          }
          ctx.strokeStyle = `rgba(245,158,11,${0.35 * p})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // ── TROPHY ─────────────────────────────────────────────────────────
      if (elapsed > 1200) {
        const tp = Math.min((elapsed - 1200) / 900, 1);
        const size = Math.min(W, H) * 0.13;
        drawTrophy(cx, cy - H * 0.02, size, tp);
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
    <div
      onClick={finish}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#080709', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: AMBER2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Fantasy League
        </div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(26px, 5vw, 56px)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${AMBER}44` }}>
          Fantasy Hip-Hop League
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 'clamp(11px, 1.5vw, 15px)', fontWeight: 700, letterSpacing: '0.35em', color: AMBER, marginTop: 6, textTransform: 'uppercase', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.25s' }}>
          FHHL
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}/>
      </div>

      {/* Tagline */}
      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(12px, 1.6vw, 17px)', color: AMBER2, margin: 0, letterSpacing: '0.28em', fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 24px ${AMBER}44` }}>
          DRAFT · SCORE · WIN
        </p>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(245,158,11,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

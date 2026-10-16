import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'gis-intro-seen';
export const hasSeenGISIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markGISIntroSeen = () => sessionStorage.setItem(KEY, '1');

const PURPLE = '#7C3AED';
const GREEN  = '#34D399';
const CYAN   = '#06B6D4';

export default function GISIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markGISIntroSeen();
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

    // ── PIXEL GRID ───────────────────────────────────────────────────────
    const GRID_COLS = 32;
    const GRID_ROWS = 20;
    const cells = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => ({
      col: i % GRID_COLS,
      row: Math.floor(i / GRID_COLS),
      lit: false,
      alpha: 0,
      color: [PURPLE, GREEN, CYAN, '#A78BFA'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 2200,
      pulse: Math.random() * Math.PI * 2,
    }));

    // ── FLOATING HEX PARTICLES ────────────────────────────────────────────
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: -0.0003 - Math.random() * 0.0005,
      size: 2 + Math.random() * 4,
      color: [PURPLE, GREEN, CYAN][Math.floor(Math.random() * 3)],
      alpha: 0.08 + Math.random() * 0.25,
      sides: Math.random() > 0.5 ? 6 : 4,
    }));

    // ── CONTROLLER SHAPE ────────────────────────────────────────────────
    // Drawn in canvas as a simple iconic game controller

    // ── SCAN LINES ──────────────────────────────────────────────────────
    let glitchTimer = 0;
    let glitchActive = false;
    let glitchX = 0, glitchH = 0, glitchOffset = 0;

    let t = 0;

    const drawHex = (x, y, r, fill, stroke, alpha) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * Math.cos(ang);
        const py = y + r * Math.sin(ang);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.globalAlpha = alpha * 0.6; ctx.lineWidth = 0.8; ctx.stroke(); }
      ctx.globalAlpha = 1;
    };

    const drawController = (cx, cy, size, progress) => {
      const s = size * progress;
      ctx.save();
      ctx.globalAlpha = 0.85 * progress;

      // Body
      const bodyW = s * 2.2;
      const bodyH = s * 1.1;
      ctx.beginPath();
      ctx.roundRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH, s * 0.3);
      ctx.fillStyle = 'rgba(124,58,237,0.12)';
      ctx.fill();
      ctx.strokeStyle = PURPLE;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // D-pad (left)
      const dpX = cx - bodyW * 0.3;
      const dpY = cy;
      const dpS = s * 0.18;
      ctx.fillStyle = '#A78BFA';
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.roundRect(dpX + dx * dpS * 1.1 - dpS * 0.5, dpY + dy * dpS * 1.1 - dpS * 0.5, dpS, dpS, 3);
        ctx.fill();
      });

      // Buttons (right) — diamond pattern
      const btX = cx + bodyW * 0.3;
      const btY = cy;
      const btR = s * 0.1;
      const btColors = [GREEN, CYAN, '#F472B6', '#FCD34D'];
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], bi) => {
        ctx.beginPath();
        ctx.arc(btX + dx * btR * 2.2, btY + dy * btR * 2.2, btR, 0, Math.PI * 2);
        ctx.fillStyle = btColors[bi];
        ctx.fill();
      });

      // Grips (bottom)
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.ellipse(cx + side * bodyW * 0.3, cy + bodyH * 0.55, s * 0.22, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.10)';
        ctx.fill();
        ctx.strokeStyle = `rgba(124,58,237,0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Center logo — simple circle
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = PURPLE;
      ctx.fill();

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 1.6);
      glow.addColorStop(0, `rgba(124,58,237,0.18)`);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = progress * 0.8;
      ctx.fillStyle = glow;
      ctx.fillRect(cx - s * 2, cy - s * 2, s * 4, s * 4);

      ctx.restore();
    };

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 700  && phase < 2) setPhase(2);
      if (elapsed > 1400 && phase < 3) setPhase(3);
      if (elapsed > 2200 && phase < 4) setPhase(4);
      if (elapsed > 3200 && phase < 5) setPhase(5);
      if (elapsed > 4400 && phase < 6) setPhase(6);
      if (elapsed > 5800) { finish(); return; }

      // Background
      ctx.fillStyle = '#07050F';
      ctx.fillRect(0, 0, W, H);

      // Deep purple vignette
      const vgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.7);
      vgrd.addColorStop(0, 'rgba(124,58,237,0.12)');
      vgrd.addColorStop(0.5, 'rgba(52,211,153,0.04)');
      vgrd.addColorStop(1, 'transparent');
      ctx.fillStyle = vgrd;
      ctx.fillRect(0, 0, W, H);

      // ── PIXEL GRID ──────────────────────────────────────────────────────
      if (elapsed > 100) {
        const cellW = W / GRID_COLS;
        const cellH = H / GRID_ROWS;
        const gp = Math.min((elapsed - 100) / 1200, 1);

        cells.forEach(cell => {
          if (elapsed - 100 > cell.delay) {
            cell.alpha = Math.min(cell.alpha + 0.015, 0.07 + 0.06 * Math.sin(t * 1.5 + cell.pulse));
          }
          if (cell.alpha > 0.005) {
            const x = cell.col * cellW;
            const y = cell.row * cellH;
            ctx.strokeStyle = cell.color;
            ctx.globalAlpha = cell.alpha * gp;
            ctx.lineWidth = 0.4;
            ctx.strokeRect(x, y, cellW, cellH);
            ctx.globalAlpha = 1;
          }
        });
      }

      // ── HEX PARTICLES ────────────────────────────────────────────────────
      if (elapsed > 400) {
        const pp = Math.min((elapsed - 400) / 800, 1);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
          if (p.x < -0.05 || p.x > 1.05) p.vx *= -1;
          drawHex(p.x * W, p.y * H, p.size, p.color + '18', p.color, p.alpha * pp);
        });
      }

      // ── GAME CONTROLLER ──────────────────────────────────────────────────
      if (elapsed > 800) {
        const cp = Math.min((elapsed - 800) / 900, 1);
        const size = Math.min(W, H) * 0.16;
        drawController(cx, cy - H * 0.03, size, cp);
      }

      // ── SCAN LINES ───────────────────────────────────────────────────────
      ctx.save();
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, y, W, 1);
      }
      ctx.restore();

      // ── GLITCH EFFECT ────────────────────────────────────────────────────
      glitchTimer += 0.016;
      if (elapsed > 1000 && glitchTimer > 0.8 + Math.random() * 1.2) {
        glitchActive = true;
        glitchTimer  = 0;
        glitchX      = Math.random() * W * 0.5;
        glitchH      = 2 + Math.random() * 8;
        glitchOffset = (Math.random() - 0.5) * 20;
      }
      if (glitchActive) {
        const gy = Math.random() * H;
        try {
          const imgData = ctx.getImageData(0, gy, W, glitchH);
          ctx.putImageData(imgData, glitchOffset, gy);
        } catch (_) {}
        glitchActive = false;
      }

      // ── LOADING BAR ──────────────────────────────────────────────────────
      if (elapsed > 1200) {
        const lp = Math.min((elapsed - 1200) / 2000, 1);
        const barW = Math.min(W * 0.38, 320);
        const barH = 3;
        const bx   = cx - barW / 2;
        const by   = cy + Math.min(H * 0.16, 120);

        ctx.save();
        // Track
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.roundRect(bx, by, barW, barH, 999);
        ctx.fill();
        // Fill
        const barGrd = ctx.createLinearGradient(bx, 0, bx + barW, 0);
        barGrd.addColorStop(0, PURPLE);
        barGrd.addColorStop(0.5, CYAN);
        barGrd.addColorStop(1, GREEN);
        ctx.fillStyle = barGrd;
        ctx.beginPath();
        ctx.roundRect(bx, by, barW * lp, barH, 999);
        ctx.fill();
        // Label
        ctx.font = `700 10px 'Courier New', monospace`;
        ctx.fillStyle = lp < 1 ? 'rgba(124,58,237,0.7)' : 'rgba(52,211,153,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(lp < 1 ? `LOADING... ${Math.floor(lp * 100)}%` : 'READY', cx, by - 8);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [finish]);

  const titleVisible  = phase >= 3;
  const tagVisible    = phase >= 5;
  const exiting       = phase >= 7;

  return (
    <div
      onClick={finish}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#07050F', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '13%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: CYAN, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Game Division
        </div>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(28px, 5.5vw, 58px)', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', background: `linear-gradient(135deg, ${PURPLE}, ${CYAN}, ${GREEN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          GRIOT INTERACTIVE
        </div>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(14px, 2.5vw, 24px)', fontWeight: 700, letterSpacing: '0.1em', color: '#A78BFA', marginTop: 4, opacity: titleVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.25s' }}>
          STUDIOS
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14, opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
          {[PURPLE, CYAN, GREEN, '#A78BFA'].map((c, i) => (
            <div key={i} style={{ width: 16, height: 2, borderRadius: 999, background: c }} />
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(11px, 1.5vw, 16px)', color: GREEN, margin: 0, letterSpacing: '0.22em', fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 20px ${GREEN}55` }}>
          BUILD THE WORLD. PLAY THE STORY.
        </p>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(124,58,237,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: '"Courier New", monospace', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        [ CLICK TO SKIP ]
      </div>
    </div>
  );
}

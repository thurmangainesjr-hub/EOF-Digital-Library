import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'growth-suite-intro';
export const hasSeenGrowthIntro = () => sessionStorage.getItem(KEY) === '1';
export const markGrowthIntroSeen = () => sessionStorage.setItem(KEY, '1');

const EMERALD  = '#10B981';
const TEAL     = '#0D9488';
const LIME     = '#34D399';

export default function GrowthIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const doneRef   = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markGrowthIntroSeen();
    setPhase(6);
    setTimeout(onDone, 700);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Rising bars — growth chart
    const BAR_COUNT = 24;
    const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
      targetH: 0.1 + (i / BAR_COUNT) * 0.6 + Math.random() * 0.2,
      currentH: 0,
      speed: 0.012 + Math.random() * 0.018,
      color: i > BAR_COUNT * 0.7 ? LIME : i > BAR_COUNT * 0.4 ? EMERALD : TEAL,
    }));

    // Floating data particles
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: -0.0005 - Math.random() * 0.001,
      size: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.4,
      symbol: ['$', '%', '↑', '+', '▲', '•'][Math.floor(Math.random() * 6)],
    }));

    // Trend line points (builds over time)
    const trendPoints = Array.from({ length: 12 }, (_, i) => ({
      x: 0.12 + (i / 11) * 0.76,
      y: 0.75 - (i / 11) * 0.35 - Math.random() * 0.05,
    }));

    let t = 0;
    let barsReady = false;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      if (elapsed > 300  && phase < 1) setPhase(1);
      if (elapsed > 900  && phase < 2) setPhase(2);
      if (elapsed > 1800 && phase < 3) setPhase(3);
      if (elapsed > 3000 && phase < 4) setPhase(4);
      if (elapsed > 4200 && phase < 5) setPhase(5);
      if (elapsed > 5400) { finish(); return; }

      // Background
      ctx.fillStyle = '#020C07';
      ctx.fillRect(0, 0, W, H);

      // Ambient glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
      grd.addColorStop(0, 'rgba(16,185,129,0.07)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── DATA PARTICLES ──
      if (elapsed > 200) {
        const pp = Math.min((elapsed - 200) / 600, 1);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
          if (p.x < 0 || p.x > 1) p.vx *= -1;

          if (p.symbol === '•') {
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16,185,129,${p.alpha * pp})`;
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(52,211,153,${p.alpha * 0.5 * pp})`;
            ctx.font = `${10 + p.size * 2}px monospace`;
            ctx.fillText(p.symbol, p.x * W, p.y * H);
          }
        });
      }

      // ── RISING BARS ──
      if (elapsed > 600) {
        const barProg = Math.min((elapsed - 600) / 1000, 1);
        const totalW  = Math.min(W * 0.6, 500);
        const barW    = totalW / BAR_COUNT;
        const barGap  = barW * 0.2;
        const startX  = cx - totalW / 2;
        const baseY   = cy + H * 0.22;
        const maxH    = H * 0.38;

        barsReady = true;
        ctx.save();
        bars.forEach((b, i) => {
          const target = b.targetH * maxH * barProg;
          if (b.currentH < target) b.currentH = Math.min(b.currentH + target * b.speed * 2, target);

          const pulse = 1 + 0.03 * Math.sin(t * 1.5 + i * 0.4);
          const h = b.currentH * pulse;
          const x = startX + i * barW + barGap / 2;
          const w = barW - barGap;

          const bg = ctx.createLinearGradient(0, baseY - h, 0, baseY);
          bg.addColorStop(0, `${b.color}EE`);
          bg.addColorStop(0.6, `${b.color}99`);
          bg.addColorStop(1, `${b.color}22`);

          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.roundRect(x, baseY - h, w, h, [3, 3, 0, 0]);
          ctx.fill();

          // Glow cap
          const capGrd = ctx.createRadialGradient(x + w / 2, baseY - h, 0, x + w / 2, baseY - h, w);
          capGrd.addColorStop(0, `${b.color}80`);
          capGrd.addColorStop(1, 'transparent');
          ctx.fillStyle = capGrd;
          ctx.fillRect(x - 4, baseY - h - 4, w + 8, 8);
        });

        // Grid lines
        for (let g = 1; g <= 4; g++) {
          const gy = baseY - (maxH * barProg * g) / 4;
          ctx.strokeStyle = 'rgba(16,185,129,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(startX - 10, gy);
          ctx.lineTo(startX + totalW + 10, gy);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── TREND LINE ──
      if (elapsed > 1600 && barsReady) {
        const tp = Math.min((elapsed - 1600) / 700, 1);
        const totalW = Math.min(W * 0.6, 500);
        const baseY  = cy + H * 0.22;
        const maxH   = H * 0.38;
        const startX = cx - totalW / 2;
        const pointsToShow = Math.ceil(tp * trendPoints.length);

        ctx.save();
        ctx.beginPath();
        trendPoints.slice(0, pointsToShow).forEach((p, i) => {
          const px = startX + p.x * totalW;
          const py = baseY - p.y * maxH;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = LIME;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.shadowColor = LIME;
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Dot at end
        if (pointsToShow > 0) {
          const last = trendPoints[pointsToShow - 1];
          const px = startX + last.x * totalW;
          const py = baseY - last.y * maxH;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = LIME;
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [finish]);

  const titleVisible = phase >= 3;
  const tagVisible   = phase >= 4;
  const exiting      = phase >= 5;

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer',
        background: '#020C07',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.6s ease' : 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }}/>

      {/* Title */}
      <div style={{
        position: 'absolute', top: '18%', left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 600,
      }}>
        <div style={{
          fontSize: 'clamp(10px, 1.2vw, 13px)',
          letterSpacing: '0.45em',
          color: LIME,
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: 8,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          EOF
        </div>
        <div style={{
          fontSize: 'clamp(22px, 4.5vw, 52px)',
          fontWeight: 900,
          letterSpacing: '-0.01em',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          textShadow: `0 0 60px ${EMERALD}44`,
        }}>
          Growth Intelligence
        </div>
        <div style={{
          width: 100, height: 2,
          background: `linear-gradient(90deg, transparent, ${EMERALD}, transparent)`,
          margin: '14px auto 0',
          opacity: titleVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}/>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', bottom: '20%', left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none',
        opacity: tagVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <p style={{
          fontSize: 'clamp(12px, 1.6vw, 18px)',
          color: LIME,
          margin: 0,
          letterSpacing: '0.2em',
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif',
          textShadow: `0 0 20px ${EMERALD}44`,
        }}>
          FIND · GROW · DOMINATE
        </p>
      </div>

      {/* Skip */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10, color: 'rgba(16,185,129,0.35)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        pointerEvents: 'none',
        opacity: phase >= 1 ? 0.7 : 0,
        transition: 'opacity 1s',
      }}>
        Click to skip
      </div>
    </div>
  );
}

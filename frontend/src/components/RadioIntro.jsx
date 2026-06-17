import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'radio-intro-seen';
export const hasSeenRadioIntro = () => sessionStorage.getItem(SESSION_KEY) === 'true';
export const markRadioIntroSeen = () => sessionStorage.setItem(SESSION_KEY, 'true');

const ACCENT = '#22D3EE';

export default function RadioIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ phase: 0, tick: 0, done: false });
  const animRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const finish = () => {
    if (stateRef.current.done) return;
    stateRef.current.done = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    markRadioIntroSeen();
    onDone();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Floating frequency dots
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.4 + 0.1,
    }));

    // EQ bars
    const BAR_COUNT = 24;
    const barHeights = Array.from({ length: BAR_COUNT }, () => 0.1 + Math.random() * 0.4);
    const barTargets = Array.from({ length: BAR_COUNT }, () => 0.1 + Math.random() * 0.5);

    const draw = () => {
      const t = stateRef.current.tick;
      stateRef.current.tick++;
      const phase = stateRef.current.phase;

      ctx.clearRect(0, 0, W(), H());
      ctx.fillStyle = '#010A0C';
      ctx.fillRect(0, 0, W(), H());

      // Radial glow from center
      const cX = W() / 2, cY = H() / 2;
      if (phase >= 1) {
        const glow = ctx.createRadialGradient(cX, cY, 0, cX, cY, W() * 0.5);
        glow.addColorStop(0, 'rgba(34,211,238,0.12)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W(), H());
      }

      // Floating dots
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W(); if (d.x > W()) d.x = 0;
        if (d.y < 0) d.y = H(); if (d.y > H()) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${d.a * 0.5})`;
        ctx.fill();
      });

      // Radio wave rings — emanating from center
      if (phase >= 1) {
        const numRings = 8;
        for (let i = 0; i < numRings; i++) {
          const progress = ((t * 0.8 + i * 30) % 240) / 240;
          const r = progress * W() * 0.55;
          const alpha = (1 - progress) * 0.6;
          if (alpha <= 0) continue;
          ctx.beginPath();
          ctx.arc(cX, cY, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
          ctx.lineWidth = 2 - progress * 1.5;
          ctx.stroke();
        }

        // Inner circle icon — microphone shape
        const icR = Math.min(W(), H()) * 0.07;
        // mic body
        ctx.beginPath();
        ctx.roundRect(cX - icR * 0.35, cY - icR * 0.7, icR * 0.7, icR * 1.1, icR * 0.25);
        ctx.fillStyle = 'rgba(34,211,238,0.15)';
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // mic stand
        ctx.beginPath();
        ctx.arc(cX, cY + icR * 0.5, icR * 0.55, Math.PI, 0);
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cX, cY + icR * 1.0);
        ctx.lineTo(cX, cY + icR * 1.4);
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cX - icR * 0.4, cY + icR * 1.4);
        ctx.lineTo(cX + icR * 0.4, cY + icR * 1.4);
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // ON AIR dot
        const dotPulse = 0.5 + 0.5 * Math.sin(t * 0.15);
        ctx.beginPath();
        ctx.arc(cX + icR * 0.65, cY - icR * 0.6, icR * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,68,68,${0.7 + dotPulse * 0.3})`;
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 10 * dotPulse;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // EQ bars at bottom
      if (phase >= 2) {
        const barW = W() * 0.008;
        const barGap = W() * 0.004;
        const totalWidth = BAR_COUNT * (barW + barGap) - barGap;
        const startX = (W() - totalWidth) / 2;
        const baseY = H() * 0.85;
        const maxBarH = H() * 0.08;

        barHeights.forEach((h, i) => {
          // Animate toward target
          barTargets[i] += (Math.random() - 0.5) * 0.05;
          barTargets[i] = Math.max(0.05, Math.min(1, barTargets[i]));
          barHeights[i] += (barTargets[i] - barHeights[i]) * 0.15;

          const bh = h * maxBarH * (0.6 + 0.4 * Math.sin(t * 0.1 + i * 0.4));
          const bx = startX + i * (barW + barGap);
          const by = baseY - bh;

          const barGrad = ctx.createLinearGradient(bx, by, bx, baseY);
          barGrad.addColorStop(0, ACCENT);
          barGrad.addColorStop(1, 'rgba(34,211,238,0.2)');
          ctx.fillStyle = barGrad;
          ctx.fillRect(bx, by, barW, bh);
        });

        // Frequency label
        ctx.fillStyle = 'rgba(34,211,238,0.35)';
        ctx.font = `bold ${Math.min(W(), H()) * 0.018}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`${(88.5 + Math.sin(t * 0.01) * 0.1).toFixed(1)} FM`, W() / 2, H() * 0.92);
      }

      if (t === 15) { stateRef.current.phase = 1; }
      if (t === 50) { stateRef.current.phase = 2; setShowText(true); }
      if (t === 85) setShowSub(true);
      if (t >= 210) finish();

      if (!stateRef.current.done) animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      onClick={finish}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#010A0C' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{
          fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, letterSpacing: '0.06em',
          fontFamily: 'system-ui, sans-serif', color: '#fff', textTransform: 'uppercase',
          textShadow: `0 0 40px ${ACCENT}, 0 0 80px ${ACCENT}44`,
          opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          marginTop: '18vh',
        }}>
          EOF Radio
        </div>
        <div style={{
          fontSize: 'clamp(12px, 1.8vw, 18px)', fontWeight: 700, letterSpacing: '0.3em',
          fontFamily: 'system-ui, sans-serif', color: ACCENT, textTransform: 'uppercase', marginTop: 10,
          opacity: showSub ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          The Sound of Now.
        </div>
        <div style={{ color: 'rgba(34,211,238,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', marginTop: 28, textTransform: 'uppercase', opacity: showSub ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}>
          Click to skip
        </div>
      </div>
    </div>
  );
}

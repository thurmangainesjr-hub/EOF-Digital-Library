import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'streaming-intro-seen';
export const hasSeenStreamingIntro = () => sessionStorage.getItem(SESSION_KEY) === 'true';
export const markStreamingIntroSeen = () => sessionStorage.setItem(SESSION_KEY, 'true');

const ACCENT = '#6366F1';

export default function StreamingIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ phase: 0, tick: 0, done: false });
  const animRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const finish = () => {
    if (stateRef.current.done) return;
    stateRef.current.done = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    markStreamingIntroSeen();
    onDone();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Scanline particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.1,
    }));

    // TV screens data
    const screens = [];
    const cols = 4, rows = 3;
    const makeScreens = () => {
      screens.length = 0;
      const sw = W() * 0.18, sh = sw * 0.6;
      const gapX = (W() - cols * sw) / (cols + 1);
      const gapY = (H() - rows * sh) / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          screens.push({
            x: gapX + c * (sw + gapX),
            y: gapY + r * (sh + gapY),
            w: sw, h: sh,
            delay: (r * cols + c) * 8,
            color: ['#6366F1', '#818CF8', '#4F46E5', '#06B6D4', '#A78BFA', '#EC4899',
                    '#6366F1', '#818CF8', '#4F46E5', '#06B6D4', '#A78BFA', '#EC4899'][r * cols + c],
            channel: (r * cols + c + 1),
            opacity: 0,
          });
        }
      }
    };
    makeScreens();

    // Signal burst rings
    const rings = [];
    const addRing = () => rings.push({ r: 0, maxR: Math.max(W(), H()) * 0.7, a: 0.7 });

    let ringTimer = 0;

    const draw = () => {
      const t = stateRef.current.tick;
      stateRef.current.tick++;
      const phase = stateRef.current.phase;

      ctx.clearRect(0, 0, W(), H());

      // Dark bg
      ctx.fillStyle = '#05050F';
      ctx.fillRect(0, 0, W(), H());

      // Scanline grid overlay
      ctx.strokeStyle = 'rgba(99,102,241,0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W(); x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H()); ctx.stroke();
      }
      for (let y = 0; y < H(); y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W(), y); ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H();
        if (p.y > H()) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.a * 0.6})`;
        ctx.fill();
      });

      // TV screens — draw in
      if (phase >= 1) {
        screens.forEach((s, i) => {
          const age = t - 20 - s.delay;
          if (age < 0) return;
          s.opacity = Math.min(1, age / 20);

          const alpha = s.opacity;
          ctx.save();
          ctx.globalAlpha = alpha;

          // screen bg with static
          const staticNoise = (t + i * 13) % 4;
          ctx.fillStyle = staticNoise < 1 ? '#0D0D1A' : '#070714';
          ctx.beginPath();
          ctx.roundRect(s.x, s.y, s.w, s.h, 8);
          ctx.fill();

          // border glow
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 10 * alpha;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // scan line
          if (t % 60 < 30) {
            const scanY = s.y + ((t * 2 + i * 20) % s.h);
            const scanGrad = ctx.createLinearGradient(s.x, scanY - 4, s.x, scanY + 4);
            scanGrad.addColorStop(0, 'transparent');
            scanGrad.addColorStop(0.5, s.color + '44');
            scanGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(s.x, scanY - 4, s.w, 8);
          }

          // channel number
          ctx.fillStyle = s.color;
          ctx.font = `bold ${s.w * 0.08}px monospace`;
          ctx.textAlign = 'right';
          ctx.fillText(`CH ${String(s.channel).padStart(2, '0')}`, s.x + s.w - 8, s.y + 18);

          // center play triangle
          if (age > 30) {
            const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
            const sz = s.w * 0.12;
            ctx.fillStyle = s.color + '99';
            ctx.beginPath();
            ctx.moveTo(cx - sz, cy - sz * 0.85);
            ctx.lineTo(cx - sz, cy + sz * 0.85);
            ctx.lineTo(cx + sz * 1.1, cy);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // Signal rings from center
      if (phase >= 2) {
        ringTimer++;
        if (ringTimer % 30 === 0) addRing();
        rings.forEach((ring, i) => {
          ring.r += 4;
          ring.a -= 0.008;
          if (ring.a <= 0) { rings.splice(i, 1); return; }
          ctx.beginPath();
          ctx.arc(W() / 2, H() / 2, ring.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99,102,241,${ring.a})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Advance phases
      if (t === 10) { stateRef.current.phase = 1; makeScreens(); }
      if (t === 40) { stateRef.current.phase = 2; setShowText(true); }
      if (t === 80) setShowSub(true);
      if (t >= 200) finish();

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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#05050F' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{
          fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, letterSpacing: '0.06em',
          fontFamily: 'system-ui, sans-serif', color: '#fff', textTransform: 'uppercase',
          textShadow: `0 0 40px ${ACCENT}, 0 0 80px ${ACCENT}55`,
          opacity: showText ? 1 : 0, transform: showText ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          EOF Streaming
        </div>
        <div style={{
          fontSize: 'clamp(12px, 2vw, 20px)', fontWeight: 700, letterSpacing: '0.25em',
          fontFamily: 'system-ui, sans-serif', color: ACCENT, textTransform: 'uppercase', marginTop: 12,
          opacity: showSub ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          Content Without Limits.
        </div>
        <div style={{ color: 'rgba(99,102,241,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', marginTop: 32, textTransform: 'uppercase', opacity: showSub ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}>
          Click to skip
        </div>
      </div>
    </div>
  );
}

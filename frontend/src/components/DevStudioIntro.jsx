import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'dev-studio-intro-seen';
export const hasSeenDevStudioIntro = () => sessionStorage.getItem(SESSION_KEY) === 'true';
export const markDevStudioIntroSeen = () => sessionStorage.setItem(SESSION_KEY, 'true');

const ACCENT = '#06B6D4';

export default function DevStudioIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ phase: 0, tick: 0, done: false });
  const animRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const finish = () => {
    if (stateRef.current.done) return;
    stateRef.current.done = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    markDevStudioIntroSeen();
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

    // Floating code particles
    const CODE_CHARS = ['<', '>', '{', '}', '()', '=>', '[]', '01', '//'];
    const codeParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.3 + 0.05,
      size: Math.random() * 10 + 8,
    }));

    // Grid dots
    const dots = [];
    const spacing = 50;

    // Circuit trace lines
    const traces = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      length: 60 + Math.random() * 120,
      horizontal: Math.random() > 0.5,
      progress: 0,
      speed: 0.02 + Math.random() * 0.03,
      a: 0.2 + Math.random() * 0.4,
    }));

    // Terminal cursor blink
    let cursorVisible = true;

    const draw = () => {
      const t = stateRef.current.tick;
      stateRef.current.tick++;
      const phase = stateRef.current.phase;

      ctx.clearRect(0, 0, W(), H());
      ctx.fillStyle = '#020C10';
      ctx.fillRect(0, 0, W(), H());

      const cX = W() / 2, cY = H() / 2;

      // Dot grid
      ctx.fillStyle = `rgba(6,182,212,0.06)`;
      for (let x = 0; x < W(); x += spacing) {
        for (let y = 0; y < H(); y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Circuit traces
      if (phase >= 1) {
        traces.forEach(trace => {
          trace.progress = Math.min(1, trace.progress + trace.speed);
          const len = trace.length * trace.progress;
          ctx.strokeStyle = `rgba(6,182,212,${trace.a * trace.progress})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(trace.x, trace.y);
          if (trace.horizontal) ctx.lineTo(trace.x + len, trace.y);
          else ctx.lineTo(trace.x, trace.y + len);
          ctx.stroke();

          // Endpoint dot
          if (trace.progress > 0.9) {
            ctx.beginPath();
            ctx.arc(trace.x + (trace.horizontal ? len : 0), trace.y + (trace.horizontal ? 0 : len), 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6,182,212,${trace.a})`;
            ctx.shadowColor = ACCENT;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // Floating code characters
      codeParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(6,182,212,${p.a})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      // Central terminal window
      if (phase >= 1) {
        const tw = Math.min(W() * 0.38, 420);
        const th = tw * 0.55;
        const tx = cX - tw / 2;
        const ty = cY - th / 2 - 20;

        // Window bg
        ctx.fillStyle = '#050D10';
        ctx.strokeStyle = `rgba(6,182,212,0.55)`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, th, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Title bar
        ctx.fillStyle = 'rgba(6,182,212,0.12)';
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, 28, [8, 8, 0, 0]);
        ctx.fill();

        // Traffic dots
        ['#EF4444', '#F59E0B', '#22C55E'].forEach((c, i) => {
          ctx.beginPath();
          ctx.arc(tx + 14 + i * 16, ty + 14, 5, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
        });

        // Terminal text — typed lines
        const AGENT_COUNT = 30;
        const lines = [
          `> initializing EOF Dev Studio...`,
          `> loading AI dev team...`,
          `> ${AGENT_COUNT} agents ready`,
          `> system online ▊`,
        ];

        ctx.font = `${tw * 0.034}px monospace`;
        ctx.textBaseline = 'top';
        const lineH = tw * 0.09;
        lines.forEach((line, i) => {
          const lineAge = t - 30 - i * 20;
          if (lineAge < 0) return;
          const chars = Math.floor(lineAge * 1.5);
          const displayed = i < lines.length - 1 ? line.slice(0, chars) : line.slice(0, -1) + (cursorVisible ? '▊' : ' ');
          ctx.fillStyle = i === lines.length - 1 ? ACCENT : 'rgba(6,182,212,0.65)';
          ctx.fillText(displayed, tx + 14, ty + 36 + i * lineH);
        });
      }

      // Cursor blink
      if (t % 30 === 0) cursorVisible = !cursorVisible;

      // Cyan radial pulse
      if (phase >= 2) {
        const pulseFade = 0.5 + 0.5 * Math.sin(t * 0.1);
        const glow = ctx.createRadialGradient(cX, cY, 0, cX, cY, W() * 0.4);
        glow.addColorStop(0, `rgba(6,182,212,${0.06 * pulseFade})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W(), H());
      }

      if (t === 15) stateRef.current.phase = 1;
      if (t === 60) { stateRef.current.phase = 2; setShowText(true); }
      if (t === 95) setShowSub(true);
      if (t >= 220) finish();

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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#020C10' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{
          fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 900, letterSpacing: '0.06em',
          fontFamily: 'monospace', color: '#fff', textTransform: 'uppercase',
          textShadow: `0 0 40px ${ACCENT}, 0 0 80px rgba(6,182,212,0.4)`,
          opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          marginTop: '26vh',
        }}>
          EOF Dev Studios
        </div>
        <div style={{
          fontSize: 'clamp(11px, 1.6vw, 16px)', fontWeight: 700, letterSpacing: '0.3em',
          fontFamily: 'monospace', color: ACCENT, textTransform: 'uppercase', marginTop: 12,
          opacity: showSub ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          Build the Future. Ship the Vision.
        </div>
        <div style={{ color: 'rgba(6,182,212,0.38)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', marginTop: 28, textTransform: 'uppercase', opacity: showSub ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}>
          Click to skip
        </div>
      </div>
    </div>
  );
}

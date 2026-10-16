import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'blist-intro-seen';
export const hasSeenBListIntro = () => sessionStorage.getItem(SESSION_KEY) === 'true';
export const markBListIntroSeen = () => sessionStorage.setItem(SESSION_KEY, 'true');

const ACCENT = '#EC4899';

export default function BListIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ phase: 0, tick: 0, done: false });
  const animRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const finish = () => {
    if (stateRef.current.done) return;
    stateRef.current.done = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    markBListIntroSeen();
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

    // Floating sparkle particles
    const sparkles = Array.from({ length: 100 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 1,
      vy: -(Math.random() * 0.8 + 0.2),
      r: Math.random() * 2.5 + 0.5,
      a: Math.random() * 0.6 + 0.2,
      life: Math.random() * 100,
    }));

    // Stars for rating display
    const starPositions = [];
    const NUM_STARS = 5;

    // Spotlight sweep
    let spotlightX = -200;

    const drawStar = (cx, cy, r, filled, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const ang = (i * Math.PI) / 5 - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.4;
        if (i === 0) ctx.moveTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
        else ctx.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
      }
      ctx.closePath();
      if (filled) {
        ctx.fillStyle = ACCENT;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 12;
        ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(236,72,153,0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    };

    const draw = () => {
      const t = stateRef.current.tick;
      stateRef.current.tick++;
      const phase = stateRef.current.phase;

      ctx.clearRect(0, 0, W(), H());
      ctx.fillStyle = '#0C0310';
      ctx.fillRect(0, 0, W(), H());

      const cX = W() / 2, cY = H() / 2;

      // Pink ambient glow
      const amb = ctx.createRadialGradient(cX, cY, 0, cX, cY, W() * 0.5);
      amb.addColorStop(0, 'rgba(236,72,153,0.08)');
      amb.addColorStop(1, 'transparent');
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W(), H());

      // Sparkles rising
      sparkles.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.y < 0 || s.life > 200) {
          s.x = Math.random() * W();
          s.y = H() + 10;
          s.life = 0;
        }
        const fade = Math.sin((s.life / 200) * Math.PI);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,72,153,${s.a * fade * 0.7})`;
        ctx.fill();
      });

      // Spotlight sweep
      if (phase >= 1) {
        spotlightX += 3;
        if (spotlightX > W() + 200) spotlightX = -200;
        const spot = ctx.createLinearGradient(spotlightX - 100, 0, spotlightX + 100, H());
        spot.addColorStop(0, 'transparent');
        spot.addColorStop(0.4, 'rgba(236,72,153,0.04)');
        spot.addColorStop(0.5, 'rgba(236,72,153,0.08)');
        spot.addColorStop(0.6, 'rgba(236,72,153,0.04)');
        spot.addColorStop(1, 'transparent');
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, W(), H());
      }

      // Magazine layout lines
      if (phase >= 1) {
        ctx.strokeStyle = 'rgba(236,72,153,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const lx = W() * (0.25 + i * 0.25);
          ctx.beginPath();
          ctx.moveTo(lx, 0);
          ctx.lineTo(lx, H());
          ctx.stroke();
        }
      }

      // Star ratings appear
      if (phase >= 2) {
        const starR = Math.min(W(), H()) * 0.042;
        const starGap = starR * 2.6;
        const totalW = NUM_STARS * starGap - starGap * 0.3;
        const startX = cX - totalW / 2 + starR;
        const starY = H() * 0.38;

        for (let i = 0; i < NUM_STARS; i++) {
          const delay = (t - 60) - i * 8;
          if (delay < 0) continue;
          const alpha = Math.min(1, delay / 12);
          const filled = i < 4;
          const sx = startX + i * starGap;
          drawStar(sx, starY, starR * alpha, filled, alpha);
        }
      }

      // "B" lettermark
      if (phase >= 1) {
        const bAlpha = Math.min(0.12, ((t - 15) / 40) * 0.12);
        ctx.font = `bold ${Math.min(W(), H()) * 0.55}px Georgia, serif`;
        ctx.fillStyle = `rgba(236,72,153,${bAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', cX, cY);
      }

      if (t === 15) stateRef.current.phase = 1;
      if (t === 55) { stateRef.current.phase = 2; setShowText(true); }
      if (t === 90) setShowSub(true);
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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#0C0310' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{
          fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 900, letterSpacing: '0.04em',
          fontFamily: 'Georgia, serif', color: '#fff',
          textShadow: `0 0 40px ${ACCENT}, 0 0 80px rgba(236,72,153,0.4)`,
          opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          marginTop: '14vh',
        }}>
          The B List
        </div>
        <div style={{
          fontSize: 'clamp(11px, 1.6vw, 17px)', fontWeight: 600, letterSpacing: '0.25em',
          fontFamily: 'system-ui, sans-serif', color: ACCENT, textTransform: 'uppercase', marginTop: 12,
          opacity: showSub ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          Hidden Gems. Unapologetic Taste.
        </div>
        <div style={{ color: 'rgba(236,72,153,0.38)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', marginTop: 30, textTransform: 'uppercase', opacity: showSub ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}>
          Click to skip
        </div>
      </div>
    </div>
  );
}

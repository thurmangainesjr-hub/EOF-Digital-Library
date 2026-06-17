import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'akashic-intro-seen';
export const hasSeenAkashicIntro = () => sessionStorage.getItem(SESSION_KEY) === 'true';
export const markAkashicIntroSeen = () => sessionStorage.setItem(SESSION_KEY, 'true');

const ACCENT = '#2DD4BF';

export default function AkashicIntro({ onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ phase: 0, tick: 0, done: false });
  const animRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const finish = () => {
    if (stateRef.current.done) return;
    stateRef.current.done = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    markAkashicIntroSeen();
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

    // Star field
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // Orbiting particles
    const orbiters = Array.from({ length: 40 }, (_, i) => ({
      angle: (i / 40) * Math.PI * 2,
      orbitR: 80 + Math.random() * 160,
      speed: 0.005 + Math.random() * 0.01,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.6 + 0.3,
    }));

    // Sacred geometry — concentric rings
    const NUM_RINGS = 6;

    const draw = () => {
      const t = stateRef.current.tick;
      stateRef.current.tick++;
      const phase = stateRef.current.phase;

      ctx.clearRect(0, 0, W(), H());
      ctx.fillStyle = '#01080A';
      ctx.fillRect(0, 0, W(), H());

      const cX = W() / 2, cY = H() / 2;

      // Stars twinkling
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.03 + s.twinkle);
        ctx.beginPath();
        ctx.arc(s.x % W(), s.y % H(), s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,212,191,${s.a * tw * 0.6})`;
        ctx.fill();
      });

      // Deep radial ambient
      const amb = ctx.createRadialGradient(cX, cY, 0, cX, cY, Math.min(W(), H()) * 0.6);
      amb.addColorStop(0, 'rgba(13,148,136,0.15)');
      amb.addColorStop(0.5, 'rgba(45,212,191,0.04)');
      amb.addColorStop(1, 'transparent');
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W(), H());

      // Concentric sacred rings
      if (phase >= 1) {
        const maxR = Math.min(W(), H()) * 0.4;
        for (let i = 0; i < NUM_RINGS; i++) {
          const age = t - 20 - i * 12;
          if (age < 0) continue;
          const drawProgress = Math.min(1, age / 40);
          const ringR = ((i + 1) / NUM_RINGS) * maxR;
          const alpha = 0.15 + (i === 0 ? 0.3 : 0) + 0.05 * drawProgress;

          ctx.beginPath();
          ctx.arc(cX, cY, ringR, 0, Math.PI * 2 * drawProgress);
          ctx.strokeStyle = `rgba(45,212,191,${alpha})`;
          ctx.lineWidth = i === 0 ? 1.5 : 0.8;
          ctx.stroke();

          // Tick marks on rings
          if (drawProgress > 0.5) {
            const numTicks = 12 + i * 6;
            for (let j = 0; j < numTicks; j++) {
              const angle = (j / numTicks) * Math.PI * 2 + t * 0.002 * (i % 2 === 0 ? 1 : -1);
              const inner = ringR - 4;
              const outer = ringR + 2;
              ctx.beginPath();
              ctx.moveTo(cX + Math.cos(angle) * inner, cY + Math.sin(angle) * inner);
              ctx.lineTo(cX + Math.cos(angle) * outer, cY + Math.sin(angle) * outer);
              ctx.strokeStyle = `rgba(45,212,191,${alpha * 1.5})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // Orbiting particles
      if (phase >= 2) {
        orbiters.forEach(o => {
          o.angle += o.speed;
          const px = cX + Math.cos(o.angle) * o.orbitR;
          const py = cY + Math.sin(o.angle) * o.orbitR;
          ctx.beginPath();
          ctx.arc(px, py, o.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(45,212,191,${o.a})`;
          ctx.fill();
        });
      }

      // Tree of life — glowing lines from center
      if (phase >= 2) {
        const treeAlpha = Math.min(1, (t - 60) / 40);
        const treeH = Math.min(W(), H()) * 0.18;
        const treeBranches = [
          { x1: 0, y1: 0, x2: 0, y2: -treeH },
          { x1: 0, y1: -treeH * 0.4, x2: -treeH * 0.45, y2: -treeH * 0.75 },
          { x1: 0, y1: -treeH * 0.4, x2: treeH * 0.45, y2: -treeH * 0.75 },
          { x1: 0, y1: -treeH * 0.15, x2: -treeH * 0.6, y2: -treeH * 0.45 },
          { x1: 0, y1: -treeH * 0.15, x2: treeH * 0.6, y2: -treeH * 0.45 },
          { x1: 0, y1: 0, x2: -treeH * 0.3, y2: -treeH * 0.25 },
          { x1: 0, y1: 0, x2: treeH * 0.3, y2: -treeH * 0.25 },
        ];

        ctx.save();
        ctx.translate(cX, cY + treeH * 0.2);
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 12 * treeAlpha;

        treeBranches.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(b.x1, b.y1);
          ctx.lineTo(b.x2, b.y2);
          ctx.strokeStyle = `rgba(45,212,191,${treeAlpha * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Leaf dot at tip
          ctx.beginPath();
          ctx.arc(b.x2, b.y2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(45,212,191,${treeAlpha})`;
          ctx.fill();
        });
        ctx.restore();
      }

      // Central glowing orb
      if (phase >= 1) {
        const orb = ctx.createRadialGradient(cX, cY, 0, cX, cY, 30);
        orb.addColorStop(0, 'rgba(45,212,191,0.9)');
        orb.addColorStop(0.5, 'rgba(45,212,191,0.3)');
        orb.addColorStop(1, 'transparent');
        ctx.fillStyle = orb;
        ctx.beginPath();
        ctx.arc(cX, cY, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t === 10) stateRef.current.phase = 1;
      if (t === 50) { stateRef.current.phase = 2; setShowText(true); }
      if (t === 90) setShowSub(true);
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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#01080A' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{
          fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 700, letterSpacing: '0.08em',
          fontFamily: 'Georgia, serif', color: '#fff',
          textShadow: `0 0 40px ${ACCENT}, 0 0 80px rgba(45,212,191,0.4)`,
          opacity: showText ? 1 : 0, transform: showText ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          marginTop: '24vh',
        }}>
          Akashic Records
        </div>
        <div style={{
          fontSize: 'clamp(12px, 1.6vw, 17px)', fontWeight: 400, letterSpacing: '0.2em',
          fontFamily: 'Georgia, serif', color: ACCENT, fontStyle: 'italic', marginTop: 12,
          opacity: showSub ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }}>
          The Memory of the World.
        </div>
        <div style={{ color: 'rgba(45,212,191,0.38)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', marginTop: 30, textTransform: 'uppercase', opacity: showSub ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}>
          Click to skip
        </div>
      </div>
    </div>
  );
}

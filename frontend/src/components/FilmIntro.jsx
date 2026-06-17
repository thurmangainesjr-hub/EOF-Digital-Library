import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function hasSeenFilmIntro() {
  return sessionStorage.getItem('film-studio-intro') === '1';
}

export function markFilmIntroSeen() {
  sessionStorage.setItem('film-studio-intro', '1');
}

export default function FilmIntro({ onDone }) {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const [phase, setPhase]     = useState(0);
  const [visible, setVisible] = useState(true);
  const [count, setCount]     = useState(null); // 3, 2, 1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Film grain particles
    const GRAIN = Array.from({ length: 3000 }, () => ({
      x: Math.random(),
      y: Math.random(),
      a: Math.random(),
    }));

    // Projector dust motes
    const MOTES = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 0.4 - 0.1,
      a: Math.random() * 0.5 + 0.1,
    }));

    let startTime = null;
    let grainAlpha = 0;
    let beamAlpha  = 0;

    function draw(ts) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;

      ctx.clearRect(0, 0, W, H);

      // Base black
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // Film grain
      grainAlpha = Math.min(0.06, t * 0.02);
      if (grainAlpha > 0) {
        GRAIN.forEach(g => {
          // Randomly refresh grain each frame
          if (Math.random() < 0.3) {
            g.x = Math.random();
            g.y = Math.random();
            g.a = Math.random();
          }
          ctx.fillStyle = `rgba(255,255,255,${g.a * grainAlpha})`;
          ctx.fillRect(g.x * W, g.y * H, 1, 1);
        });
      }

      // Horizontal scan line (CRT flicker)
      if (t > 0.5 && Math.random() < 0.05) {
        const sy = Math.random() * H;
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(0, sy, W, 1);
      }

      // Projector beam (from top center, fan out)
      if (t > 2.5) {
        beamAlpha = Math.min(0.18, (t - 2.5) * 0.06);
        const cx = W / 2;
        const grad = ctx.createLinearGradient(cx, 0, cx, H);
        grad.addColorStop(0, `rgba(239,68,68,${beamAlpha * 2})`);
        grad.addColorStop(0.3, `rgba(239,68,68,${beamAlpha})`);
        grad.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx - W * 0.45, H);
        ctx.lineTo(cx + W * 0.45, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // Dust motes in beam
        MOTES.forEach(m => {
          m.x  += m.vx;
          m.y  += m.vy;
          if (m.y < -10) { m.y = H + 10; m.x = W * 0.5 + (Math.random() - 0.5) * W * 0.8; }
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,200,${m.a * beamAlpha * 4})`;
          ctx.fill();
        });
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    // Phase + countdown timing
    const t0 = setTimeout(() => setPhase(1), 400);
    const t1 = setTimeout(() => { setPhase(2); setCount(3); }, 1200);
    const t2 = setTimeout(() => setCount(2), 2000);
    const t3 = setTimeout(() => setCount(1), 2800);
    const t4 = setTimeout(() => { setCount(null); setPhase(3); }, 3600);
    const t5 = setTimeout(() => setPhase(4), 5200);
    const t6 = setTimeout(() => setPhase(5), 7000);
    const t7 = setTimeout(() => {
      setVisible(false);
      markFilmIntroSeen();
      setTimeout(() => onDone?.(), 600);
    }, 8000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      [t0,t1,t2,t3,t4,t5,t6,t7].forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="film-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', cursor: 'pointer',
          }}
          onClick={() => {
            setVisible(false);
            markFilmIntroSeen();
            setTimeout(() => onDone?.(), 400);
          }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>

          {/* Film leader circles — countdown */}
          <AnimatePresence mode="wait">
            {count !== null && (
              <motion.div
                key={count}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Outer ring */}
                <svg width={220} height={220} viewBox="0 0 220 220" style={{ position: 'absolute' }}>
                  <circle cx={110} cy={110} r={100} stroke="rgba(239,68,68,0.5)" strokeWidth={1.5} fill="none"/>
                  <circle cx={110} cy={110} r={85} stroke="rgba(239,68,68,0.25)" strokeWidth={1} fill="none"/>
                  <circle cx={110} cy={110} r={70} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} fill="none" strokeDasharray="4 8"/>
                  {/* Cross-hairs */}
                  <line x1={10} y1={110} x2={75} y2={110} stroke="rgba(239,68,68,0.4)" strokeWidth={1}/>
                  <line x1={145} y1={110} x2={210} y2={110} stroke="rgba(239,68,68,0.4)" strokeWidth={1}/>
                  <line x1={110} y1={10} x2={110} y2={75} stroke="rgba(239,68,68,0.4)" strokeWidth={1}/>
                  <line x1={110} y1={145} x2={110} y2={210} stroke="rgba(239,68,68,0.4)" strokeWidth={1}/>
                </svg>
                <span style={{
                  fontSize: 72, fontWeight: 900, color: '#EF4444',
                  fontFamily: 'serif', textShadow: '0 0 30px rgba(239,68,68,0.6)',
                  lineHeight: 1,
                }}>{count}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flash on countdown end */}
          <AnimatePresence>
            {phase === 3 && !count && (
              <motion.div
                initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ position: 'absolute', inset: 0, background: '#fff', pointerEvents: 'none', zIndex: 5 }}
              />
            )}
          </AnimatePresence>

          {/* Title card */}
          <AnimatePresence>
            {phase >= 3 && count === null && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
              >
                {/* Film strip accent */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      style={{ width: 22, height: 16, borderRadius: 2, background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.35)' }}/>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.12em' }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#EF4444', marginBottom: 14,
                  }}
                >
                  Griot · EOF Ecosystem
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{
                    fontSize: 48, fontWeight: 900, color: '#fff', margin: 0,
                    letterSpacing: '-0.02em', lineHeight: 1,
                    textShadow: '0 0 60px rgba(239,68,68,0.4)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Film Studio
                </motion.h1>

                {/* Red underline */}
                <motion.div
                  initial={{ width: 0 }} animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  style={{ height: 2, background: 'linear-gradient(90deg, transparent, #EF4444, transparent)', margin: '16px auto', maxWidth: 360 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tagline */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 28 }}
              >
                <p style={{
                  fontSize: 16, fontWeight: 600, color: '#9CA3AF',
                  margin: 0, letterSpacing: '0.06em',
                  fontFamily: 'Georgia, serif', fontStyle: 'italic',
                }}>
                  "Direct. Shoot. Edit. Release."
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16 }}>
                  {['Direction', 'Cinematography', 'Editing', 'Post', 'Distribution'].map((w, i) => (
                    <motion.span key={w}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      style={{ fontSize: 9, color: '#EF4444', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {w}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip hint */}
          <AnimatePresence>
            {phase >= 1 && phase < 5 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 3, fontSize: 10, color: '#6B7280', fontWeight: 500, letterSpacing: '0.08em', userSelect: 'none' }}
              >
                click to skip
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lens flare sweep */}
          <AnimatePresence>
            {phase >= 3 && count === null && (
              <motion.div
                initial={{ left: '-20%', opacity: 0 }}
                animate={{ left: '120%', opacity: [0, 0.4, 0] }}
                transition={{ delay: 0.6, duration: 1.2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 0, bottom: 0, width: '15%',
                  background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.15), rgba(255,255,255,0.08), transparent)',
                  transform: 'skewX(-15deg)',
                  pointerEvents: 'none', zIndex: 3,
                }}
              />
            )}
          </AnimatePresence>

          {/* Phase 5 — fade to black */}
          <AnimatePresence>
            {phase >= 5 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                style={{ position: 'absolute', inset: 0, background: '#000', pointerEvents: 'none', zIndex: 10 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

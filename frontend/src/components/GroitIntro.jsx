import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function hasSeenGroitIntro() {
  return sessionStorage.getItem('griot-story-intro') === '1';
}

export function markGroitIntroSeen() {
  sessionStorage.setItem('griot-story-intro', '1');
}

// Adinkra-inspired symbols drawn as SVG paths (simplified geometric)
const SYMBOLS = [
  // Gye Nyame (omnipotence) - simplified
  'M 0,-14 C 8,-10 14,-4 10,0 C 14,4 8,10 0,14 C -8,10 -14,4 -10,0 C -14,-4 -8,-10 0,-14 Z M 0,-6 L 4,0 L 0,6 L -4,0 Z',
  // Sankofa (return to roots) - simplified bird/heart
  'M -10,4 Q -10,-10 0,-10 Q 10,-10 10,4 Q 10,12 0,12 Q -10,12 -10,4 Z M -5,-4 L 0,2 L 5,-4',
  // Dwennimmen (strength) - ram horns
  'M -12,0 Q -12,-10 -6,-10 Q 0,-10 0,-4 Q 0,-10 6,-10 Q 12,-10 12,0 Q 12,8 6,8 L 0,4 L -6,8 Q -12,8 -12,0 Z',
  // Nkyinkyim (adaptability) - twisted cross
  'M -12,0 L -4,-8 L 0,-4 L 4,-8 L 12,0 L 4,8 L 0,4 L -4,8 Z',
  // Aya (fern / endurance)
  'M 0,-14 L 0,14 M -8,-8 Q -6,0 0,0 M 8,-8 Q 6,0 0,0 M -6,2 Q -4,8 0,8 M 6,2 Q 4,8 0,8',
];

export default function GroitIntro({ onDone }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const [phase, setPhase]   = useState(0); // 0=dark, 1=particles, 2=symbols, 3=logo, 4=tagline, 5=exit
  const [visible, setVisible] = useState(true);

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

    // Embers / ancestor particles
    const EMBER_COUNT = 180;
    const embers = Array.from({ length: EMBER_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.5 + 0.1),
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 60 + 250, // purple-violet range
      life: Math.random() * 200 + 50,
      maxLife: 250,
    }));

    // Ink wisps
    const WISP_COUNT = 12;
    const wisps = Array.from({ length: WISP_COUNT }, (_, i) => {
      const angle = (i / WISP_COUNT) * Math.PI * 2;
      const dist  = Math.random() * 200 + 300;
      return {
        angle,
        dist,
        cx: Math.cos(angle) * dist,
        cy: Math.sin(angle) * dist,
        progress: 0,
        speed: Math.random() * 0.004 + 0.003,
        width: Math.random() * 2.5 + 1,
        alpha: 0,
      };
    });

    let startTime = null;
    let globalAlpha = 0;
    let wispAlpha = 0;

    function draw(ts) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000; // seconds

      ctx.clearRect(0, 0, W, H);

      // Background
      const bgAlpha = Math.min(1, t / 0.5);
      ctx.fillStyle = `rgba(7,5,15,${bgAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // Embers (start after 0.3s)
      if (t > 0.3) {
        const emberFade = Math.min(1, (t - 0.3) / 1.2);
        embers.forEach(em => {
          em.x  += em.vx;
          em.y  += em.vy;
          em.life -= 1;
          if (em.life <= 0 || em.y < -20) {
            em.x     = Math.random() * W;
            em.y     = H + 10;
            em.life  = em.maxLife;
            em.hue   = Math.random() * 60 + 250;
            em.alpha = Math.random() * 0.5 + 0.1;
          }
          const a = em.alpha * emberFade * Math.min(1, em.life / 40);
          ctx.beginPath();
          ctx.arc(em.x, em.y, em.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${em.hue}, 90%, 75%, ${a})`;
          ctx.fill();
        });
      }

      // Ink wisps converging to center (start 2.5s)
      if (t > 2.5) {
        wispAlpha = Math.min(1, (t - 2.5) / 1.2);
        wisps.forEach(w => {
          w.progress = Math.min(1, w.progress + w.speed);
          const cx = W / 2, cy = H / 2;
          const sx = cx + w.cx, sy = cy + w.cy;
          const ex = cx, ey = cy;
          // Bezier curve from edge to center
          const bx = cx + w.cx * 0.3 + Math.cos(w.angle + Math.PI / 2) * 80;
          const by = cy + w.cy * 0.3 + Math.sin(w.angle + Math.PI / 2) * 80;
          const p  = w.progress;
          const qx = (1-p)*(1-p)*sx + 2*(1-p)*p*bx + p*p*ex;
          const qy = (1-p)*(1-p)*sy + 2*(1-p)*p*by + p*p*ey;

          const a = wispAlpha * Math.sin(p * Math.PI) * 0.7;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(bx, by, qx, qy);
          ctx.strokeStyle = `rgba(124,58,237,${a})`;
          ctx.lineWidth = w.width;
          ctx.stroke();
        });
      }

      // Central glow (builds from 3.5s)
      if (t > 3.5) {
        const glowAlpha = Math.min(0.7, (t - 3.5) / 1.5 * 0.7);
        const glowR = Math.min(200, (t - 3.5) / 1.5 * 200);
        const cx = W / 2, cy = H / 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        grad.addColorStop(0, `rgba(124,58,237,${glowAlpha})`);
        grad.addColorStop(0.4, `rgba(88,28,220,${glowAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(7,5,15,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    // Phase timing
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 4200);
    const t4 = setTimeout(() => setPhase(4), 6200);
    const t5 = setTimeout(() => setPhase(5), 8400);
    const t6 = setTimeout(() => {
      setVisible(false);
      markGroitIntroSeen();
      setTimeout(() => onDone?.(), 700);
    }, 9200);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="griot-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#07050F',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
          onClick={() => {
            setVisible(false);
            markGroitIntroSeen();
            setTimeout(() => onDone?.(), 500);
          }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>

          {/* Adinkra symbols ring */}
          <AnimatePresence>
            {phase >= 2 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {SYMBOLS.map((d, i) => {
                  const angle  = (i / SYMBOLS.length) * 360;
                  const radius = 160;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.svg
                      key={i}
                      width={32} height={32}
                      viewBox="-16 -16 32 32"
                      style={{ position: 'absolute', transform: `translate(${x - 16}px, ${y - 16}px)` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 0.8, 0.4], scale: [0, 1.2, 1] }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
                    >
                      <path d={d} stroke="#A78BFA" strokeWidth={1.2} fill="none" opacity={0.7}/>
                    </motion.svg>
                  );
                })}

                {/* Rotating ring */}
                <motion.svg
                  width={360} height={360} viewBox="0 0 360 360"
                  style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 0.4, rotate: 360 }}
                  transition={{ opacity: { duration: 1 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
                >
                  <circle cx={180} cy={180} r={170}
                    stroke="url(#ringGrad)" strokeWidth={0.8} fill="none" strokeDasharray="8 16"/>
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7C3AED"/>
                      <stop offset="50%" stopColor="#D4AF37"/>
                      <stop offset="100%" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
            )}
          </AnimatePresence>

          {/* Logo block */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
              >
                {/* Logo image or fallback */}
                <div style={{
                  width: 88, height: 88, borderRadius: 24,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(88,28,220,0.15))',
                  border: '2px solid rgba(124,58,237,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.2)',
                  fontSize: 44,
                }}>
                  🌀
                </div>

                <div style={{ textAlign: 'center' }}>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                      fontSize: 38, fontWeight: 900, color: '#fff',
                      margin: 0, letterSpacing: '-0.01em',
                      textShadow: '0 0 40px rgba(124,58,237,0.8)',
                    }}
                  >
                    Griot AI
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    style={{
                      fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
                      color: '#A78BFA', margin: '6px 0 0', fontWeight: 700,
                    }}
                  >
                    Story Engine
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tagline */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'relative', zIndex: 2,
                  textAlign: 'center', marginTop: 40,
                }}
              >
                <p style={{
                  fontSize: 18, fontWeight: 700, color: '#E9D5FF',
                  margin: 0, lineHeight: 1.5,
                  textShadow: '0 0 30px rgba(167,139,250,0.4)',
                }}>
                  "Every Story Carries a Legacy."
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14,
                }}>
                  {['Story', 'Canon', 'Character', 'World', 'Legend'].map((w, i) => (
                    <motion.span
                      key={w}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      style={{ fontSize: 10, color: '#7C3AED', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      {w}{i < 4 ? ' ·' : ''}
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
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', bottom: 28, right: 28, zIndex: 3,
                  fontSize: 10, color: '#6B7280', fontWeight: 500, letterSpacing: '0.08em',
                  userSelect: 'none',
                }}
              >
                click to skip
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 5 — final flash */}
          <AnimatePresence>
            {phase >= 5 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.8, times: [0, 0.3, 1] }}
                style={{ position: 'absolute', inset: 0, background: '#A78BFA', pointerEvents: 'none', zIndex: 10 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

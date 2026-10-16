import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'bac-intro-seen';
export const hasSeenBACIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markBACIntroSeen = () => sessionStorage.setItem(KEY, '1');

const GOLD   = '#FBBF24';
const PINK   = '#F472B6';
const GREEN  = '#34D399';
const PURPLE = '#A78BFA';

export default function BACIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markBACIntroSeen();
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

    // ── FLOATING ART SHAPES ───────────────────────────────────────────────
    const COLORS = [GOLD, PINK, GREEN, PURPLE, '#60A5FA', '#FB923C'];
    const shapes = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random(),
      y: 0.2 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.0005,
      vy: -0.0003 - Math.random() * 0.0004,
      size: 3 + Math.random() * 14,
      color: COLORS[i % COLORS.length],
      alpha: 0.05 + Math.random() * 0.18,
      type: Math.floor(Math.random() * 3), // 0=circle, 1=square, 2=diamond
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    // ── SPOTLIGHT BEAMS ───────────────────────────────────────────────────
    const beams = Array.from({ length: 5 }, (_, i) => ({
      angle: (Math.PI / 5) * i - Math.PI * 0.4,
      speed: (Math.random() - 0.5) * 0.004,
      width: 0.04 + Math.random() * 0.03,
      alpha: 0.04 + Math.random() * 0.06,
    }));

    // ── STAR BURST ────────────────────────────────────────────────────────
    const stars = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.02 + Math.random() * 0.42,
      size: 0.8 + Math.random() * 2,
      alpha: 0.08 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2, cy = H / 2;

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 600  && phase < 2) setPhase(2);
      if (elapsed > 1200 && phase < 3) setPhase(3);
      if (elapsed > 2200 && phase < 4) setPhase(4);
      if (elapsed > 3200 && phase < 5) setPhase(5);
      if (elapsed > 4400 && phase < 6) setPhase(6);
      if (elapsed > 5600) { finish(); return; }

      // Background — very dark warm black
      ctx.fillStyle = '#09080A';
      ctx.fillRect(0, 0, W, H);

      // ── SPOTLIGHT BEAMS ────────────────────────────────────────────────
      if (elapsed > 200) {
        const bp = Math.min((elapsed - 200) / 800, 1);
        beams.forEach(b => {
          b.angle += b.speed;
          const bx = cx + Math.cos(b.angle) * W * 0.6;
          const by = -H * 0.1;
          const grd = ctx.createRadialGradient(cx, cy - H * 0.3, 0, cx, cy - H * 0.3, H * 0.8);
          grd.addColorStop(0, `rgba(251,191,36,${b.alpha * bp})`);
          grd.addColorStop(1, 'transparent');
          ctx.save();
          ctx.translate(cx, cy - H * 0.25);
          ctx.rotate(b.angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-W * b.width, H * 0.9);
          ctx.lineTo(W * b.width, H * 0.9);
          ctx.closePath();
          ctx.fillStyle = `rgba(251,191,36,${b.alpha * bp * 0.5})`;
          ctx.fill();
          ctx.restore();
        });
      }

      // ── FLOATING ART SHAPES ────────────────────────────────────────────
      if (elapsed > 300) {
        const sp = Math.min((elapsed - 300) / 700, 1);
        shapes.forEach(s => {
          s.x += s.vx; s.y += s.vy; s.rotation += s.rotSpeed;
          if (s.y < -0.05) { s.y = 1.05; s.x = Math.random(); }
          if (s.x < -0.05 || s.x > 1.05) s.vx *= -1;

          ctx.save();
          ctx.translate(s.x * W, s.y * H);
          ctx.rotate(s.rotation);
          ctx.globalAlpha = s.alpha * sp;

          if (s.type === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.fillStyle = s.color + '22';
            ctx.fill();
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          } else if (s.type === 1) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.8;
            ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
            ctx.fillStyle = s.color + '12';
            ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
          } else {
            ctx.beginPath();
            ctx.moveTo(0, -s.size);
            ctx.lineTo(s.size, 0);
            ctx.lineTo(0, s.size);
            ctx.lineTo(-s.size, 0);
            ctx.closePath();
            ctx.fillStyle = s.color + '18';
            ctx.fill();
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // ── STAR BURST (center) ────────────────────────────────────────────
      if (elapsed > 700) {
        const stp = Math.min((elapsed - 700) / 900, 1);
        const baseR = Math.min(W, H) * 0.22 * stp;
        stars.forEach(s => {
          const pulse = Math.sin(t * 2 + s.pulse) * 0.3 + 0.7;
          const px = cx + Math.cos(s.angle) * baseR * s.dist * (W / 1000);
          const py = cy + Math.sin(s.angle) * baseR * s.dist;
          ctx.beginPath();
          ctx.arc(px, py, s.size * pulse, 0, Math.PI * 2);
          ctx.fillStyle = GOLD;
          ctx.globalAlpha = s.alpha * stp * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── CENTRAL STAR ICON ──────────────────────────────────────────────
      if (elapsed > 1000) {
        const ip = Math.min((elapsed - 1000) / 800, 1);
        const starR = Math.min(W, H) * 0.08 * ip;
        const pulse = 1 + Math.sin(t * 1.8) * 0.05;

        // Glow
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR * 3);
        glow.addColorStop(0, `rgba(251,191,36,${0.25 * ip})`);
        glow.addColorStop(0.5, `rgba(244,114,182,${0.08 * ip})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 3, 0, Math.PI * 2);
        ctx.fill();

        // 5-point star
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const ang = (Math.PI / 5) * i - Math.PI / 2;
          const r = i % 2 === 0 ? starR : starR * 0.4;
          i === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(251,191,36,${0.15 * ip})`;
        ctx.fill();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9 * ip;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#09080A', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: '#F472B6', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Cultural Platform
        </div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(28px, 5.5vw, 60px)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${GOLD}44` }}>
          Black Art Community
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}/>
      </div>

      {/* Tagline */}
      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(12px, 1.6vw, 18px)', color: GOLD, margin: 0, letterSpacing: '0.22em', fontStyle: 'italic', textShadow: `0 0 24px ${GOLD}44` }}>
          Art. Culture. Community.
        </p>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(251,191,36,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

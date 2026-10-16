import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'vault-intro-seen';
export const hasSeenVaultIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markVaultIntroSeen = () => sessionStorage.setItem(KEY, '1');

const VIOLET  = '#A78BFA';
const VIOLET2 = '#C4B5FD';
const INDIGO  = '#818CF8';

export default function VaultIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markVaultIntroSeen();
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

    // ── FLOATING ARCHIVE DUST ──────────────────────────────────────────────
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: -0.0002 - Math.random() * 0.0004,
      size: 0.5 + Math.random() * 2.5,
      alpha: 0.04 + Math.random() * 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    // ── VAULT DOOR RINGS (concentric arcs drawing in) ─────────────────────
    const rings = [
      { r: 0.28, gap: 0.18, startAngle: -Math.PI / 2, progress: 0, delay: 400,  color: VIOLET  },
      { r: 0.22, gap: 0.22, startAngle: -Math.PI / 2, progress: 0, delay: 600,  color: VIOLET2 },
      { r: 0.16, gap: 0.28, startAngle: -Math.PI / 2, progress: 0, delay: 800,  color: INDIGO  },
      { r: 0.10, gap: 0.35, startAngle: -Math.PI / 2, progress: 0, delay: 1000, color: VIOLET  },
    ];

    // ── VAULT LOCK PINS (radial spokes) ────────────────────────────────────
    const pins = Array.from({ length: 8 }, (_, i) => ({
      angle: (Math.PI * 2 / 8) * i,
      len: 0.06,
      progress: 0,
      delay: 1200 + i * 80,
    }));

    // ── STAR FIELD (distant memory particles) ──────────────────────────────
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.3 + Math.random() * 1.2,
      alpha: 0.04 + Math.random() * 0.18,
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const minDim = Math.min(W, H);

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 700  && phase < 2) setPhase(2);
      if (elapsed > 1400 && phase < 3) setPhase(3);
      if (elapsed > 2300 && phase < 4) setPhase(4);
      if (elapsed > 3400 && phase < 5) setPhase(5);
      if (elapsed > 4600 && phase < 6) setPhase(6);
      if (elapsed > 5900) { finish(); return; }

      // Dark background
      ctx.fillStyle = '#08070F';
      ctx.fillRect(0, 0, W, H);

      // Violet radial glow
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.55);
      bg.addColorStop(0, 'rgba(167,139,250,0.10)');
      bg.addColorStop(0.6, 'rgba(129,140,248,0.04)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── STAR FIELD ──────────────────────────────────────────────────────
      stars.forEach(s => {
        const a = s.alpha * (0.7 + Math.sin(t * 1.2 + s.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
        ctx.fillStyle = VIOLET2;
        ctx.globalAlpha = a;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── ARCHIVE DUST ────────────────────────────────────────────────────
      if (elapsed > 200) {
        const dp = Math.min((elapsed - 200) / 700, 1);
        dust.forEach(d => {
          d.x += d.vx; d.y += d.vy;
          if (d.y < -0.02) d.y = 1.02;
          if (d.x < -0.02 || d.x > 1.02) d.vx *= -1;
          ctx.beginPath();
          ctx.arc(d.x * W, d.y * H, d.size, 0, Math.PI * 2);
          ctx.fillStyle = VIOLET;
          ctx.globalAlpha = d.alpha * dp * (0.6 + Math.sin(t * 2 + d.pulse) * 0.4);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── VAULT RINGS ─────────────────────────────────────────────────────
      rings.forEach(ring => {
        if (elapsed < ring.delay) return;
        ring.progress = Math.min(ring.progress + 0.025, 1);
        const r = minDim * ring.r;
        const arc = Math.PI * 2 * (1 - ring.gap) * ring.progress;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.3 * (rings.indexOf(ring) % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, r, ring.startAngle, ring.startAngle + arc);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.6 * ring.progress;
        ctx.stroke();
        // Tick marks
        for (let i = 0; i < 12; i++) {
          const ang = ring.startAngle + (Math.PI * 2 * (1 - ring.gap) / 12) * i * ring.progress;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (r - 3), Math.sin(ang) * (r - 3));
          ctx.lineTo(Math.cos(ang) * (r + 3), Math.sin(ang) * (r + 3));
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 0.7;
          ctx.globalAlpha = 0.4 * ring.progress;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // ── LOCK PINS ───────────────────────────────────────────────────────
      if (elapsed > 1200) {
        pins.forEach(pin => {
          if (elapsed < pin.delay) return;
          pin.progress = Math.min(pin.progress + 0.06, 1);
          const innerR = minDim * 0.085;
          const outerR = minDim * (0.085 + pin.len * pin.progress);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(pin.angle) * innerR, cy + Math.sin(pin.angle) * innerR);
          ctx.lineTo(cx + Math.cos(pin.angle) * outerR, cy + Math.sin(pin.angle) * outerR);
          ctx.strokeStyle = VIOLET2;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5 * pin.progress;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }

      // ── VAULT CENTER EMBLEM ─────────────────────────────────────────────
      if (elapsed > 1600) {
        const ep = Math.min((elapsed - 1600) / 900, 1);
        const er = minDim * 0.055 * ep;
        const pulse = 1 + Math.sin(t * 1.6) * 0.05;

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, er * 4);
        glow.addColorStop(0, `rgba(167,139,250,${0.3 * ep})`);
        glow.addColorStop(0.5, `rgba(129,140,248,${0.1 * ep})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, er * 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        ctx.arc(0, 0, er, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${0.12 * ep})`;
        ctx.fill();
        ctx.strokeStyle = VIOLET;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9 * ep;
        ctx.stroke();

        // Key hole shape
        ctx.beginPath();
        ctx.arc(0, er * -0.2, er * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${0.08 * ep})`;
        ctx.fill();
        ctx.strokeStyle = VIOLET2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-er * 0.2, -er * 0.05);
        ctx.lineTo(-er * 0.2, er * 0.55);
        ctx.lineTo(er * 0.2, er * 0.55);
        ctx.lineTo(er * 0.2, -er * 0.05);
        ctx.strokeStyle = VIOLET2;
        ctx.lineWidth = 1;
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
    <div onClick={finish} style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#08070F', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: VIOLET2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Cultural Archive
        </div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(28px, 5.5vw, 60px)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${VIOLET}44` }}>
          Legacy Vault
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${VIOLET}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}/>
      </div>

      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(12px, 1.6vw, 18px)', color: VIOLET2, margin: 0, letterSpacing: '0.22em', fontStyle: 'italic', textShadow: `0 0 24px ${VIOLET}44` }}>
          Preserve Your Story Forever.
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(167,139,250,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

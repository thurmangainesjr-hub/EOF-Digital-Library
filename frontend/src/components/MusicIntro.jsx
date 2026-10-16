import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'music-studio-intro';
export const hasSeenMusicIntro = () => sessionStorage.getItem(KEY) === '1';
export const markMusicIntroSeen = () => sessionStorage.setItem(KEY, '1');

const GOLD = '#D4AF37';
const GOLD2 = '#FDE68A';

export default function MusicIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markMusicIntroSeen();
    setPhase(6);
    setTimeout(onDone, 700);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // EQ bars setup
    const BAR_COUNT = 48;
    const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
      baseH: 0.05 + Math.random() * 0.35,
      freq: 0.8 + Math.random() * 3.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.9 + Math.random() * 1.4,
    }));

    // Vinyl record params
    const record = { angle: 0, speed: 0.008 };

    // Sound wave particles
    const waves = Array.from({ length: 60 }, (_, i) => ({
      r: 80 + Math.random() * 220,
      angle: (i / 60) * Math.PI * 2,
      speed: (Math.random() - 0.5) * 0.02,
      alpha: 0.1 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
    }));

    let t = 0;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      // Phase transitions
      if (elapsed > 400  && phase < 1) setPhase(1);
      if (elapsed > 900  && phase < 2) setPhase(2);
      if (elapsed > 1900 && phase < 3) setPhase(3);
      if (elapsed > 3200 && phase < 4) setPhase(4);
      if (elapsed > 4400 && phase < 5) setPhase(5);
      if (elapsed > 5600) { finish(); return; }

      // Background
      ctx.fillStyle = '#07060A';
      ctx.fillRect(0, 0, W, H);

      // Ambient glow behind center
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
      grd.addColorStop(0, 'rgba(212,175,55,0.06)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const prog = Math.min(elapsed / 400, 1);

      // ── EQ BARS ──
      if (elapsed > 300) {
        const eqProg = Math.min((elapsed - 300) / 600, 1);
        const barW  = Math.min(W * 0.55, 440) / BAR_COUNT;
        const barGap = barW * 0.22;
        const startX = cx - (BAR_COUNT * barW) / 2;
        const maxH   = H * 0.32;
        const baseY  = cy + H * 0.18;

        for (let i = 0; i < BAR_COUNT; i++) {
          const b = bars[i];
          const wave = Math.sin(t * b.speed + b.phase) * 0.5 + 0.5;
          const beat = Math.pow(Math.abs(Math.sin(t * 1.1 + i * 0.2)), 2);
          const h = (b.baseH + wave * 0.4 + beat * 0.15) * maxH * eqProg;

          const x = startX + i * barW + barGap / 2;
          const w = barW - barGap;

          const barGrd = ctx.createLinearGradient(0, baseY - h, 0, baseY);
          const mid = 0.4 + 0.15 * Math.sin(t * 0.7 + i);
          barGrd.addColorStop(0, `rgba(253,230,138,${0.9 * eqProg})`);
          barGrd.addColorStop(mid, `rgba(212,175,55,${0.75 * eqProg})`);
          barGrd.addColorStop(1, `rgba(120,80,10,${0.3 * eqProg})`);

          ctx.fillStyle = barGrd;
          ctx.beginPath();
          ctx.roundRect(x, baseY - h, w, h, [2, 2, 0, 0]);
          ctx.fill();

          // Peak dot
          ctx.fillStyle = `rgba(253,230,138,${0.8 * eqProg})`;
          ctx.fillRect(x, baseY - h - 3, w, 1.5);
        }

        // Reflection
        ctx.save();
        ctx.globalAlpha = 0.18 * eqProg;
        ctx.scale(1, -1);
        for (let i = 0; i < BAR_COUNT; i++) {
          const b = bars[i];
          const wave = Math.sin(t * b.speed + b.phase) * 0.5 + 0.5;
          const beat = Math.pow(Math.abs(Math.sin(t * 1.1 + i * 0.2)), 2);
          const h = (b.baseH + wave * 0.4 + beat * 0.15) * maxH * eqProg;
          const x = startX + i * barW + barGap / 2;
          const w = barW - barGap;
          ctx.fillStyle = GOLD;
          ctx.beginPath();
          ctx.roundRect(x, -(baseY) - 2, w, h * 0.4);
          ctx.fill();
        }
        ctx.restore();
      }

      // ── VINYL RECORD ──
      if (elapsed > 800) {
        const vinylProg = Math.min((elapsed - 800) / 500, 1);
        const r = Math.min(W, H) * 0.17 * vinylProg;
        record.angle += record.speed;

        ctx.save();
        ctx.translate(cx, cy - H * 0.04);
        ctx.rotate(record.angle);

        // Outer disc
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0D0B10';
        ctx.fill();
        ctx.strokeStyle = `rgba(212,175,55,${0.35 * vinylProg})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Grooves
        for (let g = 0; g < 6; g++) {
          const gr = r * (0.35 + g * 0.1);
          ctx.beginPath();
          ctx.arc(0, 0, gr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212,175,55,${0.12 * vinylProg})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Label in center
        const labelR = r * 0.32;
        const lgrd = ctx.createRadialGradient(0, 0, 0, 0, 0, labelR);
        lgrd.addColorStop(0, `rgba(212,175,55,${0.9 * vinylProg})`);
        lgrd.addColorStop(1, `rgba(150,100,10,${0.7 * vinylProg})`);
        ctx.beginPath();
        ctx.arc(0, 0, labelR, 0, Math.PI * 2);
        ctx.fillStyle = lgrd;
        ctx.fill();

        // Spindle
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.04, 0, Math.PI * 2);
        ctx.fillStyle = '#07060A';
        ctx.fill();

        // Shimmer arm
        const armAngle = Math.PI * 0.18;
        ctx.save();
        ctx.rotate(armAngle + Math.sin(t * 0.4) * 0.05);
        ctx.strokeStyle = `rgba(253,230,138,${0.5 * vinylProg})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 0.95, 0);
        ctx.lineTo(r * 0.4, 0);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // ── ORBITAL SOUND WAVES ──
      if (elapsed > 1200) {
        const waveProg = Math.min((elapsed - 1200) / 600, 1);
        const cr = Math.min(W, H) * 0.17;

        waves.forEach((w, i) => {
          w.angle += w.speed;
          const pulse = 1 + 0.08 * Math.sin(t * 2.2 + i);
          const x = cx + (cr + w.r * 0.5) * pulse * Math.cos(w.angle);
          const y = (cy - H * 0.04) + (cr + w.r * 0.5) * pulse * Math.sin(w.angle) * 0.55;
          ctx.beginPath();
          ctx.arc(x, y, w.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${w.alpha * waveProg * 0.6})`;
          ctx.fill();
        });
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [finish]);

  // CSS phase values
  const eqVisible   = phase >= 1;
  const vinylVisible= phase >= 2;
  const titleVisible= phase >= 3;
  const tagVisible  = phase >= 4;
  const exiting     = phase >= 5;

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer',
        background: '#07060A',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.6s ease' : 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }}/>

      {/* Studio name */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
        marginTop: '-52%',
      }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(11px, 1.4vw, 16px)',
          letterSpacing: '0.35em',
          color: GOLD2,
          fontWeight: 400,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Griot
        </div>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(22px, 4vw, 48px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#fff',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          textShadow: `0 0 40px ${GOLD}55`,
        }}>
          MUSIC STUDIO
        </div>
        <div style={{
          width: 80, height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: '12px auto 0',
          opacity: titleVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}/>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', bottom: '22%', left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none',
        opacity: tagVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <p style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(12px, 1.6vw, 18px)',
          color: GOLD2,
          margin: 0,
          letterSpacing: '0.15em',
          fontStyle: 'italic',
          textShadow: `0 0 20px ${GOLD}44`,
        }}>
          Record. Arrange. Mix. Release.
        </p>
      </div>

      {/* Skip hint */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10, color: 'rgba(212,175,55,0.35)',
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

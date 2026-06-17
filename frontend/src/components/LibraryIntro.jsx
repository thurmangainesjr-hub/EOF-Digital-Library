import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'library-intro-seen';
export const hasSeenLibraryIntro = () => sessionStorage.getItem(KEY) === '1';
export const markLibraryIntroSeen = () => sessionStorage.setItem(KEY, '1');

const GOLD  = '#D4AF37';
const GOLD2 = '#FDE68A';

export default function LibraryIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markLibraryIntroSeen();
    setPhase(6);
    setTimeout(onDone, 700);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Floating letters / words that drift upward
    const WORDS = ['Story', 'Knowledge', 'Chapter', 'Archive', 'Library', 'Volume', 'Reading', 'Pages', 'Wisdom', 'Author', 'Legacy', 'Words', 'Ink', 'Book'];
    const floaters = Array.from({ length: 28 }, (_, i) => ({
      word: WORDS[i % WORDS.length],
      x: Math.random(),
      y: 0.3 + Math.random() * 0.7,
      vy: -0.0003 - Math.random() * 0.0005,
      alpha: 0.04 + Math.random() * 0.12,
      size: 10 + Math.random() * 16,
      speed: 0.8 + Math.random() * 0.6,
    }));

    // Book pages (horizontal lines expanding from center)
    const pages = Array.from({ length: 8 }, (_, i) => ({
      offset: (i / 7 - 0.5) * 0.18,
      progress: 0,
    }));

    // Gold dust particles
    const dust = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: -0.0004 - Math.random() * 0.0006,
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.35,
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

      if (elapsed > 300  && phase < 1) setPhase(1);
      if (elapsed > 800  && phase < 2) setPhase(2);
      if (elapsed > 1700 && phase < 3) setPhase(3);
      if (elapsed > 3000 && phase < 4) setPhase(4);
      if (elapsed > 4200 && phase < 5) setPhase(5);
      if (elapsed > 5500) { finish(); return; }

      // Background — warm dark
      ctx.fillStyle = '#08070A';
      ctx.fillRect(0, 0, W, H);

      // Amber vignette glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.65);
      grd.addColorStop(0, 'rgba(212,175,55,0.08)');
      grd.addColorStop(0.6, 'rgba(180,120,20,0.03)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── FLOATING WORDS ──
      if (elapsed > 200) {
        const wp = Math.min((elapsed - 200) / 800, 1);
        ctx.save();
        floaters.forEach(f => {
          f.y += f.vy;
          f.x += (Math.random() - 0.5) * 0.0001;
          if (f.y < -0.1) { f.y = 1.1; f.x = Math.random(); }
          ctx.font = `${f.size}px Georgia, serif`;
          ctx.fillStyle = `rgba(212,175,55,${f.alpha * wp})`;
          ctx.fillText(f.word, f.x * W, f.y * H);
        });
        ctx.restore();
      }

      // ── GOLD DUST ──
      if (elapsed > 400) {
        const dp = Math.min((elapsed - 400) / 600, 1);
        dust.forEach(d => {
          d.x += d.vx; d.y += d.vy;
          if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
          if (d.x < 0 || d.x > 1) d.vx *= -1;
          ctx.beginPath();
          ctx.arc(d.x * W, d.y * H, d.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${d.alpha * dp})`;
          ctx.fill();
        });
      }

      // ── OPEN BOOK SILHOUETTE ──
      if (elapsed > 700) {
        const bp = Math.min((elapsed - 700) / 900, 1);
        const bw = Math.min(W * 0.28, 200) * bp;
        const bh = Math.min(H * 0.22, 160) * bp;
        const bx = cx;
        const by = cy - H * 0.04;

        ctx.save();
        // Spine
        ctx.strokeStyle = `rgba(212,175,55,${0.7 * bp})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, by - bh * 0.5);
        ctx.lineTo(bx, by + bh * 0.5);
        ctx.stroke();

        // Left page
        ctx.beginPath();
        ctx.moveTo(bx, by - bh * 0.5);
        ctx.bezierCurveTo(bx - bw * 0.3, by - bh * 0.5, bx - bw * 0.95, by - bh * 0.4, bx - bw, by);
        ctx.bezierCurveTo(bx - bw * 0.95, by + bh * 0.4, bx - bw * 0.3, by + bh * 0.5, bx, by + bh * 0.5);
        ctx.closePath();
        ctx.fillStyle = `rgba(212,175,55,${0.06 * bp})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(212,175,55,${0.4 * bp})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Right page
        ctx.beginPath();
        ctx.moveTo(bx, by - bh * 0.5);
        ctx.bezierCurveTo(bx + bw * 0.3, by - bh * 0.5, bx + bw * 0.95, by - bh * 0.4, bx + bw, by);
        ctx.bezierCurveTo(bx + bw * 0.95, by + bh * 0.4, bx + bw * 0.3, by + bh * 0.5, bx, by + bh * 0.5);
        ctx.closePath();
        ctx.fillStyle = `rgba(212,175,55,${0.06 * bp})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(212,175,55,${0.4 * bp})`;
        ctx.stroke();

        // Text lines on pages
        if (bp > 0.5) {
          const lp = (bp - 0.5) * 2;
          ctx.strokeStyle = `rgba(212,175,55,${0.18 * lp})`;
          ctx.lineWidth = 0.8;
          for (let l = 0; l < 6; l++) {
            const ly = by - bh * 0.32 + l * bh * 0.11;
            const maxLen = bw * 0.65 * (1 - Math.abs(l - 2.5) * 0.06);
            // Left lines
            ctx.beginPath();
            ctx.moveTo(bx - bw * 0.12, ly);
            ctx.lineTo(bx - bw * 0.12 - maxLen, ly);
            ctx.stroke();
            // Right lines
            ctx.beginPath();
            ctx.moveTo(bx + bw * 0.12, ly);
            ctx.lineTo(bx + bw * 0.12 + maxLen, ly);
            ctx.stroke();
          }
        }

        // Glow around book
        const bglow = ctx.createRadialGradient(bx, by, 0, bx, by, bw * 1.4);
        bglow.addColorStop(0, `rgba(212,175,55,${0.12 * bp})`);
        bglow.addColorStop(1, 'transparent');
        ctx.fillStyle = bglow;
        ctx.fillRect(bx - bw * 1.5, by - bh, bw * 3, bh * 2);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [finish]);

  const titleVisible = phase >= 3;
  const tagVisible   = phase >= 4;
  const exiting      = phase >= 5;

  return (
    <div
      onClick={finish}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#08070A', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }}/>

      {/* Title — above the book */}
      <div style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 600 }}>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(10px, 1.1vw, 13px)', letterSpacing: '0.5em', color: GOLD2, fontWeight: 400, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          Digital Library
        </div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(28px, 5.5vw, 60px)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${GOLD}44` }}>
          EOF Library
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.3s' }}/>
      </div>

      {/* Tagline — below the book */}
      <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(12px, 1.6vw, 18px)', color: GOLD2, margin: 0, letterSpacing: '0.18em', fontStyle: 'italic', textShadow: `0 0 24px ${GOLD}44` }}>
          Every Story. Every Voice. Every Legacy.
        </p>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(212,175,55,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

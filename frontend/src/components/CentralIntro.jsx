import React, { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'central-intro-seen';
export const hasSeenCentralIntro  = () => sessionStorage.getItem(KEY) === '1';
export const markCentralIntroSeen = () => sessionStorage.setItem(KEY, '1');

const GOLD  = '#D4AF37';
const GOLD2 = '#FDE68A';
const GOLD3 = 'rgba(212,175,55,0.18)';

export default function CentralIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markCentralIntroSeen();
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

    // ── HEX NETWORK NODES ────────────────────────────────────────────────
    // Central hub + 6 satellite systems + 12 outer nodes
    const buildNodes = (W, H) => {
      const cx = W / 2, cy = H / 2;
      const r1 = Math.min(W, H) * 0.13;
      const r2 = Math.min(W, H) * 0.26;

      const nodes = [
        { x: cx, y: cy, r: 14, color: GOLD, alpha: 0, lit: false, central: true, delay: 0 },
      ];
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        nodes.push({ x: cx + Math.cos(ang) * r1, y: cy + Math.sin(ang) * r1, r: 7, color: GOLD, alpha: 0, lit: false, delay: 300 + i * 120 });
      }
      for (let i = 0; i < 12; i++) {
        const ang = (Math.PI / 6) * i;
        const col = ['#F59E0B', '#06B6D4', '#A78BFA', '#34D399', '#F472B6', '#D4AF37'][i % 6];
        nodes.push({ x: cx + Math.cos(ang) * r2, y: cy + Math.sin(ang) * r2, r: 4.5, color: col, alpha: 0, lit: false, delay: 900 + i * 80 });
      }
      return nodes;
    };

    // ── CONNECTIONS ──────────────────────────────────────────────────────
    const buildEdges = (nodes) => {
      const edges = [];
      // Central → inner ring
      for (let i = 1; i <= 6; i++) {
        edges.push({ a: 0, b: i, progress: 0, delay: 400 + (i - 1) * 100, color: GOLD });
      }
      // Inner → outer (each inner connects to 2 outer)
      for (let i = 0; i < 6; i++) {
        edges.push({ a: i + 1, b: 7 + (i * 2) % 12, progress: 0, delay: 1100 + i * 80, color: nodes[i + 1].color });
        edges.push({ a: i + 1, b: 7 + (i * 2 + 1) % 12, progress: 0, delay: 1200 + i * 80, color: nodes[i + 1].color });
      }
      // Outer ring connections
      for (let i = 0; i < 12; i++) {
        edges.push({ a: 7 + i, b: 7 + (i + 1) % 12, progress: 0, delay: 1600 + i * 50, color: 'rgba(212,175,55,0.2)' });
      }
      return edges;
    };

    // ── ORBITAL PARTICLES ────────────────────────────────────────────────
    const orbitals = Array.from({ length: 40 }, (_, i) => ({
      angle: (Math.PI * 2 / 40) * i,
      radius: 0.08 + Math.random() * 0.22,
      speed: 0.003 + Math.random() * 0.005 * (Math.random() > 0.5 ? 1 : -1),
      size: 1 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.35,
      color: [GOLD, '#F59E0B', '#FDE68A', '#06B6D4', '#A78BFA'][Math.floor(Math.random() * 5)],
    }));

    let nodes = null;
    let edges = null;
    let t = 0;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t += 0.016;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2, cy = H / 2;

      if (!nodes) { nodes = buildNodes(W, H); edges = buildEdges(nodes); }

      if (elapsed > 200  && phase < 1) setPhase(1);
      if (elapsed > 600  && phase < 2) setPhase(2);
      if (elapsed > 1200 && phase < 3) setPhase(3);
      if (elapsed > 2000 && phase < 4) setPhase(4);
      if (elapsed > 3000 && phase < 5) setPhase(5);
      if (elapsed > 4200 && phase < 6) setPhase(6);
      if (elapsed > 5600) { finish(); return; }

      // Background
      ctx.fillStyle = '#07060A';
      ctx.fillRect(0, 0, W, H);

      // Radial gold vignette
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
      vg.addColorStop(0, 'rgba(212,175,55,0.11)');
      vg.addColorStop(0.5, 'rgba(212,175,55,0.04)');
      vg.addColorStop(1, 'transparent');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ── ORBITAL PARTICLES ──────────────────────────────────────────────
      if (elapsed > 300) {
        const op = Math.min((elapsed - 300) / 600, 1);
        const baseR = Math.min(W, H) * 0.35;
        orbitals.forEach(p => {
          p.angle += p.speed;
          const px = cx + Math.cos(p.angle) * baseR * p.radius * (W / 900);
          const py = cy + Math.sin(p.angle) * baseR * p.radius;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * op;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── EDGES ──────────────────────────────────────────────────────────
      if (elapsed > 400 && edges) {
        edges.forEach(edge => {
          if (elapsed < edge.delay) return;
          edge.progress = Math.min(edge.progress + 0.04, 1);
          if (edge.progress <= 0) return;
          const na = nodes[edge.a], nb = nodes[edge.b];
          const tx = na.x + (nb.x - na.x) * edge.progress;
          const ty = na.y + (nb.y - na.y) * edge.progress;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = edge.color;
          ctx.globalAlpha = 0.45 * edge.progress;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }

      // ── NODES ──────────────────────────────────────────────────────────
      if (nodes) {
        nodes.forEach(node => {
          if (elapsed < node.delay) return;
          node.alpha = Math.min(node.alpha + 0.04, 1);

          // Glow
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 3);
          glow.addColorStop(0, node.color + '40');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.globalAlpha = node.alpha;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 3, 0, Math.PI * 2);
          ctx.fill();

          // Node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fillStyle = node.central ? GOLD + '22' : node.color + '18';
          ctx.fill();
          ctx.strokeStyle = node.color;
          ctx.lineWidth = node.central ? 1.8 : 1.2;
          ctx.globalAlpha = node.alpha * 0.9;
          ctx.stroke();

          // Pulse ring on central node
          if (node.central && node.alpha >= 1) {
            const pulse = (Math.sin(t * 2.5) + 1) / 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r + 6 + pulse * 8, 0, Math.PI * 2);
            ctx.strokeStyle = GOLD;
            ctx.globalAlpha = 0.2 * (1 - pulse);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        });
      }

      // ── HEXAGONAL RINGS ────────────────────────────────────────────────
      if (elapsed > 800) {
        const hp = Math.min((elapsed - 800) / 1000, 1);
        [0.18, 0.32, 0.46].forEach((rFrac, ri) => {
          const hexR = Math.min(W, H) * rFrac * hp;
          const rotation = t * (ri % 2 === 0 ? 0.15 : -0.1);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rotation);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (Math.PI / 3) * i - Math.PI / 6;
            const hx = Math.cos(ang) * hexR;
            const hy = Math.sin(ang) * hexR;
            i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(212,175,55,${0.06 * hp})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.restore();
        });
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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', background: '#07060A', opacity: exiting ? 0 : 1, transition: exiting ? 'opacity 0.65s ease' : 'none' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.55em', color: GOLD2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          EOF Ecosystem · Master Intelligence
        </div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(28px, 5.5vw, 60px)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s', textShadow: `0 0 60px ${GOLD}44` }}>
          E.O.F Central
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 'clamp(12px, 1.8vw, 18px)', fontWeight: 600, letterSpacing: '0.3em', color: GOLD, marginTop: 6, textTransform: 'uppercase', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.25s' }}>
          AI Hub
        </div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '14px auto 0', opacity: titleVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}/>
      </div>

      {/* Tagline */}
      <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: tagVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(11px, 1.5vw, 16px)', color: GOLD2, margin: 0, letterSpacing: '0.28em', fontWeight: 600, textTransform: 'uppercase', textShadow: `0 0 24px ${GOLD}44` }}>
          COMMAND · CONNECT · ELEVATE
        </p>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(212,175,55,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none', opacity: phase >= 1 ? 0.7 : 0, transition: 'opacity 1s' }}>
        Click to skip
      </div>
    </div>
  );
}

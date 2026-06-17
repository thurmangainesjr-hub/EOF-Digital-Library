/**
 * EOF Universal Intro — "Powered by Expression of Freedom"
 * 7-second brand moment. Uses sessionStorage so it plays once per window.
 * Drop into any layout: <EOFUniversalIntro appId="library" accentColor="#..." appName="..." appEmoji="..." onDone={fn} />
 */
import React, { useEffect, useState } from 'react';

export function hasSeenIntro(appId) {
  try { return sessionStorage.getItem(`eof-intro-${appId}`) === '1'; } catch { return false; }
}
export function markIntroSeen(appId) {
  try { sessionStorage.setItem(`eof-intro-${appId}`, '1'); } catch {}
}

/* ── Keyframes injected once ─────────────────────────────────────────────── */
const STYLE_ID = 'eof-universal-intro-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes eofLogoIn {
      0%   { opacity:0; transform:scale(0.7) translateY(12px); filter:blur(8px); }
      60%  { opacity:1; transform:scale(1.03) translateY(-2px); filter:blur(0); }
      100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
    }
    @keyframes eofRingDraw {
      0%   { stroke-dashoffset: 565; opacity:0; }
      20%  { opacity:1; }
      100% { stroke-dashoffset: 0; opacity:1; }
    }
    @keyframes eofTextSlide {
      0%   { opacity:0; transform:translateY(10px) skewX(-4deg); letter-spacing:0.35em; }
      100% { opacity:1; transform:translateY(0) skewX(0); }
    }
    @keyframes eofLineGrow {
      0%   { width:0; opacity:0; }
      100% { width:100%; opacity:1; }
    }
    @keyframes eofAppIn {
      0%   { opacity:0; transform:translateY(14px); }
      100% { opacity:1; transform:translateY(0); }
    }
    @keyframes eofTagIn {
      0%   { opacity:0; }
      100% { opacity:0.45; }
    }
    @keyframes eofFadeOut {
      0%   { opacity:1; }
      100% { opacity:0; }
    }
    @keyframes eofPulse {
      0%,100% { opacity:0.6; transform:scale(1); }
      50%     { opacity:1;   transform:scale(1.04); }
    }
    @keyframes eofStarFloat {
      0%   { transform:translateY(0) rotate(0deg); opacity:0; }
      20%  { opacity:1; }
      100% { transform:translateY(-60px) rotate(180deg); opacity:0; }
    }
  `;
  document.head.appendChild(el);
}

/* ── Floating particle ───────────────────────────────────────────────────── */
function Particle({ x, y, size, delay, color }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%',
      background: color, opacity: 0,
      animation: `eofStarFloat ${2.4 + Math.random()}s ${delay}s ease-in-out forwards`,
      pointerEvents: 'none',
    }}/>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function EOFUniversalIntro({ appId, accentColor = '#6366F1', appName = '', appEmoji = '', onDone }) {
  const [phase, setPhase] = useState(0); // 0-5
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    injectStyles();
    const timers = [
      setTimeout(() => setPhase(1), 400),   // logo in
      setTimeout(() => setPhase(2), 1800),  // brand text
      setTimeout(() => setPhase(3), 3000),  // divider + app name
      setTimeout(() => setPhase(4), 4200),  // tagline
      setTimeout(() => setPhase(5), 5500),  // start fade
      setTimeout(() => { setFadeOut(true); }, 5500),
      setTimeout(() => { markIntroSeen(appId); onDone?.(); }, 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [appId, onDone]);

  const GOLD   = '#F0C040';
  const SILVER = 'rgba(255,255,255,0.92)';

  // Decorative particles
  const particles = [
    { x: 15, y: 25, size: 3, delay: 0.8,  color: accentColor },
    { x: 82, y: 18, size: 2, delay: 1.2,  color: GOLD },
    { x: 70, y: 72, size: 3, delay: 0.5,  color: accentColor },
    { x: 28, y: 68, size: 2, delay: 1.5,  color: GOLD },
    { x: 90, y: 45, size: 2, delay: 0.9,  color: SILVER },
    { x: 10, y: 55, size: 2, delay: 1.8,  color: accentColor },
    { x: 50, y: 12, size: 2, delay: 1.1,  color: SILVER },
    { x: 55, y: 85, size: 3, delay: 0.6,  color: accentColor },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      animation: fadeOut ? 'eofFadeOut 1.4s ease-in-out forwards' : undefined,
      overflow: 'hidden',
    }}>
      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${accentColor}0D 0%, transparent 70%)`,
        transition: 'opacity 1s',
        opacity: phase >= 1 ? 1 : 0,
      }}/>

      {/* Floating particles */}
      {phase >= 1 && particles.map((p, i) => <Particle key={i} {...p}/>)}

      {/* ── Center stack ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative', zIndex: 1 }}>

        {/* EOF Monogram + ring */}
        {phase >= 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28, position: 'relative',
            animation: 'eofLogoIn 1.1s cubic-bezier(0.22,1,0.36,1) forwards',
          }}>
            {/* Rotating ring */}
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id={`eofRingGrad-${appId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor={accentColor} stopOpacity="0.9"/>
                  <stop offset="50%"  stopColor={GOLD}         stopOpacity="0.6"/>
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="56"
                fill="none"
                stroke={`url(#eofRingGrad-${appId})`}
                strokeWidth="1"
                strokeDasharray="352 352"
                strokeDashoffset="352"
                strokeLinecap="round"
                style={{ animation: 'eofRingDraw 1.6s 0.2s cubic-bezier(0.4,0,0.2,1) forwards' }}
              />
              {/* 4 tick marks at cardinal points */}
              {[[60,4],[116,60],[60,116],[4,60]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r="2" fill={GOLD} opacity="0.7"/>
              ))}
            </svg>

            {/* EOF letters */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                fontSize: 42, fontWeight: 900, letterSpacing: '0.18em',
                background: `linear-gradient(135deg, ${SILVER} 30%, ${GOLD} 60%, ${SILVER} 80%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', fontFamily: 'system-ui, sans-serif',
                lineHeight: 1,
              }}>EOF</div>
            </div>
          </div>
        )}

        {/* Brand name */}
        {phase >= 2 && (
          <div style={{
            fontSize: 13, fontWeight: 400, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: SILVER, marginBottom: 20,
            animation: 'eofTextSlide 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
            fontFamily: 'system-ui, sans-serif',
          }}>
            Expression of Freedom
          </div>
        )}

        {/* Divider + App name */}
        {phase >= 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
              height: 1, overflow: 'hidden', display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                height: 1, width: 0,
                background: `linear-gradient(90deg, transparent, ${accentColor}, ${GOLD}, ${accentColor}, transparent)`,
                animation: 'eofLineGrow 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
                minWidth: 220,
              }}/>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'eofAppIn 0.8s 0.15s cubic-bezier(0.22,1,0.36,1) both',
            }}>
              {appEmoji && <span style={{ fontSize: 20 }}>{appEmoji}</span>}
              <span style={{
                fontSize: 18, fontWeight: 700, letterSpacing: '0.06em',
                color: accentColor, fontFamily: 'system-ui, sans-serif',
              }}>{appName}</span>
            </div>
          </div>
        )}

        {/* Tagline */}
        {phase >= 4 && (
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em',
            textTransform: 'uppercase', marginTop: 22,
            animation: 'eofTagIn 0.9s ease forwards',
            fontFamily: 'system-ui, sans-serif',
          }}>
            Powered by AI · Built for Creators
          </div>
        )}
      </div>

      {/* Corner accents */}
      {phase >= 1 && (
        <>
          {[
            { top:  20, left:  20, borderTop: `1px solid ${accentColor}40`, borderLeft:  `1px solid ${accentColor}40` },
            { top:  20, right: 20, borderTop: `1px solid ${accentColor}40`, borderRight: `1px solid ${accentColor}40` },
            { bottom:20, left:  20, borderBottom:`1px solid ${accentColor}40`, borderLeft: `1px solid ${accentColor}40` },
            { bottom:20, right: 20, borderBottom:`1px solid ${accentColor}40`, borderRight:`1px solid ${accentColor}40` },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', width: 28, height: 28, ...s,
              opacity: 0, animation: `eofTagIn 0.6s ${0.4 + i * 0.08}s ease forwards`,
            }}/>
          ))}
        </>
      )}
    </div>
  );
}

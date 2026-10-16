import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DTEComingSoon({ title, description, eta }) {
  const navigate = useNavigate();
  const location = useLocation();

  const label = title || location.state?.title || 'Coming Soon';
  const desc  = description || location.state?.description || 'This section is under active construction by the DTE engineering team.';
  const etaLabel = eta || location.state?.eta || 'Q3 2026';

  return (
    <div style={{
      minHeight: '100vh', background: '#080604',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      {/* Particle grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.05) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, width: '100%', textAlign: 'center' }}>
        {/* Animated icon */}
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(6,182,212,0.08))',
          border: '1.5px solid rgba(249,115,22,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, margin: '0 auto 28px',
          boxShadow: '0 0 40px rgba(249,115,22,0.1)',
        }}>
          🚧
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em',
          background: 'linear-gradient(135deg, #F97316, #06B6D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 12,
        }}>
          {label}
        </h1>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 20, padding: '5px 14px', marginBottom: 20,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#F97316',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#F97316', letterSpacing: '0.1em' }}>
            UNDER CONSTRUCTION
          </span>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

        {/* Description */}
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
          {desc}
        </p>

        {/* ETA card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '16px 24px', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
              ESTIMATED LAUNCH
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>{etaLabel}</div>
          </div>
          <div style={{ fontSize: 28 }}>📅</div>
        </div>

        {/* DTE branding */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 24, letterSpacing: '0.12em' }}>
          DEV TEAM ELITE · BUILD · GROW · LAUNCH
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 22px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/dev-team')}
            style={{
              padding: '10px 22px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #F97316, #06B6D4)',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            DTE Command →
          </button>
        </div>
      </div>
    </div>
  );
}

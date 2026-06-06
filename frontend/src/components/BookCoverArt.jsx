import React from 'react';
import { FiLock } from 'react-icons/fi';

// ─── Cover colour themes ─────────────────────────────────────
export const THEMES = {
  crimsonGold:   { a: '#3d0000', b: '#1a0505', accent: '#C0392B', text: '#D4AF37' },
  royalNavy:     { a: '#0A2040', b: '#020B18', accent: '#4A90E2', text: '#FFFFFF' },
  forestSage:    { a: '#1A3A1A', b: '#0A1F0A', accent: '#52B788', text: '#D4E9C8' },
  sunsetAmber:   { a: '#3D1A00', b: '#1F0A00', accent: '#F4A261', text: '#FFECD2' },
  cosmicPurple:  { a: '#1E0040', b: '#0D0020', accent: '#9B59B6', text: '#E8D5F5' },
  oceanTeal:     { a: '#003340', b: '#001A1F', accent: '#1ABC9C', text: '#A8EDD6' },
  goldenSerif:   { a: '#241800', b: '#0D0800', accent: '#D4AF37', text: '#FFF8E7' },
  roseCopper:    { a: '#3D0020', b: '#1F0810', accent: '#E8698A', text: '#F5C6D0' },
  midnightSlate: { a: '#141430', b: '#0A0A14', accent: '#7F8C8D', text: '#BDC3C7' },
  earthBrown:    { a: '#2A1800', b: '#100800', accent: '#C0804B', text: '#E8C9A0' },
  steelBlue:     { a: '#10213A', b: '#080C12', accent: '#2E86AB', text: '#A8C8E0' },
  lushMaroon:    { a: '#250010', b: '#0F0005', accent: '#8E1A2E', text: '#F5A0B5' },
};

// ─── Size map ─────────────────────────────────────────────────
export const SIZES = {
  xs:   { w: 80,  h: 120, ts: '8px',  as: '7px'  },
  sm:   { w: 110, h: 165, ts: '9px',  as: '8px'  },
  md:   { w: 148, h: 222, ts: '10px', as: '9px'  },
  lg:   { w: 176, h: 264, ts: '11px', as: '10px' },
  xl:   { w: 214, h: 321, ts: '13px', as: '11px' },
  hero: { w: 256, h: 384, ts: '15px', as: '12px' },
};

/**
 * Renders a rich dark book-cover placeholder.
 * book = { id, title, author, theme, isNew, hot, tags }
 */
export default function BookCoverArt({ book, size = 'md', className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const theme = THEMES[book?.theme] || THEMES.goldenSerif;
  const pat = Number(String(book?.id || '0').replace(/\D/g, '') || 0) % 5;

  return (
    <div
      className={`relative overflow-hidden rounded-lg flex-shrink-0 select-none ${className}`}
      style={{
        width: s.w, height: s.h,
        background: `linear-gradient(150deg, ${theme.a} 0%, ${theme.b} 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Spine */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${theme.accent}80, transparent 70%)` }} />
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: theme.accent, opacity: 0.75 }} />
      {/* Outer ring */}
      <div className="absolute" style={{
        top: '14%', left: '50%', transform: 'translateX(-50%)',
        width: s.w * 0.6, height: s.w * 0.6,
        border: `1.5px solid ${theme.accent}35`,
        borderRadius: pat < 2 ? '50%' : pat === 2 ? '8px' : '2px',
      }} />
      {/* Inner ring */}
      <div className="absolute" style={{
        top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: s.w * 0.38, height: s.w * 0.38,
        border: `1px solid ${theme.accent}25`,
        borderRadius: pat < 2 ? '50%' : pat === 2 ? '6px' : '2px',
      }} />
      {/* Centre dot */}
      <div className="absolute rounded-full" style={{
        top: `calc(14% + ${s.w * 0.3 - 4}px)`, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 8, background: theme.accent, opacity: 0.9,
      }} />
      {/* Bottom gradient for text */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '55%',
        background: `linear-gradient(to top, ${theme.b}ff 0%, ${theme.b}cc 40%, transparent 100%)`,
      }} />
      {/* Title + author */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p style={{ fontSize: s.ts, color: theme.text, fontFamily: 'Playfair Display, serif', fontWeight: 700, lineHeight: 1.25, marginBottom: 3, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          className="line-clamp-3">
          {book?.title}
        </p>
        <p style={{ fontSize: s.as, color: theme.text, opacity: 0.65 }} className="truncate">
          {book?.author}
        </p>
      </div>
      {/* Badges */}
      {book?.isNew && (
        <div className="absolute top-2 right-2 rounded font-bold uppercase"
          style={{ background: theme.accent, color: '#fff', fontSize: '7px', padding: '2px 5px', letterSpacing: '0.08em' }}>
          NEW
        </div>
      )}
      {book?.hot && !book?.isNew && (
        <div className="absolute top-2 right-2 rounded font-bold uppercase bg-orange-600 text-white"
          style={{ fontSize: '7px', padding: '2px 5px', letterSpacing: '0.08em' }}>
          HOT
        </div>
      )}
      {book?.tags?.includes('exclusive') && (
        <div className="absolute top-2 left-3">
          <FiLock size={10} color={theme.accent} />
        </div>
      )}
    </div>
  );
}

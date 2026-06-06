/**
 * EOF Digital Library — Home Screen Widget
 *
 * Renders an iOS / Android-style widget in three sizes:
 *   size="small"  → 155×155 px  (2×2 grid units)
 *   size="medium" → 329×155 px  (4×2 grid units)
 *   size="large"  → 329×345 px  (4×4 grid units)
 *
 * Usage:
 *   <AppWidget size="medium" book={currentBook} stats={userStats} />
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiPlay, FiStar, FiTrendingUp } from 'react-icons/fi';

// ── Sub-components ───────────────────────────────────────────────────────────

function EOFMark({ size = 28 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-lg bg-eof-gold flex items-center justify-center flex-shrink-0 relative shadow-gold-sm"
    >
      <span
        className="font-serif font-bold text-eof-dark leading-none"
        style={{ fontSize: size * 0.5 }}
      >E</span>
      <span
        className="absolute -bottom-0.5 -right-0.5 rounded-full bg-eof-crimson border border-eof-dark"
        style={{ width: size * 0.28, height: size * 0.28 }}
      />
    </div>
  );
}

function ProgressRing({ percent = 0, size = 48, stroke = 4 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth={stroke}/>
      <circle cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke="#D4AF37" strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"/>
    </svg>
  );
}

// ── Widget sizes ─────────────────────────────────────────────────────────────

function SmallWidget({ book, stats }) {
  return (
    <div className="relative w-[155px] h-[155px] rounded-[22px] overflow-hidden flex flex-col justify-between p-3.5"
         style={{ background: 'linear-gradient(145deg, #1A1208, #0D0D0D)', border: '1px solid rgba(212,175,55,0.20)' }}>

      {/* Top row */}
      <div className="flex items-center justify-between">
        <EOFMark size={26} />
        <span className="text-[9px] font-semibold tracking-widest text-eof-gold/70 uppercase">Library</span>
      </div>

      {/* Center — reading progress */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <ProgressRing percent={stats?.readingProgress ?? 68} size={52} stroke={5}/>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-eof-gold">
            {stats?.readingProgress ?? 68}%
          </span>
        </div>
        <p className="text-[9px] text-gray-400 text-center leading-tight truncate w-full">
          {book?.title ?? 'Atomic Habits'}
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-eof-muted">{stats?.booksRead ?? 12} read</span>
        <span className="text-[9px] text-eof-crimson-light">{stats?.streak ?? 7}d streak</span>
      </div>
    </div>
  );
}

function MediumWidget({ book, stats }) {
  return (
    <div className="relative w-[329px] h-[155px] rounded-[22px] overflow-hidden flex gap-0"
         style={{ background: 'linear-gradient(145deg, #1A1208, #0D0D0D)', border: '1px solid rgba(212,175,55,0.20)' }}>

      {/* Left — book cover area */}
      <div className="w-[110px] flex-shrink-0 relative overflow-hidden">
        {book?.coverImage ? (
          <img src={book.coverImage} alt={book.title}
               className="w-full h-full object-cover opacity-80"/>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3"
               style={{ background: 'linear-gradient(135deg, #2A1A08, #1A0F04)' }}>
            <FiBook className="text-eof-gold/50" size={28}/>
            <p className="text-[9px] text-eof-gold/60 text-center leading-tight font-serif">
              {book?.title ?? 'Atomic Habits'}
            </p>
          </div>
        )}
        {/* Reading badge */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="bg-eof-crimson text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Reading
          </span>
        </div>
      </div>

      {/* Right — info */}
      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <EOFMark size={20} />
            <span className="text-[10px] font-semibold tracking-widest text-eof-gold/70 uppercase">EOF Library</span>
          </div>
        </div>

        {/* Book info */}
        <div>
          <p className="text-white text-[13px] font-serif font-semibold leading-tight truncate">
            {book?.title ?? 'Atomic Habits'}
          </p>
          <p className="text-eof-muted text-[10px] mt-0.5 truncate">
            {book?.author ?? 'James Clear'}
          </p>
          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-gray-500">Progress</span>
              <span className="text-[9px] text-eof-gold font-semibold">{stats?.readingProgress ?? 68}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-eof-gold to-eof-gold-light transition-all"
                   style={{ width: `${stats?.readingProgress ?? 68}%` }}/>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <FiBook size={9}/> {stats?.booksRead ?? 12}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-eof-crimson-light">
            <FiTrendingUp size={9}/> {stats?.streak ?? 7}d
          </span>
          <span className="flex items-center gap-1 text-[10px] text-eof-gold/70">
            <FiStar size={9}/> {stats?.tier ?? 'MEMBER'}
          </span>
        </div>
      </div>
    </div>
  );
}

function LargeWidget({ book, stats, recentBooks = [] }) {
  const recent = recentBooks.length > 0 ? recentBooks.slice(0, 3) : [
    { title: 'The Alchemist',   author: 'Paulo Coelho' },
    { title: 'Think & Grow Rich', author: 'Napoleon Hill' },
    { title: 'Atomic Habits',   author: 'James Clear' },
  ];

  return (
    <div className="relative w-[329px] h-[345px] rounded-[22px] overflow-hidden flex flex-col"
         style={{ background: 'linear-gradient(145deg, #1A1208, #0D0D0D)', border: '1px solid rgba(212,175,55,0.20)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <EOFMark size={24} />
          <div>
            <p className="text-white text-[12px] font-semibold font-serif leading-none">EOF Library</p>
            <p className="text-eof-muted text-[9px] mt-0.5 leading-none">Digital Library</p>
          </div>
        </div>
        <span className="badge badge-gold text-[8px] py-0.5 px-2">{stats?.tier ?? 'MEMBER'}</span>
      </div>

      {/* Current read */}
      <div className="flex gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-yellow-900/40 to-black flex items-center justify-center">
          {book?.coverImage
            ? <img src={book.coverImage} alt="" className="w-full h-full object-cover"/>
            : <FiBook className="text-eof-gold/40" size={18}/>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <div>
            <p className="text-[9px] text-eof-crimson-light font-semibold uppercase tracking-wider">Now Reading</p>
            <p className="text-white text-[12px] font-serif font-semibold leading-tight truncate mt-0.5">
              {book?.title ?? 'Atomic Habits'}
            </p>
            <p className="text-eof-muted text-[10px]">{book?.author ?? 'James Clear'}</p>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-gray-600">Chapter {stats?.currentChapter ?? 8}</span>
              <span className="text-[9px] text-eof-gold font-bold">{stats?.readingProgress ?? 68}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-eof-gold to-eof-gold-light"
                   style={{ width: `${stats?.readingProgress ?? 68}%` }}/>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <div className="w-9 h-9 rounded-full bg-eof-gold/10 border border-eof-gold/30 flex items-center justify-center">
            <FiPlay className="text-eof-gold ml-0.5" size={14}/>
          </div>
        </div>
      </div>

      {/* Recent books list */}
      <div className="flex-1 px-4 py-2 flex flex-col gap-0.5">
        <p className="text-[9px] font-semibold tracking-widest text-eof-muted uppercase mb-1.5">Recently Added</p>
        {recent.map((b, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-white/4 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-eof-gold/40 flex-shrink-0"/>
            <p className="flex-1 text-[11px] text-gray-300 truncate font-medium">{b.title}</p>
            <p className="text-[10px] text-eof-muted truncate max-w-[80px]">{b.author}</p>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-white/5">
        <div className="text-center">
          <p className="text-eof-gold text-[16px] font-bold font-serif leading-none">{stats?.booksRead ?? 12}</p>
          <p className="text-eof-muted text-[9px] mt-0.5 uppercase tracking-wide">Read</p>
        </div>
        <div className="w-px h-6 bg-white/8"/>
        <div className="text-center">
          <p className="text-eof-crimson-light text-[16px] font-bold font-serif leading-none">{stats?.streak ?? 7}</p>
          <p className="text-eof-muted text-[9px] mt-0.5 uppercase tracking-wide">Day Streak</p>
        </div>
        <div className="w-px h-6 bg-white/8"/>
        <div className="text-center">
          <p className="text-white text-[16px] font-bold font-serif leading-none">{stats?.hoursRead ?? 24}</p>
          <p className="text-eof-muted text-[9px] mt-0.5 uppercase tracking-wide">Hours</p>
        </div>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * @param {{ size?: 'small'|'medium'|'large', book?: object, stats?: object, recentBooks?: object[], className?: string }} props
 */
export default function AppWidget({ size = 'medium', book, stats, recentBooks, className = '' }) {
  const Widget = size === 'small' ? SmallWidget
               : size === 'large' ? LargeWidget
               : MediumWidget;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${className}`}
    >
      <Widget book={book} stats={stats} recentBooks={recentBooks}/>
    </motion.div>
  );
}

// Named exports for embedding individual sizes directly
export { SmallWidget, MediumWidget, LargeWidget };

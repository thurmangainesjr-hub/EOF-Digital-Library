import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import BookCoverArt, { THEMES } from '../components/BookCoverArt';
import UploadModal from '../components/UploadModal';
import AgentAvatarCard from '../components/AgentAvatarCard';
import AgentFullPanel from '../components/AgentFullPanel';
import { AGENT_SYSTEMS } from '../data/agentData';
import { LargeGroitWidget, MediumGroitWidget } from '../components/Widget/GroitAppWidget';
import {
  FiBook, FiUsers, FiTrendingUp, FiStar, FiUpload,
  FiPlay, FiBookOpen, FiGlobe, FiRadio, FiCommand,
  FiChevronLeft, FiChevronRight, FiPlus, FiCheck,
  FiBookmark, FiHeart, FiInfo, FiZap, FiArrowRight
} from 'react-icons/fi';

const LIBRARY_SYSTEM = AGENT_SYSTEMS.find(s => s.id === 'library');

// ─── Featured hero books (for when API has no data) ──────────
const FEATURED = [
  { id: 'h1', title: 'The Freedom Blueprint',    author: 'Marcus J. Freeman',   theme: 'crimsonGold',  genre: 'Self-Help',   year: 2024, rating: 4.9, pages: 312, desc: 'A revolutionary guide to designing a life of total freedom — financial, mental, and spiritual.', tags: ['bestseller'], hot: true  },
  { id: 'h2', title: 'Black Excellence Code',    author: 'Dr. Nia Washington',  theme: 'royalNavy',    genre: 'Culture',     year: 2024, rating: 4.8, pages: 428, desc: 'Uncover the hidden codes and principles that have driven Black excellence across centuries.', tags: ['award-winner'], isNew: true },
  { id: 'h3', title: 'The Wealth Architect',     author: 'Devon A. Cross',      theme: 'goldenSerif',  genre: 'Finance',     year: 2024, rating: 4.7, pages: 356, desc: 'Step-by-step framework for building generational wealth from scratch.', tags: ['bestseller'], hot: true },
];

const RECENT_MOCK = [
  { id: 'r1',  title: 'Atomic Discipline',       author: 'Carter J. Wells',     theme: 'steelBlue',    genre: 'Self-Help',   year: 2024, rating: 4.8, isNew: true  },
  { id: 'r2',  title: 'Build an Empire',         author: 'Ricky T. Pearson',    theme: 'goldenSerif',  genre: 'Business',    year: 2024, rating: 4.9, hot: true    },
  { id: 'r3',  title: 'Queens of the Diaspora',  author: 'Aminata Diallo',      theme: 'roseCopper',   genre: 'Biography',   year: 2024, rating: 4.8, isNew: true  },
  { id: 'r4',  title: 'Morning Magic',           author: 'Serena T. Vaughan',   theme: 'sunsetAmber',  genre: 'Productivity',year: 2024, rating: 4.6, isNew: true  },
  { id: 'r5',  title: 'The Black CEO',           author: 'Dr. Rochelle Grant',  theme: 'midnightSlate',genre: 'Leadership',  year: 2023, rating: 4.9, hot: true    },
  { id: 'r6',  title: 'Her Legacy',              author: 'Jasmine A. Carter',   theme: 'roseCopper',   genre: 'Biography',   year: 2024, rating: 4.9, isNew: true  },
  { id: 'r7',  title: 'Kingdom Mindset',         author: 'Bishop T. Crawford',  theme: 'crimsonGold',  genre: 'Spirituality',year: 2022, rating: 4.8, tags: ['bestseller'] },
  { id: 'r8',  title: 'Scale to 7 Figures',      author: 'Darius T. Banks',     theme: 'earthBrown',   genre: 'Business',    year: 2023, rating: 4.9, tags: ['bestseller'] },
  { id: 'r9',  title: 'The Confidence Code',     author: 'Brittany A. Monroe',  theme: 'cosmicPurple', genre: 'Self-Help',   year: 2023, rating: 4.8 },
  { id: 'r10', title: 'Unstoppable',             author: 'Tyrone K. Lawson',    theme: 'forestSage',   genre: 'Motivation',  year: 2023, rating: 4.7, tags: ['bestseller'] },
  { id: 'r11', title: 'E-Commerce Empire',       author: 'Lisa M. Jackson',     theme: 'oceanTeal',    genre: 'E-Commerce',  year: 2024, rating: 4.7, isNew: true  },
  { id: 'r12', title: 'Roots to Riches',         author: 'Dr. Kofi Asante',     theme: 'earthBrown',   genre: 'Culture',     year: 2023, rating: 4.9, tags: ['award-winner'] },
];

// ─── Toast ────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, add };
}
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto bg-gray-900/98 text-white border border-white/10"
            style={{ backdropFilter: 'blur(12px)' }}>
            <span>{t.type === 'error' ? '✕' : '✓'}</span>{t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Mini book card ───────────────────────────────────────────
function BookCard({ book, toast }) {
  const [hovered, setHovered] = useState(false);
  const [shelved, setShelved] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 cursor-pointer" style={{ width: 148 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/library/${book.id}`)}>
      <motion.div animate={{ scale: hovered ? 1.07 : 1, zIndex: hovered ? 10 : 1 }}
        transition={{ duration: 0.18 }} className="relative">
        <BookCoverArt book={book} size="md" />
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.13 }}
              className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-2 px-2"
              style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(3px)' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => navigate(`/library/${book.id}`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-black hover:brightness-110 transition-all"
                style={{ background: '#D4AF37' }}>
                <FiBookOpen size={12} /> Read
              </button>
              <button onClick={() => toast.add('🎧 Starting audiobook...')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-white bg-white/15 hover:bg-white/25 transition-all">
                <FiPlay size={11} /> Listen
              </button>
              <button onClick={() => { setShelved(true); toast.add('✓ Added to My Reading List'); }}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all ${shelved ? 'bg-green-700 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {shelved ? <FiCheck size={11} /> : <FiPlus size={11} />} Shelf
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="mt-2 px-0.5">
        <p className="text-xs text-gray-300 font-medium leading-tight truncate">{book.title}</p>
        <p className="text-[11px] text-gray-600 truncate mt-0.5">{book.author}</p>
      </div>
    </div>
  );
}

// ─── Scroll row ───────────────────────────────────────────────
function ScrollRow({ title, books, toast, badge }) {
  const ref = useRef();
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const update = () => {
    const el = ref.current; if (!el) return;
    setCanL(el.scrollLeft > 10);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };
  const go = dir => ref.current?.scrollBy({ left: dir * 600, behavior: 'smooth' });

  return (
    <section className="mb-6 group/row">
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
          {badge && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest text-white"
              style={{ background: '#C0392B' }}>{badge}</span>
          )}
        </div>
        <Link to="/library" className="text-xs text-gray-600 hover:text-yellow-500 transition-colors flex items-center gap-1">
          See All <FiChevronRight size={12} />
        </Link>
      </div>
      <div className="relative">
        <AnimatePresence>
          {canL && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => go(-1)}
              className="absolute left-0 top-8 z-10 w-10 h-28 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-lg"
              style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.97), transparent)' }}>
              <FiChevronLeft size={22} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        <div ref={ref} onScroll={update} className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-2">
          {books.map(b => <BookCard key={b.id} book={b} toast={toast} />)}
        </div>
        <AnimatePresence>
          {canR && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => go(1)}
              className="absolute right-0 top-8 z-10 w-10 h-28 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-lg"
              style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.97), transparent)' }}>
              <FiChevronRight size={22} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Mini hero ────────────────────────────────────────────────
function MiniHero({ books, onUpload, toast }) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const book = books[active];
  const theme = THEMES[book?.theme] || THEMES.goldenSerif;

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % books.length), 6000);
    return () => clearInterval(t);
  }, [books.length]);

  return (
    <div className="relative overflow-hidden" style={{ minHeight: '52vh', background: '#090909' }}>
      {/* Ambient glow */}
      <AnimatePresence mode="sync">
        <motion.div key={`glow-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 18% 55%, ${theme.a}cc 0%, transparent 50%), radial-gradient(ellipse at 78% 15%, ${theme.accent}16 0%, transparent 40%), #090909` }} />
      </AnimatePresence>
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0D0D0D, transparent)' }} />

      <div className="relative z-10 flex items-center justify-between px-6 md:px-12" style={{ minHeight: '52vh' }}>
        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div key={`t-${active}`}
            initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 22 }} transition={{ duration: 0.42 }}
            className="flex-1 max-w-lg py-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: theme.accent + '22', color: theme.accent, border: `1px solid ${theme.accent}44` }}>
                {book.genre}
              </span>
              {book.hot && <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-900/50 text-orange-400 border border-orange-800/50">🔥 Trending</span>}
              {book.isNew && <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800/50">✦ New</span>}
              {book.tags?.includes('bestseller') && <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-900/50 text-yellow-400 border border-yellow-800/50">★ Bestseller</span>}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-white leading-tight mb-2">{book.title}</h1>
            <p className="text-gray-400 text-sm mb-1">by <span className="text-gray-200 font-semibold">{book.author}</span></p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md line-clamp-2">{book.desc}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { navigate(`/library/${book.id}`); toast.add('📖 Opening book...'); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-black hover:brightness-110 transition-all"
                style={{ background: '#D4AF37', boxShadow: `0 4px 20px ${theme.accent}40` }}>
                <FiBookOpen size={15} /> Read Now
              </button>
              <button onClick={onUpload}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-white/15 text-gray-300 hover:border-white/30 hover:text-white transition-all">
                <FiUpload size={14} /> Upload Your Book
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cover */}
        <AnimatePresence mode="wait">
          <motion.div key={`c-${active}`}
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.48 }}
            className="hidden md:flex py-12 flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/library/${book.id}`)}>
            <div style={{ filter: `drop-shadow(0 24px 50px ${theme.accent}55)` }}>
              <BookCoverArt book={book} size="hero" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-7 left-6 md:left-12 z-20 flex gap-2">
        {books.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 22 : 7, height: 7, background: i === active ? theme.accent : 'rgba(255,255,255,0.18)' }} />
        ))}
      </div>
    </div>
  );
}

// ─── Continue reading card ────────────────────────────────────
function ContinueCard({ session, toast }) {
  const r = 14; const circ = 2 * Math.PI * r; const dash = (session.percentComplete / 100) * circ;
  const book = { id: session.productId, title: session.product?.title, author: session.product?.author, theme: 'steelBlue' };
  return (
    <div className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-200"
      style={{ width: 234, background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      <div className="flex items-center gap-3 p-3">
        <BookCoverArt book={book} size="xs" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{session.product?.title}</p>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{session.product?.author}</p>
        </div>
        <svg width="36" height="36" viewBox="0 0 36 36" className="flex-shrink-0">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#2A2A2A" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke="#D4AF37" strokeWidth="3"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 18 18)" />
          <text x="18" y="22" textAnchor="middle" fontSize="8" fill="#D4AF37" fontWeight="bold">{session.percentComplete}%</text>
        </svg>
      </div>
      <div className="mx-3 mb-3">
        <div className="w-full h-[2px] rounded-full bg-white/5 mb-2">
          <div className="h-full rounded-full" style={{ width: `${session.percentComplete}%`, background: '#D4AF37' }} />
        </div>
        <Link to={`/reader/${session.productId}`}
          className="block w-full py-2 rounded-lg text-xs font-bold text-black text-center hover:brightness-110 transition-all"
          style={{ background: '#D4AF37' }}>
          Continue Reading
        </Link>
      </div>
    </div>
  );
}

// ─── Upload CTA card ──────────────────────────────────────────
function UploadCTA({ onUpload }) {
  return (
    <div className="mx-6 mb-8">
      <div className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, #1a0800 0%, #0d0500 50%, #110a00 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-black" style={{ background: '#D4AF37' }}>LAUNCH READY</span>
          </div>
          <h3 className="font-serif text-xl font-black text-white mb-1">Ready to publish your book?</h3>
          <p className="text-sm text-gray-400 max-w-md">Upload your PDF, EPUB, or MOBI file and add it to the EOF Digital Library. Reach thousands of readers instantly.</p>
        </div>
        <button onClick={onUpload}
          className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-black text-black hover:brightness-110 transition-all"
          style={{ background: '#D4AF37', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}>
          <FiUpload size={16} /> Upload Book Now
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isAuthenticated, isMember } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [openAgent, setOpenAgent] = useState(null);
  const toast = useToast();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try { const r = await api.get('/products/stats'); return r.data.data; } catch { return null; }
    }
  });

  const { data: recentBooks } = useQuery({
    queryKey: ['recent-books'],
    queryFn: async () => {
      try {
        const r = await api.get('/products?limit=12');
        return r.data.data?.products || [];
      } catch { return []; }
    }
  });

  const { data: readingProgress } = useQuery({
    queryKey: ['reading-progress'],
    queryFn: async () => {
      try { const r = await api.get('/reading/current'); return r.data.data; } catch { return []; }
    },
    enabled: isAuthenticated,
  });

  // Merge API books with mock, deduplicate by id
  const displayBooks = [
    ...uploadedBooks.map((b, i) => ({
      id: `upload-${i}`, title: b.title, author: b.author,
      theme: ['goldenSerif','crimsonGold','royalNavy','forestSage'][i % 4],
      isNew: true, genre: b.genre || 'New Upload',
    })),
    ...(recentBooks?.length > 0
      ? recentBooks.map(b => ({ ...b, theme: b.theme || 'steelBlue' }))
      : RECENT_MOCK),
  ];

  const statItems = [
    { label: 'Books',        value: stats?.totalBooks  || displayBooks.length || '12+' },
    { label: 'Creators',     value: stats?.creators    || '1+'     },
    { label: 'Adaptations',  value: stats?.adaptations || '500+'   },
    { label: 'Griot Projects', value: stats?.griotProjects || '320+' },
  ];

  const QUICK_LINKS = [
    { to: '/library',       icon: FiBook,    label: 'Library',        color: '#2E86AB' },
    { to: '/story-time',    icon: FiRadio,   label: 'Story Time',     color: '#9B59B6' },
    { to: '/gutenberg',     icon: FiGlobe,   label: 'Gutenberg',      color: '#52B788' },
    { to: '/command-center',icon: FiCommand, label: 'Command Center', color: '#C0392B' },
    { to: '/bookshelves',   icon: FiBookmark,label: 'My Shelf',       color: '#D4AF37' },
    { to: '/membership',    icon: FiStar,    label: 'Membership',     color: '#F4A261' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
      {/* ── Compact stats strip ─────────────────────────────── */}
      <div className="flex items-center gap-6 px-6 py-2.5 border-b border-white/5 overflow-x-auto scrollbar-hide"
        style={{ background: 'rgba(13,13,13,0.96)' }}>
        {statItems.map(s => (
          <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-black text-white">{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
        <div className="flex-1" />
        {/* Greeting pill */}
        <div className="flex-shrink-0 text-xs text-gray-500">
          {user ? `Hey, ${user.displayName || 'Reader'} 👋` : 'EOF Digital Library'}
        </div>
        {/* Quick upload in strip */}
        <button onClick={() => setShowUpload(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black hover:brightness-110 transition-all"
          style={{ background: '#D4AF37' }}>
          <FiUpload size={11} /> Upload
        </button>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <MiniHero books={FEATURED} onUpload={() => setShowUpload(true)} toast={toast} />

      {/* ── Continue Reading ────────────────────────────────── */}
      {isAuthenticated && readingProgress?.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FiBookOpen size={14} className="text-yellow-500" /> Continue Reading
            </h2>
            <Link to="/bookshelves" className="text-xs text-gray-600 hover:text-yellow-500 transition-colors flex items-center gap-1">
              See All <FiChevronRight size={12} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2">
            {readingProgress.slice(0, 6).map(s => (
              <ContinueCard key={s.id} session={s} toast={toast} />
            ))}
          </div>
        </section>
      )}

      {/* ── Your uploads (if any) ──────────────────────────── */}
      {uploadedBooks.length > 0 && (
        <ScrollRow
          title="Just Uploaded"
          badge="NEW"
          books={uploadedBooks.map((b, i) => ({
            id: `upload-${i}`, title: b.title, author: b.author,
            theme: ['goldenSerif', 'crimsonGold', 'royalNavy', 'forestSage'][i % 4],
            isNew: true, genre: b.genre || 'Upload',
          }))}
          toast={toast}
        />
      )}

      {/* ── New in the Library ─────────────────────────────── */}
      <ScrollRow title="New in the Library" books={displayBooks.slice(0, 13)} toast={toast} badge="NEW" />

      {/* ── Trending ──────────────────────────────────────── */}
      <ScrollRow title="Trending Now" books={[...displayBooks].reverse().slice(0, 12)} toast={toast} badge="HOT" />

      {/* ── Upload CTA ────────────────────────────────────── */}
      <UploadCTA onUpload={() => setShowUpload(true)} />

      {/* ── Quick navigation ──────────────────────────────── */}
      <section className="px-6 mb-10">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <FiZap size={14} className="text-yellow-500" /> Quick Navigation
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {QUICK_LINKS.map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 duration-200 text-center group"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: color + '22' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs text-gray-400 font-medium group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Library AI Team ───────────────────────────────── */}
      <section className="px-6 mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>📚</span> Meet the Library Team
            </h2>
            <p className="text-xs text-gray-500">Four permanent AI agents. Click any character to open their workspace.</p>
          </div>
          <span className="text-[10px] text-gray-600 hidden sm:block">{LIBRARY_SYSTEM?.agents.length} core agents</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {LIBRARY_SYSTEM?.agents.map((agent, i) => (
            <AgentAvatarCard
              key={agent.id}
              agent={agent}
              systemId="library"
              system={LIBRARY_SYSTEM}
              minTier={LIBRARY_SYSTEM.minTier}
              index={i}
              onClick={() => setOpenAgent(agent)}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mr-1">Spawnable helpers:</span>
          {LIBRARY_SYSTEM?.helpers.map(h => (
            <span key={h} className="text-[10px] px-2.5 py-1 rounded-full bg-white/4 border border-white/8 text-gray-500">
              ⚡ {h}
            </span>
          ))}
        </div>
      </section>

      {/* ── Griot AI Studio widget section ───────────────── */}
      <section className="px-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4A0E4E)' }}>🌀</div>
            <h2 className="text-sm font-bold text-white">Griot AI Studio</h2>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
              Live
            </span>
          </div>
          <Link to="/griot" className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: '#7C3AED' }}>
            Open Studio <FiArrowRight size={11}/>
          </Link>
        </div>

        {/* Widget row — large on the left, two mediums stacked right */}
        <div className="flex flex-wrap gap-4 items-start">
          {/* Large widget */}
          <Link to="/griot" className="flex-shrink-0 block hover:brightness-110 transition-all">
            <LargeGroitWidget/>
          </Link>

          {/* Two medium widgets stacked */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link to="/griot" className="block hover:brightness-110 transition-all">
              <MediumGroitWidget
                stats={{
                  currentProject: { title: 'The Freedom Blueprint', type: 'Audiobook', icon: '🎧', status: 'In Progress' },
                  recentProjects: [
                    { title: 'Black Excellence Doc', icon: '📽️', status: 'In Progress' },
                    { title: 'Afrofuture Rising',    icon: '🎮', status: 'Complete'    },
                    { title: 'Sound of the South',   icon: '🎙️', status: 'In Progress' },
                  ],
                  progress: 72,
                }}
              />
            </Link>
            <Link to="/film-studio" className="block hover:brightness-110 transition-all">
              <MediumGroitWidget
                stats={{
                  currentProject: { title: 'Black Excellence Doc', type: 'Documentary', icon: '📽️', status: 'In Progress' },
                  recentProjects: [
                    { title: 'The Freedom Blueprint', icon: '🎧', status: 'Complete'    },
                    { title: 'Afrofuture Rising',     icon: '🎮', status: 'Complete'    },
                    { title: 'Sound of the South',    icon: '🎙️', status: 'In Progress' },
                  ],
                  progress: 45,
                }}
              />
            </Link>
          </div>

          {/* Info panel */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-3">
            <div className="rounded-2xl border p-4"
              style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#7C3AED' }}>
                What is Griot AI?
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Griot AI transforms books and stories into 6 output formats — audiobooks, screenplays, games, podcasts, graphic novels, and documentaries — using AI agents.
              </p>
            </div>
            {[
              { emoji: '🎧', label: 'Audiobook Studio',  path: '/griot',      count: '247 made' },
              { emoji: '🎬', label: 'Film Studio',        path: '/film-studio',count: '89 scripts' },
              { emoji: '🎵', label: 'Music Studio',       path: '/music-studio',count: '12 sessions' },
            ].map(item => (
              <Link key={item.label} to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:bg-white/5"
                style={{ borderColor: 'rgba(124,58,237,0.18)', background: 'rgba(124,58,237,0.04)' }}>
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-600">{item.count}</p>
                </div>
                <FiArrowRight size={12} className="text-gray-600"/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Library agent full panel ──────────────────────── */}
      {openAgent && (
        <AgentFullPanel
          agent={openAgent}
          systemId="library"
          system={LIBRARY_SYSTEM}
          minTier={LIBRARY_SYSTEM?.minTier || 'free'}
          onClose={() => setOpenAgent(null)}
        />
      )}

      {/* ── Upload modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            key="upload"
            onClose={() => setShowUpload(false)}
            onSuccess={book => {
              setUploadedBooks(p => [book, ...p]);
              toast.add(`📚 "${book.title}" added to your library!`);
              setShowUpload(false);
            }}
          />
        )}
      </AnimatePresence>

      <ToastStack toasts={toast.toasts} />
    </div>
  );
}

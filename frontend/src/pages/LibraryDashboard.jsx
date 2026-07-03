import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook, FiImage, FiVideo, FiMusic, FiFileText,
  FiHeart, FiClock, FiTrendingUp, FiUpload, FiStar,
  FiGrid, FiList, FiSearch, FiDownload, FiBookmark,
  FiZap, FiGlobe, FiPlay,
} from 'react-icons/fi';

// ── Brand colors ──────────────────────────────────────────────────────────────
const GOLD    = '#D4AF37';
const CRIMSON = '#8B1A1A';

// ── Data ──────────────────────────────────────────────────────────────────────

const ASSET_TYPES = [
  { id: 'books',     label: 'Books',     icon: FiBook,     color: GOLD,      count: 248,  size: '12.4 GB', new: 14 },
  { id: 'audio',     label: 'Audiobooks',icon: FiMusic,    color: '#60A5FA', count: 87,   size: '38.2 GB', new: 6  },
  { id: 'video',     label: 'Video',     icon: FiVideo,    color: '#EF4444', count: 34,   size: '142 GB',  new: 3  },
  { id: 'docs',      label: 'Documents', icon: FiFileText, color: '#10B981', count: 126,  size: '4.1 GB',  new: 9  },
];

const RECENTLY_ADDED = [
  { id: 1, title: 'The Freedom Blueprint',  author: 'Marcus J. Freeman',  type: 'Book',      color: GOLD,      icon: '📖', date: 'Jun 11' },
  { id: 2, title: 'Kingdom Mindset',        author: 'Bishop T. Crawford', type: 'Audiobook', color: '#60A5FA', icon: '🎧', date: 'Jun 10' },
  { id: 3, title: 'Build an Empire',        author: 'Ricky T. Pearson',   type: 'Book',      color: GOLD,      icon: '📖', date: 'Jun 10' },
  { id: 4, title: 'EOF Masterclass S1',     author: 'EOF Studios',        type: 'Video',     color: '#EF4444', icon: '🎬', date: 'Jun 9'  },
  { id: 5, title: 'Creator Economy Guide',  author: 'EOF Editorial',      type: 'Document',  color: '#10B981', icon: '📄', date: 'Jun 8'  },
  { id: 6, title: 'Black Excellence Code',  author: 'Dr. Nia Washington', type: 'Book',      color: GOLD,      icon: '📖', date: 'Jun 7'  },
];

const FAVORITES = [
  { id: 1, title: 'Atomic Discipline',     author: 'Carter J. Wells',    rating: 4.8, type: 'Book',      icon: '📖', color: GOLD      },
  { id: 2, title: 'Roots to Riches',       author: 'Dr. Kofi Asante',    rating: 4.9, type: 'Book',      icon: '📖', color: GOLD      },
  { id: 3, title: 'Her Legacy',            author: 'Jasmine A. Carter',  rating: 4.9, type: 'Audiobook', icon: '🎧', color: '#60A5FA' },
  { id: 4, title: 'Scale to 7 Figures',    author: 'Darius T. Banks',    rating: 4.9, type: 'Book',      icon: '📖', color: GOLD      },
];

const STORAGE = {
  total: 500,
  used: 197,
  breakdown: [
    { label: 'Books',      gb: 12.4,  color: GOLD,      pct: 6  },
    { label: 'Audiobooks', gb: 38.2,  color: '#60A5FA', pct: 19 },
    { label: 'Video',      gb: 142,   color: '#EF4444', pct: 72 },
    { label: 'Documents',  gb: 4.1,   color: '#10B981', pct: 2  },
  ],
};

const QUICK_ACTIONS = [
  { label: 'Browse Library',    icon: FiBook,     color: GOLD,      path: '/library'             },
  { label: 'My Bookshelves',    icon: FiGrid,     color: '#A78BFA', path: '/bookshelves'         },
  { label: 'Story Time',        icon: FiPlay,     color: '#EF4444', path: '/story-time'          },
  { label: 'Gutenberg',         icon: FiGlobe,    color: '#60A5FA', path: '/gutenberg'           },
  { label: 'Creator Studio',    icon: FiZap,      color: '#F59E0B', path: '/creator'             },
  { label: 'Command Center',    icon: FiBookmark, color: '#10B981', path: '/command-center'      },
  { label: 'EOF Flipbooks',     icon: FiBook,     color: '#2563EB', path: '/university/flipbook' },
];

const READING_ACTIVITY = [
  { day: 'Mon', minutes: 45  },
  { day: 'Tue', minutes: 0   },
  { day: 'Wed', minutes: 80  },
  { day: 'Thu', minutes: 30  },
  { day: 'Fri', minutes: 65  },
  { day: 'Sat', minutes: 120 },
  { day: 'Sun', minutes: 20  },
];
const MAX_MIN = Math.max(...READING_ACTIVITY.map(d => d.minutes));

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, sub, color }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl"
      style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={17} color={color} />
      </div>
      <div className="text-[24px] font-black text-white leading-none mt-1">{value}</div>
      <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      {sub && <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{sub}</div>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LibraryDashboard() {
  const [search, setSearch] = useState('');
  const totalAssets = ASSET_TYPES.reduce((s, a) => s + a.count, 0);
  const totalNew    = ASSET_TYPES.reduce((s, a) => s + a.new,   0);
  const usedPct     = Math.round((STORAGE.used / STORAGE.total) * 100);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#080808' }}>

      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3 px-5 flex-shrink-0"
        style={{ height: 54, background: '#060606', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(145deg,#D4AF37,#A8892A,#7a6020)', boxShadow: '0 4px 14px rgba(212,175,55,0.35)' }}>
            <span className="text-base font-serif font-black text-black leading-none">E</span>
          </div>
          <div>
            <p className="text-[13px] font-black text-white leading-none">EOF Library</p>
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Asset Command Center</p>
          </div>
        </div>

        <div className="w-px h-5 mx-1 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-xl flex-1 max-w-xs"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', height: 32 }}>
          <FiSearch size={13} color="rgba(255,255,255,0.3)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets, books, media…"
            className="flex-1 bg-transparent text-[11px] outline-none"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          />
        </div>

        <div className="flex-1" />

        {/* New badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.28)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          <span className="text-[10px] font-bold" style={{ color: GOLD }}>{totalNew} New This Week</span>
        </div>

        <Link to="/library"
          className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:brightness-110 flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.28)', color: '#fde68a' }}>
          Browse Library →
        </Link>

        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#A8892A,#D4AF37)', border: '1px solid rgba(212,175,55,0.4)' }}>
          📚
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-white">Library Dashboard</h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {totalAssets} total assets · {totalNew} added this week · {usedPct}% storage used
            </p>
          </div>
          <Link to="/library"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black transition-all hover:brightness-110 flex-shrink-0"
            style={{ background: `linear-gradient(135deg,rgba(212,175,55,0.2),rgba(139,26,26,0.15))`, border: `1px solid rgba(212,175,55,0.35)`, color: '#fde68a' }}>
            <FiUpload size={14} /> Upload Asset
          </Link>
        </div>

        {/* Asset Type Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {ASSET_TYPES.map(a => (
            <div key={a.id} className="flex flex-col gap-2.5 p-4 rounded-2xl transition-all hover:brightness-105 cursor-pointer"
              style={{ background: '#0d0d0d', border: `1px solid ${a.color}18` }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${a.color}15`, border: `1px solid ${a.color}28` }}>
                  <a.icon size={17} color={a.color} />
                </div>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
                  +{a.new} new
                </span>
              </div>
              <div className="text-[24px] font-black text-white leading-none">{a.count}</div>
              <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{a.label}</div>
              <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{a.size}</div>
            </div>
          ))}
        </div>

        {/* Recently Added + Favorites */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Recently Added */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Recently Added
              </p>
              <Link to="/library" className="text-[10px] font-semibold hover:text-white transition-colors"
                style={{ color: `rgba(212,175,55,0.65)` }}>
                View All →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {RECENTLY_ADDED.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}22` }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.author}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[8px] font-bold" style={{ color: item.color }}>{item.type}</span>
                    <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Favorites */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Favorites
              </p>
              <Link to="/bookshelves" className="text-[10px] font-semibold hover:text-white transition-colors"
                style={{ color: `rgba(212,175,55,0.65)` }}>
                View All →
              </Link>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {FAVORITES.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: '#0d0d0d', border: `1px solid ${item.color}12` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}22` }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.author}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <FiStar size={10} color={GOLD} fill={GOLD} />
                    <span className="text-[10px] font-black" style={{ color: GOLD }}>{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reading Activity chart */}
            <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Reading Activity — This Week
            </p>
            <div className="flex items-end gap-2 px-2 py-3 rounded-2xl"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', height: 90 }}>
              {READING_ACTIVITY.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-t-sm"
                    style={{
                      height: `${Math.round((d.minutes / MAX_MIN) * 50)}px`,
                      background: d.minutes > 0 ? `linear-gradient(to top, ${GOLD}, rgba(212,175,55,0.5))` : 'rgba(255,255,255,0.05)',
                      minHeight: 3,
                    }} />
                  <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Storage Analytics */}
        <section className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Storage Analytics
          </p>
          <div className="grid grid-cols-2 gap-4">

            {/* Storage bar */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">Total Storage Used</span>
                <span className="text-[11px] font-black" style={{ color: GOLD }}>{STORAGE.used} GB / {STORAGE.total} GB</span>
              </div>
              {/* Main bar */}
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {STORAGE.breakdown.map((s, i) => (
                  <div key={i} className="h-full rounded-sm"
                    style={{ width: `${s.pct}%`, background: s.color, opacity: 0.85 }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {STORAGE.breakdown.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {s.label} <span style={{ color: s.color }}>{s.gb} GB</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <span>Used: {STORAGE.used} GB ({usedPct}%)</span>
                <span>Available: {STORAGE.total - STORAGE.used} GB</span>
              </div>
            </div>

            {/* Breakdown tiles */}
            <div className="grid grid-cols-2 gap-2">
              {STORAGE.breakdown.map((s, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-2xl"
                  style={{ background: '#0d0d0d', border: `1px solid ${s.color}15` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</span>
                    <span className="text-[8px] font-black" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.pct}%</span>
                  </div>
                  <div className="text-[18px] font-black text-white">{s.gb} GB</div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Quick Actions
          </p>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={i} to={a.path}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: '#0d0d0d', border: `1px solid ${a.color}18`, textDecoration: 'none' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}>
                  <a.icon size={16} color={a.color} />
                </div>
                <span className="text-[11px] font-bold text-white">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

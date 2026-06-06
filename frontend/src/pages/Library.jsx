import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  FiSearch, FiBook, FiStar, FiUser, FiPlay, FiBookOpen,
  FiMessageCircle, FiChevronRight, FiChevronLeft, FiAward,
  FiTrendingUp, FiGlobe, FiZap, FiUsers, FiX
} from 'react-icons/fi';
import BookCover from '../components/BookCover';
import AIAgent from '../components/AIAgent';
import ChatRoom from '../components/ChatRoom';
import BookSnippet from '../components/BookSnippet';

// ─── Mock data for sections not yet backed by API ───────────────────────────

const FEATURED = [
  {
    id: 'f1', title: 'The Alchemist', author: 'Paulo Coelho',
    description: 'A journey of self-discovery through the Egyptian desert — one of the best-selling books in history.',
    coverImage: null, badge: 'Editor\'s Pick', genres: ['Fiction', 'Philosophy']
  },
  {
    id: 'f2', title: 'Atomic Habits', author: 'James Clear',
    description: 'Tiny changes, remarkable results. The proven framework for building good habits and breaking bad ones.',
    coverImage: null, badge: 'Bestseller', genres: ['Self-Help', 'Productivity']
  },
  {
    id: 'f3', title: 'Think and Grow Rich', author: 'Napoleon Hill',
    description: 'The philosophy of achievement that has created more millionaires than any other book.',
    coverImage: null, badge: 'Classic', genres: ['Business', 'Mindset']
  },
];

const COURSES = [
  { id: 'c1', title: 'Financial Freedom 101', instructor: 'Marcus Webb', lessons: 12, level: 'Beginner', color: 'from-yellow-600 to-orange-600' },
  { id: 'c2', title: 'The Creator Economy', instructor: 'Nia Thomas', lessons: 8, level: 'Intermediate', color: 'from-purple-600 to-pink-600' },
  { id: 'c3', title: 'Black Wall Street Reborn', instructor: 'Devon King', lessons: 15, level: 'All Levels', color: 'from-green-600 to-teal-600' },
  { id: 'c4', title: 'Self-Publishing Mastery', instructor: 'Aaliyah Monroe', lessons: 10, level: 'Beginner', color: 'from-blue-600 to-indigo-600' },
];

const SPOTLIGHTS = [
  { id: 's1', name: 'Zora Neale Publishing', bio: 'Amplifying Black women\'s voices through fiction and memoir.', books: 4, followers: '12k', avatar: null },
  { id: 's2', name: 'Kingdom Pen', bio: 'Faith-based literature for the modern generation.', books: 7, followers: '8.3k', avatar: null },
  { id: 's3', name: 'The Griot Press', bio: 'Preserving African storytelling traditions in digital form.', books: 3, followers: '15k', avatar: null },
];

const ORIGINALS = [
  { id: 'o1', title: 'EOF Chronicles Vol. 1', subtitle: 'The Founding Story', coverImage: null, type: 'Exclusive' },
  { id: 'o2', title: 'Generational Wealth', subtitle: 'A Financial Novel', coverImage: null, type: 'Original' },
  { id: 'o3', title: 'The Liberation Code', subtitle: 'Tech & Culture', coverImage: null, type: 'Series' },
  { id: 'o4', title: 'Voices Unbound', subtitle: 'Poetry Collection', coverImage: null, type: 'Exclusive' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
          <Icon className="text-yellow-500" size={20} />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {linkTo && (
        <Link to={linkTo} className="flex items-center gap-1 text-sm text-yellow-500 hover:text-yellow-400 transition-colors">
          View all <FiChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function HorizontalScroll({ children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };
  return (
    <div className="relative group">
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-yellow-500/50"
      >
        <FiChevronLeft size={16} />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-yellow-500/50"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}

function BookCard({ book, index = 0, onPreview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-40 group"
    >
      <Link to={`/library/${book.id}`} className="block">
        <div className="relative mb-3">
          <BookCover title={book.title} author={book.author} coverImage={book.coverImage} size="lg" className="w-full shadow-lg" />
          <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2">
            {onPreview && (
              <button
                onClick={(e) => { e.preventDefault(); onPreview(book); }}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
              >
                <FiBookOpen className="text-white" size={16} />
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <FiPlay className="text-black ml-0.5" size={16} />
            </div>
          </div>
          {book.adaptationAllowed && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded font-medium">
              Adaptable
            </span>
          )}
          {book.gutenbergId && (
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
              Free
            </span>
          )}
        </div>
        <h3 className="text-white text-sm font-medium truncate group-hover:text-yellow-500 transition-colors leading-tight">{book.title}</h3>
        <p className="text-xs text-gray-400 truncate mt-0.5">{book.author}</p>
      </Link>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('sortBy', 'newest');
      const res = await api.get(`/products?${params}`);
      return res.data.data?.products || [];
    }
  });

  const { data: trending = [] } = useQuery({
    queryKey: ['products-trending'],
    queryFn: async () => {
      const res = await api.get('/products?sortBy=popular&limit=10');
      return res.data.data?.products || [];
    }
  });

  const { data: newReleases = [] } = useQuery({
    queryKey: ['products-new'],
    queryFn: async () => {
      const res = await api.get('/products?sortBy=newest&limit=10');
      return res.data.data?.products || [];
    }
  });

  const featured = FEATURED[featuredIndex];

  const handlePreview = (book) => setSelectedSnippet({ id: book.id, slug: book.slug });

  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen">
      {/* ── Hero / Search ─────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-[#0D0D0D] via-purple-950/20 to-[#0D0D0D] px-8 pt-10 pb-8 border-b border-white/5">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="font-serif text-5xl text-white mb-2 tracking-tight">
            EOF <span className="text-yellow-500">Library</span>
          </h1>
          <p className="text-gray-400 text-lg">Your gateway to knowledge, culture, and community</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto">
          <div className={`relative flex items-center rounded-2xl border transition-all duration-200 ${searchFocused ? 'border-yellow-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/10 bg-white/5'}`}>
            <FiSearch className="absolute left-5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search books, authors, courses, creators..."
              className="w-full pl-14 pr-5 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg rounded-2xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-5 text-gray-400 hover:text-white transition-colors">
                <FiX size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <div className="px-8 py-10 space-y-14">

        {/* ── Search Results ────────────────────────────────────────── */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SectionHeader icon={FiSearch} title={`Results for "${searchQuery}"`} subtitle={`${allProducts.length} found`} />
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : allProducts.length > 0 ? (
                <HorizontalScroll>
                  {allProducts.map((book, i) => (
                    <BookCard key={book.id} book={book} index={i} onPreview={handlePreview} />
                  ))}
                </HorizontalScroll>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FiBook size={40} className="mx-auto mb-3" />
                  <p>No results found. Try different keywords.</p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {!showSearchResults && (
          <>
            {/* ── Featured Books ───────────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SectionHeader icon={FiStar} title="Featured Books" subtitle="Handpicked by the EOF editorial team" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main feature card */}
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/20 bg-gradient-to-br from-yellow-950/30 to-black min-h-[260px] flex items-end">
                  <div className="absolute inset-0 opacity-10">
                    <BookCover title={featured.title} author={featured.author} coverImage={featured.coverImage} size="xl" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative p-8 flex gap-6 items-end w-full">
                    <div className="flex-shrink-0">
                      <BookCover title={featured.title} author={featured.author} coverImage={featured.coverImage} size="md" className="shadow-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">{featured.badge}</span>
                      <h3 className="font-serif text-2xl text-white mb-1">{featured.title}</h3>
                      <p className="text-yellow-400 text-sm mb-3">by {featured.author}</p>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{featured.description}</p>
                      <Link to={`/library/${featured.id}`} className="btn-primary text-sm py-2 px-5 inline-block rounded-lg">
                        Read Now
                      </Link>
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    {FEATURED.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFeaturedIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === featuredIndex ? 'bg-yellow-500 w-5' : 'bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Side list */}
                <div className="space-y-3">
                  {FEATURED.map((book, i) => (
                    <Link
                      key={book.id}
                      to={`/library/${book.id}`}
                      onClick={() => setFeaturedIndex(i)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${i === featuredIndex ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5 bg-white/3 hover:border-yellow-500/20 hover:bg-white/5'}`}
                    >
                      <BookCover title={book.title} author={book.author} size="sm" className="flex-shrink-0 shadow-md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-yellow-500 font-medium">{book.badge}</span>
                        </div>
                        <h4 className="text-white font-medium truncate group-hover:text-yellow-400 transition-colors">{book.title}</h4>
                        <p className="text-sm text-gray-400">{book.author}</p>
                        <div className="flex gap-1 mt-1">
                          {book.genres.map(g => (
                            <span key={g} className="text-xs bg-white/5 text-gray-500 px-2 py-0.5 rounded-full">{g}</span>
                          ))}
                        </div>
                      </div>
                      <FiChevronRight className="flex-shrink-0 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ── New Releases ─────────────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SectionHeader icon={FiZap} title="New Releases" subtitle="Fresh additions to the collection" linkTo="/library?sort=newest" />
              {newReleases.length > 0 ? (
                <HorizontalScroll>
                  {newReleases.map((book, i) => (
                    <BookCard key={book.id} book={book} index={i} onPreview={handlePreview} />
                  ))}
                </HorizontalScroll>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white/5 rounded-lg aspect-[2/3] mb-2" />
                      <div className="bg-white/5 rounded h-3 mb-1" />
                      <div className="bg-white/5 rounded h-2 w-2/3" />
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* ── Trending ─────────────────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SectionHeader icon={FiTrendingUp} title="Trending" subtitle="What the community is reading right now" linkTo="/library?sort=popular" />
              {trending.length > 0 ? (
                <HorizontalScroll>
                  {trending.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-shrink-0 w-44 group"
                    >
                      <Link to={`/library/${book.id}`} className="block">
                        <div className="relative mb-3">
                          <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center shadow-lg">
                            {i + 1}
                          </span>
                          <BookCover title={book.title} author={book.author} coverImage={book.coverImage} size="lg" className="w-full shadow-lg" />
                          <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                              <FiPlay className="text-black ml-0.5" size={16} />
                            </div>
                          </div>
                        </div>
                        <h3 className="text-white text-sm font-medium truncate group-hover:text-yellow-500 transition-colors">{book.title}</h3>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{book.author}</p>
                      </Link>
                    </motion.div>
                  ))}
                </HorizontalScroll>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white/5 rounded-lg aspect-[2/3] mb-2" />
                      <div className="bg-white/5 rounded h-3 mb-1" />
                      <div className="bg-white/5 rounded h-2 w-2/3" />
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* ── DIY University Courses ────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <SectionHeader icon={FiGlobe} title="DIY University" subtitle="Learn from creators and industry experts" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COURSES.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/40 group cursor-pointer hover:border-yellow-500/30 transition-all hover:-translate-y-1 duration-200"
                  >
                    <div className={`h-32 bg-gradient-to-br ${course.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                      <FiBookOpen className="text-white/40" size={48} />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1 group-hover:text-yellow-400 transition-colors">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">by {course.instructor}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <FiBook size={10} /> {course.lessons} lessons
                        </span>
                        <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{course.level}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-xl">
                        <FiPlay className="text-black ml-0.5" size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Creator Spotlight ────────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SectionHeader icon={FiUsers} title="Creator Spotlight" subtitle="Discover independent authors and publishers" linkTo="/creator" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SPOTLIGHTS.map((creator, i) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card p-5 group hover:border-yellow-500/40 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{creator.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="flex items-center gap-1"><FiBook size={10} /> {creator.books} books</span>
                          <span className="flex items-center gap-1"><FiUsers size={10} /> {creator.followers}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{creator.bio}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-500 font-medium flex items-center gap-1">
                        <FiAward size={12} /> Verified Creator
                      </span>
                      <button className="text-xs border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-full hover:bg-yellow-500/10 transition-colors">
                        Follow
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── EOF Originals ────────────────────────────────────── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <SectionHeader icon={FiAward} title="EOF Originals" subtitle="Exclusive content created for the EOF community" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ORIGINALS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="relative rounded-xl overflow-hidden border border-yellow-500/20 bg-gradient-to-b from-yellow-950/30 to-black aspect-[3/4] group cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-end p-4">
                      <div>
                        <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded mb-2">{item.type}</span>
                        <h3 className="text-white font-serif font-bold leading-tight group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 via-purple-900/20 to-black/60" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FiBook size={80} className="text-yellow-500" />
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-500/0 group-hover:bg-yellow-500 flex items-center justify-center transition-all">
                      <FiPlay className="text-black opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity" size={14} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

          </>
        )}
      </div>

      {/* ── Floating Buttons ─────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-72 flex gap-3 z-40">
        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${showChat ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          <FiMessageCircle size={24} />
        </button>
        <button
          onClick={() => setShowAgent(!showAgent)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${showAgent ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          <span className="text-2xl">📚</span>
        </button>
      </div>

      {/* ── Overlays ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed bottom-6 left-72 z-50">
            <ChatRoom roomType="library" roomName="Library" onClose={() => setShowChat(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAgent && <AIAgent agentType="librarian" onClose={() => setShowAgent(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSnippet && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8" onClick={() => setSelectedSnippet(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <BookSnippet bookSlug={selectedSnippet.slug} bookId={selectedSnippet.id} onClose={() => setSelectedSnippet(null)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Library;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import BookCover from '../components/BookCover';
import {
  FiBook, FiSearch, FiDownload, FiExternalLink,
  FiZap, FiGlobe, FiBookOpen, FiFilter, FiGrid, FiList
} from 'react-icons/fi';

function Gutenberg() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch Gutenberg books from our library
  const { data: books, isLoading } = useQuery({
    queryKey: ['gutenberg-books', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('source', 'GUTENBERG');
      if (searchQuery) params.append('search', searchQuery);
      const res = await api.get(`/products?${params}`);
      return res.data.data?.products || [];
    }
  });

  // Popular Gutenberg categories
  const categories = [
    { name: 'Classic Literature', icon: '📚', count: 1200 },
    { name: 'Science Fiction', icon: '🚀', count: 450 },
    { name: 'Philosophy', icon: '🧠', count: 320 },
    { name: 'History', icon: '📜', count: 890 },
    { name: 'Poetry', icon: '🎭', count: 650 },
    { name: 'Adventure', icon: '🗺️', count: 780 },
    { name: 'Mystery', icon: '🔍', count: 340 },
    { name: 'Romance', icon: '💕', count: 520 }
  ];

  // Featured public domain works
  const featuredWorks = [
    { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, gutenbergId: '1342' },
    { title: 'Frankenstein', author: 'Mary Shelley', year: 1818, gutenbergId: '84' },
    { title: 'Dracula', author: 'Bram Stoker', year: 1897, gutenbergId: '345' },
    { title: 'The Time Machine', author: 'H.G. Wells', year: 1895, gutenbergId: '35' },
    { title: 'Moby Dick', author: 'Herman Melville', year: 1851, gutenbergId: '2701' },
    { title: 'Alice in Wonderland', author: 'Lewis Carroll', year: 1865, gutenbergId: '11' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <FiGlobe className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-serif text-4xl text-white">Project Gutenberg</h1>
            <p className="text-gray-400">70,000+ Free Public Domain eBooks</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="card bg-blue-900/30 border-blue-500/30 mt-4">
          <div className="flex items-start gap-4">
            <FiBookOpen className="text-blue-400 mt-1" size={24} />
            <div>
              <h3 className="text-white font-medium mb-1">Free to Read, Free to Adapt</h3>
              <p className="text-gray-400 text-sm">
                All books from Project Gutenberg are in the public domain. You can read them for free
                and create adaptations through Griot AI without any licensing fees.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 70,000+ free books..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>
          <div className="flex rounded-lg overflow-hidden border border-blue-500/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-4 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-400'}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-4 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-400'}`}
            >
              <FiList />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="font-serif text-2xl text-white mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="card text-left hover:border-blue-500/50 group"
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500">{cat.count.toLocaleString()} books</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="font-serif text-2xl text-white mb-4">Featured Classics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredWorks.map((work, i) => (
            <motion.div
              key={work.gutenbergId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group"
            >
              <div className="relative mb-3">
                <BookCover
                  title={work.title}
                  author={work.author}
                  size="lg"
                  className="w-full"
                />
                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500">
                      <FiBookOpen size={18} />
                    </button>
                    <button className="p-2 rounded-full bg-yellow-500 text-black hover:bg-yellow-400">
                      <FiZap size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                {work.title}
              </h3>
              <p className="text-xs text-gray-500">{work.author}</p>
              <p className="text-xs text-gray-600">{work.year}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Library Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-white">In Our Library</h2>
          <span className="text-sm text-gray-400">{books?.length || 0} Gutenberg titles</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(books || []).map((book, i) => (
              <Link
                key={book.id}
                to={`/library/${book.id}`}
                className="group"
              >
                <div className="relative mb-3">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
                    size="lg"
                    className="w-full"
                  />
                  {/* Free badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-green-500 text-white text-xs">
                    Free
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate group-hover:text-blue-400">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500">{book.author}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(books || []).map((book) => (
              <Link
                key={book.id}
                to={`/library/${book.id}`}
                className="card flex gap-4 hover:border-blue-500/50"
              >
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Free</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">Gutenberg #{book.gutenbergId}</span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                      <FiZap size={10} /> Adaptable
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                    <FiBookOpen />
                  </button>
                  <a
                    href={`https://www.gutenberg.org/ebooks/${book.gutenbergId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                  >
                    <FiExternalLink />
                  </a>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!books || books.length === 0) && (
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl text-white mb-2">No Gutenberg books found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}
      </motion.div>

      {/* External link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <div className="card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-serif text-xl text-white mb-2">Explore More on Project Gutenberg</h3>
              <p className="text-gray-400">
                Access the complete library of 70,000+ free eBooks directly from Project Gutenberg.
              </p>
            </div>
            <a
              href="https://www.gutenberg.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap flex items-center gap-2"
            >
              <FiExternalLink /> Visit Gutenberg
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Gutenberg;

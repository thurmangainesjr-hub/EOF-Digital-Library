import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import BookCover from '../components/BookCover';
import {
  FiBook, FiSearch, FiDownload, FiExternalLink,
  FiZap, FiGlobe, FiBookOpen, FiFilter, FiGrid, FiList,
  FiChevronLeft, FiChevronRight, FiLoader, FiTrendingUp
} from 'react-icons/fi';

function Gutenberg() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [page, setPage] = useState(1);

  // Debounce search
  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  // Fetch books from real Gutenberg API
  const { data: booksData, isLoading, error } = useQuery({
    queryKey: ['gutenberg-books', debouncedSearch, selectedTopic, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedTopic) params.append('topic', selectedTopic);
      params.append('page', page);

      const res = await api.get(`/gutenberg/books?${params}`);
      return res.data.data;
    },
    keepPreviousData: true
  });

  // Fetch popular books
  const { data: popularData } = useQuery({
    queryKey: ['gutenberg-popular'],
    queryFn: async () => {
      const res = await api.get('/gutenberg/popular');
      return res.data.data?.books || [];
    }
  });

  const books = booksData?.books || [];
  const totalCount = booksData?.count || 0;
  const hasNextPage = !!booksData?.next;
  const hasPrevPage = !!booksData?.previous || page > 1;

  // Topics/Categories
  const topics = [
    { id: 'fiction', name: 'Fiction', icon: '📚' },
    { id: 'science fiction', name: 'Science Fiction', icon: '🚀' },
    { id: 'philosophy', name: 'Philosophy', icon: '🧠' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'poetry', name: 'Poetry', icon: '🎭' },
    { id: 'adventure', name: 'Adventure', icon: '🗺️' },
    { id: 'mystery', name: 'Mystery', icon: '🔍' },
    { id: 'romance', name: 'Romance', icon: '💕' }
  ];

  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId === selectedTopic ? null : topicId);
    setPage(1);
  };

  const handleBookClick = (book) => {
    // Navigate to a Gutenberg reader page
    navigate(`/gutenberg/read/${book.id}`);
  };

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
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search 70,000+ free books by title, author..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-blue-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
            />
            {isLoading && debouncedSearch && (
              <FiLoader className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" />
            )}
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

      {/* Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="font-serif text-xl text-white mb-4">Browse by Topic</h2>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                selectedTopic === topic.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white border border-blue-500/20'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.name}</span>
            </button>
          ))}
          {selectedTopic && (
            <button
              onClick={() => setSelectedTopic(null)}
              className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Clear Filter
            </button>
          )}
        </div>
      </motion.div>

      {/* Popular Books (when no search/filter) */}
      {!debouncedSearch && !selectedTopic && popularData && popularData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="font-serif text-2xl text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-400" /> Most Popular
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {popularData.slice(0, 6).map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="group cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <div className="relative mb-3">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
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
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-green-500 text-white text-xs">
                    Free
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{book.author}</p>
                <p className="text-xs text-gray-600">{book.downloadCount?.toLocaleString()} downloads</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results / All Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-white">
            {debouncedSearch ? `Results for "${debouncedSearch}"` :
             selectedTopic ? `${topics.find(t => t.id === selectedTopic)?.name} Books` :
             'Browse All Books'}
          </h2>
          <span className="text-sm text-gray-400">
            {totalCount > 0 ? `${totalCount.toLocaleString()} books found` : ''}
          </span>
        </div>

        {/* Error state */}
        {error && (
          <div className="card bg-red-900/30 border-red-500/30 mb-6">
            <p className="text-red-400">Failed to load books. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading books from Project Gutenberg...</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <div className="relative mb-3">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
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
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-green-500 text-white text-xs">
                    Free
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{book.author}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="card flex gap-4 hover:border-blue-500/50 cursor-pointer"
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
                  {book.subjects && book.subjects.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {book.subjects.slice(0, 3).join(' • ')}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Free</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      ID: {book.gutenbergId}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                      <FiZap size={10} /> Adaptable
                    </span>
                    {book.downloadCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {book.downloadCount.toLocaleString()} downloads
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBookClick(book); }}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                  >
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
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl text-white mb-2">No books found</h3>
            <p className="text-gray-400">
              {debouncedSearch ? 'Try a different search term' : 'Try selecting a different topic'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {(hasNextPage || hasPrevPage) && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrevPage}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-gray-400">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next <FiChevronRight />
            </button>
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
              <h3 className="font-serif text-xl text-white mb-2">About Project Gutenberg</h3>
              <p className="text-gray-400">
                Project Gutenberg is the oldest digital library, founded in 1971. It provides free access to
                over 70,000 eBooks, focusing on older literary works where copyright has expired.
              </p>
            </div>
            <a
              href="https://www.gutenberg.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap flex items-center gap-2"
            >
              <FiExternalLink /> Visit Gutenberg.org
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Gutenberg;

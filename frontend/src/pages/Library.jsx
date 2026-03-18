import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  FiSearch, FiFilter, FiGrid, FiList, FiBook,
  FiStar, FiUser, FiTag, FiChevronDown, FiPlay,
  FiMessageCircle, FiBookOpen, FiX
} from 'react-icons/fi';
import BookCover from '../components/BookCover';
import AIAgent from '../components/AIAgent';
import ChatRoom from '../components/ChatRoom';
import BookSnippet from '../components/BookSnippet';

function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAgent, setShowAgent] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedGenre, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedGenre !== 'all') params.append('genre', selectedGenre);
      params.append('sortBy', sortBy);
      const res = await api.get(`/products?${params}`);
      return res.data.data?.products || [];
    }
  });

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const res = await api.get('/genres');
      return res.data.data?.genres || [];
    }
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-4xl text-white mb-2">Digital Library</h1>
        <p className="text-gray-400">
          Explore our collection of books available for adaptation
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or keywords..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Genre Filter */}
        <div className="relative">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
          >
            <option value="all">All Genres</option>
            {(genres || []).map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-yellow-600/20">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 ${viewMode === 'grid' ? 'bg-yellow-600 text-black' : 'bg-black/30 text-gray-400'}`}
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 ${viewMode === 'list' ? 'bg-yellow-600 text-black' : 'bg-black/30 text-gray-400'}`}
          >
            <FiList />
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {(products || []).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/library/${book.id}`} className="group block">
                <div className="relative mb-3">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
                    size="lg"
                    className="w-full shadow-lg"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSnippet({ id: book.id, slug: book.slug });
                      }}
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100"
                      title="Preview"
                    >
                      <FiBookOpen className="text-white" size={20} />
                    </button>
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                      <FiPlay className="text-black ml-0.5" size={20} />
                    </div>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {book.adaptationAllowed && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                        Adaptable
                      </span>
                    )}
                    {book.gutenbergId && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Free
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-white font-medium truncate group-hover:text-yellow-500 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <FiUser size={12} /> {book.author}
                </p>
                {book.genres?.length > 0 && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FiTag size={10} /> {book.genres.map(g => g.genre?.name || g.name).join(', ')}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(products || []).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/library/${book.id}`}
                className="card flex gap-6 hover:border-yellow-500/50"
              >
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl text-white font-medium">{book.title}</h3>
                      <p className="text-gray-400">{book.author}</p>
                    </div>
                    <div className="flex gap-2">
                      {book.adaptationAllowed && (
                        <span className="bg-yellow-500/20 text-yellow-500 text-xs px-3 py-1 rounded-full">
                          Adaptable
                        </span>
                      )}
                      {book.gutenbergId && (
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {book.description || 'No description available.'}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    {book.genres?.length > 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <FiTag size={12} /> {book.genres.map(g => g.name).join(', ')}
                      </span>
                    )}
                    {book.price > 0 && (
                      <span className="text-yellow-500 font-medium">
                        ${book.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!products || products.length === 0) && (
        <div className="text-center py-20">
          <FiBook className="mx-auto text-gray-600 mb-4" size={64} />
          <h3 className="text-xl text-white mb-2">No books found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-72 flex gap-3 z-40">
        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showChat ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <FiMessageCircle size={24} />
        </button>
        <button
          onClick={() => setShowAgent(!showAgent)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showAgent ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">📚</span>
        </button>
      </div>

      {/* Chat Room */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed bottom-6 left-72 z-50">
            <ChatRoom
              roomType="library"
              roomName="Library"
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* AI Agent */}
      <AnimatePresence>
        {showAgent && (
          <AIAgent
            agentType="librarian"
            onClose={() => setShowAgent(false)}
          />
        )}
      </AnimatePresence>

      {/* Book Snippet Modal */}
      <AnimatePresence>
        {selectedSnippet && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8"
            onClick={() => setSelectedSnippet(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <BookSnippet
                bookSlug={selectedSnippet.slug}
                bookId={selectedSnippet.id}
                onClose={() => setSelectedSnippet(null)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Library;

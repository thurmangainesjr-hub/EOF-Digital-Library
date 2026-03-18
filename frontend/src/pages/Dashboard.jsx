import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { motion } from 'framer-motion';
import {
  FiBook, FiUsers, FiTrendingUp, FiStar,
  FiCommand, FiArrowRight, FiPlay, FiBookOpen,
  FiGlobe, FiRadio
} from 'react-icons/fi';
import BookCover from '../components/BookCover';

function Dashboard() {
  const { user, isAuthenticated, isMember } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/products/stats');
        return res.data.data;
      } catch {
        return { totalBooks: 6, creators: 1, adaptations: 0, griotProjects: 0 };
      }
    }
  });

  const { data: recentBooks } = useQuery({
    queryKey: ['recent-books'],
    queryFn: async () => {
      const res = await api.get('/products?limit=6');
      return res.data.data?.products || [];
    }
  });

  const { data: readingProgress } = useQuery({
    queryKey: ['reading-progress'],
    queryFn: async () => {
      const res = await api.get('/reading/current');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const quickStats = [
    { label: 'Books Available', value: stats?.totalBooks || '1,200+', icon: FiBook, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Creators', value: stats?.creators || '150+', icon: FiUsers, color: 'from-purple-500 to-purple-600' },
    { label: 'Adaptations Made', value: stats?.adaptations || '500+', icon: FiTrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Griot Projects', value: stats?.griotProjects || '320+', icon: FiStar, color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-4xl text-white mb-2">
          Welcome{user ? `, ${user.displayName || 'Reader'}` : ' to EOF'}
        </h1>
        <p className="text-gray-400">
          Your gateway to literary adaptation with Griot AI
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Reading */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-white">Continue Reading</h2>
              <Link to="/bookshelves" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2">
                View All <FiArrowRight />
              </Link>
            </div>

            {readingProgress?.length > 0 ? (
              <div className="space-y-4">
                {readingProgress.slice(0, 3).map(session => (
                  <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="w-16 h-20 rounded bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center">
                      <FiBookOpen className="text-purple-300" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{session.product?.title}</h3>
                      <p className="text-sm text-gray-400">{session.product?.author}</p>
                      <div className="mt-2 w-full bg-black/50 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                          style={{ width: `${session.percentComplete}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{session.percentComplete}% complete</p>
                    </div>
                    <Link
                      to={`/reader/${session.productId}`}
                      className="p-3 rounded-full bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30 transition-colors"
                    >
                      <FiPlay />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiBook className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 mb-4">No books in progress</p>
                <Link to="/library" className="btn-primary inline-flex items-center gap-2">
                  Browse Library <FiArrowRight />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card h-full">
            <h2 className="font-serif text-2xl text-white mb-6">Quick Actions</h2>

            <div className="space-y-4">
              <Link
                to="/command-center"
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/50 hover:to-purple-700/50 transition-all gold-glow"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                  <FiCommand className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Command Center</h3>
                  <p className="text-sm text-gray-400">Control your EOF operations</p>
                </div>
              </Link>

              <Link
                to="/library"
                className="flex items-center gap-4 p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <FiBook className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Browse Library</h3>
                  <p className="text-sm text-gray-400">Explore our collection</p>
                </div>
              </Link>

              <Link
                to="/story-time"
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-900/30 to-purple-900/30 hover:from-pink-800/30 hover:to-purple-800/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <FiRadio className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Story Time</h3>
                  <p className="text-sm text-gray-400">VOD & Live Readings</p>
                </div>
              </Link>

              <Link
                to="/gutenberg"
                className="flex items-center gap-4 p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center">
                  <FiGlobe className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Gutenberg</h3>
                  <p className="text-sm text-gray-400">70,000+ Free Books</p>
                </div>
              </Link>

              {!isMember && (
                <Link
                  to="/membership"
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-800/30 hover:to-yellow-700/30 transition-all border border-yellow-600/30"
                >
                  <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center">
                    <FiStar className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Upgrade to Member</h3>
                    <p className="text-sm text-yellow-500">$5/month - Unlock adaptations</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Additions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white">Recent Additions</h2>
          <Link to="/library" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2">
            View All <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(recentBooks || []).slice(0, 6).map((book, i) => (
            <Link
              key={book.id}
              to={`/library/${book.id}`}
              className="group"
            >
              <div className="relative mb-2">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  size="lg"
                  className="w-full"
                />
                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                    <FiPlay className="text-black ml-0.5" size={20} />
                  </div>
                </div>
              </div>
              <h3 className="text-sm text-white font-medium truncate group-hover:text-yellow-500 transition-colors">{book.title}</h3>
              <p className="text-xs text-gray-400 truncate">{book.author}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Griot AI Integration Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <div className="card bg-gradient-to-r from-purple-900/50 via-purple-800/30 to-yellow-900/30 border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl text-white mb-2">Powered by Griot AI</h2>
              <p className="text-gray-400 max-w-lg">
                Transform any book into audiobooks, films, games, or interactive experiences
                using our advanced AI adaptation engine.
              </p>
            </div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary whitespace-nowrap flex items-center gap-2"
            >
              Open Griot Studio <FiArrowRight />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;

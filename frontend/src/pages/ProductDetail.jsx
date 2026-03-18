import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiBook, FiUser, FiCalendar, FiTag, FiPlay,
  FiPlus, FiStar, FiZap, FiShare2, FiDownload,
  FiArrowLeft, FiCheck, FiExternalLink
} from 'react-icons/fi';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isMember } = useAuth();
  const [selectedBookshelf, setSelectedBookshelf] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data.data;
    }
  });

  const { data: bookshelves } = useQuery({
    queryKey: ['my-bookshelves'],
    queryFn: async () => {
      const res = await api.get('/bookshelves');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const addToShelfMutation = useMutation({
    mutationFn: async (bookshelfId) => {
      return api.post(`/bookshelves/${bookshelfId}/products/${productId}`);
    }
  });

  const exportToGriotMutation = useMutation({
    mutationFn: async (data) => {
      return api.post('/adaptations/export-to-griot', {
        productId,
        ...data
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white mb-4">Book not found</h2>
        <Link to="/library" className="btn-primary">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover and Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          {/* Cover */}
          <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center overflow-hidden shadow-2xl mb-6">
            {product.coverImage ? (
              <img
                src={product.coverImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiBook className="text-purple-300" size={96} />
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to={`/reader/${productId}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiPlay /> Start Reading
            </Link>

            {isAuthenticated && (
              <div className="flex gap-3">
                <select
                  value={selectedBookshelf}
                  onChange={(e) => setSelectedBookshelf(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none"
                >
                  <option value="">Add to Shelf...</option>
                  {(bookshelves || []).map(shelf => (
                    <option key={shelf.id} value={shelf.id}>{shelf.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedBookshelf && addToShelfMutation.mutate(selectedBookshelf)}
                  disabled={!selectedBookshelf || addToShelfMutation.isPending}
                  className="btn-secondary px-4"
                >
                  <FiPlus />
                </button>
              </div>
            )}

            {product.adaptationAllowed && isMember && (
              <button
                onClick={() => exportToGriotMutation.mutate({ adaptationType: 'AUDIOBOOK' })}
                disabled={exportToGriotMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg transition-all hover:from-purple-500 hover:to-purple-600"
              >
                <FiZap /> Export to Griot AI
              </button>
            )}
          </div>

          {/* Meta info */}
          <div className="card mt-6">
            <h3 className="text-lg text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <FiUser /> Author
                </span>
                <span className="text-white">{product.author}</span>
              </div>
              {product.publishedYear && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FiCalendar /> Published
                  </span>
                  <span className="text-white">{product.publishedYear}</span>
                </div>
              )}
              {product.genres?.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FiTag /> Genre
                  </span>
                  <span className="text-white">{product.genres.map(g => g.name).join(', ')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <FiStar /> Adaptable
                </span>
                <span className={product.adaptationAllowed ? 'text-green-400' : 'text-gray-500'}>
                  {product.adaptationAllowed ? 'Yes' : 'No'}
                </span>
              </div>
              {product.gutenbergId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Source</span>
                  <a
                    href={`https://www.gutenberg.org/ebooks/${product.gutenbergId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Gutenberg <FiExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          {/* Title */}
          <h1 className="font-serif text-4xl text-white mb-2">{product.title}</h1>
          <p className="text-xl text-gray-400 mb-6">by {product.author}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.adaptationAllowed && (
              <span className="bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <FiZap /> Adaptation Ready
              </span>
            )}
            {product.gutenbergId && (
              <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
                Public Domain
              </span>
            )}
            {product.price === 0 && (
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                Free
              </span>
            )}
          </div>

          {/* Description */}
          <div className="card mb-6">
            <h2 className="font-serif text-2xl text-white mb-4">About this Book</h2>
            <p className="text-gray-300 leading-relaxed">
              {product.description || 'No description available for this book.'}
            </p>
          </div>

          {/* Griot AI Integration */}
          {product.adaptationAllowed && (
            <div className="card bg-gradient-to-r from-purple-900/50 to-purple-800/30 border-purple-500/30 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <FiZap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2">Available for Adaptation</h3>
                  <p className="text-gray-400 mb-4">
                    This book can be adapted into audiobooks, films, games, and more using Griot AI.
                    {!isMember && ' Upgrade to Member ($5/month) to unlock adaptation features.'}
                  </p>
                  {isMember ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => exportToGriotMutation.mutate({ adaptationType: 'AUDIOBOOK' })}
                        className="btn-secondary text-sm"
                      >
                        Create Audiobook
                      </button>
                      <button
                        onClick={() => exportToGriotMutation.mutate({ adaptationType: 'SCREENPLAY' })}
                        className="btn-secondary text-sm"
                      >
                        Create Screenplay
                      </button>
                      <button
                        onClick={() => exportToGriotMutation.mutate({ adaptationType: 'GAME' })}
                        className="btn-secondary text-sm"
                      >
                        Create Game
                      </button>
                    </div>
                  ) : (
                    <Link to="/membership" className="btn-primary inline-flex items-center gap-2">
                      Upgrade to Member <FiArrowLeft className="rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Creator Info */}
          {product.creator && (
            <div className="card">
              <h2 className="font-serif text-xl text-white mb-4">About the Creator</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <FiUser className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{product.creator.displayName}</h3>
                  <p className="text-gray-400 text-sm">{product.creator.bio || 'No bio available.'}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;

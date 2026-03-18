import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiUpload, FiBook, FiDollarSign, FiSettings, FiEye,
  FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiImage
} from 'react-icons/fi';

function CreatorStudio() {
  const { user, isCreator } = useAuth();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: 0,
    adaptationAllowed: true,
    adaptationFee: 0
  });

  const { data: myProducts, isLoading } = useQuery({
    queryKey: ['creator-products'],
    queryFn: async () => {
      const res = await api.get('/creators/products');
      return res.data.data;
    },
    enabled: isCreator
  });

  const { data: stats } = useQuery({
    queryKey: ['creator-stats'],
    queryFn: async () => {
      const res = await api.get('/creators/stats');
      return res.data.data;
    },
    enabled: isCreator
  });

  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      return api.post('/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['creator-products']);
      setShowUploadForm(false);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: 0,
        adaptationAllowed: true,
        adaptationFee: 0
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['creator-products']);
    }
  });

  if (!isCreator) {
    return (
      <div className="p-8 text-center">
        <FiEdit2 className="mx-auto text-gray-600 mb-4" size={64} />
        <h2 className="text-2xl text-white mb-4">Creator Studio</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Apply to become a creator to publish your books on EOF Digital Library
          and earn from adaptations through Griot AI.
        </p>
        <button className="btn-primary">Apply as Creator</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">Creator Studio</h1>
          <p className="text-gray-400">Manage your published works</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiUpload /> Upload Book
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <FiBook className="text-blue-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{stats?.totalProducts || 0}</p>
          <p className="text-sm text-gray-400">Published Books</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <FiEye className="text-green-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{stats?.totalReads || 0}</p>
          <p className="text-sm text-gray-400">Total Reads</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <FiDollarSign className="text-yellow-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">${stats?.totalEarnings || 0}</p>
          <p className="text-sm text-gray-400">Total Earnings</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <FiSettings className="text-purple-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{stats?.adaptations || 0}</p>
          <p className="text-sm text-gray-400">Adaptations</p>
        </motion.div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-white">Upload New Book</h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              uploadMutation.mutate(formData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Adaptation Fee ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.adaptationFee}
                      onChange={(e) => setFormData({ ...formData, adaptationFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="adaptationAllowed"
                    checked={formData.adaptationAllowed}
                    onChange={(e) => setFormData({ ...formData, adaptationAllowed: e.target.checked })}
                    className="w-5 h-5 rounded border-yellow-600/20 bg-black/30 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="adaptationAllowed" className="text-gray-300">
                    Allow adaptation through Griot AI
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  {uploadMutation.isPending ? 'Uploading...' : (
                    <>
                      <FiUpload /> Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Products List */}
      <div className="card">
        <h2 className="font-serif text-xl text-white mb-6">Your Published Books</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (myProducts || []).length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No published books yet</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <FiPlus /> Upload Your First Book
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-16 h-24 rounded bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center flex-shrink-0">
                  {product.coverImage ? (
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <FiBook className="text-purple-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{product.title}</h3>
                  <p className="text-sm text-gray-400">{product.author}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-500">
                      ${product.price?.toFixed(2) || '0.00'}
                    </span>
                    {product.adaptationAllowed && (
                      <span className="text-yellow-500">
                        Adaptation: ${product.adaptationFee?.toFixed(2) || '0.00'}
                      </span>
                    )}
                    <span className="text-gray-500">
                      {product._count?.readingSessions || 0} reads
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this book?')) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatorStudio;

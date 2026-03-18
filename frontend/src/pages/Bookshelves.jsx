import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiFolder, FiPlus, FiBook, FiEdit2, FiTrash2,
  FiX, FiCheck, FiBookOpen
} from 'react-icons/fi';

function Bookshelves() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const { data: bookshelves, isLoading } = useQuery({
    queryKey: ['my-bookshelves'],
    queryFn: async () => {
      const res = await api.get('/bookshelves');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const createMutation = useMutation({
    mutationFn: async (name) => {
      return api.post('/bookshelves', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookshelves']);
      setIsCreating(false);
      setNewShelfName('');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      return api.put(`/bookshelves/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookshelves']);
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/bookshelves/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookshelves']);
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <FiFolder className="mx-auto text-gray-600 mb-4" size={64} />
        <h2 className="text-2xl text-white mb-4">Sign in to view your bookshelves</h2>
        <Link to="/login" className="btn-primary">
          Sign In
        </Link>
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
          <h1 className="font-serif text-4xl text-white mb-2">My Bookshelves</h1>
          <p className="text-gray-400">Organize your reading collection</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Shelf
        </button>
      </motion.div>

      {/* Create new shelf */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              placeholder="Enter shelf name..."
              className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-yellow-600/20 text-white focus:outline-none focus:border-yellow-500"
              autoFocus
            />
            <button
              onClick={() => createMutation.mutate(newShelfName)}
              disabled={!newShelfName.trim() || createMutation.isPending}
              className="btn-primary"
            >
              <FiCheck />
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewShelfName('');
              }}
              className="btn-secondary"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}

      {/* Bookshelves */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (bookshelves || []).length === 0 ? (
        <div className="text-center py-20">
          <FiFolder className="mx-auto text-gray-600 mb-4" size={64} />
          <h3 className="text-xl text-white mb-2">No bookshelves yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first bookshelf to organize your reading
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiPlus /> Create Bookshelf
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookshelves.map((shelf, i) => (
            <motion.div
              key={shelf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              {/* Shelf header */}
              <div className="flex items-center justify-between mb-4">
                {editingId === shelf.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-black/30 border border-yellow-600/20 text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => updateMutation.mutate({ id: shelf.id, name: editName })}
                      className="p-2 text-green-400 hover:text-green-300"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <FiFolder className="text-yellow-500" size={24} />
                      <h2 className="font-serif text-xl text-white">{shelf.name}</h2>
                      <span className="text-sm text-gray-500">
                        {shelf.products?.length || 0} books
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(shelf.id);
                          setEditName(shelf.name);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this bookshelf?')) {
                            deleteMutation.mutate(shelf.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Books */}
              {shelf.products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {shelf.products.map(product => (
                    <Link
                      key={product.id}
                      to={`/library/${product.id}`}
                      className="group"
                    >
                      <div className="aspect-[2/3] rounded-lg bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center overflow-hidden mb-2">
                        {product.coverImage ? (
                          <img
                            src={product.coverImage}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <FiBook className="text-purple-300" size={24} />
                        )}
                      </div>
                      <h4 className="text-sm text-white truncate group-hover:text-yellow-500 transition-colors">
                        {product.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-gray-700 rounded-lg">
                  <FiBookOpen className="mx-auto text-gray-600 mb-2" size={32} />
                  <p className="text-gray-500 text-sm">No books in this shelf yet</p>
                  <Link to="/library" className="text-yellow-500 text-sm hover:underline mt-2 inline-block">
                    Browse Library
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookshelves;

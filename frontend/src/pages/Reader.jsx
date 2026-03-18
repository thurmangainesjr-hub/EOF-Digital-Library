import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiArrowLeft, FiBookmark, FiSettings, FiMoon, FiSun,
  FiMinus, FiPlus, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

function Reader() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data.data;
    }
  });

  const { data: content } = useQuery({
    queryKey: ['product-content', productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}/content`);
      return res.data.data;
    }
  });

  const { data: session } = useQuery({
    queryKey: ['reading-session', productId],
    queryFn: async () => {
      const res = await api.get(`/reading/${productId}`);
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data) => {
      return api.post(`/reading/${productId}/progress`, data);
    }
  });

  const addBookmarkMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/reading/${productId}/bookmark`, { page: currentPage });
    }
  });

  // Load saved progress
  useEffect(() => {
    if (session?.currentPage) {
      setCurrentPage(session.currentPage);
    }
  }, [session]);

  // Save progress periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const saveProgress = () => {
      const totalPages = content?.pages?.length || 100;
      const percentComplete = Math.round((currentPage / totalPages) * 100);
      updateProgressMutation.mutate({ currentPage, percentComplete });
    };

    const interval = setInterval(saveProgress, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [currentPage, isAuthenticated]);

  const totalPages = content?.pages?.length || 1;
  const pageContent = content?.pages?.[currentPage - 1] || content?.text || 'Loading content...';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-amber-50'} transition-colors`}>
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-900/95' : 'bg-amber-50/95'} backdrop-blur border-b ${darkMode ? 'border-gray-800' : 'border-amber-200'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <FiArrowLeft /> Exit Reader
          </button>
          <div className="text-center">
            <h1 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {product?.title || 'Loading...'}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {product?.author}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => addBookmarkMutation.mutate()}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'} transition-colors`}
            >
              <FiBookmark className={addBookmarkMutation.isSuccess ? 'text-yellow-500' : darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'} transition-colors`}
            >
              <FiSettings className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-6 py-4 border-t ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-amber-200 bg-amber-100/50'}`}
          >
            <div className="flex items-center justify-center gap-8">
              {/* Font size */}
              <div className="flex items-center gap-3">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Font Size</span>
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-200 hover:bg-amber-300'}`}
                >
                  <FiMinus size={14} />
                </button>
                <span className={`w-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-200 hover:bg-amber-300'}`}
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-amber-200 text-gray-900'
                }`}
              >
                {darkMode ? <FiSun /> : <FiMoon />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="pt-24 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white shadow-lg'}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              <p className={`leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {pageContent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900/95' : 'bg-amber-50/95'} backdrop-blur border-t ${darkMode ? 'border-gray-800' : 'border-amber-200'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'
            } ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors`}
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="flex items-center gap-4">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Page {currentPage} of {totalPages}
            </span>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
              {Math.round((currentPage / totalPages) * 100)}%
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : darkMode ? 'hover:bg-gray-800' : 'hover:bg-amber-200'
            } ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors`}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reader;

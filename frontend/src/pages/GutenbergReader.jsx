import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../services/api';
import BookCover from '../components/BookCover';
import {
  FiArrowLeft, FiBookOpen, FiSettings, FiZap, FiDownload,
  FiChevronUp, FiChevronDown, FiSun, FiMoon, FiType,
  FiExternalLink, FiShare2, FiBookmark, FiVolume2, FiVolumeX
} from 'react-icons/fi';

function GutenbergReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Reader settings
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // Fetch book content
  const { data, isLoading, error } = useQuery({
    queryKey: ['gutenberg-content', id],
    queryFn: async () => {
      const res = await api.get(`/gutenberg/books/${id}/content`);
      return res.data.data;
    }
  });

  const book = data?.book;
  const content = data?.content;
  const format = data?.format;

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
      return () => contentEl.removeEventListener('scroll', handleScroll);
    }
  }, [content]);

  // Text-to-speech
  const toggleReading = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        // Get visible text (first 5000 chars for demo)
        const textToRead = content?.substring(0, 5000) || '';
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    }
  };

  // Stop reading on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading book content...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <FiBookOpen className="text-gray-600 mx-auto mb-4" size={64} />
          <h2 className="text-xl text-white mb-2">Failed to load book</h2>
          <p className="text-gray-400 mb-6">The book content couldn't be retrieved.</p>
          <button
            onClick={() => navigate('/gutenberg')}
            className="btn-primary"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-blue-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-900/95' : 'bg-amber-50/95'} backdrop-blur border-b ${isDarkMode ? 'border-gray-800' : 'border-amber-200'}`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/gutenberg')}
            className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            <FiArrowLeft /> Back
          </button>

          <div className="text-center flex-1 mx-4">
            <h1 className={`font-serif text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {book.title}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {book.author}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleReading}
              className={`p-2 rounded-lg ${isReading ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-gray-600'}`}
              title={isReading ? 'Stop reading' : 'Read aloud'}
            >
              {isReading ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-gray-600'}`}
            >
              <FiSettings size={18} />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-amber-100 border-amber-200'} px-4 py-3`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-8">
              {/* Font size */}
              <div className="flex items-center gap-3">
                <FiType className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <button
                  onClick={() => setFontSize(f => Math.max(12, f - 2))}
                  className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-amber-200'}`}
                >
                  <FiChevronDown size={16} />
                </button>
                <span className={`w-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize(f => Math.min(32, f + 2))}
                  className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-amber-200'}`}
                >
                  <FiChevronUp size={16} />
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-amber-200 text-gray-900'}`}
              >
                {isDarkMode ? <FiMoon size={16} /> : <FiSun size={16} />}
                {isDarkMode ? 'Dark' : 'Light'}
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Content */}
      <main
        ref={contentRef}
        className="max-w-3xl mx-auto px-6 py-8 overflow-auto"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* Book info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card mb-8 ${isDarkMode ? '' : 'bg-white border-amber-200'}`}
        >
          <div className="flex gap-6">
            <BookCover
              title={book.title}
              author={book.author}
              coverImage={book.coverImage}
              size="md"
            />
            <div className="flex-1">
              <h2 className={`font-serif text-2xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {book.title}
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{book.author}</p>
              {book.subjects && book.subjects.length > 0 && (
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {book.subjects.slice(0, 3).join(' • ')}
                </p>
              )}
              <div className="flex items-center gap-3 mt-4">
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">
                  Public Domain
                </span>
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">
                  Gutenberg #{book.gutenbergId}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
            <Link
              to={`/adapt/gutenberg/${book.gutenbergId}`}
              className="btn-primary flex items-center gap-2"
            >
              <FiZap /> Adapt with Griot AI
            </Link>
            <a
              href={`https://www.gutenberg.org/ebooks/${book.gutenbergId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <FiExternalLink /> Gutenberg Page
            </a>
          </div>
        </motion.div>

        {/* Book content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {format === 'html' ? (
            <div
              className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div
              className={`whitespace-pre-wrap font-serif ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {content}
            </div>
          )}
        </motion.div>

        {/* End of book */}
        <div className={`text-center py-12 mt-12 border-t ${isDarkMode ? 'border-gray-800' : 'border-amber-200'}`}>
          <FiBookOpen className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
          <p className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>End of Book</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              to={`/adapt/gutenberg/${book.gutenbergId}`}
              className="btn-primary flex items-center gap-2"
            >
              <FiZap /> Create Adaptation
            </Link>
            <button
              onClick={() => navigate('/gutenberg')}
              className="btn-secondary"
            >
              Browse More Books
            </button>
          </div>
        </div>
      </main>

      {/* Floating scroll to top */}
      {scrollProgress > 20 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-400"
        >
          <FiChevronUp size={24} />
        </motion.button>
      )}
    </div>
  );
}

export default GutenbergReader;

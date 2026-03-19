import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCover from '../components/BookCover';
import {
  FiZap, FiArrowLeft, FiCheck, FiExternalLink, FiPlay,
  FiHeadphones, FiFilm, FiMonitor, FiMic, FiBook,
  FiSettings, FiArrowRight, FiAlertCircle, FiLoader
} from 'react-icons/fi';

function Adapt() {
  const { source, bookId } = useParams(); // source: 'library' or 'gutenberg'
  const navigate = useNavigate();
  const { isAuthenticated, isMember } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);

  // Get book details
  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ['adapt-book', source, bookId],
    queryFn: async () => {
      if (source === 'gutenberg') {
        const res = await api.get(`/gutenberg/books/${bookId}`);
        return res.data.data?.book;
      } else {
        const res = await api.get(`/products/${bookId}`);
        return res.data.data?.product;
      }
    }
  });

  // Get adaptation types
  const { data: typesData } = useQuery({
    queryKey: ['adaptation-types'],
    queryFn: async () => {
      const res = await api.get('/griot/adaptation-types');
      return res.data.data?.types || [];
    }
  });

  // Check Griot AI status
  const { data: griotStatus } = useQuery({
    queryKey: ['griot-status'],
    queryFn: async () => {
      const res = await api.get('/griot/status');
      return res.data.data;
    }
  });

  // Quick preview mutation
  const previewMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/griot/quick-adapt/${book?.id || bookId}`, {
        type: selectedType?.id,
        prompt: `Adapt ${book?.title} as ${selectedType?.name}`
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setPreview(data.preview);
      setStep(3);
    }
  });

  // Export to Griot mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const productId = source === 'gutenberg' ? `gutenberg-${bookId}` : bookId;
      const res = await api.post(`/griot/export/${productId}`, {
        adaptationType: selectedType?.id,
        options: {}
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      // Redirect to Griot AI
      window.open(data.griotUrl, '_blank');
    }
  });

  const adaptationTypes = typesData || [
    { id: 'audiobook', name: 'Audiobook', icon: '🎧', description: 'Full narrated audiobook' },
    { id: 'screenplay', name: 'Screenplay', icon: '🎬', description: 'Film/TV adaptation' },
    { id: 'game-narrative', name: 'Game Narrative', icon: '🎮', description: 'Interactive story' },
    { id: 'podcast', name: 'Podcast', icon: '🎙️', description: 'Audio drama series' },
    { id: 'graphic-novel', name: 'Graphic Novel', icon: '📚', description: 'Visual adaptation' }
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handlePreview = () => {
    previewMutation.mutate();
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  if (bookLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-8 text-center">
        <FiAlertCircle className="mx-auto text-red-400 mb-4" size={64} />
        <h2 className="text-2xl text-white mb-4">Book Not Found</h2>
        <Link to="/library" className="btn-primary">Back to Library</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <FiZap className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">Create Adaptation</h1>
            <p className="text-gray-400">Transform "{book.title}" with Griot AI</p>
          </div>
        </div>
      </motion.div>

      {/* Book Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex gap-6">
          <BookCover
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            size="md"
          />
          <div className="flex-1">
            <h2 className="font-serif text-2xl text-white mb-1">{book.title}</h2>
            <p className="text-gray-400 mb-2">{book.author}</p>
            {book.publicDomain && (
              <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">
                Public Domain - Free to Adapt
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Auth Check */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card bg-yellow-900/30 border-yellow-500/30 mb-8"
        >
          <div className="flex items-center gap-4">
            <FiAlertCircle className="text-yellow-400" size={24} />
            <div className="flex-1">
              <p className="text-white">Sign in to create adaptations</p>
              <p className="text-gray-400 text-sm">Members get full access to Griot AI</p>
            </div>
            <Link to="/login" className="btn-primary">Sign In</Link>
          </div>
        </motion.div>
      )}

      {/* Griot Status */}
      {griotStatus && !griotStatus.connected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card bg-blue-900/30 border-blue-500/30 mb-8"
        >
          <div className="flex items-center gap-4">
            <FiAlertCircle className="text-blue-400" size={24} />
            <div className="flex-1">
              <p className="text-white">Griot AI Studio Offline</p>
              <p className="text-gray-400 text-sm">You can still preview adaptations</p>
            </div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <FiExternalLink /> Open Griot AI
            </a>
          </div>
        </motion.div>
      )}

      {/* Steps Progress */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step > s ? <FiCheck /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 ${step > s ? 'bg-yellow-500' : 'bg-gray-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Type */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-serif text-2xl text-white mb-6 text-center">
              Choose Adaptation Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adaptationTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectType(type)}
                  className="card text-left hover:border-yellow-500/50 group"
                >
                  <span className="text-4xl mb-4 block">{type.icon}</span>
                  <h3 className="text-white font-medium text-lg mb-1 group-hover:text-yellow-400">
                    {type.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                  {type.features && (
                    <ul className="mt-3 space-y-1">
                      {type.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCheck className="text-green-400" size={10} /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && selectedType && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-serif text-2xl text-white mb-6 text-center">
              Configure {selectedType.name}
            </h2>

            <div className="card mb-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{selectedType.icon}</span>
                <div>
                  <h3 className="text-white font-medium text-lg">{selectedType.name}</h3>
                  <p className="text-gray-400">{selectedType.description}</p>
                </div>
              </div>

              {selectedType.features && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedType.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-black/30">
                      <FiCheck className="text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={handlePreview}
                disabled={previewMutation.isPending}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {previewMutation.isPending ? (
                  <>
                    <FiLoader className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <FiPlay /> Generate Preview
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview & Export */}
        {step === 3 && preview && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-serif text-2xl text-white mb-6 text-center">
              Preview
            </h2>

            <div className="card mb-6">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {preview}
              </pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              {griotStatus?.connected ? (
                <button
                  onClick={handleExport}
                  disabled={exportMutation.isPending}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {exportMutation.isPending ? (
                    <>
                      <FiLoader className="animate-spin" /> Exporting...
                    </>
                  ) : (
                    <>
                      <FiExternalLink /> Open in Griot AI
                    </>
                  )}
                </button>
              ) : (
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <FiExternalLink /> Start Griot AI
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Adapt;

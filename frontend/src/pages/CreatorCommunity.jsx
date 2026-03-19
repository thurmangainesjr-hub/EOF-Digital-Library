import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BookCover from '../components/BookCover';
import {
  FiMessageCircle, FiUsers, FiSend, FiTrendingUp, FiStar,
  FiZap, FiBook, FiFilm, FiHeadphones, FiExternalLink,
  FiLock, FiAward, FiArrowUp, FiArrowDown, FiHeart,
  FiFilter, FiSearch, FiRefreshCw
} from 'react-icons/fi';

function CreatorCommunity() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const chatEndRef = useRef(null);

  const [activeTab, setActiveTab] = useState('chat'); // chat, adaptations
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, audiobook, screenplay, game
  const [searchQuery, setSearchQuery] = useState('');

  const isCreator = user?.membership?.tier === 'CREATOR';

  // Redirect if not creator
  useEffect(() => {
    if (isAuthenticated && !isCreator) {
      // Show access denied
    }
  }, [isAuthenticated, isCreator]);

  // Get chat messages
  const { data: chatMessages = [], refetch: refetchChat } = useQuery({
    queryKey: ['creator-chat'],
    queryFn: async () => {
      const res = await api.get('/creator/chat');
      return res.data.data?.messages || [];
    },
    enabled: isCreator,
    refetchInterval: 5000 // Poll every 5 seconds
  });

  // Get adaptation list
  const { data: adaptationList = [] } = useQuery({
    queryKey: ['adaptation-list', filter],
    queryFn: async () => {
      const res = await api.get(`/creator/adaptations?type=${filter}`);
      return res.data.data?.adaptations || getDemoAdaptations();
    },
    enabled: isCreator
  });

  // Send chat message
  const sendMessageMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.post('/creator/chat', { message: text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['creator-chat']);
      setMessage('');
    }
  });

  // Vote on adaptation
  const voteMutation = useMutation({
    mutationFn: async ({ bookId, direction }) => {
      const res = await api.post(`/creator/adaptations/${bookId}/vote`, { direction });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adaptation-list']);
    }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleVote = (bookId, direction) => {
    voteMutation.mutate({ bookId, direction });
  };

  // Demo data for adaptations
  const getDemoAdaptations = () => [
    {
      id: '1',
      title: 'The Awakening',
      author: 'Kate Chopin',
      votes: 127,
      adaptationType: 'audiobook',
      status: 'high_demand',
      coverImage: null,
      description: 'A groundbreaking novel about female independence',
      nominatedBy: 'Creator_Maya',
      nominatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Narrative of the Life of Frederick Douglass',
      author: 'Frederick Douglass',
      votes: 98,
      adaptationType: 'screenplay',
      status: 'high_demand',
      coverImage: null,
      description: 'Powerful autobiography of an American slave',
      nominatedBy: 'Creator_James',
      nominatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'The Souls of Black Folk',
      author: 'W.E.B. Du Bois',
      votes: 85,
      adaptationType: 'audiobook',
      status: 'trending',
      coverImage: null,
      description: 'Seminal work on African American experience',
      nominatedBy: 'Creator_Aisha',
      nominatedAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Their Eyes Were Watching God',
      author: 'Zora Neale Hurston',
      votes: 76,
      adaptationType: 'screenplay',
      status: 'trending',
      coverImage: null,
      description: 'A story of self-discovery and independence',
      nominatedBy: 'Creator_Devon',
      nominatedAt: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Incidents in the Life of a Slave Girl',
      author: 'Harriet Jacobs',
      votes: 64,
      adaptationType: 'audiobook',
      status: 'new',
      coverImage: null,
      description: 'Autobiographical account of slavery',
      nominatedBy: 'Creator_Taylor',
      nominatedAt: new Date().toISOString()
    }
  ];

  // Demo chat messages
  const demoChatMessages = [
    {
      id: '1',
      user: { name: 'Maya Johnson', avatar: null, badge: 'creator' },
      text: 'Just finished adapting "The Awakening" into an audiobook! The AI narration turned out amazing.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      user: { name: 'James Williams', avatar: null, badge: 'creator' },
      text: 'Anyone working on screenplay adaptations? Would love to collaborate on a Frederick Douglass project.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      user: { name: 'Aisha Thompson', avatar: null, badge: 'top_creator' },
      text: 'Pro tip: When adapting classic literature, focus on preserving the author\'s voice while modernizing the pacing.',
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ];

  const displayMessages = chatMessages.length > 0 ? chatMessages : demoChatMessages;
  const displayAdaptations = adaptationList.length > 0 ? adaptationList : getDemoAdaptations();

  // Access denied for non-creators
  if (!isCreator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-purple-400" size={40} />
          </div>
          <h1 className="text-2xl font-serif text-white mb-4">Creator Access Only</h1>
          <p className="text-gray-400 mb-8">
            The Creator Community is exclusive to verified creators. Apply to become a creator and unlock:
          </p>
          <ul className="text-left text-gray-300 space-y-2 mb-8">
            <li className="flex items-center gap-2">
              <FiZap className="text-purple-400" /> Export to Griot AI Studio
            </li>
            <li className="flex items-center gap-2">
              <FiMessageCircle className="text-purple-400" /> Creator chat room
            </li>
            <li className="flex items-center gap-2">
              <FiTrendingUp className="text-purple-400" /> Adaptation placement voting
            </li>
            <li className="flex items-center gap-2">
              <FiAward className="text-purple-400" /> Creator badge & earnings
            </li>
          </ul>
          <button
            onClick={() => navigate('/membership')}
            className="btn-primary"
          >
            Apply to Become Creator
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <FiUsers className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">Creator Community</h1>
            <p className="text-gray-400">Network, collaborate, and vote on adaptations</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <FiMessageCircle /> Chat Room
        </button>
        <button
          onClick={() => setActiveTab('adaptations')}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'adaptations'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <FiTrendingUp /> Adaptation List
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Chat Room */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Chat Area */}
            <div className="lg:col-span-3 card flex flex-col h-[600px]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <FiMessageCircle /> Creator Chat
                </h2>
                <button
                  onClick={() => refetchChat()}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {displayMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">
                        {msg.user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{msg.user.name}</span>
                        {msg.user.badge === 'top_creator' && (
                          <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">
                            Top Creator
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share ideas, ask questions, collaborate..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="btn-primary px-6"
                  >
                    <FiSend />
                  </button>
                </div>
              </form>
            </div>

            {/* Online Creators */}
            <div className="card h-fit">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FiUsers /> Online Creators
              </h3>
              <div className="space-y-3">
                {['Maya Johnson', 'James Williams', 'Aisha Thompson', 'Devon Carter'].map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-sm">{name.charAt(0)}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
                    </div>
                    <span className="text-gray-300">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Adaptations List */}
        {activeTab === 'adaptations' && (
          <motion.div
            key="adaptations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex bg-gray-800 rounded-lg p-1">
                {['all', 'audiobook', 'screenplay', 'game'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded text-sm capitalize ${
                      filter === type
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Adaptation Cards */}
            <div className="space-y-4">
              {displayAdaptations
                .filter(a =>
                  (filter === 'all' || a.adaptationType === filter) &&
                  (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   a.author.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((adaptation, index) => (
                  <motion.div
                    key={adaptation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card flex gap-6"
                  >
                    {/* Rank */}
                    <div className="flex flex-col items-center justify-center w-16">
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-500'
                      }`}>
                        #{index + 1}
                      </span>
                      {adaptation.status === 'high_demand' && (
                        <span className="text-xs text-red-400 mt-1">HOT</span>
                      )}
                    </div>

                    {/* Book Cover */}
                    <BookCover
                      title={adaptation.title}
                      author={adaptation.author}
                      coverImage={adaptation.coverImage}
                      size="sm"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{adaptation.title}</h3>
                          <p className="text-gray-400">{adaptation.author}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          adaptation.adaptationType === 'audiobook'
                            ? 'bg-blue-500/20 text-blue-400'
                            : adaptation.adaptationType === 'screenplay'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {adaptation.adaptationType === 'audiobook' && <FiHeadphones className="inline mr-1" />}
                          {adaptation.adaptationType === 'screenplay' && <FiFilm className="inline mr-1" />}
                          {adaptation.adaptationType}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">{adaptation.description}</p>
                      <p className="text-gray-600 text-xs mt-2">
                        Nominated by {adaptation.nominatedBy}
                      </p>
                    </div>

                    {/* Voting */}
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleVote(adaptation.id, 'up')}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <FiArrowUp size={20} />
                      </button>
                      <span className="text-xl font-bold text-white">{adaptation.votes}</span>
                      <button
                        onClick={() => handleVote(adaptation.id, 'down')}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FiArrowDown size={20} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/adapt/library/${adaptation.id}`)}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        <FiZap /> Adapt Now
                      </button>
                      <button
                        onClick={() => navigate(`/library/${adaptation.id}`)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <FiBook /> View Book
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Nominate Book */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 card bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Nominate a Book</h3>
                  <p className="text-gray-400">
                    Think a book deserves an adaptation? Nominate it for the community to vote on.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/library')}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiBook /> Browse Library
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreatorCommunity;

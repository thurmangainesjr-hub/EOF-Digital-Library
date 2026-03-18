import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import {
  FiMessageCircle, FiSend, FiX, FiMinimize2, FiMaximize2,
  FiBook, FiHeadphones, FiZap, FiHelpCircle, FiUser, FiRefreshCw
} from 'react-icons/fi';

// AI Agent personalities
const AGENTS = {
  librarian: {
    id: 'librarian',
    name: 'Sage',
    title: 'Library Assistant',
    avatar: '📚',
    color: 'from-blue-500 to-blue-600',
    greeting: "Hello! I'm Sage, your library assistant. I can help you discover books, provide summaries, and answer questions about our collection. How can I assist you today?",
    capabilities: ['Book recommendations', 'Plot summaries', 'Author info', 'Genre exploration'],
    quickActions: [
      { label: 'Recommend books', action: 'recommend', query: 'popular classics' },
      { label: 'Find similar', action: 'similar', query: '' },
      { label: 'Explain a book', action: 'explain', query: '' }
    ]
  },
  storyteller: {
    id: 'storyteller',
    name: 'Aurora',
    title: 'Story Time Host',
    avatar: '🎭',
    color: 'from-pink-500 to-purple-600',
    greeting: "Welcome! I'm Aurora, your Story Time guide. I can recommend narrations, help you find live readings, and even give you a preview of what's playing. What would you like to explore?",
    capabilities: ['Narration recommendations', 'Live schedule', 'Preview clips', 'Narrator info'],
    quickActions: [
      { label: 'Suggest audiobooks', action: 'suggest-audio', query: 'relaxing' },
      { label: 'Narration tips', action: 'narration-tips', query: '' },
      { label: 'Live preview', action: 'live-preview', query: '' }
    ]
  },
  adapter: {
    id: 'adapter',
    name: 'Prism',
    title: 'Adaptation Specialist',
    avatar: '✨',
    color: 'from-yellow-500 to-orange-500',
    greeting: "Hi there! I'm Prism, your Griot AI specialist. I help transform books into audiobooks, screenplays, games, and more. Ready to create something amazing?",
    capabilities: ['Adaptation guidance', 'Format selection', 'Griot AI tips', 'Export help'],
    quickActions: [
      { label: 'Adaptation ideas', action: 'adaptation-ideas', query: '' },
      { label: 'Format advice', action: 'format-advice', query: '' },
      { label: 'Rights info', action: 'rights-info', query: '' }
    ]
  }
};

function AIAgent({ agentType = 'librarian', context = {}, onClose, minimized = false }) {
  const agent = AGENTS[agentType] || AGENTS.librarian;
  const [messages, setMessages] = useState([
    { role: 'assistant', content: agent.greeting, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message) => {
      const res = await api.post('/ai/chat', {
        agentType,
        message,
        conversationHistory
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isAI: data.isAI
      }]);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: data.response }
      ].slice(-10)); // Keep last 10 messages
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      }]);
    }
  });

  // Quick action mutation
  const quickActionMutation = useMutation({
    mutationFn: async ({ action, context }) => {
      const res = await api.post('/ai/quick-action', {
        agentType,
        action,
        context
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isAI: data.isAI
      }]);
    }
  });

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Send to API
    chatMutation.mutate(userMessage);
  };

  const handleQuickAction = (action) => {
    // Add user message showing the action
    setMessages(prev => [...prev, {
      role: 'user',
      content: `[${action.label}]`,
      timestamp: new Date(),
      isQuickAction: true
    }]);

    // Execute quick action
    quickActionMutation.mutate({
      action: action.action,
      context: { query: action.query, ...context }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isTyping = chatMutation.isPending || quickActionMutation.isPending;

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br ${agent.color} shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform`}
      >
        {agent.avatar}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
      style={{ background: 'rgba(13, 13, 13, 0.95)', backdropFilter: 'blur(10px)' }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${agent.color} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent.avatar}</span>
            <div>
              <h3 className="text-white font-medium">{agent.name}</h3>
              <p className="text-white/70 text-xs">{agent.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([{ role: 'assistant', content: agent.greeting, timestamp: new Date() }]);
                setConversationHistory([]);
              }}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80"
              title="Reset conversation"
            >
              <FiRefreshCw size={14} />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80"
            >
              <FiMinimize2 size={16} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? msg.isQuickAction
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-yellow-500 text-black'
                  : msg.isError
                    ? 'bg-red-900/50 text-red-300 border border-red-700'
                    : 'bg-gray-800 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.isAI === false && msg.role === 'assistant' && !msg.isError && (
                <p className="text-xs text-gray-500 mt-1">
                  (Offline mode - connect API for full AI)
                </p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 border-t border-gray-800 flex gap-2 overflow-x-auto">
        {agent.quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(action)}
            disabled={isTyping}
            className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs whitespace-nowrap hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${agent.name}...`}
            disabled={isTyping}
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AIAgent;

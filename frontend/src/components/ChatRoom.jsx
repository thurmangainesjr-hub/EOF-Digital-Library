import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiMessageCircle, FiSend, FiUsers, FiSmile, FiX,
  FiMaximize2, FiMinimize2, FiHeart, FiMoreHorizontal
} from 'react-icons/fi';

// Sample messages for demo
const SAMPLE_MESSAGES = {
  library: [
    { id: 1, user: 'BookLover42', avatar: '📚', message: 'Just finished Dracula - what a ride!', time: '2 min ago', likes: 5 },
    { id: 2, user: 'ClassicFan', avatar: '🎭', message: 'Has anyone read the original Frankenstein? Much better than the movies!', time: '5 min ago', likes: 12 },
    { id: 3, user: 'SciFiReader', avatar: '🚀', message: 'The Time Machine is perfect for a weekend read', time: '8 min ago', likes: 3 },
  ],
  storytime: [
    { id: 1, user: 'AudiophileAmy', avatar: '🎧', message: 'Elena\'s Dracula narration is incredible!', time: '1 min ago', likes: 8 },
    { id: 2, user: 'NightOwl', avatar: '🦉', message: 'Can\'t wait for Horror Night tomorrow!', time: '3 min ago', likes: 15 },
    { id: 3, user: 'StoryFan', avatar: '📖', message: 'The kids\' Peter Pan reading is so wholesome', time: '6 min ago', likes: 22 },
  ]
};

function ChatRoom({ roomType = 'library', roomName = 'General', onClose }) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState(SAMPLE_MESSAGES[roomType] || []);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [onlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        { user: 'NewReader', avatar: '📗', message: 'Just joined! What\'s everyone reading?' },
        { user: 'PageTurner', avatar: '📕', message: 'This community is amazing!' },
        { user: 'LitLover', avatar: '📘', message: 'Any recommendations for horror?' },
      ];

      if (Math.random() > 0.7) {
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setMessages(prev => [...prev, {
          id: Date.now(),
          ...randomMsg,
          time: 'Just now',
          likes: 0
        }]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim() || !isAuthenticated) return;

    const newMessage = {
      id: Date.now(),
      user: user?.displayName || 'Anonymous',
      avatar: '👤',
      message: input.trim(),
      time: 'Just now',
      likes: 0,
      isOwn: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLike = (msgId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === msgId ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-gray-900/95 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden shadow-xl ${
        isExpanded ? 'fixed inset-4 z-50' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiMessageCircle className="text-white" size={24} />
            <div>
              <h3 className="text-white font-medium">{roomName} Chat</h3>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <FiUsers size={12} /> {onlineUsers} online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80"
            >
              {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
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
      <div className={`overflow-y-auto p-4 space-y-4 ${isExpanded ? 'h-[calc(100%-180px)]' : 'h-64'}`}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
                {msg.avatar}
              </div>
              <div className={`flex-1 ${msg.isOwn ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${msg.isOwn ? 'text-yellow-500' : 'text-white'}`}>
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <div className={`inline-block rounded-2xl px-4 py-2 ${
                  msg.isOwn ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => handleLike(msg.id)}
                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <FiHeart size={12} /> {msg.likes > 0 && msg.likes}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        {isAuthenticated ? (
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <FiSmile size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend size={18} />
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-gray-400 text-sm">Sign in to join the conversation</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ChatRoom;

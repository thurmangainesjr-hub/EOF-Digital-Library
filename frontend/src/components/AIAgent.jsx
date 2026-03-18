import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageCircle, FiSend, FiX, FiMinimize2, FiMaximize2,
  FiBook, FiHeadphones, FiZap, FiHelpCircle, FiUser
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
    capabilities: ['Book recommendations', 'Plot summaries', 'Author info', 'Genre exploration']
  },
  storyteller: {
    id: 'storyteller',
    name: 'Aurora',
    title: 'Story Time Host',
    avatar: '🎭',
    color: 'from-pink-500 to-purple-600',
    greeting: "Welcome! I'm Aurora, your Story Time guide. I can recommend narrations, help you find live readings, and even give you a preview of what's playing. What would you like to explore?",
    capabilities: ['Narration recommendations', 'Live schedule', 'Preview clips', 'Narrator info']
  },
  adapter: {
    id: 'adapter',
    name: 'Prism',
    title: 'Adaptation Specialist',
    avatar: '✨',
    color: 'from-yellow-500 to-orange-500',
    greeting: "Hi there! I'm Prism, your Griot AI specialist. I help transform books into audiobooks, screenplays, games, and more. Ready to create something amazing?",
    capabilities: ['Adaptation guidance', 'Format selection', 'Griot AI tips', 'Export help']
  }
};

function AIAgent({ agentType = 'librarian', context = {}, onClose, minimized = false }) {
  const agent = AGENTS[agentType] || AGENTS.librarian;
  const [messages, setMessages] = useState([
    { role: 'assistant', content: agent.greeting, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response based on agent type and input
  const generateResponse = async (userMessage) => {
    setIsTyping(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let response = '';
    const lowerMessage = userMessage.toLowerCase();

    if (agentType === 'librarian') {
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        response = "Based on our collection, I'd recommend:\n\n📖 **Pride and Prejudice** - A timeless romance\n📖 **Frankenstein** - Gothic horror classic\n📖 **The Time Machine** - Pioneering sci-fi\n\nWould you like me to tell you more about any of these?";
      } else if (lowerMessage.includes('summary') || lowerMessage.includes('about')) {
        response = "I'd be happy to provide a summary! Which book would you like to learn about? You can ask about any title in our library.";
      } else if (lowerMessage.includes('dracula')) {
        response = "**Dracula** by Bram Stoker (1897)\n\nA Gothic horror novel told through letters and diary entries. It follows Jonathan Harker's visit to Count Dracula's castle and the subsequent battle against the vampire in England.\n\n⭐ Available for free (Public Domain)\n🎭 Adaptation-ready for Griot AI";
      } else {
        response = "I can help you with:\n• Finding specific books\n• Getting plot summaries\n• Discovering similar titles\n• Learning about authors\n\nWhat would you like to explore?";
      }
    } else if (agentType === 'storyteller') {
      if (lowerMessage.includes('live') || lowerMessage.includes('schedule')) {
        response = "📺 **Upcoming Live Sessions:**\n\n🔴 **NOW LIVE** - Story Time with Kids: Peter Pan\n⏰ In 1 hour - Dracula Chapter 5 with Elena\n⏰ Tomorrow - Horror Night: The Raven\n\nWould you like me to set a reminder?";
      } else if (lowerMessage.includes('audiobook') || lowerMessage.includes('listen')) {
        response = "🎧 **Popular Audiobooks:**\n\n1. Sherlock Holmes - Narrated by David Williams (45 min)\n2. Frankenstein - Narrated by James Anderson (35 min)\n3. Pride and Prejudice - Narrated by Sarah Mitchell (28 min)\n\nShall I play a preview?";
      } else {
        response = "I can help you discover:\n• Live reading schedules\n• Audiobook recommendations\n• Narrator information\n• Preview clips\n\nWhat sounds interesting?";
      }
    } else if (agentType === 'adapter') {
      if (lowerMessage.includes('audiobook') || lowerMessage.includes('audio')) {
        response = "🎙️ **Creating an Audiobook:**\n\n1. Select your book in the Library\n2. Click 'Export to Griot AI'\n3. Choose 'Audiobook' format\n4. Select voice and style\n5. Generate!\n\nWant me to guide you through the process?";
      } else if (lowerMessage.includes('screenplay') || lowerMessage.includes('film')) {
        response = "🎬 **Screenplay Adaptation:**\n\nGriot AI can transform any book into a professional screenplay with:\n• Scene breakdowns\n• Character dialogue\n• Stage directions\n• Format options (Film, TV, Stage)\n\nShall I help you get started?";
      } else {
        response = "✨ **Adaptation Options:**\n\n🎙️ Audiobook - Full narration with voice acting\n🎬 Screenplay - Film/TV/Stage formats\n🎮 Game Narrative - Interactive storytelling\n📱 Interactive - Choose-your-own-adventure\n\nWhich format interests you?";
      }
    }

    setIsTyping(false);
    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Generate and add AI response
    const response = await generateResponse(userMessage);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
        {agent.capabilities.slice(0, 3).map((cap, i) => (
          <button
            key={i}
            onClick={() => setInput(cap)}
            className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs whitespace-nowrap hover:bg-gray-700 hover:text-white transition-colors"
          >
            {cap}
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
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
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

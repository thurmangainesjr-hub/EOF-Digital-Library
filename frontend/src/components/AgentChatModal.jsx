import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { FiSend, FiX, FiRefreshCw, FiZap, FiCpu } from 'react-icons/fi';
import api from '../services/api';
import { buildAgentSystemPrompt, AGENT_BRAINS } from '../data/agentData';

// Reusable agent chat modal — accepts a full agent config object from agentData.js
export default function AgentChatModal({ agent, systemId, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: agent.greeting, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasBrain = !!AGENT_BRAINS[agent.id];
  const systemPrompt = buildAgentSystemPrompt(agent);

  const chatMutation = useMutation({
    mutationFn: async (message) => {
      const res = await api.post('/ai/chat', {
        agentType: agent.id,
        agentName: agent.name,
        systemId,
        message,
        conversationHistory,
        ...(systemPrompt && { systemPrompt }),
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      const lastInput = input;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isAI: data.isAI,
      }]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: lastInput },
        { role: 'assistant', content: data.response },
      ].slice(-10));
    },
    onError: () => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true,
      }]);
    },
  });

  const quickActionMutation = useMutation({
    mutationFn: async ({ action, query }) => {
      const res = await api.post('/ai/quick-action', {
        agentType: agent.id,
        systemId,
        action,
        context: { query },
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isAI: data.isAI,
      }]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setInput('');
    chatMutation.mutate(userMessage);
  };

  const handleQuickAction = (action) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: action.label,
      timestamp: new Date(),
      isQuickAction: true,
    }]);
    quickActionMutation.mutate({ action: action.action, query: action.query });
  };

  const isTyping = chatMutation.isPending || quickActionMutation.isPending;

  const gradientStyle = {
    background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})`,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: 'rgba(13,13,13,0.98)', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div style={gradientStyle} className="p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-xl flex-shrink-0">
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="text-white font-bold leading-tight">{agent.name}</h3>
                  <p className="text-white/70 text-xs">{agent.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMessages([{ role: 'assistant', content: agent.greeting, timestamp: new Date() }]);
                    setConversationHistory([]);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/20 text-white/70 hover:text-white transition-colors"
                  title="Reset"
                >
                  <FiRefreshCw size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-black/20 text-white/70 hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Capabilities + Growth Agent badge */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {agent.capabilities.slice(0, 4).map(cap => (
                <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-white/70 border border-white/10">
                  {cap}
                </span>
              ))}
              {hasBrain && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/90 border border-white/20 font-medium">
                  <FiCpu size={9} /> Growth Agent
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: `${agent.colorFrom}30`, border: `1px solid ${agent.colorFrom}40` }}>
                    {agent.avatar}
                  </div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? msg.isQuickAction
                      ? 'bg-white/8 text-gray-300 border border-white/10'
                      : 'text-white'
                    : msg.isError
                      ? 'bg-red-900/40 text-red-300 border border-red-700/40'
                      : 'bg-white/6 text-gray-100 border border-white/8'
                }`}
                  style={msg.role === 'user' && !msg.isQuickAction ? { background: agent.colorFrom + '30', border: `1px solid ${agent.colorFrom}50` } : {}}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.isAI === false && msg.role === 'assistant' && !msg.isError && (
                    <p className="text-xs text-gray-600 mt-1">Offline mode — connect API for full AI</p>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mr-2"
                  style={{ background: `${agent.colorFrom}30` }}>
                  {agent.avatar}
                </div>
                <div className="bg-white/6 border border-white/8 rounded-2xl px-3.5 py-3">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-4 py-2 border-t border-white/8 flex gap-2 overflow-x-auto flex-shrink-0">
            <FiZap size={12} className="text-gray-600 flex-shrink-0 mt-1" />
            {agent.quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/8 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Message ${agent.name}…`}
                disabled={isTyping}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/6 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/25 text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110 flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})` }}
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

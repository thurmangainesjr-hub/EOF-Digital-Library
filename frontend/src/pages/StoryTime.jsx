import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import BookCover from '../components/BookCover';
import AIAgent from '../components/AIAgent';
import ChatRoom from '../components/ChatRoom';
import {
  FiPlay, FiRadio, FiClock, FiCalendar, FiUsers,
  FiHeart, FiShare2, FiBookOpen, FiHeadphones, FiVideo,
  FiX, FiBell, FiMessageCircle
} from 'react-icons/fi';

function StoryTime() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAgent, setShowAgent] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Sample VOD content
  const vodContent = [
    {
      id: 1,
      title: 'Pride and Prejudice - Chapter 1',
      narrator: 'Sarah Mitchell',
      duration: '28:45',
      thumbnail: null,
      bookTitle: 'Pride and Prejudice',
      views: 1250,
      type: 'audiobook'
    },
    {
      id: 2,
      title: 'Frankenstein - The Creation',
      narrator: 'James Anderson',
      duration: '35:12',
      thumbnail: null,
      bookTitle: 'Frankenstein',
      views: 892,
      type: 'video'
    },
    {
      id: 3,
      title: 'Dracula - Opening Scene',
      narrator: 'Elena Vasquez',
      duration: '42:30',
      thumbnail: null,
      bookTitle: 'Dracula',
      views: 2100,
      type: 'audiobook'
    },
    {
      id: 4,
      title: 'The Time Machine - Journey Begins',
      narrator: 'Michael Chen',
      duration: '31:15',
      thumbnail: null,
      bookTitle: 'The Time Machine',
      views: 756,
      type: 'video'
    },
    {
      id: 5,
      title: 'Sherlock Holmes - A Study in Scarlet',
      narrator: 'David Williams',
      duration: '45:00',
      thumbnail: null,
      bookTitle: 'The Adventures of Sherlock Holmes',
      views: 3420,
      type: 'audiobook'
    },
    {
      id: 6,
      title: 'A Tale of Two Cities - Revolution',
      narrator: 'Catherine Blake',
      duration: '38:22',
      thumbnail: null,
      bookTitle: 'A Tale of Two Cities',
      views: 1890,
      type: 'video'
    }
  ];

  // Sample live/upcoming sessions
  const liveSchedule = [
    {
      id: 1,
      title: 'Live Reading: Dracula Chapter 5',
      host: 'Elena Vasquez',
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      isLive: false,
      viewers: 0,
      book: 'Dracula'
    },
    {
      id: 2,
      title: 'Story Time with Kids: Peter Pan',
      host: 'Mary Johnson',
      startTime: new Date(Date.now() - 1800000), // Started 30 mins ago
      isLive: true,
      viewers: 234,
      book: 'Peter Pan'
    },
    {
      id: 3,
      title: 'Horror Night: The Raven by Poe',
      host: 'Vincent Price III',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      isLive: false,
      viewers: 0,
      book: 'The Raven'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'audiobook', label: 'Audiobooks' },
    { id: 'video', label: 'Video Readings' },
    { id: 'live', label: 'Live Sessions' }
  ];

  const filteredVod = selectedCategory === 'all' || selectedCategory === 'live'
    ? vodContent
    : vodContent.filter(v => v.type === selectedCategory);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <FiBookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-serif text-4xl text-white">Story Time</h1>
            <p className="text-gray-400">VOD & Live Book Readings</p>
          </div>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-yellow-500 text-black font-medium'
                : 'bg-black/30 text-gray-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Live Now Section */}
      {(selectedCategory === 'all' || selectedCategory === 'live') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="font-serif text-2xl text-white mb-4 flex items-center gap-2">
            <FiRadio className="text-red-500" /> Live Now & Upcoming
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSchedule.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`card relative overflow-hidden ${
                  session.isLive ? 'border-red-500/50' : ''
                }`}
              >
                {session.isLive && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>
                )}

                <div className="flex gap-4">
                  <BookCover title={session.book} author="" size="md" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{session.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">with {session.host}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {session.isLive ? (
                        <span className="flex items-center gap-1 text-red-400">
                          <FiUsers /> {session.viewers} watching
                        </span>
                      ) : (
                        <>
                          <span className="flex items-center gap-1">
                            <FiCalendar /> {formatDate(session.startTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock /> {formatTime(session.startTime)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {session.isLive ? (
                    <button
                      onClick={() => setActivePlayer({ type: 'live', ...session })}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 py-2"
                    >
                      <FiPlay /> Join Live
                    </button>
                  ) : (
                    <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2">
                      <FiBell /> Remind Me
                    </button>
                  )}
                  <button className="p-2 rounded-lg bg-black/30 text-gray-400 hover:text-white">
                    <FiShare2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* VOD Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-serif text-2xl text-white mb-4 flex items-center gap-2">
          <FiPlay /> On Demand Library
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVod.map((content, i) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card group cursor-pointer hover:border-yellow-500/50"
              onClick={() => setActivePlayer(content)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-800 to-purple-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  {content.type === 'audiobook' ? (
                    <FiHeadphones className="text-purple-300" size={48} />
                  ) : (
                    <FiVideo className="text-purple-300" size={48} />
                  )}
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                    <FiPlay className="text-black ml-1" size={28} />
                  </div>
                </div>
                {/* Duration */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                  {content.duration}
                </div>
                {/* Type badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-purple-600/80 text-white text-xs flex items-center gap-1">
                  {content.type === 'audiobook' ? <FiHeadphones size={12} /> : <FiVideo size={12} />}
                  {content.type === 'audiobook' ? 'Audio' : 'Video'}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-white font-medium mb-1 group-hover:text-yellow-500 transition-colors">
                {content.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">Narrated by {content.narrator}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{content.views.toLocaleString()} views</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="hover:text-red-400 transition-colors"
                  >
                    <FiHeart />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="hover:text-white transition-colors"
                  >
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activePlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setActivePlayer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                src="" // In production, this would be the actual video/audio URL
                title={activePlayer.title}
                type={activePlayer.type === 'audiobook' ? 'audio' : activePlayer.isLive ? 'live' : 'video'}
                onClose={() => setActivePlayer(null)}
              />
              <div className="mt-4">
                <h2 className="text-xl text-white font-serif">{activePlayer.title}</h2>
                <p className="text-gray-400">
                  {activePlayer.narrator ? `Narrated by ${activePlayer.narrator}` : `Hosted by ${activePlayer.host}`}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <div className="card bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-yellow-900/30 border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <FiHeadphones className="text-white" size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-serif text-2xl text-white mb-2">Become a Narrator</h3>
              <p className="text-gray-400">
                Share your voice with the world. Record audiobook narrations and live readings for the EOF community.
              </p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Apply Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-72 flex gap-3 z-40">
        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showChat ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <FiMessageCircle size={24} />
        </button>
        <button
          onClick={() => setShowAgent(!showAgent)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showAgent ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">🎭</span>
        </button>
      </div>

      {/* Chat Room */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed bottom-6 left-72 z-50">
            <ChatRoom
              roomType="storytime"
              roomName="Story Time"
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* AI Agent - Aurora (Story Time Host) */}
      <AnimatePresence>
        {showAgent && (
          <AIAgent
            agentType="storyteller"
            onClose={() => setShowAgent(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default StoryTime;

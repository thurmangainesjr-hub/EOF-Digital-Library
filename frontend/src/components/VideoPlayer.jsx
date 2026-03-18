import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize,
  FiMinimize, FiSkipBack, FiSkipForward, FiX
} from 'react-icons/fi';

function VideoPlayer({
  src,
  poster,
  title,
  type = 'video', // 'video' | 'audio' | 'live'
  onClose,
  autoPlay = false
}) {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mediaRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      setProgress((mediaRef.current.currentTime / mediaRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (mediaRef.current) {
      mediaRef.current.currentTime = percent * mediaRef.current.duration;
    }
  };

  const skip = (seconds) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-black rounded-xl overflow-hidden"
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Live indicator */}
      {type === 'live' && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      )}

      {/* Media element */}
      {type === 'audio' ? (
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center animate-pulse-gold">
              <FiVolume2 className="text-black" size={48} />
            </div>
            <h3 className="text-xl text-white font-serif">{title}</h3>
            <p className="text-gray-400 text-sm mt-1">Audiobook</p>
          </div>
          <audio
            ref={mediaRef}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            autoPlay={autoPlay}
          />
        </div>
      ) : (
        <video
          ref={mediaRef}
          src={src}
          poster={poster}
          className="w-full aspect-video object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          autoPlay={autoPlay}
          playsInline
        />
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-4 group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-yellow-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <FiSkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
            </button>

            <button
              onClick={() => skip(10)}
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <FiSkipForward size={20} />
            </button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="text-white hover:text-yellow-500 transition-colors"
            >
              {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </button>

            {type !== 'audio' && (
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-yellow-500 transition-colors"
              >
                {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoPlayer;

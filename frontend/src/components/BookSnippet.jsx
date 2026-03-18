import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import {
  FiBook, FiPlay, FiChevronRight, FiChevronLeft,
  FiBookOpen, FiZap, FiX, FiVolume2
} from 'react-icons/fi';

// Sample snippets for classic books
const BOOK_SNIPPETS = {
  'pride-and-prejudice': {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    snippets: [
      {
        chapter: 'Chapter 1',
        text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
      },
      {
        chapter: 'Chapter 3',
        text: '"She is tolerable, but not handsome enough to tempt me; I am in no humour at present to give consequence to young ladies who are slighted by other men."\n\nMr. Darcy walked off; and Elizabeth remained with no very cordial feelings toward him.',
      }
    ]
  },
  'frankenstein': {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    snippets: [
      {
        chapter: 'Chapter 5',
        text: 'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.',
      },
      {
        chapter: 'Chapter 10',
        text: '"I expected this reception," said the dæmon. "All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature, to whom thou art bound by ties only dissoluble by the annihilation of one of us."',
      }
    ]
  },
  'dracula': {
    title: 'Dracula',
    author: 'Bram Stoker',
    snippets: [
      {
        chapter: 'Chapter 1',
        text: '3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.',
      },
      {
        chapter: 'Chapter 2',
        text: 'Within, stood a tall old man, clean shaven save for a long white moustache, and clad in black from head to foot, without a single speck of colour about him anywhere. He held in his hand an antique silver lamp, in which the flame burned without chimney or globe of any kind.',
      }
    ]
  },
  'the-time-machine': {
    title: 'The Time Machine',
    author: 'H.G. Wells',
    snippets: [
      {
        chapter: 'Chapter 1',
        text: 'The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated.',
      },
      {
        chapter: 'Chapter 4',
        text: 'I think I have told you that when I set out, before my velocity became very high, Mrs. Watchett had walked across the room, travelling, as it seemed to me, like a rocket. As I returned, I passed again across that minute when she traversed the laboratory.',
      }
    ]
  }
};

function BookSnippet({ bookSlug, bookId, onClose }) {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get snippet data
  const bookData = BOOK_SNIPPETS[bookSlug] || {
    title: 'Book Preview',
    author: 'Unknown Author',
    snippets: [{
      chapter: 'Preview',
      text: 'This is a preview of the book content. Sign in to read the full book or explore more chapters.'
    }]
  };

  const snippet = bookData.snippets[currentSnippet];

  const nextSnippet = () => {
    setCurrentSnippet(prev => (prev + 1) % bookData.snippets.length);
  };

  const prevSnippet = () => {
    setCurrentSnippet(prev => prev === 0 ? bookData.snippets.length - 1 : prev - 1);
  };

  // Simulate text-to-speech
  const togglePlayback = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(snippet.text);
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card max-w-2xl w-full mx-auto relative"
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white z-10"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Header */}
      <div className="flex gap-6 mb-6">
        <BookCover
          title={bookData.title}
          author={bookData.author}
          size="md"
        />
        <div className="flex-1">
          <h2 className="font-serif text-2xl text-white mb-1">{bookData.title}</h2>
          <p className="text-gray-400 mb-2">{bookData.author}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">
              Preview
            </span>
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
              {bookData.snippets.length} Excerpts
            </span>
          </div>
        </div>
      </div>

      {/* Snippet content */}
      <div className="bg-black/30 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-yellow-500 font-medium">{snippet.chapter}</span>
          <button
            onClick={togglePlayback}
            className={`p-2 rounded-full ${
              isPlaying ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
            } hover:scale-105 transition-transform`}
          >
            <FiVolume2 size={18} />
          </button>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
          {snippet.text}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevSnippet}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiChevronLeft /> Previous
        </button>

        <div className="flex gap-2">
          {bookData.snippets.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSnippet(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentSnippet ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSnippet}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          Next <FiChevronRight />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6 pt-6 border-t border-gray-800">
        <Link
          to={bookId ? `/reader/${bookId}` : '#'}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiBookOpen /> Read Full Book
        </Link>
        <Link
          to={bookId ? `/library/${bookId}` : '#'}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <FiZap /> Adapt with Griot
        </Link>
      </div>
    </motion.div>
  );
}

export default BookSnippet;

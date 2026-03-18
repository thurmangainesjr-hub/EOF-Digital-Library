import React from 'react';
import { FiBook } from 'react-icons/fi';

// Generate a consistent color based on string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'from-purple-800 to-purple-900',
    'from-blue-800 to-blue-900',
    'from-emerald-800 to-emerald-900',
    'from-rose-800 to-rose-900',
    'from-amber-800 to-amber-900',
    'from-indigo-800 to-indigo-900',
    'from-teal-800 to-teal-900',
    'from-fuchsia-800 to-fuchsia-900'
  ];

  return colors[Math.abs(hash) % colors.length];
}

function BookCover({
  title,
  author,
  coverImage,
  size = 'md', // 'sm' | 'md' | 'lg'
  showInfo = false,
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };

  const textSizes = {
    sm: { title: 'text-[8px]', author: 'text-[6px]' },
    md: { title: 'text-xs', author: 'text-[10px]' },
    lg: { title: 'text-sm', author: 'text-xs' }
  };

  if (coverImage) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-lg overflow-hidden shadow-lg`}>
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Generate decorative cover
  const bgColor = stringToColor(title + author);

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-lg overflow-hidden shadow-lg bg-gradient-to-br ${bgColor} relative`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 right-2 h-px bg-white" />
        <div className="absolute bottom-2 left-2 right-2 h-px bg-white" />
        <div className="absolute top-2 bottom-2 left-2 w-px bg-white" />
        <div className="absolute top-2 bottom-2 right-2 w-px bg-white" />
      </div>

      {/* Book spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
        {size !== 'sm' && (
          <FiBook className="text-white/30 mb-2" size={size === 'lg' ? 32 : 24} />
        )}
        <h4 className={`${textSizes[size].title} font-serif text-white font-medium leading-tight line-clamp-3`}>
          {title}
        </h4>
        {showInfo && author && (
          <p className={`${textSizes[size].author} text-white/60 mt-1 line-clamp-1`}>
            {author}
          </p>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}

export default BookCover;

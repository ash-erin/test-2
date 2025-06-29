import React, { useState } from 'react';
import { X, Play, Plus, Heart, ThumbsUp } from 'lucide-react';
import { Movie } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onAddToList: (movie: Movie) => void;
  onLike: (movie: Movie) => void;
  currentLikes: number;
  isLiked: boolean;
  myList: string[];
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  onClose,
  onPlay,
  onAddToList,
  onLike,
  currentLikes,
  isLiked,
  myList,
}) => {
  const isInMyList = myList.includes(movie.id);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-20"
        style={{ backgroundColor: '#0f2f5f' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="relative h-64 md:h-96 rounded-t-lg overflow-hidden" style={{ backgroundColor: '#081932' }}>
            {isTrailerPlaying ? (
              <video
                autoPlay
                controls
                className="w-full h-full object-cover"
                src={movie.trailerUrl}
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.backdrop})` }}
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f2f5f, transparent, transparent)' }} />
                <button
                  onClick={() => setIsTrailerPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                    <Play size={28} className="text-white ml-1" fill="currentColor" />
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-full"
            style={{ backgroundColor: 'rgba(8, 25, 50, 0.5)' }}
          >
            <X size={24} />
          </button>

          <div className={`absolute left-4 right-4 transition-all duration-300 ${
            isTrailerPlaying ? 'bottom-16 opacity-100' : 'bottom-4 opacity-100'
          }`}>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
              {movie.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center justify-center space-x-3 bg-white text-black px-6 py-3 rounded-md hover:bg-white/90 transition-colors font-semibold"
              >
                <Play size={20} fill="currentColor" />
                <span>Read</span>
              </button>

              <button
                onClick={() => onAddToList(movie)}
                className="flex items-center justify-center space-x-3 text-white px-6 py-3 rounded-md font-semibold backdrop-blur-sm transition-all duration-200 group/button"
                style={{ 
                  backgroundColor: isInMyList 
                    ? 'rgba(239, 68, 68, 0.8)' 
                    : 'rgba(221, 184, 112, 0.8)'
                }}
                onMouseEnter={(e) => {
                  if (isInMyList) {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
                  } else {
                    e.currentTarget.style.backgroundColor = 'rgba(221, 184, 112, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isInMyList) {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
                  } else {
                    e.currentTarget.style.backgroundColor = 'rgba(221, 184, 112, 0.8)';
                  }
                }}
              >
                {isInMyList ? (
                  <X size={20} />
                ) : (
                  <Plus size={20} />
                )}
                <span>{isInMyList ? 'Remove from List' : 'Add to My List'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-4xl">
            <div>
              <div className="flex items-center space-x-4 text-white/90 mb-4">
                <div className="flex items-center space-x-1">
                  <Heart size={16} fill="currentColor" style={{ color: '#ddb870' }} />
                  <span className="text-sm font-medium">{currentLikes.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-white/90 text-lg leading-relaxed mb-6">
                {movie.description}
              </p>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onLike(movie)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked 
                      ? '' 
                      : 'text-white'
                  }`}
                  style={{ color: isLiked ? '#ef4444' : 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = isLiked ? '#ef4444' : '#ddb870'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isLiked ? '#ef4444' : 'white'}
                >
                  <ThumbsUp size={20} />
                  <span className="text-sm">{isLiked ? 'Unlike' : 'Like'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
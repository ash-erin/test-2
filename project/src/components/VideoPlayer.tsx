import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize, X } from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#081932' }}>
      <div
        className="relative w-full h-full cursor-pointer"
        onMouseMove={() => setShowControls(true)}
      >
        <video
          ref={videoRef}
          src={movie.videoUrl}
          className="w-full h-full object-contain"
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`} style={{ background: 'linear-gradient(to top, rgba(8, 25, 50, 0.8), transparent, rgba(8, 25, 50, 0.4))' }}>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">{movie.title}</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <X size={28} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-4">
              <div
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  seekTo(percent * duration);
                }}
              >
                <div
                  className="h-full bg-red-600 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  style={{ width: `${(currentTime / duration) * 100}%`, backgroundColor: '#ddb870' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: '#ddb870' }}></div>
                </div>
              </div>
              <div className="flex justify-between text-white/70 text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  <SkipBack size={24} />
                </button>

                <button
                  onClick={() => skip(10)}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  <SkipForward size={24} />
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
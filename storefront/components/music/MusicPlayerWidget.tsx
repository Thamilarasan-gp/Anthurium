'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Sparkles } from 'lucide-react';
import { useMusic } from '../providers/MusicContext';

export const MusicPlayerWidget: React.FC = () => {
  const { isPlaying, isMuted, currentTrack, togglePlay, toggleMute } = useMusic();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 transition-all duration-300">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-botanical text-ivory p-3.5 rounded-full shadow-2xl hover:bg-rose-700 transition flex items-center space-x-2 border border-rose-200/20 group"
          title="Open Ambient Music Player"
        >
          <Disc className={`w-5 h-5 text-blush ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-xs font-medium uppercase tracking-widest hidden sm:inline">Anthurium Vibes</span>
        </button>
      ) : (
        <div className="bg-botanical/95 text-ivory backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-rose-100/20 flex items-center space-x-3 sm:space-x-4 max-w-xs sm:max-w-sm animate-fade-in">
          {/* Track Thumbnail */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/20">
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc className="w-5 h-5 text-blush animate-spin" />
              </div>
            )}
          </div>

          {/* Details & Waveform */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 text-[9px] uppercase tracking-widest text-rose-300 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>CURRENTLY PLAYING</span>
            </div>
            <h4 className="text-xs font-bold truncate text-white tracking-wide">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-ivory/70 truncate italic font-serif">
              "{currentTrack.subtitle || 'Good Outfits. Better Moods.'}"
            </p>

            {/* Waveform Visualization */}
            <div className="flex items-end space-x-1 h-3 mt-1">
              {[12, 20, 8, 16, 24, 10, 18, 14, 22].map((height, i) => (
                <span
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-rose-400 animate-waveform-bar' : 'bg-white/30 h-1'
                  }`}
                  style={{
                    height: isPlaying ? `${height}px` : '4px',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition transform active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 text-ivory/70 hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-[10px] text-ivory/50 hover:text-white ml-1 px-1"
              title="Minimize player"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

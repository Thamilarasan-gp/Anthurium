'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  X,
  Music2
} from 'lucide-react';
import { useMusic } from '../providers/MusicContext';

export const MusicPlayerWidget: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    currentTrack,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    seekTo
  } = useMusic();

  // Mode: compact vertical side player (false) vs expanded horizontal player (true)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // User dismiss state: allows removing the player from screen when stopped or unwanted
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Whenever music starts playing (e.g. from Hero "Play Our Story" button), automatically restore player
  useEffect(() => {
    if (isPlaying && isDismissed) {
      setIsDismissed(false);
    }
  }, [isPlaying, isDismissed]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Interactive seek on progress track
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(ratio * (duration || 248));
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 34;

  const handleDismiss = () => {
    if (isPlaying) {
      togglePlay();
    }
    setIsDismissed(true);
    setIsExpanded(false);
  };

  // When dismissed: show a discreet, elegant mini restore button so user can bring it back anytime
  if (isDismissed) {
    return (
      <aside
        aria-label="Restore Music Player"
        className="fixed left-4 sm:left-6 bottom-7 sm:bottom-8 z-40 select-none animate-fade-in"
      >
        <button
          onClick={() => {
            setIsDismissed(false);
            togglePlay();
          }}
          className="bg-[#12271C] hover:bg-[#183526] text-[#EAD6CA] p-2.5 sm:p-3 rounded-full shadow-xl border border-[#264D36]/70 transition-all duration-300 hover:scale-110 flex items-center space-x-2 group focus:outline-none"
          title="Play Anthurium Vibes"
          aria-label="Play ambient music"
        >
          <Music2 className="w-4 h-4 text-[#EAD6CA] group-hover:text-white transition-colors" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-[10px] font-bold uppercase tracking-widest text-[#FFFDF9] whitespace-nowrap pr-0 group-hover:pr-1.5">
            Play Music
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Ambient Music Player"
      className="fixed left-4 sm:left-6 bottom-7 sm:bottom-8 z-40 select-none transition-all duration-500 ease-out"
    >
      {!isExpanded ? (
        /* ============================================================ */
        /* 09 VERTICAL SIDE PLAYER (Compact, Space-Saving Mode)        */
        /* ============================================================ */
        <div
          className="relative bg-[#12271C] border border-[#264D36]/70 p-2 sm:p-2.5 rounded-[22px] sm:rounded-[26px] shadow-[0_12px_36px_rgba(0,0,0,0.45)] flex flex-col items-center space-y-2.5 transition-transform duration-300 hover:scale-[1.03] backdrop-blur-md group"
          style={{ width: '58px' }}
        >
          {/* Cancel / Remove Option: Clearly visible when stopped/paused, or on hover */}
          <button
            onClick={handleDismiss}
            className={`w-5 h-5 rounded-full bg-white/10 hover:bg-rose-600 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none ${!isPlaying ? 'opacity-90 mb-0.5' : 'opacity-0 group-hover:opacity-90'
              }`}
            title="Remove player"
            aria-label="Remove music player"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Top: Album Thumbnail (click to expand) */}
          <button
            onClick={() => setIsExpanded(true)}
            className="w-11 h-11 rounded-xl overflow-hidden shadow-sm relative group/thumb cursor-pointer focus:outline-none focus:ring-2 focus:ring-champagne/50"
            title="Expand player"
            aria-label="Expand player"
          >
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
            />
            {isPlaying && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* Middle: Blush Circular Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#EAD6CA] hover:bg-[#F3E2D8] flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-[#7A1E32] fill-[#7A1E32]" />
            ) : (
              <Play className="w-4 h-4 text-[#7A1E32] fill-[#7A1E32] ml-0.5" />
            )}
          </button>

          {/* Bottom: Minimal Speaker / Mute Icon */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center text-[#EAD6CA]/80 hover:text-[#EAD6CA] cursor-pointer transition-colors focus:outline-none"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      ) : (
        /* ============================================================ */
        /* EXPANDED HORIZONTAL BAR PLAYER (Luxury Anthurium Editorial)  */
        /* ============================================================ */
        <div
          className="relative px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[24px] sm:rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 flex items-center space-x-3 sm:space-x-4 max-w-[94vw] sm:max-w-[490px] animate-fade-in backdrop-blur-lg"
          style={{
            background:
              'linear-gradient(90deg, #11261B 0%, #163625 38%, #2A4A38 64%, #98A79D 86%, #BAC6BD 100%)'
          }}
        >
          {/* Left: Album Thumbnail (click to collapse) */}
          <button
            onClick={() => setIsExpanded(false)}
            className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/20 cursor-pointer relative group/thumb focus:outline-none"
            title="Click to collapse"
            aria-label="Collapse player"
          >
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* Middle: Title, Subtitle & Progress Bar */}
          <div className="flex-1 min-w-[130px] sm:min-w-[180px]">
            <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] leading-tight">
              {currentTrack.title || 'Anthurium Vibes'}
            </h4>
            <p className="font-serif italic text-[11px] sm:text-xs text-[#E8EDE9]/90 truncate leading-snug">
              {currentTrack.subtitle || "'Good Outfits. Better Moods.'"}
            </p>

            {/* Progress Bar & Time */}
            <div className="flex items-center space-x-2.5 mt-1.5">
              <div
                onClick={handleSeek}
                className="h-1 sm:h-1.5 bg-white/25 hover:bg-white/35 rounded-full flex-1 relative cursor-pointer overflow-hidden transition-colors"
                title="Seek audio"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#F08080] via-[#E57373] to-[#EF5350] rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] text-white/90 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Controls on the light sage mist gradient */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 text-[#12271C] shrink-0 pl-1">
            {/* Large Circular Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#12271C] hover:bg-black text-[#F5EFEB] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Speaker / Volume Toggle */}
            <button
              onClick={toggleMute}
              className="p-1 hover:scale-110 active:scale-95 transition-transform text-[#12271C] hover:text-black focus:outline-none"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-800" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Collapse to Vertical Pill */}
            <button
              onClick={() => setIsExpanded(false)}
              className="p-0.5 text-[#12271C]/60 hover:text-[#12271C] hover:scale-110 transition-transform focus:outline-none"
              title="Collapse to vertical player"
              aria-label="Collapse player"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Cancel / Remove Player completely */}
            <button
              onClick={handleDismiss}
              className="p-0.5 text-[#12271C]/60 hover:text-rose-700 hover:scale-110 transition-transform focus:outline-none"
              title="Remove player"
              aria-label="Remove player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

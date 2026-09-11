'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { HeroAudioTrack } from '@shared/types';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: HeroAudioTrack;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  playTrack: (track: HeroAudioTrack) => void;
}

const defaultTrack: HeroAudioTrack = {
  title: 'Anthurium Vibes',
  subtitle: 'Good Outfits. Better Moods.',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [currentTrack, setCurrentTrack] = useState<HeroAudioTrack>(defaultTrack);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(currentTrack.audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play prevented:', err);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const playTrack = (track: HeroAudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrack,
        togglePlay,
        toggleMute,
        setVolume,
        playTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};

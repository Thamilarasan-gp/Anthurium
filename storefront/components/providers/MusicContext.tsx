'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { HeroAudioTrack } from '@shared/types';
import { api } from '../../lib/api';

export interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: HeroAudioTrack;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  playTrack: (track: HeroAudioTrack) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

// Default to the exact hero music track configured in backend Cloudinary
export const DEFAULT_BACKEND_HERO_TRACK: HeroAudioTrack = {
  title: 'Anthurium Vibes',
  subtitle: 'Good Outfits. Better Moods.',
  audioUrl: 'https://res.cloudinary.com/jrpuc4bx/video/upload/v1789064520/anthurium/audio/td68wsn1jujiaxhr2huc.mp3',
  thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
};

export const PLAYLIST: HeroAudioTrack[] = [DEFAULT_BACKEND_HERO_TRACK];

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [currentTrack, setCurrentTrack] = useState<HeroAudioTrack>(DEFAULT_BACKEND_HERO_TRACK);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(248);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUserStoppedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(currentTrack.audioUrl);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    audio.addEventListener('timeupdate', () => {
      if (audio.currentTime) {
        setCurrentTime(Math.floor(audio.currentTime));
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    });

    audioRef.current = audio;

    // Fetch the live hero section music directly from the backend API
    api.getHeroSections()
      .then((res: any) => {
        const heroes = res.heroes || res.heroSections;
        if (res.success && heroes?.length > 0 && heroes[0].audioTrack?.audioUrl) {
          const backendHeroAudio = heroes[0].audioTrack;
          const liveTrack: HeroAudioTrack = {
            title: backendHeroAudio.title || 'Anthurium Vibes',
            subtitle: backendHeroAudio.subtitle || 'Good Outfits. Better Moods.',
            audioUrl: backendHeroAudio.audioUrl,
            thumbnailUrl: backendHeroAudio.thumbnailUrl || DEFAULT_BACKEND_HERO_TRACK.thumbnailUrl
          };
          setCurrentTrack(liveTrack);

          if (audioRef.current) {
            const currentSrc = audioRef.current.src;
            if (!currentSrc.includes(backendHeroAudio.audioUrl)) {
              audioRef.current.src = backendHeroAudio.audioUrl;
              if (isPlaying && !hasUserStoppedRef.current) {
                audioRef.current.play().catch(() => {});
              }
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Backend hero audio fetch notice:', err);
      });

    // Autoplay on load or on very first user interaction (scroll, click, touch, keydown)
    const attemptPlay = () => {
      if (!audioRef.current || hasUserStoppedRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          cleanupEvents();
        })
        .catch((err) => {
          console.log('Autoplay deferred until first user gesture:', err?.message || err);
        });
    };

    const onUserInteraction = () => {
      attemptPlay();
    };

    const interactionEvents = ['click', 'touchstart', 'scroll', 'keydown', 'mousedown'];
    const cleanupEvents = () => {
      interactionEvents.forEach((ev) => {
        window.removeEventListener(ev, onUserInteraction);
      });
    };

    interactionEvents.forEach((ev) => {
      window.addEventListener(ev, onUserInteraction, { once: true, passive: true });
    });

    attemptPlay();

    return () => {
      cleanupEvents();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack.audioUrl) {
      if (!audioRef.current.src.includes(currentTrack.audioUrl)) {
        audioRef.current.src = currentTrack.audioUrl;
      }
      if (isPlaying && !hasUserStoppedRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      hasUserStoppedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      hasUserStoppedRef.current = false;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play prevented:', err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }, []);

  const playTrack = useCallback((track: HeroAudioTrack) => {
    hasUserStoppedRef.current = false;
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      if (!audioRef.current.src.includes(track.audioUrl)) {
        audioRef.current.src = track.audioUrl;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play prevented:', err);
        });
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const nextTrack = useCallback(() => {
    seekTo(0);
  }, [seekTo]);

  const prevTrack = useCallback(() => {
    seekTo(0);
  }, [seekTo]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrack,
        currentTime,
        duration,
        togglePlay,
        toggleMute,
        setVolume,
        playTrack,
        seekTo,
        nextTrack,
        prevTrack
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

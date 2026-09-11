'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, Disc, Music, ArrowRight } from 'lucide-react';
import { Mood, Product } from '@shared/types';
import { api } from '../../lib/api';
import { useMusic } from '../../components/providers/MusicContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function MoodPage() {
  const { config } = useStoreConfig();
  const { isPlaying, playTrack, togglePlay, currentTrack } = useMusic();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await api.getMoods();
        if (res.success && Array.isArray(res.moods) && res.moods.length > 0) {
          setMoods(res.moods);
          setActiveMood(res.moods[0]);
        }
      } catch (err) {
        console.error('Error fetching moods:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  const handleSelectMood = (mood: Mood) => {
    setActiveMood(mood);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Experiential Mood Hero */}
      <div
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden transition-all duration-700 bg-botanical"
        style={{
          backgroundColor: activeMood?.themeColor || '#2E4036'
        }}
      >
        {activeMood && (
          <img
            src={activeMood.bgImageUrl}
            alt={activeMood.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-1000 transform scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SOUND & STYLE MATCHING</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-wide">
            A Little Music. A Little Magic.
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-rose-200">
            "{activeMood?.tagline || 'Curated ambient soundscapes paired with handcrafted boutique styles.'}"
          </p>

          {/* Active Track Controls */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                if (activeMood) handleSelectMood(activeMood);
                else togglePlay();
              }}
              className="bg-white text-botanical hover:bg-rose-100 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center space-x-3 transition transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-rose-700" /> : <Play className="w-4 h-4 fill-botanical ml-0.5" />}
              <span>{isPlaying ? 'Pause Mood Soundscape' : `Play ${activeMood?.name || 'Ambient'} Soundtrack`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">CHOOSE YOUR CURRENT MOOD</p>
          <h2 className="font-editorial text-3xl font-bold text-botanical">Select a Mood Soundscape</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {moods.map((mood) => {
            const isSelected = activeMood?._id === mood._id;
            return (
              <button
                key={mood._id}
                onClick={() => handleSelectMood(mood)}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between space-y-2 ${
                  isSelected
                    ? 'bg-botanical text-ivory border-botanical shadow-xl scale-105'
                    : 'bg-white text-charcoal border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
              >
                <Disc className={`w-6 h-6 ${isSelected && isPlaying ? 'animate-spin text-blush' : 'text-gray-400'}`} />
                <span className="font-editorial text-sm font-bold">{mood.name}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-75">Play Sound</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Products for Active Mood */}
      {activeMood && activeMood.products && activeMood.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-rose-100 pb-4">
            <h3 className="font-editorial text-2xl font-bold text-botanical">
              Curated Outfits for "{activeMood.name}" Mood
            </h3>
            <p className="text-xs text-gray-500">{activeMood.tagline}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeMood.products.map((prodItem: any) => {
              const product: Product = typeof prodItem === 'object' ? prodItem : null;
              if (!product) return null;
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}

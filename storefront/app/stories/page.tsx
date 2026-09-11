'use client';

import React, { useState, useEffect } from 'react';
import { Instagram, Play, Eye, Heart, Sparkles, Filter } from 'lucide-react';
import { Story } from '@shared/types';
import { api } from '../../lib/api';
import { InstagramDrawer } from '../../components/social/InstagramDrawer';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.getStories();
        if (res.success && Array.isArray(res.stories)) {
          setStories(res.stories);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = stories.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 text-xs text-rose-700 font-bold uppercase tracking-[0.3em]">
          <Instagram className="w-4 h-4" />
          <span>INSTAGRAM SOCIAL FEED</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Anthurium Stories</h1>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          Watch styling reels, fabric stories, customer transformations, and shop the exact pieces worn.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex justify-center items-center space-x-2 overflow-x-auto pb-2">
        {['all', 'Everyday Elegance', 'Fabric Stories', 'Festive Fits', 'Customers Love'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-botanical text-ivory shadow-md'
                : 'bg-white text-charcoal/70 hover:bg-rose-50 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Stories' : cat}
          </button>
        ))}
      </div>

      {/* Stories Video Reel Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-rose-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story._id}
              onClick={() => setSelectedStory(story)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer border border-rose-100/60"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src={story.thumbnailUrl || story.mediaUrl}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-500 transition">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>

                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Instagram className="w-3 h-3 text-rose-300" />
                  <span>{story.viewsCount ? (story.viewsCount / 1000).toFixed(1) + 'K' : '12.4K'} views</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h4 className="font-editorial text-lg font-bold line-clamp-1">{story.title}</h4>
                  <p className="text-xs text-white/80 line-clamp-1 font-light">{story.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instagram Drawer Modal */}
      <InstagramDrawer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}

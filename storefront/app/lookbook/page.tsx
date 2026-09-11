'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Lookbook, Product } from '@shared/types';
import { api } from '../../lib/api';
import { useCart } from '../../components/providers/CartContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function LookbookPage() {
  const { config } = useStoreConfig();
  const { addToCart } = useCart();
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [selectedHotspotProduct, setSelectedHotspotProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchLookbooks = async () => {
      try {
        const res = await api.getLookbooks();
        if (res.success && Array.isArray(res.lookbooks)) {
          setLookbooks(res.lookbooks);
        }
      } catch (err) {
        console.error('Error fetching lookbooks:', err);
      }
    };
    fetchLookbooks();
  }, []);

  const defaultCampaigns = [
    {
      title: 'The Festive Edit 2026',
      subtitle: 'Heritage woven in every thread',
      description: 'An editorial tribute to classical Indian textiles, warm blush tones, and gold zardozi artistry.',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80',
      storyQuote: '"Elegance is the only beauty that never fades."'
    },
    {
      title: 'Everyday Grace',
      subtitle: 'Gentle mornings & organic handlooms',
      description: 'Pure breathable cotton silks, chanderi tunics, and minimalist handblock drapes tailored for modern ease.',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
      storyQuote: '"Graceful styles for your everyday moments."'
    }
  ];

  const activeLookbooks = lookbooks.length > 0 ? lookbooks : defaultCampaigns;

  return (
    <div className="space-y-16 pb-20">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 space-y-3">
        <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-[0.3em] text-rose-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>FASHION EDITORIAL</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-botanical">The Anthurium Lookbook</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto">
          Immerse yourself in our visual campaigns. Click on image hotspots to discover featured pieces and shop the look.
        </p>
      </div>

      {/* Campaigns List */}
      <div className="space-y-20">
        {activeLookbooks.map((item: any, idx: number) => (
          <section key={idx} className="relative">
            {/* Full-width Campaign Image Container */}
            <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Campaign Typography Overlay */}
              <div className="absolute bottom-10 left-6 sm:left-12 max-w-xl text-white space-y-3 z-10">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-rose-300">
                  {item.subtitle || 'CAMPAIGN EDIT'}
                </span>
                <h2 className="font-editorial text-3xl sm:text-5xl font-bold leading-tight">
                  {item.title}
                </h2>
                <p className="text-xs text-white/80 font-light leading-relaxed">
                  {item.description}
                </p>
                {item.storyQuote && (
                  <p className="font-serif italic text-base text-rose-200 pt-1">
                    {item.storyQuote}
                  </p>
                )}
              </div>

              {/* Hotspots if available */}
              {item.hotspots && item.hotspots.length > 0 && (
                item.hotspots.map((hs: any, hIdx: number) => (
                  <div
                    key={hIdx}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    onClick={() => {
                      if (typeof hs.product === 'object') {
                        setSelectedHotspotProduct(hs.product);
                      }
                    }}
                  >
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-white text-botanical text-[10px] font-bold items-center justify-center shadow-lg border border-rose-300">
                        +
                      </span>
                    </span>

                    {/* Hotspot Tooltip */}
                    <div className="absolute left-8 top-0 hidden group-hover:block bg-ivory text-botanical p-3 rounded-xl shadow-2xl border border-rose-100 min-w-[180px] z-30 animate-fade-in">
                      <p className="font-editorial text-xs font-bold truncate">
                        {hs.title || (typeof hs.product === 'object' ? hs.product.title : 'View Product')}
                      </p>
                      <span className="text-[10px] text-rose-700 font-bold">Click to Shop This Look →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Hotspot Product Modal */}
      {selectedHotspotProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedHotspotProduct(null)} />
          <div className="relative bg-ivory rounded-3xl p-6 max-w-md w-full z-10 shadow-2xl space-y-4 border border-rose-100">
            <button
              onClick={() => setSelectedHotspotProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal"
            >
              ✕
            </button>
            <div className="flex space-x-4">
              <img
                src={selectedHotspotProduct.images[0]}
                alt={selectedHotspotProduct.title}
                className="w-24 h-32 rounded-xl object-cover"
              />
              <div className="flex-1 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">FEATURED IN LOOKBOOK</span>
                <h3 className="font-editorial text-lg font-bold text-botanical">{selectedHotspotProduct.title}</h3>
                <p className="text-xs text-gray-500">{selectedHotspotProduct.fabric}</p>
                <div className="text-sm font-bold text-botanical">
                  {config.currency.symbol}{selectedHotspotProduct.salePrice || selectedHotspotProduct.price}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  addToCart(selectedHotspotProduct);
                  setSelectedHotspotProduct(null);
                }}
                className="flex-1 bg-botanical text-ivory py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
              <Link
                href={`/product/${selectedHotspotProduct.slug}`}
                className="bg-white text-botanical border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold uppercase hover:bg-rose-50 flex items-center justify-center"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

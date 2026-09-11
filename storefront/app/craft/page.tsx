'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Scissors, Sun, HeartHandshake } from 'lucide-react';

export default function CraftPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Header Banner */}
      <section className="bg-cream py-20 border-b border-rose-100 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">ARTISAN HERITAGE</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Our Craft & Weaves</h1>
          <p className="text-xs text-gray-500 font-light max-w-xl mx-auto">
            Discover the time-honored techniques, handblock prints, zardozi embroidery, and organic silk looms behind every Anthurium creation.
          </p>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-botanical">Hand Embroidery & Zardozi</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              Every gold thread, pearl accent, and cutwork edge is hand-stitched by skilled embroidery master artisans taking over 40+ hours per garment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-botanical">Natural Handblock Printing</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              Using carved teakwood blocks and organic botanical dyes, our floral motifs reflect classic Indian flora like Anthurium, lotus, and gulmarg roses.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-botanical">Ethical Artisan Looms</h3>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              We partner directly with traditional weaving families in South & Central India, ensuring fair wages, sustainable practices, and cultural preservation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

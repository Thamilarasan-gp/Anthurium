'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, Users, CheckCircle2 } from 'lucide-react';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function AboutPage() {
  const { config } = useStoreConfig();

  return (
    <div className="space-y-20 pb-20">
      {/* Editorial Header */}
      <section className="relative bg-cream py-20 border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">OUR BRAND STORY</span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-botanical leading-tight">
            Anthurium: Where Fashion Blooms
          </h1>
          <p className="font-serif italic text-xl text-rose-800">
            "Indian fashion for the modern woman — handcrafted with warmth, grace, and heritage."
          </p>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-700">PHILOSOPHY</span>
            <h2 className="font-editorial text-3xl font-bold text-botanical">Rooted in Coimbatore, Woven for the World</h2>
            <p className="text-xs text-charcoal/80 leading-relaxed font-light">
              Founded in the heart of Coimbatore, {config.brandName} was built to bridge timeless Indian artisan craftsmanship with contemporary fashion aesthetics. We believe every outfit should evoke an emotional response — a feeling of confidence, warmth, and quiet luxury.
            </p>
            <p className="text-xs text-charcoal/80 leading-relaxed font-light">
              From our hand-painted organza sarees to our soft chanderi kurtis, we work directly with artisan weaving clusters across Tamil Nadu, Bengal, Rajasthan, and Madhya Pradesh.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Anthurium Boutique Philosophy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Visual Timeline */}
      <section className="bg-botanical text-ivory py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-blush">OUR JOURNEY</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold">The Anthurium Timeline</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-botanical-light/30 p-6 rounded-2xl border border-botanical-light/40 space-y-2">
              <span className="text-2xl font-bold text-rose-300 font-editorial">2021</span>
              <h4 className="text-sm font-bold">Boutique Atelier Founded</h4>
              <p className="text-xs text-ivory/70 font-light">Started as a curated design atelier on Race Course Road, Coimbatore.</p>
            </div>
            <div className="bg-botanical-light/30 p-6 rounded-2xl border border-botanical-light/40 space-y-2">
              <span className="text-2xl font-bold text-rose-300 font-editorial">2023</span>
              <h4 className="text-sm font-bold">Organza & Silk Innovation</h4>
              <p className="text-xs text-ivory/70 font-light">Introduced hand-painted organza sarees and cutwork embroidery edits.</p>
            </div>
            <div className="bg-botanical-light/30 p-6 rounded-2xl border border-botanical-light/40 space-y-2">
              <span className="text-2xl font-bold text-rose-300 font-editorial">2025</span>
              <h4 className="text-sm font-bold">Instagram Community</h4>
              <p className="text-xs text-ivory/70 font-light">Crossed 50,000+ passionate women styling Anthurium across India.</p>
            </div>
            <div className="bg-botanical-light/30 p-6 rounded-2xl border border-botanical-light/40 space-y-2">
              <span className="text-2xl font-bold text-rose-300 font-editorial">2026</span>
              <h4 className="text-sm font-bold">Next-Gen Digital Boutique</h4>
              <p className="text-xs text-ivory/70 font-light">Launched our interactive sound, video, and e-commerce experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

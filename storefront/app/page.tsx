'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Instagram, MapPin, Star, Heart, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { Product, Category, HeroSection as HeroType, Story } from '@shared/types';
import { api } from '../lib/api';
import { ProductCard } from '../components/product/ProductCard';
import { InstagramDrawer } from '../components/social/InstagramDrawer';
import { useMusic } from '../components/providers/MusicContext';
import { useStoreConfig } from '../components/providers/StoreConfigContext';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/motion/ScrollReveal';

export default function HomePage() {
  const { config } = useStoreConfig();
  const { isPlaying, togglePlay, playTrack } = useMusic();
  const [heroSections, setHeroSections] = useState<HeroType[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [heroRes, catRes, prodRes, storyRes] = await Promise.all([
          api.getHeroSections(),
          api.getCategories(),
          api.getProducts({ limit: 12 }),
          api.getStories()
        ]);

        const heroes = heroRes.heroes || (heroRes as any).heroSections;
        if (heroRes.success && heroes?.length > 0) {
          setHeroSections(heroes);
        }
        if (catRes.success && catRes.categories?.length > 0) setCategories(catRes.categories);
        if (prodRes.success && prodRes.products?.length > 0) setProducts(prodRes.products);
        if (storyRes.success && storyRes.stories?.length > 0) setStories(storyRes.stories);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomepageData();
  }, []);

  // Autoplay hero slider
  useEffect(() => {
    if (heroSections.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSections.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSections.length, isHovered]);

  const defaultHero: HeroType = {
    _id: 'default',
    heading: 'For Her Every Chapter',
    highlightedHeading: 'Looks Beautiful',
    supportingText: 'Graceful handcrafted styles for your everyday moments and special festive days.',
    primaryCtaText: 'Explore Collection',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'Play Our Story',
    secondaryCtaLink: '/lookbook',
    desktopImageUrl: 'https://res.cloudinary.com/jrpuc4bx/image/upload/v1789061799/anthurium/zqptzwmzuphpslepwbq4.png',
    sideText: 'Good Outfits. Better Moods.',
    displayOrder: 1,
    isActive: true,
    createdAt: '',
    updatedAt: ''
  };

  const activeSlides = heroSections.length > 0 ? heroSections : [defaultHero];
  const safeIndex = currentSlideIndex < activeSlides.length ? currentSlideIndex : 0;
  const hero = activeSlides[safeIndex];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePlayStoryAudio = () => {
    if (isPlaying) {
      togglePlay();
    } else if (hero.audioTrack?.audioUrl) {
      playTrack(hero.audioTrack);
    } else {
      togglePlay();
    }
  };

  // Filter products by tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new-arrivals') return p.newArrival || p.badges?.includes('New');
    if (typeof p.category === 'object' && p.category) {
      return p.category.slug === activeTab;
    }
    return true;
  });

  const hasAnnouncement = Boolean(config.announcementBarText);

  return (
    <div className="space-y-20 pb-20">
      {/* SECTION 1 — EDITORIAL HERO CAROUSEL */}
      <section
        className={`relative flex items-center justify-center overflow-hidden bg-cream/40 group ${hasAnnouncement
          ? 'min-h-[calc(100svh-36px)] sm:min-h-[calc(100vh-36px)]'
          : 'min-h-[100svh] sm:min-h-[100vh]'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 z-0">
          <picture>
            {hero.mobileImageUrl && (
              <source media="(max-width: 640px)" srcSet={hero.mobileImageUrl} />
            )}
            <img
              key={hero._id || safeIndex}
              src={hero.desktopImageUrl}
              alt={hero.heading || 'Anthurium Hero Fashion'}
              className="w-full h-full object-cover object-top opacity-95 transition-all duration-700 ease-out transform scale-100 animate-fadeIn"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-transparent md:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent md:hidden" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-rose-100/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-200/50">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-900">
                {hero.sideText || 'ANTHURIUM BOUTIQUE EDIT'}
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-botanical leading-[1.1] transition-opacity duration-500">
              {hero.heading}{' '}
              {hero.highlightedHeading && (
                <span className="block text-rose-800 italic font-normal font-editorial">
                  {hero.highlightedHeading}
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed max-w-md font-light">
              {hero.supportingText}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={hero.primaryCtaLink || '/shop'}
                prefetch={true}
                className="bg-botanical hover:bg-botanical-dark text-ivory px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl flex items-center space-x-2 transition transform active:scale-95"
              >
                <span>{hero.primaryCtaText || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handlePlayStoryAudio}
                className="bg-white/90 hover:bg-white text-botanical px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center space-x-2 border border-rose-200/60 transition cursor-pointer"
                title={hero.audioTrack?.title ? `Play: ${hero.audioTrack.title}` : 'Play ambient audio'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  {isPlaying ? 'Pause Ambient Sound' : hero.secondaryCtaText || 'Play Our Story'}
                </span>
              </button>
            </div>

            {/* Ambient Side Text Badge */}
            {hero.sideText && (
              <div className="pt-4 flex items-center space-x-3 text-xs text-botanical font-serif italic">
                <span className="w-8 h-[1px] bg-rose-400" />
                <span>"{hero.sideText}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Navigation Controls (Visible when more than 1 slide) */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Hero Slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-botanical shadow-lg backdrop-blur-sm border border-rose-100 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 text-botanical" />
            </button>

            <button
              onClick={handleNextSlide}
              aria-label="Next Hero Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-botanical shadow-lg backdrop-blur-sm border border-rose-100 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 text-botanical" />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-full">
              {activeSlides.map((slide, idx) => (
                <button
                  key={slide._id || idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${safeIndex === idx
                    ? 'w-7 bg-rose-600 shadow-sm'
                    : 'w-2 bg-white/60 hover:bg-white/90'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* SECTION 2 — SHOP BY CATEGORY (Circular/Editorial Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" duration={0.5} className="text-center space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">Explore Silhouettes</p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-botanical">Shop by Category</h2>
          <p className="text-xs text-gray-500 font-light">Handcrafted boutique pieces for every mood and occasion.</p>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <StaggerItem key={cat._id}>
              <Link
                href={`/${cat.slug}`}
                prefetch={true}
                className="group flex flex-col items-center text-center space-y-3"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-rose-200/60 p-1 group-hover:border-rose-500 transition-all duration-300 shadow-soft">
                  <div className="w-full h-full rounded-full overflow-hidden bg-warm-beige">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 will-change-transform"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-editorial text-sm font-semibold text-charcoal group-hover:text-rose-700 transition">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* SECTION 3 — FEATURED PRODUCT COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" duration={0.5} className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">Handcrafted Couture</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-botanical">Featured Collection</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'sarees', label: 'Sarees' },
              { id: 'kurtis', label: 'Kurtis' },
              { id: 'dresses', label: 'Dresses' },
              { id: 'sets', label: 'Sets' },
              { id: 'new-arrivals', label: 'New Arrivals' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-botanical text-ivory shadow-md'
                  : 'bg-white text-charcoal/70 hover:bg-rose-50 hover:text-rose-700 border border-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <StaggerItem key={product._id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center pt-10">
          <Link
            href="/shop"
            prefetch={true}
            className="inline-flex items-center space-x-2 border-2 border-botanical text-botanical hover:bg-botanical hover:text-ivory px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition"
          >
            <span>View All {products.length} Styles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 4 — INSTAGRAM-FIRST EXPERIENCE ("Latest from Our Instagram") */}
      <section className="bg-cream/60 py-16 border-y border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up" duration={0.5} className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <div className="inline-flex items-center space-x-1.5 text-rose-700 text-xs font-bold uppercase tracking-[0.3em]">
              <Instagram className="w-4 h-4" />
              <span>@ANTHURIUM.OFFICIAL</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-botanical">Latest from Our Instagram</h2>
            <p className="text-xs text-gray-500 font-light">
              Watch reels, see how our customers style their outfits, and shop the look instantly.
            </p>
          </ScrollReveal>

          {/* Stories Reel Cards */}
          <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <StaggerItem key={story._id}>
                <div
                  onClick={() => setSelectedStory(story)}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer border border-rose-100/60"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <img
                      src={story.thumbnailUrl || story.mediaUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Reel Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-500 transition">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>

                    {/* Views Badge */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-rose-300" />
                      <span>{story.viewsCount ? (story.viewsCount / 1000).toFixed(1) + 'K' : '12.4K'} views</span>
                    </div>

                    {/* Bottom Caption & CTA */}
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <h4 className="font-editorial text-lg font-bold line-clamp-1">{story.title}</h4>
                      <p className="text-xs text-white/80 line-clamp-1 font-light">{story.caption}</p>
                      <div className="pt-2">
                        <span className="inline-flex items-center space-x-1 bg-white text-botanical px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md group-hover:bg-rose-500 group-hover:text-white transition">
                          <span>Shop This Look</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 5 — BRAND STORY / PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" duration={0.6} className="bg-botanical text-ivory rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-blush">Craftsmanship & Culture</span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold leading-tight">
                "Indian heritage woven with contemporary fashion editorial."
              </h2>
              <p className="text-sm text-ivory/80 leading-relaxed font-light">
                Anthurium was born from a passion for authentic Indian textiles and modern feminine grace. Each piece is crafted in small batches by master artisans using organic silks, handloom chanderi, and botanical prints.
              </p>
              <div className="pt-2 flex items-center space-x-6 text-xs text-blush font-serif italic">
                <Link href="/about" prefetch={true} className="hover:underline font-sans font-bold uppercase tracking-wider text-xs text-white">Read Our Philosophy →</Link>
                <Link href="/craft" prefetch={true} className="hover:underline font-sans font-bold uppercase tracking-wider text-xs text-rose-300">Discover Artisans →</Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://tse3.mm.bing.net/th/id/OIP.iHISXSdN3Ch4bHegxMnJmAHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Craftsmanship 1"
                className="rounded-2xl shadow-lg object-cover h-65 w-full"
              />
              <img
                src="https://i.etsystatic.com/34608543/r/il/5e97aa/4669943550/il_fullxfull.4669943550_8hch.jpg"
                alt="Craftsmanship 2"
                className="rounded-2xl shadow-lg object-cover h-65 w-full mt-6"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 6 — VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white p-8 rounded-3xl border border-rose-100/60 shadow-soft">
          <StaggerItem className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-botanical">Pan-India Express Shipping</h4>
            <p className="text-xs text-gray-500">Free delivery on orders above ₹2,999 with live tracking updates.</p>
          </StaggerItem>
          <StaggerItem className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-botanical">Easy Exchanges</h4>
            <p className="text-xs text-gray-500">Hassle-free 7-day doorstep exchange and size assistance.</p>
          </StaggerItem>
          <StaggerItem className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-botanical">Authentic Handloom</h4>
            <p className="text-xs text-gray-500">100% genuine artisan weaves directly from traditional Indian looms.</p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* SECTION 7 — STORE LOCATOR TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" duration={0.5} className="bg-cream p-8 sm:p-12 rounded-3xl border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>VISIT OUR BOUTIQUE</span>
            </div>
            <h3 className="font-editorial text-3xl font-bold text-botanical">Come Experience Anthurium</h3>
            <p className="text-xs text-charcoal/70 max-w-md">
              Feel the pure organza drapes, try on custom fits, and enjoy warm filter coffee at our Race Course boutique in Coimbatore.
            </p>
          </div>
          <Link
            href="/store"
            prefetch={true}
            className="bg-botanical hover:bg-botanical-dark text-ivory px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shrink-0 transition"
          >
            Store Location & Hours →
          </Link>
        </ScrollReveal>
      </section>

      {/* Instagram Story Drawer Popup */}
      <InstagramDrawer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}

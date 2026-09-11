'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StoryPhase {
  id: number;
  eyebrow: string;
  headline: string;
  subtext: string;
  progressRange: [number, number]; // [start, end] in 0.0 - 1.0
}

const STORY_PHASES: StoryPhase[] = [
  {
    id: 1,
    eyebrow: 'FROM THE FABRIC',
    headline: 'Where every story begins.',
    subtext: 'Carefully chosen weaves, botanical dyes, and tactile elegance.',
    progressRange: [0.06, 0.24]
  },
  {
    id: 2,
    eyebrow: 'SHAPED BY HAND',
    headline: 'Cut, stitched and finished with care.',
    subtext: 'Every incision honors traditional Indian pattern craftsmanship.',
    progressRange: [0.26, 0.46]
  },
  {
    id: 3,
    eyebrow: 'DETAILS MATTER',
    headline: 'Every thread has a purpose.',
    subtext: 'Artisan needlework, reinforced seams, and nuanced floral borders.',
    progressRange: [0.48, 0.68]
  },
  {
    id: 4,
    eyebrow: 'CRAFTED FOR HER',
    headline: 'Tradition, thoughtfully made for today.',
    subtext: 'Comfortable movement meets timeless boutique silhouette.',
    progressRange: [0.70, 0.83]
  },
  {
    id: 5,
    eyebrow: 'FROM OUR HANDS, TO HERS.',
    headline: 'Wear your story.',
    subtext: 'The finished silhouette, crafted to accompany your everyday chapters.',
    progressRange: [0.85, 1.0]
  }
];

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance animation refs (bypassing React re-renders)
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const scrollDirectionRef = useRef<'down' | 'up'>('down');
  const lastScrollYRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Asset configuration refs
  const isMobileRef = useRef<boolean>(false);
  const maxFramesRef = useRef<number>(240);
  const assetFolderRef = useRef<string>('/story-sequence/desktop');

  // Bounded image cache & loading queue
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeLoadsRef = useRef<Set<number>>(new Set());
  const maxCacheSizeRef = useRef<number>(75);

  // React state (only updated on meaningful phase transitions)
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0); // 0 = intro, 1..5 = phases
  const lastReportedPhaseRef = useRef<number>(0);
  const [isCtaVisible, setIsCtaVisible] = useState<boolean>(false);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [scrollHintVisible, setScrollHintVisible] = useState<boolean>(true);

  // Helper to format frame filename
  const getFrameUrl = useCallback((index: number, isMobile: boolean) => {
    const folder = isMobile ? '/story-sequence/mobile' : '/story-sequence/desktop';
    const padded = String(index).padStart(3, '0');
    return `${folder}/frame_${padded}.webp`;
  }, []);

  // Frame preloader with LRU / window eviction
  const preloadFrame = useCallback((frameIndex: number, isMobile: boolean, onLoaded?: () => void) => {
    const total = isMobile ? 120 : 240;
    const clampedIndex = Math.max(0, Math.min(total - 1, frameIndex));

    if (imageCacheRef.current.has(clampedIndex)) {
      onLoaded?.();
      return;
    }

    if (activeLoadsRef.current.has(clampedIndex)) {
      return;
    }

    activeLoadsRef.current.add(clampedIndex);
    const img = new Image();
    img.src = getFrameUrl(clampedIndex, isMobile);

    img.onload = () => {
      activeLoadsRef.current.delete(clampedIndex);
      imageCacheRef.current.set(clampedIndex, img);

      // Bounded eviction: if cache exceeds limit, evict furthest from current position
      if (imageCacheRef.current.size > maxCacheSizeRef.current) {
        let furthestKey = -1;
        let maxDistance = -1;
        const currentCenter = Math.round(currentFrameRef.current);

        for (const key of imageCacheRef.current.keys()) {
          const dist = Math.abs(key - currentCenter);
          if (dist > maxDistance) {
            maxDistance = dist;
            furthestKey = key;
          }
        }

        if (furthestKey !== -1 && furthestKey !== 0 && furthestKey !== total - 1) {
          imageCacheRef.current.delete(furthestKey);
        }
      }

      onLoaded?.();
    };

    img.onerror = () => {
      activeLoadsRef.current.delete(clampedIndex);
    };
  }, [getFrameUrl]);

  // Priority-based preloading based on current frame and scroll direction
  const updatePreloadQueue = useCallback((centerFrame: number, direction: 'down' | 'up', isMobile: boolean) => {
    const total = isMobile ? 120 : 240;

    // Window config: prioritize direction
    const forwardLookahead = direction === 'down' ? (isMobile ? 14 : 22) : (isMobile ? 8 : 12);
    const backwardLookahead = direction === 'up' ? (isMobile ? 14 : 22) : (isMobile ? 8 : 12);

    // 1. Current frame
    preloadFrame(centerFrame, isMobile);

    // 2. Lookahead frames in direction of travel
    if (direction === 'down') {
      for (let i = 1; i <= forwardLookahead; i++) {
        if (centerFrame + i < total) preloadFrame(centerFrame + i, isMobile);
      }
      for (let i = 1; i <= backwardLookahead; i++) {
        if (centerFrame - i >= 0) preloadFrame(centerFrame - i, isMobile);
      }
    } else {
      for (let i = 1; i <= backwardLookahead; i++) {
        if (centerFrame - i >= 0) preloadFrame(centerFrame - i, isMobile);
      }
      for (let i = 1; i <= forwardLookahead; i++) {
        if (centerFrame + i < total) preloadFrame(centerFrame + i, isMobile);
      }
    }
  }, [preloadFrame]);

  // Canvas drawing function with contain aspect ratio
  const drawFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Check if requested image is loaded; fallback to nearest available frame in cache
    let img = imageCacheRef.current.get(frameIndex);
    if (!img) {
      // Find nearest loaded neighbor
      let minDiff = Infinity;
      let fallbackKey = -1;
      for (const key of imageCacheRef.current.keys()) {
        const diff = Math.abs(key - frameIndex);
        if (diff < minDiff) {
          minDiff = diff;
          fallbackKey = key;
        }
      }
      if (fallbackKey !== -1) {
        img = imageCacheRef.current.get(fallbackKey);
      }
    }

    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    // Master aspect ratio (1150 / 636 = ~1.808176)
    const masterAspect = 1150 / 636;
    const canvasAspect = canvasW / canvasH;

    let drawW: number;
    let drawH: number;

    // Contain scaling: ensure kurthi & embroidery are completely visible with pleasant letterbox
    if (canvasAspect > masterAspect) {
      drawH = canvasH;
      drawW = drawH * masterAspect;
    } else {
      drawW = canvasW;
      drawH = drawW / masterAspect;
    }

    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    // Background color: warm ivory matching Anthurium brand palette
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw the active video frame
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // Soft editorial vignette at edges for seamless integration
    const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
    grad.addColorStop(0, 'rgba(250, 247, 242, 0.45)');
    grad.addColorStop(0.08, 'rgba(250, 247, 242, 0)');
    grad.addColorStop(0.92, 'rgba(250, 247, 242, 0)');
    grad.addColorStop(1, 'rgba(250, 247, 242, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Window resize handler for DPR-aware canvas dimensions
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    maxFramesRef.current = isMobile ? 120 : 240;
    assetFolderRef.current = isMobile ? '/story-sequence/mobile' : '/story-sequence/desktop';
    maxCacheSizeRef.current = isMobile ? 50 : 85;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    if (lastDrawnFrameRef.current >= 0) {
      drawFrameToCanvas(lastDrawnFrameRef.current);
    }
  }, [drawFrameToCanvas]);

  // Main Scroll & RAF Animation Loop
  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    // Initial mobile check & resize
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial preloading: frame 0 and first 10 frames
    const isMobile = window.innerWidth < 768;
    preloadFrame(0, isMobile, () => {
      setIsFirstFrameLoaded(true);
      drawFrameToCanvas(0);
    });
    for (let i = 1; i <= 10; i++) {
      preloadFrame(i, isMobile);
    }

    // Passive scroll listener to compute normalized section progress
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollY = window.scrollY;

      // Track direction
      const direction = scrollY >= lastScrollYRef.current ? 'down' : 'up';
      scrollDirectionRef.current = direction;
      lastScrollYRef.current = scrollY;

      // Calculate scroll progress within the container
      // Container top reaches viewport top at rect.top <= 0
      // Scrollable distance = container height - window height
      const totalScrollDistance = rect.height - window.innerHeight;
      if (totalScrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollDistance));
      targetProgressRef.current = progress;

      // Map progress to target frame with perceptual deceleration in the final 18%
      // So the user can comfortably dwell on the finished kurthi details
      const maxF = maxFramesRef.current - 1;
      let calculatedFrame: number;

      if (progress < 0.82) {
        // Linear progression through craft stages (fabric -> cutting -> stitching)
        calculatedFrame = (progress / 0.82) * (maxF * 0.78);
      } else {
        // Slow reveal of finished kurthi (78% to 100% of frames over last 18% of scroll)
        const lateProgress = (progress - 0.82) / 0.18;
        calculatedFrame = (maxF * 0.78) + lateProgress * (maxF * 0.22);
      }

      targetFrameRef.current = Math.min(maxF, Math.max(0, calculatedFrame));

      // Trigger direction-aware preload
      updatePreloadQueue(Math.round(targetFrameRef.current), direction, isMobileRef.current);

      // Dismiss scroll hint once progress starts
      if (progress > 0.03 && scrollHintVisible) {
        setScrollHintVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // requestAnimationFrame rendering loop with physics damping (lerp)
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      // Lerp interpolation (damping = 0.14 for luxury inertia without delay)
      const damping = 0.14;
      const targetF = targetFrameRef.current;
      const currentF = currentFrameRef.current;
      const diff = targetF - currentF;

      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * damping;
      } else {
        currentFrameRef.current = targetF;
      }

      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * damping;

      const roundedFrame = Math.round(currentFrameRef.current);
      if (roundedFrame !== lastDrawnFrameRef.current) {
        drawFrameToCanvas(roundedFrame);
      }

      // Check for phase transitions (only update React state when crossing phase boundaries)
      const p = targetProgressRef.current;
      let newPhase = 0;
      for (const phase of STORY_PHASES) {
        if (p >= phase.progressRange[0] && p <= phase.progressRange[1]) {
          newPhase = phase.id;
          break;
        }
      }

      if (newPhase !== lastReportedPhaseRef.current) {
        lastReportedPhaseRef.current = newPhase;
        setActivePhaseIndex(newPhase);
      }

      const shouldShowCta = p >= 0.84;
      setIsCtaVisible(shouldShowCta);

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', onMotionChange);
      imageCacheRef.current.clear();
      activeLoadsRef.current.clear();
    };
  }, [drawFrameToCanvas, handleResize, preloadFrame, updatePreloadQueue, scrollHintVisible]);

  // Reduced motion accessible fallback view
  if (isReducedMotion) {
    return (
      <section className="relative bg-ivory py-20 px-4 sm:px-6 lg:px-8 border-y border-rose-100/60 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200/60">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-900">
                CRAFTED WITH INTENTION
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical leading-[1.15]">
              From Fabric <span className="block italic text-rose-800 font-normal">to Her Story.</span>
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              Every Anthurium kurthi begins with carefully selected organic weaves, artisanal cutting, and nuanced embroidery crafted to accompany your everyday chapters.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=kurtis"
                prefetch={true}
                className="inline-flex items-center space-x-2 bg-botanical hover:bg-botanical-dark text-ivory px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition transform active:scale-95"
              >
                <span>EXPLORE KURTHIS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-rose-100/80 aspect-[16/9] bg-warm-beige">
            <img
              src="/story-sequence/hero_kurthi.webp"
              alt="Anthurium Handcrafted Kurthi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  const currentPhase = STORY_PHASES.find(p => p.id === activePhaseIndex);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-ivory text-charcoal"
      // Responsive scroll pacing: Desktop: 220vh, Tablet: 185vh, Mobile: 155vh
      style={{ minHeight: '220vh' }}
    >
      {/* Sticky Cinematic Viewport: stays pinned while user scrolls through the 220vh distance */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden select-none">

        {/* TOP EDITORIAL HEADER & INTRO */}
        <header className="relative z-30 pt-6 sm:pt-8 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block mr-1" />
              <span>CRAFTED WITH INTENTION</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-botanical leading-tight">
              From Fabric to Her Story.
            </h2>
          </div>

          {/* Minimal Phased Counter (e.g. 03 / 05) */}
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-100/80 shadow-soft">
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-botanical">
              {activePhaseIndex > 0 ? `0${activePhaseIndex}` : '01'}
            </span>
            <span className="text-[10px] text-gray-400">/</span>
            <span className="text-[10px] sm:text-xs font-mono text-gray-400">05</span>
          </div>
        </header>

        {/* CENTRAL CINEMATIC CANVAS CONTAINER */}
        <div className="relative flex-1 w-full flex items-center justify-center px-2 sm:px-6 my-auto">
          {/* Subtle warm container frame with luxury boutique shadow */}
          <div className="relative w-full max-w-6xl aspect-[1150/636] max-h-[68vh] sm:max-h-[72vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-rose-200/50 bg-[#FAF7F2]">

            {/* The single high-performance canvas surface */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block object-contain"
              style={{ touchAction: 'pan-y' }}
            />

            {/* Lightweight Editorial Loader (fades out as frame 0 renders) */}
            {!isFirstFrameLoaded && (
              <div className="absolute inset-0 bg-ivory flex flex-col items-center justify-center z-20 space-y-3 transition-opacity duration-700">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-botanical">
                  ANTHURIUM
                </span>
                <span className="font-editorial text-sm sm:text-base italic text-rose-800">
                  Crafting the story...
                </span>
                <div className="w-24 h-[1.5px] bg-rose-200 overflow-hidden rounded-full">
                  <div className="w-full h-full bg-rose-600 animate-pulse" />
                </div>
              </div>
            )}

            {/* Subtle luxury film grain vignette overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
        </div>

        {/* BOTTOM SYNCHRONIZED TYPOGRAPHY & FINAL HERO CALL-TO-ACTION */}
        <footer className="relative z-30 pb-6 sm:pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Phased Story Text Overlay (Graceful fade & translate) */}
            <div className="min-h-[56px] flex flex-col justify-center text-center sm:text-left transition-all duration-500">
              {currentPhase ? (
                <div key={currentPhase.id} className="space-y-1 animate-fadeIn">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-rose-700">
                    {currentPhase.eyebrow}
                  </p>
                  <p className="font-editorial text-lg sm:text-xl md:text-2xl font-semibold text-botanical leading-tight">
                    {currentPhase.headline}
                  </p>
                  <p className="text-xs text-charcoal/75 font-light hidden sm:block">
                    {currentPhase.subtext}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-rose-700">
                    CRAFTED WITH INTENTION
                  </p>
                  <p className="font-editorial text-lg sm:text-xl font-semibold text-botanical">
                    Every thread has a story.
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Micro Scroll Prompt OR Final Hero CTA Button */}
            <div className="flex items-center justify-center">
              {isCtaVisible ? (
                <Link
                  href="/shop?category=kurtis"
                  prefetch={true}
                  className="inline-flex items-center space-x-3 bg-botanical hover:bg-botanical-dark text-ivory px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl border border-rose-300/40 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeIn"
                  style={{ minHeight: '48px' }}
                >
                  <span>EXPLORE KURTHIS</span>
                  <ArrowRight className="w-4 h-4 text-champagne" />
                </Link>
              ) : scrollHintVisible ? (
                <div className="flex items-center space-x-2 text-rose-800/80 animate-bounce transition-opacity duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                    Scroll to Discover
                  </span>
                  <div className="w-4 h-4 rounded-full border border-rose-300 flex items-center justify-center">
                    <span className="w-1 h-1 bg-rose-600 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2 text-charcoal/40 text-[11px] uppercase tracking-widest font-mono">
                  <span>Interactive Craft Sequence</span>
                </div>
              )}
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StoryChapter {
  id: number;
  chapterNumber: string;
  eyebrow: string;
  heading: string;
  supportingText: string;
  detailLine: string;
  progressRange: [number, number]; // [start, end] in 0.0 - 1.0
  position: 'top-left' | 'top-right' | 'bottom-left' | 'center-left';
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    chapterNumber: '01',
    eyebrow: '01 / THE BEGINNING',
    heading: 'FROM THE FABRIC',
    supportingText: 'Every story begins with the touch, texture and character of the cloth.',
    detailLine: 'Selected with intention.',
    progressRange: [0.0, 0.20],
    position: 'top-left'
  },
  {
    id: 2,
    chapterNumber: '02',
    eyebrow: '02 / SHAPING THE STORY',
    heading: 'CUT WITH PURPOSE.',
    supportingText: 'Measured, shaped and carefully prepared for the silhouette it will become.',
    detailLine: 'EVERY LINE HAS A PURPOSE.',
    progressRange: [0.20, 0.40],
    position: 'top-right'
  },
  {
    id: 3,
    chapterNumber: '03',
    eyebrow: '03 / THE CRAFT',
    heading: 'SHAPED BY HAND.',
    supportingText: 'Stitched with patience. Finished with care.',
    detailLine: 'MADE TO BE FELT.',
    progressRange: [0.40, 0.60],
    position: 'bottom-left'
  },
  {
    id: 4,
    chapterNumber: '04',
    eyebrow: '04 / DETAILS MATTER',
    heading: 'EVERY THREAD TELLS A STORY.',
    supportingText: 'From the smallest stitch to the final finishing touch.',
    detailLine: 'CRAFTED FOR HER.',
    progressRange: [0.60, 0.82],
    position: 'top-left'
  },
  {
    id: 5,
    chapterNumber: '05',
    eyebrow: '05 / THE FINAL PIECE',
    heading: 'FROM OUR HANDS,\nTO HERS.',
    supportingText: 'A piece of craftsmanship, made to become part of her story.',
    detailLine: 'WEAR YOUR STORY.',
    progressRange: [0.82, 1.0],
    position: 'center-left'
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

  // Bounded image cache & loading queue
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeLoadsRef = useRef<Set<number>>(new Set());
  const maxCacheSizeRef = useRef<number>(85);

  // React states (only updated on chapter transitions or UI flags)
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const lastReportedChapterRef = useRef<number>(1);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [scrollHintVisible, setScrollHintVisible] = useState<boolean>(true);
  const [isCtaVisible, setIsCtaVisible] = useState<boolean>(false);

  // Helper to format frame filename
  const getFrameUrl = useCallback((index: number, isMobile: boolean) => {
    const folder = isMobile ? '/story-sequence/mobile' : '/story-sequence/desktop';
    const padded = String(index).padStart(3, '0');
    return `${folder}/frame_${padded}.webp`;
  }, []);

  // Frame preloader with LRU window eviction
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
    const forwardLookahead = direction === 'down' ? (isMobile ? 16 : 26) : (isMobile ? 8 : 12);
    const backwardLookahead = direction === 'up' ? (isMobile ? 16 : 26) : (isMobile ? 8 : 12);

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

  // Full-Screen Edge-to-Edge Canvas Drawing
  const drawFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Check if requested image is loaded; fallback to nearest available frame in cache
    let img = imageCacheRef.current.get(frameIndex);
    if (!img) {
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

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const isMobile = isMobileRef.current;

    // Master aspect ratio (1150 / 636 = ~1.808176)
    const videoAspect = 1150 / 636;
    const canvasAspect = canvasW / canvasH;

    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (!isMobile) {
      // Desktop: Edge-to-edge full-bleed cinematic composition (cover scaling)
      if (canvasAspect > videoAspect) {
        drawW = canvasW;
        drawH = canvasW / videoAspect;
        offsetX = 0;
        offsetY = (canvasH - drawH) / 2;
      } else {
        drawH = canvasH;
        drawW = canvasH * videoAspect;
        offsetX = (canvasW - drawW) / 2;
        offsetY = 0;
      }
    } else {
      // Mobile portrait: Prioritize garment and craftsmanship visibility without aggressive crop
      // Fits width edge-to-edge and vertically positions it gracefully
      drawW = canvasW;
      drawH = canvasW / videoAspect;
      offsetX = 0;
      // Position slightly above true center (0.40) so mobile top/bottom text breathe naturally
      offsetY = (canvasH - drawH) * 0.40;
    }

    // Fill background with warm deep tone matching the video atelier / studio environment
    ctx.fillStyle = '#121110';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw the active video frame
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // Subtle edge blending vignette on mobile to seamlessly merge vertical gutters
    if (isMobile && offsetY > 0) {
      const topGrad = ctx.createLinearGradient(0, offsetY, 0, offsetY + 60);
      topGrad.addColorStop(0, 'rgba(18, 17, 16, 1)');
      topGrad.addColorStop(1, 'rgba(18, 17, 16, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, offsetY, canvasW, 60);

      const bottomY = offsetY + drawH;
      const botGrad = ctx.createLinearGradient(0, bottomY - 60, 0, bottomY);
      botGrad.addColorStop(0, 'rgba(18, 17, 16, 0)');
      botGrad.addColorStop(1, 'rgba(18, 17, 16, 1)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, bottomY - 60, canvasW, 60);
    }

    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Resize handler for true full-bleed viewport
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    maxFramesRef.current = isMobile ? 120 : 240;
    maxCacheSizeRef.current = isMobile ? 50 : 90;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (lastDrawnFrameRef.current >= 0) {
      drawFrameToCanvas(lastDrawnFrameRef.current);
    }
  }, [drawFrameToCanvas]);

  // Main Scroll & RAF Animation Loop
  useEffect(() => {
    // Detect reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    // Initial resize setup
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial preload: frame 0 and first 12 frames
    const isMobile = window.innerWidth < 768;
    preloadFrame(0, isMobile, () => {
      setIsFirstFrameLoaded(true);
      drawFrameToCanvas(0);
    });
    for (let i = 1; i <= 14; i++) {
      preloadFrame(i, isMobile);
    }

    // Scroll listener to calculate normalized section progress
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollY = window.scrollY;

      // Track direction
      const direction = scrollY >= lastScrollYRef.current ? 'down' : 'up';
      scrollDirectionRef.current = direction;
      lastScrollYRef.current = scrollY;

      // Scrollable distance = container height - window height
      const totalScrollDistance = rect.height - window.innerHeight;
      if (totalScrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollDistance));
      targetProgressRef.current = progress;

      // Map progress to target frame:
      // Chapter 1-4 (0.0 to 0.82): smoothly traverses from fabric -> cut -> craft -> stitch (0 to 78% of frames)
      // Chapter 5 (0.82 to 1.0): perceptually slows down across last 22% of frames to dwell on the finished kurthi hero
      const maxF = maxFramesRef.current - 1;
      let calculatedFrame: number;

      if (progress < 0.82) {
        calculatedFrame = (progress / 0.82) * (maxF * 0.78);
      } else {
        const lateProgress = (progress - 0.82) / 0.18;
        calculatedFrame = (maxF * 0.78) + lateProgress * (maxF * 0.22);
      }

      targetFrameRef.current = Math.min(maxF, Math.max(0, calculatedFrame));

      // Trigger direction-aware preload
      updatePreloadQueue(Math.round(targetFrameRef.current), direction, isMobileRef.current);

      // Dismiss scroll hint once scrolling commences
      if (progress > 0.02 && scrollHintVisible) {
        setScrollHintVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // requestAnimationFrame loop with physics damping (lerp)
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      // Damping = 0.13 for refined cinematic inertia
      const damping = 0.13;
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

      // Check chapter transition (only re-render React state when chapter id changes)
      const p = targetProgressRef.current;
      let newChapter = 1;
      for (const ch of STORY_CHAPTERS) {
        if (p >= ch.progressRange[0] && p <= ch.progressRange[1]) {
          newChapter = ch.id;
          break;
        }
      }

      if (newChapter !== lastReportedChapterRef.current) {
        lastReportedChapterRef.current = newChapter;
        setActiveChapterId(newChapter);
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
      <section className="relative w-full min-h-[90vh] bg-[#121110] text-ivory flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <img
            src="/story-sequence/hero_kurthi.webp"
            alt="Anthurium Handcrafted Kurthi"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
              05 / THE FINAL PIECE
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
            FROM OUR HANDS,<br />TO HERS.
          </h2>
          <p className="text-base sm:text-xl text-white/80 max-w-lg leading-relaxed font-light">
            A piece of craftsmanship, made to become part of her story.
          </p>
          <div className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne pt-2">
            WEAR YOUR STORY.
          </div>
          <div className="pt-4">
            <Link
              href="/shop?category=kurtis"
              prefetch={true}
              className="inline-flex items-center space-x-3 bg-botanical hover:bg-botanical-dark text-ivory px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition transform hover:scale-105 active:scale-95"
            >
              <span>EXPLORE KURTHIS</span>
              <ArrowRight className="w-4 h-4 text-champagne" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeChapter = STORY_CHAPTERS.find(ch => ch.id === activeChapterId) || STORY_CHAPTERS[0];

  // Responsive typography placement
  const getDesktopPlacementClasses = (pos: StoryChapter['position']) => {
    switch (pos) {
      case 'top-left':
        return 'top-20 sm:top-28 left-6 sm:left-12 lg:left-24 max-w-xl text-left items-start';
      case 'top-right':
        return 'top-20 sm:top-28 left-6 sm:left-auto sm:right-12 lg:right-24 max-w-xl text-left sm:text-right items-start sm:items-end';
      case 'bottom-left':
        return 'bottom-20 sm:bottom-28 left-6 sm:left-12 lg:left-24 max-w-xl text-left items-start';
      case 'center-left':
        return 'bottom-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 left-6 sm:left-12 lg:left-24 max-w-2xl text-left items-start';
      default:
        return 'top-24 left-12 max-w-xl text-left items-start';
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#121110] text-white"
      // Tall scroll track for luxury pacing: Desktop: 260vh, Tablet: 210vh, Mobile: 175vh
      style={{ minHeight: '260vh' }}
    >
      {/* Top Breathing Space Gradient (Smooth transition from normal ecommerce page into cinematic film) */}
      <div className="w-full h-16 sm:h-24 bg-gradient-to-b from-ivory via-ivory/50 to-[#121110] absolute -top-16 sm:-top-24 left-0 right-0 pointer-events-none z-10" />

      {/* FULLSCREEN STICKY CINEMATIC VIEWPORT */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden select-none">

        {/* EDGE-TO-EDGE HIGH-PERFORMANCE CANVAS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-0"
          style={{ touchAction: 'pan-y' }}
        />

        {/* SUBTLE CINEMATIC OVERLAYS (Ensures typography readability without darkening footage) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/65 via-transparent to-black/45" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-transparent hidden md:block" />

        {/* INITIAL EDITORIAL LOADER (Fades out when frame 0 is drawn) */}
        {!isFirstFrameLoaded && (
          <div className="absolute inset-0 bg-[#121110] flex flex-col items-center justify-center z-40 space-y-4 transition-opacity duration-700">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-champagne">
              ANTHURIUM
            </span>
            <span className="font-editorial text-lg sm:text-xl italic text-white/90">
              Crafting the story...
            </span>
            <div className="w-28 h-[1.5px] bg-white/20 overflow-hidden rounded-full">
              <div className="w-full h-full bg-champagne animate-pulse" />
            </div>
          </div>
        )}

        {/* TOP STATUS BAR: BRAND EYE受信 & CHAPTER PROGRESS COUNTER */}
        <div className="absolute top-6 sm:top-8 left-6 sm:left-12 right-6 sm:right-12 z-30 flex items-center justify-between pointer-events-none">
          {/* Subtle Brand Tag */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse inline-block" />
            <span>CRAFTED WITH INTENTION</span>
          </div>

          {/* Premium Chapter Numbering (e.g. 03 — 05) */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-xl">
            <span className="font-mono text-xs sm:text-sm font-semibold text-white tracking-widest">
              {activeChapter.chapterNumber}
            </span>
            <span className="text-white/40 text-xs">—</span>
            <span className="font-mono text-xs sm:text-sm text-white/50 tracking-widest">
              05
            </span>
          </div>
        </div>

        {/* INTEGRATED EDITORIAL TYPOGRAPHY OVERLAY */}
        <div
          key={activeChapter.id}
          className={`absolute z-20 flex flex-col pointer-events-none transition-all duration-700 ease-out animate-fadeIn ${getDesktopPlacementClasses(activeChapter.position)}`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-champagne">
              {activeChapter.eyebrow}
            </span>
          </div>

          {/* Editorial Headline */}
          <h2
            className="font-editorial font-bold text-white tracking-tight leading-[1.05] whitespace-pre-line drop-shadow-md text-3xl sm:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4"
          >
            {activeChapter.heading}
          </h2>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-md leading-relaxed font-light drop-shadow-sm mb-3">
            {activeChapter.supportingText}
          </p>

          {/* Small Detail Tag */}
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-white/60">
            {activeChapter.detailLine}
          </div>

          {/* Final Hero Call-to-Action (Revealed on Chapter 5) */}
          {activeChapter.id === 5 && isCtaVisible && (
            <div className="pt-6 sm:pt-8 pointer-events-auto">
              <Link
                href="/shop?category=kurtis"
                prefetch={true}
                className="inline-flex items-center space-x-3 bg-botanical hover:bg-botanical-dark text-ivory px-9 py-4 sm:py-4.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl border border-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{ minHeight: '48px' }}
              >
                <span>EXPLORE KURTHIS</span>
                <ArrowRight className="w-4 h-4 text-champagne" />
              </Link>
            </div>
          )}
        </div>

        {/* BOTTOM SCROLL INDICATOR (Fades out when scrolling begins) */}
        {scrollHintVisible && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-2 pointer-events-none transition-opacity duration-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
              SCROLL TO DISCOVER
            </span>
            <div className="w-[1.5px] h-8 bg-gradient-to-b from-white via-white/40 to-transparent animate-pulse" />
          </div>
        )}

      </div>
    </section>
  );
}

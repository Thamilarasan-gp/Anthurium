'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StoryChapter {
  id: number;
  chapterNumber: string;
  eyebrow: string;
  heading: string;
  mobileHeading?: string;
  supportingText: string;
  mobileSupportingText?: string;
  detailLine?: string;
  startProgress: number;
  peakStart: number;
  peakEnd: number;
  endProgress: number;
  desktopPosition: 'top-left' | 'top-right' | 'bottom-left' | 'center-left';
  mobilePosition: 'top' | 'bottom';
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    chapterNumber: '01',
    eyebrow: '01 / THE BEGINNING',
    heading: 'FROM THE FABRIC',
    mobileHeading: 'FROM THE FABRIC',
    supportingText: 'Every story begins with the touch, texture and character of the cloth.',
    mobileSupportingText: 'Every story begins with the character of the cloth.',
    detailLine: 'Selected with intention.',
    startProgress: 0.0,
    peakStart: 0.0,
    peakEnd: 0.09,
    endProgress: 0.13,
    desktopPosition: 'top-left',
    mobilePosition: 'top'
  },
  {
    id: 2,
    chapterNumber: '02',
    eyebrow: '02 / SHAPING THE STORY',
    heading: 'CUT WITH PURPOSE.',
    mobileHeading: 'CUT WITH PURPOSE.',
    supportingText: 'Measured, shaped and carefully prepared for the silhouette it will become.',
    mobileSupportingText: 'Measured. Shaped. Prepared.',
    detailLine: 'EVERY LINE HAS A PURPOSE.',
    startProgress: 0.17,
    peakStart: 0.20,
    peakEnd: 0.27,
    endProgress: 0.31,
    desktopPosition: 'top-right',
    mobilePosition: 'bottom'
  },
  {
    id: 3,
    chapterNumber: '03',
    eyebrow: '03 / THE CRAFT',
    heading: 'SHAPED BY HAND.',
    mobileHeading: 'SHAPED BY HAND.',
    supportingText: 'Stitched slowly.\nFinished with intention.',
    mobileSupportingText: 'Stitched slowly.\nFinished with intention.',
    detailLine: 'MADE TO BE FELT.',
    startProgress: 0.35,
    peakStart: 0.44,
    peakEnd: 0.56,
    endProgress: 0.65,
    desktopPosition: 'bottom-left',
    mobilePosition: 'bottom'
  },
  {
    id: 4,
    chapterNumber: '04',
    eyebrow: '04 / DETAILS MATTER',
    heading: 'EVERY THREAD\nTELLS A STORY.',
    mobileHeading: 'EVERY THREAD TELLS A STORY.',
    supportingText: 'From the smallest stitch to the final finishing touch.',
    mobileSupportingText: 'From the smallest stitch to the final touch.',
    detailLine: 'CRAFTED FOR HER.',
    startProgress: 0.68,
    peakStart: 0.71,
    peakEnd: 0.78,
    endProgress: 0.82,
    desktopPosition: 'top-left',
    mobilePosition: 'bottom'
  },
  {
    id: 5,
    chapterNumber: '05',
    eyebrow: '05 / THE FINAL PIECE',
    heading: 'FROM OUR HANDS,\nTO HERS.',
    mobileHeading: 'FROM OUR HANDS, TO HERS.',
    supportingText: 'A piece of craftsmanship, made to become part of her story.',
    mobileSupportingText: 'Wear your story.',
    detailLine: 'WEAR YOUR STORY.',
    startProgress: 0.85,
    peakStart: 0.88,
    peakEnd: 1.0,
    endProgress: 1.0,
    desktopPosition: 'center-left',
    mobilePosition: 'bottom'
  }
];

// Non-linear cinematic pacing function:
// Chapter 03 ("THE CRAFT" - sewing needle & stitchwork) receives 32% of total vertical scroll distance,
// making its visual frame progression 2.5x–3x slower perceptually for a meditative artisan experience.
function progressToCinematicFrame(p: number, totalFrames: number): number {
  const maxF = totalFrames - 1;
  if (p <= 0) return 0;
  if (p >= 1) return maxF;

  // 0.00 -> 0.16: Chapter 1 - Fabric opening (frames 0 to ~36)
  if (p < 0.16) {
    const t = p / 0.16;
    return (t * 0.15) * maxF;
  }
  // 0.16 -> 0.34: Chapter 2 - Cutting with purpose (frames ~36 to ~82)
  else if (p < 0.34) {
    const t = (p - 0.16) / 0.18;
    return (0.15 + t * 0.19) * maxF;
  }
  // 0.34 -> 0.66: Chapter 3 - THE CRAFT (Sewing needle, stitch, thread) - 32% OF SCROLL!
  // Covers frames ~82 to ~136 (only ~54 frames across 32% of scroll distance = ~2.7x slower per pixel)
  else if (p < 0.66) {
    const t = (p - 0.34) / 0.32;
    return (0.34 + t * 0.22) * maxF;
  }
  // 0.66 -> 0.83: Chapter 4 - Details matter & embroidery (frames ~136 to ~186)
  else if (p < 0.83) {
    const t = (p - 0.66) / 0.17;
    return (0.56 + t * 0.21) * maxF;
  }
  // 0.83 -> 0.91: Chapter 5 - Kurthi reveal
  else if (p < 0.91) {
    const t = (p - 0.83) / 0.08;
    return (0.77 + t * 0.14) * maxF;
  }
  // 0.91 -> 1.00: Final hero ease-out pause
  else {
    const t = (p - 0.91) / 0.09;
    const easeT = 1 - Math.pow(1 - t, 2.2);
    return (0.91 + easeT * 0.09) * maxF;
  }
}

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

  // React states
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const lastReportedChapterRef = useRef<number>(0);
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [scrollHintVisible, setScrollHintVisible] = useState<boolean>(true);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

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

      // Bounded eviction: evict furthest from current position if cache exceeds limit
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

  // Direction-aware preloader prioritizing frames ahead in travel direction
  const updatePreloadQueue = useCallback((centerFrame: number, direction: 'down' | 'up', isMobile: boolean) => {
    const total = isMobile ? 120 : 240;
    const forwardLookahead = direction === 'down' ? (isMobile ? 18 : 28) : (isMobile ? 8 : 12);
    const backwardLookahead = direction === 'up' ? (isMobile ? 18 : 28) : (isMobile ? 8 : 12);

    preloadFrame(centerFrame, isMobile);

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

  // Clean, Natural Canvas Drawing with subtle physical camera breathing (zero dark overlay)
  const drawFrameToCanvas = useCallback((frameIndex: number, progressRatio: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Nearest-neighbor fallback if requested frame is still decoding
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

    // Subtle microscopic cinematic zoom (1.0 -> 1.035) to feel like a slow physical camera push
    const cameraZoom = 1.0 + progressRatio * 0.035;

    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    // Background: Pure warm ivory (#FAF7F2) matching Anthurium's signature palette
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvasW, canvasH);

    if (!isMobile) {
      // Desktop: Full-bleed cinematic composition
      if (canvasAspect > videoAspect) {
        drawW = canvasW * cameraZoom;
        drawH = (canvasW / videoAspect) * cameraZoom;
        offsetX = (canvasW - drawW) / 2;
        offsetY = (canvasH - drawH) / 2;
      } else {
        drawH = canvasH * cameraZoom;
        drawW = (canvasH * videoAspect) * cameraZoom;
        offsetX = (canvasW - drawW) / 2;
        offsetY = (canvasH - drawH) / 2;
      }
    } else {
      // Mobile portrait: Full-bleed cinematic framing without letterboxing (100vw x 100svh)
      // Fills viewport height while keeping the artisan subject (needle, embroidery, kurthi) centered and tactile
      drawH = canvasH * cameraZoom;
      drawW = drawH * videoAspect;
      offsetX = (canvasW - drawW) / 2;
      offsetY = (canvasH - drawH) / 2;
    }

    // Draw the active video frame with pure, natural colors (Zero artificial color alteration)
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Resize handler for modern viewport units (100svh aware)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    setIsMobileState(isMobile);
    maxFramesRef.current = isMobile ? 120 : 240;
    maxCacheSizeRef.current = isMobile ? 50 : 90;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (lastDrawnFrameRef.current >= 0) {
      drawFrameToCanvas(lastDrawnFrameRef.current, currentProgressRef.current);
    }
  }, [drawFrameToCanvas]);

  // Main Scroll & RAF Animation Loop (EXTRA SLOW, HYPNOTIC CINEMATIC DAMPING IN CHAPTER 03)
  useEffect(() => {
    // Detect reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    // Initial resize setup
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial preload: frame 0 and first 16 frames
    const isMobile = window.innerWidth < 768;
    preloadFrame(0, isMobile, () => {
      setIsFirstFrameLoaded(true);
      drawFrameToCanvas(0, 0);
    });
    for (let i = 1; i <= 16; i++) {
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

      // Total scrollable distance
      const totalScrollDistance = rect.height - window.innerHeight;
      if (totalScrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollDistance));
      targetProgressRef.current = progress;

      // Map progress to target frame using non-linear cinematic pacing
      const maxF = maxFramesRef.current;
      targetFrameRef.current = progressToCinematicFrame(progress, maxF);

      // Preload frames ahead in scroll direction
      updatePreloadQueue(Math.round(targetFrameRef.current), direction, isMobileRef.current);

      // Dismiss scroll hint once scrolling commences, restore if scrolled back to top
      if (progress > 0.02 && scrollHintVisible) {
        setScrollHintVisible(false);
      } else if (progress <= 0.008 && !scrollHintVisible) {
        setScrollHintVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // requestAnimationFrame loop:
    // Chapter 03 ("THE CRAFT") activates stronger cinematic damping (0.030) and tighter speed ceiling (0.45 frames/tick)
    // so the sewing needle movement feels hypnotic, meditative, and authentic
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      const targetF = targetFrameRef.current;
      const currentF = currentFrameRef.current;
      const diff = targetF - currentF;
      const p = currentProgressRef.current;

      // Detect if currently in Chapter 03 craftsman zone (0.34 to 0.66)
      const isChapter3 = p >= 0.34 && p <= 0.66;

      // Silky damping: 0.030 for Chapter 3 (2.5x slower), 0.055 for other chapters
      const damping = isChapter3 ? 0.030 : 0.055;

      // Velocity ceiling: 0.45 frames/tick for Chapter 3 to prevent fast scrubbing; 1.25 for other chapters
      const maxStep = isChapter3 ? 0.45 : 1.25;
      const step = Math.sign(diff) * Math.min(Math.abs(diff) * damping, maxStep);

      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += step;
      } else {
        currentFrameRef.current = targetF;
      }

      // Smooth progress interpolation
      const progressDamping = isChapter3 ? 0.035 : 0.06;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * progressDamping;

      const roundedFrame = Math.round(currentFrameRef.current);
      if (roundedFrame !== lastDrawnFrameRef.current) {
        drawFrameToCanvas(roundedFrame, currentProgressRef.current);
      }

      // Track active chapter for counter badge (symmetrical midpoint distance for forward & backward consistency)
      const activeP = currentProgressRef.current;
      let curIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < STORY_CHAPTERS.length; i++) {
        const mid = (STORY_CHAPTERS[i].startProgress + STORY_CHAPTERS[i].endProgress) / 2;
        const dist = Math.abs(activeP - mid);
        if (dist < minDistance) {
          minDistance = dist;
          curIdx = i;
        }
      }

      if (curIdx !== lastReportedChapterRef.current) {
        lastReportedChapterRef.current = curIdx;
        setActiveChapterIndex(curIdx);
      }

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

  // Reduced motion accessible fallback view (Warm ivory, clean & accessible)
  if (isReducedMotion) {
    return (
      <section className="relative w-full min-h-[90vh] bg-[#FAF7F2] text-charcoal flex items-center justify-center px-6 py-20 overflow-hidden border-y border-rose-100/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200/60">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-900">
                05 / THE FINAL PIECE
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold text-botanical leading-[1.08]">
              FROM OUR HANDS,<br />TO HERS.
            </h2>
            <p className="text-base sm:text-lg text-charcoal/80 max-w-lg leading-relaxed font-light">
              A piece of craftsmanship, made to become part of her story.
            </p>
            <div className="text-xs uppercase tracking-[0.3em] font-semibold text-rose-800 pt-1">
              WEAR YOUR STORY.
            </div>
            <div className="pt-3">
              <Link
                href="/shop?category=kurtis"
                prefetch={true}
                className="inline-flex items-center space-x-3 bg-botanical hover:bg-botanical-dark text-ivory px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                <span>EXPLORE KURTHIS</span>
                <ArrowRight className="w-4 h-4 text-champagne" />
              </Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/9] bg-warm-beige border border-rose-100">
            <img
              src="/story-sequence/hero_kurthi.webp"
              alt="Anthurium Handcrafted Kurthi"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>
    );
  }

  // Standard chapter transform calculation
  const getChapterTransform = (ch: StoryChapter, p: number) => {
    if (p < ch.startProgress || p > ch.endProgress) {
      return { opacity: 0, translateY: 24, isVisible: false };
    }

    let opacity = 1;
    let translateY = 0;

    if (p < ch.peakStart) {
      const t = (p - ch.startProgress) / (ch.peakStart - ch.startProgress || 0.01);
      opacity = Math.max(0, Math.min(1, t));
      translateY = Math.round((1 - t) * 20);
    } else if (p > ch.peakEnd) {
      const t = (p - ch.peakEnd) / (ch.endProgress - ch.peakEnd || 0.01);
      opacity = Math.max(0, Math.min(1, 1 - t));
      translateY = Math.round(-t * 15);
    }

    return { opacity, translateY, isVisible: opacity > 0.01 };
  };

  // Chapter 03 SPECIAL SEQUENTIAL TRANSFORMS:
  // Layer 1: Eyebrow fades in first (0.340..0.380), holds, exits last (0.620..0.660)
  // Layer 2: Main Heading fades + 12px upward movement (0.385..0.425), holds, exits (0.580..0.620)
  // Layer 3: Supporting copy fades in (0.430..0.470), holds, exits (0.540..0.580)
  // Layer 4: Secondary line fades in last (0.475..0.510), exits first (0.510..0.540)
  // Reverses sequence on scroll-out; no bouncing, no scaling.
  const getChapter3SequentialTransforms = (p: number) => {
    const calcLayer = (
      enterStart: number,
      enterEnd: number,
      exitStart: number,
      exitEnd: number,
      translateDistance: number = 0
    ) => {
      if (p < enterStart || p > exitEnd) {
        return { opacity: 0, translateY: translateDistance };
      }
      if (p < enterEnd) {
        const t = (p - enterStart) / (enterEnd - enterStart || 0.01);
        return {
          opacity: Math.max(0, Math.min(1, t)),
          translateY: Math.round((1 - t) * translateDistance)
        };
      }
      if (p > exitStart) {
        const t = (p - exitStart) / (exitEnd - exitStart || 0.01);
        return {
          opacity: Math.max(0, Math.min(1, 1 - t)),
          translateY: Math.round(-t * (translateDistance > 0 ? 8 : 0))
        };
      }
      return { opacity: 1, translateY: 0 };
    };

    const eyebrow = calcLayer(0.350, 0.385, 0.615, 0.650, 0);
    const heading = calcLayer(0.385, 0.425, 0.580, 0.615, 12);
    const supporting = calcLayer(0.425, 0.465, 0.540, 0.580, 0);
    const secondary = calcLayer(0.465, 0.500, 0.505, 0.540, 0);

    const isVisible =
      eyebrow.opacity > 0.01 ||
      heading.opacity > 0.01 ||
      supporting.opacity > 0.01 ||
      secondary.opacity > 0.01;

    return { eyebrow, heading, supporting, secondary, isVisible };
  };

  // Helper to generate dynamic, subtle directional black gradient overlay (.story-overlay)
  // Functions as cinematic light shaping behind the active typography safe zone
  // Tuned with deeper black contrast where text sits, leaving craftsmanship vibrant
  const getActiveOverlayGradient = (chIdx: number, isMobile: boolean): string => {
    if (isMobile) {
      if (chIdx === 0) {
        // Chapter 01: Top-positioned text -> Deep top-down black shadow
        return 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.70) 18%, rgba(0,0,0,0.40) 32%, rgba(0,0,0,0.12) 46%, rgba(0,0,0,0.02) 56%, transparent 66%)';
      } else if (chIdx === 2) {
        // Chapter 03: Dual delicate safe zones (Top for heading, Bottom for craft text)
        // Center remains 100% natural, bright & vivid for needle & floral embroidery
        return 'linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.64) 18%, rgba(0,0,0,0.28) 30%, rgba(0,0,0,0.05) 40%, transparent 48%), linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.68) 18%, rgba(0,0,0,0.32) 30%, rgba(0,0,0,0.06) 40%, transparent 48%)';
      } else {
        // Chapters 02, 04, 05: Bottom-positioned text -> Deep bottom-up black shadow
        return 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 22%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0.03) 60%, transparent 70%)';
      }
    } else {
      if (chIdx === 1) {
        // Chapter 02: Right-positioned text -> Deep right-to-left black shadow
        return 'linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.75) 18%, rgba(0,0,0,0.52) 32%, rgba(0,0,0,0.24) 46%, rgba(0,0,0,0.05) 58%, transparent 70%)';
      } else if (chIdx === 4) {
        // Chapter 05: Rich left-side gradient leaving the centered kurthi brightly lit
        return 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.72) 20%, rgba(0,0,0,0.48) 35%, rgba(0,0,0,0.20) 48%, rgba(0,0,0,0.03) 60%, transparent 70%)';
      } else {
        // Chapters 01, 03, 04: Left-positioned text -> Deep multi-stop luxury editorial shadow
        return 'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.75) 18%, rgba(0,0,0,0.52) 32%, rgba(0,0,0,0.24) 46%, rgba(0,0,0,0.05) 58%, transparent 70%)';
      }
    }
  };

  const currentP = currentProgressRef.current;
  const activeChapter = STORY_CHAPTERS[activeChapterIndex] || STORY_CHAPTERS[0];
  const ch3Sequence = getChapter3SequentialTransforms(currentP);

  // Helper for responsive typography placement on Desktop vs Mobile
  const getDesktopPlacementClasses = (
    pos: StoryChapter['desktopPosition'],
    isCh3: boolean = false,
    isCh5: boolean = false
  ) => {
    if (isCh3) {
      // Chapter 03: Restrained left-side safe zone (max 35-40% viewport width)
      return 'md:bottom-28 lg:bottom-32 md:left-14 lg:left-24 md:max-w-[420px] md:text-left md:items-start';
    }
    if (isCh5) {
      // Chapter 05: Generously spaced from bottom edge with refined width
      return 'md:bottom-24 lg:bottom-28 md:left-14 lg:left-24 md:max-w-[400px] md:text-left md:items-start';
    }
    switch (pos) {
      case 'top-left':
        return 'md:top-24 md:left-14 lg:left-24 md:max-w-[420px] md:text-left md:items-start';
      case 'top-right':
        return 'md:top-24 md:left-auto md:right-14 lg:right-24 md:max-w-[420px] md:text-right md:items-end';
      case 'bottom-left':
        return 'md:bottom-28 lg:bottom-32 md:left-14 lg:left-24 md:max-w-[420px] md:text-left md:items-start';
      case 'center-left':
        return 'md:bottom-24 lg:bottom-28 md:left-14 lg:left-24 md:max-w-[400px] md:text-left md:items-start';
      default:
        return 'md:top-24 md:left-14 lg:left-24 md:max-w-[420px] md:text-left md:items-start';
    }
  };

  const getMobilePlacementClasses = (pos: StoryChapter['mobilePosition'], isCh5: boolean = false) => {
    if (isCh5) {
      // Chapter 05: Extra breathing room from screen bottom so button is well above navigation bar
      return 'bottom-20 sm:bottom-24 inset-x-5 sm:inset-x-8 max-w-[88vw] text-left items-start';
    }
    switch (pos) {
      case 'top':
        return 'top-14 sm:top-16 inset-x-5 sm:inset-x-8 max-w-[88vw] text-left items-start';
      case 'bottom':
        return 'bottom-14 sm:bottom-16 inset-x-5 sm:inset-x-8 max-w-[88vw] text-left items-start';
      default:
        return 'top-14 sm:top-16 inset-x-5 sm:inset-x-8 max-w-[88vw] text-left items-start';
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FAF7F2] text-charcoal"
      // Extended scroll track for slow, luxurious cinematic pacing:
      // Desktop: 280vh, Tablet: 230vh, Mobile: 210vh
      style={{ minHeight: isMobileState ? '210vh' : '280vh' }}
    >
      {/* FULLSCREEN STICKY CINEMATIC VIEWPORT (100svh modern viewport units) */}
      <div
        className="sticky top-0 w-full overflow-hidden select-none bg-[#FAF7F2]"
        style={{ height: '100svh' }}
      >
        {/* EDGE-TO-EDGE HIGH-PERFORMANCE CANVAS (Natural video frame rendering) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-0"
          style={{ touchAction: 'pan-y' }}
        />

        {/* SOPHISTICATED BLACK CINEMATIC DIRECTIONAL OVERLAY (.story-overlay) */}
        {/* Pointer-events: none. Exists only behind the active typography safe zone */}
        {/* Leaves the craftsmanship, needle, fabric and embroidery 100% natural and bright */}
        <div
          className="story-overlay absolute inset-0 pointer-events-none transition-all duration-700 ease-out z-10"
          style={{
            background: getActiveOverlayGradient(activeChapterIndex, isMobileState)
          }}
        />

        {/* INITIAL EDITORIAL LOADER (Fades out when frame 0 is ready) */}
        {!isFirstFrameLoaded && (
          <div className="absolute inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center z-40 space-y-3 transition-opacity duration-700">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-botanical">
              ANTHURIUM
            </span>
            <span className="font-editorial text-base sm:text-lg italic text-rose-800">
              Crafting the story...
            </span>
            <div className="w-24 h-[1.5px] bg-rose-200 overflow-hidden rounded-full">
              <div className="w-full h-full bg-rose-600 animate-pulse" />
            </div>
          </div>
        )}

        {/* TOP STATUS BAR: Subtle brand tag + minimal chapter counter (Safe-area aware) */}
        <div
          className="absolute top-4 sm:top-8 left-5 sm:left-12 right-5 sm:right-12 z-30 flex items-center justify-between pointer-events-none"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Subtle Brand Tag */}
          <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.28em] text-[#E8D3BA] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse inline-block" />
            <span>ANTHURIUM ATELIER</span>
          </div>

          {/* Minimal Chapter Counter (e.g. 03 — 05) */}
          <div className="flex items-center space-x-2 px-3 sm:px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-md">
            <span className="font-mono text-xs sm:text-sm font-semibold text-ivory tracking-widest transition-all duration-300">
              {activeChapter.chapterNumber}
            </span>
            <span className="text-white/30 text-xs">—</span>
            <span className="font-mono text-xs sm:text-sm text-white/50 tracking-widest">
              05
            </span>
          </div>
        </div>

        {/* OVERLAPPING EDITORIAL CHAPTER TYPOGRAPHY */}
        {STORY_CHAPTERS.map((ch) => {
          // CHAPTER 03 SPECIAL EDITORIAL TREATMENT:
          // 1. NO CARD / NO GLASSMORPHISM / NO RECTANGLE
          // 2. Warm ivory typography sitting directly in the photographic shadow
          // 3. Sequential 4-layer fade & upward reveal with pauses: Eyebrow -> Heading (12px rise) -> Supporting text -> Secondary line
          // 4. On Mobile: Header at top safe area, Supporting text at bottom safe area, Needle & embroidery in center completely visible!
          // 5. On Desktop: Grouped in left safe zone (occupying ~35-40% viewport width)
          if (ch.id === 3) {
            if (!ch3Sequence.isVisible) return null;

            if (isMobileState) {
              return (
                <React.Fragment key={ch.id}>
                  {/* MOBILE TOP BLOCK: Eyebrow & Heading in upper safe zone */}
                  <div
                    className="absolute z-20 flex flex-col pointer-events-none top-14 sm:top-16 inset-x-0"
                    style={{
                      paddingLeft: 'clamp(20px, 6vw, 32px)',
                      paddingRight: 'clamp(20px, 6vw, 32px)'
                    }}
                  >
                    <div className="space-y-1.5 pointer-events-none max-w-[88vw]">
                      {/* Layer 1: Eyebrow (appears 1st, exits last) */}
                      <div
                        style={{
                          opacity: ch3Sequence.eyebrow.opacity
                        }}
                        className="transition-opacity duration-300 ease-out"
                      >
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#E8D3BA] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          {ch.eyebrow}
                        </span>
                      </div>

                      {/* Layer 2: Main Heading (appears 2nd with 12px upward movement, exits 2nd) */}
                      <div
                        style={{
                          opacity: ch3Sequence.heading.opacity,
                          transform: `translateY(${ch3Sequence.heading.translateY}px)`
                        }}
                        className="transition-transform duration-300 ease-out"
                      >
                        <h2
                          style={{ fontSize: 'clamp(32px, 9vw, 44px)', lineHeight: 1.02 }}
                          className="font-editorial font-bold text-[#FFFDF9] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                        >
                          {ch.mobileHeading || ch.heading}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE BOTTOM BLOCK: Supporting text & secondary detail line in lower safe zone */}
                  <div
                    className="absolute z-20 flex flex-col pointer-events-none bottom-12 sm:bottom-14 inset-x-0"
                    style={{
                      paddingLeft: 'clamp(20px, 6vw, 32px)',
                      paddingRight: 'clamp(20px, 6vw, 32px)'
                    }}
                  >
                    <div className="space-y-1.5 pointer-events-none max-w-[88vw]">
                      {/* Layer 3: Supporting Copy (appears 3rd, exits 2nd) */}
                      <div
                        style={{
                          opacity: ch3Sequence.supporting.opacity
                        }}
                        className="transition-opacity duration-300 ease-out"
                      >
                        <p
                          style={{ fontSize: 'clamp(13px, 3.8vw, 15px)', lineHeight: 1.5 }}
                          className="text-[#F5EFEB]/90 font-light whitespace-pre-line drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                        >
                          {ch.mobileSupportingText || ch.supportingText}
                        </p>
                      </div>

                      {/* Layer 4: Secondary Detail Line (appears last, exits 1st) */}
                      <div
                        style={{
                          opacity: ch3Sequence.secondary.opacity
                        }}
                        className="transition-opacity duration-300 ease-out"
                      >
                        <div className="text-[9.5px] uppercase tracking-[0.22em] font-semibold text-[#E8D3BA]/90 pt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                          {ch.detailLine}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            }

            // DESKTOP: Grouped inside left-side photographic safe zone (~35-40% viewport width)
            return (
              <div
                key={ch.id}
                className={`absolute z-20 flex flex-col pointer-events-none ${getDesktopPlacementClasses(
                  ch.desktopPosition,
                  true
                )}`}
                style={{
                  paddingLeft: 'clamp(24px, 4vw, 48px)'
                }}
              >
                <div className="space-y-3 pointer-events-none max-w-[420px]">
                  {/* Layer 1: Eyebrow (appears 1st, exits last) */}
                  <div
                    style={{
                      opacity: ch3Sequence.eyebrow.opacity
                    }}
                    className="transition-opacity duration-300 ease-out"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8D3BA] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {ch.eyebrow}
                    </span>
                  </div>

                  {/* Layer 2: Main Heading (appears 2nd with 12px upward movement, exits 2nd) */}
                  <div
                    style={{
                      opacity: ch3Sequence.heading.opacity,
                      transform: `translateY(${ch3Sequence.heading.translateY}px)`
                    }}
                    className="transition-transform duration-300 ease-out"
                  >
                    <h2 className="font-editorial font-bold text-[#FFFDF9] tracking-tight leading-[1.04] text-4xl lg:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {ch.heading}
                    </h2>
                  </div>

                  {/* Layer 3: Supporting Copy (appears 3rd, exits 2nd) */}
                  <div
                    style={{
                      opacity: ch3Sequence.supporting.opacity
                    }}
                    className="transition-opacity duration-300 ease-out pt-1"
                  >
                    <p className="text-sm lg:text-base text-[#F5EFEB]/90 leading-relaxed font-light whitespace-pre-line drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                      {ch.supportingText}
                    </p>
                  </div>

                  {/* Layer 4: Secondary Detail Line (appears last, exits 1st) */}
                  <div
                    style={{
                      opacity: ch3Sequence.secondary.opacity
                    }}
                    className="transition-opacity duration-300 ease-out"
                  >
                    <div className="text-xs uppercase tracking-[0.24em] font-semibold text-[#E8D3BA]/90 pt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {ch.detailLine}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Chapters 01, 02, 04, 05: Editorial Typography sitting directly in photographic light-shaping shadow
          // ZERO cards, ZERO borders, ZERO glassmorphic boxes
          const { opacity, translateY, isVisible } = getChapterTransform(ch, currentP);
          if (!isVisible) return null;

          const isCh5 = ch.id === 5;

          return (
            <div
              key={ch.id}
              className={`absolute z-20 flex flex-col pointer-events-none transition-transform duration-300 ease-out ${isMobileState
                ? getMobilePlacementClasses(ch.mobilePosition, isCh5)
                : getDesktopPlacementClasses(ch.desktopPosition, false, isCh5)
                }`}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                paddingLeft: isMobileState ? 'clamp(20px, 6vw, 32px)' : 'clamp(24px, 4vw, 48px)',
                paddingRight: isMobileState ? 'clamp(20px, 6vw, 32px)' : 'clamp(24px, 4vw, 48px)'
              }}
            >
              <div className="space-y-2 sm:space-y-3 max-w-full">
                {/* Eyebrow */}
                <div className="inline-flex items-center space-x-2">
                  <span className="text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#E8D3BA] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {ch.eyebrow}
                  </span>
                </div>

                {/* Editorial Headline (Restrained, smaller elegant scale for Chapter 05) */}
                <h2
                  style={{
                    fontSize: isCh5
                      ? (isMobileState ? 'clamp(22px, 6vw, 28px)' : 'clamp(26px, 3vw, 36px)')
                      : (isMobileState ? 'clamp(32px, 9vw, 44px)' : undefined),
                    lineHeight: isCh5 ? 1.15 : 1.02
                  }}
                  className={`font-editorial font-bold text-[#FFFDF9] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-pre-line ${
                    isCh5 ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl lg:text-5xl'
                  }`}
                >
                  {isMobileState && ch.mobileHeading ? ch.mobileHeading : ch.heading}
                </h2>

                {/* Supporting Copy */}
                <p
                  style={{
                    fontSize: isMobileState ? (isCh5 ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 3.8vw, 15px)') : undefined,
                    lineHeight: 1.5
                  }}
                  className="text-[#F5EFEB]/95 font-light whitespace-pre-line drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] text-xs sm:text-sm lg:text-base max-w-sm lg:max-w-md"
                >
                  {isMobileState && ch.mobileSupportingText ? ch.mobileSupportingText : ch.supportingText}
                </p>

                {/* Small Detail Line */}
                {ch.detailLine && (
                  <div className="text-[9.5px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#E8D3BA]/95 pt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {ch.detailLine}
                  </div>
                )}

                {/* Final Hero Call-to-Action (Smooth bidirectional fade on Chapter 5 with generous spacing) */}
                {isCh5 && (
                  <div
                    className="pt-7 sm:pt-9 pointer-events-auto transition-all duration-500 ease-out"
                    style={{
                      opacity: Math.max(0, Math.min(1, (currentP - 0.86) / 0.05)),
                      transform: `translateY(${Math.max(0, (1 - Math.max(0, Math.min(1, (currentP - 0.86) / 0.05))) * 12)}px)`,
                      pointerEvents: currentP >= 0.88 ? 'auto' : 'none'
                    }}
                  >
                    <Link
                      href="/shop?category=kurtis"
                      prefetch={true}
                      className="inline-flex items-center space-x-3 bg-botanical hover:bg-botanical-dark text-ivory px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] shadow-2xl border border-champagne/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                      style={{ minHeight: '46px' }}
                    >
                      <span>EXPLORE KURTHIS</span>
                      <ArrowRight className="w-4 h-4 text-champagne" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* BOTTOM SCROLL INDICATOR (Subtle warm indicator, disappears smoothly on scroll) */}
        {scrollHintVisible && (
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1.5 pointer-events-none transition-opacity duration-500">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8D3BA]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              SCROLL TO DISCOVER
            </span>
            <div className="w-[1.5px] h-6 sm:h-8 bg-gradient-to-b from-[#E8D3BA] via-[#E8D3BA]/40 to-transparent animate-pulse" />
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: number | HTMLElement | string, options?: { offset?: number; immediate?: boolean; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const rafHandleRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect accessibility: if user prefers reduced motion, skip Lenis smoothing
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    // Check if device is primarily touch/mobile to prevent any interference with native touch gestures
    const isTouchOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;

    const lenis = new Lenis({
      duration: 1.15,
      // Subtle luxury easing curve (fast initial response, smooth gentle settling)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // Do not hijack or modify native touch scrolling on mobile devices
      syncTouch: false,
      touchMultiplier: 1.0,
      wheelMultiplier: 0.95,
      infinite: false,
    });

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      rafHandleRef.current = requestAnimationFrame(raf);
    }

    rafHandleRef.current = requestAnimationFrame(raf);

    // Provide lenis instance to global window for future 3D scroll story ("FROM THREAD TO YOU")
    (window as any).__anthurium_lenis = lenis;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
        setLenisInstance(null);
      }
    };
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      if (rafHandleRef.current) cancelAnimationFrame(rafHandleRef.current);
      lenis.destroy();
      setLenisInstance(null);
      delete (window as any).__anthurium_lenis;
    };
  }, []);

  // Smoothly reset scroll to top on route change without blocking interaction
  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenisInstance]);

  const scrollTo = (
    target: number | HTMLElement | string,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

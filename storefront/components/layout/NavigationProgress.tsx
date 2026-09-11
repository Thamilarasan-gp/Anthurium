'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const NavigationProgress: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress whenever route finishes changing
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks to provide 0ms instantaneous navigation feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, anchors, new tabs, modifier keys
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if clicking same page without search params change
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl || href === window.location.pathname) {
        return;
      }

      // Start progress indicator immediately on click
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setIsVisible(true);
      setIsNavigating(true);
      setProgress(25);

      // Smooth subtle advancement
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 80;
          }
          return prev + 15;
        });
      }, 150);

      // Safety timeout: never remain stuck
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsNavigating(false);
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 3500);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
      role="progressbar"
      aria-hidden="true"
    >
      {/* Luxury Champagne Gold / Anthurium Emerald bar */}
      <div
        className="h-full bg-gradient-to-r from-[#D8BE76] via-[#0B4A2B] to-[#E5CF8E] shadow-[0_0_8px_rgba(216,190,118,0.6)]"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? 'width 150ms ease-out' : 'width 300ms cubic-bezier(0.1, 0.5, 0.1, 1)',
        }}
      />
    </div>
  );
};

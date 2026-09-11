'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '../motion/SmoothScrollProvider';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      // Appear after ~550px of scroll depth
      if (window.scrollY > 550) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    scrollTo(0);
  };

  return (
    <button
      onClick={handleScrollToTop}
      className={`fixed bottom-20 sm:bottom-22 right-6 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg border border-[#D8BE76]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B] ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(250, 247, 242, 0.96) 0%, rgba(243, 235, 224, 0.96) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      aria-label="Back to top of page"
      title="Back to top"
    >
      <ArrowUp className="w-4 h-4 text-[#1C2C22] transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
};

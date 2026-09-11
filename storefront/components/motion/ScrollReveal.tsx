'use client';

import React, { useEffect, useState } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'fade-up' | 'fade-in' | 'scale-subtle';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

const variantsMap: Record<string, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: { delay: number; duration: number }) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: (custom: { delay: number; duration: number }) => ({
      opacity: 1,
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'scale-subtle': {
    hidden: { opacity: 0, scale: 0.98, y: 12 },
    visible: (custom: { delay: number; duration: number }) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.55,
  threshold = 0.1,
  className = '',
  ...props
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const selectedVariants = variantsMap[variant] || variantsMap['fade-up'];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold, margin: '0px 0px -40px 0px' }}
      variants={selectedVariants}
      custom={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.07,
  className = '',
  ...props
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -30px 0px' }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  ...props
}) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

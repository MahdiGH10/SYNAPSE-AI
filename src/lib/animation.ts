// Animation variants for Framer Motion - Premium human-crafted animations
import { Variants } from 'framer-motion';

// Check for reduced motion preference
export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Spring-based entrance animation (Apple, Framer style)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion
      ? { duration: 0.01 }
      : {
          type: 'spring',
          damping: 20,
          stiffness: 100,
          mass: 0.8,
        },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: prefersReducedMotion
      ? { duration: 0.01 }
      : {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1], // Custom bezier for smoothness
        },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: prefersReducedMotion
      ? { duration: 0.01 }
      : {
          type: 'spring',
          damping: 25,
          stiffness: 120,
        },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: prefersReducedMotion
      ? { duration: 0.01 }
      : {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: prefersReducedMotion
      ? { duration: 0.01 }
      : {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
  },
};

// Hover animation presets (Linear, Notion style)
export const hoverLift = {
  y: -8,
  transition: {
    type: 'spring',
    damping: 15,
    stiffness: 150,
  },
};

export const hoverScale = {
  scale: 1.05,
  transition: {
    type: 'spring',
    damping: 20,
    stiffness: 200,
  },
};

// Button interactions (Apple style)
export const tapScale = {
  scale: 0.98,
  transition: {
    type: 'spring',
    damping: 15,
    stiffness: 300,
  },
};

// Gentle float animation
export const floatAnimation = {
  y: [-4, 4, -4],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

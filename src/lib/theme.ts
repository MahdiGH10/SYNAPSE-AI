// Framer-inspired blue glow aesthetic - Premium & Refined
// Deep blues with ethereal glows and sophisticated accents

export const colors = {
  // Backgrounds - Deep midnight blues
  background: {
    primary: '#0A0E1A',      // Deep navy (almost black)
    secondary: '#0F172A',    // Slate midnight
    elevated: '#1E293B',     // Elevated surfaces
    glass: 'rgba(30, 41, 59, 0.6)', // Glassmorphism
  },
  // Brand accents - Electric blue glow palette
  brand: {
    primary: '#3B82F6',      // Electric blue (main)
    secondary: '#60A5FA',    // Bright blue (highlights)
    accent: '#818CF8',       // Indigo glow
    dark: '#1E3A8A',         // Deep blue (shadows)
  },
  // Text - Cool tones with excellent contrast
  text: {
    primary: '#F1F5F9',      // Almost white
    secondary: '#CBD5E1',    // Light slate
    tertiary: '#94A3B8',     // Medium slate
    inverse: '#0F172A',      // Dark for light backgrounds
  },
  // Neutrals - Blue-tinted grays
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const gradients = {
  // Premium blue gradients with glow
  brand: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  glow: 'linear-gradient(135deg, #3B82F6 0%, #818CF8 50%, #60A5FA 100%)',
  dark: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  // Ethereal mesh background
  mesh: `
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(129, 140, 248, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, #0A0E1A 0%, #0F172A 100%)
  `,
  // Glossy glass effect
  glass: 'linear-gradient(135deg, rgba(241, 245, 249, 0.1) 0%, rgba(241, 245, 249, 0.05) 100%)',
} as const;

export const spacing = {
  baseline: 8,
} as const;

export const borderRadius = {
  card: '1rem',
  button: '9999px',
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type ColorScheme = typeof colors;
export type GradientScheme = typeof gradients;

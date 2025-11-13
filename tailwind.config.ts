import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0E27',
          dark: '#050812',
          light: '#1a1f3a',
        },
        workspace: {
          base: '#0E0F14',
          dusk: '#141620',
          panel: 'rgba(22, 28, 44, 0.75)',
        },
        blue: {
          primary: '#3B82F6',
          bright: '#60A5FA',
          electric: '#2563EB',
        },
        purple: {
          primary: '#8B5CF6',
          bright: '#A78BFA',
          deep: '#7C3AED',
        },
        cyan: {
          primary: '#06B6D4',
          bright: '#22D3EE',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#F9FAFB',
          darker: '#F3F4F6',
        },
        accent: {
          aurora: '#6A5ACD',
          horizon: '#00BFFF',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0E27 0%, #1a1f3a 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #6A5ACD 0%, #00BFFF 100%)',
        'gradient-aurora-soft': 'linear-gradient(120deg, rgba(106,90,205,0.45) 0%, rgba(0,191,255,0.35) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #3B82F6, #8B5CF6, #06B6D4, #3B82F6)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 40px rgba(59, 130, 246, 0.6)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.6)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.6)',
        'neon': '0 0 5px theme(colors.blue.primary), 0 0 20px theme(colors.blue.primary), 0 0 40px theme(colors.blue.primary)',
        'panel': '0 22px 80px rgba(9, 13, 25, 0.6)',
        'panel-soft': '0 14px 60px rgba(12, 20, 40, 0.45)',
        'accent-glow': '0 0 30px rgba(106, 90, 205, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'mood-wave': 'mood-wave 14s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'mood-wave': {
          '0%': { transform: 'translate3d(0,0,0) scale(1)', opacity: 0.55 },
          '50%': { transform: 'translate3d(-2%, -1%, 0) scale(1.03)', opacity: 0.8 },
          '100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: 0.55 },
        },
      },
    },
  },
  plugins: [],
};

export default config;

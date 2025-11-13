'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animation';
import Icon from './Icon';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax effect for mesh gradients
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Magnetic button effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Limit magnetic pull to 6px max
    const clampedX = Math.max(-6, Math.min(6, distanceX * 0.15));
    const clampedY = Math.max(-6, Math.min(6, distanceY * 0.15));
    
    mouseX.set(clampedX);
    mouseY.set(clampedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: `
          radial-gradient(circle at 15% 20%, rgba(0, 153, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 60%),
          linear-gradient(180deg, #0A0A0F 0%, #121218 100%)
        `,
      }}
    >
      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Animated mesh gradients (subtle movement) */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity, scale }}
      >
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            type: 'tween',
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 153, 255, 0.12) 0%, transparent 70%)',
            transform: 'translate(-30%, -30%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            type: 'tween',
          }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.10) 0%, transparent 70%)',
            transform: 'translate(30%, 30%)',
          }}
        />
      </motion.div>

      {/* Grid Pattern (very subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <div 
              className="inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-6 py-3"
              style={{
                background: 'linear-gradient(to right, rgba(0, 153, 255, 0.15), rgba(139, 92, 246, 0.15))',
                border: '1px solid rgba(0, 153, 255, 0.25)',
                boxShadow: '0 4px 16px rgba(0, 153, 255, 0.15)',
              }}
            >
              <Icon name="sparkles" size={18} className="text-[#00D4FF]" />
              <span 
                className="text-sm font-semibold tracking-wide"
                style={{
                  background: 'linear-gradient(to right, #0099FF, #00D4FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Next-Gen AI Platform
              </span>
            </div>
          </motion.div>

          {/* Main Headline - Space Grotesk, asymmetric, tighter */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
            style={{ 
              fontFamily: 'var(--font-space-grotesk)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            <div className="text-left max-w-5xl mx-auto pl-4 sm:pl-8 md:pl-0 md:text-center">
              Your Intelligent
              <br />
              <span 
                style={{
                  background: 'linear-gradient(135deg, #0099FF 0%, #8B5CF6 50%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI Assistant
              </span>
            </div>
          </motion.h1>

          {/* Subtext - Better contrast */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-[1.65] font-normal"
            style={{ color: '#D1D1D6' }}
          >
            Transform your workflow with{' '}
            <span style={{ color: '#0099FF', fontWeight: 600 }}>cutting-edge AI</span>.
            Analyze data instantly, automate tasks, and unlock{' '}
            <span style={{ color: '#8B5CF6', fontWeight: 600 }}>powerful insights</span>{' '}
            that drive real results.
          </motion.p>

          {/* CTA Buttons - Magnetic primary */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Magnetic Primary CTA */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ x: magneticX, y: magneticY }}
              className="relative"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 40px rgba(0, 153, 255, 0.6)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  className="relative px-10 py-4 rounded-full text-white font-semibold text-lg overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #0099FF 0%, #8B5CF6 100%)',
                    boxShadow: '0 10px 30px rgba(0, 153, 255, 0.3)',
                  }}
                >
                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'linear-gradient(100deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <Link href="#demo">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#E5E5EA',
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #0099FF, #8B5CF6)',
                  }}
                >
                  <Icon name="play" size={18} className="text-white ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #0099FF, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                10M+
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Users
              </div>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #9B74FF, #2AD0FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                99.9%
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Uptime
              </div>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #2AD0FF, #5B8CFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                24/7
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Support
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            Scroll
          </span>
          <div 
            className="w-6 h-10 rounded-full flex items-start justify-center p-2"
            style={{ border: '2px solid rgba(156, 163, 175, 0.3)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#94A3B8' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

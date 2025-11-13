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
        background: '#000000ff',
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{
            opacity: 0.7,
            filter: 'brightness(0.75) contrast(1.2) saturate(1.1)',
          }}
        >
          <source src="https://framerusercontent.com/assets/JJOJjt6a4FXkQggD1CfcIrMTQBs.mp4" type="video/mp4" />
        </video>
        {/* Radial vignette for edge darkening */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(10, 14, 26, 0.4) 70%, rgba(10, 14, 26, 0.8) 100%)',
          }}
        />
        {/* Light center overlay for stable contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.3) 0%, rgba(10, 14, 26, 0.5) 100%)',
          }}
        />
      </div>

      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
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
              <Icon name="sparkles" size={18} className="text-[#60A5FA]" />
              <span 
                className="text-sm font-semibold tracking-wide"
                style={{
                  background: 'linear-gradient(to right, #3B82F6, #60A5FA)',
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #818CF8 50%, #60A5FA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI Assistant
              </span>
            </div>
          </motion.h1>

          {/* Subtext - Better contrast with content backdrop */}
          <motion.div
            variants={fadeInUp}
            className="relative max-w-prose mx-auto mb-12"
          >
            {/* Subtle backdrop for readability */}
            <div 
              className="absolute inset-0 -z-10 blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(10, 14, 26, 0.6) 0%, transparent 70%)',
              }}
            />
            <p
              className="text-lg sm:text-xl md:text-2xl leading-[1.65] font-normal"
              style={{ color: '#CBD5E1', maxWidth: '70ch' }}
            >
              Transform your workflow with{' '}
              <span style={{ color: '#60A5FA', fontWeight: 600 }}>cutting-edge AI</span>.
              Analyze data instantly, automate tasks, and unlock{' '}
              <span style={{ color: '#818CF8', fontWeight: 600 }}>powerful insights</span>{' '}
              that drive real results.
            </p>
          </motion.div>

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
                    scale: 1.02,
                    boxShadow: '0 0 50px rgba(59, 130, 246, 0.6), 0 20px 40px rgba(0, 0, 0, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="relative px-10 py-4 rounded-full text-white font-semibold text-lg overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                  }}
                >
                  {/* Sheen effect */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
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
                  scale: 1.02,
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                  color: '#F1F5F9',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.15)',
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
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
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -4,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="cursor-default"
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #3B82F6, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }}
              >
                10M+
              </motion.div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Users
              </div>
            </motion.div>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -4,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="cursor-default"
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #9B74FF, #2AD0FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{
                  textShadow: '0 0 20px rgba(155, 116, 255, 0.5)',
                }}
              >
                99.9%
              </motion.div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Uptime
              </div>
            </motion.div>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -4,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="cursor-default"
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #2AD0FF, #5B8CFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{
                  textShadow: '0 0 20px rgba(42, 208, 255, 0.5)',
                }}
              >
                24/7
              </motion.div>
              <div className="text-sm uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Support
              </div>
            </motion.div>
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

      {/* Smooth gradient transition to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
          zIndex: 5,
        }}
      />
    </section>
  );
};

export default Hero;

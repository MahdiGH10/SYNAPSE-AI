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
        background: '#000000',
      }}
    >
      {/* Central Glowing Orb - Framer style */}
      <motion.div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            type: 'tween',
          }}
          style={{
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.4) 0%, rgba(0, 82, 204, 0.2) 30%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
        />
        
        {/* Middle glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            type: 'tween',
            delay: 0.5,
          }}
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.6) 0%, rgba(0, 102, 255, 0.3) 50%, transparent 70%)',
            filter: 'blur(40px)',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
        />
        
        {/* Core orb */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            type: 'tween',
          }}
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #0066FF 0%, #0052CC 100%)',
            boxShadow: '0 0 100px rgba(0, 102, 255, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.2)',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(0, 102, 255, 0.1)',
            border: '1px solid rgba(0, 102, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#0066FF' }}
          />
          <span 
            className="text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #3B89FF 0%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powered by Advanced AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}
        >
          <span style={{ color: '#FFFFFF' }}>Design bold.</span>
          <br />
          <span 
            style={{
              background: 'linear-gradient(135deg, #3B89FF 0%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Launch fast.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
          style={{ 
            color: '#CCCCCC',
            lineHeight: '1.7',
          }}
        >
          Build stunning AI-powered applications with{' '}
          <span style={{ color: '#0066FF', fontWeight: 600 }}>SynapseAI</span>.
          <br />
          The fastest way to turn your ideas into reality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA with magnetic effect */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: magneticX, y: magneticY }}
          >
            <Link href="/get-started">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 60px rgba(0, 102, 255, 0.6)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="px-8 py-4 rounded-full font-semibold text-white text-lg"
                style={{
                  background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                  boxShadow: '0 10px 40px rgba(0, 102, 255, 0.4)',
                }}
              >
                Start for Free
              </motion.button>
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <Link href="#demo">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                borderColor: '#0066FF',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0, 102, 255, 0.2)', color: '#0066FF' }}
              >
                <Icon name="play" size={16} />
              </div>
              <span>Watch Demo</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="text-center"
            >
              <div 
                className="text-3xl md:text-4xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm font-medium"
                style={{ color: '#999999' }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              type: 'tween',
            }}
            className="w-6 h-10 rounded-full flex items-start justify-center p-2"
            style={{
              border: '2px solid rgba(0, 102, 255, 0.3)',
              background: 'rgba(0, 102, 255, 0.05)',
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#0066FF' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

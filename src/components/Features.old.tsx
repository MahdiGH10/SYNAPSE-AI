'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { features } from '@/lib/data';
import FeatureCard from './FeatureCard';
import { fadeInUp } from '@/lib/animation';

const Features: React.FC = () => {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Hairline gradient divider at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ 
          background: 'linear-gradient(90deg, transparent 0%, rgba(91, 140, 255, 0.15) 20%, rgba(155, 116, 255, 0.15) 50%, rgba(42, 208, 255, 0.15) 80%, transparent 100%)',
        }}
      />
      
      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #FAFBFC 0%, #FFFFFF 50%, #FAFBFC 100%)' }}
      />
      
      {/* Very subtle animated orbs (reduced opacity) */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          type: 'tween',
        }}
        className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(91, 140, 255, 0.03) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          type: 'tween',
        }}
        className="absolute bottom-20 left-10 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(155, 116, 255, 0.03) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-6"
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <span
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                background: 'linear-gradient(to right, rgba(91, 140, 255, 0.12), rgba(155, 116, 255, 0.12))',
                border: '1px solid rgba(91, 140, 255, 0.2)',
                color: '#5B8CFF',
              }}
            >
              Features
            </span>
          </motion.div>

          {/* Product principle subhead */}
          <motion.p
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: '#94A3B8', letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Built for fast-moving teams
          </motion.p>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{ 
              color: '#0F172A',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Powerful Features for
            <br />
            <motion.span
              className="bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(100deg, #5B8CFF 0%, #9B74FF 55%, #2AD0FF 100%)',
                backgroundSize: '200% auto',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              Modern Teams
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: '#4B5563', lineHeight: '1.7' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Everything you need to boost productivity and make data-driven decisions with confidence. Built for the future, available today.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section with hairline divider */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 pt-16 relative"
        >
          {/* Hairline divider */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px"
            style={{ 
              background: 'linear-gradient(90deg, transparent 0%, rgba(91, 140, 255, 0.2) 50%, transparent 100%)',
            }}
          />

          <p className="text-lg mb-6" style={{ color: '#4B5563' }}>
            Ready to transform your workflow?
          </p>
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(91, 140, 255, 0.5)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-lg"
              style={{
                background: 'linear-gradient(100deg, #5B8CFF, #9B74FF)',
                boxShadow: '0 10px 25px rgba(91, 140, 255, 0.3)',
              }}
            >
              Start Your Free Trial
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom hairline divider */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ 
          background: 'linear-gradient(90deg, transparent 0%, rgba(91, 140, 255, 0.15) 20%, rgba(155, 116, 255, 0.15) 50%, rgba(42, 208, 255, 0.15) 80%, transparent 100%)',
        }}
      />
    </motion.section>
  );
};

export default Features;

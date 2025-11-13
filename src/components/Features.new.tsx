'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { features } from '@/lib/data';
import Icon from './Icon';

const FeatureSection: React.FC<{ feature: typeof features[0]; index: number }> = ({ feature, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const isEven = index % 2 === 0;
  
  // Smooth animations based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    isEven ? [-100, 0, 0, -100] : [100, 0, 0, 100]
  );
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-7xl w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Content */}
          <motion.div
            style={{ x: isEven ? x : useTransform(x, v => -v) }}
            className={`space-y-6 ${isEven ? 'lg:pr-8' : 'lg:pl-8 lg:order-2'}`}
          >
            {/* Icon Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
              }}
            >
              <div style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={feature.icon} size={32} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              style={{
                color: '#F4F4F5',
                fontFamily: 'var(--font-space-grotesk)',
                letterSpacing: '-0.02em',
              }}
            >
              {feature.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: '#A1A1AA' }}
            >
              {feature.detailedDescription}
            </motion.p>

            {/* Benefits */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, staggerChildren: 0.1 }}
              className="space-y-3"
            >
              {feature.benefits.map((benefit, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span style={{ color: '#D4D4D8' }}>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="px-8 py-4 rounded-full font-semibold text-white inline-flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
                }}
              >
                <span>Learn More</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            style={{ x: isEven ? useTransform(x, v => -v) : x }}
            className={`relative ${isEven ? 'lg:pl-8' : 'lg:pr-8 lg:order-1'}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(59, 130, 246, 0.3) inset',
              }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
                }}
              />
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: '#3B82F6' }}>
                  Feature {String(index + 1).padStart(2, '0')}
                </span>
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)',
                zIndex: -1,
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)',
                zIndex: -1,
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0D0D12 50%, #000000 100%)' }}
    >
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
            }}
          >
            Features
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              color: '#F4F4F5',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.02em',
            }}
          >
            Everything You Need to
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              }}
            >
              Scale Your Workflow
            </span>
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: '#A1A1AA' }}>
            Discover powerful features designed to transform how you work
          </p>
        </motion.div>
      </div>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <FeatureSection key={feature.id} feature={feature} index={index} />
      ))}

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#F4F4F5' }}>
            Ready to get started?
          </h3>
          <p className="text-lg mb-8" style={{ color: '#A1A1AA' }}>
            Join thousands of teams already using SynapseAI
          </p>
          <motion.a
            href="/register"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="inline-block px-10 py-5 rounded-full font-semibold text-white text-lg"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
            }}
          >
            Start Free Trial
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

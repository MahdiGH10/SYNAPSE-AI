'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { features, Feature } from '@/lib/data';
import Icon from './Icon';

const FeatureSection: React.FC<{ feature: Feature; index: number; onInView: (index: number) => void }> = ({ feature, index, onInView }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const isEven = index % 2 === 0;
  
  // Track active section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.3 && latest < 0.7) {
        onInView(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, index, onInView]);
  
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
              <Icon name={feature.icon} size={32} className="text-[#3B82F6]" />
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              style={{
                color: '#F1F5F9',
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
              style={{ color: '#CBD5E1' }}
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
              {feature.benefits.map((benefit: string, idx: number) => (
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
                      background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
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
                  scale: 1.02,
                  boxShadow: '0 0 50px rgba(59, 130, 246, 0.6), 0 20px 40px rgba(0, 0, 0, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative px-8 py-4 rounded-full font-semibold text-white inline-flex items-center space-x-2 overflow-hidden group"
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
                <span className="relative">Learn More</span>
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
              whileHover={{ 
                scale: 1.02,
                rotateY: isEven ? -5 : 5,
                rotateX: 2,
              }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 2px rgba(59, 130, 246, 0.4) inset',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
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

            {/* Simplified decorative glow - single subtle orb */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1], // Unified easing curve
              }}
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
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
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section
      id="features"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0f172a 30%, #0f172a 70%, #000000 100%)' }}
    >
      {/* Progress Indicator - Right Side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {features.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              const element = document.getElementById(`feature-${index}`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="group relative w-3 h-3 rounded-full cursor-pointer transition-all"
            whileHover={{ scale: 1.3 }}
            style={{
              background: activeFeature === index 
                ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' 
                : 'rgba(59, 130, 246, 0.2)',
              boxShadow: activeFeature === index 
                ? '0 0 15px rgba(59, 130, 246, 0.6)' 
                : 'none',
            }}
          >
            {/* Tooltip */}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#F1F5F9',
                backdropFilter: 'blur(10px)',
              }}
            >
              {features[index].title}
            </span>
          </motion.button>
        ))}
      </div>

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
              color: '#F1F5F9',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.02em',
            }}
          >
            Everything You Need to
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
              }}
            >
              Accelerate Your Learning
            </span>
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: '#CBD5E1' }}>
            Discover powerful features designed to enhance your learning experience
          </p>
        </motion.div>
      </div>

      {/* Feature Sections */}
      {features.map((feature: Feature, index: number) => (
        <div key={feature.id} id={`feature-${index}`}>
          <FeatureSection 
            feature={feature} 
            index={index}
            onInView={setActiveFeature}
          />
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#F1F5F9' }}>
            Ready to start learning?
          </h3>
          <p className="text-lg mb-8" style={{ color: '#CBD5E1' }}>
            Join thousands of learners already using SynapseAI
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
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
            }}
          >
            Get Started Free
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

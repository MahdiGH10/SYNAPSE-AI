'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    avatar: '👩‍💼',
    content: 'SynapseAI has transformed how our team works. The AI insights are incredibly accurate, and the interface is intuitive. We\'ve increased productivity by 40%!',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Data Scientist',
    company: 'DataFlow Inc',
    avatar: '👨‍💻',
    content: 'The best AI assistant I\'ve used. It understands complex queries and provides detailed, contextual answers. The GPT-4 integration is seamless.',
    rating: 5,
  },
  {
    name: 'Emily Thompson',
    role: 'Startup Founder',
    company: 'InnovateLab',
    avatar: '👩‍🚀',
    content: 'As a small startup, we needed an AI solution that scales with us. SynapseAI is perfect - affordable, powerful, and incredibly reliable.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Engineering Lead',
    company: 'CloudSystems',
    avatar: '👨‍🔧',
    content: 'The custom integrations and API access have been game-changing for our workflow. Support team is also incredibly responsive and helpful.',
    rating: 5,
  },
  {
    name: 'Lisa Anderson',
    role: 'Content Creator',
    company: 'CreativeHub',
    avatar: '👩‍🎨',
    content: 'I use SynapseAI daily for content research and ideation. It\'s like having a brilliant research assistant available 24/7. Absolutely love it!',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <Icon name="star" size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Loved by <span style={{
              background: 'linear-gradient(to right, #8B5CF6, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Thousands</span>
          </h2>
          <p className="text-xl" style={{ color: '#94A3B8' }}>
            See what our customers have to say about SynapseAI
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="px-4"
              >
                <div
                  className="max-w-4xl mx-auto p-8 md:p-12 rounded-2xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                      >
                        <Icon name="star" size={24} className="text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-xl md:text-2xl leading-relaxed text-center mb-8"
                    style={{ color: '#E2E8F0' }}
                  >
                    "{testimonials[currentIndex].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                      }}
                    >
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-lg" style={{ color: '#F1F5F9' }}>
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm" style={{ color: '#94A3B8' }}>
                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className="rounded-full transition-all"
                style={{
                  width: currentIndex === index ? '32px' : '12px',
                  height: '12px',
                  background: currentIndex === index
                    ? 'linear-gradient(to right, #8B5CF6, #3B82F6)'
                    : 'rgba(71, 85, 105, 0.5)',
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <motion.button
            onClick={() => goToTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="chevron-left" size={24} style={{ color: '#60A5FA' }} />
          </motion.button>

          <motion.button
            onClick={() => goToTestimonial((currentIndex + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="chevron-right" size={24} style={{ color: '#60A5FA' }} />
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '10k+', label: 'Happy Users' },
            { value: '50k+', label: 'Reviews' },
            { value: '99%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#94A3B8' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

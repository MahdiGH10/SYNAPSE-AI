'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds and get instant access to AI-powered learning and collaboration tools',
    icon: 'user-plus',
  },
  {
    number: '02',
    title: 'Learn & Collaborate',
    description: 'Access intelligent chat, personalized exercises, and collaborative workspace features',
    icon: 'brain',
  },
  {
    number: '03',
    title: 'Track Your Progress',
    description: 'Monitor your learning journey with smart analytics and personalized recommendations',
    icon: 'trending-up',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section 
      className="relative py-32 overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #0f172a 50%, #000000 100%)',
      }}
    >
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
            }}
          >
            How It Works
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto"
            style={{ color: '#F1F5F9' }}
          >
            Start Learning in{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
              }}
            >
              Three Simple Steps
            </span>
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#CBD5E1' }}>
            Begin your intelligent learning journey in minutes
          </p>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="relative p-8 rounded-2xl h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent)',
                      zIndex: -1,
                    }}
                  />

                  {/* Step Number Badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      <Icon name={step.icon} size={28} className="text-white" />
                    </div>
                    <span
                      className="text-5xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: '#F1F5F9' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: '#94A3B8' }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                  className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none"
                  style={{
                    left: `calc(${((index + 1) * 100) / 3}% - 24px)`,
                    zIndex: 20,
                  }}
                >
                  <motion.div
                    animate={{
                      x: [0, 8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Glow */}
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="url(#arrowGlow)"
                        opacity="0.3"
                      />
                      {/* Arrow */}
                      <path
                        d="M20 16L28 24L20 32"
                        stroke="url(#arrowGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="arrowGradient"
                          x1="20"
                          y1="16"
                          x2="28"
                          y2="32"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#60A5FA" />
                        </linearGradient>
                        <radialGradient
                          id="arrowGlow"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(24 24) scale(20)"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-64 blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3B82F6, transparent)',
        }}
      />
    </section>
  );
};

export default HowItWorks;

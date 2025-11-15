'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const messages = [
  {
    id: 1,
    type: 'user' as const,
    content: 'What are the latest trends in AI?',
  },
  {
    id: 2,
    type: 'ai' as const,
    content: 'The latest AI trends include multimodal models, AI agents, edge AI deployment, and responsible AI practices. These technologies are transforming industries...',
  },
  {
    id: 3,
    type: 'user' as const,
    content: 'Can you analyze this dataset for me?',
  },
  {
    id: 4,
    type: 'ai' as const,
    content: "I'd be happy to help analyze your dataset! I can identify patterns, generate visualizations, and provide actionable insights. Please upload your data.",
  },
];

const DemoPreview: React.FC = () => {
  const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < messages.length) {
        setIsTyping(true);
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, messages[currentIndex]]);
          setIsTyping(false);
          currentIndex++;
        }, 800);
      } else {
        // Reset after showing all messages
        setTimeout(() => {
          setVisibleMessages([]);
          currentIndex = 0;
        }, 3000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="relative py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Icon name="zap" size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Live Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            See <span style={{
              background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>SynapseAI</span> in Action
          </h2>
          <p className="text-xl" style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            Watch how our AI assistant responds in real-time with intelligent, context-aware answers
          </p>
        </motion.div>

        {/* Demo Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-2xl overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1)',
            }}
          >
            {/* Chat Header */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderColor: 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  }}
                >
                  <Icon name="bot" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#F1F5F9' }}>SynapseAI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 h-96 overflow-y-auto space-y-4">
              <AnimatePresence mode="popLayout">
                {visibleMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'rounded-br-sm'
                          : 'rounded-bl-sm'
                      }`}
                      style={{
                        background:
                          message.type === 'user'
                            ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                            : 'rgba(30, 41, 59, 0.8)',
                        border:
                          message.type === 'ai'
                            ? '1px solid rgba(59, 130, 246, 0.2)'
                            : 'none',
                      }}
                    >
                      <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm"
                      style={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#60A5FA' }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            <div
              className="px-6 py-4 border-t"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderColor: 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Icon name="message-circle" size={20} style={{ color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Type your message..."
                  disabled
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: '#64748B' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  }}
                  disabled
                >
                  <Icon name="send" size={16} className="text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature highlights below demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          {[
            { icon: 'zap', title: 'Lightning Fast', desc: 'Instant responses powered by GPT-4' },
            { icon: 'shield-check', title: 'Secure & Private', desc: 'End-to-end encryption' },
            { icon: 'brain', title: 'Context Aware', desc: 'Remembers conversation history' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl backdrop-blur-sm text-center"
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                }}
              >
                <Icon name={feature.icon as any} size={24} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#F1F5F9' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: '#94A3B8' }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DemoPreview;

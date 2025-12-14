'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const faqs = [
  {
    question: 'What is SynapseAI?',
    answer: 'SynapseAI is an intelligent learning platform that combines AI-powered chat, personalized exercises, collaborative workspaces, and smart analytics to enhance your learning experience.',
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted end-to-end using industry-standard protocols. Your conversations, exercises, and personal information are stored securely in MongoDB Atlas with strict access controls.',
  },
  {
    question: 'Is SynapseAI free to use?',
    answer: 'Yes! SynapseAI is currently free for all users. Create an account and get instant access to intelligent chat, personalized exercises, document workspaces, and more.',
  },
  {
    question: 'What features does SynapseAI offer?',
    answer: 'SynapseAI offers AI-powered chat with context awareness, personalized learning exercises, collaborative document workspaces, smart recommendations, progress tracking, and an integrated bug reporting system.',
  },
  {
    question: 'How does the exercise system work?',
    answer: 'Our AI analyzes your learning patterns and generates personalized exercises tailored to your skill level. You can track your progress, get instant feedback, and improve your understanding of various topics.',
  },
  {
    question: 'Can I use SynapseAI on mobile devices?',
    answer: 'Yes! SynapseAI is fully responsive and works seamlessly across all devices including smartphones, tablets, and desktop computers. Your progress syncs automatically across all devices.',
  },
  {
    question: 'What makes SynapseAI different?',
    answer: 'SynapseAI combines multiple learning tools in one platform - intelligent chat, personalized exercises, collaborative workspaces, and analytics. Our AI adapts to your learning style and provides contextual recommendations.',
  },
  {
    question: 'How can I report bugs or request features?',
    answer: 'Use our integrated ticket system to report bugs or request features. Navigate to your dashboard and click on the support icon. Our team reviews all tickets and responds promptly.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #0f172a 50%, #000000 100%)' }}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}
          >
            <Icon name="help-circle" size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Frequently Asked <span style={{
              background: 'linear-gradient(to right, #06B6D4, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Questions</span>
          </h2>
          <p className="text-xl" style={{ color: '#94A3B8' }}>
            Everything you need to know about SynapseAI
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 rounded-xl backdrop-blur-xl"
                style={{
                  background: openIndex === index
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))',
                  border: openIndex === index
                    ? '2px solid rgba(6, 182, 212, 0.5)'
                    : '2px solid rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.3s ease',
                  boxShadow: openIndex === index ? '0 8px 32px rgba(6, 182, 212, 0.2)' : 'none',
                }}
                whileHover={{
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <Icon
                      name="chevron-down"
                      size={24}
                      style={{ color: openIndex === index ? '#22D3EE' : '#64748B' }}
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-base leading-relaxed" style={{ color: '#94A3B8' }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center p-8 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
          }}
        >
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#F1F5F9' }}>
            Still have questions?
          </h3>
          <p className="mb-6" style={{ color: '#94A3B8' }}>
            Can't find the answer you're looking for? We're here to help.
          </p>
          <motion.a
            href="mailto:support@synapseai.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            style={{
              background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
              color: '#FFFFFF',
            }}
          >
            <Icon name="mail" size={20} />
            Get in Touch
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

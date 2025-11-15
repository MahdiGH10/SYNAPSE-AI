'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const faqs = [
  {
    question: 'What AI models does SynapseAI use?',
    answer: 'We use state-of-the-art models including GPT-4, Claude 3, and other cutting-edge AI technologies. Our platform provides access to multiple models for different use cases.',
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted end-to-end, and we never train our models on your private conversations. Your privacy and data security are our top priorities.',
  },
  {
    question: 'Is SynapseAI free to use?',
    answer: 'Yes! SynapseAI is a university project designed to showcase advanced AI capabilities. You can create an account and start using all features right away.',
  },
  {
    question: 'What can I do with SynapseAI?',
    answer: 'You can have intelligent conversations, get help with research, analyze data, brainstorm ideas, and much more. Our AI assistant is designed to help with a wide range of tasks.',
  },
  {
    question: 'How does the chat interface work?',
    answer: 'Simply type your question or request in the chat interface, and our AI will provide detailed, context-aware responses. The conversation history is saved so the AI can maintain context throughout your session.',
  },
  {
    question: 'Can I use SynapseAI on mobile devices?',
    answer: 'Yes! SynapseAI is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.',
  },
  {
    question: 'What makes SynapseAI different?',
    answer: 'SynapseAI combines cutting-edge AI technology with an intuitive, modern interface. It\'s designed to be fast, reliable, and easy to use while providing powerful AI capabilities.',
  },
  {
    question: 'How can I provide feedback?',
    answer: 'We love hearing from our users! You can reach out to us via email or through the contact form. Your feedback helps us improve SynapseAI.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: openIndex === index
                    ? '1px solid rgba(6, 182, 212, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.3s ease',
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
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
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

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../Icon';
import { useToast } from '../ui/Toast';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const { showToast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 rounded-3xl backdrop-blur-xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 80px rgba(59, 130, 246, 0.3)',
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
            }}
          >
            <Icon name="mail" size={32} className="text-white" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Stay Updated with <span style={{
              background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI Insights</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: '#CBD5E1' }}
          >
            Join 50,000+ professionals getting weekly tips, product updates, and exclusive AI strategies delivered to your inbox.
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="mail" size={20} style={{ color: '#64748B' }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none transition-all"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: errors.email
                        ? '2px solid #EF4444'
                        : '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#F1F5F9',
                      boxShadow: errors.email
                        ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                        : 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.border = '1px solid rgba(59, 130, 246, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 text-left mt-2 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Icon name="loader" size={20} />
                    </motion.div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Icon name="arrow-right" size={20} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm"
            style={{ color: '#94A3B8' }}
          >
            <div className="flex items-center gap-2">
              <Icon name="check-circle" size={18} className="text-green-400" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="shield-check" size={18} className="text-blue-400" />
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="users" size={18} className="text-purple-400" />
              <span>50k+ subscribers</span>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-8 border-t"
            style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}
          >
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
                <span
                  key={company}
                  className="text-lg font-semibold"
                  style={{ color: '#94A3B8' }}
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;

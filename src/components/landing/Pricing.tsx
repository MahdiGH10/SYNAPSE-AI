'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Icon from '../Icon';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying out SynapseAI',
    features: [
      { text: '100 messages per month', included: true },
      { text: 'Basic AI models', included: true },
      { text: '24-hour response time', included: true },
      { text: 'Community support', included: true },
      { text: 'Advanced models', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 29, yearly: 290 },
    description: 'For professionals and growing teams',
    features: [
      { text: 'Unlimited messages', included: true },
      { text: 'All AI models (GPT-4, Claude)', included: true },
      { text: '1-hour response time', included: true },
      { text: 'Priority email support', included: true },
      { text: 'File uploads & analysis', included: true },
      { text: 'Advanced search', included: true },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    description: 'For large teams with advanced needs',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom AI model training', included: true },
      { text: '24/7 phone support', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="relative py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
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
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <Icon name="credit-card" size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Simple, <span style={{
              background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Transparent</span> Pricing
          </h2>
          <p className="text-xl mb-8" style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            Choose the perfect plan for your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className="text-sm font-medium"
              style={{ color: billingCycle === 'monthly' ? '#F1F5F9' : '#64748B' }}
            >
              Monthly
            </span>
            <motion.button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 rounded-full"
              style={{
                background: billingCycle === 'yearly'
                  ? 'linear-gradient(to right, #8B5CF6, #3B82F6)'
                  : 'rgba(71, 85, 105, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                animate={{
                  x: billingCycle === 'yearly' ? 28 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: billingCycle === 'yearly' ? '#F1F5F9' : '#64748B' }}
              >
                Yearly
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{
                  background: 'linear-gradient(to right, #10B981, #059669)',
                  color: '#FFFFFF',
                }}
              >
                Save 17%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: plan.popular ? 1.02 : 1 }}
              className={`relative rounded-2xl p-8 backdrop-blur-xl ${
                plan.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}
              style={{
                background: plan.popular
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
                  : 'rgba(15, 23, 42, 0.6)',
                border: plan.popular
                  ? '2px solid rgba(139, 92, 246, 0.5)'
                  : '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: plan.popular
                  ? '0 20px 60px rgba(139, 92, 246, 0.3)'
                  : '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
                    color: '#FFFFFF',
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold" style={{ color: '#FFFFFF' }}>
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-lg" style={{ color: '#64748B' }}>
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </div>

              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold mb-8"
                  style={{
                    background: plan.popular
                      ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                      : 'rgba(59, 130, 246, 0.2)',
                    color: '#FFFFFF',
                    border: plan.popular ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  {plan.cta}
                </motion.button>
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feature.included ? '' : 'opacity-30'
                      }`}
                      style={{
                        background: feature.included
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : 'rgba(71, 85, 105, 0.5)',
                      }}
                    >
                      <Icon
                        name={feature.included ? 'check' : 'x'}
                        size={12}
                        className="text-white"
                      />
                    </div>
                    <span
                      className={`text-sm ${feature.included ? '' : 'opacity-50'}`}
                      style={{ color: '#CBD5E1' }}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p style={{ color: '#94A3B8' }}>
            Have questions?{' '}
            <a
              href="#faq"
              className="font-semibold hover:underline"
              style={{ color: '#60A5FA' }}
            >
              Check our FAQ
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

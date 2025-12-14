'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { socialLinks } from '@/lib/data';
import Icon from './Icon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const footerSections = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Integrations', href: '/integrations' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Guides', href: '/guides' },
      { name: 'Support', href: '/support' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'Cookies', href: '/cookies' },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer
      className="text-white relative overflow-hidden py-16"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0f172a 50%, #000000 100%)',
      }}
    >
      {/* Gradient blend at top to avoid separation */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand + Newsletter - spans 2 columns */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Icon name="sparkles" size={18} className="text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: '#F1F5F9' }}
              >
                SynapseAI
              </span>
            </Link>
            <p className="text-sm mb-6 max-w-xs" style={{ color: '#94A3B8', lineHeight: '1.6' }}>
              Intelligent learning platform powered by cutting-edge AI technology.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all focus:border-[#3B82F6]"
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#F1F5F9',
                }}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  color: '#FFFFFF',
                }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
              Product
            </h3>
            <ul className="space-y-2">
              {footerSections.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#94A3B8' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
              Company
            </h3>
            <ul className="space-y-2">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#94A3B8' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
              Resources
            </h3>
            <ul className="space-y-2">
              {footerSections.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#94A3B8' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
              Legal
            </h3>
            <ul className="space-y-2">
              {footerSections.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#94A3B8' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            borderTop: '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          <p className="text-sm" style={{ color: '#64748B' }}>
            © {currentYear} SynapseAI. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#94A3B8',
                }}
                aria-label={social.name}
              >
                <Icon name={social.icon} size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

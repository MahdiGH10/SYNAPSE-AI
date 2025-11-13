'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { socialLinks, navLinks } from '@/lib/data';
import Icon from './Icon';
import { fadeInUp } from '@/lib/animation';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0A0E27, #000000)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Background decoration */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div 
                className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Icon name="sparkles" size={24} className="text-white" />
              </div>
              <span 
                className="text-2xl font-black font-display bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(to right, #FFFFFF, #D1D5DB)' }}
              >
                SynapseAI
              </span>
            </Link>
            <p className="leading-relaxed text-base" style={{ color: '#D1D5DB' }}>
              Empowering teams with intelligent AI solutions for smarter
              workflows and better decisions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <h3 
              className="text-xl font-bold mb-6 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #60A5FA, #A78BFA)' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className="transition-colors inline-flex items-center gap-2 group"
                    style={{ color: '#D1D5DB' }}
                  >
                    <motion.span
                      className="h-0.5"
                      style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
                      initial={{ width: 0 }}
                      whileHover={{ width: '1rem' }}
                      transition={{ duration: 0.3 }}
                    />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h3 
              className="text-xl font-bold mb-6 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #A78BFA, #22D3EE)' }}
            >
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors inline-flex items-center gap-2 group"
                  style={{ color: '#D1D5DB' }}
                >
                  <span 
                    className="w-0 h-0.5 group-hover:w-4 transition-all duration-300"
                    style={{ background: 'linear-gradient(to right, #8B5CF6, #06B6D4)' }}
                  />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors inline-flex items-center gap-2 group"
                  style={{ color: '#D1D5DB' }}
                >
                  <span 
                    className="w-0 h-0.5 group-hover:w-4 transition-all duration-300"
                    style={{ background: 'linear-gradient(to right, #8B5CF6, #06B6D4)' }}
                  />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="transition-colors inline-flex items-center gap-2 group"
                  style={{ color: '#D1D5DB' }}
                >
                  <span 
                    className="w-0 h-0.5 group-hover:w-4 transition-all duration-300"
                    style={{ background: 'linear-gradient(to right, #8B5CF6, #06B6D4)' }}
                  />
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ color: '#D1D5DB' }}
            >
              © {currentYear} SynapseAI. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex items-center space-x-6"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#D1D5DB',
                  }}
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { navLinks } from '@/lib/data';
import Icon from './Icon';
import { fadeIn, tapScale } from '@/lib/animation';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Smooth background opacity based on scroll
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 14, 39, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with hover shimmer */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            aria-label="SynapseAI Home"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Icon name="sparkles" size={24} className="text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-75"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0)',
                    '0 0 40px rgba(139, 92, 246, 0.6)',
                    '0 0 20px rgba(59, 130, 246, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span
              className="text-2xl md:text-3xl font-black font-display bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #FFFFFF, #D1D5DB)' }}
            >
              SynapseAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="relative py-2 font-medium group"
                  style={{ color: '#E5E7EB' }}
                >
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5"
                    style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="px-5 py-2.5 font-medium transition-colors"
                style={{ color: '#E5E7EB' }}
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              <Link
                href="/register"
                className="relative px-6 py-3 rounded-full font-bold overflow-hidden"
                style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
              >
                <span className="relative z-10" style={{ color: '#FFFFFF' }}>
                  Get Started
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-primary"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="md:hidden backdrop-blur-lg overflow-hidden"
            style={{
              backgroundColor: 'rgba(10, 14, 39, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="px-4 py-6 space-y-4"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 transition-colors"
                    style={{ color: '#D1D5DB' }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 space-y-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-2 transition-colors"
                  style={{ color: '#D1D5DB' }}
                >
                  Login
                </Link>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-6 py-3 rounded-full font-medium transition-all"
                    style={{
                      background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                      color: '#FFFFFF',
                    }}
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { navLinks } from '@/lib/data';
import Icon from './Icon';
import { fadeIn } from '@/lib/animation';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  // Smooth background opacity and blur based on scroll
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const blurAmount = useTransform(scrollY, [0, 100], [0, 40]);

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
        backgroundColor: isScrolled ? 'rgba(10, 14, 26, 0.7)' : 'transparent',
        backdropFilter: useTransform(blurAmount, (v) => `blur(${v}px)`),
        WebkitBackdropFilter: useTransform(blurAmount, (v) => `blur(${v}px)`),
        borderBottom: isScrolled ? '1px solid rgba(59, 130, 246, 0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            aria-label="SynapseAI Home"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="w-12 h-12 flex items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="SynapseAI Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span
                className="text-2xl md:text-2xl font-black leading-none"
                style={{ 
                  fontFamily: 'var(--font-space-grotesk)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                SynapseAI
              </span>
              <span
                className="text-[10px] font-semibold tracking-wider"
                style={{
                  background: 'linear-gradient(90deg, #60A5FA, #A78BFA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginTop: '-2px',
                }}
              >
                NEURAL INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with active indicator */}
          <div className="hidden md:flex items-center space-x-1 relative">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.name;
              
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 font-medium transition-colors"
                    style={{ 
                      color: isActive ? '#3B82F6' : '#D6D9E0',
                    }}
                  >
                    {link.name}
                    {/* Active/Hover gradient bar */}
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background: 'linear-gradient(100deg, #3B82F6, #60A5FA, #2AD0FF)',
                        }}
                        initial={false}
                        transition={{
                          type: 'spring',
                          damping: 22,
                          stiffness: 220,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="px-5 py-2.5 font-medium transition-colors"
                style={{ color: '#D6D9E0' }}
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-full font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                }}
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#E6E9EF',
            }}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: 'rgba(11, 16, 32, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(91, 140, 255, 0.1)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="px-4 py-6 space-y-4"
            >
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg font-medium"
                      style={{
                        color: isActive ? '#3B82F6' : '#D6D9E0',
                        backgroundColor: isActive ? 'rgba(91, 140, 255, 0.1)' : 'transparent',
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 space-y-3"
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-center rounded-lg font-medium"
                  style={{
                    color: '#D6D9E0',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-center rounded-full font-semibold text-white"
                  style={{
                    background: 'linear-gradient(100deg, #3B82F6, #60A5FA)',
                    boxShadow: '0 4px 12px rgba(91, 140, 255, 0.3)',
                  }}
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

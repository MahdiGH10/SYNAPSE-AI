'use client';

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Icon from './Icon';
import { fadeInUp } from '@/lib/animation';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

const gradients = [
  { from: '#3B82F6', to: '#60A5FA' },
  { from: '#8B5CF6', to: '#A78BFA' },
  { from: '#06B6D4', to: '#22D3EE' },
  { from: '#2563EB', to: '#7C3AED' },
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  index,
}) => {
  const gradient = gradients[index % gradients.length];
  
  // Mouse tracking for subtle tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -12, transition: { type: 'spring', damping: 15, stiffness: 150 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #F3F4F6',
      }}
      className="group relative rounded-3xl p-8 overflow-hidden cursor-pointer"
    >
      {/* Gradient overlay on hover with smooth transition */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.08 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      
      {/* Top gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }}
        initial={{ scaleX: 1 }}
        whileHover={{ scaleX: 1.02 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon with gradient background and float effect */}
      <motion.div
        whileHover={{
          scale: 1.1,
          y: -4,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
        style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Icon name={icon} size={32} className="text-white" />
        
        {/* Animated glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Content with fade-in */}
      <motion.h3
        className="text-2xl font-bold mb-4"
        style={{ color: '#111827' }}
        initial={{ y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {title}
      </motion.h3>
      <p className="leading-relaxed text-base" style={{ color: '#4B5563' }}>
        {description}
      </p>

      {/* Learn More Link with elegant slide */}
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 0, x: 0 }}
        whileHover={{ opacity: 1, x: 4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-6 flex items-center gap-2 text-sm font-semibold"
      >
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }}
        >
          Learn More
        </span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: gradient.from }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>

      {/* Decorative elements */}
      <div 
        className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
        style={{ background: `linear-gradient(135deg, ${gradient.from}0D, ${gradient.to}0D)` }}
      />
    </motion.div>
  );
};

export default FeatureCard;

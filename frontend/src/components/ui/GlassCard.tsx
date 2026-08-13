'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'emerald' | 'purple' | 'blue' | 'amber' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glowColor = 'none',
}) => {
  const glowClasses = {
    emerald: 'border-emerald-500/40 shadow-emerald-500/10 shadow-lg',
    purple: 'border-purple-500/40 shadow-purple-500/10 shadow-lg',
    blue: 'border-blue-500/40 shadow-blue-500/10 shadow-lg',
    amber: 'border-amber-500/40 shadow-amber-500/10 shadow-lg',
    none: '',
  }[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`joblist-card p-6 relative overflow-hidden ${
        hoverEffect ? 'joblist-card-hover' : ''
      } ${glowClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

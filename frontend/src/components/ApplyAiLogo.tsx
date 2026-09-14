'use client';

import React from 'react';

interface ApplyAiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  textClassName?: string;
  className?: string;
}

export const ApplyAiLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="applyAiGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="applyAiSparkGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e0e7ff" />
      </linearGradient>
      <filter id="applyAiGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Abstract AI-powered 'A' symbol with central star spark */}
    <path
      d="M16 4.5L7.5 24.5C7.1 25.4 7.8 26.5 8.8 26.5H11.5C12.2 26.5 12.8 26.1 13.1 25.5L16 19.5L18.9 25.5C19.2 26.1 19.8 26.5 20.5 26.5H23.2C24.2 26.5 24.9 25.4 24.5 24.5L16 4.5Z"
      fill="url(#applyAiSparkGrad)"
      filter="url(#applyAiGlow)"
    />
    
    {/* Interlocking AI bridge & target pulse */}
    <path
      d="M11.8 17.5H20.2C20.9 17.5 21.4 16.8 21.1 16.2L16.9 7.8C16.5 7.0 15.5 7.0 15.1 7.8L10.9 16.2C10.6 16.8 11.1 17.5 11.8 17.5Z"
      fill="#6366f1"
      opacity="0.35"
    />

    {/* Center AI Node Spark */}
    <path
      d="M16 11L17.1 13.9L20 15L17.1 16.1L16 19L14.9 16.1L12 15L14.9 13.9L16 11Z"
      fill="#ffffff"
    />
  </svg>
);

export const ApplyAiLogo: React.FC<ApplyAiLogoProps> = ({
  size = 'md',
  withText = false,
  textClassName = 'text-white',
  className = '',
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6 rounded-md', icon: 'w-4 h-4', text: 'text-sm' },
    sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4.5 h-4.5', text: 'text-base' },
    md: { box: 'w-8 h-8 rounded-xl', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { box: 'w-10 h-10 rounded-xl', icon: 'w-6 h-6', text: 'text-xl' },
    xl: { box: 'w-12 h-12 rounded-2xl', icon: 'w-7.5 h-7.5', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div
        className={`${currentSize.box} bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-purple-600/25 shrink-0 hover:scale-105 transition-transform duration-200`}
      >
        <ApplyAiLogoIcon className={currentSize.icon} />
      </div>

      {withText && (
        <span className={`font-bold tracking-tight ${currentSize.text} ${textClassName} flex items-center`}>
          ApplyAI
          <span className="relative -top-1 ml-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        </span>
      )}
    </div>
  );
};

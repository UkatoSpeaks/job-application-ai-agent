'use client';

import React from 'react';

interface ApplyAiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  textClassName?: string;
  className?: string;
}

export const ApplyAiLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M16 4L20.5 13H27L21 18.5L23.5 27L16 21.5L8.5 27L11 18.5L5 13H11.5L16 4Z"
      fill="var(--color-lime-400, #D7FF3E)"
      stroke="#0B0B0F"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
);

export const ApplyAiLogo: React.FC<ApplyAiLogoProps> = ({
  size = 'md',
  withText = false,
  textClassName = '',
  className = '',
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6 rounded-md border-2', icon: 'w-4 h-4', text: 'text-sm' },
    sm: { box: 'w-7 h-7 rounded-md border-2', icon: 'w-4.5 h-4.5', text: 'text-base' },
    md: { box: 'w-9 h-9 rounded-lg border-2', icon: 'w-5.5 h-5.5', text: 'text-lg' },
    lg: { box: 'w-10 h-10 rounded-lg border-2.5', icon: 'w-6 h-6', text: 'text-xl' },
    xl: { box: 'w-12 h-12 rounded-xl border-[3px]', icon: 'w-7.5 h-7.5', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div
        className={`${currentSize.box} border-line bg-emerald-500 flex items-center justify-center shadow-brutal-xs shrink-0`}
      >
        <ApplyAiLogoIcon className={currentSize.icon} />
      </div>

      {withText && (
        <span className={`font-heading font-bold tracking-tight ${currentSize.text} ${textClassName || 'text-ink'} flex items-center`}>
          ApplyAI
          <span className="relative -top-1 ml-0.5 w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"></span>
        </span>
      )}
    </div>
  );
};

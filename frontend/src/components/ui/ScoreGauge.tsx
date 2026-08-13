'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  title = 'Match Score',
  size = 'md',
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score || 0));

  const dimensions = {
    sm: { size: 100, strokeWidth: 8, fontSize: 'text-xl' },
    md: { size: 130, strokeWidth: 10, fontSize: 'text-3xl' },
    lg: { size: 160, strokeWidth: 12, fontSize: 'text-4xl' },
  }[size];

  const radius = (dimensions.size - dimensions.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'stroke-emerald-500 text-emerald-600';
  let badgeText = 'Great Match';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (normalizedScore < 50) {
    colorClass = 'stroke-rose-500 text-rose-600';
    badgeText = 'Needs Work';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (normalizedScore < 75) {
    colorClass = 'stroke-amber-500 text-amber-600';
    badgeText = 'Moderate Fit';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (normalizedScore >= 90) {
    badgeText = 'Exceptional Match';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    colorClass = 'stroke-emerald-500 text-emerald-600';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg className="transform -rotate-90" width={dimensions.size} height={dimensions.size}>
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className="stroke-slate-100"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`${dimensions.fontSize} font-extrabold tracking-tight text-slate-900`}>
            {Math.round(normalizedScore)}%
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{title}</p>
        <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
    </div>
  );
};

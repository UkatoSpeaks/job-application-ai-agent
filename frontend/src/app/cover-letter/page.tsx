'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterView } from '@/components/CoverLetterView';

export default function CoverLetterPage() {
  const router = useRouter();

  return (
    <CoverLetterView
      onBackToDashboard={() => router.push('/dashboard')}
      onStartNewApplication={() => router.push('/analyze')}
    />
  );
}

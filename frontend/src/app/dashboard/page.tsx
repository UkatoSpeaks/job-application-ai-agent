'use client';

import React from 'react';
import Link from 'next/link';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <JobAnalysisDashboard
      onReset={() => router.push('/analyze')}
      onTailorResume={() => {
        alert('Page 4: Tailored Resume section is next in the flow!');
      }}
      onGenerateCoverLetter={() => {
        alert('Page 5: Cover Letter section is in the flow!');
      }}
    />
  );
}

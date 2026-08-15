'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterView } from '@/components/CoverLetterView';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';

export default function CoverLetterPage() {
  const router = useRouter();
  const [data, setData] = useState<JobAgentResponse | null>(null);

  useEffect(() => {
    setData(getApplicationResult());
  }, []);

  return (
    <CoverLetterView
      data={data}
      onBackToDashboard={() => router.push('/dashboard')}
      onStartNewApplication={() => router.push('/analyze')}
    />
  );
}

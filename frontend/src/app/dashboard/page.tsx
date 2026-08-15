'use client';

import React, { useEffect, useState } from 'react';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';
import { useRouter } from 'next/navigation';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<JobAgentResponse | null>(null);

  useEffect(() => {
    setData(getApplicationResult());
  }, []);

  return (
    <JobAnalysisDashboard
      data={data}
      onReset={() => router.push('/analyze')}
      onTailorResume={() => router.push('/tailored-resume')}
      onGenerateCoverLetter={() => router.push('/cover-letter')}
    />
  );
}

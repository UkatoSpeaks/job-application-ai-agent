'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TailoredResumeView } from '@/components/TailoredResumeView';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';

export default function TailoredResumePage() {
  const router = useRouter();
  const [data, setData] = useState<JobAgentResponse | null>(null);

  useEffect(() => {
    setData(getApplicationResult());
  }, []);

  return (
    <TailoredResumeView
      data={data}
      onBackToDashboard={() => router.push('/dashboard')}
      onGoToCoverLetter={() => router.push('/cover-letter')}
    />
  );
}

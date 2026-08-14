'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TailoredResumeView } from '@/components/TailoredResumeView';

export default function TailoredResumePage() {
  const router = useRouter();

  return (
    <TailoredResumeView
      onBackToDashboard={() => router.push('/dashboard')}
      onGoToCoverLetter={() => {
        alert('Page 5: Cover Letter section is next in the flow!');
      }}
    />
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TailoredResumeView } from '@/components/TailoredResumeView';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function TailoredResumePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [data] = useState<JobAgentResponse | null>(() => getApplicationResult());

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-emerald-400 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <TailoredResumeView
      data={data}
      onBackToDashboard={() => router.push('/dashboard')}
      onGoToCoverLetter={() => router.push('/cover-letter')}
    />
  );
}

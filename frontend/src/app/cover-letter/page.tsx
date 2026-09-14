'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterView } from '@/components/CoverLetterView';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function CoverLetterPage() {
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
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex items-center space-x-3 text-emerald-500 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <CoverLetterView
      data={data}
      onBackToDashboard={() => router.push('/dashboard')}
      onStartNewApplication={() => router.push('/analyze')}
    />
  );
}

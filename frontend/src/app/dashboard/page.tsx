'use client';

import React, { useEffect, useState } from 'react';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';
import { useRouter } from 'next/navigation';
import { getApplicationResult } from '@/lib/application-result';
import { JobAgentResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [data, setData] = useState<JobAgentResponse | null>(null);

  // Protected Route logic: Redirect unauthenticated users to Sign In page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setData(getApplicationResult());
  }, []);

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
    <JobAnalysisDashboard
      data={data}
      onReset={() => router.push('/analyze')}
      onTailorResume={() => router.push('/tailored-resume')}
      onGenerateCoverLetter={() => router.push('/cover-letter')}
    />
  );
}

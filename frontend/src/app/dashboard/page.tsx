'use client';

import React, { useEffect, useState } from 'react';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';
import { useRouter } from 'next/navigation';
import { getApplicationResult, saveApplicationResult } from '@/lib/application-result';
import { getLatestJobAnalysisApi } from '@/lib/api';
import { JobAgentResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [data, setData] = useState<JobAgentResponse | null>(null);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);

  // Protected Route logic: Redirect unauthenticated users to Sign In page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) return;
      setIsFetchingData(true);

      // Check session storage first for instant rendering
      const sessionResult = getApplicationResult();
      if (sessionResult) {
        setData(sessionResult);
        setIsFetchingData(false);
      }

      // Fetch latest user analysis from database backend
      try {
        const latestFromDb = await getLatestJobAnalysisApi(token || undefined);
        if (latestFromDb) {
          setData(latestFromDb);
          saveApplicationResult(latestFromDb);
        } else if (!sessionResult) {
          setData(null);
        }
      } catch (err) {
        console.warn('Failed to load user dashboard from API:', err);
      } finally {
        setIsFetchingData(false);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, token]);


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
    <JobAnalysisDashboard
      data={data}
      onReset={() => router.push('/analyze')}
      onTailorResume={() => router.push('/tailored-resume')}
      onGenerateCoverLetter={() => router.push('/cover-letter')}
    />
  );
}

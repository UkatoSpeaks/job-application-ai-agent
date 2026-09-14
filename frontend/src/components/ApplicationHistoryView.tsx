'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

import {
  Sparkles,
  Search,
  PlusCircle,
  Clock,
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getJobAnalysisHistoryApi } from '@/lib/api';
import { saveApplicationResult } from '@/lib/application-result';
import { HistoryItem } from '@/types';

export const ApplicationHistoryView: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'strong' | 'moderate' | 'low'>('all');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const items = await getJobAnalysisHistoryApi(token || undefined);
        setHistoryItems(items || []);
      } catch (err) {
        console.warn('Failed to fetch user analysis history:', err);
        setHistoryItems([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleSelectAnalysis = (item: HistoryItem) => {
    if (item.result_data) {
      saveApplicationResult(item.result_data);
    }
    router.push('/dashboard');
  };

  const filteredItems = historyItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      item.jobTitle.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filterCategory === 'strong') return item.matchScore >= 70;
    if (filterCategory === 'moderate') return item.matchScore >= 50 && item.matchScore < 70;
    if (filterCategory === 'low') return item.matchScore < 50;

    return true;
  });



  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line-soft shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-muted hover:text-ink transition-colors text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <span className="text-muted-2">|</span>

            <ApplyAiLogo size="sm" withText textClassName="text-ink text-base" />

          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              href="/analyze"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line-soft pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Workspace Application History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Application History
            </h1>
            <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
              Review and manage your previous AI job analysis reports.
            </p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-surface border border-line-soft rounded-2xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-2 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or job title..."
              className="w-full bg-canvas border border-line-soft hover:border-line focus:border-purple-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink placeholder-muted-2 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-muted flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-xs'
                  : 'bg-canvas text-ink border-line-soft hover:bg-surface-2'
              }`}
            >
              All ({historyItems.length})
            </button>

            <button
              onClick={() => setFilterCategory('strong')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'strong'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-xs'
                  : 'bg-canvas text-ink border-line-soft hover:bg-surface-2'
              }`}
            >
              Strong Match (&gt;70%)
            </button>

            <button
              onClick={() => setFilterCategory('moderate')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-xs'
                  : 'bg-canvas text-ink border-line-soft hover:bg-surface-2'
              }`}
            >
              Moderate (50–70%)
            </button>

            <button
              onClick={() => setFilterCategory('low')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'low'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold shadow-xs'
                  : 'bg-canvas text-ink border-line-soft hover:bg-surface-2'
              }`}
            >
              Low Match (&lt;50%)
            </button>
          </div>
        </div>

        {/* Applications List */}
        {isLoadingHistory ? (
          <div className="p-12 rounded-2xl bg-surface border border-line-soft text-center space-y-3 shadow-sm">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
            <p className="text-xs text-muted font-medium">Loading your application history...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, idx) => {
              const isStrong = item.matchScore >= 70;
              const isModerate = item.matchScore >= 50 && item.matchScore < 70;
              const badgeColor = isStrong
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isModerate
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-surface border border-line-soft hover:border-purple-300 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-ink group-hover:text-purple-700 transition-colors truncate">
                        {item.jobTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-muted font-semibold border border-line-soft">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-normal">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-muted-2" />
                        {item.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-2" />
                        {item.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-2" />
                        {item.dateAnalyzed}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-line-soft">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-2 block">
                        Match Score
                      </span>
                      <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-md border inline-block mt-0.5 ${badgeColor}`}>
                        {item.matchScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectAnalysis(item)}
                      className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition-all flex items-center space-x-1 border border-purple-200 shadow-xs cursor-pointer"
                    >
                      <span>View Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (

          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-2xl bg-surface border border-line-soft text-center space-y-5 shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-ink">No applications found</h3>
              <p className="text-xs text-muted font-normal leading-relaxed">
                {searchQuery || filterCategory !== 'all'
                  ? 'No items matched your search query or selected filter.'
                  : 'Analyze your first job posting and your applications will appear here.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Analyze a Job →</span>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

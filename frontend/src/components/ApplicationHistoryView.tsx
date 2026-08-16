'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface HistoryItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  matchScore: number;
  dateAnalyzed: string;
  status: string;
  missingSkillsCount: number;
  matchedSkillsCount: number;
}

export const ApplicationHistoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'strong' | 'moderate' | 'low'>('all');

  const initialHistory: HistoryItem[] = [
    {
      id: 'app-1',
      jobTitle: 'Senior Developer',
      company: 'HCLTech',
      location: 'Bengaluru, India',
      matchScore: 84,
      dateAnalyzed: 'Aug 15, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 6,
      missingSkillsCount: 3,
    },
    {
      id: 'app-2',
      jobTitle: 'Software Engineer',
      company: 'Stripe',
      location: 'Remote',
      matchScore: 76,
      dateAnalyzed: 'Aug 14, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 8,
      missingSkillsCount: 2,
    },
    {
      id: 'app-3',
      jobTitle: 'AI Applications Engineer',
      company: 'OpenAI',
      location: 'Hybrid • SF, CA',
      matchScore: 81,
      dateAnalyzed: 'Aug 13, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 9,
      missingSkillsCount: 1,
    },
    {
      id: 'app-4',
      jobTitle: 'Full Stack Developer',
      company: 'DataScale Inc',
      location: 'Remote',
      matchScore: 68,
      dateAnalyzed: 'Aug 11, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 7,
      missingSkillsCount: 3,
    },
    {
      id: 'app-5',
      jobTitle: 'Frontend Engineer',
      company: 'CloudFlow Tech',
      location: 'Austin, TX',
      matchScore: 42,
      dateAnalyzed: 'Aug 08, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 4,
      missingSkillsCount: 7,
    },
  ];

  const filteredItems = initialHistory.filter((item) => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-md shadow-purple-600/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-base tracking-tight">
                ApplyAI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Workspace Application History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Application History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Review and manage your previous AI job analysis reports.
            </p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or job title..."
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-purple-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All ({initialHistory.length})
            </button>

            <button
              onClick={() => setFilterCategory('strong')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'strong'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Strong Match (&gt;70%)
            </button>

            <button
              onClick={() => setFilterCategory('moderate')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Moderate (50–70%)
            </button>

            <button
              onClick={() => setFilterCategory('low')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterCategory === 'low'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Low Match (&lt;50%)
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredItems.length > 0 ? (
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
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                        {item.jobTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold border border-slate-200">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-normal">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.dateAnalyzed}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Match Score
                      </span>
                      <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-md border inline-block mt-0.5 ${badgeColor}`}>
                        {item.matchScore}%
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition-all flex items-center space-x-1 border border-purple-200 shadow-xs"
                    >
                      <span>View Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
            className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-5 shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
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

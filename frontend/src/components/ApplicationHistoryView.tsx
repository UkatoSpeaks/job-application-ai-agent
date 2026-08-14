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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Sample mock history data
  const initialHistory: HistoryItem[] = [
    {
      id: 'app-1',
      jobTitle: 'Senior Developer',
      company: 'HCLTech',
      location: 'Bengaluru, India',
      matchScore: 58,
      dateAnalyzed: 'Aug 15, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 6,
      missingSkillsCount: 5,
    },
    {
      id: 'app-2',
      jobTitle: 'Software Engineer',
      company: 'Company X',
      location: 'Remote',
      matchScore: 76,
      dateAnalyzed: 'Aug 14, 2026',
      status: 'Analyzed',
      matchedSkillsCount: 8,
      missingSkillsCount: 2,
    },
    {
      id: 'app-3',
      jobTitle: 'AI Engineer Intern',
      company: 'Company Y',
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

  // Filtering logic
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Header */}
      <header className="h-14 border-b border-white/10 bg-[#0f172a] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Home</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight flex items-center">
              ApplyAI
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1"></span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout: 2 Columns */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0f172a]/60 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Workspace
              </p>
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/analyze"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>New Analysis</span>
                </Link>

                <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>History</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {initialHistory.length}
                  </span>
                </div>
              </nav>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1e293b]/40 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              FastAPI Agent
            </span>
            <span className="text-slate-500 font-mono">v1.0</span>
          </div>
        </aside>

        {/* Right Main Area */}
        <main className="flex-1 p-6 lg:p-10 bg-slate-900 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-7">
            {/* Header Title */}
            <div className="space-y-1.5 border-b border-white/10 pb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                Application History
                <Clock className="w-5 h-5 text-emerald-400 inline" />
              </h1>
              <p className="text-sm text-slate-400 font-normal">
                Track and review your previous job analysis reports.
              </p>
            </div>

            {/* Search and Filters Bar */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company or job title..."
                  className="w-full bg-[#0f172a] border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>

                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterCategory === 'all'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  All ({initialHistory.length})
                </button>

                <button
                  onClick={() => setFilterCategory('strong')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterCategory === 'strong'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Strong Match (&gt;70%)
                </button>

                <button
                  onClick={() => setFilterCategory('moderate')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterCategory === 'moderate'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                      : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Moderate (50–70%)
                </button>

                <button
                  onClick={() => setFilterCategory('low')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    filterCategory === 'low'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                      : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:text-white'
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
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : isModerate
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/15 text-red-400 border-red-500/30';

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-white/20 transition-all shadow-md hover:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {item.jobTitle}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                            {item.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-normal">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            {item.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {item.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {item.dateAnalyzed}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                        {/* Match Score */}
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Match Score
                          </span>
                          <span className={`text-lg font-extrabold px-2.5 py-0.5 rounded-lg border inline-block mt-0.5 ${badgeColor}`}>
                            {item.matchScore}%
                          </span>
                        </div>

                        {/* Action Link */}
                        <Link
                          href="/dashboard"
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-300 text-xs font-bold transition-all flex items-center space-x-1 border border-white/10 group-hover:border-emerald-500/50"
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
                className="p-12 rounded-2xl bg-[#0f172a]/60 border border-white/10 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-xl font-bold text-white">No applications found</h3>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed">
                    {searchQuery || filterCategory !== 'all'
                      ? 'No items matched your search query or selected filter.'
                      : 'Analyze your first job posting and your applications will appear here.'}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <span>Analyze a Job →</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

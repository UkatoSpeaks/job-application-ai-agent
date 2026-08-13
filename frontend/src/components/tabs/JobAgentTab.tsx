'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { runJobAgentPipeline } from '@/lib/api';
import { JobAgentResponse } from '@/types';
import { Bot, Globe, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Copy, Check, Building, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const JobAgentTab: React.FC = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAgentResponse | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume file.');
      return;
    }
    if (!jobUrl.trim()) {
      setError('Please enter a valid job posting URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runJobAgentPipeline(file, jobUrl.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while running the AI Job Agent pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <GlassCard className="border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5" />
              Autonomous Job Application Pipeline
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Paste Any Job URL & Let AI Do The Work
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Extract job requirements, calculate ATS match, tailor bullet points, and draft custom cover letters instantly from LinkedIn, Indeed, Lever, or Greenhouse links.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </div>
      </GlassCard>

      {/* Input Form */}
      <form onSubmit={handleRunAgent} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <FileUpload label="1. Select PDF Resume" onFileSelect={setFile} selectedFile={file} />
          </h3>
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Enter Job Posting URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://www.linkedin.com/jobs/view/12345678 or https://boards.greenhouse.io/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl joblist-input text-xs font-mono placeholder-slate-400"
              />
            </div>
            <p className="text-xs text-slate-400">
              Supports job posting URLs from LinkedIn, Indeed, Glassdoor, Lever, Greenhouse, and company career portals.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
              loading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing AI Agent Pipeline...</span>
              </>
            ) : (
              <>
                <span>Run Autonomous AI Agent</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </GlassCard>
      </form>

      {/* Loading Stepper */}
      {loading && (
        <GlassCard className="py-8 text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Autonomous Agent Active</h3>
            <p className="text-xs text-slate-400">Scraping job URL, extracting requirements, analyzing match & tailoring materials...</p>
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 animate-shimmer w-full"></div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Pipeline Results Dashboard */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Job Extracted Successfully
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                  {result.job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    {result.job.company || 'Unknown Company'}
                  </span>
                  {result.job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      {result.job.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-purple-300 mb-1">Job Summary:</p>
                <p className="line-clamp-3">{result.job.summary}</p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col items-center justify-center">
              <ScoreGauge score={result.match.score !== undefined && result.match.score !== null ? result.match.score : (result.match.similarity || 0) * 100} title="Overall Match Score" size="lg" />
            </GlassCard>
          </div>

          {/* Skill Gap Matrix */}
          <GlassCard className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300">Skill & Keyword Gap Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Matched Skills & Keywords ({result.match.matched_skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.match.matched_skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Missing / Gap Skills ({result.match.missing_skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.match.missing_skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Cover Letter Output */}
          {result.cover_letter && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generated AI Cover Letter
                </h4>
                <button
                  onClick={() => copyToClipboard(typeof result.cover_letter === 'string' ? result.cover_letter : JSON.stringify(result.cover_letter, null, 2))}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCoverLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoverLetter ? 'Copied!' : 'Copy Cover Letter'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {typeof result.cover_letter === 'string' ? result.cover_letter : JSON.stringify(result.cover_letter, null, 2)}
              </div>
            </GlassCard>
          )}
        </motion.div>
      )}
    </div>
  );
};

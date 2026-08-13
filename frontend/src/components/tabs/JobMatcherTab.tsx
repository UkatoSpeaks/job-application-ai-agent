'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { matchResume } from '@/lib/api';
import { JobMatchResponse } from '@/types';
import { Target, ArrowRight, AlertTriangle, CheckCircle2, AlertCircle, Sparkles, Building, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const JobMatcherTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobMatchResponse | null>(null);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await matchResume(file, jobDescription.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to match resume with job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <form onSubmit={handleMatch} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 space-y-4">
          <FileUpload label="1. PDF Resume" onFileSelect={setFile} selectedFile={file} />
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Paste Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description requirements, responsibilities, and qualifications here..."
              className="w-full p-3.5 rounded-xl joblist-input text-xs placeholder-slate-400 font-mono leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
              loading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Compatibility...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Calculate Match Score</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </GlassCard>
      </form>

      {/* Match Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col items-center justify-center">
              <ScoreGauge score={result.similarity * 100} title="Match & Similarity Score" size="lg" />
            </GlassCard>

            <GlassCard className="md:col-span-2 space-y-3 flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">{result.job_description.title || 'Job Requirements Parsed'}</h3>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3">{result.job_description.summary}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Similarity: {(result.similarity * 100).toFixed(1)}%
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {result.match.matched_skills?.length || 0} Skills Matched
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  {result.match.missing_skills?.length || 0} Missing Skills
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Skill & Keyword Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="space-y-3 border-emerald-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Matched Skills & Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.match.matched_skills?.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="space-y-3 border-rose-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Missing Skills & Keyword Gaps
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.match.missing_skills?.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* AI Recommendations */}
          {result.match.recommendations && result.match.recommendations.length > 0 && (
            <GlassCard className="space-y-3 border-purple-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Strategic Recommendations to Boost Score
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.match.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </motion.div>
      )}
    </div>
  );
};

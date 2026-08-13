'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { tailorResume } from '@/lib/api';
import { ResumeTailorResponse } from '@/types';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResumeTailorTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeTailorResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTailor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste target job description text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await tailorResume(file, jobDescription.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to tailor resume.');
    } finally {
      setLoading(false);
    }
  };

  const copyTailoredText = () => {
    if (!result) return;
    const text = JSON.stringify(result.tailored_resume, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <form onSubmit={handleTailor} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 space-y-4">
          <FileUpload label="1. PDF Resume" onFileSelect={setFile} selectedFile={file} />
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Target Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job posting responsibilities and requirements to tailor bullet points..."
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
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Tailoring Bullet Points & Skills...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tailor Resume for Job</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </GlassCard>
      </form>

      {/* Tailored Output Comparison */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary of Changes */}
          <GlassCard className="space-y-3 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Summary of Optimization & Targeted Keywords Added
              </h4>
              <button
                onClick={copyTailoredText}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON!' : 'Copy Tailored JSON'}</span>
              </button>
            </div>

            {result.summary_of_changes && result.summary_of_changes.length > 0 && (
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.summary_of_changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            )}

            {result.targeted_keywords_added && result.targeted_keywords_added.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {result.targeted_keywords_added.map((kw, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md text-[11px] bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                    +{kw}
                  </span>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Tailored Experience */}
          <GlassCard className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Optimized Work Experience & Bullet Points
            </h4>
            <div className="space-y-4">
              {result.tailored_resume?.work_experience?.map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold text-white">{exp.job_title}</h5>
                    <span className="text-xs text-purple-400 font-semibold">{exp.company}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-200 space-y-1.5 pl-1">
                    {exp.responsibilities?.map((resp, rIdx) => (
                      <li key={rIdx} className="leading-relaxed">{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

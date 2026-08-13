'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { uploadResume } from '@/lib/api';
import { ResumeUploadResponse } from '@/types';
import { FileSearch, CheckCircle2, AlertTriangle, ArrowRight, User, Mail, Phone, Globe, Code2, MapPin, Briefcase, GraduationCap, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResumeAnalyzerTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeUploadResponse | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a PDF resume first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await uploadResume(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to parse and analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <GlassCard className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-purple-400" />
              Resume Parser & Quality Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload your PDF resume to extract structured data, evaluate formatting, calculate ATS readiness scores, and discover actionable improvements.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-300 ${
              loading || !file
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing PDF...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <FileUpload onFileSelect={setFile} selectedFile={file} />

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </GlassCard>

      {/* Results Dashboard */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Top Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col items-center justify-center">
              <ScoreGauge score={result.score.total_score} title="ATS Quality Score" size="lg" />
            </GlassCard>

            <GlassCard className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Extracted Candidate Profile
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{result.parsed_resume.contact_info.name || 'Name not detected'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{result.parsed_resume.contact_info.email || 'Email not detected'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{result.parsed_resume.contact_info.phone || 'Phone not detected'}</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{result.parsed_resume.contact_info.location || 'Location not detected'}</span>
                </div>
              </div>

              {result.parsed_resume.summary && (
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300">
                  <p className="font-semibold text-purple-300 mb-1">Executive Summary:</p>
                  <p>{result.parsed_resume.summary}</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Skills Badges */}
          <GlassCard className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Award className="w-4 h-4" /> Detected Skills & Competencies ({result.parsed_resume.skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.parsed_resume.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 border border-purple-500/30 text-purple-300 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Work Experience */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Work Experience
            </h3>
            <div className="space-y-4">
              {result.parsed_resume.work_experience?.map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white">{exp.job_title}</h4>
                    <span className="text-xs text-purple-400 font-medium">{exp.company}</span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Strengths, Weaknesses, Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="space-y-3 border-emerald-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="space-y-3 border-rose-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Areas for Improvement
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.analysis.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="space-y-3 border-purple-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Recommendations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.analysis.actionable_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  );
};

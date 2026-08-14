'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Upload,
  FileText,
  Trash2,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowLeft,
  Search,
  Target,
  FileCode,
  Zap,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runJobAgentPipeline } from '@/lib/api';
import { JobAgentResponse } from '@/types';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';

// URL validation helper function
function isValidJobUrl(urlString: string): boolean {
  if (!urlString || urlString.trim() === '') return false;
  try {
    const url = new URL(urlString);
    const validProtocols = ['http:', 'https:'];
    if (!validProtocols.includes(url.protocol)) return false;
    // Hostname must contain at least one dot (e.g. company.com)
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
}

export default function AnalyzeJobPage() {
  // Input states
  const [jobUrl, setJobUrl] = useState('');
  const [urlTouched, setUrlTouched] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis / Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<JobAgentResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time URL validation
  const urlValid = isValidJobUrl(jobUrl);
  const showUrlError = urlTouched && jobUrl.trim().length > 0 && !urlValid;
  const showUrlSuccess = jobUrl.trim().length > 0 && urlValid;

  // Analysis steps definition
  const analysisSteps = [
    { title: 'Resume uploaded', desc: 'Parsed experience & skills from PDF' },
    { title: 'Reading job posting', desc: 'Fetching role details from URL' },
    { title: 'Matching your skills', desc: 'Calculating skill gaps & similarity score' },
    { title: 'Tailoring your resume', desc: 'Optimizing bullet points for ATS keywords' },
    { title: 'Writing your cover letter', desc: 'Drafting personalized application letter' },
  ];

  // Handle File Selection
  const handleFileChange = (file: File | undefined) => {
    setFileError(null);
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Only PDF files are supported. Please upload a PDF resume.');
      return;
    }

    // 10 MB size limit
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10 MB limit. Please select a smaller PDF.');
      return;
    }

    setSelectedFile(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle Submit Analysis
  const handleStartAnalysis = async () => {
    if (!urlValid || !selectedFile) return;

    setIsAnalyzing(true);
    setShowDashboard(false);
    setApiError(null);
    setAnalysisProgress(5);
    setCurrentStepIndex(0);

    // Simulate multi-stage animation while executing real backend API call
    const stepInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 92) {
          clearInterval(stepInterval);
          return prev;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const newStep = Math.min(Math.floor((next / 100) * analysisSteps.length), analysisSteps.length - 1);
        setCurrentStepIndex(newStep);
        return next;
      });
    }, 450);

    try {
      const response = await runJobAgentPipeline(selectedFile, jobUrl);
      clearInterval(stepInterval);
      setAnalysisProgress(100);
      setCurrentStepIndex(analysisSteps.length - 1);
      setAnalysisResult(response);
      setTimeout(() => {
        setShowDashboard(true);
      }, 700);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Analysis error:', err);
      setAnalysisProgress(100);
      setCurrentStepIndex(analysisSteps.length - 1);
      setApiError(err.message || 'Unable to reach backend service.');
      setTimeout(() => {
        setShowDashboard(true);
      }, 700);
    }
  };

  const resetForm = () => {
    setIsAnalyzing(false);
    setShowDashboard(false);
    setAnalysisProgress(0);
    setCurrentStepIndex(0);
    setAnalysisResult(null);
    setApiError(null);
  };

  const canAnalyze = urlValid && selectedFile !== null && !isAnalyzing;

  // Render Dashboard View if completed
  if (showDashboard) {
    return (
      <JobAnalysisDashboard
        data={analysisResult}
        onReset={resetForm}
        onTailorResume={() => {
          alert('Tailored Resume section coming in Page 4! Currently on Page 3 Dashboard.');
        }}
        onGenerateCoverLetter={() => {
          alert('Cover Letter section coming in Page 5! Currently on Page 3 Dashboard.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Bar */}
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

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Workspace Active</span>
          </div>
          <div className="flex items-center space-x-2 border-l border-white/10 pl-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex Johnson"
              className="w-7 h-7 rounded-full border border-white/20 object-cover"
            />
            <span className="text-xs font-medium text-slate-300 hidden md:inline">Dashboard</span>
          </div>
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
                <button
                  onClick={resetForm}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    !isAnalyzing
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>New Analysis</span>
                </button>

                <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-400 transition-colors cursor-not-allowed">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>History</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    0
                  </span>
                </div>
              </nav>
            </div>

            {/* Quick Tips */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Tip</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Paste any public job URL from LinkedIn, Indeed, or company career pages for best parsing results.
              </p>
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
          <AnimatePresence mode="wait">
            {!isAnalyzing ? (
              /* FORM STATE */
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                {/* Header Title */}
                <div className="space-y-1.5 border-b border-white/10 pb-5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    Analyze a Job
                    <Sparkles className="w-5 h-5 text-emerald-400 inline" />
                  </h1>
                  <p className="text-sm text-slate-400 font-normal">
                    Find out how well your resume matches a specific role.
                  </p>
                </div>

                {/* Main Form Container */}
                <div className="space-y-6">
                  {/* Job Posting URL Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Job Posting URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={jobUrl}
                        onChange={(e) => {
                          setJobUrl(e.target.value);
                          if (!urlTouched) setUrlTouched(true);
                        }}
                        onBlur={() => setUrlTouched(true)}
                        placeholder="https://company.com/jobs/..."
                        className={`w-full bg-[#0f172a] border ${
                          showUrlError
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : showUrlSuccess
                            ? 'border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-slate-700 hover:border-slate-600 focus:border-emerald-500'
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                      />

                      {showUrlSuccess && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
                      )}
                    </div>

                    {/* Validation Feedback Messages */}
                    {showUrlSuccess && (
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Valid job posting URL</span>
                      </p>
                    )}

                    {showUrlError && (
                      <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Please enter a valid public job posting URL.</span>
                      </p>
                    )}
                  </div>

                  {/* Resume Uploader Component */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Your Resume
                    </label>

                    {!selectedFile ? (
                      /* BEFORE UPLOAD DROPZONE */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-slate-500 bg-[#0f172a]/70 hover:bg-[#0f172a]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleFileChange(e.target.files?.[0])}
                          className="hidden"
                        />

                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                            <Upload className="w-6 h-6" />
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">
                              Drop your PDF here <span className="text-slate-400 font-normal">or click to browse</span>
                            </p>
                            <p className="text-xs text-slate-500 font-normal">
                              PDF only • Max 10 MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* AFTER UPLOAD FILE CARD */
                      <div className="bg-[#0f172a] border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/5">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate max-w-xs">
                              {selectedFile.name}
                            </p>
                            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                              <span>PDF • {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to analyze</span>
                              <Check className="w-3 h-3 text-emerald-400" />
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-1 shrink-0 ml-3"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{fileError}</span>
                      </p>
                    )}
                  </div>

                  {/* Major CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={!canAnalyze}
                      onClick={handleStartAnalysis}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                        canAnalyze
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>Analyze Job</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* "What you'll get" Section */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center sm:text-left">
                    What you'll get
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-white/5 space-y-1.5 hover:border-white/10 transition-colors">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <Target className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-white">Match Score</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        See how closely you fit the job requirements.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-white/5 space-y-1.5 hover:border-white/10 transition-colors">
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Search className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-white">Skill Gaps</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Find skills & ATS keywords you're missing.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-white/5 space-y-1.5 hover:border-white/10 transition-colors">
                      <div className="flex items-center space-x-2 text-purple-400">
                        <FileCode className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-white">AI Application</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Get a tailored resume + custom cover letter.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* DEDICATED ANALYSIS / LOADING STATE */
              <motion.div
                key="loading-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="max-w-xl mx-auto py-8 space-y-8"
              >
                {/* Central Sparkling Icon */}
                <div className="text-center space-y-3">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                      <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
                    </div>
                    {analysisProgress < 100 && (
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin"></div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {analysisProgress < 100 ? 'Analyzing your job' : 'Analysis Complete!'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      We're building your application profile...
                    </p>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Progress</span>
                    <span className="text-emerald-400 font-mono text-sm px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      [{analysisProgress}%]
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full"
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Multi-stage Animated Steps List */}
                  <div className="space-y-3 pt-2">
                    {analysisSteps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex || analysisProgress === 100;
                      const isCurrent = idx === currentStepIndex && analysisProgress < 100;

                      return (
                        <div
                          key={step.title}
                          className={`flex items-center space-x-3 p-2.5 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                              : isCompleted
                              ? 'text-slate-300'
                              : 'text-slate-600 opacity-60'
                          }`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping"></span>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-slate-600 text-[10px]">
                                ○
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold tracking-wide flex items-center justify-between">
                              <span>{step.title}</span>
                              {isCurrent && (
                                <span className="text-[10px] text-emerald-400 font-normal animate-pulse">
                                  Processing...
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* State upon 100% completion */}
                {analysisProgress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 shadow-lg shadow-emerald-500/5"
                  >
                    <p className="text-xs text-emerald-300 font-medium leading-relaxed">
                      ✓ Job analysis finished! Loading Analysis Dashboard...
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setShowDashboard(true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-white transition-all shadow-lg flex items-center space-x-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>View Results Dashboard →</span>
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>New Analysis</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

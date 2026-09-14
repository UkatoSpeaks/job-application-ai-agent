'use client';

import React, { useState, useRef } from 'react';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Terminal,
  Globe,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runJobAgentPipeline, getErrorMessage } from '@/lib/api';
import { JobAgentResponse } from '@/types';
import { JobAnalysisDashboard } from '@/components/JobAnalysisDashboard';
import { saveApplicationResult } from '@/lib/application-result';

// URL validation helper function
export function isValidJobUrl(urlString: string): boolean {
  if (!urlString || urlString.trim() === '') return false;
  try {
    const url = new URL(urlString);
    const validProtocols = ['http:', 'https:'];
    if (!validProtocols.includes(url.protocol)) return false;
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
}

// Preset sample jobs for 1-click testing. These point at placeholder
// example.com URLs (not real company career pages) since they are only
// meant to illustrate the input format, not to be live, scrapeable postings.
const SAMPLE_JOBS = [
  {
    company: 'Nimbus Cloud',
    title: 'Senior Frontend Engineer',
    url: 'https://example.com/careers/senior-frontend-engineer',
    badge: 'Sample',
    icon: '🚀',
  },
  {
    company: 'Horizon Payments',
    title: 'Staff Full Stack Engineer',
    url: 'https://example.com/careers/staff-full-stack-engineer',
    badge: 'Sample',
    icon: '💳',
  },
  {
    company: 'Northwind AI',
    title: 'AI Applications Engineer',
    url: 'https://example.com/careers/ai-applications-engineer',
    badge: 'Sample',
    icon: '🤖',
  },
  {
    company: 'Anchor Logistics',
    title: 'Senior Software Engineer',
    url: 'https://example.com/careers/senior-software-engineer',
    badge: 'Sample',
    icon: '📦',
  },
];

export default function AnalyzeJobPage() {
  const router = useRouter();

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
  const [logs, setLogs] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time URL validation
  const urlValid = isValidJobUrl(jobUrl);
  const showUrlError = urlTouched && jobUrl.trim().length > 0 && !urlValid;
  const showUrlSuccess = jobUrl.trim().length > 0 && urlValid;

  // Analysis steps definition
  const analysisSteps = [
    { title: 'Parsing PDF Resume', desc: 'Extracting experience, skills & structure from PDF' },
    { title: 'Reading Job Posting', desc: 'Fetching requirements & title from target URL' },
    { title: 'Calculating Match Score', desc: 'Comparing skills, ATS keywords & semantic overlap' },
    { title: 'Optimizing Resume Bullets', desc: 'Tailoring experience descriptions for target role' },
    { title: 'Generating Cover Letter', desc: 'Drafting personalized application letter' },
  ];

  // Quick fill preset sample job
  const handleSelectSampleJob = (sample: typeof SAMPLE_JOBS[0]) => {
    setJobUrl(sample.url);
    setUrlTouched(true);
  };

  // Quick fill sample resume
  const handleUseSampleResume = () => {
    setFileError(null);
    const sampleBlob = new Blob(['Alex Johnson - Senior Frontend Engineer Resume Content'], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], 'Alex_Johnson_Senior_Frontend_Resume.pdf', {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setSelectedFile(sampleFile);
  };

  // Handle File Selection
  const handleFileChange = (file: File | undefined) => {
    setFileError(null);
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Only PDF files are supported. Please upload a PDF resume.');
      return;
    }

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
    setAnalysisError(null);
    setAnalysisProgress(5);
    setCurrentStepIndex(0);
    setLogs(['[0.1s] 🚀 Analysis pipeline initiated...']);

    const logMessages = [
      '[0.4s] 📄 PDF parser active. Detected candidate profile.',
      '[1.2s] 🌐 Fetching target job description from URL...',
      '[2.1s] 🎯 Extracting key requirements & preferred qualifications...',
      '[3.0s] 📊 Calculating ATS keyword density and skill gap overlap...',
      '[3.9s] ✍️ Adapting bullet points and crafting tailored summary...',
      '[4.6s] 💌 Drafting role-specific cover letter...',
      '[5.2s] ✅ Finalizing analysis results package.',
    ];

    let messageIdx = 0;
    const stepInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 92) {
          clearInterval(stepInterval);
          return prev;
        }
        const next = prev + Math.floor(Math.random() * 8) + 5;
        const newStep = Math.min(Math.floor((next / 100) * analysisSteps.length), analysisSteps.length - 1);
        setCurrentStepIndex(newStep);

        if (messageIdx < logMessages.length && Math.random() > 0.3) {
          setLogs((l) => [...l, logMessages[messageIdx]]);
          messageIdx++;
        }

        return next;
      });
    }, 400);

    try {
      const response = await runJobAgentPipeline(selectedFile, jobUrl);
      clearInterval(stepInterval);
      setLogs((l) => [...l, '[5.5s] ⚡ Backend API responded successfully!']);
      setAnalysisProgress(100);
      setCurrentStepIndex(analysisSteps.length - 1);
      setAnalysisResult(response);
      saveApplicationResult(response);

      setTimeout(() => {
        setShowDashboard(true);
      }, 600);
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStepIndex(0);
      setLogs([]);
      setAnalysisError(
        getErrorMessage(err, 'We could not analyze this job posting. Please check the URL and try again.')
      );
    }
  };

  const resetForm = () => {
    setIsAnalyzing(false);
    setShowDashboard(false);
    setAnalysisProgress(0);
    setCurrentStepIndex(0);
    setAnalysisResult(null);
    setAnalysisError(null);
    setLogs([]);
  };

  const canAnalyze = urlValid && selectedFile !== null && !isAnalyzing;

  // Render Dashboard View if completed
  if (showDashboard) {
    return (
      <JobAnalysisDashboard
        data={analysisResult}
        onReset={resetForm}
        onTailorResume={() => router.push('/tailored-resume')}
        onGenerateCoverLetter={() => router.push('/cover-letter')}
      />
    );
  }

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
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Validation Passed</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            /* FORM INPUT STATE */
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line-soft pb-5">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
                    <span>Step 1 of 5 • Job Intelligence</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                    Analyze Job Posting
                  </h1>
                  <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
                    Paste a target job posting URL and upload your resume to generate a full match analysis.
                  </p>
                </div>
              </div>

              {/* Form Inputs Container */}
              <div className="space-y-6">
                {/* Job URL Section */}
                <div className="bg-surface border border-line-soft rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-line-soft pb-3">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span>1. Target Job Posting URL</span>
                    </label>
                    <span className="text-[11px] text-muted-2 font-semibold">LinkedIn, Indeed, Careers Page</span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        if (!urlTouched) setUrlTouched(true);
                      }}
                      onBlur={() => setUrlTouched(true)}
                      placeholder="https://careers.company.com/jobs/senior-developer..."
                      className={`w-full bg-canvas border ${
                        showUrlError
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                          : showUrlSuccess
                          ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-line-soft hover:border-line focus:border-purple-600'
                      } rounded-xl px-4 py-3 text-xs text-ink placeholder-muted-2 focus:outline-none transition-all font-mono`}
                    />

                    {showUrlSuccess && (
                      <div className="absolute right-3.5 top-3 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {showUrlSuccess && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Valid job posting URL detected</span>
                    </p>
                  )}

                  {showUrlError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Please enter a valid public job posting web address (http/https).</span>
                    </p>
                  )}

                  {/* Quick-Fill Preset Pills */}
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-muted-2 uppercase tracking-wider mb-2">
                      Or test with a sample job link:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_JOBS.map((sample) => (
                        <button
                          key={sample.company}
                          type="button"
                          onClick={() => handleSelectSampleJob(sample)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                            jobUrl === sample.url
                              ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold shadow-xs'
                              : 'bg-canvas hover:bg-surface-2 border-line-soft text-ink'
                          }`}
                        >
                          <span>{sample.icon}</span>
                          <span>{sample.company} — {sample.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resume Upload Section */}
                <div className="bg-surface border border-line-soft rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-line-soft pb-3">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>2. Master PDF Resume</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseSampleResume}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-800 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkle className="w-3.5 h-3.5 text-purple-600" />
                      <span>Use Demo Resume (Alex_Johnson.pdf)</span>
                    </button>
                  </div>

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? 'border-purple-500 bg-purple-50 scale-[1.01]'
                          : 'border-line-soft hover:border-purple-400 bg-canvas/50 hover:bg-canvas'
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
                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-ink">
                            Drop your PDF resume here <span className="text-muted font-normal">or click to browse</span>
                          </p>
                          <p className="text-[11px] text-muted-2 font-normal">
                            Supports standard PDF files up to 10 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AFTER UPLOAD FILE CARD */
                    <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <span>PDF Resume Loaded • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted hover:text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-1 shrink-0 ml-3 border border-line-soft cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{fileError}</span>
                    </p>
                  )}
                </div>

                {/* Analysis Error Banner */}
                {analysisError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-700">Analysis failed</p>
                      <p className="text-xs text-red-600 mt-0.5">{analysisError}</p>
                    </div>
                  </div>
                )}

                {/* Main Action CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!canAnalyze}
                    onClick={handleStartAnalysis}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-md ${
                      canAnalyze
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-line-soft text-muted-2 border border-line-soft cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Start AI Job Analysis</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="pt-4 border-t border-line-soft space-y-3">
                <p className="text-xs font-bold text-muted-2 uppercase tracking-wider">
                  Included in this Analysis
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-line-soft space-y-1.5 shadow-xs">
                    <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-xs">
                      <Target className="w-4 h-4" />
                      <span>ATS Match Score</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Calculates skill overlap, similarity metrics, and missing requirements.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-line-soft space-y-1.5 shadow-xs">
                    <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-xs">
                      <Search className="w-4 h-4" />
                      <span>Keyword Gap Finder</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Identifies missing resume keywords to bypass automated screening filters.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-line-soft space-y-1.5 shadow-xs">
                    <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-xs">
                      <FileCode className="w-4 h-4" />
                      <span>Tailored Package</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Generates a tailored resume bullet set and custom role cover letter.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* PROGRESS MONITOR */
            <motion.div
              key="loading-view"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto py-6 space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shadow-md shadow-purple-600/10">
                    <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    {analysisProgress < 100 ? 'Analyzing Application Profile...' : 'Analysis Complete!'}
                  </h2>
                  <p className="text-xs text-muted">
                    Running AI match algorithms against target job posting...
                  </p>
                </div>
              </div>

              <div className="bg-surface border border-line-soft rounded-2xl p-6 space-y-5 shadow-lg">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-ink uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span>Pipeline Progress</span>
                  </span>
                  <span className="text-purple-700 font-mono text-xs px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200">
                    {analysisProgress}%
                  </span>
                </div>

                <div className="w-full bg-surface-2 rounded-full h-2.5 overflow-hidden p-0.5">
                  <motion.div
                    className="bg-purple-600 h-full rounded-full"
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>

                <div className="space-y-2.5 pt-2 border-t border-line-soft">
                  {analysisSteps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex || analysisProgress === 100;
                    const isCurrent = idx === currentStepIndex && analysisProgress < 100;

                    return (
                      <div
                        key={step.title}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-purple-50 border border-purple-200 text-ink font-semibold'
                            : isCompleted
                            ? 'text-ink bg-canvas'
                            : 'text-muted-2 opacity-60'
                        }`}
                      >
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-surface animate-ping"></span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-line-soft flex items-center justify-center text-muted-2 text-[10px]">
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold tracking-wide flex items-center justify-between">
                            <span>{step.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-purple-700 font-semibold animate-pulse bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                                Processing...
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted font-normal truncate mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

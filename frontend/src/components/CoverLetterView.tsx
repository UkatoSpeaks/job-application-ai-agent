'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Mail,
  Sliders,
  FileText,
  Send,
  Zap,
  RotateCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JobAgentResponse } from '@/types';

interface CoverLetterViewProps {
  data?: JobAgentResponse | null;
  onStartNewApplication?: () => void;
  onBackToDashboard?: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  data,
  onStartNewApplication,
  onBackToDashboard,
}) => {
  const [docType, setDocType] = useState<'letter' | 'email'>('letter');
  const [tone, setTone] = useState<'Professional' | 'Confident' | 'Concise'>('Confident');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Detailed'>('Medium');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Job Context Info
  const jobTitle = data?.job?.title || 'Senior Developer';
  const company = data?.job?.company || 'HCLTech';
  const location = data?.job?.location || 'Bengaluru, India';
  const candidateName = 'Anurag Chaudhary';

  // Sample Generated Cover Letter Content
  const letterBodyText = `Dear Hiring Team,

I am writing to express my enthusiastic interest in the Senior Developer position at HCLTech. With over four years of hands-on experience building scalable web applications, robust REST APIs, and microservices in Python, FastAPI, and React, I am confident in my ability to immediately contribute to your engineering team in Bengaluru.

In my recent projects, I have led backend architecture improvements using FastAPI and Docker, optimizing API throughput and streamlining containerized deployment workflows. My technical toolkit includes Python, RESTful microservices, Docker, SQL database tuning, and AI integrations with LangChain.

What excites me about HCLTech is your commitment to delivering high-availability software solutions at global scale. I thrive in agile engineering environments where clean code, system performance, and cross-functional collaboration are prioritized.

I would welcome the opportunity to discuss how my technical experience and problem-solving mindset align with your goals for this role. Thank you for your time and consideration.

Best regards,
${candidateName}`;

  const emailSubject = `Application for ${jobTitle} — ${candidateName}`;
  const emailRecipient = `Hiring Team (${company})`;

  const emailBodyText = `Dear Hiring Team,

I am applying for the Senior Developer role at HCLTech. 

I bring 4+ years of experience building high-performance web applications, scalable REST APIs, and microservices using Python, FastAPI, Docker, and React. In my recent work, I've engineered containerized services handling 50k+ daily requests and integrated LLM workflows with LangChain.

I've attached my tailored resume and would love the chance to discuss how my background fits your team's goals.

Best regards,
${candidateName}
Phone: +91 98765 43210
LinkedIn: linkedin.com/in/anurag`;

  // Regenerate handler
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 600);
  };

  // Copy handler
  const handleCopy = () => {
    const textToCopy = docType === 'letter' ? letterBodyText : `Subject: ${emailSubject}\nTo: ${emailRecipient}\n\n${emailBodyText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download PDF / Print handler
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </Link>
            )}

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
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Validation Passed</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <span>Step 5 of 5 • Final Application</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Cover Letter
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              {jobTitle} · <span className="font-semibold text-slate-800">{company}</span> ({location})
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300 text-xs font-semibold">
              <button
                onClick={() => setDocType('letter')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  docType === 'letter'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cover Letter
              </button>
              <button
                onClick={() => setDocType('email')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  docType === 'email'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Email Version
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{docType === 'email' ? 'Copy Email' : 'Copy'}</span>
                </>
              )}
            </button>

            {/* Download Primary Button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Two-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cover Letter / Email Document Sheet */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-lg shadow-slate-200/50 min-h-[680px] font-sans relative">
              {docType === 'letter' ? (
                /* Standard Formal Cover Letter View */
                <div className="space-y-6 max-w-2xl mx-auto text-slate-800 text-[15px] leading-[1.6]">
                  {/* Sender Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">{candidateName}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Bengaluru, India • anurag@example.com • +91 98765 43210
                    </p>
                    <p className="text-xs text-slate-400 mt-2">August 15, 2026</p>
                  </div>

                  {/* Recipient */}
                  <div className="text-xs text-slate-600 space-y-0.5 font-medium">
                    <p className="font-bold text-slate-900">Hiring Team</p>
                    <p>{company}</p>
                    <p>{location}</p>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="space-y-4 whitespace-pre-line font-normal text-slate-800">
                    {letterBodyText}
                  </div>
                </div>
              ) : (
                /* Email Version View */
                <div className="space-y-5 max-w-2xl mx-auto">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <span className="text-slate-400 w-16 uppercase">Subject:</span>
                      <span className="font-bold text-slate-900">{emailSubject}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 border-t border-slate-200/80 pt-2">
                      <span className="text-slate-400 w-16 uppercase">To:</span>
                      <span className="text-purple-700 font-bold">{emailRecipient}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white font-sans text-[15px] leading-[1.6] text-slate-800 whitespace-pre-line">
                    {emailBodyText}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Summary, Transparency & Regenerate Controls */}
          <div className="lg:col-span-4 space-y-5">
            {/* AI Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Summary</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-700 font-medium">
                <p className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  Generated from:
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your authentic resume</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Target job requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Relevant technical experience</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Why This Letter? (Transparency) */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Zap className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Why this letter?</h3>
              </div>

              <div className="space-y-3">
                {/* Profile matches */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Based on your profile
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'FastAPI', 'Docker', 'REST APIs'].map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Role requirements */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Matched with the role
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Backend development', 'API development', 'Distributed systems'].map((req) => (
                      <span
                        key={req}
                        className="text-[11px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md"
                      >
                        ✓ {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Safety Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 mt-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AI Safety Assurance</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  This letter does not claim experience that wasn't found in your resume.
                </p>
              </div>
            </motion.div>

            {/* Regenerate Controls Card */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Customization</h3>
              </div>

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Writing Tone
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  {(['Professional', 'Confident', 'Concise'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        tone === t
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Length
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  {(['Short', 'Medium', 'Detailed'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        length === l
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-purple-600' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Completion CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-xl"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your application is ready.</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-emerald-400 pt-1">
              <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Job analyzed
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Resume tailored
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Cover letter generated
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onStartNewApplication ? (
              <button
                onClick={onStartNewApplication}
                className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start New Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/analyze"
                className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start New Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
              >
                ← Back to Analysis
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
              >
                ← Back to Analysis
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

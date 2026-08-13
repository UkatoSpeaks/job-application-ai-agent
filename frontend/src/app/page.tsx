'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { JobAgentTab } from '@/components/tabs/JobAgentTab';
import { ResumeAnalyzerTab } from '@/components/tabs/ResumeAnalyzerTab';
import { JobMatcherTab } from '@/components/tabs/JobMatcherTab';
import { ResumeTailorTab } from '@/components/tabs/ResumeTailorTab';
import { CoverLetterTab } from '@/components/tabs/CoverLetterTab';
import { ActiveTab } from '@/types';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Star, 
  CheckCircle2, 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  BarChart3, 
  Bookmark, 
  Settings, 
  Plus, 
  Link as LinkIcon, 
  FileUp, 
  Zap, 
  ShieldCheck, 
  Building2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('job-agent');
  const [showToolSection, setShowToolSection] = useState(false);

  const handleOpenTool = (tabName: ActiveTab = 'job-agent') => {
    setActiveTab(tabName);
    setShowToolSection(true);
    const element = document.getElementById('ai-agent-tools');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-hero-dots text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenApp={() => setShowToolSection(true)} />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 space-y-16">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          
          {/* Left Column: Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI-Powered Job Application Assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-bold text-slate-900 tracking-tight leading-[1.1]">
              Your AI Co-Pilot for Smarter Job{' '}
              <span className="text-emerald-500 underline decoration-emerald-200 decoration-wavy">Applications</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Analyze any job posting, match it with your resume, identify skill gaps, tailor your resume, and generate a personalized cover letter — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleOpenTool('job-agent')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-xl flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <span>Analyze a Job Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all duration-200 flex items-center space-x-2 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/80">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar 1" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar 2" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar 3" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Avatar 4" />
              </div>
              <div className="text-xs font-semibold text-slate-600 flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900">4.9/5</span>
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="text-slate-500 font-normal">Trusted by 10,000+ job seekers</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Dashboard Mockup Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
              {/* Top Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Joblist App</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleOpenTool()} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Analysis</span>
                  </button>
                  <img className="w-7 h-7 rounded-full border border-slate-200 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User Alex" />
                </div>
              </div>

              {/* Inner Dashboard Layout */}
              <div className="grid grid-cols-12 gap-4">
                {/* Left Mini Sidebar */}
                <div className="col-span-4 space-y-1 pr-2 border-r border-slate-100 hidden sm:block">
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Overview</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer" onClick={() => handleOpenTool('job-agent')}>
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Applications</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer" onClick={() => handleOpenTool('resume-analyzer')}>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer" onClick={() => handleOpenTool('cover-letter')}>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Cover Letters</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer" onClick={() => handleOpenTool('job-matcher')}>
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Skill Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved Jobs</span>
                  </div>
                  <div className="pt-6">
                    <div className="flex items-center space-x-2 p-2 rounded-xl text-slate-400 hover:bg-slate-50 text-xs font-medium cursor-pointer">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                {/* Right Dashboard Metrics */}
                <div className="col-span-12 sm:col-span-8 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dashboard</h4>
                    <p className="text-xs text-slate-500">Welcome back, Alex 👋</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* Gauge Card */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                          <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="5" fill="none" strokeDasharray="138" strokeDashoffset="20" strokeLinecap="round" />
                        </svg>
                        <span className="absolute font-black text-xs text-slate-900">85%</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 mt-1">Great Match</span>
                      <span className="text-[9px] text-slate-400">Keep applying!</span>
                    </div>

                    {/* Applications Card */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Applications</span>
                      <span className="text-xl font-black text-slate-900 mt-1">24</span>
                      <span className="text-[9px] font-bold text-emerald-600">+8 this month</span>
                    </div>

                    {/* Interviews Card */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
                      <span className="text-xl font-black text-slate-900 mt-1">7</span>
                      <span className="text-[9px] font-bold text-emerald-600">+2 this month</span>
                    </div>
                  </div>

                  {/* Recent Analysis Card */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                          f
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Product Designer</h5>
                          <p className="text-[10px] text-slate-400">TechFlow</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        85% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">Remote</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">$70K - $90K</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">Full-time</span>
                      <span className="ml-auto text-slate-400">Applied 2 days ago</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURE HIGHLIGHTS RIBBON BAR */}
        <section id="features" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => handleOpenTool('job-matcher')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">AI-Powered Matching</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Get accurate match scores based on skills, experience & keywords.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => handleOpenTool('resume-tailor')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Resume Tailoring</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI tailors your resume to highlight what matters for each role.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => handleOpenTool('cover-letter')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Cover Letter Generation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate personalized cover letters that stand out.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => handleOpenTool('resume-analyzer')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Skill Gap Analysis</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Identify missing skills and get recommendations to improve.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-8 text-center space-y-10">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From job posting to application in minutes
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              A simple 3-step process to create job-winning applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOpenTool('job-agent')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-center relative cursor-pointer"
            >
              <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">01</span>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <LinkIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Paste Job URL</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste any public job posting URL from any company's career page.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOpenTool('resume-analyzer')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-center relative cursor-pointer"
            >
              <span className="text-xs font-black text-purple-600 tracking-widest uppercase">02</span>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto">
                <FileUp className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload Your Resume</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload your resume in PDF format and let AI analyze it.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOpenTool('job-agent')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-center relative cursor-pointer"
            >
              <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">03</span>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Get Your Application</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive tailored resume, cover letter, and match insights instantly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TRUSTED COMPANIES LOGO CLOUD */}
        <section className="py-6 border-t border-slate-200 text-center space-y-6">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
            TRUSTED BY JOB SEEKERS FROM TOP COMPANIES
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-bold text-slate-700 tracking-tight">Google</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight">Microsoft</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight">amazon</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight">∞ Meta</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight"> Apple</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight">stripe</span>
            <span className="text-lg font-bold text-slate-700 tracking-tight">Spotify</span>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE TOOL SECTION */}
        <section id="ai-agent-tools" className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live FastAPI Engine</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                AI Application Workspace
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Select a tab below or click any feature button above to process your application.
            </p>
          </div>

          {/* Interactive Feature Viewport */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'job-agent' && <JobAgentTab />}
              {activeTab === 'resume-analyzer' && <ResumeAnalyzerTab />}
              {activeTab === 'job-matcher' && <JobMatcherTab />}
              {activeTab === 'resume-tailor' && <ResumeTailorTab />}
              {activeTab === 'cover-letter' && <CoverLetterTab />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-900">Joblist AI Agent</span>
          </div>
          <p>© 2026 Joblist AI Agent Engine. Built with Next.js, Framer Motion & FastAPI.</p>
          <div className="flex items-center space-x-4 text-slate-600 font-semibold">
            <a href="#how-it-works" className="hover:text-emerald-600">Privacy Policy</a>
            <span>•</span>
            <a href="#how-it-works" className="hover:text-emerald-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

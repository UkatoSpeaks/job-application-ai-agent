'use client';

import React, { useState } from 'react';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';

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
  ShieldCheck,
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
  Search,
  Target,
  PenTool,
  Mail,
  Shield,
  Lock,
  Eye,
  CheckCircle2,
  Bot,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('job-agent');
  const [showToolSection, setShowToolSection] = useState(false);

  const handleOpenTool = (tabName: ActiveTab = 'job-agent') => {
    setActiveTab(tabName);
    setShowToolSection(true);
    setTimeout(() => {
      const element = document.getElementById('ai-agent-tools');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-lime-400 selection:text-[#0B0B0F]">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenApp={() => setShowToolSection(true)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-dots pointer-events-none opacity-60"></div>
        <div className="absolute top-16 right-[8%] w-20 h-20 rounded-lg bg-lime-400 border-[3px] border-line rotate-12 hidden md:block pointer-events-none"></div>
        <div className="absolute bottom-10 left-[6%] w-14 h-14 rounded-full bg-purple-500 border-[3px] border-line hidden md:block pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-8">
          {/* Hero Copy — centered */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-lime-400 border-2 border-line text-[#0B0B0F] text-xs font-bold shadow-brutal-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Job Application Assistant</span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[68px] font-bold text-ink tracking-[-0.03em] leading-[1.05]">
              Turn every job posting into a{' '}
              <span className="relative inline-block">
                <span className="relative z-10">stronger application</span>
                <span className="absolute left-0 right-0 bottom-1 h-4 bg-purple-400/70 -z-0 -rotate-1"></span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted font-medium leading-relaxed max-w-xl mx-auto">
              Paste a job URL, upload your resume, and let AI analyze, match, tailor, and generate everything you need to land the interview.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/analyze"
                className="brutal-btn bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 text-[15px] flex items-center space-x-2"
              >
                <span>Analyze a Job</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="brutal-btn bg-surface text-ink font-bold px-6 py-3.5 text-[15px] flex items-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Value Proposition */}
            <div className="flex items-center justify-center space-x-2 pt-4 text-xs text-muted font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>No credit card required &middot; Your data is never used to train models</span>
            </div>
          </motion.div>

          {/* Product Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="bg-surface border-[2.5px] border-line rounded-xl p-5 shadow-brutal-lg relative overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center justify-between border-b-2 border-line-soft pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 border border-line"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-line"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border border-line"></span>
                  </div>
                    <ApplyAiLogo size="xs" withText textClassName="font-bold text-ink text-sm" />

                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleOpenTool()} className="brutal-btn bg-lime-400 text-[#0B0B0F] text-xs font-bold px-3 py-1.5 flex items-center space-x-1 shadow-brutal-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Analysis</span>
                  </button>
                  <div className="w-7 h-7 rounded-md border-2 border-line bg-purple-400 flex items-center justify-center text-xs font-bold">A</div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-12 gap-4">
                {/* Left Mini Sidebar */}
                <div className="col-span-3 space-y-1 pr-3 border-r-2 border-line-soft hidden md:block">
                  <div className="flex items-center space-x-2 p-2 rounded-md bg-emerald-500 text-white font-bold text-xs border-2 border-line">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </div>
                  {[
                    { icon: FileText, label: 'My Applications' },
                    { icon: UserCheck, label: 'Resume' },
                    { icon: FileText, label: 'Cover Letters' },
                    { icon: BarChart3, label: 'Skill Analysis' },
                    { icon: Bookmark, label: 'Saved Jobs' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-2 p-2 rounded-md text-muted hover:bg-surface-2 text-xs font-bold cursor-pointer transition-colors">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                  <div className="pt-6">
                    <div className="flex items-center space-x-2 p-2 rounded-md text-muted-2 hover:bg-surface-2 text-xs font-bold cursor-pointer">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                {/* Right Dashboard */}
                <div className="col-span-12 md:col-span-9 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-ink font-heading">Dashboard</h4>
                    <p className="text-xs text-muted">Welcome back, Alex 👋</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-surface-2 border-2 border-line flex flex-col items-center justify-center">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="22" stroke="var(--color-line-soft)" strokeWidth="5" fill="none" />
                          <circle cx="28" cy="28" r="22" stroke="var(--color-emerald-500)" strokeWidth="5" fill="none" strokeDasharray="138" strokeDashoffset="20" strokeLinecap="round" />
                        </svg>
                        <span className="absolute font-bold text-xs text-ink">85%</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 mt-1">Great Match</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border-2 border-line flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-2 uppercase">Applications</span>
                      <span className="text-xl font-bold text-ink mt-1">24</span>
                      <span className="text-[9px] font-bold text-emerald-500">+8 this month</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border-2 border-line flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-2 uppercase">Interviews</span>
                      <span className="text-xl font-bold text-ink mt-1">7</span>
                      <span className="text-[9px] font-bold text-emerald-500">+2 this month</span>
                    </div>
                  </div>

                  {/* Recent Job Card */}
                  <div className="p-3.5 rounded-lg border-2 border-line bg-surface space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-md border-2 border-line bg-blue-500 flex items-center justify-center text-white font-bold text-xs">f</div>
                        <div>
                          <h5 className="text-xs font-bold text-ink">Product Designer</h5>
                          <p className="text-[10px] text-muted-2">TechFlow</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md border-2 border-line">85% Match</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold">
                      <span className="bg-surface-2 px-2 py-0.5 rounded border border-line-soft">Remote</span>
                      <span className="bg-surface-2 px-2 py-0.5 rounded border border-line-soft">$70K - $90K</span>
                      <span className="bg-surface-2 px-2 py-0.5 rounded border border-line-soft">Full-time</span>
                      <span className="ml-auto text-muted-2">Applied 2 days ago</span>
                    </div>
                    <div className="w-full bg-surface-2 rounded-full h-1.5 border border-line-soft">
                      <div className="bg-emerald-500 h-1 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ WHY APPLYAI? ═══════════════ */}
      <section id="features" className="py-20 bg-surface border-y-[2.5px] border-line">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-4 mb-14"
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-surface-2 border-2 border-line text-ink text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Why ApplyAI?</span>
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-ink tracking-[-0.02em] leading-tight">
              Everything you need to apply smarter
            </h2>
            <p className="text-muted text-[15px] max-w-lg mx-auto leading-relaxed font-medium">
              Four AI-powered tools that work together to turn any job posting into a winning application package.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Search,
                title: 'Job Analysis',
                description: 'Instantly extract requirements, skills, and key details from any job posting URL.',
                color: 'emerald',
                tab: 'job-agent' as ActiveTab,
              },
              {
                icon: Target,
                title: 'Resume Match',
                description: 'Get an accurate match score comparing your skills and experience against the role.',
                color: 'blue',
                tab: 'job-matcher' as ActiveTab,
              },
              {
                icon: PenTool,
                title: 'AI Tailor',
                description: 'Automatically rewrite your resume to highlight the most relevant experience.',
                color: 'purple',
                tab: 'resume-tailor' as ActiveTab,
              },
              {
                icon: Mail,
                title: 'Cover Letter',
                description: 'Generate a personalized, role-specific cover letter that complements your resume.',
                color: 'amber',
                tab: 'cover-letter' as ActiveTab,
              },
            ].map((feature, i) => {
              const colorMap: Record<string, { bg: string; icon: string }> = {
                emerald: { bg: 'bg-emerald-500', icon: 'text-white' },
                blue: { bg: 'bg-blue-500', icon: 'text-white' },
                purple: { bg: 'bg-purple-500', icon: 'text-white' },
                amber: { bg: 'bg-amber-400', icon: 'text-[#0B0B0F]' },
              };
              const c = colorMap[feature.color];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4, x: -4 }}
                  onClick={() => handleOpenTool(feature.tab)}
                  className="group p-6 rounded-xl bg-canvas border-[2.5px] border-line shadow-brutal-sm hover:shadow-brutal-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-lg ${c.bg} border-2 border-line flex items-center justify-center ${c.icon} mb-4`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-ink mb-1.5 font-heading">{feature.title}</h4>
                  <p className="text-[13px] text-muted leading-relaxed font-medium">{feature.description}</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-ink">
                    <span>Try it</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots pointer-events-none opacity-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-4 mb-14"
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-emerald-500 border-2 border-line text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-heading font-bold text-ink tracking-tight leading-tight">
              Three steps to your perfect application
            </h2>
            <p className="text-muted text-[15px] max-w-lg mx-auto leading-relaxed font-medium">
              Our AI pipeline handles everything — from parsing the job post to delivering a complete, tailored application package.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[72px] left-[16%] right-[16%] h-[3px] bg-line"></div>

            {[
              { step: '01', icon: FileUp, title: 'Upload Your Resume', desc: 'Upload your resume in PDF. Our AI parses your experience, skills, and achievements instantly.', color: 'bg-emerald-500', tab: 'resume-analyzer' as ActiveTab },
              { step: '02', icon: LinkIcon, title: 'Paste the Job URL', desc: 'Drop any public job posting URL. We extract the title, requirements, and key qualifications.', color: 'bg-purple-500', tab: 'job-agent' as ActiveTab },
              { step: '03', icon: Sparkles, title: 'Get Your Application', desc: 'Receive a tailored resume, personalized cover letter, match score, and actionable insights.', color: 'bg-blue-500', tab: 'job-agent' as ActiveTab },
            ].map((item, i) => {
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -4, x: -4, transition: { duration: 0.15 } }}
                  onClick={() => handleOpenTool(item.tab)}
                  className="relative p-7 rounded-xl bg-surface border-[2.5px] border-line shadow-brutal-sm hover:shadow-brutal-md space-y-5 text-center cursor-pointer transition-shadow duration-200 group"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`w-[60px] h-[60px] rounded-xl ${item.color} border-2 border-line flex items-center justify-center`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-lime-400 border-2 border-line text-xs font-bold flex items-center justify-center text-[#0B0B0F]">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-ink font-heading">{item.title}</h3>
                    <p className="text-[13px] text-muted leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  <div className="flex justify-center pt-1">
                    <span className="inline-flex items-center text-xs font-bold text-ink transition-colors">
                      {i === 0 ? 'Upload now' : i === 1 ? 'Try it' : 'See results'}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ KNOW YOUR MATCH ═══════════════ */}
      <section className="py-20 bg-surface border-y-[2.5px] border-line">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-blue-500 border-2 border-line text-white text-xs font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>Know Your Match</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink tracking-tight leading-tight">
                See exactly where you{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">stand</span>
                  <span className="absolute left-0 right-0 bottom-1 h-3 bg-blue-300 -z-0 -rotate-1"></span>
                </span>
              </h2>
              <p className="text-muted text-[15px] leading-relaxed max-w-md font-medium">
                Our AI compares your resume against the job description and surfaces a detailed match breakdown — skills you have, skills you&apos;re missing, and what to add.
              </p>
              <ul className="space-y-3">
                {[
                  'Skill-by-skill comparison with the job requirements',
                  'Keyword gap analysis for ATS optimization',
                  'Actionable recommendations to improve your score',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('job-matcher')}
                className="inline-flex items-center space-x-2 text-sm font-bold text-ink hover:text-blue-600 transition-colors group"
              >
                <span>Analyze your match</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Right — Match Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-canvas border-[2.5px] border-line rounded-xl p-6 shadow-brutal-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-md border-2 border-line bg-blue-500 flex items-center justify-center text-white text-xs font-bold">N</div>
                    <div>
                      <h5 className="text-sm font-bold text-ink">Senior Frontend Engineer</h5>
                      <p className="text-[11px] text-muted-2">Nimbus Cloud · Mountain View, CA</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-2">Just now</span>
                </div>

                {/* Big Score Circle */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="var(--color-line-soft)" strokeWidth="10" fill="none" />
                      <circle cx="64" cy="64" r="54" stroke="var(--color-blue-500)" strokeWidth="10" fill="none" strokeDasharray="339" strokeDashoffset="143" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold text-ink">58%</span>
                      <span className="text-[10px] font-bold text-muted-2 uppercase tracking-wide">Match</span>
                    </div>
                  </div>
                </div>

                {/* Skill Breakdown */}
                <div className="space-y-3">
                  {[
                    { skill: 'React / Next.js', score: 95, color: 'bg-emerald-500' },
                    { skill: 'TypeScript', score: 88, color: 'bg-emerald-500' },
                    { skill: 'System Design', score: 45, color: 'bg-amber-500' },
                    { skill: 'GraphQL', score: 30, color: 'bg-red-500' },
                    { skill: 'CI/CD Pipelines', score: 20, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-ink w-28 shrink-0 text-right">{item.skill}</span>
                      <div className="flex-1 bg-surface-2 rounded-full h-2 border border-line-soft">
                        <div className={`${item.color} h-1.5 my-px ml-px rounded-full transition-all duration-700`} style={{ width: `${item.score}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-ink w-10">{item.score}%</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-5 pt-4 border-t-2 border-line-soft">
                  <p className="text-[10px] font-bold text-muted-2 uppercase tracking-wider mb-2">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GraphQL', 'CI/CD', 'System Design', 'Kubernetes', 'gRPC'].map((tag) => (
                      <span key={tag} className="text-[11px] font-bold text-red-600 bg-red-100 border-2 border-line px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TAILORED RESUME ═══════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-purple-500 border-2 border-line text-white text-xs font-bold uppercase tracking-wider">
                <PenTool className="w-3.5 h-3.5" />
                <span>AI Resume Tailoring</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink tracking-tight leading-tight">
                Your resume, rewritten for{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">every role</span>
                  <span className="absolute left-0 right-0 bottom-1 h-3 bg-purple-300 -z-0 -rotate-1"></span>
                </span>
              </h2>
              <p className="text-muted text-[15px] leading-relaxed max-w-md font-medium">
                Our AI restructures your resume to emphasize the skills, experiences, and keywords that matter most for the specific job — without fabricating anything.
              </p>
              <ul className="space-y-3">
                {[
                  'Highlights relevant experience for the target role',
                  'Injects missing ATS keywords naturally',
                  'Preserves your authentic voice and real experience',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('resume-tailor')}
                className="inline-flex items-center space-x-2 text-sm font-bold text-ink hover:text-purple-600 transition-colors group"
              >
                <span>Tailor your resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Right — Resume Preview Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-surface border-[2.5px] border-line rounded-xl p-6 shadow-brutal-lg space-y-5">
                {/* Resume Header */}
                <div className="border-b-2 border-line-soft pb-4">
                  <h4 className="text-lg font-bold text-ink font-heading">Alex Johnson</h4>
                  <p className="text-xs text-muted mt-0.5">Senior Frontend Engineer • San Francisco, CA</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold border-2 border-line">Tailored for: Nimbus Cloud</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold border-2 border-line">+12 keywords added</span>
                  </div>
                </div>

                {/* Summary Section */}
                <div>
                  <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Summary</h5>
                  <p className="text-xs text-muted leading-relaxed">
                    Results-driven frontend engineer with <span className="text-purple-700 font-bold bg-purple-100 px-1 rounded">6+ years</span> building scalable web applications using{' '}
                    <span className="text-purple-700 font-bold bg-purple-100 px-1 rounded">React, Next.js, and TypeScript</span>. Proven track record of improving performance and leading cross-functional teams.
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Skills</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS', 'CI/CD', 'System Design'].map((skill, i) => (
                      <span key={skill} className={`text-[11px] font-bold px-2 py-0.5 rounded-md border-2 ${i >= 4 ? 'text-purple-700 bg-purple-100 border-line' : 'text-ink bg-surface-2 border-line-soft'}`}>
                        {skill}
                        {i >= 4 && <span className="ml-1 text-[9px]">✨</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Snippet */}
                <div>
                  <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Experience</h5>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-muted leading-relaxed">
                        Led migration to <span className="text-purple-700 font-bold bg-purple-100 px-1 rounded">Next.js 14</span> reducing page load time by 40% and improving Core Web Vitals.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-2 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-muted leading-relaxed">
                        Built component library serving 3 product teams, improving UI consistency and reducing development time by 25%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PERSONALIZED COVER LETTER ═══════════════ */}
      <section className="py-20 bg-surface border-y-[2.5px] border-line">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Cover Letter Preview Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-canvas border-[2.5px] border-line rounded-xl p-6 shadow-brutal-lg space-y-4">
                {/* Letter Header */}
                <div className="flex items-center justify-between border-b-2 border-line-soft pb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-ink">Cover Letter</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold border-2 border-line">AI Generated</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold border-2 border-line">Role-Specific</span>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="space-y-3 text-xs text-muted leading-relaxed">
                  <p>Dear Hiring Manager,</p>
                  <p>
                    I&apos;m writing to express my strong interest in the{' '}
                    <span className="text-amber-700 font-bold bg-amber-100 px-1 rounded">Senior Frontend Engineer</span>{' '}
                    position at <span className="text-amber-700 font-bold bg-amber-100 px-1 rounded">Nimbus Cloud</span>. With over six years of experience building production-grade applications with React and TypeScript, I&apos;m excited by the opportunity to contribute to your team.
                  </p>
                  <p>
                    In my current role at TechCorp, I led the migration of our flagship product to{' '}
                    <span className="text-amber-700 font-bold bg-amber-100 px-1 rounded">Next.js</span>, resulting in a{' '}
                    <span className="text-emerald-600 font-bold">40% improvement</span> in page load performance and significantly improved Core Web Vitals scores. I&apos;ve also architected and maintained a shared component library that serves multiple product teams.
                  </p>
                  <p>
                    I&apos;m particularly drawn to Nimbus Cloud&apos;s commitment to building user-first experiences at scale, and I believe my track record of shipping performant, accessible frontends aligns well with your team&apos;s mission.
                  </p>
                  <p className="text-muted">
                    I&apos;d love the opportunity to discuss how my experience can contribute to your team&apos;s goals.
                  </p>
                  <p className="font-bold text-ink">
                    Best regards,<br />
                    Alex Johnson
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right — Copy */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6 order-1 lg:order-2"
            >
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-amber-400 border-2 border-line text-[#0B0B0F] text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Cover Letter Generation</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink tracking-tight leading-tight">
                A cover letter that{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">actually gets read</span>
                  <span className="absolute left-0 right-0 bottom-1 h-3 bg-amber-300 -z-0 -rotate-1"></span>
                </span>
              </h2>
              <p className="text-muted text-[15px] leading-relaxed max-w-md font-medium">
                No more generic templates. Our AI crafts a personalized cover letter that references the specific role, company, and your most relevant experience.
              </p>
              <ul className="space-y-3">
                {[
                  'Tailored to the exact job description and company',
                  'References your real skills and achievements',
                  'Professional tone with a personal touch',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('cover-letter')}
                className="inline-flex items-center space-x-2 text-sm font-bold text-ink hover:text-amber-600 transition-colors group"
              >
                <span>Generate your cover letter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RESPONSIBLE AI ═══════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots pointer-events-none opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-emerald-500 border-2 border-line text-white text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Responsible AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-heading font-bold text-ink tracking-tight leading-tight">
              We don&apos;t invent. We highlight what you{' '}
              <span className="relative inline-block">
                <span className="relative z-10">genuinely know.</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-lime-400 -z-0 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-muted text-[15px] sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Our AI works exclusively with information from your real resume and the actual job description. No hallucinated skills, no fabricated experiences — just your authentic qualifications, presented in the best light.
            </p>
          </motion.div>

          {/* Trust pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12"
          >
            {[
              { icon: Shield, title: 'No Fabrication', desc: 'Every claim in your tailored resume comes directly from your original document.' },
              { icon: Lock, title: 'Privacy First', desc: 'Your data is never stored, shared, or used for training. Full control, always.' },
              { icon: Eye, title: 'Full Transparency', desc: 'See exactly what was changed, what keywords were added, and why.' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-surface border-[2.5px] border-line shadow-brutal-sm hover:shadow-brutal-md transition-shadow text-center space-y-3">
                <div className="w-10 h-10 rounded-lg bg-lime-400 border-2 border-line flex items-center justify-center text-[#0B0B0F] mx-auto">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-ink font-heading">{item.title}</h4>
                <p className="text-[13px] text-muted leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-20 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-dots pointer-events-none opacity-10"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-md bg-lime-400 text-[#0B0B0F] text-xs font-bold border-2 border-canvas">
              <Bot className="w-3.5 h-3.5" />
              <span>Ready to get started?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-bold text-canvas tracking-tight leading-tight">
              Build your next application<br />
              <span className="text-lime-400">in minutes, not hours</span>
            </h2>
            <p className="text-muted-2 text-[15px] leading-relaxed max-w-lg mx-auto font-medium">
              Analyze a job posting, get a tailored resume and cover letter, and see exactly where you stand — no credit card, no signup required to try it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/analyze"
                className="inline-flex items-center space-x-2 bg-lime-400 hover:bg-lime-300 text-[#0B0B0F] font-bold px-8 py-4 rounded-lg text-[15px] border-2 border-canvas shadow-[4px_4px_0_0_var(--color-emerald-500)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-150"
              >
                <span>Analyze a Job Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleOpenTool('resume-analyzer')}
                className="bg-transparent hover:bg-canvas/10 text-canvas border-2 border-canvas font-bold px-6 py-4 rounded-lg text-[15px] transition-all duration-150 flex items-center space-x-2"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload Your Resume</span>
              </button>
            </div>

            {/* Trust note */}
            <div className="flex items-center justify-center space-x-2 pt-4 text-xs text-muted-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>We never fabricate skills or experience you don&apos;t have</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ AI WORKSPACE (Hidden until CTA clicked) ═══════════════ */}
      {showToolSection && (
        <section id="ai-agent-tools" className="py-12 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-emerald-500 border-2 border-line text-white text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Live AI Engine</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-ink tracking-tight mt-1">
                  AI Application Workspace
                </h2>
              </div>

              {/* Tool Tabs */}
              <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border-2 border-line overflow-x-auto">
                {[
                  { id: 'job-agent' as ActiveTab, label: 'AI Agent', icon: Bot },
                  { id: 'resume-analyzer' as ActiveTab, label: 'Resume', icon: FileUp },
                  { id: 'job-matcher' as ActiveTab, label: 'Match', icon: Target },
                  { id: 'resume-tailor' as ActiveTab, label: 'Tailor', icon: PenTool },
                  { id: 'cover-letter' as ActiveTab, label: 'Cover Letter', icon: Mail },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-[13px] font-bold transition-all duration-150 whitespace-nowrap ${
                        isActive
                          ? 'text-white bg-emerald-500 border-2 border-line'
                          : 'text-muted hover:text-ink hover:bg-surface-2'
                      }`}
                    >
                      <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-muted-2'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tool */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="dark"
              >
                {activeTab === 'job-agent' && <JobAgentTab />}
                {activeTab === 'resume-analyzer' && <ResumeAnalyzerTab />}
                {activeTab === 'job-matcher' && <JobMatcherTab />}
                {activeTab === 'resume-tailor' && <ResumeTailorTab />}
                {activeTab === 'cover-letter' && <CoverLetterTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t-[2.5px] border-line bg-surface py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-md border-2 border-line bg-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold font-heading text-ink flex items-center">
                ApplyAI
                <span className="relative -top-0.5 ml-0.5 w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"></span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center space-x-6 text-[13px] font-bold text-muted">
              <a href="#features" className="hover:text-ink transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-ink transition-colors">How it Works</a>
            </nav>

            {/* Copyright */}
            <p className="text-[13px] text-muted-2 font-medium">
              © 2026 ApplyAI. Built with Next.js & FastAPI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

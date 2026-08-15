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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenApp={() => setShowToolSection(true)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-hero-dots pointer-events-none"></div>
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-teal-200/15 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-8">
          {/* Hero Copy — centered */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI-Powered Job Application Assistant</span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[68px] font-extrabold text-slate-900 tracking-[-0.04em] leading-[1.08]">
              Turn every job posting into a{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">stronger application</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-xl mx-auto">
              Paste a job URL, upload your resume, and let AI analyze, match, tailor, and generate everything you need to land the interview.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/analyze"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <span>Analyze a Job</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium px-6 py-3.5 rounded-xl text-[15px] transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-slate-500 fill-slate-500" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-3 pt-4">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" />
              </div>
              <div className="text-xs text-slate-600 font-medium flex items-center space-x-1.5">
                <span className="font-bold text-slate-900">4.9/5</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-slate-400 font-normal">Trusted by 10,000+ job seekers</span>
              </div>
            </div>
          </motion.div>

          {/* Product Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xl shadow-slate-300/30 relative overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="ml-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Joblist App</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleOpenTool()} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Analysis</span>
                  </button>
                  <img className="w-7 h-7 rounded-full border border-slate-200 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-12 gap-4">
                {/* Left Mini Sidebar */}
                <div className="col-span-3 space-y-1 pr-3 border-r border-slate-100 hidden md:block">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Overview</span>
                  </div>
                  {[
                    { icon: FileText, label: 'My Applications' },
                    { icon: UserCheck, label: 'Resume' },
                    { icon: FileText, label: 'Cover Letters' },
                    { icon: BarChart3, label: 'Skill Analysis' },
                    { icon: Bookmark, label: 'Saved Jobs' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-2 p-2 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-medium cursor-pointer transition-colors">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                  <div className="pt-6">
                    <div className="flex items-center space-x-2 p-2 rounded-lg text-slate-400 hover:bg-slate-50 text-xs font-medium cursor-pointer">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                {/* Right Dashboard */}
                <div className="col-span-12 md:col-span-9 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dashboard</h4>
                    <p className="text-xs text-slate-500">Welcome back, Alex 👋</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                          <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="5" fill="none" strokeDasharray="138" strokeDashoffset="20" strokeLinecap="round" />
                        </svg>
                        <span className="absolute font-bold text-xs text-slate-900">85%</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 mt-1">Great Match</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Applications</span>
                      <span className="text-xl font-bold text-slate-900 mt-1">24</span>
                      <span className="text-[9px] font-semibold text-emerald-600">+8 this month</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
                      <span className="text-xl font-bold text-slate-900 mt-1">7</span>
                      <span className="text-[9px] font-semibold text-emerald-600">+2 this month</span>
                    </div>
                  </div>

                  {/* Recent Job Card */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">f</div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Product Designer</h5>
                          <p className="text-[10px] text-slate-400">TechFlow</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">85% Match</span>
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
        </div>
      </section>

      {/* ═══════════════ WHY APPLYAI? ═══════════════ */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-4 mb-14"
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              <span>Why Joblist?</span>
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-[-0.03em] leading-tight">
              Everything you need to apply smarter
            </h2>
            <p className="text-slate-500 text-[15px] max-w-lg mx-auto leading-relaxed">
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
              const colorMap: Record<string, { bg: string; border: string; icon: string; hoverBorder: string; hoverShadow: string }> = {
                emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100/60' },
                blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-100/60' },
                purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-100/60' },
                amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-amber-100/60' },
              };
              const c = colorMap[feature.color];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleOpenTool(feature.tab)}
                  className={`group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg ${c.hoverBorder} ${c.hoverShadow} transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.icon} mb-4`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{feature.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
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
        {/* BG Blobs */}
        <div className="absolute top-0 left-[20%] w-72 h-72 bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-[20%] w-80 h-80 bg-purple-100/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-4 mb-14"
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>How It Works</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
              Three steps to your perfect application
            </h2>
            <p className="text-slate-500 text-[15px] max-w-lg mx-auto leading-relaxed">
              Our AI pipeline handles everything — from parsing the job post to delivering a complete, tailored application package.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[72px] left-[16%] right-[16%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-emerald-300 via-purple-300 to-teal-300 rounded-full opacity-50"></div>
            </div>

            {[
              { step: '01', icon: FileUp, title: 'Upload Your Resume', desc: 'Upload your resume in PDF. Our AI parses your experience, skills, and achievements instantly.', color: 'emerald', tab: 'resume-analyzer' as ActiveTab },
              { step: '02', icon: LinkIcon, title: 'Paste the Job URL', desc: 'Drop any public job posting URL. We extract the title, requirements, and key qualifications.', color: 'purple', tab: 'job-agent' as ActiveTab },
              { step: '03', icon: Sparkles, title: 'Get Your Application', desc: 'Receive a tailored resume, personalized cover letter, match score, and actionable insights.', color: 'teal', tab: 'job-agent' as ActiveTab },
            ].map((item, i) => {
              const gradients: Record<string, string> = {
                emerald: 'from-emerald-400 to-emerald-600',
                purple: 'from-purple-400 to-purple-600',
                teal: 'from-emerald-400 to-teal-600',
              };
              const borderColors: Record<string, string> = {
                emerald: 'border-emerald-400 text-emerald-600',
                purple: 'border-purple-400 text-purple-600',
                teal: 'border-teal-400 text-teal-600',
              };
              const hoverColors: Record<string, string> = {
                emerald: 'hover:shadow-emerald-100/60 hover:border-emerald-200/80',
                purple: 'hover:shadow-purple-100/60 hover:border-purple-200/80',
                teal: 'hover:shadow-emerald-100/60 hover:border-emerald-200/80',
              };
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => handleOpenTool(item.tab)}
                  className={`relative p-7 rounded-[20px] bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl ${hoverColors[item.color]} space-y-5 text-center cursor-pointer transition-all duration-300 group`}
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`w-[60px] h-[60px] rounded-2xl bg-gradient-to-br ${gradients[item.color]} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 ${borderColors[item.color]} text-xs font-bold flex items-center justify-center shadow-sm`}>
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex justify-center pt-1">
                    <span className={`inline-flex items-center text-xs font-semibold ${borderColors[item.color].split(' ')[1]} transition-colors`}>
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
      <section className="py-20 bg-white border-y border-slate-100">
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
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>Know Your Match</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                See exactly where you{' '}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">stand</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-md">
                Our AI compares your resume against the job description and surfaces a detailed match breakdown — skills you have, skills you're missing, and what to add.
              </p>
              <ul className="space-y-3">
                {[
                  'Skill-by-skill comparison with the job requirements',
                  'Keyword gap analysis for ATS optimization',
                  'Actionable recommendations to improve your score',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('job-matcher')}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">G</div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Senior Frontend Engineer</h5>
                      <p className="text-[11px] text-slate-400">Google · Mountain View, CA</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Just now</span>
                </div>

                {/* Big Score Circle */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                      <circle cx="64" cy="64" r="54" stroke="url(#matchGradient)" strokeWidth="10" fill="none" strokeDasharray="339" strokeDashoffset="143" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold text-slate-900">58%</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Match</span>
                    </div>
                  </div>
                </div>

                {/* Skill Breakdown */}
                <div className="space-y-3">
                  {[
                    { skill: 'React / Next.js', score: 95, color: 'bg-emerald-500' },
                    { skill: 'TypeScript', score: 88, color: 'bg-emerald-500' },
                    { skill: 'System Design', score: 45, color: 'bg-amber-500' },
                    { skill: 'GraphQL', score: 30, color: 'bg-red-400' },
                    { skill: 'CI/CD Pipelines', score: 20, color: 'bg-red-400' },
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-slate-600 w-28 shrink-0 text-right">{item.skill}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${item.score}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-10">{item.score}%</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GraphQL', 'CI/CD', 'System Design', 'Kubernetes', 'gRPC'].map((tag) => (
                      <span key={tag} className="text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">{tag}</span>
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
        <div className="absolute top-10 right-[5%] w-72 h-72 bg-purple-100/25 rounded-full blur-[100px] pointer-events-none"></div>
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
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
                <PenTool className="w-3.5 h-3.5 text-purple-500" />
                <span>AI Resume Tailoring</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Your resume, rewritten for{' '}
                <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">every role</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-md">
                Our AI restructures your resume to emphasize the skills, experiences, and keywords that matter most for the specific job — without fabricating anything.
              </p>
              <ul className="space-y-3">
                {[
                  'Highlights relevant experience for the target role',
                  'Injects missing ATS keywords naturally',
                  'Preserves your authentic voice and real experience',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('resume-tailor')}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/40 space-y-5">
                {/* Resume Header */}
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-lg font-bold text-slate-900">Alex Johnson</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Senior Frontend Engineer • San Francisco, CA</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-semibold border border-purple-200">Tailored for: Google</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">+12 keywords added</span>
                  </div>
                </div>

                {/* Summary Section */}
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Summary</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Results-driven frontend engineer with <span className="text-purple-600 font-semibold bg-purple-50 px-1 rounded">6+ years</span> building scalable web applications using{' '}
                    <span className="text-purple-600 font-semibold bg-purple-50 px-1 rounded">React, Next.js, and TypeScript</span>. Proven track record of improving performance and leading cross-functional teams.
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Skills</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS', 'CI/CD', 'System Design'].map((skill, i) => (
                      <span key={skill} className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${i >= 4 ? 'text-purple-600 bg-purple-50 border border-purple-200' : 'text-slate-600 bg-slate-100 border border-slate-200'}`}>
                        {skill}
                        {i >= 4 && <span className="ml-1 text-[9px]">✨</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Snippet */}
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Experience</h5>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Led migration to <span className="text-purple-600 font-semibold bg-purple-50 px-1 rounded">Next.js 14</span> reducing page load time by 40% and improving Core Web Vitals.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-slate-500 leading-relaxed">
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
      <section className="py-20 bg-white border-y border-slate-100">
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/40 space-y-4">
                {/* Letter Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-slate-900">Cover Letter</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold border border-amber-200">AI Generated</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">Role-Specific</span>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>Dear Hiring Manager,</p>
                  <p>
                    I'm writing to express my strong interest in the{' '}
                    <span className="text-amber-700 font-semibold bg-amber-50 px-1 rounded">Senior Frontend Engineer</span>{' '}
                    position at <span className="text-amber-700 font-semibold bg-amber-50 px-1 rounded">Google</span>. With over six years of experience building production-grade applications with React and TypeScript, I'm excited by the opportunity to contribute to your team.
                  </p>
                  <p>
                    In my current role at TechCorp, I led the migration of our flagship product to{' '}
                    <span className="text-amber-700 font-semibold bg-amber-50 px-1 rounded">Next.js</span>, resulting in a{' '}
                    <span className="text-emerald-600 font-semibold">40% improvement</span> in page load performance and significantly improved Core Web Vitals scores. I've also architected and maintained a shared component library that serves multiple product teams.
                  </p>
                  <p>
                    I'm particularly drawn to Google's commitment to building user-first experiences at scale, and I believe my track record of shipping performant, accessible frontends aligns well with your team's mission.
                  </p>
                  <p className="text-slate-500">
                    I'd love the opportunity to discuss how my experience can contribute to your team's goals.
                  </p>
                  <p className="font-medium text-slate-700">
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
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Cover Letter Generation</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                A cover letter that{' '}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">actually gets read</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-md">
                No more generic templates. Our AI crafts a personalized cover letter that references the specific role, company, and your most relevant experience.
              </p>
              <ul className="space-y-3">
                {[
                  'Tailored to the exact job description and company',
                  'References your real skills and achievements',
                  'Professional tone with a personal touch',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenTool('cover-letter')}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors group"
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Responsible AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
              We don't invent. We highlight what you{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">genuinely know.</span>
            </h2>
            <p className="text-slate-500 text-[15px] sm:text-base leading-relaxed max-w-2xl mx-auto">
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
              <div key={item.title} className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-20 bg-[#0f172a] relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-[20%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-[20%] w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5" />
              <span>Ready to get started?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-tight">
              Build your next application<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">in minutes, not hours</span>
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-lg mx-auto">
              Join thousands of job seekers who've already used Joblist to land interviews at top companies. No credit card, no signup — try it free right now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/analyze"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <span>Analyze a Job Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleOpenTool('resume-analyzer')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-medium px-6 py-4 rounded-xl text-[15px] transition-all duration-200 flex items-center space-x-2"
              >
                <FileUp className="w-4 h-4 text-emerald-400" />
                <span>Upload Your Resume</span>
              </button>
            </div>

            {/* Social proof mini */}
            <div className="flex items-center justify-center space-x-3 pt-4">
              <div className="flex -space-x-2">
                <img className="w-7 h-7 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                <img className="w-7 h-7 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
                <img className="w-7 h-7 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" />
              </div>
              <span className="text-xs text-slate-400">
                <span className="font-semibold text-white">10,000+</span> job seekers already using Joblist
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ AI WORKSPACE (Hidden until CTA clicked) ═══════════════ */}
      {showToolSection && (
        <section id="ai-agent-tools" className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live AI Engine</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  AI Application Workspace
                </h2>
              </div>

              {/* Tool Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
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
                      className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
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
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 flex items-center">
                Joblist
                <span className="relative -top-0.5 ml-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center space-x-6 text-[13px] font-medium text-slate-500">
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            </nav>

            {/* Copyright */}
            <p className="text-[13px] text-slate-400">
              © 2026 Joblist. Built with Next.js & FastAPI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

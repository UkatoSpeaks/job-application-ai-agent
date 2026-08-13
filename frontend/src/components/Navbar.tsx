'use client';

import React, { useState } from 'react';
import { ActiveTab } from '@/types';
import { Sparkles, Sun, ChevronDown, ArrowRight, Bot, FileSearch, Target, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenApp }) => {
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const tabs = [
    { id: 'job-agent' as ActiveTab, label: 'AI Job Agent', icon: Bot },
    { id: 'resume-analyzer' as ActiveTab, label: 'Resume Analyzer', icon: FileSearch },
    { id: 'job-matcher' as ActiveTab, label: 'Job Matcher', icon: Target },
    { id: 'resume-tailor' as ActiveTab, label: 'Resume Tailor', icon: Sparkles },
    { id: 'cover-letter' as ActiveTab, label: 'Cover Letter', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('job-agent')}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-sm">
            <span className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
            Joblist<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          </span>
        </div>

        {/* Center Navigation Links & Tool Tabs */}
        <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-medium text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          <a href="#tools" className="hover:text-emerald-600 transition-colors">Pricing</a>
          <a href="#tools" className="hover:text-emerald-600 transition-colors">Blog</a>
          <div className="relative">
            <button 
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center space-x-1 hover:text-emerald-600 transition-colors focus:outline-none"
            >
              <span>Resources</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                <a href="#tools" className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Resume Templates</a>
                <a href="#tools" className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Cover Letter Guide</a>
                <a href="#tools" className="block px-4 py-2 hover:bg-slate-50 text-slate-700">ATS Optimization</a>
              </div>
            )}
          </div>
        </nav>

        {/* Interactive Application Tool Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (onOpenApp) onOpenApp();
                }}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-700 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-emerald-500/30"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Sun className="w-4 h-4" />
          </button>
          <button className="text-sm font-bold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors hidden sm:block">
            Sign in
          </button>
          <button
            onClick={() => {
              setActiveTab('job-agent');
              if (onOpenApp) onOpenApp();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center space-x-1.5 hover:shadow-md"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab } from '@/types';
import { Sparkles, Sun, ChevronDown, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenApp }) => {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close resources dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-[56px]">
        
        {/* Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer shrink-0"
          onClick={() => setActiveTab('job-agent')}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-[18px] font-bold tracking-tight text-white flex items-center">
            Joblist
            <span className="relative -top-1 ml-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[14px] font-medium">
          <a
            href="#features"
            className="text-slate-300 hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white transition-colors duration-200"
          >
            How it Works
          </a>
          <a
            href="#tools"
            className="text-slate-300 hover:text-white transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#tools"
            className="text-slate-300 hover:text-white transition-colors duration-200"
          >
            Blog
          </a>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none font-medium"
            >
              <span>Resources</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  resourcesOpen ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Resources Dropdown */}
            {resourcesOpen && (
              <div className="absolute top-full mt-3 w-52 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50 text-[13px] overflow-hidden backdrop-blur-xl">
                <a
                  href="#tools"
                  className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors font-medium"
                >
                  Resume Templates
                </a>
                <a
                  href="#tools"
                  className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors font-medium"
                >
                  Cover Letter Guide
                </a>
                <a
                  href="#tools"
                  className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors font-medium"
                >
                  ATS Optimization
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            title="Toggle Theme"
          >
            <Sun className="w-[18px] h-[18px]" />
          </button>

          <button className="text-[14px] font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors hidden sm:block">
            Sign in
          </button>

          <button
            onClick={() => {
              setActiveTab('job-agent');
              if (onOpenApp) onOpenApp();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-[#0f172a] px-4 py-4 space-y-1">
          <a href="#features" className="block px-3 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="block px-3 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors">
            How it Works
          </a>
          <a href="#tools" className="block px-3 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors">
            Pricing
          </a>
          <a href="#tools" className="block px-3 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors">
            Blog
          </a>
          <a href="#tools" className="block px-3 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors">
            Resources
          </a>
        </div>
      )}
    </header>
  );
};

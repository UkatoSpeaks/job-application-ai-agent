'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ActiveTab } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';


interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b-[2.5px] border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-[60px]">

        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer shrink-0"
          onClick={() => setActiveTab('job-agent')}
        >
          <ApplyAiLogo size="md" withText textClassName="text-ink text-[18px]" />
        </Link>


        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[14px] font-bold font-heading">
          <a
            href="#features"
            className="text-ink hover:text-emerald-500 transition-colors duration-150"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-ink hover:text-emerald-500 transition-colors duration-150"
          >
            How it Works
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle className="hidden sm:flex" />

          {isAuthenticated ? (
            <div className="flex items-center space-x-2.5">
              <span className="hidden md:flex items-center space-x-1.5 text-[13px] text-ink font-bold px-2.5 py-1.5 bg-surface-2 rounded-md border-2 border-line">
                <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </span>
              <Link
                href="/dashboard"
                className="brutal-btn bg-lime-400 hover:bg-lime-300 text-[#0B0B0F] text-[13px] font-bold px-4 py-2 flex items-center space-x-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-md border-2 border-line text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-[14px] font-bold font-heading text-ink hover:text-emerald-500 px-3 py-2 transition-colors hidden sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="brutal-btn bg-lime-400 hover:bg-lime-300 text-[#0B0B0F] text-[13px] font-bold px-4 py-2 flex items-center space-x-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md border-2 border-line text-ink transition-all"
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
        <div className="lg:hidden border-t-[2.5px] border-line bg-canvas px-4 py-4 space-y-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Theme</span>
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-xs font-bold text-emerald-500">
                Signed in as {user?.name} ({user?.email})
              </div>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2.5 text-[14px] text-[#0B0B0F] bg-lime-400 border-2 border-line rounded-md font-bold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="w-full text-left flex items-center space-x-2 px-3 py-2.5 text-[14px] text-red-500 hover:bg-surface-2 rounded-md font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="block px-3 py-2.5 text-[14px] text-ink hover:bg-surface-2 rounded-md font-bold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block px-3 py-2.5 text-[14px] text-[#0B0B0F] bg-lime-400 border-2 border-line rounded-md font-bold transition-colors"
              >
                Sign Up Free
              </Link>
            </>
          )}
          <a href="#features" className="block px-3 py-2.5 text-[14px] text-ink hover:bg-surface-2 rounded-md font-bold transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="block px-3 py-2.5 text-[14px] text-ink hover:bg-surface-2 rounded-md font-bold transition-colors">
            How it Works
          </a>
        </div>
      )}
    </header>
  );
};

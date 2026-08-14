'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  FileText,
  Sliders,
  ShieldCheck,
  Server,
  Save,
  Check,
  ArrowLeft,
  Upload,
  Zap,
  PlusCircle,
  Clock,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsView: React.FC = () => {
  const [name, setName] = useState('Anurag Chaudhary');
  const [targetTitle, setTargetTitle] = useState('Software / Full Stack Engineer');
  const [email, setEmail] = useState('anurag@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bengaluru, India');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/anurag');
  const [github, setGithub] = useState('github.com/anurag');

  const [defaultTone, setDefaultTone] = useState<'Confident' | 'Professional' | 'Concise'>('Confident');
  const [defaultLength, setDefaultLength] = useState<'Medium' | 'Short' | 'Detailed'>('Medium');
  const [autoUseDefaultResume, setAutoUseDefaultResume] = useState(true);
  const [strictGroundedAI, setStrictGroundedAI] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
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

        <div className="flex items-center space-x-3">
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </header>

      {/* Main Layout: 2 Columns */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0f172a]/60 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Workspace
              </p>
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/analyze"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>New Analysis</span>
                </Link>

                <Link
                  href="/history"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>History</span>
                </Link>

                <div className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <SettingsIcon className="w-4 h-4 text-emerald-400" />
                  <span>Settings</span>
                </div>
              </nav>
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

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 bg-slate-900 overflow-y-auto">
          <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-8">
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                  Settings & Preferences
                  <SettingsIcon className="w-5 h-5 text-emerald-400 inline" />
                </h1>
                <p className="text-sm text-slate-400 font-normal">
                  Manage your candidate profile, default resume, and AI tailoring preferences.
                </p>
              </div>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 shrink-0"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>

            {/* Saved Toast Feedback */}
            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Your settings and candidate preferences have been saved successfully.</span>
              </motion.div>
            )}

            {/* Section 1: Candidate Profile */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5 shadow-lg">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Candidate Profile</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Default Resume */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4 shadow-lg">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Default Master Resume</span>
              </h2>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Anurag_Chaudhary_Resume.pdf</p>
                    <p className="text-[11px] text-slate-400">2.4 MB • Active Default Master Resume</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-semibold text-white">Auto-use Default Resume</p>
                  <p className="text-[11px] text-slate-400">Automatically select default resume when launching new job analysis</p>
                </div>

                <input
                  type="checkbox"
                  checked={autoUseDefaultResume}
                  onChange={(e) => setAutoUseDefaultResume(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
              </div>
            </div>

            {/* Section 3: AI & Application Preferences */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5 shadow-lg">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>AI & Generation Preferences</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Default Cover Letter Tone
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                    {(['Confident', 'Professional', 'Concise'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setDefaultTone(t)}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          defaultTone === t
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Default Cover Letter Length
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                    {(['Short', 'Medium', 'Detailed'] as const).map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setDefaultLength(l)}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          defaultLength === l
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strict Grounded Check */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Strict Grounded AI Check
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Prevent AI engine from hallucinating or generating skills not grounded in your master resume
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={strictGroundedAI}
                  onChange={(e) => setStrictGroundedAI(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
              </div>
            </div>

            {/* Section 4: API & Engine Status */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3 shadow-lg">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Engine & API Connection</span>
              </h2>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Backend API URL</span>
                <span className="font-mono text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                  http://localhost:8000
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Connection Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected to FastAPI Agent Engine
                </span>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>

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
            <Link
              href="/analyze"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
                <SettingsIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Workspace Preferences</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Settings & Preferences
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                Manage your candidate profile, master resume, and AI generation settings.
              </p>
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center space-x-1.5 shrink-0 cursor-pointer"
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
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Your settings and candidate preferences have been saved successfully.</span>
            </motion.div>
          )}

          {/* Section 1: Candidate Profile */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-purple-600" />
              <span>Candidate Profile</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Default Resume */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Default Master Resume</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Anurag_Chaudhary_Resume.pdf</p>
                  <p className="text-[11px] text-slate-500 font-medium">2.4 MB • Active Master Resume</p>
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold text-slate-900">Auto-use Default Resume</p>
                <p className="text-[11px] text-slate-500">Automatically select default resume when launching new job analysis</p>
              </div>

              <input
                type="checkbox"
                checked={autoUseDefaultResume}
                onChange={(e) => setAutoUseDefaultResume(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Section 3: AI & Application Preferences */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>AI & Generation Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Default Cover Letter Tone
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  {(['Confident', 'Professional', 'Concise'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setDefaultTone(t)}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                        defaultTone === t
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Default Cover Letter Length
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  {(['Short', 'Medium', 'Detailed'] as const).map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setDefaultLength(l)}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                        defaultLength === l
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Strict Grounded Check */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Strict Grounded AI Check
                </p>
                <p className="text-[11px] text-slate-500">
                  Prevent AI engine from hallucinating or generating skills not grounded in your master resume
                </p>
              </div>

              <input
                type="checkbox"
                checked={strictGroundedAI}
                onChange={(e) => setStrictGroundedAI(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Section 4: API & Engine Status */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Server className="w-4 h-4 text-purple-600" />
              <span>Engine & API Connection</span>
            </h2>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Backend API URL</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-semibold">
                http://localhost:8000
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Connection Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected to FastAPI Engine
              </span>
            </div>
          </div>

          {/* Submit Bar */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

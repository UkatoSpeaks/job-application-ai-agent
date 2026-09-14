'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';


export default function SignUpPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requirement 5: If the user is already authenticated, redirect to Dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    // Validation
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(cleanName, cleanEmail, password);
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex items-center space-x-3 text-emerald-500 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-lime-400 selection:text-[#0B0B0F]">
      <div className="absolute inset-0 bg-dots pointer-events-none opacity-50"></div>
      <div className="absolute top-16 left-[12%] w-14 h-14 rounded-full bg-blue-500 border-[3px] border-line hidden sm:block pointer-events-none"></div>

      {/* Header / Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center group">
          <ApplyAiLogo size="lg" withText textClassName="text-ink text-2xl" />
        </Link>

        <h2 className="mt-6 text-3xl font-heading font-bold text-ink tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted font-medium">
          Get started with AI job application tools today
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-xl border-[2.5px] border-line shadow-brutal-lg">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border-2 border-line text-red-700 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-bold">{error}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-2">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="applyai-input block w-full pl-10 pr-4 py-3 text-sm placeholder-muted-2"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-2">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="applyai-input block w-full pl-10 pr-4 py-3 text-sm placeholder-muted-2"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-2">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="applyai-input block w-full pl-10 pr-10 py-3 text-sm placeholder-muted-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-2 hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="brutal-btn w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link to Sign In */}
          <div className="mt-6 border-t-2 border-line-soft pt-6 text-center text-xs text-muted font-medium">
            Already have an account?{' '}
            <Link href="/signin" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

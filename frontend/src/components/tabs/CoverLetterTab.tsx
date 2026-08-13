'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { generateCoverLetter } from '@/lib/api';
import { FileText, ArrowRight, AlertTriangle, Copy, Check, Download, Sparkles, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoverLetterTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste target job description text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateCoverLetter(file, jobDescription.trim(), tone);
      const text = typeof data === 'string' ? data : (data.cover_letter || JSON.stringify(data, null, 2));
      setCoverLetter(text);
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cover_Letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 space-y-4">
          <FileUpload label="1. PDF Resume" onFileSelect={setFile} selectedFile={file} />
          
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Writing Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
            >
              <option value="professional" className="bg-slate-900 text-white">Professional & Formal</option>
              <option value="enthusiastic" className="bg-slate-900 text-white">Enthusiastic & Driven</option>
              <option value="confident" className="bg-slate-900 text-white">Confident & Direct</option>
              <option value="concise" className="bg-slate-900 text-white">Modern & Concise</option>
            </select>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text so the AI can craft a matching personalized cover letter..."
              className="w-full p-3.5 rounded-xl joblist-input text-xs placeholder-slate-400 font-mono leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
              loading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Drafting Cover Letter...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Custom Cover Letter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </GlassCard>
      </form>

      {/* Cover Letter Result Card */}
      {coverLetter && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="space-y-4 border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Customized AI Cover Letter ({tone.toUpperCase()})
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <button
                  onClick={downloadTxt}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-4 rounded-xl glass-input text-xs font-mono leading-relaxed text-slate-100 focus:ring-1 focus:ring-emerald-500"
            />
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

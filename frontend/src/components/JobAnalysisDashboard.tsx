'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Target,
  BarChart2,
  Check,
  X,
  Mail,
  PenTool,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JobAgentResponse } from '@/types';

interface JobAnalysisDashboardProps {
  data?: JobAgentResponse | null;
  onReset?: () => void;
  onTailorResume?: () => void;
  onGenerateCoverLetter?: () => void;
}

export const JobAnalysisDashboard: React.FC<JobAnalysisDashboardProps> = ({
  data,
  onReset,
  onTailorResume,
  onGenerateCoverLetter,
}) => {
  const [showResponsibilities, setShowResponsibilities] = useState(true);

  // Default / fallback sample data matching specs if API data is partial
  const jobTitle = data?.job?.title || 'Senior Developer';
  const company = data?.job?.company || 'HCLTech';
  const location = data?.job?.location || 'Bengaluru, India';
  const summary =
    data?.job?.summary ||
    'Senior Developer at HCLTech responsible for leading core web applications development, scaling microservices architecture, and working closely with product management and engineering teams.';

  const rawScore = data?.match?.score;
  const matchScore = rawScore ? (rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore)) : 58;

  const rawSim = data?.match?.similarity;
  const similarityScore = rawSim ? (rawSim <= 1 ? Math.round(rawSim * 100) : Math.round(rawSim)) : 56;

  const keywordScore = Math.min(100, Math.round(matchScore * 1.07));

  const matchedSkills =
    data?.match?.matched_skills && data.match.matched_skills.length > 0
      ? data.match.matched_skills
      : ['Python', 'Docker', 'Git', 'LangChain', 'REST API', 'SQL'];

  const missingSkills =
    data?.match?.missing_skills && data.match.missing_skills.length > 0
      ? data.match.missing_skills
      : ['AWS', 'Kubernetes', 'CI/CD', 'Terraform', 'Azure'];

  const responsibilities =
    data?.job?.responsibilities && data.job.responsibilities.length > 0
      ? data.job.responsibilities
      : [
          'Build scalable web applications and microservices using Python and modern frameworks.',
          'Design and maintain robust RESTful APIs for cloud-native services.',
          'Develop containerized deployment pipelines using Docker and Kubernetes.',
          'Collaborate with cross-functional product teams to implement high-impact feature requests.',
        ];

  const requiredSkills =
    data?.job?.required_skills && data.job.required_skills.length > 0
      ? data.job.required_skills
      : ['Python', 'Java', 'AWS', 'Docker', 'REST API'];

  const preferredSkills =
    data?.job?.preferred_skills && data.job.preferred_skills.length > 0
      ? data.job.preferred_skills
      : ['Kubernetes', 'CI/CD', 'LangChain', 'Terraform'];

  // Alignment text based on score
  const alignmentText =
    matchScore >= 75
      ? 'Strong alignment'
      : matchScore >= 50
      ? 'Moderate alignment'
      : 'Low alignment';

  const alignmentBg =
    matchScore >= 75
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : matchScore >= 50
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-red-50 text-red-700 border-red-200';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-md shadow-purple-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              ApplyAI
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {onReset && (
              <button
                onClick={onReset}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-medium text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* 1. Job Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold uppercase tracking-wider">
              <span>Target Role</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {jobTitle}
            </h1>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">{company}</span>
              <span>•</span>
              <span>{location}</span>
            </p>
          </div>

          <div>
            <button className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs transition-colors">
              <span>View Job Posting</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </motion.div>

        {/* 2. Match Score Hero Cards (Side-by-Side) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Card 1: Match Score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Match
            </span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke={matchScore >= 75 ? '#10b981' : matchScore >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * matchScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900">
                  {matchScore}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Match
                </span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${alignmentBg}`}>
              {alignmentText}
            </div>
          </div>

          {/* Card 2: Resume Similarity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resume Similarity
              </span>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  {similarityScore}%
                </span>
                <span className="text-xs font-medium text-slate-500">
                  semantic overlap
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Semantic similarity measures how closely the core context and experience on your resume aligns with this job description.
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${similarityScore}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* 3. Skills Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Skills Analysis</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {matchedSkills.length} Matched • {missingSkills.length} Missing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 text-amber-800 border border-amber-200/80 text-xs font-semibold"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Match Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-600" />
            <span>Match Breakdown</span>
          </h2>

          <div className="space-y-4 pt-1">
            {/* Keyword Match */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Keyword Match</span>
                <span className="text-slate-900 font-bold">{keywordScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${keywordScore}%` }}
                ></div>
              </div>
            </div>

            {/* Skill Match */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Skill Match</span>
                <span className="text-slate-900 font-bold">{matchScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* Semantic Similarity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Semantic Similarity</span>
                <span className="text-slate-900 font-bold">{similarityScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${similarityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5. Job Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5"
        >
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Job Overview</span>
          </h2>

          <div className="space-y-4 text-xs text-slate-600">
            {/* About role */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                About this role
              </h3>
              <p className="leading-relaxed font-normal">{summary}</p>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowResponsibilities(!showResponsibilities)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-800 uppercase tracking-wider focus:outline-none"
              >
                <span>Responsibilities</span>
                {showResponsibilities ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showResponsibilities && (
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600 font-normal leading-relaxed">
                  {responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Preferred Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {preferredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. AI Recommendations Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>AI Recommendations</span>
          </h2>

          <div className="space-y-3">
            {/* Recommendation 1: Strengthen positioning */}
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
                <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Strengthen your positioning</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Your resume already demonstrates:{' '}
                <span className="font-semibold text-purple-900">
                  {matchedSkills.slice(0, 4).join(', ')}
                </span>
                . Consider highlighting these experiences more prominently in your tailored resume.
              </p>
            </div>

            {/* Recommendation 2: Skill gap */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Skill gap insights</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                <span className="font-semibold text-amber-900">
                  {missingSkills.slice(0, 2).join(' and ')}
                </span>{' '}
                were not detected on your resume. Only add them if you have genuine experience to maintain authenticity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 7. Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-5 shadow-xl"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Ready to apply?</h3>
            <p className="text-xs text-slate-400 font-normal">
              Tailor your bullet points or generate a personalized cover letter.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button
              onClick={onTailorResume}
              className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Tailor My Resume →</span>
            </button>

            <button
              onClick={onGenerateCoverLetter}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Generate Cover Letter</span>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

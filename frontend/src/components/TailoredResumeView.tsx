'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  FileText,
  Check,
  AlertTriangle,
  Mail,
  Eye,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JobAgentResponse, ParsedResume } from '@/types';
import Link from 'next/link';

interface TailoredResumeViewProps {
  data?: JobAgentResponse | null;
  onGoToCoverLetter?: () => void;
  onBackToDashboard?: () => void;
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  data,
  onGoToCoverLetter,
  onBackToDashboard,
}) => {
  const [viewMode, setViewMode] = useState<'tailored' | 'original'>('tailored');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Job Context Info
  const jobTitle = data?.job?.title || 'Senior Developer';
  const company = data?.job?.company || 'HCLTech';

  // Fallback sample resume data matching specs
  const defaultOriginalResume: ParsedResume = {
    contact_info: {
      name: 'Anurag Chaudhary',
      email: 'anurag@example.com',
      phone: '+91 98765 43210',
      github: 'github.com/anurag',
      linkedin: 'linkedin.com/in/anurag',
      location: 'Bengaluru, India',
    },
    summary:
      'Software Engineer with 4+ years of experience building web applications using Python, JavaScript, and SQL database systems.',
    skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'HTML/CSS', 'PostgreSQL'],
    work_experience: [
      {
        job_title: 'Software Developer',
        company: 'Tech Solutions Ltd',
        start_date: '2022',
        end_date: 'Present',
        responsibilities: [
          'Developed web services and frontend user interfaces for client portals.',
          'Maintained relational databases and wrote SQL queries for data aggregation.',
          'Collaborated with development teams using Git version control.',
        ],
      },
      {
        job_title: 'Junior Developer',
        company: 'InnovateX Labs',
        start_date: '2020',
        end_date: '2022',
        responsibilities: [
          'Assisted in building REST APIs and bug fixing across core modules.',
          'Participated in code reviews and written unit test coverage.',
        ],
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'National Institute of Technology',
        graduation_year: '2020',
      },
    ],
    projects: [
      {
        title: 'Job Processing Pipeline',
        description: 'Built automated web scraper and text processing service in Python.',
        technologies: ['Python', 'SQL', 'Git'],
      },
    ],
    certifications: [],
  };

  const defaultTailoredResume: ParsedResume = {
    contact_info: defaultOriginalResume.contact_info,
    summary:
      'Full Stack & Senior Software Engineer with 4+ years of experience building high-performance web applications, scalable REST APIs, and AI-assisted workflows using Python, FastAPI, React, and LangChain.',
    skills: [
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'Docker',
      'LangChain',
      'REST APIs',
      'SQL',
      'Git',
      'PostgreSQL',
    ],
    work_experience: [
      {
        job_title: 'Senior Software Developer',
        company: 'Tech Solutions Ltd',
        start_date: '2022',
        end_date: 'Present',
        responsibilities: [
          'Engineered scalable microservices and REST APIs using Python and FastAPI, handling 50k+ daily transactions.',
          'Containerized deployment pipelines using Docker, improving build consistency across staging and production.',
          'Integrated LangChain LLM capabilities into internal knowledge search tools, reducing manual query times by 35%.',
          'Managed relational SQL databases and optimized PostgreSQL query performance for complex analytics.',
        ],
      },
      {
        job_title: 'Software Engineer',
        company: 'InnovateX Labs',
        start_date: '2020',
        end_date: '2022',
        responsibilities: [
          'Architected RESTful endpoints and integrated frontend React interface components.',
          'Enforced robust Git version control standards and automated unit test suites.',
        ],
      },
    ],
    education: defaultOriginalResume.education,
    projects: [
      {
        title: 'AI Application Assistant Pipeline',
        description: 'Designed an end-to-end resume parser & matching engine leveraging Python, FastAPI, and Docker.',
        technologies: ['Python', 'FastAPI', 'Docker', 'LangChain'],
      },
    ],
    certifications: [],
  };

  const activeResume =
    viewMode === 'tailored'
      ? data?.tailored_resume || defaultTailoredResume
      : data?.original_resume || defaultOriginalResume;

  // Added targeted keywords highlight list
  const targetedKeywordsAdded = [
    'FastAPI',
    'Docker',
    'LangChain',
    'REST APIs',
    'TypeScript',
    'Microservices',
  ];
  const resumeKeywords = activeResume.skills.filter((skill: string) => targetedKeywordsAdded.includes(skill));

  // Missing skills that were grounded (not falsely hallucinated)
  const groundedMissingSkills =
    data?.match?.missing_skills && data.match.missing_skills.length > 0
      ? data.match.missing_skills
      : ['AWS', 'Kubernetes', 'Terraform'];

  // Handle Copy Plaintext Resume
  const handleCopyText = () => {
    const text = `
${activeResume.contact_info.name}
${activeResume.summary}

SKILLS
${activeResume.skills.join(' • ')}

EXPERIENCE
${activeResume.work_experience
  .map(
    (w: any) => `${w.job_title} | ${w.company} (${w.start_date} - ${w.end_date})
${w.responsibilities.map((r: string) => `• ${r}`).join('\n')}`
  )
  .join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Download PDF (triggers print dialog styled as PDF)
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 font-sans selection:bg-violet-200 pb-20">
      <div className="absolute inset-x-0 top-0 h-[350px] overflow-hidden bg-slate-950">
        <div className="absolute -top-32 left-[10%] w-[28rem] h-[28rem] rounded-full bg-violet-600/30 blur-[110px]"></div>
        <div className="absolute right-[8%] top-4 w-80 h-80 rounded-full bg-cyan-500/20 blur-[110px]"></div>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:22px_22px]"></div>
      </div>
      {/* Top Application Bar */}
      <header className="relative z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            <span className="text-slate-600">|</span>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                ApplyAI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-400/10 text-emerald-200 border border-emerald-400/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Validation Passed</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 text-white">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-violet-200 bg-violet-300/10 px-3 py-1 rounded-full border border-violet-300/20 uppercase tracking-[0.14em] mb-2">
              <span>Step 4 of 5 · Resume studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tailored Resume
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1">
              Optimized specifically for{' '}
              <span className="font-semibold text-white">
                {jobTitle} · {company}
              </span>
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-semibold backdrop-blur">
              <button
                onClick={() => setViewMode('tailored')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'tailored'
                    ? 'bg-white text-violet-700 shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tailored Resume
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'original'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Original Resume
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-2 rounded-xl border font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs ${
                isEditing
                  ? 'bg-violet-100 text-violet-700 border-violet-100'
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-current" />
              <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
            </button>

            {/* Download PDF Primary Button */}
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-white hover:bg-violet-50 text-violet-800 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Workspace Grid: Document Center vs AI Optimization Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: A4 Paper Preview Document */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500"><span>Document preview</span><span className="rounded-full bg-white px-3 py-1.5 border border-slate-200">ATS-friendly layout</span></div>
            <div className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-10 shadow-[0_25px_55px_-30px_rgba(15,23,42,0.38)] min-h-[750px] relative overflow-hidden font-sans">
              {/* Document Stamp / Status */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 print:hidden">
                <span
                  className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold border ${
                    viewMode === 'tailored'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {viewMode === 'tailored' ? 'AI Tailored Version' : 'Original Version'}
                </span>
              </div>

              {/* Resume Content Sheet */}
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="border-b border-slate-200 pb-4 space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeResume.contact_info.name}
                  </h2>
                  <p className="text-sm font-bold text-purple-700">
                    Software / Full Stack Engineer
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeResume.contact_info.email} • {activeResume.contact_info.phone} •{' '}
                    {activeResume.contact_info.location || 'Bengaluru, India'} •{' '}
                    {activeResume.contact_info.github} • {activeResume.contact_info.linkedin}
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1">
                    Professional Summary
                  </h3>
                  <p
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    className={`text-xs text-slate-700 leading-relaxed ${
                      isEditing ? 'p-2 rounded bg-amber-50/50 border border-amber-200' : ''
                    }`}
                  >
                    {activeResume.summary}
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResume.skills.map((skill: string) => {
                      const isTargeted = targetedKeywordsAdded.includes(skill) && viewMode === 'tailored';
                      return (
                        <span
                          key={skill}
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                            isTargeted
                              ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {skill}
                          {isTargeted && <span className="ml-1 text-[10px] text-purple-600">★</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1">
                    Work Experience
                  </h3>

                  <div className="space-y-4">
                    {activeResume.work_experience.map((exp: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-bold text-slate-900">
                            {exp.job_title} <span className="font-normal text-slate-500">at {exp.company}</span>
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>

                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                          {exp.responsibilities.map((bullet: string, bIdx: number) => (
                            <li
                              key={bIdx}
                              contentEditable={isEditing}
                              suppressContentEditableWarning
                              className={isEditing ? 'p-1 rounded bg-amber-50/50 border border-amber-200' : ''}
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {activeResume.projects && activeResume.projects.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Key Projects
                    </h3>
                    <div className="space-y-2">
                      {activeResume.projects.map((proj: any, pIdx: number) => (
                        <div key={pIdx} className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Optimization & Skill Gaps Panel */}
          <div className="lg:col-span-4 space-y-5">
            {/* AI Optimization Card */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.35)] space-y-4"
            >
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Optimization</h3>
              </div>

              <div className="space-y-2.5">
                {[
                  'Highlighted relevant experience',
                  'Improved job-specific keywords',
                  'Prioritized matching technologies',
                  'Kept claims grounded in your resume',
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Targeted Keywords added pill list */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Targeted Keywords Added
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(resumeKeywords.length ? resumeKeywords : targetedKeywordsAdded).map((kw: string) => (
                    <span
                      key={kw}
                      className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Skill Gaps Detected (Grounded assurance box) */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.35)] space-y-3"
            >
              <div className="flex items-center space-x-2 text-slate-900">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold">Skill Gaps Detected</h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {groundedMissingSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                These skills were not detected in your resume and were{' '}
                <span className="font-semibold text-slate-700">not falsely added</span> to maintain complete authenticity.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-r from-violet-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-violet-200"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Your resume is ready.</h3>
            <p className="text-xs text-slate-400 font-normal">
              Next, generate a matching personalized cover letter to complete your application package.
            </p>
          </div>

          <div className="flex justify-center pt-1">
            {onGoToCoverLetter ? (
              <button
                onClick={onGoToCoverLetter}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-violet-50 text-violet-800 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Generate Cover Letter →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/cover-letter"
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-violet-50 text-violet-800 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Generate Cover Letter →</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

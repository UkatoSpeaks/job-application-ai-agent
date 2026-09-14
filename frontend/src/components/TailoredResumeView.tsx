'use client';

import React, { useState } from 'react';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Download, Eye, FileText, Mail, PenTool, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { JobAgentResponse, ParsedResume } from '@/types';
import { exportResumePdf, downloadBlob } from '@/lib/api';

interface Props {
  data?: JobAgentResponse | null;
  onGoToCoverLetter?: () => void;
  onBackToDashboard?: () => void;
}

interface SkillCategory {
  category: string;
  skills: string[];
}

export function categorizeSkills(rawSkills: string[] | Record<string, string[]> | undefined | null): SkillCategory[] {
  if (!rawSkills) return [];

  if (typeof rawSkills === 'object' && !Array.isArray(rawSkills)) {
    return Object.entries(rawSkills)
      .map(([cat, list]) => ({
        category: cat,
        skills: Array.isArray(list) ? list : [String(list)],
      }))
      .filter((item) => item.skills.length > 0);
  }

  const skillList: string[] = Array.isArray(rawSkills) ? rawSkills : [String(rawSkills)];
  if (skillList.length === 0) return [];

  const categoryMap: { name: string; matchers: string[] }[] = [
    {
      name: 'Languages',
      matchers: ['c++', 'cpp', 'c#', 'c', 'python', 'javascript', 'typescript', 'java', 'sql', 'html', 'css', 'go', 'rust', 'ruby', 'php', 'kotlin', 'swift'],
    },
    {
      name: 'Frontend',
      matchers: ['react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'tailwind css', 'tailwind', 'bootstrap', 'html5', 'css3', 'redux', 'web vitals'],
    },
    {
      name: 'Backend',
      matchers: ['node.js', 'nodejs', 'express', 'express.js', 'fastapi', 'flask', 'django', 'spring boot', 'rest api', 'rest apis', 'restful apis', 'graphql', 'microservices'],
    },
    {
      name: 'AI / GenAI',
      matchers: ['langchain', 'langgraph', 'rag', 'mistral ai', 'groq', 'openai', 'llama', 'vector databases', 'chromadb', 'pinecone', 'hugging face', 'prompt engineering'],
    },
    {
      name: 'Databases',
      matchers: ['mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'firebase', 'chromadb', 'redis', 'dynamodb', 'supabase'],
    },
    {
      name: 'Tools & Platforms',
      matchers: ['git', 'github', 'docker', 'kubernetes', 'postman', 'render', 'vercel', 'aws', 'gcp', 'azure', 'linux', 'ci/cd', 'jest', 'cypress'],
    },
  ];

  const result: SkillCategory[] = [];
  const assigned = new Set<string>();

  for (const cat of categoryMap) {
    const matchedSkills: string[] = [];
    for (const skill of skillList) {
      if (assigned.has(skill)) continue;
      const lower = skill.toLowerCase().trim();
      if (cat.matchers.some((m) => lower === m || lower.startsWith(m + ' ') || lower.endsWith(' ' + m))) {
        matchedSkills.push(skill);
        assigned.add(skill);
      }
    }
    if (matchedSkills.length > 0) {
      result.push({ category: cat.name, skills: matchedSkills });
    }
  }

  const remaining = skillList.filter((s) => !assigned.has(s));
  if (remaining.length > 0) {
    result.push({ category: 'Other Skills', skills: remaining });
  }

  return result;
}

/**
 * The backend always returns both original_resume and tailored_resume
 * pre-normalized into the ParsedResume shape (see serialize_tailored_resume
 * in job_agent.py) with tailoring improvements already merged server-side,
 * so no client-side field-guessing/merging is needed here.
 */
function getResumeToDisplay(data?: JobAgentResponse | null, mode: 'tailored' | 'original' = 'tailored'): ParsedResume | null {
  if (!data) return null;

  const source = mode === 'original' ? data.original_resume : data.tailored_resume || data.original_resume;
  if (!source) return null;

  return {
    contact_info: {
      name: source.contact_info?.name || '',
      email: source.contact_info?.email || '',
      phone: source.contact_info?.phone || '',
      location: source.contact_info?.location || '',
      linkedin: source.contact_info?.linkedin || '',
      github: source.contact_info?.github || '',
      portfolio: source.contact_info?.portfolio || '',
    },
    summary: source.summary || '',
    skills: (source.skills && source.skills.length > 0) ? source.skills : (data.match?.matched_skills || []),
    work_experience: source.work_experience || [],
    education: source.education || [],
    projects: source.projects || [],
    certifications: source.certifications || [],
  };
}

export const TailoredResumeView: React.FC<Props> = ({ data, onGoToCoverLetter, onBackToDashboard }) => {
  const [mode, setMode] = useState<'tailored' | 'original'>('tailored');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const resume = getResumeToDisplay(data, mode);

  if (!resume) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
        <header className="bg-surface border-b border-line-soft h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-ink text-base">ApplyAI</span>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ink">No Resume Analysis Session Active</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Upload your PDF resume and target job posting URL to extract your actual background and generate a tailored resume tailored to your target position.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Analyze Job & Tailor Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
      </div>
    );
  }

  const job = data?.job;
  const missingSkills = data?.match?.missing_skills || [];
  const keywords = data?.match?.matched_keywords?.length ? data.match.matched_keywords : (resume.skills || []).slice(0, 6);

  const copyResume = () => {
    const text = [
      resume.contact_info.name,
      [resume.contact_info.email, resume.contact_info.phone, resume.contact_info.linkedin, resume.contact_info.github].filter(Boolean).join(' | '),
      '',
      'SUMMARY',
      resume.summary,
      '',
      'EXPERIENCE',
      ...(resume.work_experience || []).flatMap((item: ParsedResume['work_experience'][number]) => [
        `${item.company} | ${item.job_title} | ${[item.start_date, item.end_date].filter(Boolean).join(' - ')}`,
        ...(item.responsibilities || []).map((bullet: string) => `• ${bullet}`)
      ]),
      '',
      'TECHNICAL SKILLS',
      (resume.skills || []).join(', ')
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const blob = await exportResumePdf(resume);
      const candidateName = resume.contact_info.name || 'Candidate';
      const cleanName = candidateName.replace(/\s+/g, '_');
      downloadBlob(blob, `${cleanName}_Jake_Resume.pdf`);
    } catch (err) {
      console.error('PDF export failed, falling back to window.print():', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line-soft shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-1.5 text-muted hover:text-ink transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 text-muted hover:text-ink transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </Link>
            )}

            <span className="text-muted-2">|</span>

            <ApplyAiLogo size="sm" withText textClassName="text-ink text-base" />

          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded Tailoring</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pt-8 lg:px-8 space-y-6">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line-soft pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <span>Step 4 of 5 • Jake&apos;s Resume Template</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Tailored Resume
            </h1>
            <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
              Structured for <strong className="font-semibold text-ink">{job?.title || 'your target role'} · {job?.company || 'your target company'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-line-soft bg-surface-2 p-1 text-xs font-semibold">
              <button
                onClick={() => setMode('tailored')}
                className={`rounded-lg px-3 py-1.5 transition-all ${mode === 'tailored' ? 'bg-surface text-purple-700 shadow-xs font-bold' : 'text-ink hover:text-ink'}`}
              >
                Tailored
              </button>
              <button
                onClick={() => setMode('original')}
                className={`rounded-lg px-3 py-1.5 transition-all ${mode === 'original' ? 'bg-surface text-ink shadow-xs font-bold' : 'text-ink hover:text-ink'}`}
              >
                Original
              </button>
            </div>

            <button
              onClick={copyResume}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line-soft bg-surface px-3.5 py-2 text-xs font-bold text-ink hover:bg-canvas shadow-xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-muted" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted">
              <span>Jake&apos;s Resume document preview</span>
              <span className="rounded-full border border-line-soft bg-surface px-3 py-0.5 text-[11px] font-bold text-ink shadow-xs">
                ATS-Friendly
              </span>
            </div>

            <div className="rounded-2xl border border-line-soft bg-surface p-8 sm:p-12 shadow-lg shadow-slate-200/50">
              <article id="jake-resume" className="jake-resume mx-auto max-w-3xl text-[11px] leading-[1.35] text-black font-sans">
                <header className="border-b-2 border-black pb-2 text-center">
                  <h2 className="text-[24px] font-bold leading-none tracking-tight">{resume.contact_info?.name || 'Candidate Name'}</h2>
                  <p className="mt-1.5 text-[9.5px] text-ink">
                    {[
                      resume.contact_info?.phone,
                      resume.contact_info?.email,
                      resume.contact_info?.location,
                      resume.contact_info?.linkedin,
                      resume.contact_info?.github,
                      resume.contact_info?.portfolio,
                    ].filter(Boolean).join(' | ')}
                  </p>
                </header>

                {/* 1. SUMMARY */}
                {resume.summary && (
                  <JakeSection title="Summary">
                    <p className="text-ink leading-relaxed text-[10.5px]">{resume.summary}</p>
                  </JakeSection>
                )}

                {/* 2. TECHNICAL SKILLS */}
                {resume.skills?.length > 0 && (() => {
                  const categorized = categorizeSkills(resume.skills);
                  return (
                    <JakeSection title="Technical Skills">
                      <div className="space-y-0.5 text-ink text-[10.5px]">
                        {categorized.map((item, idx) => (
                          <p key={idx} className="leading-snug">
                            <strong className="font-bold text-ink">{item.category}:</strong> {item.skills.join(', ')}
                          </p>
                        ))}
                      </div>
                    </JakeSection>
                  );
                })()}

                {/* 3. EXPERIENCE */}
                {resume.work_experience?.length > 0 && (
                  <JakeSection title="Experience">
                    <div className="space-y-2.5">
                      {resume.work_experience.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between gap-3 font-bold text-ink text-[11px]">
                            <span>{item.company}</span>
                            <span className="whitespace-nowrap font-semibold">{[item.start_date, item.end_date].filter(Boolean).join(' – ')}</span>
                          </div>
                          <div className="flex justify-between gap-3 italic text-ink text-[10px]">
                            <span>{item.job_title}</span>
                            <span>{item.location}</span>
                          </div>
                          <ul className="mt-1 list-disc pl-4 space-y-0.5 text-ink text-[10.5px]">
                            {(item.responsibilities || []).map((bullet: string, bulletIndex: number) => (
                              <li key={bulletIndex} className="leading-snug">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {/* 4. PROJECTS */}
                {resume.projects?.length > 0 && (
                  <JakeSection title="Projects">
                    <div className="space-y-2">
                      {resume.projects.map((item, index) => (
                        <div key={index}>
                          <p className="font-bold text-ink text-[11px]">
                            {item.title}
                            {item.technologies?.length ? <span className="font-normal italic text-ink text-[10px]"> | {item.technologies.join(', ')}</span> : null}
                          </p>
                          <p className="text-ink text-[10.5px] leading-snug">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {/* 5. EDUCATION */}
                {resume.education?.length > 0 && (
                  <JakeSection title="Education">
                    <div className="space-y-1 text-[10.5px]">
                      {resume.education.map((item, index) => (
                        <div key={index} className="flex justify-between gap-3 text-ink">
                          <span><strong>{item.institution}</strong>{item.degree ? ` — ${item.degree}` : ''}</span>
                          <span className="whitespace-nowrap text-ink">{item.graduation_year}</span>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {/* 6. CERTIFICATIONS (If present) */}
                {resume.certifications?.length > 0 && (
                  <JakeSection title="Certifications">
                    <p className="text-ink text-[10.5px]">
                      {resume.certifications.join(' | ')}
                    </p>
                  </JakeSection>
                )}
              </article>
            </div>
          </motion.div>

          <aside className="space-y-5">
            <InfoCard icon={<CheckCircle2 className="h-4 w-4" />} title="Jake&apos;s Resume format" color="text-purple-600">
              <p>Compact, recruiter-friendly structure with clear section rules, aligned dates, and focused technical content.</p>
              <div className="mt-3 space-y-1.5 text-xs text-ink">
                <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />Centered contact header</p>
                <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />Concise experience bullets</p>
                <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />Scannable skills section</p>
              </div>
            </InfoCard>

            <InfoCard icon={<Eye className="h-4 w-4" />} title="Highlighted evidence" color="text-sky-600">
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((item: string) => (
                  <span key={item} className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800">
                    {item}
                  </span>
                ))}
              </div>
            </InfoCard>

            <InfoCard icon={<TriangleAlert className="h-4 w-4" />} title="Keep it truthful" color="text-amber-600">
              <p>Missing requirements are intentionally excluded from the resume. Add them only after gaining genuine experience.</p>
              {missingSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {missingSkills.slice(0, 6).map((item: string) => (
                    <span key={item} className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </InfoCard>
          </aside>
        </div>

        <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-[2.5px] border-line bg-ink p-6 text-canvas shadow-brutal-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-purple-400">Application package</p>
            <h2 className="mt-1 text-xl font-bold font-heading">Your Jake-formatted resume is ready.</h2>
            <p className="mt-0.5 text-xs text-canvas/70">Complete the application with a targeted cover letter.</p>
          </div>
          <button
            onClick={onGoToCoverLetter}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-purple-600/30 transition cursor-pointer shrink-0"
          >
            <Mail className="h-4 w-4" />
            Generate cover letter
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  );
};

function JakeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="mb-1 border-b border-black pb-0.5 text-[12px] font-bold uppercase tracking-wide text-black">{title}</h3>
      {children}
    </section>
  );
}

function InfoCard({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 text-xs leading-5 text-ink shadow-sm space-y-2">
      <div className="flex items-center gap-2 font-bold text-ink border-b border-line-soft pb-2">
        <span className={color}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

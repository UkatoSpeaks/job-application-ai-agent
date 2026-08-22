'use client';

import React, { useState } from 'react';
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

const fallback: ParsedResume = {
  contact_info: { name: 'Anurag Chaudhary', email: 'anurag@example.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/anurag', github: 'github.com/anurag', location: 'Bengaluru, India' },
  summary: 'Results-driven software engineer with 4+ years of experience building scalable web applications, REST APIs, and AI integrations.',
  skills: ['Python', 'JavaScript', 'React', 'FastAPI', 'Docker', 'SQL', 'Git'],
  work_experience: [{ job_title: 'Software Developer', company: 'Tech Solutions', start_date: '2022', end_date: 'Present', location: 'Bengaluru, India', responsibilities: ['Architected core Next.js frontend applications, improving page load speeds.', 'Collaborated with cross-functional teams to deliver product features.'] }],
  education: [{ degree: 'Bachelor of Technology in Computer Science', institution: 'University Name', graduation_year: '2022' }],
  projects: [],
  certifications: [],
};

function getResumeToDisplay(data?: JobAgentResponse | null, mode: 'tailored' | 'original' = 'tailored'): ParsedResume | null {
  if (!data) return null;

  const orig = data.original_resume;
  const tail = data.tailored_resume;
  const job = data.job;

  if (mode === 'original' && orig) {
    return {
      contact_info: {
        name: orig.contact_info?.name || '',
        email: orig.contact_info?.email || '',
        phone: orig.contact_info?.phone || '',
        location: orig.contact_info?.location || '',
        linkedin: orig.contact_info?.linkedin || '',
        github: orig.contact_info?.github || '',
        portfolio: orig.contact_info?.portfolio || '',
      },
      summary: orig.summary || '',
      skills: orig.skills || [],
      work_experience: orig.work_experience || [],
      education: orig.education || [],
      projects: orig.projects || [],
      certifications: orig.certifications || [],
    };
  }

  // mode === 'tailored'
  const contactInfo = {
    name: tail?.contact_info?.name || orig?.contact_info?.name || '',
    email: tail?.contact_info?.email || orig?.contact_info?.email || '',
    phone: tail?.contact_info?.phone || orig?.contact_info?.phone || '',
    location: tail?.contact_info?.location || orig?.contact_info?.location || '',
    linkedin: tail?.contact_info?.linkedin || orig?.contact_info?.linkedin || '',
    github: tail?.contact_info?.github || orig?.contact_info?.github || '',
    portfolio: tail?.contact_info?.portfolio || orig?.contact_info?.portfolio || '',
  };

  const summary = tail?.summary
    || tail?.improved_summary
    || tail?.tailored_summary
    || orig?.summary
    || (job?.title ? `Results-driven software developer with experience in building web applications and full-stack features, tailored for the ${job.title} position at ${job.company || 'target company'}.` : '');

  const skills = (tail?.skills && tail.skills.length > 0)
    ? tail.skills
    : (tail?.improved_skills && tail.improved_skills.length > 0)
    ? tail.improved_skills
    : (orig?.skills && orig.skills.length > 0)
    ? orig.skills
    : (data.match?.matched_skills || []);

  // Work experience mapping - STRICTLY preserve candidate's real companies, titles, dates, locations
  let workExperience: ParsedResume['work_experience'] = [];
  const baseExperiences = orig?.work_experience?.length
    ? orig.work_experience
    : tail?.work_experience?.length
    ? tail.work_experience
    : [];

  const experienceImprovements = tail?.experience_improvements || [];

  if (baseExperiences.length > 0) {
    workExperience = baseExperiences.map((exp: any, idx: number) => {
      // Find LLM tailored bullet improvements matching company or index
      const matchingImp = Array.isArray(experienceImprovements)
        ? experienceImprovements.find((imp: any) =>
            imp.company && exp.company && imp.company.toLowerCase().includes(exp.company.toLowerCase())
          ) || experienceImprovements[idx]
        : null;

      const tailoredBullets = (matchingImp?.improvements && matchingImp.improvements.length > 0)
        ? matchingImp.improvements
        : (exp.responsibilities && exp.responsibilities.length > 0)
        ? exp.responsibilities
        : (exp.bullet_points && exp.bullet_points.length > 0)
        ? exp.bullet_points
        : [];

      return {
        job_title: exp.job_title || exp.role || '',
        company: exp.company || '',
        location: exp.location || '',
        start_date: exp.start_date || exp.duration || '',
        end_date: exp.end_date || '',
        responsibilities: tailoredBullets,
      };
    });
  }

  // Projects mapping - STRICTLY preserve candidate's real projects
  let projects: ParsedResume['projects'] = [];
  const baseProjects = orig?.projects?.length
    ? orig.projects
    : tail?.projects?.length
    ? tail.projects
    : [];

  const projectImprovements = tail?.project_improvements || [];

  if (baseProjects.length > 0) {
    projects = baseProjects.map((proj: any, idx: number) => {
      const matchingImp = Array.isArray(projectImprovements)
        ? projectImprovements.find((imp: any) =>
            imp.title && proj.title && imp.title.toLowerCase().includes(proj.title.toLowerCase())
          ) || projectImprovements[idx]
        : null;

      const improvedDesc = (matchingImp?.improvements && matchingImp.improvements.length > 0)
        ? matchingImp.improvements.join(' ')
        : proj.description || '';

      return {
        title: proj.title || '',
        description: improvedDesc,
        technologies: proj.technologies || proj.tech_stack || [],
        links: proj.links || [],
      };
    });
  }

  const education = (orig?.education && orig.education.length > 0)
    ? orig.education
    : (tail?.education || []);

  const certifications = orig?.certifications || tail?.certifications || [];

  return {
    contact_info: contactInfo,
    summary,
    skills,
    work_experience: workExperience,
    education,
    projects,
    certifications,
  };
}

export const TailoredResumeView: React.FC<Props> = ({ data, onGoToCoverLetter, onBackToDashboard }) => {
  const [mode, setMode] = useState<'tailored' | 'original'>('tailored');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const resume = getResumeToDisplay(data, mode);

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base">ApplyAI</span>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">No Resume Analysis Session Active</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analysis</span>
              </Link>
            )}

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
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded Tailoring</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pt-8 lg:px-8 space-y-6">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <span>Step 4 of 5 • Jake&apos;s Resume Template</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Tailored Resume
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Structured for <strong className="font-semibold text-slate-800">{job?.title || 'your target role'} · {job?.company || 'your target company'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setMode('tailored')}
                className={`rounded-lg px-3 py-1.5 transition-all ${mode === 'tailored' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tailored
              </button>
              <button
                onClick={() => setMode('original')}
                className={`rounded-lg px-3 py-1.5 transition-all ${mode === 'original' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Original
              </button>
            </div>

            <button
              onClick={copyResume}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
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
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
              <span>Jake&apos;s Resume document preview</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-0.5 text-[11px] font-bold text-slate-600 shadow-xs">
                ATS-Friendly
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-lg shadow-slate-200/50">
              <article id="jake-resume" className="jake-resume mx-auto max-w-3xl text-[11px] leading-[1.35] text-black font-sans">
                <header className="border-b-2 border-black pb-2 text-center">
                  <h2 className="text-[26px] font-bold leading-none tracking-tight">{resume.contact_info?.name || 'Candidate Name'}</h2>
                  <p className="mt-1.5 text-[10px] text-slate-700">
                    {[resume.contact_info?.phone, resume.contact_info?.email, resume.contact_info?.location, resume.contact_info?.linkedin, resume.contact_info?.github].filter(Boolean).join(' | ')}
                  </p>
                </header>

                {resume.summary && (
                  <JakeSection title="Summary">
                    <p className="text-slate-800 leading-relaxed">{resume.summary}</p>
                  </JakeSection>
                )}

                {resume.work_experience?.length > 0 && (
                  <JakeSection title="Experience">
                    <div className="space-y-3">
                      {resume.work_experience.map((item: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between gap-3 font-bold text-slate-900">
                            <span>{item.company}</span>
                            <span className="whitespace-nowrap font-semibold">{[item.start_date, item.end_date].filter(Boolean).join(' - ')}</span>
                          </div>
                          <div className="flex justify-between gap-3 italic text-slate-700">
                            <span>{item.job_title}</span>
                            <span>{item.location}</span>
                          </div>
                          <ul className="mt-1 list-disc pl-4 space-y-0.5 text-slate-800">
                            {(item.responsibilities || []).map((bullet: string, bulletIndex: number) => (
                              <li key={bulletIndex}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {resume.projects?.length > 0 && (
                  <JakeSection title="Projects">
                    <div className="space-y-2">
                      {resume.projects.map((item: any, index: number) => (
                        <div key={index}>
                          <p className="font-bold text-slate-900">
                            {item.title}
                            {item.technologies?.length ? <span className="font-normal italic text-slate-700"> | {item.technologies.join(', ')}</span> : null}
                          </p>
                          <p className="text-slate-800">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {resume.education?.length > 0 && (
                  <JakeSection title="Education">
                    <div className="space-y-1">
                      {resume.education.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between gap-3 text-slate-900">
                          <span><strong>{item.institution}</strong>{item.degree ? ` — ${item.degree}` : ''}</span>
                          <span className="whitespace-nowrap text-slate-700">{item.graduation_year}</span>
                        </div>
                      ))}
                    </div>
                  </JakeSection>
                )}

                {resume.skills?.length > 0 && (
                  <JakeSection title="Technical Skills">
                    <p className="text-slate-800"><strong>Languages & Technologies:</strong> {(resume.skills || []).join(', ')}</p>
                  </JakeSection>
                )}
              </article>
            </div>
          </motion.div>

          <aside className="space-y-5">
            <InfoCard icon={<CheckCircle2 className="h-4 w-4" />} title="Jake&apos;s Resume format" color="text-purple-600">
              <p>Compact, recruiter-friendly structure with clear section rules, aligned dates, and focused technical content.</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
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

        <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-purple-300">Application package</p>
            <h2 className="mt-1 text-xl font-bold">Your Jake-formatted resume is ready.</h2>
            <p className="mt-0.5 text-xs text-slate-300">Complete the application with a targeted cover letter.</p>
          </div>
          <button
            onClick={onGoToCoverLetter}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-purple-600/30 transition cursor-pointer shrink-0"
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-5 text-slate-600 shadow-sm space-y-2">
      <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
        <span className={color}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

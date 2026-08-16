'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Download, Eye, FileText, Mail, PenTool, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { JobAgentResponse, ParsedResume } from '@/types';
import { exportResumePdf, downloadBlob } from '@/lib/api';

interface Props { data?: JobAgentResponse | null; onGoToCoverLetter?: () => void; onBackToDashboard?: () => void; }

const fallback: ParsedResume = {
  contact_info: { name: 'Your Name', email: 'you@example.com', phone: '+1 555 123 4567', linkedin: 'linkedin.com/in/yourname', github: 'github.com/yourname' },
  summary: 'Software engineer with experience building reliable web applications and user-focused software.',
  skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git'],
  work_experience: [{ job_title: 'Software Developer', company: 'Company Name', start_date: '2022', end_date: 'Present', responsibilities: ['Built and maintained web application features.', 'Collaborated with cross-functional teams to deliver product improvements.'] }],
  education: [{ degree: 'Bachelor of Science in Computer Science', institution: 'University Name', graduation_year: '2022' }], projects: [], certifications: [],
};

export const TailoredResumeView: React.FC<Props> = ({ data, onGoToCoverLetter, onBackToDashboard }) => {
  const [mode, setMode] = useState<'tailored' | 'original'>('tailored');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const resume = (mode === 'tailored' ? data?.tailored_resume : data?.original_resume) || fallback;
  const job = data?.job;
  const missingSkills = data?.match?.missing_skills || [];
  const keywords = data?.match?.matched_keywords?.length ? data.match.matched_keywords : resume.skills.slice(0, 6);

  const copyResume = () => {
    const text = [resume.contact_info.name, [resume.contact_info.email, resume.contact_info.phone, resume.contact_info.linkedin, resume.contact_info.github].filter(Boolean).join(' | '), '', 'SUMMARY', resume.summary, '', 'EXPERIENCE', ...resume.work_experience.flatMap((item: ParsedResume['work_experience'][number]) => [`${item.company} | ${item.job_title} | ${[item.start_date, item.end_date].filter(Boolean).join(' - ')}`, ...(item.responsibilities || []).map((bullet: string) => `• ${bullet}`)]), '', 'TECHNICAL SKILLS', resume.skills.join(', ')].join('\n');
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
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

  return <div className="min-h-screen bg-[#f7f8fc] text-slate-900 pb-16">
    <div className="absolute inset-x-0 top-0 h-[350px] overflow-hidden bg-slate-950"><div className="absolute -top-32 left-[10%] h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[110px]" /><div className="absolute right-[8%] top-4 h-80 w-80 rounded-full bg-cyan-500/20 blur-[110px]" /></div>
    <header className="relative z-10 border-b border-white/10"><div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8"><div className="flex items-center gap-3 text-white">{onBackToDashboard ? <button onClick={onBackToDashboard} className="mr-1 text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /></button> : <Link href="/dashboard" className="mr-1 text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link>}<div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500"><Sparkles className="h-4 w-4" /></div><div><p className="font-heading font-extrabold">ApplyAI</p><p className="text-[10px] text-slate-400">Resume studio</p></div></div><span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 sm:flex"><ShieldCheck className="h-3.5 w-3.5" />Grounded tailoring</span></div></header>
    <main className="relative z-10 mx-auto max-w-7xl px-5 pt-8 lg:px-8">
      <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="text-white"><span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-violet-200">Step 4 of 5 · Jake&apos;s Resume</span><h1 className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl">Tailored resume</h1><p className="mt-1 text-sm text-slate-300">Structured for <strong className="text-white">{job?.title || 'your target role'} · {job?.company || 'your target company'}</strong></p></div><div className="flex flex-wrap gap-2"><div className="flex rounded-xl border border-white/15 bg-white/10 p-1 text-xs font-semibold"><button onClick={() => setMode('tailored')} className={`rounded-lg px-3 py-1.5 ${mode === 'tailored' ? 'bg-white text-violet-700' : 'text-slate-300'}`}>Tailored</button><button onClick={() => setMode('original')} className={`rounded-lg px-3 py-1.5 ${mode === 'original' ? 'bg-white text-slate-900' : 'text-slate-300'}`}>Original</button></div><button onClick={copyResume} className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15">{copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button><button onClick={handleDownloadPdf} disabled={isExporting} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-violet-800 hover:bg-violet-50 cursor-pointer disabled:opacity-50"><Download className="h-3.5 w-3.5" />{isExporting ? 'Generating PDF...' : 'Download PDF'}</button></div></section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-3"><div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500"><span>Jake&apos;s Resume document preview</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1">ATS-friendly</span></div><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_25px_55px_-30px_rgba(15,23,42,.38)] sm:p-10"><article id="jake-resume" className="jake-resume mx-auto max-w-3xl text-[11px] leading-[1.35] text-black"><header className="border-b-2 border-black pb-2 text-center"><h2 className="font-serif text-[30px] font-bold leading-none">{resume.contact_info.name || 'Your Name'}</h2><p className="mt-1 text-[10px]">{[resume.contact_info.email, resume.contact_info.phone, resume.contact_info.location, resume.contact_info.linkedin, resume.contact_info.github].filter(Boolean).join(' | ')}</p></header><JakeSection title="Summary"><p>{resume.summary}</p></JakeSection><JakeSection title="Experience"><div className="space-y-3">{resume.work_experience.map((item: any, index: number) => <div key={index}><div className="flex justify-between gap-3 font-bold"><span>{item.company}</span><span className="whitespace-nowrap">{[item.start_date, item.end_date].filter(Boolean).join(' - ')}</span></div><div className="flex justify-between gap-3 italic"><span>{item.job_title}</span><span>{item.location}</span></div><ul className="mt-0.5 list-disc pl-4">{(item.responsibilities || []).map((bullet: string, bulletIndex: number) => <li key={bulletIndex}>{bullet}</li>)}</ul></div>)}</div></JakeSection>{resume.projects?.length > 0 && <JakeSection title="Projects"><div className="space-y-2">{resume.projects.map((item: any, index: number) => <div key={index}><p className="font-bold">{item.title}{item.technologies?.length ? <span className="font-normal"> | {item.technologies.join(', ')}</span> : null}</p><p>{item.description}</p></div>)}</div></JakeSection>}{resume.education?.length > 0 && <JakeSection title="Education"><div className="space-y-1">{resume.education.map((item: any, index: number) => <div key={index} className="flex justify-between gap-3"><span><strong>{item.institution}</strong>{item.degree ? ` — ${item.degree}` : ''}</span><span className="whitespace-nowrap">{item.graduation_year}</span></div>)}</div></JakeSection>}<JakeSection title="Technical Skills"><p><strong>Languages & Technologies:</strong> {resume.skills.join(', ')}</p></JakeSection></article></div></motion.div>
        <aside className="space-y-5"><InfoCard icon={<CheckCircle2 className="h-4 w-4" />} title="Jake&apos;s Resume format" color="text-violet-600"><p>Compact, recruiter-friendly structure with clear section rules, aligned dates, and focused technical content.</p><div className="mt-4 grid gap-2 text-xs text-slate-600"><p className="flex gap-2"><Check className="h-4 w-4 text-emerald-500" />Centered contact header</p><p className="flex gap-2"><Check className="h-4 w-4 text-emerald-500" />Concise experience bullets</p><p className="flex gap-2"><Check className="h-4 w-4 text-emerald-500" />Scannable skills section</p></div></InfoCard><InfoCard icon={<Eye className="h-4 w-4" />} title="Highlighted evidence" color="text-cyan-600"><div className="flex flex-wrap gap-1.5">{keywords.map((item: string) => <span key={item} className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-800">{item}</span>)}</div></InfoCard><InfoCard icon={<TriangleAlert className="h-4 w-4" />} title="Keep it truthful" color="text-amber-600"><p>Missing requirements are intentionally excluded from the resume. Add them only after gaining genuine experience.</p>{missingSkills.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{missingSkills.slice(0, 6).map((item: string) => <span key={item} className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">{item}</span>)}</div>}</InfoCard></aside>
      </div>
      <section className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-slate-900 p-6 text-center text-white sm:flex-row sm:text-left"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">Application package</p><h2 className="mt-1 font-heading text-xl font-extrabold">Your Jake-formatted resume is ready.</h2><p className="mt-1 text-sm text-indigo-100">Complete the application with a targeted cover letter.</p></div><button onClick={onGoToCoverLetter} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 hover:bg-violet-50"><Mail className="h-4 w-4" />Generate cover letter<ArrowRight className="h-4 w-4" /></button></section>
    </main>
  </div>;
};

function JakeSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-4"><h3 className="mb-1 border-b border-black pb-0.5 text-[12px] font-bold uppercase tracking-wide">{title}</h3>{children}</section>; }
function InfoCard({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) { return <div className="rounded-3xl border border-slate-200 bg-white p-5 text-xs leading-5 text-slate-600 shadow-[0_15px_35px_-25px_rgba(15,23,42,.35)]"><div className={`mb-3 flex items-center gap-2 font-bold text-slate-900`}><span className={color}>{icon}</span>{title}</div>{children}</div>; }

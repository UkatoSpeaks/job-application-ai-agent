'use client';

import { useState } from 'react';
import { ApplyAiLogo } from '@/components/ApplyAiLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, ChevronUp, Gauge, Lightbulb, Mail, MapPin, PenTool, RefreshCw, Sparkles, Target, TrendingUp, TriangleAlert, WandSparkles, ShieldCheck } from 'lucide-react';

import { motion } from 'framer-motion';
import { JobAgentResponse } from '@/types';

interface JobAnalysisDashboardProps {
  data?: JobAgentResponse | null;
  onReset?: () => void;
  onTailorResume?: () => void;
  onGenerateCoverLetter?: () => void;
}

const percentage = (value: number | undefined, fallback: number) =>
  value === undefined || value === null
    ? fallback
    : Math.max(0, Math.min(100, Math.round(value <= 1 ? value * 100 : value)));

export const JobAnalysisDashboard: React.FC<JobAnalysisDashboardProps> = ({
  data,
  onReset,
  onTailorResume,
  onGenerateCoverLetter,
}) => {
  const [showResponsibilities, setShowResponsibilities] = useState(false);

  // Fresh Empty Dashboard state for new users with no prior activity
  if (!data || !data.job) {
    return (
      <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-purple-500 selection:text-white pb-20">
        <header className="sticky top-0 z-40 bg-surface border-b border-line-soft shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
            <ApplyAiLogo size="sm" withText textClassName="text-ink text-base" />

            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {onReset && (
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line-soft bg-surface px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-canvas transition cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-muted" />
                  <span>New Analysis</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-12 space-y-8">
          <div className="text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-600 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Welcome to your Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
                You don&apos;t have any saved job analyses yet. Run your first AI match report by pasting a job URL and uploading your master PDF resume.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-xs font-bold shadow-md shadow-purple-600/20 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Start Your First Job Analysis</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-6 border-t border-line-soft">
            <div className="p-5 rounded-2xl border border-line-soft bg-surface shadow-xs space-y-2 text-center">
              <div className="text-2xl font-extrabold text-ink font-heading">0</div>
              <p className="text-xs font-bold text-ink uppercase tracking-wider">Analyses Saved</p>
              <p className="text-[11px] text-muted-2">All your analyses will be saved automatically</p>
            </div>

            <div className="p-5 rounded-2xl border border-line-soft bg-surface shadow-xs space-y-2 text-center">
              <div className="text-2xl font-extrabold text-ink font-heading">0%</div>
              <p className="text-xs font-bold text-ink uppercase tracking-wider">Average Match</p>
              <p className="text-[11px] text-muted-2">Calculated across your target jobs</p>
            </div>

            <div className="p-5 rounded-2xl border border-line-soft bg-surface shadow-xs space-y-2 text-center">
              <div className="text-2xl font-extrabold text-purple-600 font-heading">Ready</div>
              <p className="text-xs font-bold text-ink uppercase tracking-wider">AI Tailoring</p>
              <p className="text-[11px] text-muted-2">Instant resume & cover letter generation</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const job = data.job;
  const match = data.match;
  const matchScore = percentage(match?.score, 0);
  const similarityScore = percentage(match?.similarity, 0);
  const keywordScore = Math.min(100, Math.round(matchScore * 1.06));
  const matchedSkills = match?.matched_skills || [];
  const missingSkills = match?.missing_skills || [];
  const recommendations = match?.recommendations || [];
  const scoreColor = matchScore >= 75 ? '#059669' : matchScore >= 50 ? '#d97706' : '#dc2626';
  const alignment = matchScore >= 75 ? 'Strong alignment' : matchScore >= 50 ? 'Promising alignment' : 'Needs tailoring';


  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line-soft shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApplyAiLogo size="sm" withText textClassName="text-ink text-base" />

          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Validation Passed</span>
            </span>

            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line-soft bg-surface px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-canvas transition cursor-pointer shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted" />
                <span>New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line-soft pb-5"
        >
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/80 uppercase tracking-wider mb-1">
              <WandSparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Step 3 of 5 • Match Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {job?.title || 'Senior Developer'}
            </h1>
            <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
              <strong className="font-semibold text-ink">{job?.company || 'Target Company'}</strong> · {job?.location || 'Location not specified'}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              Recommendation
            </p>
            <p className="mt-0.5 font-bold text-sm text-emerald-900">{alignment}</p>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="grid gap-4 sm:grid-cols-3"
            >
              <ScoreCard label="Overall match" value={matchScore} color={scoreColor} icon={<Target className="h-4 w-4" />} primary />
              <ScoreCard label="Semantic fit" value={similarityScore} color="#7c3aed" icon={<TrendingUp className="h-4 w-4" />} />
              <ScoreCard label="Keyword coverage" value={keywordScore} color="#0284c7" icon={<Gauge className="h-4 w-4" />} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-2xl border border-line-soft bg-surface p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-700">Skills intelligence</p>
                  <h2 className="mt-1 text-lg font-bold text-ink">Your strongest evidence</h2>
                </div>
                <span className="rounded-full border border-line-soft bg-canvas px-3 py-1 text-xs font-semibold text-ink">
                  {matchedSkills.length} matched · {missingSkills.length} to address
                </span>
              </div>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <SkillGroup title="Already demonstrated" skills={matchedSkills} good />
                <SkillGroup title="Opportunities to address" skills={missingSkills} />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-line-soft bg-surface p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-line-soft pb-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Next best actions</p>
                  <h2 className="text-base font-bold text-ink">How to improve this application</h2>
                </div>
              </div>

              <div className="grid gap-3">
                {recommendations.slice(0, 3).map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-canvas p-3.5 border border-line-soft">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      {index + 1}
                    </span>
                    <p className="text-xs leading-5 text-ink font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <aside className="space-y-6">
            <motion.section
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-2xl border border-line-soft bg-surface p-5 text-ink shadow-sm space-y-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-700 border-b border-line-soft pb-2">
                Match profile
              </p>
              <div className="space-y-3">
                <Metric label="Skills match" value={matchScore} color="bg-emerald-500" />
                <Metric label="Keyword signal" value={keywordScore} color="bg-sky-500" />
                <Metric label="Context alignment" value={similarityScore} color="bg-purple-600" />
              </div>
              <div className="border-t border-line-soft pt-3 text-xs leading-5 text-muted">
                A tailored resume makes your most relevant experience easier for recruiters to find.
              </div>
            </motion.section>

            <section className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm space-y-3">
              <button
                onClick={() => setShowResponsibilities(!showResponsibilities)}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-2">Role brief</p>
                  <h2 className="text-base font-bold text-ink">Job overview</h2>
                </span>
                {showResponsibilities ? <ChevronUp className="h-4 w-4 text-muted-2" /> : <ChevronDown className="h-4 w-4 text-muted-2" />}
              </button>

              <p className="text-xs leading-5 text-ink">
                {job?.summary || 'Review the role requirements and tailor the application around your strongest relevant experience.'}
              </p>

              {showResponsibilities && (
                <ul className="space-y-2 border-t border-line-soft pt-3">
                  {(job?.responsibilities || []).map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-5 text-ink">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 stroke-[3]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-6 rounded-2xl border-[2.5px] border-line bg-ink p-6 text-canvas shadow-brutal-md sm:flex sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-400">Ready for the next step?</p>
            <h2 className="mt-1 text-xl font-bold font-heading">Turn this analysis into an application.</h2>
            <p className="mt-1 text-xs text-canvas/70">Use the role requirements to personalize your resume and cover letter.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-0">
            <button
              onClick={onTailorResume}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-purple-600/30 transition cursor-pointer"
            >
              <PenTool className="h-4 w-4" />
              Tailor resume
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onGenerateCoverLetter}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-canvas/30 bg-canvas/10 px-4 py-2.5 text-xs font-bold text-canvas hover:bg-canvas/15 transition cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              Cover letter
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

function ScoreCard({ label, value, color, icon, primary = false }: { label: string; value: number; color: string; icon: React.ReactNode; primary?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${primary ? 'border-purple-200 bg-purple-50/40' : 'border-line-soft bg-surface'} shadow-sm space-y-3`}>
      <div className="flex items-center justify-between text-muted">
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-heading text-3xl font-extrabold tracking-tight text-ink">{value}%</span>
        <span className="mb-1 text-xs font-semibold text-muted-2">out of 100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SkillGroup({ title, skills, good = false }: { title: string; skills: string[]; good?: boolean }) {
  return (
    <div>
      <div className={`mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] ${good ? 'text-emerald-700' : 'text-amber-700'}`}>
        {good ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <TriangleAlert className="h-4 w-4 text-amber-600" />}
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
              good ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink">
        <span>{label}</span>
        <span className="font-bold text-ink">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

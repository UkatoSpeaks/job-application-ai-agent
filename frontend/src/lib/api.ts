import {
  ResumeUploadResponse,
  JobMatchResponse,
  ResumeTailorResponse,
  JobAgentResponse,
  AuthResponse,
  User,
  ParsedResume,
  ContactInfo,
  WorkExperience,
  Education,
  Project,
  HistoryItem,
} from '@/types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    'NEXT_PUBLIC_API_URL is not set; falling back to http://localhost:8000, which will not work in production.'
  );
}
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

/** Loose shape of a resume as returned by the backend, before normalization. */
interface RawResume {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
  contact_info?: ContactInfo;
  summary?: string;
  skills?: string[] | Record<string, string[]>;
  experience?: RawExperience[];
  work_experience?: RawExperience[];
  education?: RawEducation[];
  projects?: RawProject[];
  certifications?: (string | { title?: string })[];
}

interface RawExperience {
  role?: string;
  job_title?: string;
  company?: string;
  location?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  responsibilities?: string[];
  bullet_points?: string[];
}

interface RawEducation {
  degree?: string;
  institution?: string;
  location?: string;
  duration?: string;
  graduation_year?: string;
}

interface RawProject {
  title?: string;
  description?: string | string[];
  tech_stack?: string[];
  technologies?: string[];
  links?: string[];
}

function normalizeResume(resume: RawResume | null | undefined): ParsedResume | null {
  if (!resume) return null;
  const skills = Array.isArray(resume.skills)
    ? resume.skills
    : (Object.values(resume.skills || {}).flat() as string[]);

  const contact = resume.contact_info || {};

  return {
    contact_info: {
      name: resume.name || contact.name || '',
      email: resume.email || contact.email || '',
      phone: resume.phone || contact.phone || '',
      linkedin: resume.linkedin || contact.linkedin || '',
      github: resume.github || contact.github || '',
      portfolio: resume.portfolio || contact.portfolio || '',
      location: resume.location || contact.location || '',
    },
    summary: resume.summary || '',
    skills: skills || [],
    work_experience: (resume.experience || resume.work_experience || []).map(
      (item: RawExperience): WorkExperience => ({
        job_title: item.role || item.job_title || '',
        company: item.company || '',
        location: item.location || '',
        start_date: item.duration || item.start_date || '',
        end_date: item.end_date || '',
        responsibilities: item.responsibilities || item.bullet_points || [],
      })
    ),
    education: (resume.education || []).map(
      (item: RawEducation): Education => ({
        degree: item.degree || '',
        institution: item.institution || '',
        location: item.location || '',
        graduation_year: item.duration || item.graduation_year || '',
      })
    ),
    projects: (resume.projects || []).map(
      (item: RawProject): Project => ({
        title: item.title || '',
        description: Array.isArray(item.description) ? item.description.join(' ') : item.description || '',
        technologies: item.tech_stack || item.technologies || [],
        links: item.links || [],
      })
    ),
    certifications: (resume.certifications || [])
      .map((item) => (typeof item === 'string' ? item : item.title))
      .filter((item): item is string => Boolean(item)),
  };
}

/** Extracts a user-facing message from an unknown thrown value. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

interface ApiValidationIssue {
  message: string;
}

interface ApiErrorBody {
  detail?: string;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit,
  fallbackErrorMessage: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorData: ApiErrorBody = await response.json().catch(() => ({ detail: fallbackErrorMessage }));
    throw new Error(errorData.detail || fallbackErrorMessage);
  }

  return response.json();
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
}

/**
 * Upload and analyze a PDF resume
 */
export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const data = await apiRequest<{
    parsed_resume: RawResume;
    score: { overall: number; breakdown: Record<string, number> };
    validation: { valid: boolean; errors?: ApiValidationIssue[]; warnings?: ApiValidationIssue[]; info?: ApiValidationIssue[] };
    analysis: { strengths?: string[]; weaknesses?: string[]; recommendations?: string[] };
    filename: string;
    extracted_text: string;
  }>(
    '/resume/upload',
    { method: 'POST', body: formData },
    'Failed to upload and analyze resume'
  );

  return {
    filename: data.filename,
    extracted_text: data.extracted_text,
    parsed_resume: normalizeResume(data.parsed_resume) as ParsedResume,
    score: {
      total_score: data.score.overall,
      breakdown: data.score.breakdown,
    },
    validation: {
      is_valid: data.validation.valid,
      score: data.score.overall,
      issues: [...(data.validation.errors || []), ...(data.validation.warnings || [])].map((issue) => issue.message),
      suggestions: (data.validation.info || []).map((issue) => issue.message),
    },
    analysis: {
      strengths: data.analysis.strengths || [],
      weaknesses: data.analysis.weaknesses || [],
      actionable_recommendations: data.analysis.recommendations || [],
    },
  };
}

/**
 * Match a PDF resume against a job description text
 */
export async function matchResume(file: File, jobDescription: string): Promise<JobMatchResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const data = await apiRequest<JobMatchResponse & { resume: RawResume }>(
    '/resume/match',
    { method: 'POST', body: formData },
    'Failed to match resume with job description'
  );

  return {
    ...data,
    resume: normalizeResume(data.resume) as ParsedResume,
  };
}

interface RawTailorResponse {
  improved_summary?: string;
  improved_skills?: string[];
  keywords_to_add?: string[];
  ats_tips?: string[];
  experience_improvements?: { company: string; improvements?: string[] }[];
}

/**
 * Tailor resume bullet points for a targeted job description
 */
export async function tailorResume(file: File, jobDescription: string): Promise<ResumeTailorResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const data = await apiRequest<RawTailorResponse>(
    '/resume/tailor',
    { method: 'POST', body: formData },
    'Failed to tailor resume'
  );

  const emptyResume: ParsedResume = {
    contact_info: {},
    summary: '',
    skills: [],
    work_experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  return {
    original_resume: emptyResume,
    tailored_resume: {
      ...emptyResume,
      summary: data.improved_summary || '',
      skills: data.improved_skills || [],
      work_experience: (data.experience_improvements || []).map((item) => ({
        job_title: '',
        company: item.company,
        responsibilities: item.improvements || [],
      })),
    },
    summary_of_changes: data.ats_tips || [],
    targeted_keywords_added: data.keywords_to_add || [],
  };
}

/**
 * Generate AI Cover Letter from PDF resume & job description
 */
export async function generateCoverLetter(
  file: File,
  jobDescription: string,
  tone: string = 'professional'
): Promise<{ cover_letter: string; email_subject?: string; email_body?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);
  formData.append('tone', tone);

  return apiRequest(
    '/resume/cover-letter',
    { method: 'POST', body: formData },
    'Failed to generate cover letter'
  );
}

/**
 * Run full end-to-end Job Agent Pipeline from a Job Posting URL + PDF resume
 */
export async function runJobAgentPipeline(file: File, jobUrl: string): Promise<JobAgentResponse> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_url', jobUrl);

  return apiRequest(
    '/job-agent/analyze',
    { method: 'POST', headers: authHeaders(getStoredToken()), body: formData },
    'Failed to analyze job URL'
  );
}

/**
 * Fetch job analysis history for the current authenticated user
 */
export async function getJobAnalysisHistoryApi(token?: string): Promise<HistoryItem[]> {
  const authToken = token || getStoredToken();
  if (!authToken) return [];

  try {
    return await apiRequest<HistoryItem[]>(
      '/job-agent/history',
      { method: 'GET', headers: authHeaders(authToken) },
      'Failed to fetch job analysis history'
    );
  } catch {
    return [];
  }
}

/**
 * Fetch latest job analysis for the current authenticated user
 */
export async function getLatestJobAnalysisApi(token?: string): Promise<JobAgentResponse | null> {
  const authToken = token || getStoredToken();
  if (!authToken) return null;

  try {
    return await apiRequest<JobAgentResponse>(
      '/job-agent/latest',
      { method: 'GET', headers: authHeaders(authToken) },
      'Failed to fetch latest job analysis'
    );
  } catch {
    return null;
  }
}

/**
 * Fetch specific job analysis by ID for the current authenticated user
 */
export async function getJobAnalysisByIdApi(analysisId: string, token?: string): Promise<JobAgentResponse | null> {
  const authToken = token || getStoredToken();
  if (!authToken) return null;

  try {
    return await apiRequest<JobAgentResponse>(
      `/job-agent/analysis/${analysisId}`,
      { method: 'GET', headers: authHeaders(authToken) },
      'Failed to fetch job analysis'
    );
  } catch {
    return null;
  }
}

/**
 * Export tailored resume as Jake's Resume PDF
 */
export async function exportResumePdf(resumeData: ParsedResume): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/export/resume-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resumeData),
  });

  if (!response.ok) {
    throw new Error('Failed to generate resume PDF');
  }

  return response.blob();
}

/**
 * Export cover letter as PDF
 */
export async function exportCoverLetterPdf(coverLetterData: Record<string, unknown>): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/export/cover-letter-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coverLetterData),
  });

  if (!response.ok) {
    throw new Error('Failed to generate cover letter PDF');
  }

  return response.blob();
}

/**
 * Trigger browser file download from Blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Sign up a new user account
 */
export async function signUpApi(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiRequest(
    '/auth/signup',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    },
    'Sign up failed'
  );
}

/**
 * Sign in existing user account
 */
export async function signInApi(email: string, password: string): Promise<AuthResponse> {
  return apiRequest(
    '/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    },
    'Incorrect email or password'
  );
}

/**
 * Fetch current user profile using JWT token
 */
export async function getMeApi(token: string): Promise<User> {
  return apiRequest(
    '/auth/me',
    { method: 'GET', headers: authHeaders(token) },
    'Failed to authenticate user'
  );
}

import {
  ResumeUploadResponse,
  JobMatchResponse,
  ResumeTailorResponse,
  JobAgentResponse,
  AuthResponse,
  User,
} from '@/types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

function normalizeResume(resume: any) {
  if (!resume) return null;
  const skills = Array.isArray(resume.skills)
    ? resume.skills
    : Object.values(resume.skills || {}).flat() as string[];

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
    work_experience: (resume.experience || resume.work_experience || []).map((item: any) => ({
      job_title: item.role || item.job_title || '',
      company: item.company || '',
      location: item.location || '',
      start_date: item.duration || item.start_date || '',
      end_date: item.end_date || '',
      responsibilities: item.responsibilities || item.bullet_points || [],
    })),
    education: (resume.education || []).map((item: any) => ({
      degree: item.degree || '',
      institution: item.institution || '',
      location: item.location || '',
      graduation_year: item.duration || item.graduation_year || '',
    })),
    projects: (resume.projects || []).map((item: any) => ({
      title: item.title || '',
      description: Array.isArray(item.description) ? item.description.join(' ') : (item.description || ''),
      technologies: item.tech_stack || item.technologies || [],
      links: item.links || [],
    })),
    certifications: (resume.certifications || []).map((item: any) => typeof item === 'string' ? item : item.title).filter(Boolean),
  };
}

/**
 * Upload and analyze a PDF resume
 */
export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to parse resume' }));
    throw new Error(errorData.detail || 'Failed to upload and analyze resume');
  }

  const data = await response.json();
  return {
    ...data,
    parsed_resume: normalizeResume(data.parsed_resume),
    score: {
      total_score: data.score.overall,
      breakdown: data.score.breakdown,
    },
    validation: {
      is_valid: data.validation.valid,
      score: data.score.overall,
      issues: [...(data.validation.errors || []), ...(data.validation.warnings || [])].map((issue: any) => issue.message),
      suggestions: (data.validation.info || []).map((issue: any) => issue.message),
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

  const response = await fetch(`${API_BASE_URL}/resume/match`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Match analysis failed' }));
    throw new Error(errorData.detail || 'Failed to match resume with job description');
  }

  const data = await response.json();
  return {
    ...data,
    resume: normalizeResume(data.resume),
  };
}

/**
 * Tailor resume bullet points for a targeted job description
 */
export async function tailorResume(file: File, jobDescription: string): Promise<ResumeTailorResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE_URL}/resume/tailor`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Resume tailoring failed' }));
    throw new Error(errorData.detail || 'Failed to tailor resume');
  }

  const data = await response.json();
  return {
    original_resume: { contact_info: {}, summary: '', skills: [], work_experience: [], education: [], projects: [], certifications: [] },
    tailored_resume: {
      contact_info: {},
      summary: data.improved_summary || '',
      skills: data.improved_skills || [],
      work_experience: (data.experience_improvements || []).map((item: any) => ({
        job_title: '', company: item.company, responsibilities: item.improvements || [],
      })),
      education: [], projects: [], certifications: [],
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
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);
  formData.append('tone', tone);

  const response = await fetch(`${API_BASE_URL}/resume/cover-letter`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Cover letter generation failed' }));
    throw new Error(errorData.detail || 'Failed to generate cover letter');
  }

  return response.json();
}

/**
 * Run full end-to-end Job Agent Pipeline from a Job Posting URL + PDF resume
 */
export async function runJobAgentPipeline(file: File, jobUrl: string): Promise<JobAgentResponse> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_url', jobUrl);

  const response = await fetch(`${API_BASE_URL}/job-agent/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Job Agent pipeline failed' }));
    throw new Error(errorData.detail || 'Failed to analyze job URL');
  }

  return response.json();
}

/**
 * Export tailored resume as Jake's Resume PDF
 */
export async function exportResumePdf(resumeData: any): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/export/resume-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
export async function exportCoverLetterPdf(coverLetterData: any): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/export/cover-letter-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Sign up failed' }));
    throw new Error(errorData.detail || 'Sign up failed');
  }

  return response.json();
}

/**
 * Sign in existing user account
 */
export async function signInApi(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Sign in failed' }));
    throw new Error(errorData.detail || 'Incorrect email or password');
  }

  return response.json();
}

/**
 * Fetch current user profile using JWT token
 */
export async function getMeApi(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(errorData.detail || 'Failed to authenticate user');
  }

  return response.json();
}


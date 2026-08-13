import {
  ResumeUploadResponse,
  JobMatchResponse,
  ResumeTailorResponse,
  JobAgentResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

  return response.json();
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

  return response.json();
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

  return response.json();
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

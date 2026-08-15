export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

export interface WorkExperience {
  job_title: string;
  company: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  field_of_study?: string;
  institution: string;
  graduation_year?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
}

export interface ParsedResume {
  contact_info: ContactInfo;
  summary: string;
  skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
}

export interface ResumeValidation {
  is_valid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface ResumeScore {
  total_score: number;
  breakdown: Record<string, number>;
}

export interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  actionable_recommendations: string[];
}

export interface ResumeUploadResponse {
  filename: string;
  extracted_text: string;
  parsed_resume: ParsedResume;
  validation: ResumeValidation;
  score: ResumeScore;
  analysis: ResumeAnalysis;
}

export interface ParsedJobDescription {
  title: string;
  company: string;
  location?: string;
  summary: string;
  responsibilities: string[];
  required_skills: string[];
  preferred_skills?: string[];
  qualifications?: string[];
}

export interface MatchDetails {
  score?: number;
  similarity?: number;
  matched_skills: string[];
  missing_skills: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  recommendations: string[];
}

export interface JobMatchResponse {
  resume: ParsedResume;
  job_description: ParsedJobDescription;
  match: MatchDetails;
  similarity: number;
}

export interface ResumeTailorResponse {
  original_resume: ParsedResume;
  tailored_resume: ParsedResume;
  summary_of_changes: string[];
  targeted_keywords_added: string[];
}

export interface JobAgentResponse {
  success: boolean;
  job: ParsedJobDescription;
  match: MatchDetails;
  original_resume?: ParsedResume | null;
  tailored_resume?: ParsedResume | any;
  cover_letter?: string | {
    cover_letter?: string;
    email_subject?: string;
    email_body?: string;
    recipient?: string;
    company?: string;
    role?: string;
    content?: string;
  };
  validation?: {
    tailored_resume?: any;
    cover_letter?: any;
  };
}

export type ActiveTab = 'job-agent' | 'resume-analyzer' | 'job-matcher' | 'resume-tailor' | 'cover-letter';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getErrorMessage, uploadResume } from './api';

describe('getErrorMessage', () => {
  it('returns the message from an Error instance', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback')).toBe('boom');
  });

  it('returns the fallback for a non-Error thrown value', () => {
    expect(getErrorMessage('just a string', 'fallback')).toBe('fallback');
  });

  it('returns the fallback for an Error with an empty message', () => {
    expect(getErrorMessage(new Error(''), 'fallback')).toBe('fallback');
  });

  it('returns the fallback for null/undefined', () => {
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
    expect(getErrorMessage(undefined, 'fallback')).toBe('fallback');
  });
});

describe('uploadResume response normalization', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('normalizes a backend resume payload with dict-shaped skills and alternate field names', async () => {
    const backendPayload = {
      filename: 'resume.pdf',
      extracted_text: 'raw text',
      parsed_resume: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        skills: { languages: ['Python', 'TypeScript'], tools: ['Git'] },
        experience: [
          {
            role: 'Software Engineer',
            company: 'Acme Corp',
            duration: '2021-2023',
            bullet_points: ['Built things', 'Shipped things'],
          },
        ],
        education: [{ degree: 'BSc CS', institution: 'State University', duration: '2021' }],
        projects: [{ title: 'Project X', description: ['Did a thing', 'Did another thing'], tech_stack: ['React'] }],
        certifications: [{ title: 'AWS Certified' }, 'Scrum Master'],
      },
      score: { overall: 82, breakdown: { skills: 90, experience: 75 } },
      validation: {
        valid: true,
        errors: [],
        warnings: [{ message: 'Consider adding more metrics' }],
        info: [{ message: 'Looks good overall' }],
      },
      analysis: {
        strengths: ['Strong technical skills'],
        weaknesses: ['Limited leadership experience'],
        recommendations: ['Add quantifiable achievements'],
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => backendPayload,
    });

    const file = new File(['dummy'], 'resume.pdf', { type: 'application/pdf' });
    const result = await uploadResume(file);

    expect(result.parsed_resume.contact_info.name).toBe('Jane Doe');
    expect(result.parsed_resume.skills).toEqual(['Python', 'TypeScript', 'Git']);
    expect(result.parsed_resume.work_experience[0]).toMatchObject({
      job_title: 'Software Engineer',
      company: 'Acme Corp',
      start_date: '2021-2023',
      responsibilities: ['Built things', 'Shipped things'],
    });
    expect(result.parsed_resume.projects[0]).toMatchObject({
      title: 'Project X',
      description: 'Did a thing Did another thing',
      technologies: ['React'],
    });
    expect(result.parsed_resume.certifications).toEqual(['AWS Certified', 'Scrum Master']);
    expect(result.score.total_score).toBe(82);
    expect(result.validation.issues).toEqual(['Consider adding more metrics']);
    expect(result.validation.suggestions).toEqual(['Looks good overall']);
  });

  it('throws with the backend detail message when the request fails', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Unsupported file type' }),
    });

    const file = new File(['dummy'], 'resume.txt', { type: 'text/plain' });
    await expect(uploadResume(file)).rejects.toThrow('Unsupported file type');
  });
});

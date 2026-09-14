import { describe, it, expect } from 'vitest';
import { categorizeSkills } from './TailoredResumeView';

describe('categorizeSkills', () => {
  it('returns an empty array for null/undefined input', () => {
    expect(categorizeSkills(null)).toEqual([]);
    expect(categorizeSkills(undefined)).toEqual([]);
  });

  it('groups a flat skill list into known categories', () => {
    const result = categorizeSkills(['Python', 'React', 'Docker', 'MongoDB']);
    const categoryNames = result.map((c) => c.category);

    expect(categoryNames).toContain('Languages');
    expect(categoryNames).toContain('Frontend');
    expect(categoryNames).toContain('Tools & Platforms');
    expect(categoryNames).toContain('Databases');
  });

  it('puts unrecognized skills into "Other Skills"', () => {
    const result = categorizeSkills(['SomeObscureSkill']);
    expect(result).toEqual([{ category: 'Other Skills', skills: ['SomeObscureSkill'] }]);
  });

  it('passes through an already-categorized record shape unchanged', () => {
    const result = categorizeSkills({ Languages: ['Python'], Frontend: ['React'] });
    expect(result).toEqual([
      { category: 'Languages', skills: ['Python'] },
      { category: 'Frontend', skills: ['React'] },
    ]);
  });

  it('does not double-count a skill matched by an earlier category', () => {
    const result = categorizeSkills(['Redis']);
    expect(result).toEqual([{ category: 'Databases', skills: ['Redis'] }]);
  });
});

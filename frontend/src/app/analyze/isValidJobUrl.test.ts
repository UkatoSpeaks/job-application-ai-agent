import { describe, it, expect } from 'vitest';
import { isValidJobUrl } from './page';

describe('isValidJobUrl', () => {
  it('accepts a well-formed https URL', () => {
    expect(isValidJobUrl('https://example.com/careers/senior-engineer')).toBe(true);
  });

  it('accepts a well-formed http URL', () => {
    expect(isValidJobUrl('http://example.com/jobs/1')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidJobUrl('')).toBe(false);
  });

  it('rejects a blank/whitespace-only string', () => {
    expect(isValidJobUrl('   ')).toBe(false);
  });

  it('rejects a non-URL string', () => {
    expect(isValidJobUrl('not a url')).toBe(false);
  });

  it('rejects unsupported protocols like javascript:', () => {
    expect(isValidJobUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects unsupported protocols like ftp:', () => {
    expect(isValidJobUrl('ftp://example.com/file')).toBe(false);
  });

  it('rejects a URL with a hostname that has no dot', () => {
    expect(isValidJobUrl('https://localhost')).toBe(false);
  });
});

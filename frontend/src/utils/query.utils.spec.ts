import { describe, expect, it } from 'vitest';
import { buildQueryString } from './query.utils';

describe('buildQueryString', () => {
  it('returns empty string when no params are set', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('returns query string for defined params', () => {
    expect(buildQueryString({ city: 'A', state: undefined })).toBe('?city=A');
  });
});

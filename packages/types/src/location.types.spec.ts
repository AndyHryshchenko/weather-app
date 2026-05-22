import { describe, expect, it } from 'vitest';
import { LocationSource } from './location.types';

describe('LocationSource', () => {
  it('has GPS and SEARCH values', () => {
    expect(LocationSource.GPS).toBe('GPS');
    expect(LocationSource.SEARCH).toBe('SEARCH');
  });
});

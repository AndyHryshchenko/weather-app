import { describe, expect, it } from 'vitest';
import { normalizeCountryCode } from './country-code.util';

describe('normalizeCountryCode', () => {
  it('returns undefined when country is absent or blank', () => {
    expect(normalizeCountryCode(undefined)).toBeUndefined();
    expect(normalizeCountryCode('   ')).toBeUndefined();
  });

  it('uppercases two-letter codes', () => {
    expect(normalizeCountryCode('us')).toBe('US');
    expect(normalizeCountryCode('GB')).toBe('GB');
  });

  it('maps country names to ISO codes', () => {
    expect(normalizeCountryCode('United States')).toBe('US');
    expect(normalizeCountryCode('Germany')).toBe('DE');
    expect(normalizeCountryCode('Japan')).toBe('JP');
  });

  it('passes through unknown values unchanged', () => {
    expect(normalizeCountryCode('Not A Real Country')).toBe('Not A Real Country');
    expect(normalizeCountryCode('XX')).toBe('XX');
  });
});

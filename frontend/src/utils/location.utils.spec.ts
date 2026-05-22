import { describe, expect, it } from 'vitest';
import { formatLocationQueryLabel } from './location.utils';

describe('formatLocationQueryLabel', () => {
  it('formats city-based locations', () => {
    expect(
      formatLocationQueryLabel({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
      }),
    ).toBe('Charlotte, NC, US');
  });

  it('formats zip-first when city is absent', () => {
    expect(
      formatLocationQueryLabel({
        zip: '28105',
        state: 'NC',
        country: 'US',
      }),
    ).toBe('28105, NC, US');
  });
});

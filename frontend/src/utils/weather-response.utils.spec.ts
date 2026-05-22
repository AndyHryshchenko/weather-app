import { describe, expect, it } from 'vitest';
import { unwrapWeatherResponseData } from './weather-response.utils';

describe('unwrapWeatherResponseData', () => {
  it('unwraps envelope responses', () => {
    expect(
      unwrapWeatherResponseData<number[]>({ data: [1, 2], meta: {} }),
    ).toEqual([1, 2]);
  });

  it('returns arrays that are already unwrapped', () => {
    expect(unwrapWeatherResponseData<number[]>([1, 2])).toEqual([1, 2]);
  });

  it('throws for invalid response shapes', () => {
    expect(() => unwrapWeatherResponseData({ meta: {} })).toThrow(
      'Invalid weather API response shape',
    );
  });
});

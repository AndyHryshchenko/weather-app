import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { buildWeatherResponse } from './response.util';

describe('buildWeatherResponse', () => {
  it('wraps data with meta and units', () => {
    const response = buildWeatherResponse({ temp: 20 }, TemperatureUnit.METRIC);
    expect(response.data).toEqual({ temp: 20 });
    expect(response.meta.units).toBe(TemperatureUnit.METRIC);
    expect(response.meta.requestedAt).toBeTruthy();
  });

  it('omits units when not provided', () => {
    const response = buildWeatherResponse({ city: 'Test' });
    expect(response.meta.units).toBeUndefined();
  });
});

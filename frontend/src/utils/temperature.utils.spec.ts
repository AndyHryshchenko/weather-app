import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { formatTemperature } from './temperature.utils';

describe('formatTemperature', () => {
  it('formats metric temperatures', () => {
    expect(formatTemperature(22.4, TemperatureUnit.METRIC)).toBe('22°C');
  });

  it('formats imperial temperatures', () => {
    expect(formatTemperature(72.6, TemperatureUnit.IMPERIAL)).toBe('73°F');
  });
});

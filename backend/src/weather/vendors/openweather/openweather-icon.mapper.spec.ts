import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import { mapOpenWeatherIcon } from './openweather-icon.mapper';

describe('mapOpenWeatherIcon', () => {
  it('maps known icons', () => {
    expect(mapOpenWeatherIcon('01d')).toBe(WeatherIconCode.CLEAR_DAY);
    expect(mapOpenWeatherIcon('11n')).toBe(WeatherIconCode.THUNDERSTORM);
  });

  it('returns UNKNOWN for unmapped icons', () => {
    expect(mapOpenWeatherIcon('99x')).toBe(WeatherIconCode.UNKNOWN);
  });
});

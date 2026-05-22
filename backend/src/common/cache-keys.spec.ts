import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import {
  buildCurrentWeatherKey,
  buildForecastWeatherKey,
  buildGeocodeTextKey,
  buildHourlyWeatherKey,
  buildLocationKeyParts,
  buildForecast25DedupeKey,
  buildOneCallDedupeKey,
  buildReverseGeocodeKey,
} from './cache-keys';

describe('cache keys', () => {
  it('builds location key parts from city query', () => {
    expect(
      buildLocationKeyParts({ city: 'Charlotte', state: 'NC', country: 'US' }),
    ).toBe('charlotte|nc|us');
  });

  it('builds location key parts from zip', () => {
    expect(buildLocationKeyParts({ zip: '28105' })).toBe('28105');
  });

  it('builds location key parts from state and country when city and zip are absent', () => {
    expect(buildLocationKeyParts({ state: 'NC', country: 'US' })).toBe('|nc|us');
  });

  it('uses zip when city is only whitespace', () => {
    expect(buildLocationKeyParts({ city: '   ', zip: '28105' })).toBe('28105');
  });

  it('prefers city key parts when both city and zip are present', () => {
    expect(
      buildLocationKeyParts({
        city: 'Mooresville',
        zip: '28117',
        state: 'NC',
        country: 'US',
      }),
    ).toBe('mooresville|nc|us');
  });

  it('builds geocode and weather cache keys', () => {
    const query = { city: 'Charlotte', state: 'NC', country: 'US' };
    expect(buildGeocodeTextKey(query)).toBe(
      'geocode:text:charlotte|nc|us',
    );
    expect(buildCurrentWeatherKey(query, TemperatureUnit.METRIC)).toBe(
      'weather:current:charlotte|nc|us:metric',
    );
    expect(buildHourlyWeatherKey(query, TemperatureUnit.IMPERIAL)).toBe(
      'weather:hourly:charlotte|nc|us:imperial',
    );
    expect(buildForecastWeatherKey(query, TemperatureUnit.METRIC)).toBe(
      'weather:forecast:charlotte|nc|us:metric',
    );
  });

  it('builds reverse geocode key with 2 decimal precision', () => {
    expect(buildReverseGeocodeKey(35.1234, -80.9876)).toBe(
      'geocode:reverse:35.12|-80.99',
    );
  });

  it('builds one call dedupe key', () => {
    expect(buildOneCallDedupeKey(35.12345, -80.98765, TemperatureUnit.METRIC)).toBe(
      'onecall:35.1234|-80.9877:metric',
    );
  });

  it('builds forecast 2.5 dedupe key', () => {
    expect(
      buildForecast25DedupeKey(35.12345, -80.98765, TemperatureUnit.METRIC),
    ).toBe('forecast25:35.1234|-80.9877:metric');
  });
});

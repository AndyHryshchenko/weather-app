import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import {
  buildWeatherLocationQueryString,
  serializeLocationQueryKey,
  serializeWeatherRequestKey,
} from './location-query.utils';

describe('location-query utils', () => {
  it('prefers city key when both city and zip are present', () => {
    expect(
      serializeLocationQueryKey({
        city: 'Mooresville',
        zip: '28117',
        state: 'NC',
        country: 'US',
      }),
    ).toBe('city:Mooresville|state:NC|country:US');
  });

  it('serializes zip-based queries', () => {
    expect(
      serializeLocationQueryKey({ zip: '28105', country: 'US' }),
    ).toBe('zip:28105|country:US');
  });

  it('serializes zip-based queries without a country', () => {
    expect(serializeLocationQueryKey({ zip: '28105' })).toBe('zip:28105|country:');
  });

  it('serializes city-based queries', () => {
    expect(
      serializeLocationQueryKey({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
      }),
    ).toBe('city:Charlotte|state:NC|country:US');
  });

  it('serializes city-based queries with missing optional fields', () => {
    expect(serializeLocationQueryKey({ city: 'Charlotte' })).toBe(
      'city:Charlotte|state:|country:',
    );
  });

  it('serializes empty city strings through the fallback key shape', () => {
    expect(serializeLocationQueryKey({ city: '' })).toBe('city:|state:|country:');
  });

  it('serializes zip when city is omitted', () => {
    expect(
      serializeLocationQueryKey({ zip: '28105', country: 'US', city: undefined }),
    ).toBe('zip:28105|country:US');
  });

  it('serializes trimmed city keys without dropping the original city value', () => {
    expect(
      serializeLocationQueryKey({ city: '  Charlotte  ', state: 'NC', country: 'US' }),
    ).toBe('city:  Charlotte  |state:NC|country:US');
  });

  it('falls through when zip is an empty string', () => {
    expect(serializeLocationQueryKey({ zip: '', country: 'US' })).toBe(
      'city:|state:|country:US',
    );
  });

  it('serializes city-based queries with state but no country', () => {
    expect(
      serializeLocationQueryKey({ city: 'Charlotte', state: 'NC' }),
    ).toBe('city:Charlotte|state:NC|country:');
  });

  it('serializes state and country without city or zip', () => {
    expect(
      serializeLocationQueryKey({ state: 'Seoul', country: 'KR' }),
    ).toBe('city:|state:Seoul|country:KR');
  });

  it('serializes empty city-based queries', () => {
    expect(serializeLocationQueryKey({})).toBe('city:|state:|country:');
  });

  it('serializes country-only city-based queries', () => {
    expect(serializeLocationQueryKey({ country: 'US' })).toBe('city:|state:|country:US');
  });

  it('falls back to city key when city and zip are whitespace-only', () => {
    expect(serializeLocationQueryKey({ city: '   ', zip: '  ', country: 'US' })).toBe(
      'city:   |state:|country:US',
    );
  });

  it('uses zip key when city is whitespace-only but zip is present', () => {
    expect(serializeLocationQueryKey({ city: '   ', zip: '28105', country: 'US' })).toBe(
      'zip:28105|country:US',
    );
  });

  it('builds weather location query strings', () => {
    expect(
      buildWeatherLocationQueryString(
        { city: 'Charlotte', state: 'NC', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    ).toBe('?city=Charlotte&state=NC&country=US&units=metric');
    const zipQuery = buildWeatherLocationQueryString(
      { zip: '28105', country: 'US' },
      TemperatureUnit.IMPERIAL,
    );
    expect(zipQuery).toContain('zip=28105');
    expect(zipQuery).toContain('country=US');
    expect(zipQuery).toContain('units=imperial');
  });

  it('includes units in weather request keys', () => {
    expect(
      serializeWeatherRequestKey(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.IMPERIAL,
      ),
    ).toContain('units:imperial');
  });
});

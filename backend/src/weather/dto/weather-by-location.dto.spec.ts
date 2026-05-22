import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { WeatherByLocationDto } from './weather-by-location.dto';

const toDto = (value: object): WeatherByLocationDto =>
  plainToInstance(WeatherByLocationDto, value);

describe('WeatherByLocationDto', () => {
  it('allows state and country without city or zip', async () => {
    const errors = await validate(
      toDto({ state: 'Seoul', country: 'KR', units: 'metric' }),
    );
    expect(errors).toHaveLength(0);
  });

  it('requires city when zip and state+country are absent', async () => {
    const errors = await validate(toDto({ country: 'US' }));
    expect(errors.some((error) => error.property === 'city')).toBe(true);
    expect(errors.some((error) => error.property === 'zip')).toBe(true);
  });

  it('requires zip when city and state+country are absent', async () => {
    const errors = await validate(toDto({ state: 'NC' }));
    expect(errors.some((error) => error.property === 'city')).toBe(true);
    expect(errors.some((error) => error.property === 'zip')).toBe(true);
  });

  it('requires city or zip when only country is provided', async () => {
    const errors = await validate(toDto({ country: 'KR', units: 'metric' }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts city-only queries', async () => {
    const errors = await validate(
      toDto({ city: 'Charlotte', state: 'NC', country: 'US' }),
    );
    expect(errors).toHaveLength(0);
  });

  it('accepts zip-only queries', async () => {
    const errors = await validate(toDto({ zip: '28105', country: 'US' }));
    expect(errors).toHaveLength(0);
  });
});

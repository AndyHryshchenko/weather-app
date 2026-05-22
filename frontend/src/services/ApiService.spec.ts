import { describe, expect, it, vi, afterEach } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { ApiService } from './ApiService';

const mockCurrent = {
  temp: 22,
  feelsLike: 21,
  tempMin: 18,
  tempMax: 25,
  humidity: 65,
  pressure: 1013,
  visibility: 10000,
  cloudiness: 40,
  uvi: 5,
  dewPoint: 14,
  windSpeed: 4.5,
  windDeg: 180,
  condition: {
    id: 800,
    main: 'Clear',
    description: 'clear',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 'America/New_York',
  timezoneOffset: -18000,
  cityName: 'Charlotte',
};

describe('ApiService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reverseGeocode returns location info', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { city: 'A', country: 'US', displayName: 'A, US' },
            meta: { requestedAt: new Date().toISOString() },
          }),
      }),
    );
    const result = await ApiService.reverseGeocode({ lat: 1, lng: 2 });
    expect(result.city).toBe('A');
  });

  it('getCurrentWeather with all location fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockCurrent,
            meta: { requestedAt: new Date().toISOString() },
          }),
      }),
    );
    const result = await ApiService.getCurrentWeather({
      locationQuery: { city: 'Charlotte', state: 'NC', country: 'US', zip: '28105' },
      units: TemperatureUnit.METRIC,
    });
    expect(result.cityName).toBe('Charlotte');
  });

  it('throws on failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      }),
    );
    await expect(
      ApiService.getForecast({
        locationQuery: { zip: '28105' },
        units: TemperatureUnit.METRIC,
      }),
    ).rejects.toThrow('Not found');
  });
});

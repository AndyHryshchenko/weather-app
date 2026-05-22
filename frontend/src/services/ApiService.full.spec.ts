import { describe, expect, it, vi, afterEach } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { ApiService } from './ApiService';

describe('ApiService all endpoints', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const mockFetch = (data: unknown) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data,
            meta: { requestedAt: new Date().toISOString() },
          }),
      }),
    );
  };

  it('builds query string without optional params', async () => {
    mockFetch([]);
    await ApiService.getHourlyForecast({
      locationQuery: {},
      units: TemperatureUnit.METRIC,
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/weather/hourly?units=metric'),
    );
  });

  it('reverseGeocode', async () => {
    mockFetch({ city: 'A', country: 'US', displayName: 'A, US' });
    const result = await ApiService.reverseGeocode({ lat: 1, lng: 2 });
    expect(result.city).toBe('A');
  });

  it('getHourlyForecast', async () => {
    mockFetch([]);
    const result = await ApiService.getHourlyForecast({
      locationQuery: { city: 'A' },
      units: TemperatureUnit.METRIC,
    });
    expect(result).toEqual([]);
  });

  it('getForecast', async () => {
    mockFetch([]);
    const result = await ApiService.getForecast({
      locationQuery: { zip: '12345' },
      units: TemperatureUnit.IMPERIAL,
    });
    expect(result).toEqual([]);
  });

  it('uses generic error when body has no message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('parse fail')),
      }),
    );
    await expect(
      ApiService.reverseGeocode({ lat: 0, lng: 0 }),
    ).rejects.toThrow('Request failed: 500');
  });
});

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncStatus, TemperatureUnit } from '@weather-app/types';
import { WeatherRequestKind } from '@/constants/weather-request.constants';
import { useWeatherForLocation } from './useWeatherQueries';

vi.mock('./weather.api', () => ({
  useGetCurrentWeatherQuery: vi.fn(),
  useGetHourlyForecastQuery: vi.fn(),
  useGetDailyForecastQuery: vi.fn(),
}));

import {
  useGetCurrentWeatherQuery,
  useGetHourlyForecastQuery,
  useGetDailyForecastQuery,
} from './weather.api';

const idleQuery = {
  data: undefined,
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: undefined,
};

const successQuery = <T,>(data: T) => ({
  data,
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: undefined,
});

const failedQuery = (error: unknown) => ({
  data: undefined,
  isLoading: false,
  isError: true,
  isSuccess: false,
  error,
});

describe('useWeatherForLocation', () => {
  beforeEach(() => {
    vi.mocked(useGetCurrentWeatherQuery).mockReturnValue(idleQuery as never);
    vi.mocked(useGetHourlyForecastQuery).mockReturnValue(idleQuery as never);
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(idleQuery as never);
  });

  it('returns idle state when queries have not loaded', () => {
    const { result } = renderHook(() =>
      useWeatherForLocation(null, TemperatureUnit.METRIC),
    );
    expect(result.current.currentStatus).toBe(AsyncStatus.IDLE);
    expect(result.current.errors).toEqual([]);
  });

  it('maps forecast data and success status', () => {
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(
      successQuery([{ dt: 1 }, { dt: 2 }]) as never,
    );
    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );
    expect(result.current.forecastStatus).toBe(AsyncStatus.SUCCEEDED);
  });

  it('returns hourly and forecast arrays when query data is valid', () => {
    vi.mocked(useGetHourlyForecastQuery).mockReturnValue(
      successQuery([{ dt: 1 }]) as never,
    );
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(
      successQuery([{ dt: 1 }, { dt: 2 }]) as never,
    );
    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );
    expect(result.current.hourly).toEqual([{ dt: 1 }]);
    expect(result.current.forecast).toEqual([{ dt: 1 }, { dt: 2 }]);
  });

  it('ignores non-array hourly and forecast payloads', () => {
    vi.mocked(useGetHourlyForecastQuery).mockReturnValue({
      ...successQuery([]),
      data: { invalid: true },
    } as never);
    vi.mocked(useGetDailyForecastQuery).mockReturnValue({
      ...successQuery([]),
      data: { invalid: true },
    } as never);
    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );
    expect(result.current.hourly).toBeNull();
    expect(result.current.forecast).toBeNull();
  });

  it('collects errors for each failed weather request', () => {
    vi.mocked(useGetCurrentWeatherQuery).mockReturnValue(
      failedQuery({ status: 500, data: { message: 'Current failed' } }) as never,
    );
    vi.mocked(useGetHourlyForecastQuery).mockReturnValue(
      failedQuery({ status: 'FETCH_ERROR', error: 'Failed to fetch' }) as never,
    );
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(idleQuery as never);

    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );

    expect(result.current.errors).toEqual([
      { request: WeatherRequestKind.CURRENT, message: 'Current failed' },
      {
        request: WeatherRequestKind.HOURLY,
        message: 'Could not reach the server. Check that the backend is running.',
      },
    ]);
    expect(result.current.currentError).toBe('Current failed');
    expect(result.current.hourlyError).toContain('Could not reach the server');
    expect(result.current.forecastError).toBeNull();
  });

  it('collects all request errors when each query fails', () => {
    vi.mocked(useGetCurrentWeatherQuery).mockReturnValue(
      failedQuery({ status: 500, data: { message: 'Current failed' } }) as never,
    );
    vi.mocked(useGetHourlyForecastQuery).mockReturnValue(
      failedQuery({ status: 500, data: { message: 'Hourly failed' } }) as never,
    );
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(
      failedQuery({ status: 500, data: { message: 'Forecast failed' } }) as never,
    );

    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );

    expect(result.current.errors).toEqual([
      { request: WeatherRequestKind.CURRENT, message: 'Current failed' },
      { request: WeatherRequestKind.HOURLY, message: 'Hourly failed' },
      { request: WeatherRequestKind.FORECAST, message: 'Forecast failed' },
    ]);
  });

  it('includes forecast errors in the collected error list', () => {
    vi.mocked(useGetDailyForecastQuery).mockReturnValue(
      failedQuery({ status: 503, data: { message: 'Forecast failed' } }) as never,
    );

    const { result } = renderHook(() =>
      useWeatherForLocation(
        { city: 'Charlotte', country: 'US' },
        TemperatureUnit.METRIC,
      ),
    );

    expect(result.current.errors).toEqual([
      { request: WeatherRequestKind.FORECAST, message: 'Forecast failed' },
    ]);
    expect(result.current.forecastError).toBe('Forecast failed');
  });
});

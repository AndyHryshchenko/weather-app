import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import {
  normalizeCondition,
  normalizeCurrent,
  normalizeDaily,
  normalizeHourly,
} from './openweather-normalizer';
import type { OpenWeatherOneCallResponse } from './types/openweather-api.types';

const baseCondition = {
  id: 800,
  main: 'Clear',
  description: 'clear sky',
  icon: '01d',
};

const mockOneCall: OpenWeatherOneCallResponse = {
  lat: 35.2,
  lon: -80.8,
  timezone: 'America/New_York',
  timezone_offset: -18000,
  current: {
    dt: 1700000000,
    sunrise: 1699980000,
    sunset: 1700020000,
    temp: 22,
    feels_like: 21,
    pressure: 1013,
    humidity: 65,
    dew_point: 14,
    uvi: 5,
    clouds: 40,
    visibility: 10000,
    wind_speed: 4.5,
    wind_deg: 180,
    wind_gust: 7,
    weather: [baseCondition],
    rain: { '1h': 0.5 },
  },
  hourly: [
    {
      dt: 1700003600,
      temp: 21,
      feels_like: 20,
      pressure: 1014,
      humidity: 63,
      dew_point: 13,
      uvi: 4,
      clouds: 25,
      visibility: 10000,
      wind_speed: 3.2,
      wind_deg: 190,
      pop: 0.05,
      weather: [baseCondition],
    },
  ],
  daily: [
    {
      dt: 1700086400,
      sunrise: 1700060000,
      sunset: 1700100000,
      temp: {
        day: 22,
        min: 13,
        max: 24,
        night: 14,
        eve: 19,
        morn: 15,
      },
      feels_like: { day: 21, night: 13, eve: 18, morn: 14 },
      pressure: 1015,
      humidity: 60,
      dew_point: 12,
      wind_speed: 3.5,
      wind_deg: 200,
      clouds: 30,
      uvi: 6,
      pop: 0.1,
      weather: [baseCondition],
      summary: 'Clear day',
    },
  ],
};

describe('openweather normalizer', () => {
  it('normalizes condition', () => {
    expect(normalizeCondition(baseCondition).icon).toBe(
      WeatherIconCode.CLEAR_DAY,
    );
  });

  it('normalizes current weather', () => {
    const current = normalizeCurrent(mockOneCall, 'Charlotte');
    expect(current.cityName).toBe('Charlotte');
    expect(current.rain1h).toBe(0.5);
    expect(current.condition.icon).toBe(WeatherIconCode.CLEAR_DAY);
  });

  it('normalizes current with zero rain amount', () => {
    const withZeroRain = {
      ...mockOneCall,
      current: {
        ...mockOneCall.current,
        rain: { '1h': 0 },
        snow: { '1h': 0.2 },
      },
    };
    const current = normalizeCurrent(withZeroRain, 'Test');
    expect(current.rain1h).toBe(0);
    expect(current.snow1h).toBe(0.2);
  });

  it('normalizes current without precipitation', () => {
    const withoutRain = {
      ...mockOneCall,
      current: { ...mockOneCall.current, rain: undefined, snow: undefined },
    };
    const current = normalizeCurrent(withoutRain, 'Test');
    expect(current.rain1h).toBeNull();
    expect(current.snow1h).toBeNull();
  });

  it('normalizes hourly forecast with pop', () => {
    const hourly = normalizeHourly(mockOneCall.hourly);
    expect(hourly).toHaveLength(1);
    expect(hourly[0].pop).toBe(0.05);
  });

  it('normalizes daily forecast with temp phases', () => {
    const daily = normalizeDaily(mockOneCall.daily);
    expect(daily[0].temp.morn).toBe(15);
    expect(daily[0].summary).toBe('Clear day');
  });

  it('normalizes current without wind gust', () => {
    const withoutGust = {
      ...mockOneCall,
      current: { ...mockOneCall.current, wind_gust: undefined },
    };
    const current = normalizeCurrent(withoutGust, 'Test');
    expect(current.windGust).toBeUndefined();
  });

  it('normalizes hourly with empty rain object', () => {
    const hourly = normalizeHourly([
      {
        ...mockOneCall.hourly[0],
        rain: {},
        snow: {},
        wind_gust: undefined,
      },
    ]);
    expect(hourly[0].rain1h).toBeNull();
    expect(hourly[0].snow1h).toBeNull();
  });

  it('normalizes hourly without rain or snow', () => {
    const hourly = normalizeHourly([
      {
        ...mockOneCall.hourly[0],
        rain: undefined,
        snow: undefined,
      },
    ]);
    expect(hourly[0].rain1h).toBeNull();
    expect(hourly[0].snow1h).toBeNull();
    expect(hourly[0].windGust).toBeUndefined();
  });

  it('normalizes daily with rain and snow amounts', () => {
    const daily = normalizeDaily([
      {
        ...mockOneCall.daily[0],
        rain: 2,
        snow: 1,
      },
    ]);
    expect(daily[0].rain).toBe(2);
    expect(daily[0].snow).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import {
  aggregateForecastListToDaily,
  normalizeCurrentWeather,
  normalizeForecastListHourly,
  pickPhaseTemp,
} from './openweather-standard-normalizer';
import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from './types/openweather-api.types';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear',
  icon: '01d',
};

const current: OpenWeatherCurrentWeatherResponse = {
  coord: { lon: -80.8, lat: 35.2 },
  weather: [condition],
  base: 'stations',
  main: {
    temp: 22,
    feels_like: 21,
    temp_min: 18,
    temp_max: 25,
    pressure: 1013,
    humidity: 65,
  },
  visibility: 10_000,
  wind: { speed: 4.5, deg: 180 },
  clouds: { all: 40 },
  dt: 1700000000,
  sys: { country: 'US', sunrise: 1699980000, sunset: 1700020000 },
  timezone: 0,
  id: 1,
  name: 'Charlotte',
  cod: 200,
};

describe('openweather standard normalizer', () => {
  it('returns undefined phase temperature for empty entries', () => {
    expect(pickPhaseTemp([], 6, 0)).toBeUndefined();
  });

  it('picks the closest hour for a phase temperature', () => {
    const entries = [
      {
        dt: 1_700_000_000,
        main: {
          temp: 10,
          feels_like: 10,
          temp_min: 10,
          temp_max: 10,
          pressure: 1010,
          humidity: 50,
        },
        weather: [condition],
        clouds: { all: 0 },
        wind: { speed: 1, deg: 0 },
        pop: 0,
        sys: { pod: 'd' },
        dt_txt: '2023-11-14 06:00:00',
      },
      {
        dt: 1_700_014_400,
        main: {
          temp: 20,
          feels_like: 20,
          temp_min: 20,
          temp_max: 20,
          pressure: 1010,
          humidity: 50,
        },
        weather: [condition],
        clouds: { all: 0 },
        wind: { speed: 1, deg: 0 },
        pop: 0,
        sys: { pod: 'd' },
        dt_txt: '2023-11-14 10:00:00',
      },
    ];

    const phaseTemp = pickPhaseTemp(entries, 6, 0);
    expect(phaseTemp).toBeDefined();
    expect([10, 20]).toContain(phaseTemp);
  });

  it('normalizes current weather response', () => {
    const result = normalizeCurrentWeather(current);
    expect(result.cityName).toBe('Charlotte');
    expect(result.condition.icon).toBe(WeatherIconCode.CLEAR_DAY);
    expect(result.temp).toBe(22);
  });

  it('normalizes optional current weather precipitation and wind gust', () => {
    const result = normalizeCurrentWeather({
      ...current,
      visibility: undefined as unknown as number,
      wind: { speed: 4.5, deg: 180, gust: 22 },
      rain: { '1h': 0.3 },
      snow: { '1h': 0.1 },
    });
    expect(result.visibility).toBe(10_000);
    expect(result.windGust).toBe(22);
    expect(result.rain1h).toBe(0.3);
    expect(result.snow1h).toBe(0.1);
  });

  it('normalizes forecast list to hourly entries', () => {
    const forecast: OpenWeatherForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 1,
      list: [
        {
          dt: 1700000000,
          main: {
            temp: 20,
            feels_like: 19,
            temp_min: 18,
            temp_max: 21,
            pressure: 1010,
            humidity: 60,
          },
          weather: [condition],
          clouds: { all: 20 },
          wind: { speed: 2, deg: 90 },
          pop: 0.15,
          sys: { pod: 'd' },
          dt_txt: '2023-11-14 12:00:00',
        },
      ],
      city: {
        id: 1,
        name: 'Charlotte',
        coord: { lat: 35.2, lon: -80.8 },
        country: 'US',
        timezone: 0,
        sunrise: 1699980000,
        sunset: 1700020000,
      },
    };

    const hourly = normalizeForecastListHourly([
      {
        ...forecast.list[0],
        visibility: 5000,
        wind: { speed: 2, deg: 90, gust: 12 },
        rain: { '3h': 1.2 },
        snow: { '3h': 0.5 },
      },
    ]);
    expect(hourly).toHaveLength(1);
    expect(hourly[0]?.pop).toBe(0.15);
    expect(hourly[0]?.visibility).toBe(5000);
    expect(hourly[0]?.windGust).toBe(12);
    expect(hourly[0]?.rain1h).toBe(1.2);
    expect(hourly[0]?.snow1h).toBe(0.5);
  });

  it('uses default visibility when forecast entry omits it', () => {
    const forecast: OpenWeatherForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 1,
      list: [
        {
          dt: 1700000000,
          main: {
            temp: 20,
            feels_like: 19,
            temp_min: 18,
            temp_max: 21,
            pressure: 1010,
            humidity: 60,
          },
          weather: [condition],
          clouds: { all: 20 },
          wind: { speed: 2, deg: 90 },
          pop: 0.15,
          sys: { pod: 'd' },
          dt_txt: '2023-11-14 12:00:00',
        },
      ],
      city: {
        id: 1,
        name: 'Charlotte',
        coord: { lat: 35.2, lon: -80.8 },
        country: 'US',
        timezone: 0,
        sunrise: 1699980000,
        sunset: 1700020000,
      },
    };

    const hourly = normalizeForecastListHourly(forecast.list);
    expect(hourly[0]?.visibility).toBe(10_000);
    expect(hourly[0]?.rain1h).toBeNull();
    expect(hourly[0]?.snow1h).toBeNull();
  });

  it('aggregates forecast list into daily buckets', () => {
    const forecast: OpenWeatherForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 2,
      list: [
        {
          dt: 1_700_107_200,
          main: {
            temp: 22,
            feels_like: 21,
            temp_min: 20,
            temp_max: 23,
            pressure: 1010,
            humidity: 60,
          },
          weather: [condition],
          clouds: { all: 20 },
          wind: { speed: 2, deg: 90 },
          pop: 0.1,
          sys: { pod: 'd' },
          dt_txt: '2023-11-15 12:00:00',
        },
        {
          dt: 1_700_110_400,
          main: {
            temp: 18,
            feels_like: 17,
            temp_min: 17,
            temp_max: 19,
            pressure: 1011,
            humidity: 62,
          },
          weather: [condition],
          clouds: { all: 30 },
          wind: { speed: 3, deg: 100 },
          pop: 0.2,
          sys: { pod: 'd' },
          dt_txt: '2023-11-15 15:00:00',
        },
      ],
      city: {
        id: 1,
        name: 'Charlotte',
        coord: { lat: 35.2, lon: -80.8 },
        country: 'US',
        timezone: 0,
        sunrise: 1699980000,
        sunset: 1700020000,
      },
    };

    const daily = aggregateForecastListToDaily({
      ...forecast,
      list: [
        {
          ...forecast.list[0],
          rain: { '3h': 0.4 },
          snow: { '3h': 0.2 },
        },
        forecast.list[1],
      ],
    });
    expect(daily).toHaveLength(1);
    expect(daily[0]?.temp.min).toBe(18);
    expect(daily[0]?.temp.max).toBe(22);
    expect(daily[0]?.rain).toBe(0.4);
    expect(daily[0]?.snow).toBe(0.2);
  });

  it('aggregates daily precipitation as null when absent', () => {
    const forecast: OpenWeatherForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 1,
      list: [
        {
          dt: 1_700_107_200,
          main: {
            temp: 22,
            feels_like: 21,
            temp_min: 20,
            temp_max: 23,
            pressure: 1010,
            humidity: 60,
          },
          weather: [condition],
          clouds: { all: 20 },
          wind: { speed: 2, deg: 90 },
          pop: 0.1,
          sys: { pod: 'd' },
          dt_txt: '2023-11-15 12:00:00',
        },
      ],
      city: {
        id: 1,
        name: 'Charlotte',
        coord: { lat: 35.2, lon: -80.8 },
        country: 'US',
        timezone: 0,
        sunrise: 1699980000,
        sunset: 1700020000,
      },
    };

    const daily = aggregateForecastListToDaily(forecast);
    expect(daily[0]?.rain).toBeNull();
    expect(daily[0]?.snow).toBeNull();
  });
});

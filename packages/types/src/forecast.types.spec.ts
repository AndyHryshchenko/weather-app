import { describe, expect, it } from 'vitest';
import type { ForecastDay, HourlyForecast } from './forecast.types';
import { WeatherIconCode } from './weather.types';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear sky',
  icon: WeatherIconCode.CLEAR_DAY,
};

describe('forecast types', () => {
  it('HourlyForecast shape is assignable', () => {
    const hourly: HourlyForecast = {
      dt: 1700000000,
      temp: 21,
      feelsLike: 20,
      humidity: 63,
      pressure: 1014,
      dewPoint: 13,
      uvi: 4,
      clouds: 25,
      visibility: 10000,
      windSpeed: 3.2,
      windDeg: 190,
      pop: 0.05,
      condition,
    };
    expect(hourly.dt).toBe(1700000000);
  });

  it('ForecastDay shape is assignable', () => {
    const day: ForecastDay = {
      dt: 1700000000,
      sunrise: 1700020000,
      sunset: 1700060000,
      temp: { min: 13, max: 24, morn: 15, day: 22, eve: 19, night: 14 },
      feelsLike: { morn: 14, day: 21, eve: 18, night: 13 },
      humidity: 60,
      pressure: 1015,
      dewPoint: 12,
      windSpeed: 3.5,
      windDeg: 200,
      clouds: 30,
      uvi: 6,
      pop: 0.1,
      condition,
    };
    expect(day.temp.max).toBe(24);
  });
});

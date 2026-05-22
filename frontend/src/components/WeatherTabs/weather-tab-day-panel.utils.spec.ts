import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import {
  getWeatherPropsForTab,
  mapCurrentWeatherToDayPanelProps,
  mapForecastDayToDayPanelProps,
} from './weather-tab-day-panel.utils';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear sky',
  icon: WeatherIconCode.CLEAR_DAY,
};

const current = {
  temp: 22,
  feelsLike: 20,
  tempMin: 18,
  tempMax: 25,
  humidity: 50,
  pressure: 1010,
  visibility: 10000,
  cloudiness: 30,
  uvi: 4,
  dewPoint: 10,
  windSpeed: 3,
  windDeg: 90,
  condition,
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 'UTC',
  timezoneOffset: 0,
  cityName: 'Test',
};

const forecastDay = {
  dt: 1700086400,
  sunrise: 1700060000,
  sunset: 1700100000,
  temp: { min: 10, max: 25, morn: 12, day: 22, eve: 18, night: 11 },
  feelsLike: { day: 21 },
  humidity: 50,
  pressure: 1010,
  dewPoint: 10,
  windSpeed: 2,
  windDeg: 90,
  clouds: 20,
  uvi: 3,
  pop: 0.1,
  condition,
};

describe('weather-tab-day-panel.utils', () => {
  it('maps current weather to day panel props', () => {
    expect(mapCurrentWeatherToDayPanelProps(current)).toEqual({
      conditionIcon: WeatherIconCode.CLEAR_DAY,
      conditionDescription: 'clear sky',
      temp: 22,
      feelsLike: 20,
      humidity: 50,
      windSpeed: 3,
      pressure: 1010,
      uvi: 4,
      visibility: 10000,
      cloudiness: 30,
      dewPoint: 10,
    });
  });

  it('maps forecast day to day panel props', () => {
    expect(mapForecastDayToDayPanelProps(forecastDay)).toEqual({
      conditionIcon: WeatherIconCode.CLEAR_DAY,
      conditionDescription: 'clear sky',
      tempMin: 10,
      tempMax: 25,
      tempMorn: 12,
      tempDay: 22,
      tempEve: 18,
      tempNight: 11,
      feelsLike: 21,
      humidity: 50,
      windSpeed: 2,
      pressure: 1010,
      uvi: 3,
      cloudiness: 20,
      dewPoint: 10,
    });
  });

  it('returns current props for today tab when current is available', () => {
    expect(getWeatherPropsForTab(0, current, undefined)).toEqual(
      mapCurrentWeatherToDayPanelProps(current),
    );
  });

  it('returns forecast props for later tabs', () => {
    expect(getWeatherPropsForTab(2, current, forecastDay)).toEqual(
      mapForecastDayToDayPanelProps(forecastDay),
    );
  });

  it('returns empty props when no weather source exists for tab', () => {
    expect(getWeatherPropsForTab(2, null, undefined)).toEqual({});
    expect(getWeatherPropsForTab(0, null, undefined)).toEqual({});
  });
});

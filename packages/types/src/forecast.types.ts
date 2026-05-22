import type { WeatherCondition } from './weather.types';

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  dewPoint: number;
  uvi: number;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  pop: number;
  rain1h?: number | null;
  snow1h?: number | null;
  condition: WeatherCondition;
}

export interface ForecastDayTemp {
  min: number;
  max: number;
  morn?: number;
  day?: number;
  eve?: number;
  night?: number;
}

export interface ForecastDayFeelsLike {
  morn?: number;
  day?: number;
  eve?: number;
  night?: number;
}

export interface ForecastDay {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: ForecastDayTemp;
  feelsLike: ForecastDayFeelsLike;
  humidity: number;
  pressure: number;
  dewPoint: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  clouds: number;
  uvi: number;
  pop: number;
  rain?: number | null;
  snow?: number | null;
  condition: WeatherCondition;
  summary?: string;
}

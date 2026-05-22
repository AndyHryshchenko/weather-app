import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  WeatherCondition,
} from '@weather-app/types';
import type {
  OpenWeatherCondition,
  OpenWeatherDaily,
  OpenWeatherHourly,
  OpenWeatherOneCallResponse,
} from './types/openweather-api.types';
import { mapOpenWeatherIcon } from './openweather-icon.mapper';

export const normalizeCondition = (
  raw: OpenWeatherCondition,
): WeatherCondition => ({
  id: raw.id,
  main: raw.main,
  description: raw.description,
  icon: mapOpenWeatherIcon(raw.icon),
});

export const normalizeCurrent = (
  response: OpenWeatherOneCallResponse,
  cityName: string,
): CurrentWeatherData => {
  const current = response.current;
  const primary = current.weather[0];
  return {
    temp: current.temp,
    feelsLike: current.feels_like,
    tempMin: current.temp,
    tempMax: current.temp,
    humidity: current.humidity,
    pressure: current.pressure,
    visibility: current.visibility,
    cloudiness: current.clouds,
    uvi: current.uvi,
    dewPoint: current.dew_point,
    windSpeed: current.wind_speed,
    windDeg: current.wind_deg,
    windGust: current.wind_gust,
    rain1h: current.rain?.['1h'] ?? null,
    snow1h: current.snow?.['1h'] ?? null,
    condition: normalizeCondition(primary),
    sunrise: current.sunrise,
    sunset: current.sunset,
    timezone: response.timezone,
    timezoneOffset: response.timezone_offset,
    cityName,
  };
};

export const normalizeHourly = (
  hourly: OpenWeatherHourly[],
): HourlyForecast[] =>
  hourly.map((hour) => {
    const primary = hour.weather[0];
    return {
      dt: hour.dt,
      temp: hour.temp,
      feelsLike: hour.feels_like,
      humidity: hour.humidity,
      pressure: hour.pressure,
      dewPoint: hour.dew_point,
      uvi: hour.uvi,
      clouds: hour.clouds,
      visibility: hour.visibility,
      windSpeed: hour.wind_speed,
      windDeg: hour.wind_deg,
      windGust: hour.wind_gust,
      pop: hour.pop,
      rain1h: hour.rain?.['1h'] ?? null,
      snow1h: hour.snow?.['1h'] ?? null,
      condition: normalizeCondition(primary),
    };
  });

export const normalizeDaily = (daily: OpenWeatherDaily[]): ForecastDay[] =>
  daily.map((day) => {
    const primary = day.weather[0];
    return {
      dt: day.dt,
      sunrise: day.sunrise,
      sunset: day.sunset,
      temp: {
        min: day.temp.min,
        max: day.temp.max,
        morn: day.temp.morn,
        day: day.temp.day,
        eve: day.temp.eve,
        night: day.temp.night,
      },
      feelsLike: {
        morn: day.feels_like.morn,
        day: day.feels_like.day,
        eve: day.feels_like.eve,
        night: day.feels_like.night,
      },
      humidity: day.humidity,
      pressure: day.pressure,
      dewPoint: day.dew_point,
      windSpeed: day.wind_speed,
      windDeg: day.wind_deg,
      windGust: day.wind_gust,
      clouds: day.clouds,
      uvi: day.uvi,
      pop: day.pop,
      rain: day.rain ?? null,
      snow: day.snow ?? null,
      condition: normalizeCondition(primary),
      summary: day.summary,
    };
  });

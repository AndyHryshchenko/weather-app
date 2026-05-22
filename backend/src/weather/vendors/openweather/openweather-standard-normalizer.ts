import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
} from '@weather-app/types';
import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastListItem,
  OpenWeatherForecastResponse,
} from './types/openweather-api.types';
import { normalizeCondition } from './openweather-normalizer';

const PHASE_TARGET_HOURS = [6, 12, 18, 0] as const;

const toLocalDayKey = (unixSeconds: number, timezoneOffsetSeconds: number): string => {
  const local = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  const year = local.getUTCFullYear();
  const month = String(local.getUTCMonth() + 1).padStart(2, '0');
  const day = String(local.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toLocalHour = (unixSeconds: number, timezoneOffsetSeconds: number): number =>
  new Date((unixSeconds + timezoneOffsetSeconds) * 1000).getUTCHours();

export const pickPhaseTemp = (
  entries: OpenWeatherForecastListItem[],
  targetHour: number,
  timezoneOffsetSeconds: number,
): number | undefined => {
  if (entries.length === 0) {
    return undefined;
  }
  const closest = entries.reduce((best, entry) => {
    const hour = toLocalHour(entry.dt, timezoneOffsetSeconds);
    const bestHour = toLocalHour(best.dt, timezoneOffsetSeconds);
    const bestDistance = Math.min(
      Math.abs(bestHour - targetHour),
      24 - Math.abs(bestHour - targetHour),
    );
    const entryDistance = Math.min(
      Math.abs(hour - targetHour),
      24 - Math.abs(hour - targetHour),
    );
    return entryDistance < bestDistance ? entry : best;
  });
  return closest.main.temp;
};

export const normalizeCurrentWeather = (
  response: OpenWeatherCurrentWeatherResponse,
): CurrentWeatherData => {
  const primary = response.weather[0];
  return {
    temp: response.main.temp,
    feelsLike: response.main.feels_like,
    tempMin: response.main.temp_min,
    tempMax: response.main.temp_max,
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    visibility: response.visibility ?? 10_000,
    cloudiness: response.clouds.all,
    uvi: 0,
    dewPoint: 0,
    windSpeed: response.wind.speed,
    windDeg: response.wind.deg,
    windGust: response.wind.gust,
    rain1h: response.rain?.['1h'] ?? null,
    snow1h: response.snow?.['1h'] ?? null,
    condition: normalizeCondition(primary),
    sunrise: response.sys.sunrise,
    sunset: response.sys.sunset,
    timezone: 'UTC',
    timezoneOffset: response.timezone,
    cityName: response.name,
  };
};

export const normalizeForecastListHourly = (
  list: OpenWeatherForecastListItem[],
): HourlyForecast[] =>
  list.map((entry) => {
    const primary = entry.weather[0];
    return {
      dt: entry.dt,
      temp: entry.main.temp,
      feelsLike: entry.main.feels_like,
      humidity: entry.main.humidity,
      pressure: entry.main.pressure,
      dewPoint: 0,
      uvi: 0,
      clouds: entry.clouds.all,
      visibility: entry.visibility ?? 10_000,
      windSpeed: entry.wind.speed,
      windDeg: entry.wind.deg,
      windGust: entry.wind.gust,
      pop: entry.pop,
      rain1h: entry.rain?.['3h'] ?? null,
      snow1h: entry.snow?.['3h'] ?? null,
      condition: normalizeCondition(primary),
    };
  });

export const aggregateForecastListToDaily = (
  response: OpenWeatherForecastResponse,
): ForecastDay[] => {
  const { list, city } = response;
  const dayBuckets = new Map<string, OpenWeatherForecastListItem[]>();

  for (const entry of list) {
    const dayKey = toLocalDayKey(entry.dt, city.timezone);
    const bucket = dayBuckets.get(dayKey) ?? [];
    bucket.push(entry);
    dayBuckets.set(dayKey, bucket);
  }

  return [...dayBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, entries]) => {
      const sorted = [...entries].sort((a, b) => a.dt - b.dt);
      const primary = sorted[Math.floor(sorted.length / 2)].weather[0];
      const temps = sorted.map((entry) => entry.main.temp);
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      const maxPop = Math.max(...sorted.map((entry) => entry.pop));

      return {
        dt: sorted[0].dt,
        sunrise: city.sunrise,
        sunset: city.sunset,
        temp: {
          min,
          max,
          morn: pickPhaseTemp(sorted, PHASE_TARGET_HOURS[0], city.timezone),
          day: pickPhaseTemp(sorted, PHASE_TARGET_HOURS[1], city.timezone),
          eve: pickPhaseTemp(sorted, PHASE_TARGET_HOURS[2], city.timezone),
          night: pickPhaseTemp(sorted, PHASE_TARGET_HOURS[3], city.timezone),
        },
        feelsLike: {
          day: sorted[Math.floor(sorted.length / 2)].main.feels_like,
        },
        humidity: sorted[0].main.humidity,
        pressure: sorted[0].main.pressure,
        dewPoint: 0,
        windSpeed: sorted[0].wind.speed,
        windDeg: sorted[0].wind.deg,
        windGust: sorted[0].wind.gust,
        clouds: sorted[0].clouds.all,
        uvi: 0,
        pop: maxPop,
        rain: sorted[0].rain?.['3h'] ?? null,
        snow: sorted[0].snow?.['3h'] ?? null,
        condition: normalizeCondition(primary),
      };
    });
};

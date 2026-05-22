import type { ResponseMeta, TemperatureUnit, WeatherResponse } from '@weather-app/types';

export const buildWeatherResponse = <T>(
  data: T,
  units?: TemperatureUnit,
): WeatherResponse<T> => {
  const meta: ResponseMeta = {
    requestedAt: new Date().toISOString(),
    ...(units ? { units } : {}),
  };
  return { data, meta };
};

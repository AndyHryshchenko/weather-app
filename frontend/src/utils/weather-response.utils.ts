import type { WeatherResponse } from '@weather-app/types';

export const unwrapWeatherResponseData = <T>(response: unknown): T => {
  if (Array.isArray(response)) {
    return response as T;
  }
  if (
    response !== null &&
    typeof response === 'object' &&
    'data' in response
  ) {
    return (response as WeatherResponse<T>).data;
  }
  throw new Error('Invalid weather API response shape');
};

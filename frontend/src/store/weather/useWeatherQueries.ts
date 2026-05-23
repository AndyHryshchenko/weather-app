import { skipToken } from '@reduxjs/toolkit/query';
import type { LocationQuery, TemperatureUnit } from '@weather-app/types';
import { WeatherRequestKind } from '@/constants/weather-request.constants';
import type { WeatherQueryErrorDetail } from '@/utils/weather-query.utils';
import {
  getQueryErrorMessage,
  mapQueryToAsyncStatus,
} from '@/utils/weather-query.utils';
import {
  useGetCurrentWeatherQuery,
  useGetDailyForecastQuery,
  useGetHourlyForecastQuery,
} from './weather.api';

export const useWeatherForLocation = (
  locationQuery: LocationQuery | null,
  units: TemperatureUnit,
) => {
  const requestArgs = locationQuery ? { locationQuery, units } : skipToken;

  const currentQuery = useGetCurrentWeatherQuery(requestArgs);
  const hourlyQuery = useGetHourlyForecastQuery(requestArgs);
  const forecastQuery = useGetDailyForecastQuery(requestArgs);

  const hourly = Array.isArray(hourlyQuery.data) ? hourlyQuery.data : null;
  const forecast = Array.isArray(forecastQuery.data) ? forecastQuery.data : null;

  const currentError = getQueryErrorMessage(currentQuery.error);
  const hourlyError = getQueryErrorMessage(hourlyQuery.error);
  const forecastError = getQueryErrorMessage(forecastQuery.error);

  const errors: WeatherQueryErrorDetail[] = [];
  if (currentError) {
    errors.push({ request: WeatherRequestKind.CURRENT, message: currentError });
  }
  if (hourlyError) {
    errors.push({ request: WeatherRequestKind.HOURLY, message: hourlyError });
  }
  if (forecastError) {
    errors.push({ request: WeatherRequestKind.FORECAST, message: forecastError });
  }

  return {
    current: currentQuery.data ?? null,
    hourly,
    forecast,
    currentStatus: mapQueryToAsyncStatus(currentQuery),
    hourlyStatus: mapQueryToAsyncStatus(hourlyQuery),
    forecastStatus: mapQueryToAsyncStatus(forecastQuery),
    errors,
    currentError,
    hourlyError,
    forecastError,
  };
};

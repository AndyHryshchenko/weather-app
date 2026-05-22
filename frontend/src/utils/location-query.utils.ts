import type { LocationQuery, TemperatureUnit } from '@weather-app/types';
import { buildQueryString } from './query.utils';

export const serializeLocationQueryKey = (query: LocationQuery): string => {
  if (query.city?.trim()) {
    return `city:${query.city}|state:${query.state ?? ''}|country:${query.country ?? ''}`;
  }
  if (query.zip?.trim()) {
    return `zip:${query.zip}|country:${query.country ?? ''}`;
  }
  return `city:${query.city ?? ''}|state:${query.state ?? ''}|country:${query.country ?? ''}`;
};

export const serializeWeatherRequestKey = (
  locationQuery: LocationQuery,
  units: TemperatureUnit,
): string => `${serializeLocationQueryKey(locationQuery)}|units:${units}`;

export const buildWeatherLocationQueryString = (
  locationQuery: LocationQuery,
  units: TemperatureUnit,
): string =>
  buildQueryString({
    city: locationQuery.city,
    state: locationQuery.state,
    country: locationQuery.country,
    zip: locationQuery.zip,
    units,
  });

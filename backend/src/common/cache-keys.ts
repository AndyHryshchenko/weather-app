import type { LocationQuery } from '@weather-app/types';
import { TemperatureUnit } from '@weather-app/types';

const normalizePart = (value?: string): string =>
  (value ?? '').trim().toLowerCase();

export const buildLocationKeyParts = (query: LocationQuery): string => {
  if (query.city?.trim()) {
    return [
      normalizePart(query.city),
      normalizePart(query.state),
      normalizePart(query.country),
    ].join('|');
  }
  if (query.zip?.trim()) {
    return normalizePart(query.zip);
  }
  return [
    normalizePart(query.city),
    normalizePart(query.state),
    normalizePart(query.country),
  ].join('|');
};

export const buildGeocodeTextKey = (query: LocationQuery): string =>
  `geocode:text:${buildLocationKeyParts(query)}`;

export const buildReverseGeocodeKey = (lat: number, lng: number): string => {
  const latRounded = lat.toFixed(2);
  const lngRounded = lng.toFixed(2);
  return `geocode:reverse:${latRounded}|${lngRounded}`;
};

export const buildCurrentWeatherKey = (
  query: LocationQuery,
  units: TemperatureUnit,
): string => `weather:current:${buildLocationKeyParts(query)}:${units}`;

export const buildHourlyWeatherKey = (
  query: LocationQuery,
  units: TemperatureUnit,
): string => `weather:hourly:${buildLocationKeyParts(query)}:${units}`;

export const buildForecastWeatherKey = (
  query: LocationQuery,
  units: TemperatureUnit,
): string => `weather:forecast:${buildLocationKeyParts(query)}:${units}`;

export const buildOneCallDedupeKey = (
  lat: number,
  lng: number,
  units: TemperatureUnit,
): string => `onecall:${lat.toFixed(4)}|${lng.toFixed(4)}:${units}`;

export const buildForecast25DedupeKey = (
  lat: number,
  lng: number,
  units: TemperatureUnit,
): string => `forecast25:${lat.toFixed(4)}|${lng.toFixed(4)}:${units}`;

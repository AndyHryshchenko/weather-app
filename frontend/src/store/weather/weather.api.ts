import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  LocationInfo,
  LocationQuery,
  TemperatureUnit,
} from '@weather-app/types';
import { APP_CONSTANTS } from '@/constants/app.constants';
import { WEATHER_CACHE_TTL_SECONDS } from '@/constants/weather-api.constants';
import {
  buildWeatherLocationQueryString,
  serializeWeatherRequestKey,
} from '@/utils/location-query.utils';
import { buildQueryString } from '@/utils/query.utils';
import { unwrapWeatherResponseData } from '@/utils/weather-response.utils';

export interface WeatherRequestArgs {
  locationQuery: LocationQuery;
  units: TemperatureUnit;
}

export interface ReverseGeocodeArgs {
  lat: number;
  lng: number;
}

export const buildWeatherQueryCacheKey = (
  endpointName: string,
  queryArgs: WeatherRequestArgs,
): string =>
  `${endpointName}:${serializeWeatherRequestKey(queryArgs.locationQuery, queryArgs.units)}`;

export const serializeWeatherEndpointQueryArgs = ({
  endpointName,
  queryArgs,
}: {
  endpointName: string;
  queryArgs: WeatherRequestArgs;
}): string => buildWeatherQueryCacheKey(endpointName, queryArgs);

export const serializeReverseGeocodeQueryArgs = ({
  queryArgs,
}: {
  queryArgs: ReverseGeocodeArgs;
}): string => `${queryArgs.lat},${queryArgs.lng}`;

export const buildCurrentWeatherPath = (args: WeatherRequestArgs): string =>
  `/api/v1/weather/current${buildWeatherLocationQueryString(
    args.locationQuery,
    args.units,
  )}`;

export const buildHourlyForecastPath = (args: WeatherRequestArgs): string =>
  `/api/v1/weather/hourly${buildWeatherLocationQueryString(
    args.locationQuery,
    args.units,
  )}`;

export const buildDailyForecastPath = (args: WeatherRequestArgs): string =>
  `/api/v1/weather/forecast${buildWeatherLocationQueryString(
    args.locationQuery,
    args.units,
  )}`;

export const buildReverseGeocodePath = (args: ReverseGeocodeArgs): string =>
  `/api/v1/geocode/reverse${buildQueryString({
    lat: String(args.lat),
    lng: String(args.lng),
  })}`;

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: APP_CONSTANTS.API_BASE_URL }),
  keepUnusedDataFor: WEATHER_CACHE_TTL_SECONDS,
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<CurrentWeatherData, WeatherRequestArgs>({
      query: buildCurrentWeatherPath,
      transformResponse: unwrapWeatherResponseData<CurrentWeatherData>,
      serializeQueryArgs: serializeWeatherEndpointQueryArgs,
    }),
    getHourlyForecast: builder.query<HourlyForecast[], WeatherRequestArgs>({
      query: buildHourlyForecastPath,
      transformResponse: unwrapWeatherResponseData<HourlyForecast[]>,
      serializeQueryArgs: serializeWeatherEndpointQueryArgs,
    }),
    getDailyForecast: builder.query<ForecastDay[], WeatherRequestArgs>({
      query: buildDailyForecastPath,
      transformResponse: unwrapWeatherResponseData<ForecastDay[]>,
      serializeQueryArgs: serializeWeatherEndpointQueryArgs,
    }),
    reverseGeocode: builder.query<LocationInfo, ReverseGeocodeArgs>({
      query: buildReverseGeocodePath,
      transformResponse: unwrapWeatherResponseData<LocationInfo>,
      serializeQueryArgs: serializeReverseGeocodeQueryArgs,
    }),
  }),
});

export const {
  useGetCurrentWeatherQuery,
  useGetHourlyForecastQuery,
  useGetDailyForecastQuery,
  useLazyReverseGeocodeQuery,
} = weatherApi;

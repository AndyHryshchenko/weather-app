import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { WEATHER_CACHE_TTL_SECONDS } from '@/constants/weather-api.constants';
import { serializeWeatherRequestKey } from '@/utils/location-query.utils';
import { unwrapWeatherResponseData } from '@/utils/weather-response.utils';
import {
  buildCurrentWeatherPath,
  buildDailyForecastPath,
  buildHourlyForecastPath,
  buildReverseGeocodePath,
  buildWeatherQueryCacheKey,
  serializeReverseGeocodeQueryArgs,
  serializeWeatherEndpointQueryArgs,
  weatherApi,
} from './weather.api';

const locationArgs = {
  locationQuery: { city: 'Charlotte', state: 'NC', country: 'US' },
  units: TemperatureUnit.METRIC,
};
const locationKey = serializeWeatherRequestKey(
  locationArgs.locationQuery,
  locationArgs.units,
);

describe('weatherApi', () => {
  it('uses a 10 minute cache lifetime constant', () => {
    expect(WEATHER_CACHE_TTL_SECONDS).toBe(600);
  });

  it('defines weather and geocode endpoints', () => {
    expect(weatherApi.endpoints.getCurrentWeather).toBeDefined();
    expect(weatherApi.endpoints.getHourlyForecast).toBeDefined();
    expect(weatherApi.endpoints.getDailyForecast).toBeDefined();
    expect(weatherApi.endpoints.reverseGeocode).toBeDefined();
  });

  it('builds weather request paths', () => {
    expect(buildCurrentWeatherPath(locationArgs)).toContain('/api/v1/weather/current');
    expect(buildCurrentWeatherPath(locationArgs)).toContain('city=Charlotte');
    expect(buildHourlyForecastPath(locationArgs)).toContain('/api/v1/weather/hourly');
    expect(buildDailyForecastPath(locationArgs)).toContain('/api/v1/weather/forecast');
  });

  it('builds reverse geocode request paths', () => {
    expect(buildReverseGeocodePath({ lat: 35.2, lng: -80.8 })).toBe(
      '/api/v1/geocode/reverse?lat=35.2&lng=-80.8',
    );
  });

  it('unwraps API envelopes through transformResponse', () => {
    const payload = { data: { cityName: 'Charlotte', temp: 20 } };
    expect(unwrapWeatherResponseData(payload)).toEqual({ cityName: 'Charlotte', temp: 20 });
  });

  it('uses distinct cache keys per endpoint for the same location', () => {
    const currentKey = buildWeatherQueryCacheKey('getCurrentWeather', locationArgs);
    const hourlyKey = buildWeatherQueryCacheKey('getHourlyForecast', locationArgs);

    expect(currentKey).toBe(`getCurrentWeather:${locationKey}`);
    expect(hourlyKey).toBe(`getHourlyForecast:${locationKey}`);
    expect(currentKey).not.toBe(hourlyKey);
  });

  it('serializes weather endpoint cache keys', () => {
    expect(
      serializeWeatherEndpointQueryArgs({
        endpointName: 'getCurrentWeather',
        queryArgs: locationArgs,
      }),
    ).toBe(`getCurrentWeather:${locationKey}`);
  });

  it('serializes reverse geocode cache keys from coordinates', () => {
    expect(
      serializeReverseGeocodeQueryArgs({
        queryArgs: { lat: 35.2, lng: -80.8 },
      }),
    ).toBe('35.2,-80.8');
  });
});

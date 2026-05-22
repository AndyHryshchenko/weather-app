import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  Coordinates,
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  LocationQuery,
  TemperatureUnit,
} from '@weather-app/types';
import { TemperatureUnit as DefaultUnit } from '@weather-app/types';
import type { AppConfig } from '../config/configuration';
import {
  buildCurrentWeatherKey,
  buildForecastWeatherKey,
  buildGeocodeTextKey,
  buildHourlyWeatherKey,
} from '../common/cache-keys';
import {
  GEOCODER_CACHE,
  WEATHER_CACHE,
  type ICacheService,
} from '../common/cache/cache.interface';
import { AppLoggerService } from '../common/logger/app-logger.service';
import {
  GEOCODER_VENDOR,
  type IGeocoderVendor,
} from '../geocoder/interfaces/geocoder-vendor.interface';
import {
  WEATHER_VENDOR,
  type IWeatherVendor,
} from './interfaces/weather-vendor.interface';

type WeatherCacheValue =
  | CurrentWeatherData
  | HourlyForecast[]
  | ForecastDay[];

@Injectable()
export class WeatherService {
  constructor(
    @Inject(WEATHER_VENDOR)
    private readonly weatherVendor: IWeatherVendor,
    @Inject(GEOCODER_VENDOR)
    private readonly geocoderVendor: IGeocoderVendor,
    @Inject(WEATHER_CACHE)
    private readonly weatherCache: ICacheService<WeatherCacheValue>,
    @Inject(GEOCODER_CACHE)
    private readonly geocoderCache: ICacheService<Coordinates>,
    private readonly config: ConfigService<AppConfig, true>,
    private readonly logger: AppLoggerService,
  ) {}

  getCurrentWeatherByText(
    query: LocationQuery,
    units?: TemperatureUnit,
  ): Promise<CurrentWeatherData> {
    const resolvedUnits = units ?? DefaultUnit.METRIC;
    return this.getCachedOrFetch({
      cacheKey: buildCurrentWeatherKey(query, resolvedUnits),
      fetch: async (coords) =>
        this.weatherVendor.getCurrentWeather(coords, resolvedUnits),
      query,
      units: resolvedUnits,
    });
  }

  getHourlyForecastByText(
    query: LocationQuery,
    units?: TemperatureUnit,
  ): Promise<HourlyForecast[]> {
    const resolvedUnits = units ?? DefaultUnit.METRIC;
    return this.getCachedOrFetch({
      cacheKey: buildHourlyWeatherKey(query, resolvedUnits),
      fetch: async (coords) =>
        this.weatherVendor.getHourlyForecast(coords, resolvedUnits),
      query,
      units: resolvedUnits,
    });
  }

  getForecastByText(
    query: LocationQuery,
    units?: TemperatureUnit,
  ): Promise<ForecastDay[]> {
    const resolvedUnits = units ?? DefaultUnit.METRIC;
    return this.getCachedOrFetch({
      cacheKey: buildForecastWeatherKey(query, resolvedUnits),
      fetch: async (coords) =>
        this.weatherVendor.getForecast(coords, resolvedUnits),
      query,
      units: resolvedUnits,
    });
  }

  private async getCachedOrFetch<T extends WeatherCacheValue>(config: {
    cacheKey: string;
    fetch: (coords: Coordinates) => Promise<T>;
    query: LocationQuery;
    units: TemperatureUnit;
  }): Promise<T> {
    const cached = await this.weatherCache.get(config.cacheKey);
    if (cached) {
      this.logger.logCacheAccess('hit', config.cacheKey);
      return cached as T;
    }

    this.logger.logCacheAccess('miss', config.cacheKey);
    const coords = await this.resolveCoordinates(config.query);
    const result = await config.fetch(coords);
    const ttl = this.config.get('weatherCacheTtlSeconds', { infer: true });
    await this.weatherCache.set({
      key: config.cacheKey,
      value: result,
      ttlSeconds: ttl,
    });
    return result;
  }

  private async resolveCoordinates(query: LocationQuery): Promise<Coordinates> {
    const cacheKey = buildGeocodeTextKey(query);
    const cached = await this.geocoderCache.get(cacheKey);
    if (cached) {
      this.logger.logCacheAccess('hit', cacheKey);
      return cached;
    }

    this.logger.logCacheAccess('miss', cacheKey);
    const coords = await this.geocoderVendor.geocodeByText(query);
    const ttl = this.config.get('geocoderCacheTtlSeconds', { infer: true });
    await this.geocoderCache.set({
      key: cacheKey,
      value: coords,
      ttlSeconds: ttl,
    });
    return coords;
  }
}

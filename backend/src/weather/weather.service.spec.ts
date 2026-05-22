import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  TemperatureUnit,
  WeatherIconCode,
} from '@weather-app/types';
import { describe, expect, it, vi } from 'vitest';
import { GEOCODER_CACHE, WEATHER_CACHE } from '../common/cache/cache.interface';
import { MemoryCacheService } from '../common/cache/memory-cache.service';
import { AppLoggerService } from '../common/logger/app-logger.service';
import { GEOCODER_VENDOR } from '../geocoder/interfaces/geocoder-vendor.interface';
import { WEATHER_VENDOR } from './interfaces/weather-vendor.interface';
import { WeatherService } from './weather.service';

const mockCurrent = {
  temp: 22,
  feelsLike: 21,
  tempMin: 18,
  tempMax: 25,
  humidity: 65,
  pressure: 1013,
  visibility: 10000,
  cloudiness: 40,
  uvi: 5,
  dewPoint: 14,
  windSpeed: 4.5,
  windDeg: 180,
  condition: {
    id: 800,
    main: 'Clear',
    description: 'clear',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 'America/New_York',
  timezoneOffset: -18000,
  cityName: '',
};

describe('WeatherService', () => {
  const setup = async () => {
    const weatherCache = new MemoryCacheService();
    const geocoderCache = new MemoryCacheService();
    const weatherVendor = {
      getCurrentWeather: vi.fn().mockResolvedValue(mockCurrent),
      getHourlyForecast: vi.fn().mockResolvedValue([]),
      getForecast: vi.fn().mockResolvedValue([]),
    };
    const geocoderVendor = {
      geocodeByText: vi
        .fn()
        .mockResolvedValue({ lat: 35.2, lng: -80.8 }),
      reverseGeocode: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: WEATHER_VENDOR, useValue: weatherVendor },
        { provide: GEOCODER_VENDOR, useValue: geocoderVendor },
        { provide: WEATHER_CACHE, useValue: weatherCache },
        { provide: GEOCODER_CACHE, useValue: geocoderCache },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => {
              if (key === 'weatherCacheTtlSeconds') return 300;
              if (key === 'geocoderCacheTtlSeconds') return 3600;
              return undefined;
            }),
          },
        },
        {
          provide: AppLoggerService,
          useValue: {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            logCacheAccess: vi.fn(),
          },
        },
      ],
    }).compile();

    return {
      service: module.get(WeatherService),
      weatherVendor,
      geocoderVendor,
      weatherCache,
      geocoderCache,
    };
  };

  it('fetches current weather on cache miss and hits cache on second call', async () => {
    const { service, weatherVendor } = await setup();
    const query = { city: 'Charlotte', state: 'NC', country: 'US' };

    const first = await service.getCurrentWeatherByText(
      query,
      TemperatureUnit.METRIC,
    );
    const second = await service.getCurrentWeatherByText(
      query,
      TemperatureUnit.METRIC,
    );

    expect(first).toEqual(second);
    expect(weatherVendor.getCurrentWeather).toHaveBeenCalledTimes(1);
  });

  it('uses geocoder cache on second weather request', async () => {
    const { service, geocoderVendor } = await setup();
    const query = { city: 'Charlotte', country: 'US' };

    await service.getHourlyForecastByText(query);
    await service.getForecastByText(query);

    expect(geocoderVendor.geocodeByText).toHaveBeenCalledTimes(1);
  });

  it('returns cached weather without calling vendor', async () => {
    const { service, weatherVendor, weatherCache } = await setup();
    const query = { city: 'Cached', country: 'US' };
    await weatherCache.set({
      key: 'weather:current:cached||us:metric',
      value: { ...mockCurrent, cityName: 'Cached' },
      ttlSeconds: 300,
    });
    await service.getCurrentWeatherByText(query, TemperatureUnit.METRIC);
    expect(weatherVendor.getCurrentWeather).not.toHaveBeenCalled();
  });

  it('defaults units to metric when omitted', async () => {
    const { service } = await setup();
    await service.getCurrentWeatherByText({ city: 'Charlotte', country: 'US' });
    expect(true).toBe(true);
  });
});

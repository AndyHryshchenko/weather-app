import { afterEach, describe, expect, it } from 'vitest';
import configuration, { CacheDriver } from './configuration';

describe('configuration', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns default config values', () => {
    delete process.env.PORT;
    delete process.env.CLIENT_APP_HOST;
    delete process.env.OPENWEATHER_API_KEY;
    delete process.env.WEATHER_CACHE_TTL_SECONDS;
    delete process.env.GEOCODER_CACHE_TTL_SECONDS;
    delete process.env.CACHE_DRIVER;
    delete process.env.REDIS_URL;
    const config = configuration();
    expect(config.port).toBe(3001);
    expect(config.clientAppHost).toBe('http://localhost:5173');
    expect(config.openWeatherApiKey).toBe('');
    expect(config.cacheDriver).toBe(CacheDriver.MEMORY);
    expect(config.weatherCacheTtlSeconds).toBe(300);
    expect(config.geocoderCacheTtlSeconds).toBe(3600);
    expect(config.redisUrl).toBe('redis://localhost:6379');
  });

  it('reads env overrides', () => {
    process.env.PORT = '4000';
    process.env.CACHE_DRIVER = CacheDriver.REDIS;
    process.env.OPENWEATHER_API_KEY = 'key';
    process.env.CLIENT_APP_HOST = 'http://localhost:5174';
    process.env.WEATHER_CACHE_TTL_SECONDS = '120';
    process.env.GEOCODER_CACHE_TTL_SECONDS = '2400';
    process.env.REDIS_URL = 'redis://redis:6379';
    const config = configuration();
    expect(config.port).toBe(4000);
    expect(config.cacheDriver).toBe(CacheDriver.REDIS);
    expect(config.openWeatherApiKey).toBe('key');
    expect(config.clientAppHost).toBe('http://localhost:5174');
    expect(config.weatherCacheTtlSeconds).toBe(120);
    expect(config.geocoderCacheTtlSeconds).toBe(2400);
    expect(config.redisUrl).toBe('redis://redis:6379');
  });
});

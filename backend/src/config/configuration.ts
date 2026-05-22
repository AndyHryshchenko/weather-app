export enum CacheDriver {
  MEMORY = 'memory',
  REDIS = 'redis',
}

export interface AppConfig {
  port: number;
  clientAppHost: string;
  openWeatherApiKey: string;
  weatherCacheTtlSeconds: number;
  geocoderCacheTtlSeconds: number;
  cacheDriver: CacheDriver;
  redisUrl: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  clientAppHost: process.env.CLIENT_APP_HOST ?? 'http://localhost:5173',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? '',
  weatherCacheTtlSeconds: parseInt(
    process.env.WEATHER_CACHE_TTL_SECONDS ?? '300',
    10,
  ),
  geocoderCacheTtlSeconds: parseInt(
    process.env.GEOCODER_CACHE_TTL_SECONDS ?? '3600',
    10,
  ),
  cacheDriver: (process.env.CACHE_DRIVER as CacheDriver) ?? CacheDriver.MEMORY,
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

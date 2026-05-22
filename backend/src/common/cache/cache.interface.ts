export interface CacheSetConfig<T> {
  key: string;
  value: T;
  ttlSeconds: number;
}

export interface ICacheService<T> {
  get(key: string): Promise<T | undefined>;
  set(config: CacheSetConfig<T>): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export const WEATHER_CACHE = 'WEATHER_CACHE';
export const GEOCODER_CACHE = 'GEOCODER_CACHE';

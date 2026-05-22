import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/configuration';
import { CacheDriver } from '../../config/configuration';
import {
  GEOCODER_CACHE,
  WEATHER_CACHE,
} from './cache.interface';
import { MemoryCacheService } from './memory-cache.service';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: WEATHER_CACHE,
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const driver = config.get('cacheDriver', { infer: true });
        return driver === CacheDriver.REDIS
          ? new RedisCacheService()
          : new MemoryCacheService();
      },
      inject: [ConfigService],
    },
    {
      provide: GEOCODER_CACHE,
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const driver = config.get('cacheDriver', { infer: true });
        return driver === CacheDriver.REDIS
          ? new RedisCacheService()
          : new MemoryCacheService();
      },
      inject: [ConfigService],
    },
  ],
  exports: [WEATHER_CACHE, GEOCODER_CACHE],
})
export class CacheModule {}

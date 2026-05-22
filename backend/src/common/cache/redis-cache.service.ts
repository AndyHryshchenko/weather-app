import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CacheSetConfig, ICacheService } from './cache.interface';

@Injectable()
export class RedisCacheService<T> implements ICacheService<T> {
  async get(_key: string): Promise<T | undefined> {
    throw new NotImplementedException('Redis cache is not yet implemented');
  }

  async set(_config: CacheSetConfig<T>): Promise<void> {
    throw new NotImplementedException('Redis cache is not yet implemented');
  }

  async delete(_key: string): Promise<void> {
    throw new NotImplementedException('Redis cache is not yet implemented');
  }

  async clear(): Promise<void> {
    throw new NotImplementedException('Redis cache is not yet implemented');
  }
}

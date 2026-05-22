import { Injectable } from '@nestjs/common';
import type { CacheSetConfig, ICacheService } from './cache.interface';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class MemoryCacheService<T> implements ICacheService<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  async get(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return Promise.resolve(entry.value);
  }

  async set(config: CacheSetConfig<T>): Promise<void> {
    this.store.set(config.key, {
      value: config.value,
      expiresAt: Date.now() + config.ttlSeconds * 1000,
    });
    return Promise.resolve();
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
    return Promise.resolve();
  }

  async clear(): Promise<void> {
    this.store.clear();
    return Promise.resolve();
  }
}

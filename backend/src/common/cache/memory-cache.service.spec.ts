import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryCacheService } from './memory-cache.service';

describe('MemoryCacheService', () => {
  let cache: MemoryCacheService<string>;

  beforeEach(() => {
    cache = new MemoryCacheService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined for missing keys', async () => {
    await expect(cache.get('missing')).resolves.toBeUndefined();
  });

  it('stores and retrieves values', async () => {
    await cache.set({ key: 'a', value: 'hello', ttlSeconds: 60 });
    await expect(cache.get('a')).resolves.toBe('hello');
  });

  it('expires entries after TTL', async () => {
    await cache.set({ key: 'a', value: 'hello', ttlSeconds: 1 });
    vi.advanceTimersByTime(1001);
    await expect(cache.get('a')).resolves.toBeUndefined();
  });

  it('deletes a key', async () => {
    await cache.set({ key: 'a', value: 'hello', ttlSeconds: 60 });
    await cache.delete('a');
    await expect(cache.get('a')).resolves.toBeUndefined();
  });

  it('clears all entries', async () => {
    await cache.set({ key: 'a', value: '1', ttlSeconds: 60 });
    await cache.set({ key: 'b', value: '2', ttlSeconds: 60 });
    await cache.clear();
    await expect(cache.get('a')).resolves.toBeUndefined();
    await expect(cache.get('b')).resolves.toBeUndefined();
  });
});

import { NotImplementedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { RedisCacheService } from './redis-cache.service';

describe('RedisCacheService', () => {
  const cache = new RedisCacheService<string>();

  it('throws NotImplementedException for all operations', async () => {
    await expect(cache.get('key')).rejects.toBeInstanceOf(
      NotImplementedException,
    );
    await expect(
      cache.set({ key: 'key', value: 'v', ttlSeconds: 1 }),
    ).rejects.toBeInstanceOf(NotImplementedException);
    await expect(cache.delete('key')).rejects.toBeInstanceOf(
      NotImplementedException,
    );
    await expect(cache.clear()).rejects.toBeInstanceOf(NotImplementedException);
  });
});

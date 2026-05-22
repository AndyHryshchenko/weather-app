import { describe, expect, it, vi } from 'vitest';
import { RequestDeduplicator } from './request-deduplicator';

describe('RequestDeduplicator', () => {
  it('deduplicates concurrent calls with the same key', async () => {
    const deduplicator = new RequestDeduplicator<string>();
    const factory = vi.fn().mockResolvedValue('result');

    const [first, second] = await Promise.all([
      deduplicator.dedupe('key', factory),
      deduplicator.dedupe('key', factory),
    ]);

    expect(first).toBe('result');
    expect(second).toBe('result');
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('runs independent factories for sequential calls', async () => {
    const deduplicator = new RequestDeduplicator<number>();
    const factory = vi
      .fn()
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);

    const first = await deduplicator.dedupe('key', factory);
    const second = await deduplicator.dedupe('key', factory);

    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('cleans up pending map after rejection', async () => {
    const deduplicator = new RequestDeduplicator<void>();
    const factory = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(deduplicator.dedupe('key', factory)).rejects.toThrow('fail');
    const factory2 = vi.fn().mockResolvedValue(undefined);
    await deduplicator.dedupe('key', factory2);
    expect(factory2).toHaveBeenCalledTimes(1);
  });
});

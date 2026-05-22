import { describe, expect, it } from 'vitest';
import { configValidationSchema } from './config.schema';

describe('configValidationSchema', () => {
  it('validates required env with defaults', () => {
    const { error, value } = configValidationSchema.validate({
      OPENWEATHER_API_KEY: 'test-key',
    });
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3001);
    expect(value.CACHE_DRIVER).toBe('memory');
  });

  it('rejects missing API key', () => {
    const { error } = configValidationSchema.validate({});
    expect(error).toBeDefined();
  });
});

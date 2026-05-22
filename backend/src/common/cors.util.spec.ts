import { describe, expect, it, vi } from 'vitest';
import { createCorsOriginHandler } from './cors.util';

describe('createCorsOriginHandler', () => {
  it('allows requests without an origin header', () => {
    const handler = createCorsOriginHandler('http://localhost:5173', false);
    const callback = vi.fn();
    handler(undefined, callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('allows configured origins', () => {
    const handler = createCorsOriginHandler(
      'http://localhost:5173,http://localhost:5174',
      false,
    );
    const callback = vi.fn();
    handler('http://localhost:5174', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('allows any localhost port in development', () => {
    const handler = createCorsOriginHandler('http://localhost:5173', true);
    const callback = vi.fn();
    handler('http://localhost:5174', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('rejects unknown origins in production mode', () => {
    const handler = createCorsOriginHandler('http://localhost:5173', false);
    const callback = vi.fn();
    handler('http://localhost:5174', callback);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppLoggerService } from './app-logger.service';

describe('AppLoggerService', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
  });

  it('logs messages with and without context', () => {
    const service = new AppLoggerService();
    const logSpy = vi.spyOn(service['logger'], 'log');
    const warnSpy = vi.spyOn(service['logger'], 'warn');
    const errorSpy = vi.spyOn(service['logger'], 'error');

    service.log('hello');
    service.warn('warn', { key: 'value' });
    service.error('error', { code: 1 });

    expect(logSpy).toHaveBeenCalledWith('hello');
    expect(warnSpy).toHaveBeenCalledWith('warn {"key":"value"}');
    expect(errorSpy).toHaveBeenCalledWith('error {"code":1}');
  });

  it('logs cache hit outside production', () => {
    process.env.NODE_ENV = 'development';
    const service = new AppLoggerService();
    const logSpy = vi.spyOn(service['logger'], 'log');

    service.logCacheAccess('hit', 'weather:current:charlotte|nc|us:metric');

    expect(logSpy).toHaveBeenCalledWith(
      '[CACHE HIT] {"cacheKey":"weather:current:charlotte|nc|us:metric"}',
    );
  });

  it('logs cache miss outside production', () => {
    process.env.NODE_ENV = 'test';
    const service = new AppLoggerService();
    const logSpy = vi.spyOn(service['logger'], 'log');

    service.logCacheAccess('miss', 'geocode:text:seoul||kr');

    expect(logSpy).toHaveBeenCalledWith(
      '[CACHE MISS] {"cacheKey":"geocode:text:seoul||kr"}',
    );
  });

  it('does not log cache access in production', () => {
    process.env.NODE_ENV = 'production';
    const service = new AppLoggerService();
    const logSpy = vi.spyOn(service['logger'], 'log');

    service.logCacheAccess('hit', 'weather:current:charlotte|nc|us:metric');

    expect(logSpy).not.toHaveBeenCalled();
  });
});

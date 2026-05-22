import { describe, expect, it, vi } from 'vitest';
import { LoggerService } from './LoggerService';

describe('LoggerService', () => {
  it('logs without context', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    LoggerService.log('log');
    LoggerService.warn('warn');
    LoggerService.error('error');

    expect(logSpy).toHaveBeenCalledWith('log', '');
    expect(warnSpy).toHaveBeenCalledWith('warn', '');
    expect(errorSpy).toHaveBeenCalledWith('error', undefined, '');
    vi.restoreAllMocks();
  });

  it('logs with context', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    LoggerService.log('log', { a: 1 });
    expect(logSpy).toHaveBeenCalledWith('log', { a: 1 });
    vi.restoreAllMocks();
  });
});

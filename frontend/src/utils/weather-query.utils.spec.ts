import { describe, expect, it } from 'vitest';
import { AsyncStatus } from '@weather-app/types';
import {
  getQueryErrorMessage,
  mapQueryToAsyncStatus,
  resolveQueryErrorMessage,
} from './weather-query.utils';

describe('weather-query utils', () => {
  it('maps loading query state', () => {
    expect(
      mapQueryToAsyncStatus({
        isLoading: true,
        isError: false,
        isSuccess: false,
      }),
    ).toBe(AsyncStatus.LOADING);
  });

  it('maps failed query state', () => {
    expect(
      mapQueryToAsyncStatus({
        isLoading: false,
        isError: true,
        isSuccess: false,
      }),
    ).toBe(AsyncStatus.FAILED);
  });

  it('maps success query state', () => {
    expect(
      mapQueryToAsyncStatus({
        isLoading: false,
        isError: false,
        isSuccess: true,
      }),
    ).toBe(AsyncStatus.SUCCEEDED);
  });

  it('maps idle query state', () => {
    expect(
      mapQueryToAsyncStatus({
        isLoading: false,
        isError: false,
        isSuccess: false,
      }),
    ).toBe(AsyncStatus.IDLE);
  });

  it('returns null when error is absent', () => {
    expect(getQueryErrorMessage(null)).toBeNull();
    expect(getQueryErrorMessage(undefined)).toBeNull();
  });

  it('extracts API error messages', () => {
    expect(
      getQueryErrorMessage({
        status: 500,
        data: { message: 'Upstream unavailable' },
      }),
    ).toBe('Upstream unavailable');
  });

  it('maps fetch errors to a network message', () => {
    expect(
      resolveQueryErrorMessage({ status: 'FETCH_ERROR', error: 'Failed to fetch' }),
    ).toContain('Could not reach the server');
  });

  it('maps parsing errors to an invalid response message', () => {
    expect(
      resolveQueryErrorMessage({
        status: 'PARSING_ERROR',
        data: 'not json',
        originalStatus: 200,
      }),
    ).toContain('invalid response');
  });

  it('maps HTTP status codes without API messages', () => {
    expect(resolveQueryErrorMessage({ status: 404, data: {} })).toContain(
      'not found',
    );
    expect(resolveQueryErrorMessage({ status: 503, data: {} })).toContain(
      'temporarily unavailable',
    );
  });

  it('reads Error instances directly', () => {
    expect(resolveQueryErrorMessage(new Error('Invalid weather API response shape'))).toBe(
      'Invalid weather API response shape',
    );
  });

  it('returns fallback when error is missing', () => {
    expect(resolveQueryErrorMessage(undefined)).toBe('Failed to load weather data');
    expect(resolveQueryErrorMessage(null)).toBe('Failed to load weather data');
  });

  it('returns fallback for non-fetch errors and empty Error messages', () => {
    expect(resolveQueryErrorMessage('lookup failed')).toBe('Failed to load weather data');
    expect(resolveQueryErrorMessage(new Error('   '))).toBe('Failed to load weather data');
  });

  it('maps timeout and additional HTTP status codes', () => {
    expect(resolveQueryErrorMessage({ status: 'TIMEOUT_ERROR' })).toContain('timed out');
    expect(resolveQueryErrorMessage({ status: 400, data: {} })).toContain(
      'Invalid location',
    );
    expect(resolveQueryErrorMessage({ status: 502, data: {} })).toContain(
      'invalid response',
    );
    expect(resolveQueryErrorMessage({ status: 418, data: {} })).toBe(
      'Failed to load weather data',
    );
  });

  it('returns fallback for fetch errors with unknown status strings', () => {
    expect(resolveQueryErrorMessage({ status: 'CUSTOM_ERROR', data: {} })).toBe(
      'Failed to load weather data',
    );
  });

  it('ignores blank API messages and non-object error data', () => {
    expect(
      resolveQueryErrorMessage({ status: 500, data: { message: '   ' } }),
    ).toBe('Failed to load weather data');
    expect(resolveQueryErrorMessage({ status: 500, data: 'bad' })).toBe(
      'Failed to load weather data',
    );
  });
});

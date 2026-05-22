import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  GeolocationPermissionState,
  resolveGeolocationPermission,
} from './geolocation.utils';

describe('resolveGeolocationPermission', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns unsupported when geolocation is unavailable', async () => {
    vi.stubGlobal('navigator', {});
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.UNSUPPORTED,
    );
  });

  it('returns granted when permissions API reports granted', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {},
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.GRANTED,
    );
  });

  it('returns denied when permissions API reports denied', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {},
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'denied' }),
      },
    });
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.DENIED,
    );
  });

  it('returns prompt when permissions API is unavailable', async () => {
    vi.stubGlobal('navigator', { geolocation: {} });
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.PROMPT,
    );
  });

  it('returns prompt when permissions query throws', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {},
      permissions: {
        query: vi.fn().mockRejectedValue(new Error('denied')),
      },
    });
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.PROMPT,
    );
  });

  it('returns prompt for non-granted non-denied permission states', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {},
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'prompt' }),
      },
    });
    await expect(resolveGeolocationPermission()).resolves.toBe(
      GeolocationPermissionState.PROMPT,
    );
  });
});

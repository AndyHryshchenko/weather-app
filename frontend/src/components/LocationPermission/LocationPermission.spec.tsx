import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as WeatherApiModule from '@/store/weather/weather.api';
import { LoggerService } from '@/services/LoggerService';
import { GeolocationPermissionState } from '@/utils/geolocation.utils';
import { renderWithProviders } from '@/test/test-utils';
import { LocationPermission } from './LocationPermission';

const { mockReverseGeocode } = vi.hoisted(() => ({
  mockReverseGeocode: vi.fn(),
}));

vi.mock('@/store/weather/weather.api', async (importOriginal) => {
  const actual = await importOriginal<typeof WeatherApiModule>();
  return {
    ...actual,
    useLazyReverseGeocodeQuery: () => [mockReverseGeocode],
  };
});

const mockGeolocation = (config?: {
  permission?: PermissionState;
  onSuccess?: boolean;
}) => {
  vi.stubGlobal('navigator', {
    geolocation: {
      getCurrentPosition: (
        success: PositionCallback,
        error?: PositionErrorCallback,
      ) => {
        if (config?.onSuccess === false) {
          error?.({ code: 1 } as GeolocationPositionError);
          return;
        }
        success({
          coords: { latitude: 35.2, longitude: -80.8 },
        } as GeolocationPosition);
      },
    },
    permissions: {
      query: vi.fn().mockResolvedValue({
        state: config?.permission ?? 'granted',
      }),
    },
  });
};

describe('LocationPermission', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockReverseGeocode.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          city: 'Charlotte',
          country: 'US',
          displayName: 'Charlotte, US',
        }),
    });
  });

  it('shows permission content after geolocation succeeds', async () => {
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(screen.getByText('Enable location access')).toBeInTheDocument();
    });
    expect(screen.queryByText('Detecting your location…')).not.toBeInTheDocument();
  });

  it('auto-requests geolocation on mount when permission is granted', async () => {
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(mockReverseGeocode).toHaveBeenCalled();
    });
  });

  it('shows detecting state while loading without enable-access title', () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: () => undefined,
      },
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
    const { container } = renderWithProviders(<LocationPermission />);
    expect(screen.getByText('Detecting your location…')).toBeInTheDocument();
    expect(screen.queryByText('Enable location access')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });

  it('shows denied message when permission is denied', async () => {
    mockGeolocation({ permission: 'denied' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText('Location access was denied. Search for a city instead.'),
      ).toBeInTheDocument();
    });
  });

  it('shows denied when geolocation is unavailable', async () => {
    vi.stubGlobal('navigator', {});
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText('Location access was denied. Search for a city instead.'),
      ).toBeInTheDocument();
    });
  });

  it('shows API error message when reverse geocode fails', async () => {
    mockReverseGeocode.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Reverse geocode unavailable')),
    });
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(screen.getByText('Reverse geocode unavailable')).toBeInTheDocument();
    });
  });

  it('shows denied when geolocation callback errors', async () => {
    mockGeolocation({ permission: 'granted', onSuccess: false });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText('Location access was denied. Search for a city instead.'),
      ).toBeInTheDocument();
    });
  });

  it('requests location when permission state is prompt', async () => {
    const geolocationUtils = await import('@/utils/geolocation.utils');
    vi.spyOn(geolocationUtils, 'resolveGeolocationPermission').mockResolvedValue(
      GeolocationPermissionState.PROMPT,
    );
    mockGeolocation({ permission: 'prompt' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(mockReverseGeocode).toHaveBeenCalled();
    });
  });

  it('logs geolocation callback errors with a message when provided', async () => {
    const warnSpy = vi.spyOn(LoggerService, 'warn').mockImplementation(() => {});
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (
          _success: PositionCallback,
          error?: PositionErrorCallback,
        ) => {
          error?.({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError);
        },
      },
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith('Geolocation request failed', {
        code: 1,
        message: 'User denied Geolocation',
      });
    });
  });

  it('shows denied when geolocation is missing during request', async () => {
    const geolocationUtils = await import('@/utils/geolocation.utils');
    vi.spyOn(geolocationUtils, 'resolveGeolocationPermission').mockResolvedValue(
      GeolocationPermissionState.GRANTED,
    );
    vi.stubGlobal('navigator', {
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText('Location access was denied. Search for a city instead.'),
      ).toBeInTheDocument();
    });
  });

  it('logs non-Error reverse geocode failures without an Error instance', async () => {
    const errorSpy = vi.spyOn(LoggerService, 'error').mockImplementation(() => {});
    mockReverseGeocode.mockReturnValue({
      unwrap: () => Promise.reject({ status: 500, data: { message: 'Server down' } }),
    });
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(screen.getByText('Server down')).toBeInTheDocument();
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Reverse geocode failed after GPS success',
      undefined,
    );
  });

  it('shows denied when permission resolver reports unsupported', async () => {
    const geolocationUtils = await import('@/utils/geolocation.utils');
    vi.spyOn(geolocationUtils, 'resolveGeolocationPermission').mockResolvedValue(
      GeolocationPermissionState.UNSUPPORTED,
    );
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: vi.fn(),
      },
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText('Location access was denied. Search for a city instead.'),
      ).toBeInTheDocument();
    });
  });

  it('shows generic lookup message for non-error rejections', async () => {
    mockReverseGeocode.mockReturnValue({
      unwrap: () => Promise.reject('lookup failed'),
    });
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load weather data')).toBeInTheDocument();
    });
  });

  it('shows lookup fallback copy when reverse geocode rejects null', async () => {
    mockReverseGeocode.mockReturnValue({
      unwrap: () => Promise.reject(null),
    });
    mockGeolocation({ permission: 'granted' });
    renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(
        screen.getByText(
          'We found your position but could not resolve your city. Check that the backend is running, then try again or search for a city.',
        ),
      ).toBeInTheDocument();
    });
  });

});

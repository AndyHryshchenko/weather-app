import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as WeatherApiModule from '@/store/weather/weather.api';
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

describe('LocationPermission API flow', () => {
  beforeEach(() => {
    mockReverseGeocode.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          city: 'Charlotte',
          country: 'US',
          displayName: 'Charlotte, US',
        }),
    });
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) =>
          success({
            coords: { latitude: 35.2, longitude: -80.8 },
          } as GeolocationPosition),
      },
      permissions: {
        query: vi.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
  });

  it('stores location on mount after reverse geocode succeeds', async () => {
    const { store } = renderWithProviders(<LocationPermission />);
    await waitFor(() => {
      expect(store.getState().location.displayName).toBe('Charlotte, US');
    });
    expect(screen.queryByText('Use my location')).not.toBeInTheDocument();
  });
});

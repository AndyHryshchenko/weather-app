import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncStatus, LocationSource, TemperatureUnit } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { useWeatherForLocation } from '@/store/weather/useWeatherQueries';
import { WeatherPage } from './WeatherPage';

vi.mock('@/store/weather/useWeatherQueries', () => ({
  useWeatherForLocation: vi.fn(),
}));

const mockUseWeatherForLocation = vi.mocked(useWeatherForLocation);

describe('WeatherPage forecast label', () => {
  it('shows forecast day count when daily data is loaded', () => {
    mockUseWeatherForLocation.mockReturnValue({
      current: null,
      hourly: null,
      forecast: null,
      currentStatus: AsyncStatus.IDLE,
      hourlyStatus: AsyncStatus.IDLE,
      forecastStatus: AsyncStatus.SUCCEEDED,
      forecastDayCount: 2,
      errors: [],
      currentError: null,
      hourlyError: null,
      forecastError: null,
    });
    renderWithProviders(<WeatherPage />, {
      preloadedState: {
        location: {
          locationQuery: { city: 'Charlotte', country: 'US' },
          displayName: 'Charlotte, US',
          source: LocationSource.GPS,
        },
        settings: { units: TemperatureUnit.METRIC },
      },
    });
    expect(screen.getByText('2-Day Forecast')).toBeInTheDocument();
  });
});

import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncStatus, TemperatureUnit } from '@weather-app/types';
import { WeatherRequestKind } from '@/constants/weather-request.constants';
import { renderWithProviders } from '@/test/test-utils';
import { setLocationFromGps } from '@/store/location/location.slice';
import { useWeatherForLocation } from '@/store/weather/useWeatherQueries';
import { WeatherPage } from './WeatherPage';

vi.mock('@/store/weather/useWeatherQueries', () => ({
  useWeatherForLocation: vi.fn(),
}));

const mockUseWeatherForLocation = vi.mocked(useWeatherForLocation);

describe('WeatherPage', () => {
  beforeEach(() => {
    mockUseWeatherForLocation.mockReturnValue({
      current: null,
      hourly: null,
      forecast: null,
      currentStatus: AsyncStatus.IDLE,
      hourlyStatus: AsyncStatus.IDLE,
      forecastStatus: AsyncStatus.IDLE,
      forecastDayCount: 0,
      errors: [],
      currentError: null,
      hourlyError: null,
      forecastError: null,
    });
  });
  it('shows location permission when no query', () => {
    renderWithProviders(<WeatherPage />);
    expect(screen.getByText('Detecting your location…')).toBeInTheDocument();
    expect(screen.queryByText('Enable location access')).not.toBeInTheDocument();
  });

  it('shows location header when location is set', async () => {
    const { store } = renderWithProviders(<WeatherPage />);
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        country: 'US',
        displayName: 'Charlotte, US',
      }),
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, US')).toBeInTheDocument();
    });
  });

  it('shows detailed errors when weather requests fail', () => {
    mockUseWeatherForLocation.mockReturnValue({
      current: null,
      hourly: null,
      forecast: null,
      currentStatus: AsyncStatus.FAILED,
      hourlyStatus: AsyncStatus.FAILED,
      forecastStatus: AsyncStatus.IDLE,
      forecastDayCount: 0,
      errors: [
        { request: WeatherRequestKind.CURRENT, message: 'Current failed' },
        { request: WeatherRequestKind.HOURLY, message: 'Hourly failed' },
      ],
      currentError: 'Current failed',
      hourlyError: 'Hourly failed',
      forecastError: null,
    });
    renderWithProviders(<WeatherPage />, {
      preloadedState: {
        location: {
          locationQuery: { city: 'Charlotte', country: 'US' },
          displayName: 'Charlotte, US',
          source: null,
        },
        settings: { units: TemperatureUnit.METRIC },
      },
    });
    expect(screen.getByText(/Some weather data could not be loaded/)).toBeInTheDocument();
    expect(screen.getByText('Current weather')).toBeInTheDocument();
    expect(screen.getByText('Hourly forecast')).toBeInTheDocument();
    expect(screen.getAllByText('Current failed')).toHaveLength(2);
    expect(screen.getByText('Hourly failed')).toBeInTheDocument();
  });
});

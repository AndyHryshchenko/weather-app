import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherTabForecastSection } from './WeatherTabForecastSection';

const forecastDay = {
  dt: 1700086400,
  sunrise: 1700060000,
  sunset: 1700100000,
  temp: { min: 10, max: 25, morn: 12, day: 22, eve: 18, night: 11 },
  feelsLike: { day: 21 },
  humidity: 50,
  pressure: 1010,
  dewPoint: 10,
  windSpeed: 2,
  windDeg: 90,
  clouds: 20,
  uvi: 3,
  pop: 0.1,
  condition: {
    id: 800,
    main: 'Clear',
    description: 'clear',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  summary: 'Clear',
};

describe('WeatherTabForecastSection', () => {
  it('renders temperature phases when loaded', () => {
    renderWithProviders(
      <WeatherTabForecastSection
        day={forecastDay}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.SUCCEEDED}
        errorMessage={null}
      />,
    );
    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = renderWithProviders(
      <WeatherTabForecastSection
        day={forecastDay}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.LOADING}
        errorMessage={null}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders fallback error when forecast request fails without a message', () => {
    renderWithProviders(
      <WeatherTabForecastSection
        day={forecastDay}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.FAILED}
        errorMessage={null}
      />,
    );
    expect(screen.getByText('This section could not be loaded.')).toBeInTheDocument();
  });

  it('renders provided error message when forecast request fails', () => {
    renderWithProviders(
      <WeatherTabForecastSection
        day={forecastDay}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.FAILED}
        errorMessage="Forecast unavailable"
      />,
    );
    expect(screen.getByText('Forecast unavailable')).toBeInTheDocument();
  });
});

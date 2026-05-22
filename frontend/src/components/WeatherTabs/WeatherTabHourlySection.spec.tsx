import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherTabHourlySection } from './WeatherTabHourlySection';

const hour = {
  dt: 1700000000,
  temp: 20,
  feelsLike: 19,
  humidity: 50,
  pressure: 1010,
  dewPoint: 10,
  uvi: 3,
  clouds: 20,
  visibility: 10000,
  windSpeed: 2,
  windDeg: 90,
  pop: 0.1,
  condition: {
    id: 800,
    main: 'Clear',
    description: 'clear',
    icon: WeatherIconCode.CLEAR_DAY,
  },
};

describe('WeatherTabHourlySection', () => {
  it('renders hourly strip when loaded', () => {
    renderWithProviders(
      <WeatherTabHourlySection
        dayStart={hour.dt}
        hourly={[hour]}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.SUCCEEDED}
        errorMessage={null}
      />,
    );
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = renderWithProviders(
      <WeatherTabHourlySection
        dayStart={hour.dt}
        hourly={[]}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.LOADING}
        errorMessage={null}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders fallback error when hourly request fails without a message', () => {
    renderWithProviders(
      <WeatherTabHourlySection
        dayStart={hour.dt}
        hourly={null}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.FAILED}
        errorMessage={null}
      />,
    );
    expect(screen.getByText('This section could not be loaded.')).toBeInTheDocument();
  });

  it('renders provided error message when hourly request fails', () => {
    renderWithProviders(
      <WeatherTabHourlySection
        dayStart={hour.dt}
        hourly={null}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.FAILED}
        errorMessage="Hourly unavailable"
      />,
    );
    expect(screen.getByText('Hourly unavailable')).toBeInTheDocument();
  });
});

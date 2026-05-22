import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherTabTodayPanel } from './WeatherTabTodayPanel';

const current = {
  temp: 22,
  feelsLike: 20,
  tempMin: 18,
  tempMax: 25,
  humidity: 50,
  pressure: 1010,
  visibility: 10000,
  cloudiness: 30,
  uvi: 4,
  dewPoint: 10,
  windSpeed: 3,
  windDeg: 90,
  condition: {
    id: 800,
    main: 'Clear',
    description: 'clear',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 'UTC',
  timezoneOffset: 0,
  cityName: 'Test',
};

describe('WeatherTabTodayPanel', () => {
  it('renders current weather and stats when loaded', () => {
    renderWithProviders(
      <WeatherTabTodayPanel
        current={current}
        hourly={[]}
        units={TemperatureUnit.METRIC}
        dayStart={current.sunrise}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        currentError={null}
        hourlyError={null}
      />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders skeleton while current weather is loading', () => {
    const { container } = renderWithProviders(
      <WeatherTabTodayPanel
        current={null}
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={current.sunrise}
        currentStatus={AsyncStatus.LOADING}
        hourlyStatus={AsyncStatus.IDLE}
        currentError={null}
        hourlyError={null}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders fallback error when current weather fails without a message', () => {
    renderWithProviders(
      <WeatherTabTodayPanel
        current={null}
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={current.sunrise}
        currentStatus={AsyncStatus.FAILED}
        hourlyStatus={AsyncStatus.IDLE}
        currentError={null}
        hourlyError={null}
      />,
    );
    expect(screen.getByText('This section could not be loaded.')).toBeInTheDocument();
  });

  it('renders provided error when current weather fails', () => {
    renderWithProviders(
      <WeatherTabTodayPanel
        current={null}
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={current.sunrise}
        currentStatus={AsyncStatus.FAILED}
        hourlyStatus={AsyncStatus.IDLE}
        currentError="Current unavailable"
        hourlyError={null}
      />,
    );
    expect(screen.getByText('Current unavailable')).toBeInTheDocument();
  });
});

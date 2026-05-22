import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherTabs } from './WeatherTabs';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear',
  icon: WeatherIconCode.CLEAR_DAY,
};

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
  condition,
};

describe('WeatherTabs forecast panels', () => {
  it('shows temperature phase strip on day 3+ tab', () => {
    const base = 1700000000;
    const forecast = Array.from({ length: 5 }, (_, index) => ({
      ...forecastDay,
      dt: base + index * 86400,
    }));

    renderWithProviders(
      <WeatherTabs
        current={null}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="2"
      />,
    );

    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('shows forecast error on day 3+ tab when daily data fails', () => {
    const base = 1700000000;
    const forecast = Array.from({ length: 5 }, (_, index) => ({
      ...forecastDay,
      dt: base + index * 86400,
    }));

    renderWithProviders(
      <WeatherTabs
        current={null}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.FAILED}
        forecastError={null}
        defaultTab="2"
      />,
    );

    expect(screen.getByText('This section could not be loaded.')).toBeInTheDocument();
  });

  it('shows loading skeleton on day 3+ tab while forecast loads', () => {
    const base = 1700000000;
    const forecast = Array.from({ length: 5 }, (_, index) => ({
      ...forecastDay,
      dt: base + index * 86400,
    }));

    const { container } = renderWithProviders(
      <WeatherTabs
        current={null}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.LOADING}
        defaultTab="2"
      />,
    );

    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });
});

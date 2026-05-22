import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherTabDayPanel } from './WeatherTabDayPanel';

const currentWeatherProps = {
  conditionIcon: WeatherIconCode.CLEAR_DAY,
  conditionDescription: 'clear',
  temp: 22,
  feelsLike: 20,
  humidity: 50,
  windSpeed: 3,
  pressure: 1010,
  uvi: 4,
  visibility: 10000,
  cloudiness: 30,
  dewPoint: 10,
};

describe('WeatherTabDayPanel', () => {
  it('renders weather display and stats when loaded', () => {
    renderWithProviders(
      <WeatherTabDayPanel
        {...currentWeatherProps}
        hourly={[]}
        units={TemperatureUnit.METRIC}
        dayStart={1700000000}
        status={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        hourlyError={null}
      />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders high/low for forecast-style props', () => {
    renderWithProviders(
      <WeatherTabDayPanel
        conditionIcon={WeatherIconCode.CLEAR_DAY}
        conditionDescription="clear"
        tempMin={10}
        tempMax={25}
        humidity={50}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(screen.getByText(/H 25°C \/ L 10°C/)).toBeInTheDocument();
  });

  it('renders temperature phases when hourly is not passed', () => {
    renderWithProviders(
      <WeatherTabDayPanel
        conditionIcon={WeatherIconCode.CLEAR_DAY}
        conditionDescription="clear"
        tempMin={10}
        tempMax={25}
        tempMorn={12}
        tempDay={22}
        units={TemperatureUnit.METRIC}
        status={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('renders skeleton while loading', () => {
    const { container } = renderWithProviders(
      <WeatherTabDayPanel
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={1700000000}
        status={AsyncStatus.LOADING}
        hourlyStatus={AsyncStatus.IDLE}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders fallback error when failed without a message', () => {
    renderWithProviders(
      <WeatherTabDayPanel
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={1700000000}
        status={AsyncStatus.FAILED}
        hourlyStatus={AsyncStatus.IDLE}
      />,
    );
    expect(screen.getByText('This section could not be loaded.')).toBeInTheDocument();
  });

  it('renders provided error when failed', () => {
    renderWithProviders(
      <WeatherTabDayPanel
        hourly={null}
        units={TemperatureUnit.METRIC}
        dayStart={1700000000}
        status={AsyncStatus.FAILED}
        errorMessage="Current unavailable"
        hourlyStatus={AsyncStatus.IDLE}
      />,
    );
    expect(screen.getByText('Current unavailable')).toBeInTheDocument();
  });
});

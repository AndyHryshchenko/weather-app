import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { HourlyForecast } from '@weather-app/types';
import { AsyncStatus, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { getStartOfDay } from '@/utils/date.utils';
import { WeatherTabs } from './WeatherTabs';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear',
  icon: WeatherIconCode.CLEAR_DAY,
};

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
  condition,
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 'UTC',
  timezoneOffset: 0,
  cityName: 'Test',
};

const buildHourlyForecast = (overrides: Partial<HourlyForecast> & { dt: number }): HourlyForecast => ({
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
  condition,
  ...overrides,
});

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
  summary: 'Clear',
};

describe('WeatherTabs', () => {
  it('renders one tab per available forecast day', () => {
    const forecast = Array.from({ length: 5 }, (_, index) => ({
      ...forecastDay,
      dt: current.sunrise + index * 86400,
    }));

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.queryByRole('tab', { name: /Fri, May 29/i })).not.toBeInTheDocument();
  });

  it('renders only today while forecast is still loading', () => {
    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={null}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.LOADING}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(1);
    expect(screen.getByRole('tab', { name: 'Today' })).toBeInTheDocument();
  });

  it('renders today tab with current weather', () => {
    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={[]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows an error alert when current weather fails', () => {
    renderWithProviders(
      <WeatherTabs
        current={null}
        hourly={null}
        forecast={null}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.FAILED}
        hourlyStatus={AsyncStatus.IDLE}
        forecastStatus={AsyncStatus.IDLE}
        currentError="Current weather unavailable"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Current weather unavailable',
    );
  });

  it('shows skeleton while loading', () => {
    const { container } = renderWithProviders(
      <WeatherTabs
        current={null}
        hourly={null}
        forecast={null}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.LOADING}
        hourlyStatus={AsyncStatus.LOADING}
        forecastStatus={AsyncStatus.LOADING}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders today tab when hourly data is null', () => {
    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={null}
        forecast={[]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders hourly strip on today tab when hourly data is loaded', () => {
    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[buildHourlyForecast({ dt: current.sunrise })]}
        forecast={[]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('renders hourly loading skeleton on today tab', () => {
    const { container } = renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={[]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.LOADING}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders tomorrow tab when hourly data is null', () => {
    const tomorrow = {
      ...forecastDay,
      dt: current.sunrise + 86_400,
    };

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={null}
        forecast={[forecastDay, tomorrow]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="1"
      />,
    );

    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
  });

  it('renders hourly strip on tomorrow tab when hourly data is loaded', () => {
    const tomorrow = {
      ...forecastDay,
      dt: current.sunrise + 86_400,
    };
    const tomorrowHour = buildHourlyForecast({
      dt: tomorrow.sunrise + 3600,
      temp: 18,
      feelsLike: 17,
      pop: 0.2,
      windDeg: 180,
    });

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[tomorrowHour]}
        forecast={[forecastDay, tomorrow]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="1"
      />,
    );

    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Chance of rain')).toBeInTheDocument();
  });

  it('shows hourly on later tabs when hourly data covers those days', () => {
    const forecast = Array.from({ length: 3 }, (_, index) => ({
      ...forecastDay,
      dt: current.sunrise + index * 86_400,
    }));
    const dayTwoStart = getStartOfDay(forecast[2].dt);
    const dayTwoHour = buildHourlyForecast({
      dt: dayTwoStart + 3600,
      temp: 16,
      feelsLike: 15,
      pop: 0.3,
      windDeg: 270,
    });

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[dayTwoHour]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="2"
      />,
    );

    expect(screen.getByText('Chance of rain')).toBeInTheDocument();
    expect(screen.queryByText('Morning')).not.toBeInTheDocument();
  });

  it('renders formatted date label for tabs after tomorrow', () => {
    const forecast = Array.from({ length: 4 }, (_, index) => ({
      ...forecastDay,
      dt: current.sunrise + index * 86_400,
    }));

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
      />,
    );

    expect(
      screen.getByRole('tab', {
        name: new Date((current.sunrise + 2 * 86_400) * 1000).toLocaleDateString(
          'en-US',
          { weekday: 'short', month: 'short', day: 'numeric' },
        ),
      }),
    ).toBeInTheDocument();
  });

  it('does not render day panel when forecast entry is missing at tab index', () => {
    const forecast = [
      { ...forecastDay, dt: current.sunrise },
      { ...forecastDay, dt: current.sunrise + 86_400 },
    ];
    forecast.length = 3;

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="2"
      />,
    );

    expect(screen.getByRole('tabpanel')).toBeEmptyDOMElement();
  });

  it('shows forecast error on non-today tabs', () => {
    const tomorrow = {
      ...forecastDay,
      dt: current.sunrise + 86_400,
    };

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[]}
        forecast={[forecastDay, tomorrow]}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.FAILED}
        forecastError="Forecast unavailable"
        defaultTab="1"
      />,
    );

    expect(screen.getByText('Forecast unavailable')).toBeInTheDocument();
  });

  it('shows temperature phases on tabs beyond hourly coverage', () => {
    const forecast = Array.from({ length: 3 }, (_, index) => ({
      ...forecastDay,
      dt: current.sunrise + index * 86_400,
    }));

    renderWithProviders(
      <WeatherTabs
        current={current}
        hourly={[buildHourlyForecast({ dt: current.sunrise + 3600 })]}
        forecast={forecast}
        units={TemperatureUnit.METRIC}
        currentStatus={AsyncStatus.SUCCEEDED}
        hourlyStatus={AsyncStatus.SUCCEEDED}
        forecastStatus={AsyncStatus.SUCCEEDED}
        defaultTab="2"
      />,
    );

    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.queryByText('Chance of rain')).not.toBeInTheDocument();
  });

});

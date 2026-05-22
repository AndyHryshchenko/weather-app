import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherDisplay } from './WeatherDisplay';

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
    description: 'clear sky',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  sunrise: 1,
  sunset: 2,
  timezone: 'UTC',
  timezoneOffset: 0,
  cityName: 'Test',
};

describe('WeatherDisplay', () => {
  it('renders temperature and description', () => {
    renderWithProviders(
      <WeatherDisplay current={current} units={TemperatureUnit.METRIC} />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });
});

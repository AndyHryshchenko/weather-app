import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherDisplay } from './WeatherDisplay';

describe('WeatherDisplay', () => {
  it('renders temperature and description', () => {
    renderWithProviders(
      <WeatherDisplay
        conditionIcon={WeatherIconCode.CLEAR_DAY}
        conditionDescription="clear sky"
        temp={22}
        feelsLike={20}
        units={TemperatureUnit.METRIC}
      />,
    );
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('renders high/low when temp is omitted', () => {
    renderWithProviders(
      <WeatherDisplay
        conditionIcon={WeatherIconCode.CLEAR_DAY}
        conditionDescription="clear"
        tempMin={10}
        tempMax={25}
        units={TemperatureUnit.METRIC}
      />,
    );
    expect(screen.getByText(/H 25°C \/ L 10°C/)).toBeInTheDocument();
  });
});

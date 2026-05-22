import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { DayWeatherSummary } from './DayWeatherSummary';

const day = {
  dt: 1,
  sunrise: 1,
  sunset: 2,
  temp: { min: 10, max: 25, day: 22 },
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
    description: 'sunny',
    icon: WeatherIconCode.CLEAR_DAY,
  },
  summary: 'Nice day',
};

describe('DayWeatherSummary', () => {
  it('renders day summary', () => {
    render(<DayWeatherSummary day={day} units={TemperatureUnit.METRIC} />);
    expect(screen.getByText('sunny')).toBeInTheDocument();
    expect(screen.getByText('Nice day')).toBeInTheDocument();
  });

  it('omits summary when not provided', () => {
    const dayWithoutSummary = { ...day, summary: undefined };
    render(
      <DayWeatherSummary day={dayWithoutSummary} units={TemperatureUnit.METRIC} />,
    );
    expect(screen.queryByText('Nice day')).not.toBeInTheDocument();
  });
});

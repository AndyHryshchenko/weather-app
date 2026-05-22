import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { TemperaturePhaseStrip } from './TemperaturePhaseStrip';

const day = {
  dt: 1,
  sunrise: 1,
  sunset: 2,
  temp: { min: 10, max: 25, morn: 12, day: 22, eve: 18, night: 11 },
  feelsLike: {},
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
};

describe('TemperaturePhaseStrip', () => {
  it('renders phase cards', () => {
    render(<TemperaturePhaseStrip day={day} units={TemperatureUnit.METRIC} />);
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders only phases with values', () => {
    render(
      <TemperaturePhaseStrip
        day={{
          ...day,
          temp: { min: 10, max: 20 },
        }}
        units={TemperatureUnit.METRIC}
      />,
    );
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.queryByText('Morning')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HourlyStrip } from './HourlyStrip';

const hour = {
  dt: 1700000000,
  temp: 20,
  feelsLike: 19,
  humidity: 50,
  pressure: 1010,
  dewPoint: 10,
  uvi: 2,
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

describe('HourlyStrip', () => {
  it('returns null when empty', () => {
    const { container } = render(
      <HourlyStrip hours={[]} units={TemperatureUnit.METRIC} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders hourly cards in a responsive grid', () => {
    const { container } = render(
      <TooltipProvider>
        <HourlyStrip hours={[hour]} units={TemperatureUnit.METRIC} />
      </TooltipProvider>,
    );
    expect(screen.getByText('Chance of rain')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('grid-cols-1');
    expect(container.firstChild).toHaveClass('md:grid-cols-2');
  });
});

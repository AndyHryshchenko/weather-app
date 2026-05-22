import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HourlyCard } from './HourlyCard';

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

describe('HourlyCard', () => {
  it('renders labeled fields in a 2x2 grid', () => {
    const { container } = render(
      <TooltipProvider>
        <HourlyCard hour={hour} units={TemperatureUnit.METRIC} />
      </TooltipProvider>,
    );
    expect(container.querySelector('article')).toHaveClass('grid-cols-2');
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Conditions')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Chance of rain')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('clear')).toBeInTheDocument();
  });
});

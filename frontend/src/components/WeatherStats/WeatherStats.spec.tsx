import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { WeatherStats } from './WeatherStats';

describe('WeatherStats', () => {
  it('renders stat grid', () => {
    renderWithProviders(
      <WeatherStats
        humidity={50}
        windSpeed={3}
        pressure={1010}
        uvi={4}
        visibility={10000}
        cloudiness={30}
        dewPoint={10}
      />,
    );
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

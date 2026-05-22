import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import { WeatherIcon } from './WeatherIcon';

describe('WeatherIcon', () => {
  it('renders icon for known code', () => {
    const { container } = render(
      <WeatherIcon code={WeatherIconCode.CLEAR_DAY} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

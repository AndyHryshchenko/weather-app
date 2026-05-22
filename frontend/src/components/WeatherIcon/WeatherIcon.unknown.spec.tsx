import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherIconCode } from '@weather-app/types';
import { WeatherIcon } from './WeatherIcon';

describe('WeatherIcon unknown fallback', () => {
  it('uses unknown icon mapping', () => {
    const { container } = render(
      <WeatherIcon code={'INVALID' as WeatherIconCode} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

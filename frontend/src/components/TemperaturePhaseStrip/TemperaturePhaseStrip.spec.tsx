import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { TemperaturePhaseStrip } from './TemperaturePhaseStrip';

describe('TemperaturePhaseStrip', () => {
  it('renders phase cards', () => {
    render(
      <TemperaturePhaseStrip
        units={TemperatureUnit.METRIC}
        tempMorn={12}
        tempDay={22}
        tempEve={18}
        tempNight={11}
        tempMin={10}
        tempMax={25}
      />,
    );
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders only phases with values', () => {
    render(
      <TemperaturePhaseStrip
        units={TemperatureUnit.METRIC}
        tempMin={10}
        tempMax={20}
      />,
    );
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.queryByText('Morning')).not.toBeInTheDocument();
  });
});

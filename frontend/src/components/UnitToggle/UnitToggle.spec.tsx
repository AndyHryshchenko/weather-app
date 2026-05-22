import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { renderWithProviders } from '@/test/test-utils';
import { UnitToggle } from './UnitToggle';

describe('UnitToggle', () => {
  it('switches to imperial and back to metric', () => {
    const { store } = renderWithProviders(<UnitToggle />);
    fireEvent.click(screen.getByText('Imperial'));
    expect(store.getState().settings.units).toBe(TemperatureUnit.IMPERIAL);
    fireEvent.click(screen.getByText('Metric'));
    expect(store.getState().settings.units).toBe(TemperatureUnit.METRIC);
  });
});

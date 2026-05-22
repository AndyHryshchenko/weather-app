import { describe, expect, it } from 'vitest';
import { TemperatureUnit } from '@weather-app/types';
import { setUnits, settingsSlice } from './settings.slice';

describe('settingsSlice', () => {
  it('updates units', () => {
    const state = settingsSlice.reducer(
      settingsSlice.getInitialState(),
      setUnits(TemperatureUnit.IMPERIAL),
    );
    expect(state.units).toBe(TemperatureUnit.IMPERIAL);
  });
});

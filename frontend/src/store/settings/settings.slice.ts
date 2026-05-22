import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TemperatureUnit } from '@weather-app/types';

export interface SettingsState {
  units: TemperatureUnit;
}

const initialState: SettingsState = {
  units: TemperatureUnit.METRIC,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<TemperatureUnit>) => {
      state.units = action.payload;
    },
  },
});

export const { setUnits } = settingsSlice.actions;

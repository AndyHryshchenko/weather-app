import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LocationInfo, LocationQuery } from '@weather-app/types';
import { LocationSource } from '@weather-app/types';

export interface LocationState {
  locationQuery: LocationQuery | null;
  displayName: string | null;
  source: LocationSource | null;
}

const initialState: LocationState = {
  locationQuery: null,
  displayName: null,
  source: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationFromGps: (state, action: PayloadAction<LocationInfo>) => {
      state.locationQuery = {
        city: action.payload.city,
        state: action.payload.state,
        country: action.payload.country,
      };
      state.displayName = action.payload.displayName;
      state.source = LocationSource.GPS;
    },
    setLocationFromSearch: (
      state,
      action: PayloadAction<{ query: LocationQuery; displayName: string }>,
    ) => {
      state.locationQuery = action.payload.query;
      state.displayName = action.payload.displayName;
      state.source = LocationSource.SEARCH;
    },
    clearLocation: () => initialState,
  },
});

export const {
  setLocationFromGps,
  setLocationFromSearch,
  clearLocation,
} = locationSlice.actions;

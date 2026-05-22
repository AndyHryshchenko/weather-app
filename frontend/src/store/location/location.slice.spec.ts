import { describe, expect, it } from 'vitest';
import { LocationSource } from '@weather-app/types';
import {
  clearLocation,
  locationSlice,
  setLocationFromGps,
  setLocationFromSearch,
} from './location.slice';

describe('locationSlice', () => {
  it('sets GPS location', () => {
    const state = locationSlice.reducer(
      locationSlice.getInitialState(),
      setLocationFromGps({
        city: 'Indian Trail',
        state: 'NC',
        country: 'US',
        displayName: 'Indian Trail, NC, US',
      }),
    );
    expect(state.source).toBe(LocationSource.GPS);
    expect(state.locationQuery?.city).toBe('Indian Trail');
  });

  it('sets search location and clears', () => {
    const searched = locationSlice.reducer(
      locationSlice.getInitialState(),
      setLocationFromSearch({
        query: { city: 'Charlotte', country: 'US' },
        displayName: 'Charlotte, US',
      }),
    );
    expect(searched.source).toBe(LocationSource.SEARCH);
    const cleared = locationSlice.reducer(searched, clearLocation());
    expect(cleared.locationQuery).toBeNull();
  });
});

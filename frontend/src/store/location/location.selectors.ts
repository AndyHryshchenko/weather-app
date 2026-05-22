import type { RootState } from '../index';

export const selectLocationQuery = (state: RootState) =>
  state.location.locationQuery;
export const selectDisplayName = (state: RootState) =>
  state.location.displayName;
export const selectLocationSource = (state: RootState) => state.location.source;

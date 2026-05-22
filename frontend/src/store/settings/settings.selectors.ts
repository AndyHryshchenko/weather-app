import type { RootState } from '../index';

export const selectUnits = (state: RootState) => state.settings.units;

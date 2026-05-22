import { describe, expect, it } from 'vitest';
import { weatherApi } from './weather/weather.api';
import { store } from './index';

describe('store', () => {
  it('has weather API, location, and settings reducers', () => {
    const state = store.getState();
    expect(state[weatherApi.reducerPath]).toBeDefined();
    expect(state.location).toBeDefined();
    expect(state.settings).toBeDefined();
  });
});

import { describe, expect, it } from 'vitest';
import { LocationSource } from '@weather-app/types';
import { createTestStore } from '@/test/test-utils';
import { setLocationFromSearch } from './location.slice';
import {
  selectDisplayName,
  selectLocationQuery,
  selectLocationSource,
} from './location.selectors';

describe('location selectors', () => {
  it('selects location fields', () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromSearch({
        query: { city: 'Charlotte', country: 'US' },
        displayName: 'Charlotte, US',
      }),
    );
    const state = store.getState();
    expect(selectLocationQuery(state)?.city).toBe('Charlotte');
    expect(selectDisplayName(state)).toBe('Charlotte, US');
    expect(selectLocationSource(state)).toBe(LocationSource.SEARCH);
  });
});

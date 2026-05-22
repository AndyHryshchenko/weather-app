import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectUnits } from './settings/settings.selectors';

describe('store hooks', () => {
  it('reads state via typed hooks', () => {
    const store = createTestStore();
    const { result } = renderHook(
      () => useAppSelector(selectUnits),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );
    expect(result.current).toBe('metric');
    const { result: dispatchResult } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      ),
    });
    expect(typeof dispatchResult.current).toBe('function');
  });
});

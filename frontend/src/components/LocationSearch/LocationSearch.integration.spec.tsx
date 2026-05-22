import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as GooglePlacesServiceModule from '@/services/GooglePlacesService';
import { createTestStore } from '@/test/test-utils';
import { LocationSearch } from './LocationSearch';

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverAnchor: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

describe('LocationSearch integration', () => {
  beforeEach(() => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPredictions')
      .mockResolvedValue([
        { placeId: 'abc', description: 'Charlotte, NC, USA' },
      ]);
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPlaceLocation')
      .mockResolvedValue({
        query: { city: 'Charlotte', state: 'NC', country: 'US' },
        displayName: 'Charlotte, NC, US',
      });
  });

  it('loads predictions and handles selection', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.change(input, { target: { value: 'Char' } });
    fireEvent.focus(input);
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByText('Charlotte, NC, USA'));
    fireEvent.click(screen.getByText('Charlotte, NC, USA'));
    await waitFor(() => {
      expect(store.getState().location.locationQuery?.city).toBe('Charlotte');
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
    expect(GooglePlacesServiceModule.GooglePlacesService.getPlaceLocation).toHaveBeenCalledOnce();
  });
});

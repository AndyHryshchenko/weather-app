import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as GooglePlacesServiceModule from '@/services/GooglePlacesService';
import { createTestStore } from '@/test/test-utils';
import { setLocationFromGps } from '@/store/location/location.slice';
import { attachPopoverWidthObserver } from '@/utils/location-search.utils';
import { LocationSearch } from './LocationSearch';

vi.mock('@/components/ui/popover', () => ({
  Popover: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-open={open}>
      {children}
      <button type="button" aria-label="Open suggestions" onClick={() => onOpenChange(true)}>
        Open
      </button>
      <button type="button" aria-label="Close suggestions" onClick={() => onOpenChange(false)}>
        Close
      </button>
    </div>
  ),
  PopoverAnchor: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverContent: ({
    children,
    onOpenAutoFocus,
    style,
  }: {
    children: React.ReactNode;
    onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
    style?: React.CSSProperties;
  }) => {
    onOpenAutoFocus?.({ preventDefault: vi.fn() });
    return (
      <div data-testid="popover-content" style={style}>
        {children}
      </div>
    );
  },
}));

const selectSuggestion = (description: string) => {
  const option = screen.getByText(description);
  fireEvent.mouseDown(option);
  fireEvent.click(option);
};

describe('LocationSearch', () => {
  beforeEach(() => {
    vi.useRealTimers();
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

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders search label and placeholder', () => {
    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    expect(screen.getByText('Search for a location')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Charlotte, NC or 10001'),
    ).toBeInTheDocument();
  });

  it('pre-populates from Redux displayName', async () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
        displayName: 'Charlotte, NC, US',
      }),
    );
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
  });

  it('allows editing the field while focused', async () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
        displayName: 'Charlotte, NC, US',
      }),
    );
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByDisplayValue('Charlotte, NC, US');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByDisplayValue('Char')).toBeInTheDocument();
    });
  });

  it('shows autocomplete error when predictions reject a non-Error', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPredictions')
      .mockRejectedValue('autocomplete failed');

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Could not load place suggestions. Check your connection and try again.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('opens suggestions when the popover requests an open state', async () => {
    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open suggestions' }));

    expect(screen.getByRole('button', { name: 'Close suggestions' })).toBeInTheDocument();
  });

  it('shows autocomplete error when predictions fail', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPredictions')
      .mockRejectedValue(new Error('autocomplete failed'));

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Could not load place suggestions. Check your connection and try again.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('does not log selected place details outside development', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('DEV', '');

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
    expect(logSpy).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it('logs selected place details in development', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalled();
    });
  });

  it('shows an error when place resolution fails', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPlaceLocation')
      .mockRejectedValue(new Error('Failed to resolve place details'));

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');
    await waitFor(() => {
      expect(
        screen.getByText('Could not resolve the selected place. Try another result or search again.'),
      ).toBeInTheDocument();
    });
  });

  it('commits a selected suggestion', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');
    await waitFor(() => {
      expect(store.getState().location.displayName).toBe('Charlotte, NC, US');
    });
  });

  it('keeps committed location when blur follows a selection', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
  });

  it('reverts draft text when the popover closes without a selection', async () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
        displayName: 'Charlotte, NC, US',
      }),
    );
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByDisplayValue('Charlotte, NC, US');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Denver' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close suggestions' }));
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
  });

  it('returns undefined when popover width observer has no anchor field', () => {
    expect(attachPopoverWidthObserver(null, vi.fn())).toBeUndefined();
  });

  it('observes anchor width changes for the popover', () => {
    const resizeCallbacks: ResizeObserverCallback[] = [];
    class ResizeObserverStub {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback);
      }

      observe(): void {
        resizeCallbacks.at(-1)?.([], this as unknown as ResizeObserver);
      }

      disconnect(): void {}
      unobserve(): void {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);

    const field = document.createElement('div');
    Object.defineProperty(field, 'offsetWidth', { value: 240, configurable: true });
    const setWidth = vi.fn();
    const disconnect = attachPopoverWidthObserver(field, setWidth);

    expect(setWidth).toHaveBeenCalledWith(240);
    expect(disconnect).toBeTypeOf('function');
    disconnect?.();
  });

  it('clears draft input when blurring without a committed location', async () => {
    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Denver' } });
    await act(async () => {
      fireEvent.blur(input);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
  });

  it('omits popover width style when measured width is zero', async () => {
    const offsetSpy = vi
      .spyOn(HTMLDivElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(0);
    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
    expect(screen.getByTestId('popover-content')).not.toHaveAttribute('style');
    offsetSpy.mockRestore();
  });

  it('applies popover width when suggestions are visible', async () => {
    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByTestId('popover-content')).toHaveStyle({ width: '320px' });
    });
  });

  it('shows empty-state copy when autocomplete returns no matches', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPredictions')
      .mockResolvedValue([]);

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Nowhere' } });

    await waitFor(() => {
      expect(
        screen.getByText('No matching places. Try a city or ZIP code.'),
      ).toBeInTheDocument();
    });
  });

  it('does not request predictions for whitespace-only input', async () => {
    const predictionsSpy = vi.spyOn(
      GooglePlacesServiceModule.GooglePlacesService,
      'getPredictions',
    );

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '   ' } });

    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    expect(predictionsSpy).not.toHaveBeenCalled();
  });

  it('keeps the draft while refocusing during an edit', async () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
        displayName: 'Charlotte, NC, US',
      }),
    );
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByDisplayValue('Charlotte, NC, US');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    fireEvent.focus(input);

    expect(screen.getByDisplayValue('Char')).toBeInTheDocument();
  });

  it('shows fallback selection error when place resolution rejects a non-Error', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPlaceLocation')
      .mockRejectedValue('lookup failed');

    render(
      <Provider store={createTestStore()}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByPlaceholderText('e.g. Charlotte, NC or 10001');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Char' } });
    await waitFor(() => {
      expect(screen.getByText('Charlotte, NC, USA')).toBeInTheDocument();
    });
    selectSuggestion('Charlotte, NC, USA');

    await waitFor(() => {
      expect(
        screen.getByText('Could not resolve the selected place. Try another result or search again.'),
      ).toBeInTheDocument();
    });
  });

  it('reverts text on blur without a selection', async () => {
    const store = createTestStore();
    store.dispatch(
      setLocationFromGps({
        city: 'Charlotte',
        state: 'NC',
        country: 'US',
        displayName: 'Charlotte, NC, US',
      }),
    );
    render(
      <Provider store={store}>
        <LocationSearch />
      </Provider>,
    );
    const input = screen.getByDisplayValue('Charlotte, NC, US');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Denver' } });
    await act(async () => {
      fireEvent.blur(input);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('Charlotte, NC, US')).toBeInTheDocument();
    });
    expect(store.getState().location.displayName).toBe('Charlotte, NC, US');
  });
});

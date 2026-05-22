import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { TooltipProvider } from '@/components/ui/tooltip';
import { setupStore, type RootState } from '@/store';

export const createTestStore = setupStore;

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { preloadedState?: Partial<RootState> },
) => {
  const store = createTestStore(options?.preloadedState);
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <TooltipProvider>{children}</TooltipProvider>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
};

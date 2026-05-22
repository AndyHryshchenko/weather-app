import { Provider } from 'react-redux';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WeatherPage } from '@/pages/WeatherPage/WeatherPage';
import { store } from '@/store';

export function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <TooltipProvider delayDuration={300}>
          <WeatherPage />
        </TooltipProvider>
      </ErrorBoundary>
    </Provider>
  );
}

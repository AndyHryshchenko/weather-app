import type { CurrentWeatherData, ForecastDay, HourlyForecast } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getHourlyDayRange,
  getStartOfDay,
  isDayWithinHourlyRange,
} from '@/utils/date.utils';
import { WeatherTabDayPanel } from './WeatherTabDayPanel';
import { getWeatherPropsForTab } from './weather-tab-day-panel.utils';

export interface WeatherTabsProps {
  current: CurrentWeatherData | null;
  hourly: HourlyForecast[] | null;
  forecast: ForecastDay[] | null;
  units: TemperatureUnit;
  currentStatus: AsyncStatus;
  hourlyStatus: AsyncStatus;
  forecastStatus: AsyncStatus;
  currentError?: string | null;
  hourlyError?: string | null;
  forecastError?: string | null;
  defaultTab?: string;
}

export function WeatherTabs({
  current,
  hourly,
  forecast,
  units,
  currentStatus,
  hourlyStatus,
  forecastStatus,
  currentError = null,
  hourlyError = null,
  forecastError = null,
  defaultTab = '0',
}: WeatherTabsProps) {
  const { t } = useTranslation();

  const hourlyDayRange = getHourlyDayRange(hourly);

  // One tab per daily forecast from the API; show Today alone while forecast is loading.
  const tabCount = Math.max(1, forecast?.length ?? 0);
  const tabIndexes = Array.from({ length: tabCount }, (_, index) => index);

  const dayStartForTab = (index: number) =>
    getStartOfDay(forecast?.[index]?.dt ?? current?.sunrise ?? 0);

  const shouldShowHourlyForTab = (index: number, dayStart: number) =>
    index === 0 || isDayWithinHourlyRange(dayStart, hourlyDayRange);

  const labelForTab = (index: number, dayStart: number) => {
    if (index === 0) {
      return t('tabs.today');
    }
    if (index === 1) {
      return t('tabs.tomorrow');
    }
    return new Date(dayStart * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Tabs defaultValue={defaultTab} className="min-w-0">
      <TabsList>
        {tabIndexes.map((index) => (
          <TabsTrigger key={index} value={String(index)}>
            {labelForTab(index, dayStartForTab(index))}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabIndexes.map((index) => {
        const dayStart = dayStartForTab(index);
        const forecastDay = forecast?.[index];
        const showHourly = shouldShowHourlyForTab(index, dayStart);
        const showDayPanel = index === 0 || forecastDay != null;
        const weatherProps = getWeatherPropsForTab(index, current, forecastDay);

        return (
          <TabsContent key={index} value={String(index)}>
            {showDayPanel ? (
              <WeatherTabDayPanel
                {...weatherProps}
                units={units}
                status={index === 0 ? currentStatus : forecastStatus}
                errorMessage={index === 0 ? currentError : forecastError}
                {...(showHourly
                  ? {
                      dayStart,
                      hourly,
                      hourlyStatus,
                      hourlyError,
                    }
                  : {})}
              />
            ) : null}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

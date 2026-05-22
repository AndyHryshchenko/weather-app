import type { CurrentWeatherData, ForecastDay, HourlyForecast } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { DayWeatherSummary } from '@/components/DayWeatherSummary/DayWeatherSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getHourlyDayRange,
  getStartOfDay,
  isDayWithinHourlyRange,
} from '@/utils/date.utils';
import { WeatherTabForecastSection } from './WeatherTabForecastSection';
import { WeatherTabHourlySection } from './WeatherTabHourlySection';
import { WeatherTabTodayPanel } from './WeatherTabTodayPanel';

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

        return (
          <TabsContent key={index} value={String(index)}>
            {index === 0 ? (
              <WeatherTabTodayPanel
                current={current}
                hourly={hourly}
                units={units}
                dayStart={dayStart}
                currentStatus={currentStatus}
                hourlyStatus={hourlyStatus}
                currentError={currentError}
                hourlyError={hourlyError}
              />
            ) : null}

            {index >= 1 && forecast?.[index] ? (
              <div className="space-y-4">
                <DayWeatherSummary day={forecast[index]} units={units} />
                {shouldShowHourlyForTab(index, dayStart) ? (
                  <WeatherTabHourlySection
                    dayStart={dayStart}
                    hourly={hourly}
                    units={units}
                    status={hourlyStatus}
                    errorMessage={hourlyError}
                  />
                ) : (
                  <WeatherTabForecastSection
                    day={forecast[index]}
                    units={units}
                    status={forecastStatus}
                    errorMessage={forecastError}
                  />
                )}
              </div>
            ) : null}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

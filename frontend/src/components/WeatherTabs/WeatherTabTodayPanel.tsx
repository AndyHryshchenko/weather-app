import type { CurrentWeatherData, HourlyForecast, TemperatureUnit } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { WeatherDisplay } from '@/components/WeatherDisplay/WeatherDisplay';
import { WeatherStats } from '@/components/WeatherStats/WeatherStats';
import { WeatherTabHourlySection } from './WeatherTabHourlySection';
import { WeatherTabSkeleton } from './WeatherTabSkeleton';

interface WeatherTabTodayPanelProps {
  current: CurrentWeatherData | null;
  hourly: HourlyForecast[] | null;
  units: TemperatureUnit;
  dayStart: number;
  currentStatus: AsyncStatus;
  hourlyStatus: AsyncStatus;
  currentError: string | null;
  hourlyError: string | null;
}

export function WeatherTabTodayPanel({
  current,
  hourly,
  units,
  dayStart,
  currentStatus,
  hourlyStatus,
  currentError,
  hourlyError,
}: WeatherTabTodayPanelProps) {
  const { t } = useTranslation();

  if (currentStatus === AsyncStatus.FAILED) {
    return (
      <RequestErrorAlert message={currentError ?? t('error.sectionFallback')} />
    );
  }

  if (currentStatus === AsyncStatus.LOADING || !current) {
    return <WeatherTabSkeleton />;
  }

  return (
    <div className="space-y-6">
      <WeatherDisplay current={current} units={units} />
      <WeatherStats current={current} />
      <WeatherTabHourlySection
        dayStart={dayStart}
        hourly={hourly}
        units={units}
        status={hourlyStatus}
        errorMessage={hourlyError}
      />
    </div>
  );
}

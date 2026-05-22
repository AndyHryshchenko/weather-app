import type { HourlyForecast, TemperatureUnit } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { HourlyStrip } from '@/components/HourlyStrip/HourlyStrip';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';
import { filterHourlyByDay } from '@/utils/date.utils';

interface WeatherTabHourlySectionProps {
  dayStart: number;
  hourly: HourlyForecast[] | null;
  units: TemperatureUnit;
  status: AsyncStatus;
  errorMessage: string | null;
}

export function WeatherTabHourlySection({
  dayStart,
  hourly,
  units,
  status,
  errorMessage,
}: WeatherTabHourlySectionProps) {
  const { t } = useTranslation();

  if (status === AsyncStatus.FAILED) {
    return (
      <RequestErrorAlert message={errorMessage ?? t('error.sectionFallback')} />
    );
  }

  if (status === AsyncStatus.LOADING) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <HourlyStrip hours={filterHourlyByDay(hourly ?? [], dayStart)} units={units} />
  );
}

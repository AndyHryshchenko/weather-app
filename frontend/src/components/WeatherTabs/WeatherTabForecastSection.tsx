import type { ForecastDay, TemperatureUnit } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';
import { TemperaturePhaseStrip } from '@/components/TemperaturePhaseStrip/TemperaturePhaseStrip';

interface WeatherTabForecastSectionProps {
  day: ForecastDay;
  units: TemperatureUnit;
  status: AsyncStatus;
  errorMessage: string | null;
}

export function WeatherTabForecastSection({
  day,
  units,
  status,
  errorMessage,
}: WeatherTabForecastSectionProps) {
  const { t } = useTranslation();

  if (status === AsyncStatus.FAILED) {
    return (
      <RequestErrorAlert message={errorMessage ?? t('error.sectionFallback')} />
    );
  }

  if (status === AsyncStatus.LOADING) {
    return <Skeleton className="h-24 w-full" />;
  }

  return <TemperaturePhaseStrip day={day} units={units} />;
}

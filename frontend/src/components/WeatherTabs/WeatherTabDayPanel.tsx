import type { HourlyForecast, TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { AsyncStatus } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { TemperaturePhaseStrip } from '@/components/TemperaturePhaseStrip/TemperaturePhaseStrip';
import { RequestErrorAlert } from '@/components/RequestError/RequestErrorAlert';
import { WeatherDisplay } from '@/components/WeatherDisplay/WeatherDisplay';
import { WeatherStats } from '@/components/WeatherStats/WeatherStats';
import { WeatherTabHourlySection } from './WeatherTabHourlySection';
import { WeatherTabSkeleton } from './WeatherTabSkeleton';

export interface WeatherTabDayPanelProps {
  units: TemperatureUnit;
  status: AsyncStatus;
  errorMessage?: string | null;
  conditionIcon?: WeatherIconCode;
  conditionDescription?: string;
  temp?: number;
  tempMin?: number;
  tempMax?: number;
  tempMorn?: number;
  tempDay?: number;
  tempEve?: number;
  tempNight?: number;
  feelsLike?: number;
  summary?: string;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  uvi?: number;
  visibility?: number;
  cloudiness?: number;
  dewPoint?: number;
  dayStart?: number;
  hourly?: HourlyForecast[] | null;
  hourlyStatus?: AsyncStatus;
  hourlyError?: string | null;
}

function hasPhaseTemps(
  tempMorn?: number,
  tempDay?: number,
  tempEve?: number,
  tempNight?: number,
  tempMin?: number,
  tempMax?: number,
): boolean {
  return [tempMorn, tempDay, tempEve, tempNight, tempMin, tempMax].some(
    (value) => value != null,
  );
}

export function WeatherTabDayPanel({
  units,
  status,
  errorMessage = null,
  conditionIcon,
  conditionDescription,
  temp,
  tempMin,
  tempMax,
  tempMorn,
  tempDay,
  tempEve,
  tempNight,
  feelsLike,
  summary,
  humidity,
  windSpeed,
  pressure,
  uvi,
  visibility,
  cloudiness,
  dewPoint,
  dayStart,
  hourly,
  hourlyStatus,
  hourlyError = null,
}: WeatherTabDayPanelProps) {
  const { t } = useTranslation();

  if (status === AsyncStatus.FAILED) {
    return (
      <RequestErrorAlert message={errorMessage ?? t('error.sectionFallback')} />
    );
  }

  const hasDisplay =
    conditionIcon != null &&
    conditionDescription != null &&
    (temp != null || (tempMin != null && tempMax != null));

  if (status === AsyncStatus.LOADING || !hasDisplay) {
    return <WeatherTabSkeleton />;
  }

  const showHourly = dayStart != null && hourlyStatus != null;
  const showPhaseStrip =
    !showHourly &&
    hasPhaseTemps(tempMorn, tempDay, tempEve, tempNight, tempMin, tempMax);

  return (
    <div className="space-y-6">
      <WeatherDisplay
        conditionIcon={conditionIcon}
        conditionDescription={conditionDescription}
        units={units}
        temp={temp}
        tempMin={tempMin}
        tempMax={tempMax}
        feelsLike={feelsLike}
        summary={summary}
      />
      <WeatherStats
        humidity={humidity}
        windSpeed={windSpeed}
        pressure={pressure}
        uvi={uvi}
        visibility={visibility}
        cloudiness={cloudiness}
        dewPoint={dewPoint}
      />
      {showHourly ? (
        <WeatherTabHourlySection
          dayStart={dayStart}
          hourly={hourly ?? null}
          units={units}
          status={hourlyStatus}
          errorMessage={hourlyError}
        />
      ) : null}
      {showPhaseStrip ? (
        <TemperaturePhaseStrip
          units={units}
          tempMorn={tempMorn}
          tempDay={tempDay}
          tempEve={tempEve}
          tempNight={tempNight}
          tempMin={tempMin}
          tempMax={tempMax}
        />
      ) : null}
    </div>
  );
}

import type { TemperatureUnit, WeatherIconCode } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { WeatherIcon } from '@/components/WeatherIcon/WeatherIcon';
import { formatTemperature } from '@/utils/temperature.utils';

export interface WeatherDisplayProps {
  conditionIcon: WeatherIconCode;
  conditionDescription: string;
  units: TemperatureUnit;
  temp?: number;
  tempMin?: number;
  tempMax?: number;
  feelsLike?: number;
  summary?: string;
}

export function WeatherDisplay({
  conditionIcon,
  conditionDescription,
  units,
  temp,
  tempMin,
  tempMax,
  feelsLike,
  summary,
}: WeatherDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <WeatherIcon
        code={conditionIcon}
        className="h-14 w-14 shrink-0 text-primary sm:h-16 sm:w-16"
      />
      <div className="min-w-0">
        {temp != null ? (
          <p className="text-4xl font-bold sm:text-5xl">
            {formatTemperature(temp, units)}
          </p>
        ) : null}
        {temp == null && tempMin != null && tempMax != null ? (
          <p className="text-lg font-semibold text-foreground/70">
            {t('weather.highLow', {
              high: formatTemperature(tempMax, units),
              low: formatTemperature(tempMin, units),
            })}
          </p>
        ) : null}
        <p className="capitalize text-foreground/70">{conditionDescription}</p>
        {feelsLike != null ? (
          <p className="text-sm text-foreground/60">
            {t('weather.feelsLike', {
              value: formatTemperature(feelsLike, units),
            })}
          </p>
        ) : null}
        {summary ? (
          <p className="text-sm text-foreground/60">{summary}</p>
        ) : null}
      </div>
    </div>
  );
}

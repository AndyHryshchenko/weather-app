import type { CurrentWeatherData } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { WeatherIcon } from '@/components/WeatherIcon/WeatherIcon';
import { formatTemperature } from '@/utils/temperature.utils';

export interface WeatherDisplayProps {
  current: CurrentWeatherData;
  units: TemperatureUnit;
}

export function WeatherDisplay({ current, units }: WeatherDisplayProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <WeatherIcon
        code={current.condition.icon}
        className="h-14 w-14 shrink-0 text-primary sm:h-16 sm:w-16"
      />
      <div className="min-w-0">
        <p className="text-4xl font-bold sm:text-5xl">
          {formatTemperature(current.temp, units)}
        </p>
        <p className="capitalize text-foreground/70">
          {current.condition.description}
        </p>
        <p className="text-sm text-foreground/60">
          {t('weather.feelsLike', {
            value: formatTemperature(current.feelsLike, units),
          })}
        </p>
      </div>
    </div>
  );
}

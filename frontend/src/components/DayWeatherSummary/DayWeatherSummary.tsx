import type { ForecastDay } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { WeatherIcon } from '@/components/WeatherIcon/WeatherIcon';
import { formatTemperature } from '@/utils/temperature.utils';

export interface DayWeatherSummaryProps {
  day: ForecastDay;
  units: TemperatureUnit;
}

export function DayWeatherSummary({ day, units }: DayWeatherSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <WeatherIcon code={day.condition.icon} className="h-12 w-12 text-primary" />
      <div>
        <p className="text-lg font-semibold capitalize">
          {day.condition.description}
        </p>
        <p className="text-foreground/70">
          {t('weather.highLow', {
            high: formatTemperature(day.temp.max, units),
            low: formatTemperature(day.temp.min, units),
          })}
        </p>
        {day.summary ? (
          <p className="text-sm text-foreground/60">{day.summary}</p>
        ) : null}
      </div>
    </div>
  );
}

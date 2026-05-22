import type { CurrentWeatherData } from '@weather-app/types';
import { useTranslation } from 'react-i18next';

export interface WeatherStatsProps {
  current: CurrentWeatherData;
}

export function WeatherStats({ current }: WeatherStatsProps) {
  const { t } = useTranslation();
  const stats = [
    { label: t('weather.humidity'), value: `${current.humidity}%` },
    { label: t('weather.wind'), value: `${current.windSpeed} m/s` },
    { label: t('weather.pressure'), value: `${current.pressure} hPa` },
    { label: t('weather.uvIndex'), value: String(current.uvi) },
    { label: t('weather.visibility'), value: `${current.visibility / 1000} km` },
    { label: t('weather.cloudiness'), value: `${current.cloudiness}%` },
    { label: t('weather.dewPoint'), value: `${current.dewPoint}°` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-muted p-3"
        >
          <p className="text-xs text-foreground/60">{stat.label}</p>
          <p className="text-lg font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

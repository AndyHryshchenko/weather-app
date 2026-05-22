import { useTranslation } from 'react-i18next';

export interface WeatherStatsProps {
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  uvi?: number;
  visibility?: number;
  cloudiness?: number;
  dewPoint?: number;
}

export function WeatherStats({
  humidity,
  windSpeed,
  pressure,
  uvi,
  visibility,
  cloudiness,
  dewPoint,
}: WeatherStatsProps) {
  const { t } = useTranslation();
  const stats = [
    humidity != null
      ? { label: t('weather.humidity'), value: `${humidity}%` }
      : null,
    windSpeed != null
      ? { label: t('weather.wind'), value: `${windSpeed} m/s` }
      : null,
    pressure != null
      ? { label: t('weather.pressure'), value: `${pressure} hPa` }
      : null,
    uvi != null ? { label: t('weather.uvIndex'), value: String(uvi) } : null,
    visibility != null
      ? {
          label: t('weather.visibility'),
          value: `${visibility / 1000} km`,
        }
      : null,
    cloudiness != null
      ? { label: t('weather.cloudiness'), value: `${cloudiness}%` }
      : null,
    dewPoint != null
      ? { label: t('weather.dewPoint'), value: `${dewPoint}°` }
      : null,
  ].filter((stat): stat is { label: string; value: string } => stat != null);

  if (stats.length === 0) {
    return null;
  }

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

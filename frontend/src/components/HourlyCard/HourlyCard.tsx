import type { HourlyForecast } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TruncatedText } from '@/components/ui/truncated-text';
import { WeatherIcon } from '@/components/WeatherIcon/WeatherIcon';
import { cn } from '@/lib/utils';
import { formatHour } from '@/utils/date.utils';
import { formatTemperature } from '@/utils/temperature.utils';

export interface HourlyCardProps {
  hour: HourlyForecast;
  units: TemperatureUnit;
}

interface HourlyCardFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const HourlyCardField = ({ label, children, className }: HourlyCardFieldProps) => (
  <div className={cn('flex min-w-0 flex-col gap-1', className)}>
    <span className="text-xs font-medium text-foreground/60">{label}</span>
    <div className="min-w-0 text-sm font-semibold text-foreground">{children}</div>
  </div>
);

export function HourlyCard({ hour, units }: HourlyCardProps) {
  const { t } = useTranslation();
  const rainChancePercent = Math.round(hour.pop * 100);
  const conditionDescription = hour.condition.description;

  return (
    <article className="grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-4 rounded-lg border border-border bg-background p-4">
      <HourlyCardField label={t('hourly.time')}>{formatHour(hour.dt)}</HourlyCardField>
      <HourlyCardField label={t('hourly.temperature')}>
        {formatTemperature(hour.temp, units)}
      </HourlyCardField>
      <HourlyCardField label={t('hourly.conditions')}>
        <div className="flex min-w-0 items-center gap-2 font-normal">
          <WeatherIcon code={hour.condition.icon} className="h-6 w-6 shrink-0 text-primary" />
          <TruncatedText
            text={conditionDescription}
            className="capitalize text-foreground/80"
          />
        </div>
      </HourlyCardField>
      <HourlyCardField label={t('hourly.rainChance')}>
        {t('hourly.rainChanceValue', { value: rainChancePercent })}
      </HourlyCardField>
    </article>
  );
}

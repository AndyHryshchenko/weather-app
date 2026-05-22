import type { ForecastDay } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { formatTemperature } from '@/utils/temperature.utils';

export interface TemperaturePhaseStripProps {
  day: ForecastDay;
  units: TemperatureUnit;
}

interface PhaseWithValue {
  label: string;
  value: number;
}

export function TemperaturePhaseStrip({ day, units }: TemperaturePhaseStripProps) {
  const { t } = useTranslation();
  const phases: PhaseWithValue[] = [
    { label: t('phases.morning'), value: day.temp.morn },
    { label: t('phases.afternoon'), value: day.temp.day },
    { label: t('phases.evening'), value: day.temp.eve },
    { label: t('phases.night'), value: day.temp.night },
    { label: t('phases.min'), value: day.temp.min },
    { label: t('phases.max'), value: day.temp.max },
  ].filter((phase): phase is PhaseWithValue => phase.value !== undefined);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {phases.map((phase) => (
        <div
          key={phase.label}
          className="flex min-w-[88px] flex-col items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3"
        >
          <span className="text-xs font-medium text-primary">{phase.label}</span>
          <span className="text-sm font-semibold">
            {formatTemperature(phase.value, units)}
          </span>
        </div>
      ))}
    </div>
  );
}

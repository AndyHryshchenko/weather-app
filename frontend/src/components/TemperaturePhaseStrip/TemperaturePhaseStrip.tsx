import type { TemperatureUnit } from '@weather-app/types';
import { useTranslation } from 'react-i18next';
import { formatTemperature } from '@/utils/temperature.utils';

export interface TemperaturePhaseStripProps {
  units: TemperatureUnit;
  tempMorn?: number;
  tempDay?: number;
  tempEve?: number;
  tempNight?: number;
  tempMin?: number;
  tempMax?: number;
}

interface PhaseWithValue {
  label: string;
  value: number;
}

export function TemperaturePhaseStrip({
  units,
  tempMorn,
  tempDay,
  tempEve,
  tempNight,
  tempMin,
  tempMax,
}: TemperaturePhaseStripProps) {
  const { t } = useTranslation();
  const phases: PhaseWithValue[] = [
    { label: t('phases.morning'), value: tempMorn },
    { label: t('phases.afternoon'), value: tempDay },
    { label: t('phases.evening'), value: tempEve },
    { label: t('phases.night'), value: tempNight },
    { label: t('phases.min'), value: tempMin },
    { label: t('phases.max'), value: tempMax },
  ].filter((phase): phase is PhaseWithValue => phase.value != null);

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

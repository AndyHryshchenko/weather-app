import type { HourlyForecast } from '@weather-app/types';
import type { TemperatureUnit } from '@weather-app/types';
import { HourlyCard } from '@/components/HourlyCard/HourlyCard';

export interface HourlyStripProps {
  hours: HourlyForecast[];
  units: TemperatureUnit;
}

export function HourlyStrip({ hours, units }: HourlyStripProps) {
  if (!hours.length) {
    return null;
  }
  return (
    <div className="grid w-full max-w-full grid-cols-1 gap-3 md:grid-cols-2">
      {hours.map((hour) => (
        <HourlyCard key={hour.dt} hour={hour} units={units} />
      ))}
    </div>
  );
}

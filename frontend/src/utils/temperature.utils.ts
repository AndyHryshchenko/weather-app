import { TemperatureUnit } from '@weather-app/types';

export const formatTemperature = (
  value: number,
  units: TemperatureUnit,
): string => {
  const rounded = Math.round(value);
  const suffix = units === TemperatureUnit.IMPERIAL ? '°F' : '°C';
  return `${rounded}${suffix}`;
};

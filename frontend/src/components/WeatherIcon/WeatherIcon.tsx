import { WeatherIconCode } from '@weather-app/types';
import {
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<WeatherIconCode, LucideIcon> = {
  [WeatherIconCode.CLEAR_DAY]: Sun,
  [WeatherIconCode.CLEAR_NIGHT]: Moon,
  [WeatherIconCode.PARTLY_CLOUDY_DAY]: CloudSun,
  [WeatherIconCode.PARTLY_CLOUDY_NIGHT]: Cloud,
  [WeatherIconCode.CLOUDY]: Cloud,
  [WeatherIconCode.OVERCAST]: Cloud,
  [WeatherIconCode.FOG]: CloudFog,
  [WeatherIconCode.DRIZZLE]: CloudRain,
  [WeatherIconCode.RAIN]: CloudRain,
  [WeatherIconCode.HEAVY_RAIN]: CloudRain,
  [WeatherIconCode.THUNDERSTORM]: Zap,
  [WeatherIconCode.SNOW]: CloudSnow,
  [WeatherIconCode.SLEET]: CloudSnow,
  [WeatherIconCode.BLIZZARD]: CloudSnow,
  [WeatherIconCode.WIND]: Wind,
  [WeatherIconCode.HAIL]: CloudRain,
  [WeatherIconCode.UNKNOWN]: Cloud,
};

export interface WeatherIconProps {
  code: WeatherIconCode;
  className?: string;
}

export function WeatherIcon({ code, className = 'h-8 w-8 text-primary' }: WeatherIconProps) {
  const Icon = ICON_MAP[code] ?? ICON_MAP[WeatherIconCode.UNKNOWN];
  return <Icon className={className} aria-hidden />;
}

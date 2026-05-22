import { WeatherIconCode } from '@weather-app/types';

const ICON_MAP: Record<string, WeatherIconCode> = {
  '01d': WeatherIconCode.CLEAR_DAY,
  '01n': WeatherIconCode.CLEAR_NIGHT,
  '02d': WeatherIconCode.PARTLY_CLOUDY_DAY,
  '02n': WeatherIconCode.PARTLY_CLOUDY_NIGHT,
  '03d': WeatherIconCode.CLOUDY,
  '03n': WeatherIconCode.CLOUDY,
  '04d': WeatherIconCode.OVERCAST,
  '04n': WeatherIconCode.OVERCAST,
  '09d': WeatherIconCode.DRIZZLE,
  '09n': WeatherIconCode.DRIZZLE,
  '10d': WeatherIconCode.RAIN,
  '10n': WeatherIconCode.RAIN,
  '11d': WeatherIconCode.THUNDERSTORM,
  '11n': WeatherIconCode.THUNDERSTORM,
  '13d': WeatherIconCode.SNOW,
  '13n': WeatherIconCode.SNOW,
  '50d': WeatherIconCode.FOG,
  '50n': WeatherIconCode.FOG,
};

export const mapOpenWeatherIcon = (icon: string): WeatherIconCode =>
  ICON_MAP[icon] ?? WeatherIconCode.UNKNOWN;

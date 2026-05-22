import type { CurrentWeatherData, ForecastDay } from '@weather-app/types';
import type { WeatherTabDayPanelProps } from './WeatherTabDayPanel';

export type DayPanelWeatherProps = Pick<
  WeatherTabDayPanelProps,
  | 'conditionIcon'
  | 'conditionDescription'
  | 'temp'
  | 'tempMin'
  | 'tempMax'
  | 'tempMorn'
  | 'tempDay'
  | 'tempEve'
  | 'tempNight'
  | 'feelsLike'
  | 'summary'
  | 'humidity'
  | 'windSpeed'
  | 'pressure'
  | 'uvi'
  | 'visibility'
  | 'cloudiness'
  | 'dewPoint'
>;

export function mapCurrentWeatherToDayPanelProps(
  current: CurrentWeatherData,
): DayPanelWeatherProps {
  return {
    conditionIcon: current.condition.icon,
    conditionDescription: current.condition.description,
    temp: current.temp,
    feelsLike: current.feelsLike,
    humidity: current.humidity,
    windSpeed: current.windSpeed,
    pressure: current.pressure,
    uvi: current.uvi,
    visibility: current.visibility,
    cloudiness: current.cloudiness,
    dewPoint: current.dewPoint,
  };
}

export function getWeatherPropsForTab(
  index: number,
  current: CurrentWeatherData | null,
  forecastDay: ForecastDay | undefined,
): Partial<DayPanelWeatherProps> {
  if (index === 0 && current) {
    return mapCurrentWeatherToDayPanelProps(current);
  }

  if (forecastDay) {
    return mapForecastDayToDayPanelProps(forecastDay);
  }

  return {};
}

export function mapForecastDayToDayPanelProps(
  day: ForecastDay,
): DayPanelWeatherProps {
  return {
    conditionIcon: day.condition.icon,
    conditionDescription: day.condition.description,
    tempMin: day.temp.min,
    tempMax: day.temp.max,
    tempMorn: day.temp.morn,
    tempDay: day.temp.day,
    tempEve: day.temp.eve,
    tempNight: day.temp.night,
    feelsLike: day.feelsLike.day,
    summary: day.summary,
    humidity: day.humidity,
    windSpeed: day.windSpeed,
    pressure: day.pressure,
    uvi: day.uvi,
    cloudiness: day.clouds,
    dewPoint: day.dewPoint,
  };
}

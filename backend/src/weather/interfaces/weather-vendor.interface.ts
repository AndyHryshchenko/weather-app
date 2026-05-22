import type {
  Coordinates,
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  TemperatureUnit,
} from '@weather-app/types';

export const WEATHER_VENDOR = 'WEATHER_VENDOR';

export interface IWeatherVendor {
  getCurrentWeather(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<CurrentWeatherData>;
  getHourlyForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<HourlyForecast[]>;
  getForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<ForecastDay[]>;
}

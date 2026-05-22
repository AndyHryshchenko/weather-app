import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  LocationInfo,
  LocationQuery,
  TemperatureUnit,
  WeatherResponse,
} from '@weather-app/types';
import { APP_CONSTANTS } from '../constants/app.constants';
import { buildQueryString } from '../utils/query.utils';

export class ApiService {
  private static readonly BASE_URL = APP_CONSTANTS.API_BASE_URL;

  static async reverseGeocode(config: {
    lat: number;
    lng: number;
  }): Promise<LocationInfo> {
    const query = buildQueryString({
      lat: String(config.lat),
      lng: String(config.lng),
    });
    return ApiService.fetchData<LocationInfo>(
      `/api/v1/geocode/reverse${query}`,
    );
  }

  static async getCurrentWeather(config: {
    locationQuery: LocationQuery;
    units: TemperatureUnit;
  }): Promise<CurrentWeatherData> {
    const query = ApiService.buildLocationQuery(config.locationQuery, config.units);
    return ApiService.fetchData<CurrentWeatherData>(
      `/api/v1/weather/current${query}`,
    );
  }

  static async getHourlyForecast(config: {
    locationQuery: LocationQuery;
    units: TemperatureUnit;
  }): Promise<HourlyForecast[]> {
    const query = ApiService.buildLocationQuery(config.locationQuery, config.units);
    return ApiService.fetchData<HourlyForecast[]>(
      `/api/v1/weather/hourly${query}`,
    );
  }

  static async getForecast(config: {
    locationQuery: LocationQuery;
    units: TemperatureUnit;
  }): Promise<ForecastDay[]> {
    const query = ApiService.buildLocationQuery(config.locationQuery, config.units);
    return ApiService.fetchData<ForecastDay[]>(
      `/api/v1/weather/forecast${query}`,
    );
  }

  private static buildLocationQuery(
    locationQuery: LocationQuery,
    units: TemperatureUnit,
  ): string {
    return buildQueryString({
      city: locationQuery.city,
      state: locationQuery.state,
      country: locationQuery.country,
      zip: locationQuery.zip,
      units,
    });
  }

  private static async fetchData<T>(path: string): Promise<T> {
    const response = await fetch(`${ApiService.BASE_URL}${path}`);
    if (!response.ok) {
      const errorBody = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(errorBody.message ?? `Request failed: ${response.status}`);
    }
    const body = (await response.json()) as WeatherResponse<T>;
    return body.data;
  }
}

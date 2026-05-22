import { Injectable } from '@nestjs/common';
import type {
  Coordinates,
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  TemperatureUnit,
} from '@weather-app/types';
import { RequestDeduplicator } from '../../../common/deduplicator/request-deduplicator';
import { buildForecast25DedupeKey } from '../../../common/cache-keys';
import type { IWeatherVendor } from '../../interfaces/weather-vendor.interface';
import { OpenWeatherHttpService } from './openweather-http.service';
import {
  aggregateForecastListToDaily,
  normalizeCurrentWeather,
  normalizeForecastListHourly,
} from './openweather-standard-normalizer';
import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from './types/openweather-api.types';

@Injectable()
export class OpenWeatherWeatherVendor implements IWeatherVendor {
  private readonly forecastDeduplicator =
    new RequestDeduplicator<OpenWeatherForecastResponse>();

  constructor(private readonly openWeatherHttp: OpenWeatherHttpService) {}

  async getCurrentWeather(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<CurrentWeatherData> {
    const response = await this.requestCurrentWeather(coords, units);
    return normalizeCurrentWeather(response);
  }

  async getHourlyForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<HourlyForecast[]> {
    const response = await this.fetchForecast(coords, units);
    return normalizeForecastListHourly(response.list);
  }

  async getForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<ForecastDay[]> {
    const response = await this.fetchForecast(coords, units);
    return aggregateForecastListToDaily(response);
  }

  private fetchForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<OpenWeatherForecastResponse> {
    const key = buildForecast25DedupeKey(coords.lat, coords.lng, units);
    return this.forecastDeduplicator.dedupe(key, () =>
      this.requestForecast(coords, units),
    );
  }

  private async requestCurrentWeather(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<OpenWeatherCurrentWeatherResponse> {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', String(coords.lat));
    url.searchParams.set('lon', String(coords.lng));
    url.searchParams.set('units', units);

    return this.openWeatherHttp.get<OpenWeatherCurrentWeatherResponse>(
      url.toString(),
    );
  }

  private async requestForecast(
    coords: Coordinates,
    units: TemperatureUnit,
  ): Promise<OpenWeatherForecastResponse> {
    const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
    url.searchParams.set('lat', String(coords.lat));
    url.searchParams.set('lon', String(coords.lng));
    url.searchParams.set('units', units);

    return this.openWeatherHttp.get<OpenWeatherForecastResponse>(url.toString());
  }
}

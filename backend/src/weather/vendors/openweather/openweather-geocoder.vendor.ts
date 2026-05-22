import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  Coordinates,
  LocationInfo,
  LocationQuery,
} from '@weather-app/types';
import { normalizeCountryCode } from '../../../geocoder/country-code.util';
import type { IGeocoderVendor } from '../../../geocoder/interfaces/geocoder-vendor.interface';
import { OpenWeatherHttpService } from './openweather-http.service';
import type {
  OpenWeatherGeocodeResult,
  OpenWeatherZipGeocodeResult,
} from './types/openweather-api.types';

@Injectable()
export class OpenWeatherGeocoderVendor implements IGeocoderVendor {
  constructor(private readonly openWeatherHttp: OpenWeatherHttpService) {}

  async geocodeByText(query: LocationQuery): Promise<Coordinates> {
    if (query.city) {
      return this.geocodeByCity(query);
    }
    if (query.zip) {
      return this.geocodeByZip(query.zip, normalizeCountryCode(query.country));
    }
    return this.geocodeByCity(query);
  }

  async reverseGeocode(coords: Coordinates): Promise<LocationInfo> {
    const url = new URL('https://api.openweathermap.org/geo/1.0/reverse');
    url.searchParams.set('lat', String(coords.lat));
    url.searchParams.set('lon', String(coords.lng));
    url.searchParams.set('limit', '1');

    const results = await this.fetchJson<OpenWeatherGeocodeResult[]>(url);
    if (!results.length) {
      throw new NotFoundException('No location found for coordinates');
    }
    return this.toLocationInfo(results[0]);
  }

  private async geocodeByZip(
    zip: string,
    country?: string,
  ): Promise<Coordinates> {
    const url = new URL('https://api.openweathermap.org/geo/1.0/zip');
    const zipParam = country ? `${zip},${country}` : zip;
    url.searchParams.set('zip', zipParam);

    const result = await this.fetchJson<OpenWeatherZipGeocodeResult>(url);
    return { lat: result.lat, lng: result.lon };
  }

  private async geocodeByCity(query: LocationQuery): Promise<Coordinates> {
    const url = new URL('https://api.openweathermap.org/geo/1.0/direct');
    const queryString = this.buildCityQuery(query);
    if (!queryString) {
      throw new BadRequestException(
        'Location query must include city, zip, or both state and country',
      );
    }
    url.searchParams.set('q', queryString);
    url.searchParams.set('limit', '1');

    const results = await this.fetchJson<OpenWeatherGeocodeResult[]>(url);
    if (!results.length) {
      throw new NotFoundException('No location found for query');
    }
    return { lat: results[0].lat, lng: results[0].lon };
  }

  private buildCityQuery(query: LocationQuery): string {
    const parts = [query.city, query.state, query.country]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part));
    return parts.join(',');
  }

  private toLocationInfo(result: OpenWeatherGeocodeResult): LocationInfo {
    const state = result.state;
    const displayParts = [result.name, state, result.country].filter(Boolean);
    return {
      city: result.name,
      state,
      country: result.country,
      displayName: displayParts.join(', '),
    };
  }

  private fetchJson<T>(url: URL): Promise<T> {
    return this.openWeatherHttp.get<T>(url.toString());
  }
}

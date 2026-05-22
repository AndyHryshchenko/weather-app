import { Loader } from '@googlemaps/js-api-loader';
import type { LocationQuery } from '@weather-app/types';
import { APP_CONSTANTS } from '../constants/app.constants';
import { formatLocationQueryLabel } from '../utils/location.utils';

export interface PlacePrediction {
  placeId: string;
  description: string;
}

export interface PlaceLocationResult {
  query: LocationQuery;
  displayName: string;
}

export class GooglePlacesService {
  private static loader: Loader | null = null;
  private static autocompleteService: google.maps.places.AutocompleteService | null =
    null;
  private static placesService: google.maps.places.PlacesService | null = null;
  private static mapElement: HTMLDivElement | null = null;

  static async init(): Promise<void> {
    if (GooglePlacesService.autocompleteService) {
      return;
    }
    GooglePlacesService.loader = new Loader({
      apiKey: APP_CONSTANTS.GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    });
    await GooglePlacesService.loader.importLibrary('places');
    GooglePlacesService.autocompleteService =
      new google.maps.places.AutocompleteService();
    GooglePlacesService.mapElement = document.createElement('div');
    GooglePlacesService.placesService = new google.maps.places.PlacesService(
      GooglePlacesService.mapElement,
    );
  }

  static async getPredictions(input: string): Promise<PlacePrediction[]> {
    await GooglePlacesService.init();
    if (!input.trim()) {
      return [];
    }
    return new Promise((resolve) => {
      GooglePlacesService.autocompleteService?.getPlacePredictions(
        // (regions) includes cities and postal codes; (cities) excludes ZIP codes
        { input, types: ['(regions)'] },
        (results, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !results
          ) {
            resolve([]);
            return;
          }
          resolve(
            results.map((result) => ({
              placeId: result.place_id,
              description: result.description,
            })),
          );
        },
      );
    });
  }

  static async getPlaceLocation(placeId: string): Promise<PlaceLocationResult> {
    await GooglePlacesService.init();
    return new Promise((resolve, reject) => {
      GooglePlacesService.placesService?.getDetails(
        {
          placeId,
          fields: ['address_components', 'formatted_address', 'name', 'types'],
        },
        (place, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !place?.address_components
          ) {
            reject(new Error('Failed to resolve place details'));
            return;
          }

          const query = GooglePlacesService.parseAddressComponents(
            place.address_components,
          );
          const displayName =
            place.formatted_address ?? formatLocationQueryLabel(query);

          if (import.meta.env.DEV) {
            console.group(`[GooglePlaces] getDetails (${placeId})`);
            console.log('status', status);
            console.log('name', place.name);
            console.log('formatted_address', place.formatted_address);
            console.log('types', place.types);
            console.log(
              'address_components',
              place.address_components.map((component) => ({
                long_name: component.long_name,
                short_name: component.short_name,
                types: component.types,
              })),
            );
            console.log('parsed LocationQuery', query);
            console.log('displayName', displayName);
            console.groupEnd();
          }

          resolve({ query, displayName });
        },
      );
    });
  }

  private static parseAddressComponents(
    components: google.maps.GeocoderAddressComponent[],
  ): LocationQuery {
    const find = (type: string): string | undefined =>
      components.find((c) => c.types.includes(type))?.long_name;

    const findShort = (type: string): string | undefined =>
      components.find((c) => c.types.includes(type))?.short_name;

    const zip = find('postal_code');
    const locality = find('locality');
    const admin1 = find('administrative_area_level_1');
    const city =
      locality ?? find('administrative_area_level_2') ?? admin1;

    return {
      city,
      state: locality ? admin1 : undefined,
      country: findShort('country') ?? find('country'),
      zip,
    };
  }
}

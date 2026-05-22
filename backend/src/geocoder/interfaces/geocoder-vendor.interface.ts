import type {
  Coordinates,
  LocationInfo,
  LocationQuery,
} from '@weather-app/types';

export const GEOCODER_VENDOR = 'GEOCODER_VENDOR';

export interface IGeocoderVendor {
  geocodeByText(query: LocationQuery): Promise<Coordinates>;
  reverseGeocode(coords: Coordinates): Promise<LocationInfo>;
}

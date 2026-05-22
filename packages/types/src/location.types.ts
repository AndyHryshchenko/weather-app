export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationQuery {
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  displayName: string;
}

export enum LocationSource {
  GPS = 'GPS',
  SEARCH = 'SEARCH',
}

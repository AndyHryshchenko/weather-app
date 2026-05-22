export const WeatherRequestKind = {
  CURRENT: 'CURRENT',
  HOURLY: 'HOURLY',
  FORECAST: 'FORECAST',
} as const;

export type WeatherRequestKind =
  (typeof WeatherRequestKind)[keyof typeof WeatherRequestKind];

export const WEATHER_REQUEST_LABEL_KEYS: Record<WeatherRequestKind, string> = {
  [WeatherRequestKind.CURRENT]: 'error.requests.current',
  [WeatherRequestKind.HOURLY]: 'error.requests.hourly',
  [WeatherRequestKind.FORECAST]: 'error.requests.forecast',
};

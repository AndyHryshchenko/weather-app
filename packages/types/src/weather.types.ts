export enum TemperatureUnit {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

export enum WeatherIconCode {
  CLEAR_DAY = 'CLEAR_DAY',
  CLEAR_NIGHT = 'CLEAR_NIGHT',
  PARTLY_CLOUDY_DAY = 'PARTLY_CLOUDY_DAY',
  PARTLY_CLOUDY_NIGHT = 'PARTLY_CLOUDY_NIGHT',
  CLOUDY = 'CLOUDY',
  OVERCAST = 'OVERCAST',
  FOG = 'FOG',
  DRIZZLE = 'DRIZZLE',
  RAIN = 'RAIN',
  HEAVY_RAIN = 'HEAVY_RAIN',
  THUNDERSTORM = 'THUNDERSTORM',
  SNOW = 'SNOW',
  SLEET = 'SLEET',
  BLIZZARD = 'BLIZZARD',
  WIND = 'WIND',
  HAIL = 'HAIL',
  UNKNOWN = 'UNKNOWN',
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: WeatherIconCode;
}

export interface CurrentWeatherData {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number;
  cloudiness: number;
  uvi: number;
  dewPoint: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  rain1h?: number | null;
  snow1h?: number | null;
  condition: WeatherCondition;
  sunrise: number;
  sunset: number;
  timezone: string;
  timezoneOffset: number;
  cityName: string;
}

export interface ResponseMeta {
  requestedAt: string;
  units?: TemperatureUnit;
}

export interface WeatherResponse<T> {
  data: T;
  meta: ResponseMeta;
}

export enum AsyncStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

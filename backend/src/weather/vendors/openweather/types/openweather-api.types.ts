export interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherCurrent {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: OpenWeatherCondition[];
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface OpenWeatherHourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  pop: number;
  weather: OpenWeatherCondition[];
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface OpenWeatherDailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface OpenWeatherDailyFeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface OpenWeatherDaily {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: OpenWeatherDailyTemp;
  feels_like: OpenWeatherDailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  clouds: number;
  uvi: number;
  pop: number;
  rain?: number;
  snow?: number;
  weather: OpenWeatherCondition[];
  summary?: string;
}

export interface OpenWeatherOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OpenWeatherCurrent;
  hourly: OpenWeatherHourly[];
  daily: OpenWeatherDaily[];
}

export interface OpenWeatherGeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}

export interface OpenWeatherZipGeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  zip: string;
}

export interface OpenWeatherCurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: OpenWeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  rain?: { '1h': number };
  snow?: { '1h': number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherForecastListItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: OpenWeatherCondition[];
  clouds: { all: number };
  visibility?: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  pop: number;
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  sys: { pod: string };
  dt_txt: string;
}

export interface OpenWeatherForecastCity {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherForecastListItem[];
  city: OpenWeatherForecastCity;
}

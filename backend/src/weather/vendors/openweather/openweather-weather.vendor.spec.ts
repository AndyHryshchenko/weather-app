import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TemperatureUnit } from '@weather-app/types';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenWeatherHttpService } from './openweather-http.service';
import { OpenWeatherWeatherVendor } from './openweather-weather.vendor';
import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from './types/openweather-api.types';

const mockCurrent: OpenWeatherCurrentWeatherResponse = {
  coord: { lon: -80.8, lat: 35.2 },
  weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
  base: 'stations',
  main: {
    temp: 22,
    feels_like: 21,
    temp_min: 18,
    temp_max: 25,
    pressure: 1013,
    humidity: 65,
  },
  visibility: 10_000,
  wind: { speed: 4.5, deg: 180 },
  clouds: { all: 40 },
  dt: 1700000000,
  sys: { country: 'US', sunrise: 1699980000, sunset: 1700020000 },
  timezone: -18_000,
  id: 1,
  name: 'Charlotte',
  cod: 200,
};

const mockForecast: OpenWeatherForecastResponse = {
  cod: '200',
  message: 0,
  cnt: 2,
  list: [
    {
      dt: 1700000000,
      main: {
        temp: 20,
        feels_like: 19,
        temp_min: 18,
        temp_max: 21,
        pressure: 1010,
        humidity: 60,
      },
      weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
      clouds: { all: 20 },
      wind: { speed: 2, deg: 90 },
      pop: 0.1,
      sys: { pod: 'd' },
      dt_txt: '2023-11-14 12:00:00',
    },
    {
      dt: 1700010800,
      main: {
        temp: 18,
        feels_like: 17,
        temp_min: 17,
        temp_max: 19,
        pressure: 1011,
        humidity: 62,
      },
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      clouds: { all: 30 },
      wind: { speed: 3, deg: 100 },
      pop: 0.2,
      sys: { pod: 'd' },
      dt_txt: '2023-11-14 15:00:00',
    },
  ],
  city: {
    id: 1,
    name: 'Charlotte',
    coord: { lat: 35.2, lon: -80.8 },
    country: 'US',
    timezone: -18_000,
    sunrise: 1699980000,
    sunset: 1700020000,
  },
};

describe('OpenWeatherWeatherVendor', () => {
  let vendor: OpenWeatherWeatherVendor;
  let httpGet: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    httpGet = vi.fn();
    const module = await Test.createTestingModule({
      providers: [
        OpenWeatherWeatherVendor,
        OpenWeatherHttpService,
        { provide: HttpService, useValue: { get: httpGet } },
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue('test-api-key') },
        },
      ],
    }).compile();

    vendor = module.get(OpenWeatherWeatherVendor);
  });

  it('calls current weather and a single shared forecast endpoint', async () => {
    httpGet
      .mockReturnValueOnce(of({ data: mockCurrent }))
      .mockReturnValueOnce(of({ data: mockForecast }));

    const coords = { lat: 35.2, lng: -80.8 };
    await vendor.getCurrentWeather(coords, TemperatureUnit.METRIC);
    await Promise.all([
      vendor.getHourlyForecast(coords, TemperatureUnit.METRIC),
      vendor.getForecast(coords, TemperatureUnit.METRIC),
    ]);

    expect(httpGet).toHaveBeenCalledTimes(2);
    const urls = httpGet.mock.calls.map(([url]) => String(url));
    expect(urls[0]).toContain('/data/2.5/weather');
    expect(urls[1]).toContain('/data/2.5/forecast');
  });

  it('deduplicates concurrent forecast requests', async () => {
    httpGet.mockReturnValue(of({ data: mockForecast }));

    const coords = { lat: 35.2, lng: -80.8 };
    await Promise.all([
      vendor.getHourlyForecast(coords, TemperatureUnit.METRIC),
      vendor.getForecast(coords, TemperatureUnit.METRIC),
    ]);

    expect(httpGet).toHaveBeenCalledTimes(1);
  });

  it('propagates HttpService errors', async () => {
    httpGet.mockReturnValue(
      throwError(() => new AxiosError('upstream failed')),
    );
    await expect(
      vendor.getForecast({ lat: 1, lng: 2 }, TemperatureUnit.METRIC),
    ).rejects.toBeInstanceOf(AxiosError);
  });

  it('requests imperial units for current weather', async () => {
    httpGet.mockReturnValue(of({ data: mockCurrent }));
    await vendor.getCurrentWeather({ lat: 1, lng: 2 }, TemperatureUnit.IMPERIAL);
    expect(String(httpGet.mock.calls[0]?.[0])).toContain('units=imperial');
  });
});

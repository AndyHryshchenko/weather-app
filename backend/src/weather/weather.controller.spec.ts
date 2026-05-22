import { Test } from '@nestjs/testing';
import { TemperatureUnit } from '@weather-app/types';
import { describe, expect, it, vi } from 'vitest';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  const mockCurrent = { temp: 22, cityName: 'Charlotte' };

  const setup = () =>
    Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getCurrentWeatherByText: vi.fn().mockResolvedValue(mockCurrent),
            getHourlyForecastByText: vi.fn().mockResolvedValue([]),
            getForecastByText: vi.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

  it('returns current weather envelope', async () => {
    const module = await setup();
    const controller = module.get(WeatherController);
    const response = await controller.getCurrent({
      city: 'Charlotte',
      units: TemperatureUnit.METRIC,
    });
    expect(response.data).toEqual(mockCurrent);
    expect(response.meta.units).toBe(TemperatureUnit.METRIC);
  });

  it('returns hourly and forecast envelopes', async () => {
    const module = await setup();
    const controller = module.get(WeatherController);
    const hourly = await controller.getHourly({ city: 'Charlotte' });
    const forecast = await controller.getForecast({ zip: '28105' });
    expect(hourly.data).toEqual([]);
    expect(forecast.data).toEqual([]);
  });

  it('defaults units to metric when omitted', async () => {
    const module = await setup();
    const controller = module.get(WeatherController);
    const response = await controller.getCurrent({ city: 'Charlotte' });
    expect(response.meta.units).toBe(TemperatureUnit.METRIC);
  });
});

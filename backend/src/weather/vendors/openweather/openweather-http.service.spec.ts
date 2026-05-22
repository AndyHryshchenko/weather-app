import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { OpenWeatherHttpService } from './openweather-http.service';

describe('OpenWeatherHttpService', () => {
  it('appends appid and returns response data', async () => {
    const httpGet = vi.fn().mockReturnValue(of({ data: { temp: 20 } }));
    const module = await Test.createTestingModule({
      providers: [
        OpenWeatherHttpService,
        { provide: HttpService, useValue: { get: httpGet } },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    const service = module.get(OpenWeatherHttpService);
    await expect(
      service.get<{ temp: number }>(
        'https://api.openweathermap.org/data/2.5/weather?units=metric',
      ),
    ).resolves.toEqual({ temp: 20 });

    const requestedUrl = String(httpGet.mock.calls[0]?.[0]);
    expect(requestedUrl).toContain('units=metric');
    expect(requestedUrl).toContain('appid=test-api-key');
  });
});

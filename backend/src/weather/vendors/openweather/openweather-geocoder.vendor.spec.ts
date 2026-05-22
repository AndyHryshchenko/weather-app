import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenWeatherGeocoderVendor } from './openweather-geocoder.vendor';
import { OpenWeatherHttpService } from './openweather-http.service';

describe('OpenWeatherGeocoderVendor', () => {
  let vendor: OpenWeatherGeocoderVendor;
  let httpGet: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    httpGet = vi.fn();
    const module = await Test.createTestingModule({
      providers: [
        OpenWeatherGeocoderVendor,
        OpenWeatherHttpService,
        { provide: HttpService, useValue: { get: httpGet } },
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue('test-api-key') },
        },
      ],
    }).compile();
    vendor = module.get(OpenWeatherGeocoderVendor);
  });

  it('geocodes by city', async () => {
    httpGet.mockReturnValue(
      of({
        data: [
          { name: 'Charlotte', lat: 35.2, lon: -80.8, country: 'US', state: 'NC' },
        ],
      }),
    );
    const coords = await vendor.geocodeByText({
      city: 'Charlotte',
      state: 'NC',
      country: 'US',
    });
    expect(coords).toEqual({ lat: 35.2, lng: -80.8 });
  });

  it('geocodes by zip without country', async () => {
    httpGet.mockReturnValue(
      of({
        data: {
          name: 'Test',
          lat: 1,
          lon: 2,
          country: 'US',
          zip: '12345',
        },
      }),
    );
    const coords = await vendor.geocodeByText({ zip: '12345' });
    expect(coords.lat).toBe(1);
  });

  it('prefers city geocoding when both city and zip are provided', async () => {
    httpGet.mockReturnValue(
      of({
        data: [
          { name: 'Mooresville', lat: 35.58, lon: -80.81, country: 'US', state: 'NC' },
        ],
      }),
    );

    const coords = await vendor.geocodeByText({
      city: 'Mooresville',
      state: 'North Carolina',
      country: 'United States',
      zip: '28117',
    });

    expect(coords.lat).toBe(35.58);
    expect(String(httpGet.mock.calls[0]?.[0])).toContain('/geo/1.0/direct');
    expect(String(httpGet.mock.calls[0]?.[0])).not.toContain('/geo/1.0/zip');
  });

  it('normalizes country name for zip geocoding', async () => {
    httpGet.mockReturnValue(
      of({
        data: {
          name: 'Mooresville',
          lat: 35.58,
          lon: -80.81,
          country: 'US',
          zip: '28117',
        },
      }),
    );

    await vendor.geocodeByText({ zip: '28117', country: 'United States' });

    const requestedUrl = String(httpGet.mock.calls[0]?.[0]);
    expect(requestedUrl).toContain('zip=28117%2CUS');
    expect(requestedUrl).toContain('appid=test-api-key');
  });

  it('geocodes by zip', async () => {
    httpGet.mockReturnValue(
      of({
        data: {
          name: 'Charlotte',
          lat: 35.2,
          lon: -80.8,
          country: 'US',
          zip: '28105',
        },
      }),
    );
    const coords = await vendor.geocodeByText({ zip: '28105', country: 'US' });
    expect(coords.lat).toBe(35.2);
  });

  it('throws BadRequestException when geocode query has no usable parts', async () => {
    await expect(vendor.geocodeByText({})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFoundException when geocode returns empty', async () => {
    httpGet.mockReturnValue(of({ data: [] }));
    await expect(
      vendor.geocodeByText({ city: 'Nowhere' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('reverse geocodes coordinates', async () => {
    httpGet.mockReturnValue(
      of({
        data: [
          { name: 'Indian Trail', lat: 35.0, lon: -80.6, country: 'US', state: 'NC' },
        ],
      }),
    );
    const info = await vendor.reverseGeocode({ lat: 35.0, lng: -80.6 });
    expect(info.displayName).toContain('Indian Trail');
  });

  it('throws NotFoundException on empty reverse geocode', async () => {
    httpGet.mockReturnValue(of({ data: [] }));
    await expect(
      vendor.reverseGeocode({ lat: 0, lng: 0 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('propagates HttpService errors', async () => {
    httpGet.mockReturnValue(
      throwError(() => new AxiosError('upstream failed')),
    );
    await expect(
      vendor.geocodeByText({ city: 'Test' }),
    ).rejects.toBeInstanceOf(AxiosError);
  });

  it('reverse geocodes locations without a state field', async () => {
    httpGet.mockReturnValue(
      of({
        data: [{ name: 'Paris', lat: 48.8, lon: 2.3, country: 'FR' }],
      }),
    );
    const info = await vendor.reverseGeocode({ lat: 48.8, lng: 2.3 });
    expect(info.state).toBeUndefined();
    expect(info.displayName).toBe('Paris, FR');
  });

  it('geocodes when city is omitted from query', async () => {
    httpGet.mockReturnValue(
      of({
        data: [{ name: 'NC', lat: 35.2, lon: -80.8, country: 'US' }],
      }),
    );
    const coords = await vendor.geocodeByText({ country: 'US' });
    expect(coords.lat).toBe(35.2);
  });
});

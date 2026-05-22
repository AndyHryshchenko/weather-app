import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { GEOCODER_CACHE } from '../common/cache/cache.interface';
import { MemoryCacheService } from '../common/cache/memory-cache.service';
import { AppLoggerService } from '../common/logger/app-logger.service';
import { GEOCODER_VENDOR } from './interfaces/geocoder-vendor.interface';
import { GeocoderService } from './geocoder.service';

describe('GeocoderService', () => {
  it('returns cached reverse geocode result', async () => {
    const cache = new MemoryCacheService();
    const locationInfo = {
      city: 'Indian Trail',
      state: 'NC',
      country: 'US',
      displayName: 'Indian Trail, NC, US',
    };
    await cache.set({
      key: 'geocode:reverse:35.00|-80.60',
      value: locationInfo,
      ttlSeconds: 3600,
    });

    const geocoderVendor = {
      reverseGeocode: vi.fn(),
      geocodeByText: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GeocoderService,
        { provide: GEOCODER_VENDOR, useValue: geocoderVendor },
        { provide: GEOCODER_CACHE, useValue: cache },
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue(3600) },
        },
        {
          provide: AppLoggerService,
          useValue: {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            logCacheAccess: vi.fn(),
          },
        },
      ],
    }).compile();

    const service = module.get(GeocoderService);
    const result = await service.reverseGeocode({ lat: 35, lng: -80.6 });
    expect(result).toEqual(locationInfo);
    expect(geocoderVendor.reverseGeocode).not.toHaveBeenCalled();
  });

  it('fetches and caches on miss', async () => {
    const cache = new MemoryCacheService();
    const locationInfo = {
      city: 'Charlotte',
      country: 'US',
      displayName: 'Charlotte, US',
    };
    const geocoderVendor = {
      reverseGeocode: vi.fn().mockResolvedValue(locationInfo),
      geocodeByText: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GeocoderService,
        { provide: GEOCODER_VENDOR, useValue: geocoderVendor },
        { provide: GEOCODER_CACHE, useValue: cache },
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue(3600) },
        },
        {
          provide: AppLoggerService,
          useValue: {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            logCacheAccess: vi.fn(),
          },
        },
      ],
    }).compile();

    const service = module.get(GeocoderService);
    await service.reverseGeocode({ lat: 35.2, lng: -80.8 });
    const cached = await cache.get('geocode:reverse:35.20|-80.80');
    expect(cached).toEqual(locationInfo);
  });
});

import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { GeocoderController } from './geocoder.controller';
import { GeocoderService } from './geocoder.service';

describe('GeocoderController', () => {
  it('returns reverse geocode response envelope', async () => {
    const locationInfo = {
      city: 'Charlotte',
      state: 'NC',
      country: 'US',
      displayName: 'Charlotte, NC, US',
    };
    const module = await Test.createTestingModule({
      controllers: [GeocoderController],
      providers: [
        {
          provide: GeocoderService,
          useValue: {
            reverseGeocode: vi.fn().mockResolvedValue(locationInfo),
          },
        },
      ],
    }).compile();

    const controller = module.get(GeocoderController);
    const response = await controller.reverseGeocode({ lat: 35.2, lng: -80.8 });
    expect(response.data).toEqual(locationInfo);
    expect(response.meta.requestedAt).toBeTruthy();
  });
});

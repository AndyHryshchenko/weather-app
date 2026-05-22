import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Coordinates, LocationInfo } from '@weather-app/types';
import type { AppConfig } from '../config/configuration';
import { AppLoggerService } from '../common/logger/app-logger.service';
import {
  GEOCODER_CACHE,
  type ICacheService,
} from '../common/cache/cache.interface';
import { buildReverseGeocodeKey } from '../common/cache-keys';
import {
  GEOCODER_VENDOR,
  type IGeocoderVendor,
} from './interfaces/geocoder-vendor.interface';

@Injectable()
export class GeocoderService {
  constructor(
    @Inject(GEOCODER_VENDOR)
    private readonly geocoderVendor: IGeocoderVendor,
    @Inject(GEOCODER_CACHE)
    private readonly cache: ICacheService<LocationInfo | Coordinates>,
    private readonly config: ConfigService<AppConfig, true>,
    private readonly logger: AppLoggerService,
  ) {}

  async reverseGeocode(coords: Coordinates): Promise<LocationInfo> {
    const cacheKey = buildReverseGeocodeKey(coords.lat, coords.lng);
    const cached = await this.cache.get(cacheKey);
    if (cached && this.isLocationInfo(cached)) {
      this.logger.logCacheAccess('hit', cacheKey);
      return cached;
    }

    this.logger.logCacheAccess('miss', cacheKey);
    const result = await this.geocoderVendor.reverseGeocode(coords);
    const ttl = this.config.get('geocoderCacheTtlSeconds', { infer: true });
    await this.cache.set({ key: cacheKey, value: result, ttlSeconds: ttl });
    return result;
  }

  private isLocationInfo(
    value: LocationInfo | Coordinates,
  ): value is LocationInfo {
    return 'displayName' in value;
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import type { LocationInfo, WeatherResponse } from '@weather-app/types';
import { buildWeatherResponse } from '../common/response.util';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { GeocoderService } from './geocoder.service';

@Controller('api/v1/geocode')
export class GeocoderController {
  constructor(private readonly geocoderService: GeocoderService) {}

  @Get('reverse')
  async reverseGeocode(
    @Query() query: ReverseGeocodeDto,
  ): Promise<WeatherResponse<LocationInfo>> {
    const data = await this.geocoderService.reverseGeocode({
      lat: query.lat,
      lng: query.lng,
    });
    return buildWeatherResponse(data);
  }
}

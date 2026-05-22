import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { LocationInfo, WeatherResponse } from '@weather-app/types';
import { buildWeatherResponse } from '../common/response.util';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { GeocoderService } from './geocoder.service';
import { SwaggerTag } from '../swagger/swagger.constants';

@ApiTags(SwaggerTag.GEOCODE)
@Controller('api/v1/geocode')
export class GeocoderController {
  constructor(private readonly geocoderService: GeocoderService) {}

  @Get('reverse')
  @ApiOperation({ summary: 'Resolve coordinates to a place name' })
  @ApiOkResponse({ description: 'Location details with response metadata' })
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

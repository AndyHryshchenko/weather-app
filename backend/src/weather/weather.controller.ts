import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  WeatherResponse,
} from '@weather-app/types';
import { TemperatureUnit as DefaultUnit } from '@weather-app/types';
import { buildWeatherResponse } from '../common/response.util';
import { WeatherByLocationDto } from './dto/weather-by-location.dto';
import { WeatherService } from './weather.service';
import { SwaggerTag } from '../swagger/swagger.constants';

@ApiTags(SwaggerTag.WEATHER)
@Controller('api/v1/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: 'Current weather for a location' })
  @ApiOkResponse({ description: 'Current conditions with response metadata' })
  async getCurrent(
    @Query() query: WeatherByLocationDto,
  ): Promise<WeatherResponse<CurrentWeatherData>> {
    const units = query.units ?? DefaultUnit.METRIC;
    const data = await this.weatherService.getCurrentWeatherByText(
      query,
      units,
    );
    return buildWeatherResponse(data, units);
  }

  @Get('hourly')
  @ApiOperation({ summary: 'Hourly forecast for a location' })
  @ApiOkResponse({ description: 'Hourly forecast entries with response metadata' })
  async getHourly(
    @Query() query: WeatherByLocationDto,
  ): Promise<WeatherResponse<HourlyForecast[]>> {
    const units = query.units ?? DefaultUnit.METRIC;
    const data = await this.weatherService.getHourlyForecastByText(
      query,
      units,
    );
    return buildWeatherResponse(data, units);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Multi-day forecast for a location' })
  @ApiOkResponse({ description: 'Daily forecast entries with response metadata' })
  async getForecast(
    @Query() query: WeatherByLocationDto,
  ): Promise<WeatherResponse<ForecastDay[]>> {
    const units = query.units ?? DefaultUnit.METRIC;
    const data = await this.weatherService.getForecastByText(query, units);
    return buildWeatherResponse(data, units);
  }
}

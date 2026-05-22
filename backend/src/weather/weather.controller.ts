import { Controller, Get, Query } from '@nestjs/common';
import type {
  CurrentWeatherData,
  ForecastDay,
  HourlyForecast,
  TemperatureUnit,
  WeatherResponse,
} from '@weather-app/types';
import { TemperatureUnit as DefaultUnit } from '@weather-app/types';
import { buildWeatherResponse } from '../common/response.util';
import { WeatherByLocationDto } from './dto/weather-by-location.dto';
import { WeatherService } from './weather.service';

@Controller('api/v1/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
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
  async getForecast(
    @Query() query: WeatherByLocationDto,
  ): Promise<WeatherResponse<ForecastDay[]>> {
    const units = query.units ?? DefaultUnit.METRIC;
    const data = await this.weatherService.getForecastByText(query, units);
    return buildWeatherResponse(data, units);
  }
}

import { TemperatureUnit } from '@weather-app/types';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';

export class WeatherByLocationDto {
  @ValidateIf(
    (dto: WeatherByLocationDto) => !dto.zip && !(dto.state && dto.country),
  )
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @ValidateIf(
    (dto: WeatherByLocationDto) => !dto.city && !(dto.state && dto.country),
  )
  @IsString()
  zip?: string;

  @IsOptional()
  @IsEnum(TemperatureUnit)
  units?: TemperatureUnit;
}

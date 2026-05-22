import { ApiPropertyOptional } from '@nestjs/swagger';
import { TemperatureUnit } from '@weather-app/types';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';

export class WeatherByLocationDto {
  @ApiPropertyOptional({
    description: 'City name (required unless zip or state+country is provided)',
    example: 'Charlotte',
  })
  @ValidateIf(
    (dto: WeatherByLocationDto) => !dto.zip && !(dto.state && dto.country),
  )
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State or region code',
    example: 'NC',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'ISO country code; use with state when city is omitted',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal code (required unless city or state+country is provided)',
    example: '28105',
  })
  @ValidateIf(
    (dto: WeatherByLocationDto) => !dto.city && !(dto.state && dto.country),
  )
  @IsString()
  zip?: string;

  @ApiPropertyOptional({
    enum: TemperatureUnit,
    default: TemperatureUnit.METRIC,
    description: 'Temperature and wind speed units',
  })
  @IsOptional()
  @IsEnum(TemperatureUnit)
  units?: TemperatureUnit;
}

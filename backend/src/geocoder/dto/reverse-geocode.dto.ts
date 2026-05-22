import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class ReverseGeocodeDto {
  @ApiProperty({
    description: 'Latitude in decimal degrees',
    minimum: -90,
    maximum: 90,
    example: 35.2271,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiProperty({
    description: 'Longitude in decimal degrees',
    minimum: -180,
    maximum: 180,
    example: -80.8431,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}

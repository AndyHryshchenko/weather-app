import { Module } from '@nestjs/common';
import { OpenWeatherModule } from '../weather/vendors/openweather/openweather.module';
import { GeocoderController } from './geocoder.controller';
import { GeocoderService } from './geocoder.service';

@Module({
  imports: [OpenWeatherModule],
  controllers: [GeocoderController],
  providers: [GeocoderService],
  exports: [GeocoderService],
})
export class GeocoderModule {}

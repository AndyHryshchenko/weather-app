import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GEOCODER_VENDOR } from '../../../geocoder/interfaces/geocoder-vendor.interface';
import { WEATHER_VENDOR } from '../../interfaces/weather-vendor.interface';
import { OpenWeatherGeocoderVendor } from './openweather-geocoder.vendor';
import { OpenWeatherHttpService } from './openweather-http.service';
import { OpenWeatherWeatherVendor } from './openweather-weather.vendor';

@Module({
  imports: [HttpModule.register({ timeout: 10_000 })],
  providers: [
    OpenWeatherHttpService,
    OpenWeatherWeatherVendor,
    { provide: WEATHER_VENDOR, useExisting: OpenWeatherWeatherVendor },
    OpenWeatherGeocoderVendor,
    { provide: GEOCODER_VENDOR, useExisting: OpenWeatherGeocoderVendor },
  ],
  exports: [WEATHER_VENDOR, GEOCODER_VENDOR],
})
export class OpenWeatherModule {}

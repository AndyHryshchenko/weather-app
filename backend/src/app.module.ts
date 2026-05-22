import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { configValidationSchema } from './config/config.schema';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from './common/logger/logger.module';
import { GeocoderModule } from './geocoder/geocoder.module';
import { HealthController } from './health/health.controller';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
      // pnpm --filter backend runs with cwd=backend/; monorepo .env lives at repo root
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), '..', '.env'),
      ],
    }),
    CacheModule,
    LoggerModule,
    GeocoderModule,
    WeatherModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

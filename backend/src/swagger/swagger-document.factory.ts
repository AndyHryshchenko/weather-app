import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_TITLE,
  SWAGGER_API_VERSION,
  SwaggerTag,
} from './swagger.constants';

export const createSwaggerDocument = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API_TITLE)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_VERSION)
    .addTag(SwaggerTag.HEALTH, 'Service health and readiness')
    .addTag(SwaggerTag.WEATHER, 'Current weather and forecasts')
    .addTag(SwaggerTag.GEOCODE, 'Reverse geocoding')
    .build();

  return SwaggerModule.createDocument(app, config);
};

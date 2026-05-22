import { type INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerPath } from './swagger.constants';
import { createSwaggerDocument } from './swagger-document.factory';

export const setupSwaggerDocumentation = (
  app: INestApplication,
  enabled: boolean,
): void => {
  if (!enabled) {
    return;
  }

  const document = createSwaggerDocument(app);
  SwaggerModule.setup(SwaggerPath.DOCS, app, document);
};

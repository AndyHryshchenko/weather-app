import { type INestApplication, Module } from '@nestjs/common';
import { setupSwaggerDocumentation } from './swagger.setup';

@Module({})
export class SwaggerDocumentationModule {
  static setup(app: INestApplication, enabled: boolean): void {
    setupSwaggerDocumentation(app, enabled);
  }
}

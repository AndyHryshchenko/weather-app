import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createCorsOriginHandler } from './common/cors.util';
import type { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<AppConfig, true>);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: createCorsOriginHandler(
      config.get('clientAppHost', { infer: true }),
      process.env.NODE_ENV !== 'production',
    ),
  });

  app.enableShutdownHooks();

  const port = config.get('port', { infer: true });
  await app.listen(port);
}

void bootstrap();

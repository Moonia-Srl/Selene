import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { env } from 'process';

import { AppModule } from './app.module';
import { setupSwagger } from './helper/swagger.helper';

async function bootstrap() {
  // NestFactory.create configuration object
  const nestConfig = { cors: { origin: true } };
  // Initializes the application
  const app: NestExpressApplication = await NestFactory.create(AppModule, nestConfig);

  // Retrieves the configuration service
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  // Add validation and transformations pipes globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Setup and initializes the global app logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Setups the Swagger integration when not in "production" mode
  if (env.NODE_ENV != 'production') setupSwagger(app);

  await app.listen(port, () => console.warn(`Server started in '${env.NODE_ENV}' mode on port ${env.PORT}`));
}

bootstrap();

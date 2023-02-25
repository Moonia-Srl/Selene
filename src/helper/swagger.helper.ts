import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Selene')
    .setDescription('Moonium WebService API documentation')
    .setVersion(env.SELENE_VERSION)
    .addBearerAuth()
    .addServer(env.NODE_ENV === 'production' ? 'https://' : 'http://')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
}

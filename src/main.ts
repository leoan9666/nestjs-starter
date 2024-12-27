import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { DEFAULT_APP_VERSION } from 'src/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    // TODO: use environment variable values for origin
    origin: ['localhost:3001'], // e.g. ['https://frontend.com', 'https://another-frontend.com']
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_APP_VERSION,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

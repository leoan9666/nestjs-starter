import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@src/app.module';
import { DEFAULT_APP_VERSION } from '@src/app.constant';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { LogService } from '@src/log/log.service';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<AppConfig>(APP_CONFIG_NAME)!.port;
  const origin = configService
    .get<AppConfig>(APP_CONFIG_NAME)!
    .origin.split(',');

  app.use(helmet());

  app.enableCors({
    origin, // e.g. ['https://frontend.com', 'https://another-frontend.com']
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_APP_VERSION,
  });

  // TODO: shutdown db connection
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Starter example')
    .setDescription('Starter API description')
    .setVersion('1.0')
    .addTag('Starter App')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useLogger(app.get(LogService));

  await app.listen(port ?? 8000);
}
bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

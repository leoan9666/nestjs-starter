import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@src/app.module';
import { DEFAULT_APP_VERSION } from '@src/app.constant';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { LogService } from '@src/log/log.service';
import {
  SESSION_CONFIG_NAME,
  SessionConfig,
} from '@src/config/env/session/session.config';
import {
  UPSTASH_CONFIG_NAME,
  UpstashConfig,
} from '@src/config/env/upstash/upstash.config';

import helmet from 'helmet';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import * as Redis from 'ioredis';

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

  // Set up session management
  const sessionConfig = configService.get<SessionConfig>(SESSION_CONFIG_NAME);
  app.use(
    session({
      store: new RedisStore({
        client: new Redis.Redis(
          configService.get<UpstashConfig>(UPSTASH_CONFIG_NAME)!.connectionUri,
        ),
      }),
      secret: sessionConfig!.secret, // secret key for signing session ID cookie
      resave: sessionConfig!.resave, // don't save session if unmodified
      saveUninitialized: sessionConfig!.saveUnitialized, // don't create session until something is stored
      cookie: {
        httpOnly: sessionConfig!.cookieHttpOnly,
        secure: sessionConfig!.cookieSecure,
        maxAge: sessionConfig!.cookieMaxAge,
      }, // configure cookies
    }),
  );

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

import { APP_FILTER } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AppShutdownHandlerModule } from '@src/app-shutdown-handler/app-shutdown-handler.module';
import appConfig from '@src/config/env/app/app.config';
import validateEnv from '@src/config/env/validate-env';
import { HealthModule } from '@src/health/health.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { AlsModule } from '@src/als/als.module';
import { AlsContext } from '@src/als/als.type';
import { CorrelationIDMiddleware } from '@src/middleware/correlationID.middleware';
import { CatchAllFilter } from '@src/filter/catch-all.filter';
import { CustomErrorFilter } from '@src/filter/custom-error.filter';
import { LogModule } from '@src/log/log.module';
import awsConfig from '@src/config/env/aws/aws.config';
import cloudwatchLogConfig from '@src/config/env/cloudwatch-log/cloudwatch-log.config';
import { CacheModule } from '@src/cache/cache.module';
import upstashConfig from '@src/config/env/upstash/upstash.config';
import cacheConfig from '@src/config/env/cache/cache.config';
import { RateLimitingMiddleware } from '@src/middleware/globalRateLimit.middleware';
import sessionConfig from '@src/config/env/session/session.config';
import { AuthModule } from '@src/auth/auth.module';

import { AsyncLocalStorage } from 'async_hooks';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        awsConfig,
        cloudwatchLogConfig,
        cacheConfig,
        upstashConfig,
        sessionConfig,
      ],
      validate: validateEnv,
    }),
    HealthModule,
    AppShutdownHandlerModule,
    AlsModule,
    LogModule,
    CacheModule,
    AuthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<AlsContext>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitingMiddleware).forRoutes('*');
    consumer.apply(CorrelationIDMiddleware).forRoutes('*');
  }
}

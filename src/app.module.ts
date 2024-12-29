import { APP_FILTER } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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

import { AsyncLocalStorage } from 'async_hooks';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      validate: validateEnv,
    }),
    HealthModule,
    AppShutdownHandlerModule,
    AlsModule,
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
    consumer.apply(CorrelationIDMiddleware).forRoutes('*');
  }
}

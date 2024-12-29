import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AppShutdownHandlerModule } from '@src/app-shutdown-handler/app-shutdown-handler.module';

import appConfig from '@src/config/env/app/app.config';
import validateEnv from '@src/config/env/validate-env';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

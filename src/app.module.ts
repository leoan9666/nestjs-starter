import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AppShutdownHandlerModule } from './app-shutdown-handler/app-shutdown-handler.module';
import { ConfigModule } from '@nestjs/config';
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

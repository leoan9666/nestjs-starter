import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AppShutdownHandlerModule } from './app-shutdown-handler/app-shutdown-handler.module';

@Module({
  imports: [HealthModule, AppShutdownHandlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

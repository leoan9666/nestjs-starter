import { Module } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';

@Module({})
export class AppShutdownHandlerModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
    // TODO: shut down db
  }
}

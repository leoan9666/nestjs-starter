import { Module } from '@nestjs/common';

import { LogService } from '@src/log/log.service';
import { AlsModule } from '@src/als/als.module';

@Module({
  imports: [AlsModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}

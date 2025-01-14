import { Module } from '@nestjs/common';

import { AppConfigService } from '@src/appConfig/appConfig.service';
import { LogModule } from '@src/log/log.module';

@Module({
  imports: [LogModule],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}

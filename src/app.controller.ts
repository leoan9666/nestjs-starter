import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from '@src/app.service';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { AlsContext } from '@src/als/als.type';

import { AsyncLocalStorage } from 'async_hooks';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly als: AsyncLocalStorage<AlsContext>,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    const appConfig = this.configService.get<AppConfig>(APP_CONFIG_NAME);
    console.log('appConfig:');
    console.log(appConfig);

    const userId = this.als.getStore().userID;
    const correlationID = this.als.getStore().correlationID;
    console.log(`userId: ${userId}`);
    console.log(`correlationID: ${correlationID}`);

    return this.appService.getHello();
  }
}

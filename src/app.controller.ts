import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from '@src/app.pipe';

import { AppService } from '@src/app.service';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { AppSchema, CreateAppDto } from '@src/app.schema';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    const appConfig = this.configService.get<AppConfig>(APP_CONFIG_NAME);
    console.log('appConfig:');
    console.log(appConfig);

    return this.appService.getHello();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(AppSchema))
  postHello(@Body() appDto: CreateAppDto) {
    console.log(appDto);
  }
}

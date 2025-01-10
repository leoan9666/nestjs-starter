import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from '@src/app.pipe';
import { AppService } from '@src/app.service';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { AppSchema, CreateApp } from '@src/app.schema';
import { CreateAppDto } from '@src/app.dto';
import { LogService } from '@src/log/log.service';
import { Role } from '@src/auth/role/role.enum';
import { Auth } from '@src/auth/guard/auth.guard';

@ApiBearerAuth()
@ApiTags('app')
@Auth(Role.Admin)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logService: LogService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Returns a hello message',
    description:
      'This endpoint returns a simple hello message from the server. It requires the user ID to be passed in the header.',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID derived from token',
    example: 'abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Hello message successfully retrieved.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request is malformed or missing required parameters.',
  })
  public async getHello(): Promise<string> {
    try {
      // throw new Error('test log error');
    } catch (error) {
      await this.logService.error(error, error.stack, {
        description: 'test error log thrown',
      });
    }

    return this.appService.getHello();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Post Hello successfully sent.',
    type: undefined,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request is malformed or missing required parameters.',
  })
  @ApiBody({ type: CreateAppDto })
  @UsePipes(new ZodValidationPipe(AppSchema))
  public postHello(@Body() appDto: CreateApp): void {
    console.log(appDto);
  }
}

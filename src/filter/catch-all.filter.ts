import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AlsContext } from '@src/als/als.type';
import { LogService } from '@src/log/log.service';

import { AsyncLocalStorage } from 'async_hooks';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  constructor(
    private readonly als: AsyncLocalStorage<AlsContext>,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logService: LogService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const correlationID = this.als.getStore()?.correlationID;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      correlationID,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: 'Something went wrong. Please try again later.',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    await this.logService.error('Error', JSON.stringify(exception));

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

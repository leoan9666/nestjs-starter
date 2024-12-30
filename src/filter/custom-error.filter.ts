import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AlsContext } from '@src/als/als.type';
import { CustomError } from '@src/exception/custom.error';
import { LogService } from '@src/log/log.service';

import { AsyncLocalStorage } from 'async_hooks';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
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
      exception instanceof CustomError
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const timestamp = new Date().toISOString();

    const message =
      exception instanceof CustomError
        ? exception.message
        : 'Something went wrong.';

    const data = exception instanceof CustomError ? exception?.data : null;

    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    const responseBody = {
      correlationID,
      statusCode: httpStatus,
      timestamp,
      message,
      data,
      path,
    };

    await this.logService.error('Error', JSON.stringify(exception));

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

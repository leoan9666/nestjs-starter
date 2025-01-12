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

    let responseBody = {
      correlationID,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: 'Something went wrong. Please try again later.',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    let exceptionDetails: string;

    if (exception instanceof HttpException) {
      responseBody = { ...responseBody, message: exception.message };
      exceptionDetails = JSON.stringify({
        errorName: exception.name,
        message: exception.message,
        stack: exception.stack,
        path: ctx.getRequest().path,
        method: ctx.getRequest().method,
      });
    } else if (exception instanceof Error) {
      exceptionDetails = JSON.stringify({
        errorName: exception.name,
        message: exception.message,
        stack: exception.stack,
        path: ctx.getRequest().path,
        method: ctx.getRequest().method,
      });
    } else if (
      !exception ||
      (typeof exception === 'object' && Object.keys(exception).length === 0)
    ) {
      // Check if exception is null, undefined, or an empty object
      exceptionDetails = JSON.stringify({
        message: 'Exception is empty or undefined',
        value: exception, // Will capture `null` or `undefined`,
        path: ctx.getRequest().path,
        method: ctx.getRequest().method,
      });
    } else {
      exceptionDetails = JSON.stringify(exception);
    }

    await this.logService.error('Error', exceptionDetails);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

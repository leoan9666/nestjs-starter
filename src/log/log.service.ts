import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlsContext } from '@src/als/als.type';

import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import {
  CLOUDWATCHLOG_CONFIG_NAME,
  CloudwatchLogConfig,
} from '@src/config/env/cloudwatch-log/cloudwatch-log.config';
import { CloudWatchTransport } from '@src/log/transports/cloudwatch-transport';
import { AlsSchema } from '@src/als/als.schema';

import * as winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class LogService implements LoggerService {
  private logger: winston.Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly als: AsyncLocalStorage<AlsContext>,
  ) {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];
    const cloudwatchLogConfig = this.configService.get<CloudwatchLogConfig>(
      CLOUDWATCHLOG_CONFIG_NAME,
    );

    // Local mode: log to console
    if (this.isLocalEnv()) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.metadata(),
          ),
        }),
      );
    } else {
      // CloudWatch mode: log to AWS CloudWatch
      transports.push(
        new CloudWatchTransport({
          logGroupName: cloudwatchLogConfig!.groupName,
          logStreamName: cloudwatchLogConfig!.streamName,
          awsRegion: cloudwatchLogConfig!.region,
        }),
      );
    }

    return winston.createLogger({
      level: 'info', // Set the default log level
      transports,
    });
  }

  private isLocalEnv(): boolean {
    const env = this.configService.get<AppConfig>(APP_CONFIG_NAME)?.env;
    return env === 'local' || env === null || env === undefined;
  }

  log(message: string, metadata: any = {}) {
    const result = AlsSchema.safeParse(this.als.getStore());

    const userID = result?.data?.userID;
    const correlationID = result?.data?.correlationID;

    const data =
      typeof metadata === 'string'
        ? { metadata, correlationID, userID, level: 'info' }
        : { ...metadata, correlationID, userID, level: 'info' };

    this.logger.info(message, { metadata: data });
  }

  error(message: string, trace: string, metadata: any = {}) {
    const result = AlsSchema.safeParse(this.als.getStore());

    const userID = result?.data?.userID;
    const correlationID = result?.data?.correlationID;

    const data =
      typeof metadata === 'string'
        ? { metadata, correlationID, userID, level: 'error' }
        : { ...metadata, correlationID, userID, level: 'error' };

    this.logger.error(`${message}`, { metadata: data, trace });
  }

  warn(message: string, metadata: any = {}) {
    const result = AlsSchema.safeParse(this.als.getStore());

    const userID = result?.data?.userID;
    const correlationID = result?.data?.correlationID;

    const data =
      typeof metadata === 'string'
        ? { metadata, correlationID, userID, level: 'warn' }
        : { ...metadata, correlationID, userID, level: 'warn' };

    this.logger.warn(message, { metadata: data });
  }

  debug(message: string, metadata: any = {}) {
    const result = AlsSchema.safeParse(this.als.getStore());

    const userID = result?.data?.userID;
    const correlationID = result?.data?.correlationID;

    const data =
      typeof metadata === 'string'
        ? { metadata, correlationID, userID, level: 'debug' }
        : { ...metadata, correlationID, userID, level: 'debug' };

    this.logger.debug(message, { metadata: data });
  }

  verbose(message: string, metadata: any = {}) {
    const result = AlsSchema.safeParse(this.als.getStore());

    const userID = result?.data?.userID;
    const correlationID = result?.data?.correlationID;

    const data =
      typeof metadata === 'string'
        ? { metadata, correlationID, userID, level: 'verbose' }
        : { ...metadata, correlationID, userID, level: 'verbose' };

    this.logger.verbose(message, { metadata: data });
  }
}

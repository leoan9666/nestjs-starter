import { Injectable } from '@nestjs/common';

import { AlsContext } from '@src/als/als.type';
import { AlsSchema } from '@src/als/als.schema';
import { ZodCustomError } from '@src/exception/zod.error';
import { ERROR_CONSTANTS } from '@src/error/error.constants';

import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AppService {
  constructor(private readonly als: AsyncLocalStorage<AlsContext>) {}

  getHello(): string {
    const result = AlsSchema.safeParse(this.als.getStore());

    if (!result.success) {
      console.error('Invalid ALS Context:', result.error.errors);
      throw new ZodCustomError({
        errorCode: ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.code,
        message: ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.message,
        status: ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.httpStatus,
        errors: result.error.errors,
      });
    }

    const userId = result.data.userID;
    const correlationID = result.data.correlationID;
    console.log(`userId: ${userId}`);
    console.log(`correlationID: ${correlationID}`);
    return 'Hello World!';
  }
}

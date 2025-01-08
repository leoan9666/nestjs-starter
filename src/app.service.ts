import { Injectable } from '@nestjs/common';

import { AlsContext } from '@src/als/als.type';
import { AlsSchema } from '@src/als/als.schema';
import { ZodCustomError } from '@src/exception/zod.error';
import { ERROR_CONSTANTS } from '@src/error/error.constants';
import { CacheService } from '@src/cache/cache.service';
import { ELASTICACHE, UPSTASH } from '@src/cache/cache.type';

import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AppService {
  constructor(
    private readonly als: AsyncLocalStorage<AlsContext>,
    private readonly cacheService: CacheService,
  ) {
    this.cacheService.setProvider(UPSTASH);
  }

  async getHello(): Promise<string> {
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

    await this.cacheService.set('key', 'value', 20);
    const cachedRes = await this.cacheService.get('key');
    console.log(cachedRes);

    this.cacheService.setProvider(ELASTICACHE);
    this.cacheService.setProvider(UPSTASH);

    await this.cacheService.set('key', 'value', 20);
    const cachedRes2 = await this.cacheService.get('key');
    console.log(cachedRes2);

    return 'Hello World!';
  }
}

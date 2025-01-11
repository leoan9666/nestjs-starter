import { Inject, Injectable } from '@nestjs/common';

import { AlsContext } from '@src/als/als.type';
import { AlsSchema } from '@src/als/als.schema';
import { ZodCustomError } from '@src/exception/zod.error';
import { ERROR_CONSTANTS } from '@src/error/error.constants';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';
import { DATABASE_CLIENT } from '@src/db/database.provider';
import { DB } from '@src/db/db';

import { AsyncLocalStorage } from 'async_hooks';
import { Kysely } from 'kysely';

@Injectable()
export class AppService {
  private readonly cache: TCacheService;

  constructor(
    private readonly als: AsyncLocalStorage<AlsContext>,
    private readonly cacheService: CacheService,
    @Inject(DATABASE_CLIENT) private readonly db: Kysely<DB>,
  ) {
    this.cache = this.cacheService.createCacheService();
  }

  async getHello(): Promise<string> {
    const rows = await this.db
      .selectFrom('account')
      .selectAll()
      .executeTakeFirstOrThrow();
    console.log(rows);

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

    await this.cache.set('key', 'value', 20);
    const cachedRes = await this.cache.get('key');

    return `Hello World! ${cachedRes}`;
  }
}

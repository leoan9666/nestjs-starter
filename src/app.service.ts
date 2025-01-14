import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AlsContext } from '@src/als/als.type';
import { AlsSchema } from '@src/als/als.schema';
import { ZodCustomError } from '@src/exception/zod.error';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';
import { DATABASE_CLIENT } from '@src/db/database.provider';
import { DB } from '@src/db/db';
import { AppConfigService } from '@src/appConfig/appConfig.service';
import {
  AWS_APP_CONFIG_NAME,
  AwsAppConfig,
} from '@src/config/env/awsAppConfig/awsAppConfig.config';

import { AsyncLocalStorage } from 'async_hooks';
import { Kysely } from 'kysely';
import { AwsAppConfigSchema } from '@src/app.validate';

@Injectable()
export class AppService {
  private readonly cache: TCacheService;
  private readonly awsAppConfig: AwsAppConfig;

  constructor(
    private readonly als: AsyncLocalStorage<AlsContext>,
    private readonly cacheService: CacheService,
    private readonly appConfigService: AppConfigService,
    private readonly configService: ConfigService,
    @Inject(DATABASE_CLIENT) private readonly db: Kysely<DB>,
  ) {
    this.cache = this.cacheService.createCacheService();
    this.awsAppConfig =
      this.configService.get<AwsAppConfig>(AWS_APP_CONFIG_NAME)!;
  }

  async getHello(): Promise<string> {
    // const rows = await this.db
    //   .selectFrom('account')
    //   .selectAll()
    //   .executeTakeFirstOrThrow();
    // console.log(rows);

    const result = AlsSchema.safeParse(this.als.getStore());

    if (!result.success) {
      console.error('Invalid ALS Context:', result.error.errors);
      throw new ZodCustomError({ errors: result.error.errors });
    }

    const appConfigRes = await this.appConfigService.getConfiguration(
      this.awsAppConfig.applicationID,
      this.awsAppConfig.environmentID,
      'App Profile',
    );

    const appConfigValidated = AwsAppConfigSchema.safeParse(appConfigRes);
    if (!appConfigValidated.success) {
      console.error('Invalid ALS Context:', appConfigValidated.error.errors);
      throw new ZodCustomError({ errors: appConfigValidated.error.errors });
    }

    const accoundID = result.data.accountID;
    const correlationID = result.data.correlationID;
    console.log(`accoundID: ${accoundID}`);
    console.log(`correlationID: ${correlationID}`);

    await this.cache.set('key', 'value', 20);
    let cachedRes = await this.cache.get('key');
    const roles = this.als.getStore()?.account!.roles as string[];

    if (
      appConfigValidated.data['is-admin'].enabled &&
      roles.includes('admin')
    ) {
      cachedRes = `admin: ${cachedRes}`;
    }

    return `Hello World! ${cachedRes}`;
  }
}

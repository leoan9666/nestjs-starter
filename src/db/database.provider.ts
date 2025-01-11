import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import {
  DATABASE_CONFIG_NAME,
  DatabaseConfig,
} from '@src/config/env/database/database.config';
import { DB } from '@src/db/db';

import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

@Injectable()
export class DatabaseProvider {
  constructor(private readonly configService: ConfigService) {}

  async getKyselyClient() {
    const pool = new Pool({
      connectionString:
        this.configService.get<DatabaseConfig>(DATABASE_CONFIG_NAME)?.url,
    });

    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: pool,
      }),
    });
  }
}

export const DATABASE = 'DATABASE';

export const databaseProvider = {
  provide: DATABASE,
  useFactory: async (databaseProvider: DatabaseProvider) => {
    return databaseProvider.getKyselyClient();
  },
  inject: [DatabaseProvider], // Inject the DatabaseProvider to resolve dependencies
};

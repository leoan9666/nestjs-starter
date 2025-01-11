import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';

import { DATABASE_CLIENT } from '@src/db/database.provider';
import { DatabaseModule } from '@src/db/database/database.module';
import { DB } from '@src/db/db';

import { Kysely } from 'kysely';

@Module({
  imports: [DatabaseModule],
})
export class AppShutdownHandlerModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: Kysely<DB>) {}

  async onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
    await this.db.destroy();
  }
}

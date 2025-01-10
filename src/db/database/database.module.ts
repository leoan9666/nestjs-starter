import { Module } from '@nestjs/common';

import { DatabaseProvider, databaseProvider } from '@src/db/database.provider';

@Module({
  providers: [DatabaseProvider, databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}

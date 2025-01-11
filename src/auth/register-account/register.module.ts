import { Module } from '@nestjs/common';

import { RegisterController } from '@src/auth/register-account/register.controller';
import { RegisterService } from '@src/auth/register-account/register.service';
import { DatabaseModule } from '@src/db/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}

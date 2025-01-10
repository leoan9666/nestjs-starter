import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@src/auth/auth.controller';
import { AuthService } from '@src/auth/auth.service';
import { SessionAuthGuard } from '@src/auth/guard/session-auth.guard';
import { LocalStrategy } from '@src/auth/passportjs/passport-local.strategy';

@Module({
  imports: [PassportModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionAuthGuard,
    },
    AuthService,
    LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

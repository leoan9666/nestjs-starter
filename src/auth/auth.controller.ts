import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '@src/auth/auth.service';
import { LocalAuthGuard } from '@src/auth/guard/local-auth.guard';
import { PublicRoute } from '@src/auth/set-public.metadata';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';

import { v7 as uuidv7 } from 'uuid';

@Controller('auth')
export class AuthController {
  private readonly cache: TCacheService;

  constructor(private readonly cacheService: CacheService) {
    this.cache = this.cacheService.createCacheService();
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    // Session token will be handled by passport session strategy
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;

    const sessionID = uuidv7();
    const userID = `userID:${req.user.sub}`;

    const data = {
      sessionID,
      userID: req.user.sub,
      roles: req.user.roles,
    };
    req.session.user = data;

    const previousSessionID = await this.cache.get(userID);
    if (previousSessionID) {
      await this.cache.del(previousSessionID);
    }
    await this.cache.set(`sessionID:${sessionID}`, userID);
    await this.cache.set(userID, `sessionID:${sessionID}`);

    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req) {
    const sessionIDKey = `sessionID:${req.session.user.sessionID}`;
    const userID = await this.cache.get(sessionIDKey);
    await this.cache.del(sessionIDKey);

    if (userID) {
      await this.cache.del(userID);
    }
    req.session.destroy();
  }
}

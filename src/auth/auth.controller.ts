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

  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.cache = this.cacheService.createCacheService();
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    // Session token will be handled by passport session strategy
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;

    const sessionID = uuidv7();
    const userID = req.user.sub;

    req.session.user = { sessionID };
    await this.cache.set(`sessionID:${sessionID}`, userID);

    const data = {
      sessionID,
      roles: req.user.roles,
    };
    await this.cache.set(`userID:${userID}`, JSON.stringify(data));

    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req) {
    const sessionIDKey = `sessionID:${req.session.user.sessionID}`;
    const userID = await this.cache.get(sessionIDKey);
    await this.cache.del(sessionIDKey);
    await this.cache.del(`userID:${userID}`);
    req.session.destroy();
  }
}

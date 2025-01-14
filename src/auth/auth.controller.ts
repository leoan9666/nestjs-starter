import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from '@src/auth/guard/local-auth.guard';
import { PublicRoute } from '@src/auth/set-public.metadata';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';

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

    if (
      req.session?.account &&
      req.session.account.accountID !== req.user.sub
    ) {
      await this.cache.del(`accountID:${req.session.account.accountID}`);
    }

    req.session.account = {
      accountID: parseInt(req.user.sub, 10),
      roles: req.user.roles,
    };

    await this.cache.set(`accountID:${req.user.sub}`, `sess:${req.session.id}`);

    return { message: 'Login successful', account: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req) {
    await this.cache.del(`accountID:${req.session.account.accountID}`);
    req.session.destroy();
  }
}

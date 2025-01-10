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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    // Session token will be handled by passport session strategy
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
    req.session.user = req.user;

    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req) {
    return req.session.destroy();
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@src/auth/auth.service';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    const account = await this.authService.validateAccount(username, password);
    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }
}

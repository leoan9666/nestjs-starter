import { Injectable } from '@nestjs/common';
import { CacheService } from '@src/cache/cache.service';
import { TCacheService } from '@src/cache/cache.type';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor() {}

  // Validate username and password
  async validateUser(email: string, password: string): Promise<any | null> {
    // const user = await this.userRepository.findOne({ where: { email } });

    // if (user && (await bcrypt.compare(password, user.password))) {
    //   return user;
    // }
    // return null;

    return { sub: 1, roles: ['admin'] };
  }

  // Create session token logic (optional)
  async createSessionToken(user: any) {
    // You can also create a JWT token here, or just rely on session.
    return user;
  }
}
